import axiosInstance from "app/axiosInterceptor";
import { DocumentDto } from "app/controller/model/Document.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { t } from "i18next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useRef, useState } from "react";
import { useDebounce } from "react-use";

interface Props {
    selectedDocuments: DocumentDto[];
    setSelectedDocuments: (document: DocumentDto[]) => void;
    setDocumentToPreview?: (document: DocumentDto | null) => void;
}
const ImportDocumentsFromGed = ({ selectedDocuments, setSelectedDocuments, setDocumentToPreview }: Props) => {

    const overlayPanelDocuments = useRef(null);

    const service = new DocumentAdminService();

    const [documents, setDocuments] = useState<DocumentDto[]>([]);
    const [dataSize, setDataSize] = useState<Number>(0);

    const [loading, setLoading] = useState(false);

    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
    const getDocument = () => {
        if (connectedUser.id !== 0) {
            const requestBody = {
                entiteAdministrative: {
                    id: connectedUser.entiteAdministrative.id
                },
                maxResults: onRows,
            };
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody)
                .then(response => {
                    setDocuments(response.data.list);
                    setDataSize(response.data.dataSize);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }
    const [start, setStart] = useState(0);
    const [onRows, setOnRows] = useState(5);
    const nextPageDocument = async (event: PaginatorPageChangeEvent) => {
        if (connectedUser.id !== 0) {
            const requestBody = {
                entiteAdministrative: {
                    id: connectedUser.entiteAdministrative.id
                },
                maxResults: event.rows,
                page: event.page,
                referenceLike: globalFilter
            };
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody)
                .then(response => {
                    setDocuments(response.data.list);
                    setDataSize(response.data.dataSize);
                    setStart(event.first);
                    setOnRows(event.rows);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }

    const removeDocumentFromSelection = (document: DocumentDto) => {
        const updatedSelection = selectedDocuments.filter(item => item !== document);
        setSelectedDocuments(updatedSelection);
    };

    const [globalFilter, setGlobalFilter] = useState('');
    const handleSearch = () => {
        setLoading(true);
        setStart(0);
        const requestBody = {
            entiteAdministrative: {
                id: connectedUser.entiteAdministrative.id
            },
            maxResults: onRows,
            referenceLike: globalFilter
        };
        axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody)
            .then(response => {
                setDocuments(response.data.list);
                setDataSize(response.data.dataSize);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error)
                setLoading(false);
            });
    };
    useDebounce(() => {
        handleSearch()
    }, 1000, [globalFilter]);

    return (
        <>
            <div className="flex justify-content-end mb-2">
                <Button
                    raised label="Importer"
                    icon="pi pi-angle-down"
                    severity='help'
                    className="w-3"
                    onClick={(e) => {
                        getDocument();
                        (overlayPanelDocuments.current as any)?.toggle(e)
                    }}
                />
            </div>
            <OverlayPanel ref={overlayPanelDocuments} showCloseIcon dismissable={false}>
                <DataTable
                    value={documents}
                    selectionMode="multiple"
                    selection={selectedDocuments}
                    onSelectionChange={(e) => setSelectedDocuments(e.value as DocumentDto[])}
                    onRowClick={(e) => { (overlayPanelDocuments.current as any)?.hide() }}
                    loading={loading}
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">{t("document.header", { totalRecords: dataSize })}</h5>
                            <div className="flex flex-row">
                                <span className="block mt-2 ml-3 md:mt-0">
                                    <InputText
                                        type="search"
                                        onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                        placeholder={t("search")}
                                    />
                                </span>
                            </div>
                        </div>
                    }>
                    <Column selectionMode="multiple" style={{ width: '3em' }} />
                    <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                    <Column field="planClassement.libelle" header="Plan Classement" sortable />
                    <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                </DataTable>
                <div className="p-d-flex p-ai-center p-jc-between">
                    <Paginator onPageChange={nextPageDocument} first={start} rows={onRows} totalRecords={(dataSize as number) || 0} />
                </div>
            </OverlayPanel>

            <DataTable
                value={selectedDocuments}
                paginator rows={5}
                className='w-full'
                selectionMode="single"
                onSelectionChange={(e) => {
                    let selectedDocument = e.value as DocumentDto; // Asserting that e.value is a DocumentDto
                    if(setDocumentToPreview) setDocumentToPreview(selectedDocument);
                }}
            >
                <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                <Column field="planClassement.libelle" header="Plan Classement" sortable />
                <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                <Column header="Actions" body={(rowData: DocumentDto) => (
                    <Button icon="pi pi-times" onClick={() =>{ 
                        removeDocumentFromSelection(rowData); 
                        if(setDocumentToPreview) setDocumentToPreview(null)
                    }} />
                )} />
            </DataTable>
        </>
    );
};

export default ImportDocumentsFromGed;