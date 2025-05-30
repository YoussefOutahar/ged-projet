import axiosInstance from 'app/axiosInterceptor';
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import BasicDemo from 'app/component/admin/view/doc/document/editor/BasicDemo'
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import { DocumentSummaryDto } from 'app/controller/model/DocumentSummary.model';
import { DocumentIndexElementSummaryDto } from 'app/controller/model/DocumentIndexElementSummary.model';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import FileViewer from '../doc/document/preview/FileViewer';
import OtpProcess, { OtpProcessHandles, OtpType } from 'app/component/otp/otp_process';
import { doc, util } from 'prettier';
import { associateDocumentType, getDocumentTypeFromFileUrl } from 'app/utils/documentUtils';
import useDocTypeStore from 'Stores/DocumentTypeStore';
import { ACTION } from 'app/controller/model/workflow/stepDTO';

type Props = {
    onDocumentSave: (document: DocumentDto[]) => void; // Callback function to return saved document to parent component
    workflow: WorkflowDTO;
    onCancel? : ()=> void;
    disabled?: boolean;
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
type SeverityType = 'success' | 'info' | 'warn' | 'error';
const AjouterDocument = ({ onDocumentSave, workflow , onCancel, disabled=false}: Props) => {

    const otpRef = React.useRef<OtpProcessHandles>(null);

    const [visibleDDT, setvisibleDDT] = useState(false);
    const toast = useRef<Toast>(null);
    const documentAdminService = new DocumentAdminService();
    const authService = new AuthService();
    const utilisateurService = new UtilisateurAdminService();
    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
    const [loading, setLoading] = useState(false);
    const [documentIdToView, setDocumentIdToView] = useState<number>();
    const [loadinA, setLoadingA] = useState(false);
    const [viewDocs, setViewDocs] = useState<boolean>(false);
    const fileUploadRef = useRef(null);
    const [files, setFiles] = useState<any[]>();
    const [document, setDocument] = useState<DocumentDto>(new DocumentDto());
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
    const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    const overlayPanelDocuments = useRef(null);
    const [documents, setDocuments] = useState<DocumentDto[]>([]);
    const [onRows, setOnRows] = useState(5);
    const [dataSize, setDataSize] = useState<Number>(0);
    const [selectDocumentWorkflow, setSelectDocumentWorkflow] = useState<DocumentDto[]>([]);
    const [DocumentEditeur, setDocumentEditeur] = useState<DocumentDto[]>([]);

    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);

    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    const utilisateurAdminService = new UtilisateurAdminService();

    useEffect(() => {
        documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
        entiteAdministrativeAdminService.getList().then(({ data }) => setEntiteAdministratives(data)).catch(error => console.log(error));
        utilisateurAdminService.getList().then(({ data }) => {
            setUtilisateurs(data);
        }).catch(error => console.log(error));
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
            .then(response => setPlans(response.data))
            .catch(error => console.error('Error loading plans', error));

    }, [])

    const getDocument = () => {
        if (connectedUser.id !== 0) {
            const requestBody = {
                utilisateur: {
                    id: connectedUser.id
                },
                documentState : {
                    id: 6
                },
                maxResults: onRows,
            };
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody)
                .then(response => {
                    setDocuments(response.data.list);
                    setDataSize(response.data.dataSize);
                })
                .catch(error => console.error('Error fetching document:', error));
        }
    }
    const ImporterDocument = () => {
        setuploadFromGed(true);
        setuploadLocaly(false);
        settextEditor(false);
        sethideCreatDocS(false);
    }
    const [hideCreatDocS, sethideCreatDocS] = useState<boolean>(false);
    const handlecreateDocS = () => {
        settextEditor(true);
        setuploadLocaly(false);
        setuploadFromGed(false);
        sethideCreatDocS(true);
    };
    useEffect(() => {
        const connectedUserName = authService.getUsername();
        if (connectedUserName) {
            const utilisateurCriteria = new UtilisateurCriteria();
            utilisateurCriteria.username = connectedUserName;
            utilisateurService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
                const user = data?.list[0];
                if (user) {
                    setConnectedUser(user);
                }
            });
        }
    }, []);

    const { documentTypes, documentType } = useDocTypeStore(state => ({ documentTypes: state.types, documentType: state.type }));

    const handleFileUpload = async (e: any) => {
        const files = e.files;
        setFiles(files);
        document.reference = files[0].name;
        document.entiteAdministrative = connectedUser.entiteAdministrative;
        const fileUrl = e.files && e.files[0];
        const docType = await associateDocumentType(fileUrl,  documentTypes);
        if (docType) {
            setDocument({ ...document, documentType: docType });   
        }
        setFilesUploadedWF(true);
        setDisableSaveButton(false);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `${files.length}fichier(s) chargé(s) avec succès`, life: 3000 });
    };

    useEffect(() => {
        setDocument({ ...document, utilisateur: connectedUser , entiteAdministrative: connectedUser.entiteAdministrative });
    }, [connectedUser]);

    const  handleFileSelect = (e: any) => {
        setDisableSaveButton(true);
    }

    const handleRemoveBeforeUpload = (e: any) => {      
        setDisableSaveButton(false);
    }

    const handleRemoveAfterUpload = () => {
        setDisableSaveButton(false);
    }

    const toDocumentSummary = (item: DocumentDto) => {
        const itemSummary = new DocumentSummaryDto();
        itemSummary.reference = item.reference;
        itemSummary.description = item.description;
        itemSummary.colonne = item.colonne;
        itemSummary.ligne = item.ligne;
        itemSummary.numBoite = item.numBoite;
        itemSummary.size = item.size;
        itemSummary.uploadDate = item.uploadDate.toString();
        itemSummary.documentStateId = item.documentState?.id;
        itemSummary.documentTypeId = item.documentType?.id;
        itemSummary.documentCategorieId = item.documentCategorie?.id;
        itemSummary.entiteAdministrativeId = item.entiteAdministrative.id || connectedUser!.entiteAdministrative.id;
        itemSummary.planClassementId = item.planClassement.id;
        itemSummary.utilisateurId = item.utilisateur.id || connectedUser!.id;
        itemSummary.utilisateurEmail = item.utilisateur.email || connectedUser!.email;

        return itemSummary;
    }
    const ajouterDocumentV2Masse = () => {
        setLoadingA(true);
        const documentDtos: DocumentDto[] = [];
        if (selectDocumentWorkflow.length > 0) {
            selectDocumentWorkflow.forEach((doc) => {
                documentDtos.push(doc);
            });
            setvisibleDDT(false);
            setLoadingA(false);
            onDocumentSave(documentDtos);
        }
        const form = new FormData();

        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file instanceof Blob) {
                    form.append('files', file);
                }
            })
            const documentSummary = toDocumentSummary(document);
            form.append('documentDTO', JSON.stringify(documentSummary));

            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-files`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((responses) => {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Opération faite avec success', life: 3000 });
                    setvisibleDDT(false);
                    onDocumentSave(responses.data);
                    setLoadingA(false);
                })
                .catch((error) => {
                    console.error('Erreur lors de la résolution des requêtes:', error);
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Erreur lors de l\'ajout des documents', life: 3000 });
                });
        }
        if (DocumentEditeur.length > 0) {
            DocumentEditeur.forEach((doc) => {
                documentDtos.push(doc);
            });
            setvisibleDDT(false);
            setLoadingA(false);
            onDocumentSave(documentDtos);
        }
        if(! (files && files.length > 0) && !(DocumentEditeur.length > 0) && !(selectDocumentWorkflow.length > 0)){
            setLoadingA(false);
            onDocumentSave([]);
        }
    };
    const [filesUploadedWF, setFilesUploadedWF] = useState(false);
    const getPlanCreation = async (categorieLibelle: string, workflowTitle: string) => {
        const plans = [{ libelle: categorieLibelle }, { libelle: workflowTitle }, { libelle: 'CE' }];
        const stepEvaluateurs = workflow.stepDTOList?.find(step => step.stepPreset.level === 1);
        if (stepEvaluateurs) {
            const destinataireIndex = stepEvaluateurs.stepPreset.destinataires?.findIndex(dest => dest.utilisateur.id === connectedUser.id).toString();
            const ev = "EV" + destinataireIndex + "-" + connectedUser.nom + "-" + connectedUser.prenom;
            plans.push({ libelle: ev });
        }
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/multiple`, plans);
            document.planClassement = response.data;
            setDocument({ ...document });
        } catch (error) {
            console.error('Error submitting plans', error);
        }
    }
    const onCategorieChangeDoc = async (e: DropdownChangeEvent, field: string) => {
        document.documentCategorie = e.value;
        setDocument({ ...document });
        await getPlanCreation(e.value.libelle, workflow.title || `${e.value.libelle}-workflow`);
    };

    const onDropdownChangeDoc = (e: DropdownChangeEvent, field: string) => {
        setDocument((prevState) => ({ ...prevState, [field]: e.value }));
    };
    const onEntiteAdministrativeChange = (e: DropdownChangeEvent, field: string) => {
        const selectedEntiteAdministrative = entiteAdministratives.find(entite => entite.libelle === e.value);
        setDocument((prevState) => ({ ...prevState, [field]: selectedEntiteAdministrative }));
    };
    const onInputDateChangeDoc = (e: CalendarChangeEvent, name: string) => {
        const value = (e.value) || "";
        setDocument({ ...document, [name]: value });
    };
    const [selectDocument, setSelectDocument] = useState<DocumentDto[]>([]);
    const removeDocumentFromSelection = (document: DocumentDto) => {
        const updatedSelection = selectDocument.filter(item => item !== document);
        setSelectDocument(updatedSelection);
    };
    const removeDocumentFromSelectionWF = (document: DocumentDto) => {
        const updatedSelection = selectDocumentWorkflow.filter(item => item !== document);
        setSelectDocumentWorkflow(updatedSelection);
    };
    const [globalFilter, setGlobalFilter] = useState('');

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: dataSize })}</h5>
            <span className="block mt-2 ml-3 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );

    const [uploadLocaly, setuploadLocaly] = useState<boolean>(true);
    const [uploadFromGed, setuploadFromGed] = useState<boolean>(false);
    const [textEditor, settextEditor] = useState<boolean>(false);
    const AjouterDocumentD = () => {
        setuploadLocaly(true);
        setuploadFromGed(false);
        settextEditor(false);
        sethideCreatDocS(false);
    }

    const [start, setStart] = useState(0);
    const nextPageDocument = async (event: PaginatorPageChangeEvent) => {
        if (connectedUser.id !== 0) {
            const requestBody = {
                utilisateur: {
                    id: connectedUser.id
                },
                documentState : {
                    id: 6
                },
                maxResults: event.rows,
                page: event.page,
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

    const [viewDocument, setViewDocument] = useState(false);
    function actionTemplate(rowData: DocumentDto) {
        return (

            <div className=''>
                <React.Fragment>
                    <Button icon="pi pi-eye" onClick={(e) => {
                        setViewDocument(true);
                        setDocumentIdToView(rowData.id)
                    }} severity='secondary' />
                    <Button className='ml-2' icon="pi pi-times" severity='danger' onClick={() => removeDocumentFromSelectionWF(rowData)} />
                </React.Fragment>
            </div>
        );
    }
    return (
        <div className='w-full'>
            <Toast ref={toast} />
            <div className=' flex  my-5 gap-3'>
                <div className=" flex-1">
                    <Button className={`border-400 ${uploadLocaly ? "" : "bg-white text-800 "} w-full`} raised label="Charger" icon="pi pi-download" severity={uploadLocaly ? 'info' : 'secondary'} onClick={AjouterDocumentD} />
                </div>
                <div className=" flex-1">
                    <Button className={`border-400 ${uploadFromGed ? "" : "bg-white text-800  "}w-full`} raised label="Importer" icon="pi pi-cloud-download" severity={uploadFromGed ? 'info' : 'secondary'} onClick={(e) => { ImporterDocument(); getDocument(); (overlayPanelDocuments.current as any)?.toggle(e) }} />
                </div>
                <div className=" flex-1">
                    <Button className={`border-400 ${textEditor ? "" : "bg-white text-800 "} w-full`} raised label="Creer" icon="pi pi-file-edit" severity={textEditor ? 'info' : 'secondary'} onClick={handlecreateDocS} />
                </div>
            </div>
            {uploadLocaly &&
                <div className=" w-full ">
                    <FileUpload
                        className=''
                        ref={fileUploadRef}
                        name="files[]"
                        customUpload
                        multiple
                        uploadHandler={handleFileUpload}
                        onSelect={handleFileSelect}
                        onClear={handleRemoveAfterUpload}
                        onRemove={handleRemoveBeforeUpload}
                        chooseLabel={t('choose')}
                        uploadLabel={t('upload')}
                        cancelLabel={t('cancel')}
                        emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
                    />
                    {filesUploadedWF &&
                        <div className="formgrid grid ">
                            <Divider layout='horizontal'></Divider>
                            <div className="field col-12">
                                <span className='text-blue-700 font-bold text-lg'>{t("document.classifyNewDocument")}</span>
                            </div>
                            {/* <div className="field col-4">
                                <label htmlFor="reference">{t("document.reference")}</label><br />
                                <InputText id="reference" value={document.reference}
                                    className='w-full'
                                    onChange={(e) => setDocument({ ...document, reference: e.target.value })} required
                                    autoFocus />
                            </div> */}
                            
                            {/* <div className="field col-4">
                                    <label htmlFor="planClassement">Plan de Classement :</label><br />
                                    <Dropdown showClear id="planClassementDropdown" value={document.planClassement}
                                        options={plans}
                                        onChange={(e) => onDropdownChangeDoc(e, 'planClassement')}
                                        placeholder="Plan de Classement"
                                        filter
                                        filterPlaceholder="Plan de Classement"
                                        optionLabel="libelle" />
                                </div> */}
                            <div className="field col-4">
                                <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label><br />
                                <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                                    options={documentCategories}
                                    className='w-full'
                                    onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                                    placeholder={t("document.documentCategoriePlaceHolder")} filter
                                    filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                                    optionLabel="libelle" />
                            </div>
                            {/* <div className="field col-4">
                                <label htmlFor="uploadDate">{t("document.uploadDate")}</label><br />
                                <Calendar id="uploadDate" value={document.uploadDate}
                                    className='w-full'
                                    onChange={(e) => onInputDateChangeDoc(e, 'uploadDate')} dateFormat="dd/mm/yy"
                                    showIcon={true} />
                            </div> */}
                            
                            {/* <div className="field col-4">
                                <label htmlFor="utilisateur">{t("document.utilisateur")}</label> <br />
                                <Dropdown showClear id="utilisateurDropdown" value={document.utilisateur} options={utilisateurs}
                                    onChange={(e) => onDropdownChangeDoc(e, 'utilisateur')}
                                    className='w-full'
                                    placeholder={t("document.utilisateurPlaceHolder")} filter
                                    filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" />
                            </div>*/}
                            <div className="field col-4">
                                <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label><br />
                                <Dropdown showClear id="entiteAdministrativeDropdown" 
                                    value={document?.entiteAdministrative?.libelle}
                                    options={entiteAdministratives.map((entite) => entite.libelle)}
                                    className='w-full'
                                    onChange={(e) => onEntiteAdministrativeChange(e, 'entiteAdministrative')}
                                    placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                                    filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                                     />
                            </div> 
                            
                        </div>
                    }
                </div>
            }
            {uploadFromGed &&
                <>
                    <OverlayPanel ref={overlayPanelDocuments} showCloseIcon dismissable={false}>
                        <DataTable value={documents} selectionMode="multiple" selection={selectDocumentWorkflow} onSelectionChange={(e) => setSelectDocumentWorkflow(e.value as DocumentDto[])}
                            onRowClick={(e) => { (overlayPanelDocuments.current as any)?.hide() }} header={header} globalFilter={globalFilter}>
                            <Column selectionMode="multiple" style={{ width: '3em' }} />
                            <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                            <Column field="utilisateur.nom" header="User" sortable style={{ minWidth: '12rem' }} />
                            <Column field="planClassement.libelle" header="Plan Classement" sortable />
                            <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                        </DataTable>
                        <div className="p-d-flex p-ai-center p-jc-between">
                            <Paginator onPageChange={nextPageDocument} first={start} rows={onRows} totalRecords={(dataSize as number) || 0} />
                        </div>
                    </OverlayPanel>
                    <span className='mb-2 font-semibold'>Liste des documents selectionnés</span>
                    <DataTable value={selectDocumentWorkflow} paginator rows={5} className='w-full'>
                        <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                        <Column field="planClassement.libelle" header="Plan Classement" sortable />
                        <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                        <Column header="action" body={actionTemplate} />
                    </DataTable>


                    {viewDocument && (


                        <div>
                            <div className='overflow-auto'>
                                <FileViewer documentId={documentIdToView} twoPages={false}/>
                            </div>

                            <div className='flex  justify-content-center'>
                                <Button label="Fermer" icon="pi pi-times" className="p-button-text" onClick={() => setViewDocument(false)} />
                            </div>
                        </div>


                    )}

                </>

            }
            {/* {hideCreatDocS && <BasicDemo onDocumentSave={handleDocumentStepSaved} />} */}
            {hideCreatDocS &&
                <div>
                    <BasicDemo />
                </div>
            }
            <div className='flex flex-row justify-content-end gap-3'>

            {
                onCancel && <Button label={t('cancel')} className="p-button-secondary ml-2 mt-5" onClick={onCancel} />
            }
            <Button
                label={t('save')}
                severity='info'
                className=" ml-56 mt-5"
                onClick={() => {
                    // saveDocAndRetourn();
                    if(disableSaveButton){
                        toast.current?.show({ severity: 'error', summary: t("error.error"), detail: t("error.uploadDocumentFirst"), life: 3000 });
                    }else{
                        otpRef.current?.startOtpProcess();
                    }
                }}
                disabled={ disabled }
            />


            </div>


            {/* </Dialog> */}
            <OtpProcess
                ref={otpRef}
                otpType={OtpType.General}
                onSuccess={() => {
                    ajouterDocumentV2Masse();
                }}
            />

        </div>
    )
}

export default AjouterDocument