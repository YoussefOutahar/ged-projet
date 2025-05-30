import useCreateHook from 'app/component/zyhook/useCreate.hook'
import { WorkflowCriteria } from 'app/controller/criteria/workflow/workflowCriteria.model'
import { WorkflowDto } from 'app/controller/model/Workflow.model'
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO'
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset'
import { WorkflowService } from 'app/controller/service/admin/WorkflowService.service'
import { TFunction } from 'i18next'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Steps } from 'primereact/steps'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model'
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service'
import { Fieldset } from 'primereact/fieldset'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { FileUpload } from 'primereact/fileupload'
import { MessageService } from 'app/zynerator/service/MessageService'
import { DocumentDto } from 'app/controller/model/Document.model'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model'
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service'
import axiosInstance from 'app/axiosInterceptor'
import { ACTION, StepDTO } from 'app/controller/model/workflow/stepDTO'
import { Calendar, CalendarChangeEvent } from 'primereact/calendar'
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model'
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Badge } from 'primereact/badge'
import { pdfjs } from "react-pdf"
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { classNames } from 'primereact/utils'
import BasicDemo from '../doc/document/editor/BasicDemo'
import { DocumentSummaryDto } from 'app/controller/model/DocumentSummary.model'
import FileViewer from '../doc/document/preview/FileViewer'
import { toTitleCase } from '../bureau-ordre/BO_courriels/BO_Utils'
import { Chip } from 'primereact/chip'
import { InputSwitch } from 'primereact/inputswitch'
import { DocumentTypeDto } from 'app/controller/model/DocumentType.model'
import { DocumentTypeAdminService } from 'app/controller/service/admin/DocumentTypeAdminService.service'
import { associateDocumentType, isExcel } from 'app/utils/documentUtils'
import { OrganizationChart } from 'primereact/organizationchart'
import { Card } from 'primereact/card'
import { Tooltip } from 'primereact/tooltip'
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO'

const workflowDocumentsCategory = process.env.NEXT_PUBLIC_DEFAULT_DOCUMENT_CATEGORY_WORKFLOW as string
const certificatsCategory = process.env.NEXT_PUBLIC_DEFAULT_DOCUMENT_CATEGORY_WORKFLOW;
const procesVerbalCategory = process.env.NEXT_PUBLIC_PV_CATEGORY_CODE;

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}
type WorkflowCreateType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: WorkflowDto[],
    service: WorkflowService,
    t: TFunction,
    workflowPreset: WorkflowPreset,
    workflowDto?: WorkflowDto
    utilisateurs: UtilisateurDto[],
    connectedUser: UtilisateurDto
    documentCategories: DocumentCategorieDto[]
    plans: any[]
    entiteAdministratives: EntiteAdministrativeDto[]
}

