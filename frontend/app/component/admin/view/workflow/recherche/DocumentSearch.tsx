import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { DocumentDto } from 'app/controller/model/Document.model';
import { searchDocuments, PaginatedResponse } from './api';
import DocumentDetailsDialog from './DocumentDetailsDialogue';
import FileViewer from 'app/component/admin/view/doc/document/preview/FileViewer';
import { Dialog } from 'primereact/dialog';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

interface TabState {
  page: number;
  size: number;
  data: PaginatedResponse<DocumentDto> | null;
}

const useDocumentSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [tabStates, setTabStates] = useState<Record<string, TabState>>({
    'Reference': { page: 0, size: 10, data: null },
    'Signature Code': { page: 0, size: 10, data: null },
    'Index Element': { page: 0, size: 10, data: null },
    'Comission': { page: 0, size: 10, data: null },
    'Parapheur': { page: 0, size: 10, data: null },
    'Comission Step': { page: 0, size: 10, data: null },
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  useDebounce(
    () => {
      setDebouncedKeyword(keyword);
    },
    300,
    [keyword]
  );

  const invalidateAllSearchQueries = useCallback(() => {
    Object.keys(tabStates).forEach((tabName) => {
      queryClient.invalidateQueries({
        queryKey: ['documentsSearch'],
        type: 'all'
      });
      queryClient.removeQueries({
        queryKey: ['documentsSearch', tabName],
      });
    });
  }, [queryClient, tabStates]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      invalidateAllSearchQueries();
    }, 40000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current); 
      }
    };
  }, [debouncedKeyword, tabStates, queryClient]);

  const tabQueries = useQueries({
    queries: Object.entries(tabStates).map(([tabName, state]) => ({
      queryKey: ['documentsSearch', tabName, debouncedKeyword, state.page, state.size],
      queryFn: () => searchDocuments({ keyword: debouncedKeyword, page: state.page, size: state.size }),
      enabled: !!keyword,
    })),
  });

  const handleSearch = useCallback(() => {
    setTabStates(prevStates =>
      Object.fromEntries(
        Object.entries(prevStates).map(([key, value]) => [key, { ...value, page: 0, data: null }])
      )
    );
  }, []);

  const handlePageChange = (e: PaginatorPageChangeEvent, tabName: string) => {
    setTabStates(prevStates => ({
      ...prevStates,
      [tabName]: { ...prevStates[tabName], page: e.page, size: e.rows }
    }));
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedKeyword, handleSearch]);

  return {
    keyword,
    setKeyword,
    tabStates,
    setTabStates,
    tabQueries,
    handleSearch,
    handlePageChange,
  };
};

const DocumentSearch: React.FC = () => {
  const {
    keyword,
    setKeyword,
    tabStates,
    tabQueries,
    handlePageChange,
  } = useDocumentSearch();

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDto | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [viewDocument, setViewDocument] = useState(false);
  const [documentBeingViewed, setDocumentBeingViewed] = useState<DocumentDto | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleTabChange = (e: { index: number }) => {
    setActiveIndex(e.index);
  };

  const handleViewDocument = (document: DocumentDto) => {
    setDocumentBeingViewed(document);
    setViewDocument(true);
  };

  const handleShowDetails = (document: DocumentDto) => {
    setSelectedDocument(document);
    setShowDetailsDialog(true);
  };

  const renderDocumentCard = (document: DocumentDto) => (
    <div className="col-12 md:col-6 lg:col-4 xl:col-3 p-2" key={document?.id}>
      <Card className="h-full transition-all transition-duration-300 hover:shadow-5">
        <div className="flex flex-column justify-content-between h-full">
          <div>
            <h3 className="text-xl font-bold mb-2 text-overflow-ellipsis overflow-hidden white-space-nowrap" title={document?.reference}>
              {document?.reference}
            </h3>
            <p className="mb-1 text-overflow-ellipsis overflow-hidden white-space-nowrap" title={`Reference GED: ${document?.referenceGed}`}>
              Reference GED: {document?.referenceGed}
            </p>
            <p className="mb-1 text-overflow-ellipsis overflow-hidden white-space-nowrap" title={`Document ID: ${document?.id}`}>
              Document ID: {document?.id}
            </p>
            <p className="text-overflow-ellipsis overflow-hidden white-space-nowrap" title={`Signature Code: ${document?.documentSignatureCode}`}>
              Signature Code: {document?.documentSignatureCode || 'N/A'}
            </p>
          </div>
          <div className="flex justify-content-end mt-3 gap-2">
            <Button label="View" className="p-button-secondary p-button-sm" onClick={() => handleViewDocument(document)} />
            <Button label="Details" className="p-button-info p-button-sm" onClick={() => handleShowDetails(document)} />
          </div>
        </div>
      </Card>
    </div>
  );

  const isLoading = tabQueries.some(query => query.isLoading);
  const isError = tabQueries.some(query => query.isError);
  const hasNoResults = keyword.trim() !== '' && !isLoading && !isError && tabQueries.every(query => !query.data || Object.values(query.data).every(tab => !tab.content || tab.content.length === 0));

  const visibleTabs = tabQueries
    .map((query, index) => {
      const tabName = Object.keys(tabStates)[index];
      const tabData = query.data?.[tabName] as PaginatedResponse<DocumentDto> | undefined;
      return {
        tabName,
        tabData,
        query,
      };
    })
    .filter(({ tabData }) => tabData && tabData.content && tabData.content.length > 0);

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-4">Recherche de documents</h1>
      <div className="p-fluid mb-4">
        <div className="col-12">
          <InputText
            placeholder="Search documents..."
            value={keyword}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <ProgressSpinner />
        </div>
      )}
      
      {isError && (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center text-red-500">Une erreur est survenue.</div>
        </div>
      )}
      
      {!isLoading && !isError && keyword.trim() === '' && (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <i className="pi pi-search" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p className="text-xl">Veuillez saisir un mot-clé pour effectuer une recherche.</p>
          </div>
        </div>
      )}
      
      {hasNoResults && (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <i className="pi pi-info-circle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p className="text-xl">Aucun document trouvé pour votre recherche.</p>
          </div>
        </div>
      )}
      
      {!isLoading && !isError && !hasNoResults && keyword.trim() !== '' && (
        <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
          {visibleTabs.map(({ tabName, tabData }) => (
            <TabPanel key={tabName} header={tabName}>
              {tabData && tabData.content && (
                <>
                  <div className="grid">
                    {tabData.content.map((document: DocumentDto) => renderDocumentCard(document))}
                  </div>
                  <Paginator
                    first={tabData.number * tabData.size}
                    rows={tabData.size}
                    totalRecords={tabData.totalElements}
                    onPageChange={(e) => handlePageChange(e, tabName)}
                    className="mt-4"
                  />
                </>
              )}
            </TabPanel>
          ))}
        </TabView>
      )}

      <DocumentDetailsDialog
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        document={selectedDocument}
      />

      <Dialog
        header="Document"
        visible={viewDocument}
        style={{ width: 'max-content', minWidth: '30vw', maxWidth: '90vw', height: '90vh', overflow: 'auto' }}
        onHide={() => setViewDocument(false)}
      >
        {viewDocument && documentBeingViewed && (
          <div className="flex justify-content-center align-items-center m-3">
            <FileViewer
              documentId={documentBeingViewed.id}
              twoPages={false}
              className="w-full"
            />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default DocumentSearch;