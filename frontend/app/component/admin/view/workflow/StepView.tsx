import { StepDTO } from 'app/controller/model/workflow/stepDTO'
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import React, { useRef, useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
import EditFile from '../doc/document/edit/document-edit-file-admin.component'
import { DocumentDto } from 'app/controller/model/Document.model'
import useListHook from 'app/component/zyhook/useListhook'
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model'
import { stepService } from 'app/controller/service/workflow/stepService'
import { set } from 'date-fns'
import { el } from 'date-fns/locale'
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO'


type Props = {
  step?: StepDTO
  workflow: WorkflowDTO;

}

interface DocumentViewerProps {
  loading: boolean;
  error: boolean;
  documentBase64: string[];
  numPages: number;
  pageNumber: number;
  onPageChange: (pageNumber: number) => void;
  setNumPages: (numPages: number) => void;
}

const StepView = ({ step , workflow}: Props) => {
  const [visibleWFDes, setvisibleWFDes] = useState(false);
  const showWFDescriptionDialog = () => setvisibleWFDes(true);
  const hideWFDescriptionDialog = () => setvisibleWFDes(false);
  const documentAdminService = new DocumentAdminService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [documentBase64, setDocumentBase64] = useState<any[]>([]);
  const toast = useRef<Toast>(null);
  const [viewDocument, setViewDocument] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const service = new DocumentAdminService();
  const emptyItem = new DocumentDto();
  const emptyCriteria = new DocumentCriteria();
  const [currentStep, setCurrentStep] = useState<StepDTO | null>(null); // Track current step

  const refresh = () => {
  };
  const { items, update } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t, refresh });


  const docEdited = (document: DocumentDto) => {
    if (step) {
      step.documentsActions?.push(document);
        stepService.updateStepDocument(step).then(() => {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Document ajouté avec succès', life: 3000 });
        }).catch(() => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une erreur s est produite lors de l ajout du document', life: 3000 });
        });

    }
};



  const onPageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  function truncateText(text: any, length = 10) {
    if (text === undefined || text === null) {
      return ""; // Or return a default message or handle the error as you see fit.
    }
  
    return text.length > length ? (
      <div>
        {`${text.substring(0, length)}...  `}
      </div>
    ) : (
      text
    );
  }
  

  const ViewDocument = () => {
    if(viewDocument){
      setViewDocument(false);
    }else{
      setViewDocument(true);}
    }

  const getDocumentBase64 = (index: number) => {
    setLoading(true);
    documentAdminService.getDocumentBase64(index)
      .then(({ data }) => {
        setDocumentBase64(data);
      })
      .catch((error) => {
        setError(true);
        // MessageService.showError(toast.current, "Error!", "Une erreur s'est produite lors de la récupération du document");

      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [showDialogEditFile, setShowDialogEditFile] = useState(false);
  const [docSlectedFTable, setDocSlectedFTable] = useState<DocumentDto>();
  const showEditFileModal = () => {
      setShowDialogEditFile(true);
  }



  const DocumentViewer: React.FC<DocumentViewerProps> = ({ loading, error, documentBase64, numPages, pageNumber, onPageChange, setNumPages }) => {
    return (
      <>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ProgressSpinner />
          </div>
        )}
        {error && (
          <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
        )}
        {!loading && !error && documentBase64 && (
          <div>
            {numPages > 1 && (
              <div className="mb-3">
                <p>Page {pageNumber} of {numPages}</p>
                <Button
                  raised
                  label="Previous"
                  className="mr-5 w-2"
                  onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber === 1}
                />
                <Button
                  raised
                  label="Next"
                  className="mr-2 w-2"
                  onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber === numPages}
                />
              </div>
            )}
            <div style={{ width: "100%", height: 920, padding: "50px" }}>
              <iframe src={`data:application/pdf;base64,${documentBase64}`} width="100%" height="100%" title="document" />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div >
      <Toast ref={toast} />
      <span className='text-blue-700 font-bold my-3 '> Informations :</span>
      <Card className=" mt-1 mb-3">
        <div className='flex justify-content-between align-content-start flex-wrap'>

          <div className="flex  ">
            <label htmlFor="title" className=" text-black-alpha-80 font-bold"> Titre : </label>
            <p id="reference"> {step?.stepPreset.title } </p>
          </div>
          <div className=" flex">
            <label htmlFor="description" className=" text-black-alpha-80 font-bold"> {t("workflow.Description")}: </label>
            <p onClick={showWFDescriptionDialog} >{truncateText(step?.stepPreset.description, 10)}</p>
            <Dialog header="Description" visible={visibleWFDes} style={{ width: '50vw' }} onHide={hideWFDescriptionDialog}>
              <p>{step?.stepPreset.description}</p>
            </Dialog>
          </div>
          <div className="flex  ">
            <label htmlFor="title" className=" text-black-alpha-80 font-bold"> Destinataire : </label>
            <p >{step?.stepPreset.destinataires?.[0]?.utilisateur.nom} {step?.stepPreset.destinataires?.[0]?.utilisateur.prenom}</p>
          </div>
          <div className="flex  ">
            <label htmlFor="title" className="  text-black-alpha-80 font-bold"> {t("workflow.flag")} : </label>
            <Tag className='' value={step?.status} severity={step?.status === 'WAITING' ? 'danger' : 'info'}></Tag>
          </div>
          <div className="flex ">
            <label htmlFor="title" className=" text-black-alpha-80 font-bold">  {t("workflow.status")}: </label>
            <Tag className='' severity={'info'}> {step?.stepPreset.level}</Tag>
          </div>
        </div>
      </Card>
      <Divider />
      
      {step?.documentsActions && step.documentsActions.length > 0 &&
      
        <div>
                      <div className='mb-2'>
                      <span className=' text-blue-700 font-bold'> Document :</span>
                      </div>

          <DataTable    value={step.documentsActions} paginator rows={5} className='w-full'>
            <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
            <Column field="planClassement.libelle" header="Plan Classement" sortable />
            <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
            <Column header="Actions" body={(rowData) => (
              <>
                <Button icon="pi pi-eye" severity='help' onClick={(e) => {
                  ViewDocument();
                  getDocumentBase64(rowData.id)
                }}  />
                  {/* {workflow.status==='OPEN' &&
                    <Button icon="pi pi-file-edit"    severity='warning' onClick={(e) => {
                      showEditFileModal() ;
                     setDocSlectedFTable(rowData)
                   }} className='ml-2' />
                  } */}
          


              </>
            )} />
          </DataTable>
          {viewDocument && (
            <DocumentViewer
              loading={loading}
              error={error}
              documentBase64={documentBase64}
              numPages={numPages}
              pageNumber={pageNumber}
              onPageChange={onPageChange}
              setNumPages={setNumPages}
            />

          )}
        </div>
        
      }

{showDialogEditFile && <EditFile visible={showDialogEditFile} onClose={() => {
                    setShowDialogEditFile(false);
                }} showToast={toast} selectedItem={docSlectedFTable as DocumentDto} service={service} update={update} list={items}
                    t={t} onDocumentSave={docEdited} />}





    </div>
  )
}

export default StepView