const Create: React.FC<WorkflowCreateType> = ({ documentCategories, entiteAdministratives, plans, utilisateurs, connectedUser, visible, onClose, add, showToast, list, service, t, workflowPreset, workflowDto }) => {
    const emptyItem = new WorkflowDto();


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.title == '')
            errorMessages.push("title Obligatoire")

        if (item.description == '')
            errorMessages.push("description Obligatoire")

        return errorMessages.length == 0;
    }

    const containPV = () => { 
        if (workflowPreset && workflowPreset.stepPresets) {
            return workflowPreset.stepPresets.some((step: StepPresetDTO) => step.addPV === true);
        }
        return false;
    };
    // Set document entityAdministrative to user's entity administrative 
    const [entiteAdministrativeOptions, setEntiteAdministrativeOptions] = useState<string[]>([]);
    useEffect(() => {
        if(entiteAdministratives){
            setEntiteAdministrativeOptions(entiteAdministratives.map(entite => entite.libelle));
        }
    }, [entiteAdministratives])

    const onEntiteAdministrativeChange = (e: DropdownChangeEvent, field: string) => {
        const selectedEntiteAdministrative = entiteAdministratives.find(entite => entite.libelle === e.value);
        setDocument((prevState) => ({ ...prevState, [field]: selectedEntiteAdministrative }));
    };
    
    useEffect(() => {
        if(connectedUser && connectedUser.entiteAdministrative){
            document.entiteAdministrative = connectedUser.entiteAdministrative;
            setDocument({ ...document });
        }
    }, [connectedUser]);

    //set document category to the DEFAULT_DOCUMENT_CATEGORY_WORKFLOW if it exist
    const fillDefaultCategory = (workflowTitle : string) => {
        if(documentCategories){
            const defaultDocumentCategory = documentCategories.find(category => category.libelle?.trim().toLowerCase() === workflowDocumentsCategory?.trim().toLowerCase());
            if(defaultDocumentCategory){
                document.documentCategorie = defaultDocumentCategory;
                setDocument({ ...document });
                getPlanCreation(defaultDocumentCategory.libelle, workflowTitle );
            }
        }
    }


    const [documentTypes, setDocumentTypes] = useState<DocumentTypeDto[]>([]);
    const documentTypeAdminService = new DocumentTypeAdminService();

    useEffect(() => {
        documentTypeAdminService.getList().then(({ data }) => setDocumentTypes(data)).catch(error => console.log(error));
    },[])
    const fileUploadRef = useRef(null);
    const fileUploadPJRef = useRef(null);
    const overlayPanelDocuments = useRef(null);
    const opDocumentsWorkflow = useRef(null);
    const {
        item,
        setItem,
        submitted,
        setSubmitted,
        activeIndex,
        setActiveIndex,
        activeTab,
        setActiveTab,
        onInputTextChange,
        onInputDateChange,
        onInputNumerChange,
        onMultiSelectChange,
        onBooleanInputChange,
        onTabChange,
        onDropdownChange,
        hideDialog,
        saveItem,
        formateDate
    } = useCreateHook<WorkflowDto, WorkflowCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [isCollapsed, setIsCollapsed] = useState(true); // Commence avec true pour être initialement fermé


    const items = [
        {
            label: 'Instancier le workflow'
        },
        {
            label: 'Instancier Les steps'
        },
        {
            label: "Validation"
        },
    ];
    const [pieceJointes, setPieceJointes] = useState<DocumentDto[]>([]);
    const [pieceJointeDialog, setPieceJointeDialog] = useState<boolean>(false);
    const statusBodyTemplate = (val: string, style: any) => {
        return <Tag value={val} severity={style} className='ml-5' />;
    };

    const utilisateurAdminService = new UtilisateurAdminService();
    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();

    const [stepPresets, setStepPresets] = useState<StepPresetDTO[]>([]);
    const [stepsDto, setStepsDto] = useState<StepDTO[]>([]);

    const [stepPreset, setStepPreset] = useState<StepPresetDTO>();
    const [document, setDocument] = useState<DocumentDto>(new DocumentDto());
    const [documents, setDocuments] = useState<DocumentDto[]>([]);
    const [dataSize, setDataSize] = useState<Number>(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectDocument, setSelectDocument] = useState<DocumentDto[]>([]);
    const [selectDocumentWorkflow, setSelectDocumentWorkflow] = useState<DocumentDto[]>([]);


    const stepActionsPalette = [
        { label: t("stepActions.approuver"), icon: 'pi pi-thumbs-up', className: 'bg-primary', action: ACTION.APPROVE },
        { label: t("stepActions.rejeter"), icon: 'pi pi-thumbs-down', className: 'bg-red-700', action: ACTION.REJECT },
        { label: t("stepActions.parapher"), icon: 'pi pi-book', className: 'bg-orange-700', action: ACTION.PARAPHER },
        { label: t("stepActions.presigner"), icon: 'pi pi-check', className: 'bg-primary-reverse border-1 hover:bg-primary', action: ACTION.PRESIGNER },
        { label: t("stepActions.signer"), icon: 'pi pi-verified', className: 'bg-green-700', action: ACTION.SIGN },
        { label: t("stepActions.envoyerCourrier"), icon: 'pi pi-envelope', className: 'bg-blue-700', action: ACTION.ENVOI_COURRIER }
      ]
    const getActionPalette = (action: ACTION ) => {
        return stepActionsPalette.filter(item => item.action === action)[0] || { label: 'Aucun', icon: '', className: 'bg-orange-700 text-white', action: ACTION.APPROVE };
    }



    useEffect(() => {
        if (workflowDto) {
            const newItem = { ...workflowDto };
            newItem.dateC = '';
            newItem.id = 0;
            setItem(newItem);
        }
        setStepPresets(workflowPreset.stepPresets || []);



    }, [])

    const getDocument = () => {
        if (connectedUser.id !== 0) {
            const requestBody = {
                entiteAdministrative: {
                    id: connectedUser?.entiteAdministrative?.id
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
    const [indexSteps, setIndexSteps] = useState(0);
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
        itemSummary.entiteAdministrativeId = item.entiteAdministrative?.id || connectedUser!.entiteAdministrative?.id;
        itemSummary.planClassementId = item.planClassement?.id;
        itemSummary.utilisateurId = item.utilisateur.id || connectedUser!.id;
        itemSummary.utilisateurEmail = item.utilisateur.email || connectedUser!.email;

        return itemSummary;
    }
    const handleNextStep = async () => {
        setLoading(true);
        if (activeIndex === 0 && workflowPreset.stepPresets) {
            setStepPreset(workflowPreset.stepPresets[indexSteps]);
        }
        const documentFormDataWF = new FormData();
        let createdDocumentWF: any[] = [];
        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file instanceof Blob) {
                    documentFormDataWF.append('files', file);
                }
            })
            const documentSummary = toDocumentSummary(document);
            documentFormDataWF.append("documentDTO", JSON.stringify(documentSummary));
        }
        try {

            if (filesUploadedWF && document && !uploadFromGed) {
                createdDocumentWF = await createDoc(documentFormDataWF);
                setSelectDocumentWorkflow(prevDocuments => prevDocuments.concat(createdDocumentWF));
            }

        }
        catch (error) {
            console.error('Erreur lors de la création du document:', error);
            throw error;
        }
        item.documents = filesUploadedWF && document ? createdDocumentWF : selectDocumentWorkflow;
        setLoading(false);
        setIndexSteps((prevState) => prevState + 1);
        setDocumentToView(null);
        setActiveIndex((prevState) => prevState + 1);
        let newDocument = new DocumentDto();
        newDocument.entiteAdministrative = document?.entiteAdministrative;
        newDocument.utilisateur = document?.utilisateur;
        newDocument.documentCategorie = document?.documentCategorie;
        newDocument.planClassement = document?.planClassement;
        setDocument(newDocument);
        setFiles([]);
    }
    const [loading, setLoading] = useState<boolean>(false);
    const createDoc = async (formData: FormData) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setLoading(false);
            setFiles([]);
            let newDocument = new DocumentDto();
            newDocument.entiteAdministrative = document?.entiteAdministrative;
            newDocument.utilisateur = document?.utilisateur;
            newDocument.documentCategorie = document?.documentCategorie;
            newDocument.planClassement = document?.planClassement;
            setDocument(newDocument);
            setFilesUploadedWF(false);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du document:', error);
            setLoading(false);
            throw error;
        }
    }
    const [loadingPJ, setLoadingPJ] = useState<boolean>(false);
    const [pjAddedSuccess, setPjAddedSuccess] = useState<boolean>(false);
    const AjouterPieceJointe = async () => {
        setPjAddedSuccess(false);
        try {
            setLoadingPJ(true);
            const formData = new FormData();
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (file instanceof Blob) {
      
                        formData.append('files', file);
                    }
                })

                const documentSummary = toDocumentSummary(document);
                formData.append("documentDTO", JSON.stringify(documentSummary));
            }
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setPieceJointes(response.data);
            setLoadingPJ(false);
            setFiles([]);
            let newDocument = new DocumentDto();
            newDocument.entiteAdministrative = document?.entiteAdministrative;
            newDocument.utilisateur = document?.utilisateur;
            fillDefaultCategory(item.title);
            newDocument.planClassement = document?.planClassement;
            setDocument(newDocument);
            setFilesUploadedPJ(false);
            setPieceJointeDialog(false);
            setPjAddedSuccess(true);
            MessageService.showSuccess(showToast, "Création!", `Pièce(s) jointe(s) chargée(s) avec succès`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du document:', error);
            setLoadingPJ(false);
            throw error;
        }
    }

    const SaveItemSteps = async () => {
        if (workflowPreset.stepPresets) {
            const currentItem = { ...item }
            const documentFormData = new FormData();
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (file instanceof Blob) {

                        documentFormData.append('files', file);
                    }
                })

                const documentSummary = toDocumentSummary(document);
                documentFormData.append("documentDTO", JSON.stringify(documentSummary));
            }
            if (workflowPreset.stepPresets.length > indexSteps) {
                if (stepPreset) {
                    try {
                        let createdDocument;
                        if (filesUploaded && document && !uploadFromGed) {
                            createdDocument = await createDoc(documentFormData);
                        }
                        const step: StepDTO = {
                            id: 0,
                            stepPreset: stepPreset,
                            workflowId: 0,
                            status: "WAITING",
                            discussions: [],
                            documents: filesUploaded && document ? createdDocument : selectDocument,
                            createdOn: new Date().toISOString(),
                            updatedOn: new Date().toISOString(),
                            createdBy: connectedUser!.username,
                            updatedBy: connectedUser!.username
                        };
                        setStepsDto([...stepsDto, step]);
                    } catch (error) {
                        console.error('Erreur lors de la création du document:', error);
                        throw error;
                    }
                }

                setStepPreset(workflowPreset.stepPresets[indexSteps]);
                setFiles([]);
                setFilesUploaded(false);
                let newDocument = new DocumentDto();
                newDocument.entiteAdministrative = document?.entiteAdministrative;
                newDocument.utilisateur = document?.utilisateur;
                newDocument.documentCategorie = document?.documentCategorie;
                newDocument.planClassement = document?.planClassement;  
                setDocument(newDocument);
                setFilesUploaded(false);
                setFiles([]);
                setSelectDocument([]);
                setDocumentToView(null);
                setActiveIndex(1);
                setIndexSteps((prevState) => prevState + 1);
            } else {
                if (stepPreset) {
                    try {
                        let createdDocument;
                        if (filesUploaded && document) {
                            createdDocument = await createDoc(documentFormData);
                        }
                        const step: StepDTO = {
                            id: 0,
                            stepPreset: stepPreset,
                            workflowId: 0,
                            status: "WAITING",
                            discussions: [],
                            documents: filesUploaded && document ? createdDocument : selectDocument,
                            createdOn: new Date().toISOString(),
                            updatedOn: new Date().toISOString(),
                            createdBy: connectedUser!.username,
                            updatedBy: connectedUser!.username
                        };
                        setStepsDto([...stepsDto, step]);
                    } catch (error) {
                        console.error('Erreur lors de la création du document:', error);
                        throw error;
                    }
                }

                //currentItem.stepDTOList = [...currentItem.stepDTOList, stepsDto];
                setActiveIndex(2);
                setDocumentToView(null);
            }
        }
    }

    const generateEvPlanClassement = async () => {
        const categoryCE = documentCategories.find(docCat => docCat.libelle.toLowerCase() === certificatsCategory)?.libelle || null as any;
        const workflowTitle = item.title || '';
        if (!workflowPreset.stepPresets || workflowPreset.stepPresets?.length == 0 || categoryCE == null || workflowTitle == "") {
            return null;
        }
        const stepEvaluateurs = workflowPreset.stepPresets?.find(stepPreset => stepPreset.level == 1);

        if (stepEvaluateurs?.destinataires) {
            for (let i = 0; i < stepEvaluateurs?.destinataires?.length; i++) {
                const destinataire = stepEvaluateurs.destinataires[i];
                const ev = "EV" + i.toString() + "-" + destinataire.utilisateur.nom + "-" + destinataire.utilisateur.prenom;
                const plans = [{ libelle: categoryCE }, { libelle: workflowTitle }, { libelle: "CE" }, { libelle: ev }];
                await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/multiple`, plans).catch(error => console.log(error));
            }
        }
    }

    const SaveItem = () => {
        setLoading(true); // Activer le spinner et désactiver le bouton

        item.id = 0;
        item.stepDTOList = stepsDto;
        item.workflowPresetDTO = workflowPreset;
        item.initiateurId = connectedUser.id;
        item.piecesJointes = pieceJointes;
        
        WorkflowService.createWorkflow(item)
            .then((response) => {
                MessageService.showSuccess(showToast, "Création!", "Workflow créé avec succès");
                HideDialogReload();
                setLoading(false); // Désactiver le spinner et activer le bouton
                fillDefaultCategory(item.title);
                generateEvPlanClassement();
            })
            .catch(error => console.log(error))
    }

    const itemDialogFooter = (
        <div>
            {(activeIndex == 1) && <Button raised severity="secondary" icon="pi pi-step-backward-alt" label="Précedent" onClick={() => setActiveIndex((prevState) => prevState - 1)} />}
            {/* {(activeIndex == 2) && <Button raised severity="secondary" icon="pi pi-step-backward-alt" label="Précedent" onClick={() => {setActiveIndex((prevState) => prevState - 1); setIndexSteps(0);}} />} */}
            {activeIndex < 1 && <Button
                raised
                severity="secondary"
                icon="pi pi-step-forward-alt"
                label="Suivant"
                onClick={(e) => {
                    handleNextStep();
                    (opDocumentsWorkflow.current as any)?.hide(e)
                }}
                disabled={
                    !isFormValid() || 
                    (activeIndex === 0 && containPV() ? pieceJointes.length === 0 : false)
                }
                loading={loading}

            />}

            {activeIndex === 1 && <Button raised label="Suivant" icon="pi pi-step-forward-alt" onClick={(e) => { SaveItemSteps(); (overlayPanelDocuments.current as any)?.hide(e) }} loading={loading} />}
            {activeIndex === 2 && <Button raised label="Valider" icon="pi pi-check" onClick={SaveItem} loading={loading} />}
        </div>
    );
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: dataSize })}</h5>
            <span className="block mt-2 ml-3 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );
    const HideDialogReload = () => {
        hideDialog();
        // reset form
        setItem(emptyItem);
        setSubmitted(false);
        setActiveIndex(0);
        setActiveTab(0);
        setStepPresets([]);
        setStepsDto([]);
        setStepPreset(undefined);
        let newDocument = new DocumentDto();
        newDocument.entiteAdministrative = document?.entiteAdministrative;
        newDocument.utilisateur = document?.utilisateur;
        newDocument.documentCategorie = document?.documentCategorie;
        newDocument.planClassement = document?.planClassement;
        setDocument(newDocument);
        setSelectDocument([]);
        setSelectDocumentWorkflow([]);
        setFiles([]);
        setFilesUploaded(false);
        setFilesUploadedWF(false);
        setDocumentToView(null);
        setNumPages(0);
        setPageNumber(1);
        setTouchedInputs({});
        setIsOCRDone(false);
        setReference('');
        setDocuments([]);
        setGlobalFilter('');
        setStart(0);
        setOnRows(5);
        setIndexSteps(0);
        sethideCreatDocWf(false);
        sethideCreatDocS(false);
        setPjAddedSuccess(false);

    }
    const [uploadLocaly, setUploadLocaly] = useState<boolean>(true);
    const [uploadFromGed, setUploadFromGed] = useState<boolean>(false);
    const [textEditor, setTextEditor] = useState<boolean>(false);
    const AjouterDocument = () => {
        setUploadLocaly(true);
        setUploadFromGed(false);
        setTextEditor(false);
        sethideCreatDocWf(false);
        sethideCreatDocS(false)

        setDocumentToView(null);

    }
    const ImporterDocument = () => {
        setUploadFromGed(true);
        setUploadLocaly(false);
        setTextEditor(false);
        sethideCreatDocWf(false);
        sethideCreatDocS(false)

        setFiles([]);
        setFilesUploaded(false);
    }
    const [filesUploaded, setFilesUploaded] = useState(false);
    const [filesUploadedWF, setFilesUploadedWF] = useState(false);
    const [filesUploadedPJ, setFilesUploadedPJ] = useState(false);

    const [files, setFiles] = useState<any[]>();
    const [fileUrl, setFileUrl] = useState<string>('');
    const handleFileUpload = (e: any) => {
        const files = e.files;
        setFiles(files);
        document.reference = files[0].name;
        fillDefaultCategory(item.title);
        setFilesUploaded(true);
        MessageService.showSuccess(showToast, "Création!", `${files.length} fichier(s) chargé(s) avec succès`);
    };

    const handleFileUploadWF = async (e: any) => {
        const files = e.files;
        setFiles(files);
        document.reference = files[0].name;
        document.utilisateur = connectedUser
        document.entiteAdministrative = connectedUser.entiteAdministrative
        fillDefaultCategory(item.title);
        setFilesUploadedWF(true);
        MessageService.showSuccess(showToast, "Création!", `${files.length} fichier(s) workflow chargé(s) avec succès`);
    };

    const handleFileType = async () => {
        if(files && files.length > 0){
        const docType = await associateDocumentType(files[0],  documentTypes);
        if (docType) {
            document.documentType = docType;   
            setDocument({ ...document });     
        }
        }
    }

    useEffect(() => {
        handleFileType();
    }, [files]);

    const handleFileUploadPJ = async (e: any) => {
        const files = e.files;
        setFiles(files);
        document.reference = files[0].name;
        const exceldocumentType = documentTypes.filter(docType => isExcel(docType.libelle))[0]
        if (exceldocumentType) document.documentType = exceldocumentType
        document.utilisateur = connectedUser
        document.entiteAdministrative = connectedUser.entiteAdministrative
        document.documentCategorie = documentCategories.find(docCat => docCat?.code?.toLowerCase() === procesVerbalCategory) || null as any;
        if(document.documentCategorie) await getPlanCreation(document.documentCategorie.libelle, item.title, "PV");
        setFilesUploadedPJ(true);
        MessageService.showSuccess(showToast, "Création!", `${files.length} fichier(s) chargé(s) avec succès`);
    };

    useEffect(() => {
        if (files && files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        }
    }, [files]);

    const [reference, setReference] = useState<string>('');
    const getPlanCreation = async (categorieLibelle: string, workflowTitle: string, thirdPlan?:string) => {
        const plans = [{ libelle: categorieLibelle }, { libelle: workflowTitle }];
        if(thirdPlan) plans.push({ libelle: thirdPlan });
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
        if(e.value){
            await getPlanCreation(e.value.libelle, item.title);
        }
    };

    const onDropdownChangeDoc = (e: DropdownChangeEvent, field: string) => {
        setDocument((prevState) => ({ ...prevState, [field]: e.value }));
    };
    const onInputDateChangeDoc = (e: CalendarChangeEvent, name: string) => {
        const value = (e.value) || "";
        setDocument({ ...document, [name]: value });
    };
    const removeDocumentFromSelection = (document: DocumentDto) => {
        const updatedSelection = selectDocument.filter(item => item !== document);
        setSelectDocument(updatedSelection);
    };
    const removeDocumentFromSelectionWF = (document: DocumentDto) => {
        const updatedSelection = selectDocumentWorkflow.filter(item => item !== document);
        setSelectDocumentWorkflow(updatedSelection);
    };
    const editStepFromSelection = (stepDto: StepDTO) => {
    }
    const overlayPanelselectedDocuments = useRef(null);
    const [selectedDocuments, setSelectedDocumets] = useState<DocumentDto[]>([]);
    const viewDocumentFromSelection = (stepDto: StepDTO) => {
        if (stepDto.documents)
            setSelectedDocumets(stepDto.documents);
    }

    const [documentToView, setDocumentToView] = useState<number | null>(null);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const onPageChange = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };

    const FlagCell = (rowData: any) => {
        const flag = rowData ;
        return (
          <div >
            {flag === WorkflowDTO.FlagEnum.NORMALE ? (
              <Tag value={WorkflowDTO.getWorkflowFlagLabel(flag)}  />
    
            ) : flag === WorkflowDTO.FlagEnum.URGENT ? (
              <Tag value={WorkflowDTO.getWorkflowFlagLabel(flag)} className='bg-red-600' />
            ) : (
              <Tag value={WorkflowDTO.getWorkflowFlagLabel(flag)} className='surface-600' />
            )}
          </div>
        );
    };


    const [touchedInputs, setTouchedInputs] = useState<Record<string, boolean>>({});
    const [isOCRDone, setIsOCRDone] = useState(false);

    const handleDocumentWFSaved = (document: DocumentDto) => {
        setSelectDocumentWorkflow(prevDocuments => prevDocuments.concat(document));
        item.documents = selectDocumentWorkflow;

    };

    const handleDocumentStepSaved = (document: DocumentDto) => {
        setSelectDocument(prevDocuments => prevDocuments.concat(document));



    };



    const handleInputClick = (inputName: string) => {
        setTouchedInputs({ ...touchedInputs, [inputName]: true });
    }

    const [hideCreatDocWf, sethideCreatDocWf] = useState<boolean>(false);

    const handlecreateDocWf = () => {
        setTextEditor(true);
        setUploadFromGed(false);
        setUploadLocaly(false);
        sethideCreatDocWf(true);

    };

    const [hideCreatDocS, sethideCreatDocS] = useState<boolean>(false);

    const handlecreateDocS = () => {
        sethideCreatDocS(true)

        setUploadFromGed(false);
        setUploadLocaly(false);

    };


    const truncateDescription = (description: string, length = 50) => {
        if (description.length > length) {
            return <>
                <Tooltip target=".p-custom-tooltip"  >
                    <div className='max-w-20rem'>

                        {description}
                    </div>
                </Tooltip>
                <p className='p-custom-tooltip' >{description.substring(0, length)}...</p>
            </>
            // return `${description.substring(0, length)}`;
        }
        return <p>{description}</p>;
    };

    const workflowDocumentView = (documents: DocumentDto[]) => {
        const [viewDocuments, setViewDocuments] = useState(false)

        return (
            <div className="field grid col-12 mt-0 ">

                <label className='col-2 font-bold  '>{t("Documents")} </label>
                <span className='col-1 font-bold mt-2 my-auto '>:</span>

                {
                    documents.length > 0 ? (
                        <>

                            <Button className='col-5 w-fit' rounded text label={viewDocuments ? "Cacher les documents" : "Voir les documents"} icon={viewDocuments ? "pi pi-eye-slash" : "pi pi-eye"} onClick={() => setViewDocuments(prev => !prev)} />
                            {viewDocuments &&
                                <div className='mt-3'>
                                    <DataTable value={documents} paginator rows={5} className='w-full'>
                                        <Column field="reference" style={{ minWidth: '15rem', paddingLeft: "3rem" }} />
                                        {/* <Column field="planClassement.libelle"   /> */}
                                        <Column field="documentCategorie.libelle" style={{ minWidth: '15rem' }} />
                                        {/* <Column field="type"   style={{ minWidth: '8rem' }} /> */}

                                        <Column style={{ minWidth: '10rem' }} body={(rowData) => (
                                            <>
                                                <Button icon="pi pi-eye" text rounded raised onClick={(e) => {
                                                    setDocumentToView(rowData.id);
                                                }} className='ml-1 bg-white text-primary text-lg  hover:shadow-4 hover:bg-primary hover:text-white' />
                                            </>
                                        )} />
                                    </DataTable>
                                </div>}
                        </>
                    ) : (
                        <Tag className="ml-2 " icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
                    )
                }
            </div>
        )
    }

    const [treeView, setTreeView] = useState(true)
    const [tableView, setTableView] = useState(false)

    const stepsHierarchy = (steps: StepDTO[]) => {

        const [tree, setTree] = useState<any[]>([{
            expanded: true,
            label: 'Steps',
            type: 'level',
            data: [],
            children: []
        }]);

        type Level = {
            expanded: boolean;
            label: number;
            type: string | 'level';
            data: StepDTO[];
            children: any[];
        }

        const defineLevels = (steps: StepDTO[]) => {
            let levels: Level[] = [];
            steps.forEach((step) => {
                const foundLevel = levels.find((level) => level.label === step.stepPreset.level);
                if (foundLevel) {
                    if (!foundLevel.data) {
                        foundLevel.data = [];
                    }
                    foundLevel.data.push(step);
                } else {
                    if (step.stepPreset.level) {
                        levels.push({
                            expanded: true,
                            label: step.stepPreset.level,
                            type: 'level',
                            data: [step],
                            children: []
                        });
                    }
                }
            });
            return levels;
        }

        const constructTree = (levels: Level[]) => {
            let tempTree: any[] = [];
            for (let i = 0; i < levels.length; i++) {
                if (i === 0) {
                    tempTree.push(levels[i]);
                } else {
                    let parent = levels[i - 1];
                    let current = levels[i];
                    parent.children.push(current);
                }
            }
            setTree(tempTree);
        };

        const nodeTemplate = (node: any) => {
            if (node?.type === 'level') {
                return (
                    <div>
                        <div className="node-content flex flex-wrap gap-4 justify-content-center">
                            {
                                node.data?.map((step: StepDTO) => (
                                    <Card key={step.id} title={step.stepPreset.title}>
                                        <div className='grid w-24rem text-left gap-4'>

                                            <div className='grid col-12'>
                                                <span className='col-4 font-bold '>Description </span>
                                                <span className='col-1 font-bold'>:</span>
                                                {/* <span className='col-7'>{truncateDescription(step.stepPreset.description || "")}</span> */}
                                                <span className='col-7'>{step.stepPreset.description}</span>
                                            </div>

                                            <div className='grid col-12 '>
                                                <span className='col-4  font-bold'>Actions </span>
                                                <span className='col-1 font-bold'>:</span>
                                                <div className='col-7 flex flex-wrap gap-2 '>
                                                    {   step.stepPreset.actions && step.stepPreset.actions.length > 0 &&
                                                        step.stepPreset.actions?.map((action, index) => (
                                                            <Tag key={index} className={`${getActionPalette(action).className} h-fit w-fit p-1.5`}>
                                                                <div className="flex align-items-center font-sm gap-2 p-0">
                                                                    <i className={`${getActionPalette(action).icon}`} />
                                                                    <span className='text-sm'>{getActionPalette(action).label}</span>
                                                                </div>
                                                            </Tag>))
                                                    }
                                                    <Tag className={`${getActionPalette(ACTION.REJECT).className} h-fit w-fit p-1.5`}>
                                                        <div className="flex align-items-center font-sm gap-2 p-0">
                                                            <i className={`${getActionPalette(ACTION.REJECT).icon}`} />
                                                            <span className='text-sm'>{getActionPalette(ACTION.REJECT).label}</span>
                                                        </div>
                                                    </Tag>
                                                </div>
                                            </div>
                                            <div className='col-12 grid'>
                                                <span className='col-4 font-bold'>Destinataires </span>
                                                <span className='col-1 font-bold'>:</span>
                                                <div className='col-7 flex flex-wrap gap-1'>
                                                    {
                                                        step.stepPreset.destinataires && step.stepPreset.destinataires.length > 0
                                                            ?
                                                            step.stepPreset.destinataires?.map((destinataire, index) => (
                                                                <Chip key={index} label={`${destinataire.utilisateur.nom} ${destinataire.utilisateur.prenom}`} icon="pi pi-user" />
                                                            ))
                                                            :
                                                            <Tag className="ml-2" icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
                                                    }
                                                </div>
                                            </div>
                                            <div className='col-12 grid'>
                                                <span className='col-4 font-bold'>Documents </span>
                                                <span className='col-1 font-bold'>:</span>
                                                <div className='col-7 flex flex-wrap gap-1'>
                                                    {step.documents && step.documents.length > 0
                                                        ?
                                                        step.documents.map((doc) =>
                                                        (
                                                            <Chip
                                                                label={doc.reference}
                                                                icon="pi pi-file"
                                                                className=" text-sm cursor-pointer m-1 hover:bg-primary "
                                                                style={{
                                                                    width: 'fit-content',
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                                onClick={(e) => setDocumentToView(doc.id)}
                                                            />
                                                        ))
                                                        :
                                                        <Tag className="ml-2" icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                    </Card>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        }

        useEffect(() => {
            if (steps && steps.length > 0) {
                const levels = defineLevels(steps || []);
                constructTree(levels);
            } else {
                setTree([{
                    expanded: true,
                    label: 'Steps',
                    type: 'level',
                    data: [],
                    children: []
                }]);
            }

        }, [steps, activeIndex]);

        if (steps.length === 0 || !steps || activeIndex !== 2) {
            return <Tag className="mr-2" icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
        }

        return (
            <OrganizationChart value={tree} nodeTemplate={nodeTemplate} />

        )



    }

    const isProcedureDeSignature = (workflowPreset: WorkflowPreset) => {
        return workflowPreset?.stepPresets?.some(step => step.actions?.includes(ACTION.SIGN)) || false;
    }

    function actionTemplate(rowData: DocumentDto) {
        return (
            <React.Fragment>
                <Button className="mr-1" icon="pi pi-eye" onClick={(e) => { setDocumentToView(rowData.id) }} severity='secondary' />
                <Button icon="pi pi-times" severity='danger' onClick={() => removeDocumentFromSelectionWF(rowData)} />

            </React.Fragment>
        );
    }

    return (
        <Dialog
            visible={visible}
            closeOnEscape
            maximizable
            style={{ width: '95vw' }}
            header={
                <>
                    <span className='text-lg font-bold '>{isProcedureDeSignature(workflowPreset)?"Initialiser une procédure de signature":"Démarrer le flux de traivail" } :</span>
                    <span className=' text-lg font-bold text-primary uppercase'> {workflowPreset.title}</span>
                    <Steps className='mt-4' activeIndex={activeIndex} model={items} onSelect={(event) => onTabChange(event)} readOnly />
                </>
            }
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={HideDialogReload}
        >


            <div className={`mt-4 mb-2 ${activeIndex !== 0 && 'hidden'}`}>
                <div className="flex flex-row gap-5">
                    <div className="flex-1 flex flex-column  px-4 ">
                        <Divider align="left">
                            <span className='p-tag text-sm'>{toTitleCase("Workflow")}</span>
                        </Divider>

                        <div className='grid'>
                            <div className="  col-5 ">
                                <label className=' text-base font-semibold ' htmlFor="title">{t("workflow.titre")} </label>
                                <div className='mt-2'>
                                    <InputText
                                        id="title"
                                        value={item.title}
                                        onChange={(e) => onInputTextChange(e, 'title')}
                                        required
                                        onClick={() => handleInputClick('title')}
                                        className={classNames({ 'p-invalid': touchedInputs.title && !item.title && !isFormValid() })}
                                        autoFocus
                                    />
                                    {touchedInputs.title && !item.title && <small className="p-invalid p-error font-bold">titre Obligatoire.</small>}
                                </div>
                            </div>
                            <div className="field col-5 ">
                                <label className='mb-2 text-base font-semibold my-0' htmlFor="flag">{t("workflow.flag")}</label>
                                <div className="flex flex-row mt-2">
                                    <Button
                                        className={`mr-0 border-noround-right  ${item.flag === 'BASSE' ? '' : 'bg-white text-900'}`}
                                        label={WorkflowDTO.getWorkflowFlagLabel(WorkflowDTO.FlagEnum.BASSE)}
                                        severity={'secondary'}
                                        onClick={() => { setItem({ ...item, flag: WorkflowDTO.FlagEnum.BASSE }); }}
                                    />
                                    <Button
                                        className={`ml-0 border-noround  ${item.flag === WorkflowDTO.FlagEnum.NORMALE ? '' : 'bg-white text-900'}`}
                                        label={WorkflowDTO.getWorkflowFlagLabel(WorkflowDTO.FlagEnum.NORMALE)}
                                        severity={item.flag === 'NORMALE' ? 'info' : 'secondary'}
                                        onClick={() => { setItem({ ...item, flag: WorkflowDTO.FlagEnum.NORMALE }); }}
                                    />
                                    <Button
                                        className={`ml-0 border-noround-left  ${item.flag === 'URGENT' ? 'bg-red-700' : 'bg-white text-900'}`}
                                        label={WorkflowDTO.getWorkflowFlagLabel(WorkflowDTO.FlagEnum.URGENT)}
                                        severity={item.flag === 'URGENT' ? 'danger' : 'secondary'}
                                        onClick={() => { setItem({ ...item, flag: 'URGENT' }); }}
                                    />
                                </div>
                            </div>
                            <div className="field col-2 ">
                                <label className='mb-2 text-base font-semibold my-0' htmlFor="pieceJointe">{t("workflow.pieceJointes")}</label>
                                <div className='mt-2'>
                                    <Button 
                                        className={`${pjAddedSuccess?"bg-primary":"bg-primary-reverse"} w-full   `} 
                                        label={`${pjAddedSuccess?"Chargés":"Charger"}`} 
                                        icon={`${pjAddedSuccess?"pi pi-paperclip":"pi pi-plus"}`}
                                        onClick={(e) => {setPieceJointeDialog(true);}}
                                        disabled={item?.title === ''}
                                        />
                                    {/* <InputSwitch id="pieceJointe" checked={pieceJointeChecked} onChange={(e) => {setPieceJointeChecked(!pieceJointeChecked); setPieceJointeDialog(true);}} className='mr-2 ' /> */}
                                </div>
                            </div>
                            <div className="flex flex-column  col-12 mt-0 gap-0">
                                <label className=' text-base font-semibold mb-2 ' htmlFor="description">Demande</label>
                                <div className=''>
                                    <InputTextarea id="description" value={item.description} rows={5}
                                        onChange={(e) => onInputTextChange(e, 'description')} required disabled={workflowDto ? true : false}
                                        onClick={() => handleInputClick('description')}
                                        className={classNames({ 'p-invalid': touchedInputs.description && !item.description && !isFormValid() })} autoFocus
                                    />
                                    {touchedInputs.description && !item.description && <small className="p-invalid p-error font-bold">description Obligatoire.</small>}
                                </div>

                            </div>
                        </div>


                        <Divider align="left">
                            <span className='p-tag text-sm'>{toTitleCase(t("audit.document"))}</span>
                        </Divider>
                        <div className="field col-12 ">
                            <div className='field grid mt-1'>
                                <div className="field col-4">
                                    <Button className={`border-400 ${uploadLocaly ? "" : "bg-white text-800 "}`} raised label="Charger les documents" icon="pi pi-download" severity={uploadLocaly ? 'info' : 'secondary'} onClick={AjouterDocument} />
                                </div>
                                <div className="field col-4">
                                    <Button className={`border-400 ${uploadFromGed ? "" : "bg-white text-800 "}`} raised label="Importer" icon="pi pi-cloud-download" severity={uploadFromGed ? 'info' : 'secondary'} onClick={(e) => { ImporterDocument(); getDocument(); (overlayPanelDocuments.current as any)?.toggle(e) }} />
                                </div>
                                <div className="field col-4">
                                    <Button className={`border-400 ${textEditor ? "" : "bg-white text-800 "}`} raised label="Creer" icon="pi pi-file-edit" severity={textEditor ? 'info' : 'secondary'} onClick={handlecreateDocWf} />
                                </div>
                            </div>



                            {!uploadFromGed &&
                                <div className="field col-12">
                                    <FileUpload
                                        ref={fileUploadRef}
                                        name="files[]"
                                        accept='.pdf'
                                        customUpload
                                        chooseLabel={t("choose")}
                                        uploadLabel={t("upload")}
                                        cancelLabel={t("cancel")}
                                        multiple
                                        uploadHandler={handleFileUploadWF}
                                        emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
                                    />
                                    {filesUploadedWF &&
                                        <div className="formgrid grid">
                                            <Divider layout='horizontal'></Divider>
                                            <div className="field col-12">
                                                <span className='text-blue-700 font-bold text-lg'>{t("document.classifyNewDocument")}</span>
                                            </div>
                                            {/* <div className="field col-4">
                                                <label htmlFor="reference">{t("document.reference")}</label>
                                                <InputText id="reference" value={document.reference}
                                                    onChange={(e) => setDocument({ ...document, reference: e.target.value })} required
                                                    autoFocus />
                                            </div> */}
                                            {/* <div className="field col-4">
                                                <label htmlFor="documentType">{t("document.documentType")}</label>
                                                <Dropdown showClear id="documentTypeDropdown" value={document.documentType}
                                                    options={documentTypes}
                                                    onChange={(e) => onDropdownChangeDoc(e, 'documentType')}
                                                    placeholder={t("document.documentTypePlaceHolder")} filter
                                                    filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                                                    optionLabel="libelle" className='w-full'/>
                                            </div> */}
                                            <div className="field col-4">
                                                <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                                                <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                                                    options={documentCategories}
                                                    onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                                                    placeholder={t("document.documentCategoriePlaceHolder")} filter
                                                    filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                                                    optionLabel="libelle"
                                                     />
                                            </div>
                                            {/* <div className="field col-4">
                                                <label htmlFor="planClassement">Plan de Classement :</label>
                                                <Dropdown showClear id="planClassementDropdown" value={document.planClassement}
                                                    options={plans}
                                                    onChange={(e) => onDropdownChangeDoc(e, 'planClassement')}
                                                    placeholder="Plan de Classement"
                                                    filter
                                                    filterPlaceholder="Plan de Classement"
                                                    optionLabel="libelle" />
                                            </div> */}
                                            {/* <div className="field col-4">
                                                <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                                                <Calendar id="uploadDate" value={document.uploadDate}
                                                    onChange={(e) => onInputDateChangeDoc(e, 'uploadDate')} dateFormat="dd/mm/yy"
                                                    showIcon={true} />
                                            </div> */}
                                            {/* <div className="field col-4">
                                                <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                                                <Dropdown showClear id="utilisateurDropdown" value={document.utilisateur} options={utilisateurs}
                                                    onChange={(e) => onDropdownChangeDoc(e, 'utilisateur')}
                                                    placeholder={t("document.utilisateurPlaceHolder")} filter
                                                    filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" />
                                            </div> */}
                                            <div className="field col-4">
                                                <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")} </label>
                                                <Dropdown showClear id="entiteAdministrativeDropdown" 
                                                    value={document.entiteAdministrative?.libelle}
                                                    options={entiteAdministrativeOptions}
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
                                        <Column body={actionTemplate} />

                                    </DataTable>
                                </>
                            }


                        </div>


                    </div>
                    <div className="flex-1 overflow-auto ">

                        {!hideCreatDocWf && <>
                            <div className=''>
                                {(filesUploadedPJ || filesUploadedWF) && files && files.length > 0 ?
                                    (
                                        <FileViewer file={fileUrl} className=" mx-auto w-min " twoPages={false} height={850} />
                                    ) :
                                    documentToView ? (
                                        <FileViewer documentId={documentToView} className=" mx-auto w-min " twoPages={false} height={850} />
                                    ) : (
                                        <div className="  flex flex-column align-items-center justify-content-center border-double border-500 " style={{ width: '40vw', height: '70vh' }}>
                                            <p>{t("noFileToDisplay")}</p>
                                            <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                                        </div>
                                    )}
                            </div>

                        </>}


                        {/* {hideCreatDocWf && <BasicDemo onDocumentSave={handleDocumentWFSaved} />} */}
                        {hideCreatDocWf && <BasicDemo />}


                    </div>



                </div>
            </div>
            <Dialog header="Ajouter des Pièces Jointes" visible={pieceJointeDialog} modal style={{ width: '47vw' }} onHide={() => {setPieceJointeDialog(false)}}
                footer={
                    <>
                        <Button label="Annuler" icon="pi pi-times" severity='danger' onClick={() => {setPieceJointeDialog(false)}} className="p-button-text" loading={loadingPJ} />
                        <Button label="Valider" icon="pi pi-check" severity="info" onClick={AjouterPieceJointe} autoFocus disabled={files?.length == 0 || !document || document?.documentCategorie == null || document?.entiteAdministrative == null}  />
                    </>
                }>
                <FileUpload
                    ref={fileUploadPJRef}
                    name="files[]"
                    customUpload
                    chooseLabel={t("choose")}
                    uploadLabel={t("upload")}
                    cancelLabel={t("cancel")}
                    multiple
                    accept=".xls, .xlsx, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
                    uploadHandler={handleFileUploadPJ}
                    emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
                />
                {filesUploadedPJ &&
                    <div className="formgrid grid">
                        <Divider layout='horizontal'></Divider>
                        <div className="field col-12">
                            <span className='text-blue-700 font-bold text-lg'>{t("document.classifyNewDocument")}</span>
                        </div>
                        {/* <div className="field col-4">
                            <label htmlFor="reference">{t("document.reference")}</label>
                            <InputText id="reference" value={document.reference}
                                onChange={(e) => setDocument({ ...document, reference: e.target.value })} required
                                autoFocus className='w-full' />
                        </div> */}
                        {/* <div className="field col-4">
                            <label htmlFor="documentType">{t("document.documentType")}</label>
                            <Dropdown showClear id="documentTypeDropdown" value={document.documentType}
                                options={documentTypes}
                                onChange={(e) => onDropdownChangeDoc(e, 'documentType')}
                                placeholder={t("document.documentTypePlaceHolder")} filter
                                filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                                optionLabel="libelle" className='w-full'/>
                        </div> */}
                        <div className="field col-4">
                            <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                            <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                                options={documentCategories}
                                onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                                placeholder={t("document.documentCategoriePlaceHolder")} filter
                                filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                                optionLabel="libelle" className='w-full' />
                        </div>
                        {/* <div className="field col-4">
                            <label htmlFor="planClassement">Plan de Classement</label>
                            <Dropdown showClear id="planClassementDropdown" value={document.planClassement}
                                options={plans}
                                onChange={(e) => onDropdownChangeDoc(e, 'planClassement')}
                                placeholder="Plan de Classement"
                                filter
                                filterPlaceholder="Plan de Classement"
                                optionLabel="libelle"
                                className='w-full' />
                        </div> */}
                        {/* <div className="field col-4">
                            <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                            <Calendar id="uploadDate" value={document.uploadDate}
                                onChange={(e) => onInputDateChangeDoc(e, 'uploadDate')} dateFormat="dd/mm/yy"
                                showIcon={true} />
                        </div> */}
                        {/* <div className="field col-4">
                            <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                            <Dropdown showClear id="utilisateurDropdown" value={document.utilisateur} options={utilisateurs}
                                onChange={(e) => onDropdownChangeDoc(e, 'utilisateur')}
                                placeholder={t("document.utilisateurPlaceHolder")} filter
                                filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" 
                                className='w-full'/>
                        </div> */}
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label>
                            <Dropdown showClear id="entiteAdministrativeDropdown" 
                                value={document?.entiteAdministrative?.libelle}
                                options={entiteAdministratives.map((entite)=> entite.libelle)}
                                onChange={(e) => {
                                    const selectedEntite = entiteAdministratives.find(entite => entite.libelle == e?.value) || null as any
                                    setDocument((prevState) => ({ ...prevState, ["entiteAdministrative"]: selectedEntite }));                                    
                                }}
                                placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                                filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                                className='w-full'/>
                        </div>
                    </div>
                }
            </Dialog>
            <div className={`m-4 ${activeIndex !== 1 && 'hidden'}`}>
                {stepPreset &&
                    <Fieldset legend={
                        <>
                            {stepPreset.title} <Tag value={`Level: ${stepPreset.level}`} className="ml-2" />
                        </>
                    }
                        style={{ marginBottom: "1rem" }}
                        toggleable
                        collapsed={false} // Utilise l'état pour définir si le Fieldset est ouvert ou fermé
                        onToggle={(e) => setIsCollapsed(e.value)}
                    >
                        <div className="flex flex-row "  >

                            <div className="flex-1 mr-0">

                                <div className="grid col-12 mt-0">
                                    <label htmlFor="title" className='col-2 font-bold mt-0'>{t("workflow.titre")}</label>
                                    <span className='col-1 font-bold'  >:</span>
                                    <p className='col-9' id="reference" >{stepPreset.title}</p>
                                </div>

                                <div className="col-12 grid">
                                    <label htmlFor="actions" className='col-2 font-bold pt-1'>{t("workflow.Action")} </label>
                                    <span className='col-1 font-bold'  >:</span>

                                    <div className="flex flex-wrap col-9 gap-2 ">
                                        {stepPreset.actions?.length === 0
                                            ?
                                            <Tag className="mr-2" icon="pi pi-info-circle" severity="warning" value="No actions"></Tag>
                                            :
                                            stepPreset.actions?.map((action, index) => (
                                                <Tag key={index} className={`${getActionPalette(action).className} h-fit w-fit p-1.5`}>
                                                    <div className="flex align-items-center font-sm gap-2 p-0">
                                                        <i className={`${getActionPalette(action).icon}`}   />
                                                        <span className='text-sm'>{getActionPalette(action).label}</span>
                                                    </div>
                                                </Tag>
                                            ))
                                        }

                                        <Tag className={`${getActionPalette(ACTION.REJECT).className} h-fit w-fit p-1.5`}>
                                            <div className="flex align-items-center font-sm gap-2 p-0">
                                                <i className={`${getActionPalette(ACTION.REJECT).icon}`} />
                                                <span className='text-sm'>{getActionPalette(ACTION.REJECT).label}</span>
                                            </div>
                                        </Tag>
                                    </div>
                                </div>

                                <div className="col-12 grid">
                                    <label htmlFor="description" className='col-2 font-bold'>{t("workflow.Description")} </label>
                                    <span className='col-1 font-bold'  >:</span>
                                    <p className='col-9' id="description" >{stepPreset.description}</p>
                                </div>

                                <div className="col-12 grid">
                                    <label htmlFor="destinataires" className='col-2 mt-2 font-bold'>{t("workflow.Destinataire")} </label>
                                    <span className='col-1 font-bold mt-2'  >:</span>

                                    <div className="col-9 flex flex-wrap gap-2">
                                        {
                                            stepPreset.destinataires?.length === 0
                                                ?
                                                <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="No destinataires"></Tag>
                                                :
                                                stepPreset.destinataires?.map((destinataire, index) =>(
                                                    <div key={index} className="flex flex-row surface-300 border-round-3xl p-0 pr-3 align-items-center gap-2">
                                                        <img className='' alt="" src="/user-avatar.png" width="36" />
                                                        <div className='flex flex-column justify-content-around '>
                                                            <span className='text-sm font-bold text-800'>{destinataire.utilisateur?.nom} {destinataire.utilisateur?.prenom}</span>
                                                            <span className='text-sm'>{destinataire.utilisateur?.email}</span>
                                                        </div>
                                                        {destinataire.shouldSign ? (
                                                            <i className="pi pi-pencil pl-2" style={{ fontSize: '1rem', color: 'black' }} />
                                                        ) : (<></>)}
                                                    </div>
                                                ))

                                        }
                                    </div>

                                </div>

                                <div className="field col-12">
                                    <Divider ></Divider>
                                    <div className="field col-12">
                                        <span className='text-blue-700 font-bold text-lg'>Documents</span>
                                    </div>
                                    <div className='field grid mt-5'>
                                        <div className="field col-4">
                                            <Button className={`border-400 ${uploadLocaly ? "" : "bg-white text-800 "}`} raised label="Charger" icon="pi pi-download" severity={uploadLocaly ? 'info' : 'secondary'} onClick={AjouterDocument} />
                                        </div>
                                        <div className="field col-4">
                                            <Button className={`border-400 ${uploadFromGed ? "" : "bg-white text-800 "}`} raised label="Importer" icon="pi pi-cloud-download" severity={uploadFromGed ? 'info' : 'secondary'} onClick={(e) => { ImporterDocument(); getDocument(); (overlayPanelDocuments.current as any)?.toggle(e) }} />
                                        </div>
                                        <div className="field col-4">
                                            <Button className={`border-400 ${hideCreatDocS ? "" : "bg-white text-800 "}`} raised label="Creer" icon="pi pi-file-edit" severity={hideCreatDocS ? 'info' : 'secondary'} onClick={handlecreateDocS} />
                                        </div>
                                    </div>
                                    {!uploadFromGed &&
                                        <div className="field col-11">
                                            <FileUpload
                                                ref={fileUploadRef}
                                                name="files[]"
                                                customUpload
                                                chooseLabel={t("choose")}
                                                uploadLabel={t("upload")}
                                                cancelLabel={t("cancel")}
                                                multiple
                                                uploadHandler={handleFileUpload}
                                                emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
                                            />
                                            {filesUploaded &&
                                                <div className="formgrid grid">
                                                    <Divider layout='horizontal'></Divider>
                                                    <div className="field col-12">
                                                        <span className='text-blue-700 font-bold text-lg'>{t("document.classifyNewDocument")}</span>
                                                    </div>
                                                    {/* <div className="field col-4">
                                                        <label htmlFor="reference">{t("document.reference")}</label>
                                                        <InputText id="reference" value={document.reference}
                                                            onChange={(e) => setDocument({ ...document, reference: e.target.value })} required
                                                            autoFocus />
                                                    </div> */}
                                                    <div className="field col-4">
                                                        <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                                                        <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                                                            options={documentCategories}
                                                            onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                                                            placeholder={t("document.documentCategoriePlaceHolder")} filter
                                                            filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                                                            optionLabel="libelle"
                                                            disabled={!item.title} />
                                                    </div>
                                                    {/* <div className="field col-4">
                                                        <label htmlFor="planClassement">Plan de Classement :</label>
                                                        <Dropdown showClear id="planClassementDropdown" value={document.planClassement}
                                                            options={plans}
                                                            onChange={(e) => onDropdownChangeDoc(e, 'planClassement')}
                                                            placeholder="Plan de Classement"
                                                            filter
                                                            filterPlaceholder="Plan de Classement"
                                                            optionLabel="libelle" />
                                                    </div> */}
                                                    {/* <div className="field col-4">
                                                        <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                                                        <Calendar id="uploadDate" value={document.uploadDate}
                                                            onChange={(e) => onInputDateChangeDoc(e, 'uploadDate')} dateFormat="dd/mm/yy"
                                                            showIcon={true} />
                                                    </div> */}
                                                    {/* <div className="field col-4">
                                                        <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                                                        <Dropdown showClear id="utilisateurDropdown" value={document.utilisateur} options={utilisateurs}
                                                            onChange={(e) => onDropdownChangeDoc(e, 'utilisateur')}
                                                            placeholder={t("document.utilisateurPlaceHolder")} filter
                                                            filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" />
                                                    </div> */}
                                                    <div className="field col-4">
                                                        <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label>
                                                        <Dropdown showClear id="entiteAdministrativeDropdown" 
                                                            value={document.entiteAdministrative?.libelle}
                                                            options={entiteAdministrativeOptions}
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
                                                <DataTable value={documents} selectionMode="multiple" selection={selectDocument} onSelectionChange={(e) => setSelectDocument(e.value as DocumentDto[])}
                                                    onRowClick={(e) => { (overlayPanelDocuments.current as any)?.hide() }} header={header} globalFilter={globalFilter}>
                                                    <Column selectionMode="multiple" style={{ width: '2em' }} />
                                                    <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                                                    <Column field="planClassement.libelle" header="Plan Classement" sortable />
                                                    <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                                                </DataTable>
                                                <div className="p-d-flex p-ai-center p-jc-between">
                                                    <Paginator onPageChange={nextPageDocument} first={start} rows={onRows} totalRecords={(dataSize as number) || 0} />
                                                </div>
                                            </OverlayPanel>
                                            <span className='mb-2 font-semibold'>Liste des documents selectionnés</span>
                                            <DataTable value={selectDocument} paginator rows={5} className='max-w-10'>
                                                <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                                                <Column field="planClassement.libelle" header="Plan Classement" sortable />
                                                <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />

                                                <Column header="Actions" body={(rowData: DocumentDto) => (
                                                    <Button icon="pi pi-eye" onClick={(e) => { setDocumentToView(rowData.id) }} severity='secondary' />
                                                )} />

                                                <Column body={(rowData: DocumentDto) => (
                                                    <Button icon="pi pi-times" severity='danger' onClick={() => removeDocumentFromSelection(rowData)} />
                                                )} />
                                            </DataTable>
                                        </>
                                    }
                                </div>


                            </div>

                            <div className="flex-1 mr-0 ml-8 overflow-auto">
                                {!hideCreatDocS && <>
                                    <div className=''>
                                        {filesUploaded && files && files.length > 0 ?
                                            (
                                                <FileViewer file={fileUrl} className=" mx-auto w-min " twoPages={false} height={850} />
                                            ) :
                                            documentToView ? (
                                                <FileViewer documentId={documentToView} className=" mx-auto w-min " twoPages={false} height={850} />
                                            ) : (
                                                <div className="  flex flex-column align-items-center justify-content-center border-double border-500 " style={{ width: '40vw', height: '70vh' }}>
                                                    <p>{t("noFileToDisplay")}</p>
                                                    <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                                                </div>
                                            )}
                                    </div>
                                </>}
                                {hideCreatDocS && <BasicDemo />}

                            </div>
                        </div>
                    </Fieldset>
                }
            </div>
            <div className={`m-4 ${activeIndex !== 2 && 'hidden'}`}>

{/* -------------------------------- workflow info ------------------------------------ */}
            
                <div className="formgrid grid ">

                    <div className="field col-6">
                        <Fieldset legend={<span className='text-blue-700 font-bold text-xl'>{t("appBar.workflow")}</span>}>

                            <div className="field grid col-12 mt-0">
                                <label htmlFor="title" className='col-2 col-fixed font-bold' >{t("workflow.titre")} </label>
                                <span className='col-1 font-bold'  >:</span>
                                <p className='col-8' id="reference" > {item.title} </p>
                            </div>

                            <div className="field grid col-12 mt-0">
                                <label htmlFor="title" className='col-2 col-fixed font-bold pt-1' >{t("workflow.flag")} </label>
                                <span className='col-1 font-bold'  >:</span>
                                {FlagCell(item.flag)}
                            </div>

                            <div className="field grid col-12 mt-0">
                                <label htmlFor="description" className='col-2 col-fixed font-bold'>{t("workflow.Description")} </label>
                                <span className='col-1 font-bold'  >:</span>
                                <span className='col-8' id="description" >{item.description}</span>
                            </div>

                            <div className="field grid col-12 mt-0 ">   
                                {workflowDocumentView(selectDocumentWorkflow)}
                            </div>

                            <div className="field grid col-12 mt-0 ">
                                <label htmlFor="wfDocuments" className='col-2 font-bold my-auto '>{t("Pieces jointes")} </label>
                                <span className='col-1 font-bold mt-2 my-auto '  >:</span>
                                <div className="col-8 flex flex-wrap gap-3">
                                    {
                                        pieceJointes.length > 0 ?
                                            pieceJointes.map((doc, index) => (
                                                <Chip
                                                    label={doc.reference}
                                                    icon="pi pi-file"
                                                    className="text-sm cursor-pointer hover:bg-primary"
                                                    style={{ width: 'fit-content' }}
                                                    onClick={(e) => setDocumentToView(doc.id)}
                                                />
                                            ))
                                            :
                                            <Tag className="p-1.6" icon="pi pi-info-circle"  severity="warning" value="aucun"></Tag>
                                    }
                                </div>
                            </div>
                        </Fieldset>

{/* ------------------------------ Steps Info ---------------------------- */}

                        <Fieldset
                            className='mt-5'
                            legend={
                                <div className='flex flex-row gap-3'>
                                    <span className='text-blue-700 font-bold text-xl mt-2'>{t("workflow.StepList")}</span>
                                    <div className='mt-1'>
                                        <Button icon="pi pi-align-justify" className={`p-1 ${tableView ? "bg-primary" : "bg-primary-reverse"}`} style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }} onClick={() => { setTableView(true), setTreeView(false) }} />
                                        <Button icon="pi pi-sitemap" className={`p-1 ${treeView ? "bg-primary" : "bg-primary-reverse"}`} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} onClick={() => { setTableView(false), setTreeView(true) }} />
                                    </div>
                                </div>
                            }>


                            <div className={`field grid col-12 mt-0 ${!tableView && "hidden"}`}>
                                <DataTable value={stepsDto} dataKey="id" paginator rows={5} >
                                    <Column field="stepPreset.title" header={t("workflow.titre")}></Column>
                                    <Column field="stepPreset.level" header={t("workflow.Level")} body={(rowData: any) => (
                                        <Badge value={rowData.stepPreset.level} />
                                    )}></Column>
                                    <Column header={t("audit.user")} body={(rowData: any) => (
                                        <>
                                            {rowData.stepPreset.destinataires.map((dest: any, index: number) => (
                                                <div key={index} className='flex align-items-center gap-2'>
                                                    <img alt="" src="/user-avatar.png" width="25" />
                                                    <span className='font-bold'>{dest.utilisateur.nom} {dest.utilisateur.prenom}</span>
                                                </div>
                                            ))}
                                        </>
                                    )} />
                                    <Column field="stepPreset.description" header={t("workflow.Description")}></Column>
                                    <Column header={t("workflow.DocList")} body={(rowData: StepDTO) => (
                                        <>
                                            {
                                                rowData.documents && rowData.documents?.length > 0 ?
                                                    rowData.documents?.map((doc, index) => (
                                                        <Chip
                                                            label={doc.reference}
                                                            icon="pi pi-file"
                                                            className="text-sm cursor-pointer m-1 hover:bg-primary"
                                                            style={{ width: 'fit-content' }}
                                                            onClick={(e) => setDocumentToView(doc.id)}
                                                        />
                                                    ))
                                                    :
                                                    <Tag className="ml-2" icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
                                            }

                                        </>
                                    )} />
                                </DataTable>
                            </div>

                            <div className={`${!treeView && "hidden"}`}>
                                {stepsHierarchy(stepsDto)}
                            </div>

                        </Fieldset>

                    </div>

                    <div className="col-6 p-0 pl-5 m-0 overflow-auto ">

                        <div className='p-0 m-0 '>
                            {
                                documentToView ? (
                                    <div >
                                        <FileViewer documentId={documentToView} className=" mx-auto w-min " twoPages={false} height={850} />
                                    </div>
                                ) : (
                                    <div className="  flex flex-column align-items-center justify-content-center border-double border-500 " style={{ width: '40vw', height: '70vh' }}>
                                        <p>{t("noFileToDisplay")}</p>
                                        <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </Dialog >
    )
}

export default Create
