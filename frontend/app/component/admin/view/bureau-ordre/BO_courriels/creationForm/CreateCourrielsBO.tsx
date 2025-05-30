import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EntiteAdministrativeDto } from "app/controller/model/EntiteAdministrative.model";
import { DocumentCategorieDto } from "app/controller/model/DocumentCategorie.model";
import { EntiteAdministrativeAdminService } from "app/controller/service/admin/EntiteAdministrativeAdminService.service";
import { DocumentCategorieAdminService } from "app/controller/service/admin/DocumentCategorieAdminService.service";
import axiosInstance from "app/axiosInterceptor";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { DocumentDto } from "app/controller/model/Document.model";
import { Confidentialite, ConfidentialiteOptions, CourrielBureauOrdre, EtatAvancementCourriel, PrioriteCourriel, PrioriteCourrielOptions, TypeCourriel, VoieEnvoi, VoieEnvoiOptions } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { MultiSelect } from "primereact/multiselect";
import { SelectButton } from "primereact/selectbutton";
import GeneratedNumeroCourrielPopup from "app/component/admin/view/bureau-ordre/BO_courriels/GeneratedNumeroCourrielPopup";

import { EtablissementBureauOrdre } from "app/controller/model/BureauOrdre/EtablissementBureauOrdre";
import { PlanClassementDto } from "app/controller/model/PlanClassement.model";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import ImportDocumentsFromGed from "app/component/admin/view/bureau-ordre/BO_courriels/CourrielsDocs/ImportDocumentsFromGed";
import { IntervenantCourriel, StatutIntervention } from "app/controller/model/BureauOrdre/IntervenantCourriel";
import { useCourrielsContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsProvider";
import { useRegistresContext } from "app/component/admin/view/bureau-ordre/Providers/RegistreProvider";
import { useEtablissementsBOContext } from "app/component/admin/view/bureau-ordre/Providers/EtablissementProvider";
import { useCourrielSelectionContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsSelectionProvider";
import { useCourrielCreationContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsCreationProvider";
import { useAnnotationContext } from "app/component/admin/view/bureau-ordre/Providers/AnnotationProvider";
const DWT = dynamic(() => import('app/component/dwt/DynamsoftSDK'), { ssr: false });
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import ImportDocsFromCourrierPere from "./ImportDocsFromCourrierPere";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import FileViewer from "app/component/admin/view/doc/document/preview/FileViewer";
import CreateDocument from "app/component/admin/view/bureau-ordre/BO_courriels/CourrielsDocs/CreateDoc";
import { toTitleCase } from "app/component/admin/view/bureau-ordre/BO_courriels/BO_Utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DocumentIndexElementDto } from "app/controller/model/DocumentIndexElement.model";
import { IndexElementDto } from "app/controller/model/IndexElement.model";
import { IndexElementAdminService } from "app/controller/service/admin/IndexElementAdminService.service";
import useFeatureFlags from "app/component/admin/view/featureFlag/list/FeatureFlagsComponent";
import axios from "axios";
import { set } from "date-fns";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import { WorkflowPreset } from "app/controller/model/workflow/workflowPreset";
import { WorkflowPresetService } from "app/controller/service/workflow/workflowPresetService";
import { InputSwitch } from "primereact/inputswitch";
import { StepDTO } from "app/controller/model/workflow/stepDTO";
import { WorkflowDto } from "app/controller/model/Workflow.model";
import { workflowService } from "app/controller/service/workflow/workflowService";
import { MailRequest } from "app/controller/model/mail/MailRequest";
import { MailService } from "app/controller/service/mail/mailService";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type SeverityType = 'success' | 'info' | 'warn' | 'error';
interface Props {
    showToast: (severity: SeverityType, summary: string) => void;
    isResponsable?: boolean;
}

const CreateCourrielsBureauOrdre: React.FC<Props> = ({ showToast, isResponsable = false }) => {

    const CourrielCreationTypes = {
        CourrielCreation: "CourrielCreation",
        CourrielCreationWithFiles: "CourrielCreationWithFiles",
        CourrielReponseCreation: "CourrielReponseCreation",
        CourrielReponseCreationWithFiles: "CourrielReponseCreationWithFiles",
        CourrielComplementCreation: "CourrielComplementCreation",
        CourrielComplementCreationWithFiles: "CourrielComplementCreationWithFiles"
    };

    const { planClassementId, fetchCourriels } = useCourrielsContext();
    const { connectedUser: currentUser } = useConnectedUserStore();
    const { registres } = useRegistresContext();
    const { EtablissementsBO: etablissementsBO } = useEtablissementsBOContext();
    const {
        operationType,
        typeCourriel,
        setTypeCourriel,
        showCreateCourriel: visible,
        setShowCreateCourriel: setVisible,
        launchAfterCreateSuccess,
        setLaunchAfterCreateSuccess,
        selectedDocuments,
        setSelectedDocument,
        entiteExterne,
        setEntiteExterne,
        entiteInterne,
        setEntiteInterne,
        voieEnvoi,
        setVoieEnvoi,
        numeroRegistre,
        setNumeroRegistre,
        planClassementCourriel,
        setPlanClassementCourriel,
    } = useCourrielCreationContext();
    const { selectedCourriels: courrielPere } = useCourrielSelectionContext();
    const { actions } = useAnnotationContext();

    // Declarations:
    // ============================= 
    
    const [sendMail, setSendMail] = useState(false);

    const { t } = useTranslation();
    const [files, setFiles] = useState<Blob[]>();
    const [scanedFile, setScanedFile] = useState<Blob>();

    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (scanedFile) {
            setFiles([scanedFile]);
        }
    }, [scanedFile]);

    // Dialog
    const [loading, setLoading] = useState(false);
    const onClose = () => {
        setVisible(false);
        setSelectedWorkflow(new WorkflowPreset());
        setWorkflowPresets([]);
        setHasWorkflow(false);
        setSujet('');
        setNumeroCourrielExterne('');
        setDateReception(new Date() as unknown as string);
        setDateEcheance(new Date() as unknown as string);
        setNumeroCourriel('');
        setNumeroRegistre('');
        setVoieEnvoi(VoieEnvoi.AUTRE);
        setPriorite(PrioriteCourriel.MOYENNE);
        setEntiteExterne(null);
        setFiles([]);
        setSelectedDocument([]);
        setFilesUploaded(false);
        setItem(new DocumentDto());
        setIntervenants(new IntervenantCourriel());
        setImportDocs(false);
        setCreateDocument(false);
        setScanDocs(false);
        setImportFromPere(false);
        setConfidentialite(Confidentialite.NORMAL);
        setFileUrl(null);
        setSelectedDocumentsFromPere([]);
        setDocumentToPreview(null);
        setSendMail(false);
        setLaunchAfterCreateSuccess(()=>{})
    };



    // Courriel
    const [sujet, setSujet] = useState<string>('');
    const [dateReception, setDateReception] = useState<string>(new Date() as unknown as string);
    const [dateEcheance, setDateEcheance] = useState<string>(new Date() as unknown as string);
    const [numeroCourriel, setNumeroCourriel] = useState<string>("");
    const [numeroCourrielExterne, setNumeroCourrielExterne] = useState<string>("");

    const [intervenants, setIntervenants] = useState<IntervenantCourriel>(new IntervenantCourriel());

    const [priorite, setPriorite] = useState<string>('MOYENNE');
    const [confidentialite, setConfidentialite] = useState<Confidentialite>(Confidentialite.NORMAL)
    let confidentialiteOption = ConfidentialiteOptions.filter(e => e.value === confidentialite)[0];

    const [workflowPresets, setWorkflowPresets] = useState<WorkflowPreset[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowPreset>(new WorkflowPreset());
    const [hasWorkflow, setHasWorkflow] = useState<boolean>(false);
    const fetchWorkflowPresets = async (libelle: string) => {
      const response = await WorkflowPresetService.getAllWorkflowsPresetByEntite(libelle);
      setWorkflowPresets(response.data);
    };
    const handleWorkflowChange = (e: { value: WorkflowPreset }) => {
        setSelectedWorkflow(e.value);
    };

    const getNextOption = (currentValue: Confidentialite) => {
        const currentIndex = ConfidentialiteOptions.findIndex(option => option.value === currentValue);
        const nextIndex = (currentIndex + 1) % ConfidentialiteOptions.length;
        setConfidentialite(ConfidentialiteOptions[nextIndex].value);
    };
    useEffect(() => {
        if (confidentialite === Confidentialite.TOP_CONFIDENTIEL) {
            let entiteAdministrativePresident = entiteAdministratives.find(e => e.code === president.code);
            setItem({ ...item, entiteAdministrative: entiteAdministrativePresident ?? new EntiteAdministrativeDto() });
            setEntiteInterne(entiteAdministrativePresident ?? new EntiteAdministrativeDto());
        }
        if (confidentialite === Confidentialite.CONFIDENTIEL) {
            let entiteAdministrativeCabinet = entiteAdministratives.find(e => e.code === cabinet.code);
            setItem({ ...item, entiteAdministrative: entiteAdministrativeCabinet ?? new EntiteAdministrativeDto() });
            setEntiteInterne(entiteAdministrativeCabinet ?? new EntiteAdministrativeDto());
        }
    }, [confidentialite]);

    const [planClassementCourrielOptions, setPlanClassementCourrielOptions] = useState<PlanClassementBO[]>([]);
    const fetchPlanClassementCourriel = async () => {
        return await axiosInstance.get(`${API_URL}/plan-classement-bo`).then((res) => {
            setPlanClassementCourrielOptions(res.data);
        }).catch((err) => {
            console.log('err:', err);
        });
    };


    // Documents
    const [item, setItem] = useState<DocumentDto>(new DocumentDto());

    const [filesUploaded, setFilesUploaded] = useState(false);
    const fileUploadRef = useRef(null);

    const [planClassements, setPlanClassements] = useState<PlanClassementDto[]>([]);

    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);

    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    const documentCategorieAdminService = new DocumentCategorieAdminService();

    const [importDocs, setImportDocs] = useState(false);
    const [createDocument, setCreateDocument] = useState(false);
    const [scanDocs, setScanDocs] = useState(false);
    const [importFromPere, setImportFromPere] = useState(false);
    // const [selectedDocuments, setSelectedDocument] = useState<DocumentDto[]>([]);
    const [selectedDocumentsFromPere, setSelectedDocumentsFromPere] = useState<DocumentDto[]>([]);

    // Common data between doc and courriel
    const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    const [president, setPresident] = useState<EntiteAdministrativeDto>(new EntiteAdministrativeDto());
    const [cabinet, setCabinet] = useState<EntiteAdministrativeDto>(new EntiteAdministrativeDto());
    useEffect(() => {
        axiosInstance.get<EntiteAdministrativeDto>(`${API_URL}/courriels/get-president`)
            .then((res) => {
                setPresident(res.data);
            }).catch((err) => {
                console.log('err:', err);
            });
        axiosInstance.get<EntiteAdministrativeDto>(`${API_URL}/courriels/get-cabinet`)
            .then((res) => {
                setCabinet(res.data);
            }).catch((err) => {
                console.log('err:', err);
            });
    }, []);

    // On initial render
    //const documentCategories = useSelector((state: RootState)  => state.documentCategories.documentCategories);
    useEffect(() => {
        fetchPlanClassementCourriel();
        entiteAdministrativeAdminService.getList().then(({ data }) => setEntiteAdministratives(data)).catch(error => console.log(error));
        documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));

        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
            .then(response => setPlanClassements(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, [visible]);

    const prepareCourrierByWorkflow = ()=>{        
        const workflowString = localStorage.getItem('workflow');
        if (workflowString) {
            const workflow = JSON.parse(workflowString) as WorkflowDto;          
            setSujet(workflow.title);
            setTypeCourriel(TypeCourriel.SORTANT);
            if(entiteInterne) setItem({ ...item, ["entiteAdministrative"]: entiteInterne });
            setImportDocs(true);
            setSendMail(true);
            localStorage.removeItem('workflow');
        } 
    }


    useEffect(() => {
        if(visible){
            prepareCourrierByWorkflow();
        }
    }, [visible]);

    const ajouterCourriels = async () => {
        setLoading(true);

        const isComplement: boolean = operationType?.toLowerCase() === "complement";
        const isReponse: boolean = operationType?.toLowerCase() === "reponse";
        const isUsingExistingFiles: boolean = importDocs || importFromPere;

        const form = new FormData();
        const courrielDocs: DocumentDto[] = [];

        // Setting Up courriel pere id
        if (isComplement || isReponse) {
            form.append('id', JSON.stringify(courrielPere[0]?.id));
        } else {
            form.append('id', JSON.stringify(-1));
        }

        // Setting up operation type strategy
        if (!isComplement && !isReponse && !isUsingExistingFiles) {
            form.append('createCourrielOperationType', CourrielCreationTypes.CourrielCreation);
        } else if (!isComplement && !isReponse && isUsingExistingFiles) {
            form.append('createCourrielOperationType', CourrielCreationTypes.CourrielCreationWithFiles);
        } else if (isComplement && !isUsingExistingFiles) {
            form.append('createCourrielOperationType', CourrielCreationTypes.CourrielComplementCreation);
        } else if (isComplement && isUsingExistingFiles) {
            form.append('createCourrielOperationType', CourrielCreationTypes.CourrielComplementCreationWithFiles);
        } else if (isReponse && !isUsingExistingFiles) {
            form.append('createCourrielOperationType', CourrielCreationTypes.CourrielReponseCreation);
        } else if (isReponse && isUsingExistingFiles) {
            form.append('createCourrielOperationType', CourrielCreationTypes.CourrielReponseCreationWithFiles);
        }

        const courriel: CourrielBureauOrdre = new CourrielBureauOrdre();
        initCourriel(courriel);

        // Setting up documents
        if (isUsingExistingFiles) {
            courriel.documents = selectedDocuments;
            selectedDocumentsFromPere.forEach((doc) => {
                courriel.documents.push(doc);
            });
            form.append('files', new Blob([]), 'files');
            form.append('courrielDto', JSON.stringify(courriel));
        } else {
            files?.forEach((file) => {
                if (file instanceof Blob) {
                    form.append('files', file);
                    courrielDocs.push(item);
                }
            })
            courriel.documents = courrielDocs;
            form.append('courrielDto', JSON.stringify(courriel));
        }
        await SendCreateRequest(form);
    };

    const initCourriel = (courriel: CourrielBureauOrdre) => {
        courriel.sujet = sujet;
        courriel.numeroCourrielExterne = numeroCourrielExterne;
        courriel.dateReception = dateReception;
        courriel.dateEcheance = dateEcheance;
        courriel.numeroCourriel = numeroCourriel;
        courriel.numeroRegistre = numeroRegistre;
        courriel.voieEnvoi = voieEnvoi;

        courriel.etatAvancement = isResponsable ? EtatAvancementCourriel.EN_ATTENTE : EtatAvancementCourriel.EN_COURS;
        courriel.priorite = priorite;
        courriel.type = typeCourriel;
        courriel.confidentialite = typeCourriel === "ENTRANT" ? confidentialite : Confidentialite.NORMAL;

        setIntervenants({ ...intervenants, 'statut': StatutIntervention.EN_COURS, 'done': false });
        courriel.intervenants = [intervenants];
        courriel.planClassement = planClassementCourriel ? planClassementCourriel : new PlanClassementBO();
        courriel.entiteExterne = entiteExterne ? entiteExterne : new EtablissementBureauOrdre();
        courriel.entiteInterne = entiteInterne ? entiteInterne : new EntiteAdministrativeDto();

        if(hasWorkflow){
            let stepsDto: StepDTO[] = [];
            if(selectedWorkflow.stepPresets && selectedWorkflow.stepPresets.length > 0){
                stepsDto = selectedWorkflow.stepPresets.map(stepPreset => ({
                    id: 0,
                    stepPreset: stepPreset,
                    workflowId: 0,
                    status: "WAITING",
                    discussions: [],
                    documents: [],
                    createdOn: new Date().toISOString(),
                    updatedOn: new Date().toISOString(),
                    createdBy: "",
                    updatedBy: ""
                }));
            }
            const workflow: WorkflowDto = new WorkflowDto();
            workflow.id = 0;
            workflow.title= sujet;
            workflow.description= sujet;
            workflow.flag = 'NORMALE';
            workflow.stepDTOList = stepsDto;
            workflow.workflowPresetDTO = selectedWorkflow;
            workflow.initiateurId = currentUser!.id;

            courriel.elements = { 
                "hasWorkflow": hasWorkflow.toString(),
                "WorkflowDto": JSON.stringify(workflow), 
            };
        }

        return courriel;
    };

    const queryClient = useQueryClient();
    const SendCreateRequest = async (form: FormData) => {
        axiosInstance.post(`${API_URL}/courriels/`, form)
            .then((responses) => {
                showToast(t('success.success'), t("success.operation"))
                queryClient.invalidateQueries({ queryKey: ['courriels'] });
                fetchCourriels(planClassementId);
                setLoading(false);
                if (!(operationType?.toLowerCase() === 'complement') || !(operationType?.toLowerCase() === 'reponse'))
                    displayGeneratedNumeroCourriel(responses.data.numeroCourriel);
                if(sendMail) {
                    let newMailRequest = new MailRequest();
                    let sender = (currentUser?.prenom || "") + " " + (currentUser?.nom || "");
                    newMailRequest.subject = "Progression de votre dossier de demande de certificats";
                    newMailRequest.message = `Bonjour, \n\nVotre dossier de demande de certificats a été traité. \nVous pouvez consulter les certificats signés en pièce jointe. \n\nCordialement, \n\n${sender}`;
                    newMailRequest.toEmail = entiteExterne?.email || "";
                    newMailRequest.documentIds = selectedDocuments.map(doc => doc.id);
                    MailService.sendMail(newMailRequest);
                }
                if(launchAfterCreateSuccess) launchAfterCreateSuccess();
                return responses.data
            }).catch((error) => {
                console.error('Erreur lors de la résolution des requêtes:', error);
                showToast('error', "Erreur lors de l'ajout des documents");
            });
    };

    const handleSave = async () => {
        setLoading(true);
        await ajouterCourriels();
        fetchCourriels(planClassementId);
        setLoading(false);
    };

    const handleFileUpload = (e: any) => {
        const files = e.files;
        setFiles(files);
        setFilesUploaded(true);
        showToast('success', t('success.uploadSuccess', { totalRecords: files.length }));
        handleFileUrl(files);
        startOcr(files[0]);
    };

    const handleFileUrl = (files: Blob[]) => {
        const fileUrl = files && files[0];
        if (fileUrl) {
            const localFileUrl = URL.createObjectURL(fileUrl);
            setFileUrl(localFileUrl);
        }
    }

    // autoset fields for complement and reponse
    useEffect(() => {
        if ((operationType === 'Complement' || operationType === 'Reponse') && courrielPere) {
            // setSujet(courrielPere.sujet);
            // setContenu(courrielPere.contenu);
            setEntiteExterne(courrielPere[0].entiteExterne);

            setItem({ ...item, ["entiteAdministrative"]: courrielPere[0].entiteInterne, ["utilisateur"]: courrielPere[0].entiteInterne?.chef });
            // console.log('entite interne:', courrielPere[0].entiteInterne);
            setEntiteInterne(courrielPere[0].entiteInterne);

            setPlanClassementCourriel(courrielPere[0].planClassement);
            setConfidentialite(courrielPere[0].confidentialite);
            // setNumeroCourriel(courrielPere.numeroCourriel);
            // setNumeroRegistre(courrielPere.numeroRegistre);
            setVoieEnvoi(courrielPere[0].voieEnvoi);
            setPriorite(courrielPere[0].priorite);
            // setIntervenants(courrielPere.intervenants[0]|| new IntervenantCourriel());
        }
        // to fix null in intervenants list  
        typeCourriel !== "SORTANT" ? setIntervenants({ ...intervenants, 'responsables': [] }) : null;


    }, [visible]);

    useEffect(() => {
        if (typeCourriel === "SORTANT") {
            let intervenant = new IntervenantCourriel();
            intervenant.action = "ENVOI";
            intervenant.statut = StatutIntervention.CLOTURE;
            intervenant.done = true;
            if (currentUser) {
                intervenant.responsables.push(currentUser);
                intervenant.intervenant = currentUser;
            }
            setIntervenants(intervenant);
        }
    }, [visible, currentUser]);

    const Header = () => {
        let headerTraduit = '';
        if (operationType === '') {
            if (typeCourriel.toLocaleUpperCase() === 'ENTRANT') {
                headerTraduit = t('bo.courrielEntrant');
            } else if (typeCourriel.toLocaleUpperCase() === 'SORTANT') {
                headerTraduit = t('bo.courrielSortant');
            }
        } else if (operationType?.toLocaleUpperCase() === 'COMPLEMENT') {
            headerTraduit = t('bo.complement');
        } else if (operationType?.toLocaleUpperCase() === 'REPONSE') {
            headerTraduit = t('bo.reponse');
        }

        return (
            <div className="flex flex-row justify-content-between">
                <h3 className="text-2xl font-bold">{headerTraduit}</h3>
            </div>
        )
    }

    const documentCreationOptions = () => {
        if (typeCourriel.toLowerCase() === 'entrant' && operationType?.toLowerCase() !== 'complement' && operationType?.toLowerCase() !== 'reponse') {
            return [
                { label: t("document.uploadDocuments"), value: "download" },
                { label: t("document.scanDocument"), value: "scan" },
                { label: t("document.importDocumentsFromGED"), value: "import" },
            ]
        } else if (operationType?.toLowerCase() === 'complement' || operationType?.toLowerCase() === 'reponse') {
            return [
                { label: t("document.uploadDocuments"), value: "download" },
                { label: t("document.scanDocument"), value: "scan" },
                { label: t("document.importDocumentsFromGED"), value: "import" },
                { label: t("document.textEditor"), value: "create" },
                { label: t("document.importDocumentsFromCourrierPere"), value: "importFromPere" }
            ]
        } else return [
            { label: t("document.uploadDocuments"), value: "download" },
            { label: t("document.scanDocument"), value: "scan" },
            { label: t("document.importDocumentsFromGED"), value: "import" },
            { label: t("document.textEditor"), value: "create" }
        ]
    }

    // Form validation
    const [fileSavedTextEditor, setFileSavedTextEditor] = useState(false);
    useEffect(() => {
        setFileSavedTextEditor(false);
    }, [visible]);

    const isCourrierFormValid = () => {
        if (isResponsable) {
            return sujet && dateReception && dateEcheance && entiteExterne && entiteInterne && voieEnvoi && priorite && planClassementCourriel;
        } else if (typeCourriel === 'SORTANT') {
            return sujet && dateReception && dateEcheance && entiteExterne && entiteInterne && voieEnvoi && priorite && planClassementCourriel && numeroRegistre;
        }
        return sujet && dateReception && dateEcheance && entiteExterne && entiteInterne && voieEnvoi && priorite && planClassementCourriel && numeroCourrielExterne && numeroRegistre;
    }
    const isDocumentFormValid = () => {
        if (importDocs) {
            return selectedDocuments.length > 0;
        } else if (createDocument) {
            return fileSavedTextEditor && item.documentCategorie?.code !== '' && item.uploadDate && item.planClassement?.code !== '';
        } else if (scanDocs) {
            return fileUrl !== null && item.documentCategorie?.code !== '' && item.uploadDate && item.planClassement?.code !== '';;
        } else if (importFromPere) {
            return selectedDocumentsFromPere.length > 0;
        }
        else {
            return filesUploaded && item.documentCategorie?.code !== '' && item.uploadDate && item.planClassement?.code !== '';
        }
    }
    const isDocumentUploaded = () => {
        if (importDocs) {
            return selectedDocuments.length > 0;
        } else if (createDocument) {
            return fileSavedTextEditor;
        } else if (scanDocs) {
            return fileUrl !== null;
        } else if (importFromPere) {
            return selectedDocumentsFromPere.length > 0;
        }
        else {
            return filesUploaded;
        }
    }
    const isFormValid = () => {
        return isDocumentFormValid() && isCourrierFormValid();
    }

    // Display the generated numero courriel at the end of the process
    const [generatedNumeroCourriel, setGeneratedNumeroCourriel] = useState<string>("");
    const [showNumeroCourrielDialog, setShowNumeroCourrielDialog] = useState<boolean>(false);

    const displayGeneratedNumeroCourriel = (numeroCourriel: string) => {
        if (!isResponsable) {
            setGeneratedNumeroCourriel(numeroCourriel);
            setShowNumeroCourrielDialog(true);
        }
    }

    const courrielForm = () => {
        return (
            <>
                {
                    typeCourriel === "ENTRANT" &&
                    operationType?.toLocaleLowerCase() !== 'complement' &&
                    operationType?.toLocaleLowerCase() !== 'reponse' &&
                    <div className="field col-6">
                        <label htmlFor="confidentialite">{t("bo.data.confidentialite")}</label>
                        <Button label={confidentialiteOption.label}
                            className="text-sm"
                            severity={confidentialiteOption.color as "secondary" | "info" | "danger" | "success" | "warning" | "help" | undefined}
                            onClick={() => {
                                getNextOption(confidentialiteOption.value);
                                setIntervenants({ ...intervenants, 'responsables': [] });
                            }} />
                    </div>
                }
                <div className="field col-6">
                    <label htmlFor="entiteExterne">
                        {typeCourriel === "ENTRANT" ? t('bo.data.expediteur') : t('bo.data.destinataire')}
                    </label>
                    <Dropdown
                        id="entiteExterne"
                        value={entiteExterne}
                        options={etablissementsBO.map(e => ({ label: e.nom, value: e }))}
                        placeholder={t("selectionner une entite externe")}
                        onChange={(e: any) => setEntiteExterne(e.value)}
                        filter
                        disabled={operationType === 'Complement' || operationType === 'Reponse'}
                    />
                    {!isFormValid() && !entiteExterne && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="entiteAdministrativeCode">{typeCourriel === "ENTRANT" ? t('bo.data.destinataire') : t('bo.data.expediteur')}</label>
                    <Dropdown showClear id="entiteAdministrativeDropdown"
                        value={item?.entiteAdministrative?.libelle}
                        options={entiteAdministratives.map(entiteA => entiteA.libelle)}
                        placeholder={t("document.entiteAdministrativePlaceHolder")}
                        onChange={(e) => {
                            const entite = entiteAdministratives.find(entite => entite.libelle === e.value) ?? null as any;
                            setItem({ ...item, ["entiteAdministrative"]: entite, ["utilisateur"]: entite?.chef });
                            setEntiteInterne(entite);
                            typeCourriel !== "SORTANT" ? setIntervenants({ ...intervenants, 'responsables': [] }) : null;
                            fetchWorkflowPresets(entite?.libelle);
                        }}
                        filter
                        disabled={operationType === 'Complement' || operationType === 'Reponse' || confidentialite != Confidentialite.NORMAL}
                    />
                    {!isFormValid() && !entiteInterne && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="sujet">{t("bo.data.sujet")}</label>
                    <InputText
                        id="sujet"
                        name="sujet"
                        value={sujet}
                        onChange={(e) => setSujet(e.target.value)}
                    />
                    {!isFormValid() && !sujet && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="dateReception">{t("bo.data.dateReception")}</label>
                    <Calendar
                        id="dateReception"
                        value={dateReception}
                        onChange={(e) => setDateReception(e.target.value as string)}
                        dateFormat="dd/mm/yy"
                        showIcon={true}
                    />
                    {!isFormValid() && !dateReception && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="dateEcheance">{t("bo.data.dateEcheance")}</label>
                    <Calendar
                        id="dateEcheance"
                        value={dateEcheance}
                        onChange={(e) => setDateEcheance(e.target.value as string)}
                        dateFormat="dd/mm/yy"
                        showIcon={true}
                    />
                    {!isFormValid() && !dateEcheance && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                {typeCourriel === "ENTRANT" &&
                    <div className="field col-6">
                        <label htmlFor="numeroCourrielExterne">{t("bo.data.numeroCourrielExterne")}</label>
                        <InputText
                            id="numeroCourrielExterne"
                            name="numeroCourrielExterne"
                            value={numeroCourrielExterne}
                            onChange={(e) => setNumeroCourrielExterne(e.target.value)}
                        />
                        {!isFormValid() && !numeroCourrielExterne && <small className="text-red-500">*{t("requiredField")}</small>}
                    </div>}
                {!isResponsable &&
                    <div className="field col-6">
                        <label htmlFor="registre">{t("bo.registre.registre")}</label>
                        <Dropdown
                            id="registre"
                            value={numeroRegistre}
                            options={registres.map(registre => ({ label: registre.libelle, value: registre.numero }))}
                            onChange={(e) => setNumeroRegistre(e.target.value as string)}
                        />
                        {!isFormValid() && !numeroRegistre && <small className="text-red-500">*{t("requiredField")}</small>}
                    </div>}
                <div className="field col-6">
                    <label htmlFor="voieEnvoi">{t("bo.data.voiEnvoi")}</label>
                    <Dropdown
                        id="voieEnvoi"
                        value={voieEnvoi}
                        options={VoieEnvoiOptions}
                        onChange={(e) => setVoieEnvoi(e.value)}
                    />
                    {!isFormValid() && !voieEnvoi && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="PlanClassementBo">{t("bo.planClassement")}</label>
                    <Dropdown
                        id="PlanClassementBo"
                        value={planClassementCourriel}
                        options={planClassementCourrielOptions}
                        onChange={(e) => setPlanClassementCourriel(e.value)}
                        placeholder={"Selectionner un plan pour le courriel"}
                        filter
                        optionLabel="libelle"
                        disabled={operationType === 'Complement' || operationType === 'Reponse'}
                    />
                    {!isFormValid() && !planClassementCourriel && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                <div className="field col-6 mt-2">
                    <label htmlFor="priorite">{t("bo.data.priorite")}</label>
                    <Dropdown
                        id="priorite"
                        value={priorite}
                        options={PrioriteCourrielOptions}
                        placeholder={t("Priorite")}
                        onChange={(e) => setPriorite(e.value)}
                    />
                    {!isFormValid() && !priorite && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>
                {typeCourriel === "ENTRANT" && operationType?.toLowerCase() !== 'reponse' && operationType?.toLowerCase() !== 'complement' &&
                    <>
                        <div className="field col-6 mt-2">
                            <label htmlFor="intervenants">{t("bo.intervenants")}</label>
                            <MultiSelect
                                id="intervenants"
                                value={intervenants?.responsables}
                                options={item?.entiteAdministrative?.utilisateurs}
                                placeholder={t("selectionner des intervenants")}
                                onChange={(e) => setIntervenants({ ...intervenants, responsables: e.value })}
                                filter
                                optionLabel="nom"
                                multiple
                                disabled={item?.entiteAdministrative?.utilisateurs?.length === 0} />
                        </div>
                        <div className="field col-6 mt-2">
                            <label htmlFor="annotation">{t("bo.action")}</label>
                            <Dropdown
                                id="annotation"
                                value={intervenants?.action}
                                options={actions.map(e => ({ label: e, value: e }))}
                                onChange={(e) => setIntervenants({ ...intervenants, action: e.value })} />
                        </div>
                    </>
                }
                {typeCourriel === "ENTRANT" &&
                    <div className="field col-6">
                        <label htmlFor="Workflow">{t('bo.envoyerWF')}</label>
                        <InputSwitch id="hasWorkflow" checked={hasWorkflow} onChange={(e) => setHasWorkflow(!hasWorkflow)} className="ml-3" />
                        <Dropdown
                            id="workflow-dropdown"
                            value={selectedWorkflow}
                            options={workflowPresets.map(preset => ({ label: preset.title, value: preset }))}
                            onChange={handleWorkflowChange}
                            placeholder="Choose a workflow"
                            filter
                            disabled={!hasWorkflow}
                        />
                        {hasWorkflow && selectedWorkflow.title === '' && <small className="text-red-500">*{t("requiredField")}</small>}
                    </div>
                }
            </>
        );
    }


    const [documentToPreview, setDocumentToPreview] = useState<DocumentDto | null>();
    const courrielDocsData = () => {
        return (
            <>
                {!importDocs && !importFromPere && <div className="field col-4">
                    <label htmlFor="documentCategorieCode">{t("document.documentCategorie")}</label>
                    <Dropdown showClear id="documentCategorieDropdown"
                        value={item?.documentCategorie}
                        options={documentCategories}
                        placeholder={t("document.documentCategoriePlaceHolder")}
                        onChange={(e) => {
                            setItem({ ...item, ['documentCategorie']: e.value })
                        }}
                        filter
                        optionLabel={t("libelle")} />
                    {!isFormValid() && item?.documentCategorie?.code === '' && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>}
                {!importDocs && !importFromPere && <div className="field col-4">
                    <label htmlFor="uploadDate">{t("document.documentDate")}</label>
                    <Calendar
                        id="uploadDate"
                        value={item.uploadDate ? new Date(item.uploadDate) : new Date()}
                        onChange={(e) => {
                            const dateValue = e.value instanceof Date ? e.value : new Date()
                            setItem({ ...item, ["uploadDate"]: dateValue })
                        }}
                        showIcon={true}
                    />
                    {!isFormValid() && !item?.uploadDate && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>}
                {!importDocs && !importFromPere && <div className="field col-4">
                    <label htmlFor="planClassementCode">{t("document.classificationPlan")}</label>
                    <Dropdown showClear id="planClassementDropdown"
                        value={item?.planClassement}
                        options={planClassements}
                        placeholder={"Selectionner un plan"}
                        onChange={(e) => {
                            setItem({ ...item, ["planClassement"]: e.value });
                        }}
                        filter
                        optionLabel="libelle" />
                    {!isFormValid() && item?.planClassement?.code === '' && <small className="text-red-500">*{t("requiredField")}</small>}
                </div>}
                {!importDocs && !importFromPere && <div className="field col-12">
                    <label htmlFor="description">{t("document.description")}</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={item?.description || ""}
                        onChange={(e) => {
                            setItem({ ...item, description: e.target.value });
                        }}
                        rows={4} cols={30} />
                </div>}
                {!importDocs && !importFromPere && !createDocument && !scanDocs && <div className="field col-12">
                    <label>{t("document.files")}</label>
                    <FileUpload
                        ref={fileUploadRef}
                        name="files[]"
                        multiple
                        customUpload //change status file in upload to completed
                        uploadHandler={handleFileUpload}
                        chooseLabel={t('choose')}
                        uploadLabel={t('upload')}
                        cancelLabel={t('cancel')}
                        emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
                    />
                    {!isFormValid() && !filesUploaded && <small className="text-red-500">*{t("document.uploadDocuments")}</small>}
                </div>}
                {/* ----------------------- importer depuis GED ----------------------- */}
                {importDocs && <div className="field col-12">
                    <ImportDocumentsFromGed selectedDocuments={selectedDocuments} setSelectedDocuments={setSelectedDocument} setDocumentToPreview={setDocumentToPreview} />
                    {!isFormValid() && selectedDocuments.length === 0 && <small className="text-red-500">*{t("document.importDocumentsFromGED")}</small>}
                </div>}
                {/* // importer les document du courriel pere (Pour Reponse ou Complement) */}
                {importFromPere && (operationType?.toLowerCase() === 'complement' || operationType?.toLowerCase() === 'reponse') &&
                    <div className="w-full">
                        <label className="p-2 ">{t('Inclure des documents du courrier Pere')}</label>
                        <ImportDocsFromCourrierPere courrielPere={courrielPere[0]} selectedDocumentsFromPere={selectedDocumentsFromPere} setSelectedDocumentsFromPere={setSelectedDocumentsFromPere} setDocumentToPreview={setDocumentToPreview} />

                    </div>
                }
            </>
        );
    }



    const { featureFlags, isActiveBack, isActiveFront } = useFeatureFlags();

    const [loadingOcr, setLoadingOcr] = useState<boolean>(false);
    const [errorOcr, setErrorOcr] = useState<boolean>(false);

    const [OCR_URL, setOCR_URL] = useState<string>('');
    useEffect(() => {
        const feature = isActiveFront('ocr');
        if (feature) {
            const OCR_URL = `${process.env.NEXT_PUBLIC_ADMIN_URL}document/ocr`;
            setOCR_URL(OCR_URL);
        } else {
            const OCR_URL = `${process.env.NEXT_PUBLIC_OCR_GDP_URL}`;
            setOCR_URL(OCR_URL);
        }
    }, [featureFlags])

    const startOcr = (file: Blob) => {
        setErrorOcr(false);
        setLoadingOcr(true);
        const formData = new FormData();
        formData.append('language', encodeURIComponent('fra+ara'));
        formData.append('file', file);

        if (item.documentIndexElements == null) {
            item.documentIndexElements = new Array<DocumentIndexElementDto>();
        }

        axios.post(`${OCR_URL}`, formData).then((response) => {
            const data = response.data;
            if (data) {
                setLoadingOcr(false);
                setItem({ ...item, content: data });
            }
        }).catch((error) => {
            console.error('Erreur lors de la résolution des requêtes:', error);
            setLoadingOcr(false);
            setErrorOcr(true);
        });
    };

    const [documentIndexElements, setDocumentIndexElements] = useState<DocumentIndexElementDto>(new DocumentIndexElementDto());
    const [errors, setErrors] = useState({ indexElement: false, value: false });
    const [indexElements, setIndexElements] = useState<IndexElementDto[]>([]);
    const indexElementAdminService = new IndexElementAdminService();
    useEffect(() => {
        indexElementAdminService.getList().then(({ data }) => setIndexElements(data)).catch(error => console.log(error));
    }, [visible]);

    const addDocumentIndexElements = () => {
        if (documentIndexElements.indexElement.libelle.trim() === '') {
            setErrors(prevState => ({ ...prevState, indexElement: true }));
        } else {
            setErrors(prevState => ({ ...prevState, indexElement: false }));
        }
        if (!documentIndexElements.value) {
            setErrors(prevState => ({ ...prevState, value: true }));
        } else {
            setErrors(prevState => ({ ...prevState, value: false }));
        }
        if (documentIndexElements.indexElement.libelle.trim() === '' || !documentIndexElements.value) {
            return;
        }
        if (item.documentIndexElements == null)
            item.documentIndexElements = new Array<DocumentIndexElementDto>();
        let _item = documentIndexElements;
        if (!_item.id) {
            item.documentIndexElements.push(_item);
            setItem((prevState: any) => ({ ...prevState, documentIndexElements: item.documentIndexElements }));
        } else {
            const updatedItems = item.documentIndexElements.map((item) => item.id === documentIndexElements.id ? { ...documentIndexElements } : item);
            setItem((prevState: any) => ({ ...prevState, documentIndexElements: updatedItems }));
        }
        setDocumentIndexElements(new DocumentIndexElementDto());
    };

    const deleteDocumentIndexElements = (rowData: any) => {
        const updatedItems = item.documentIndexElements.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentIndexElements: updatedItems }));
        setDocumentIndexElements(new DocumentIndexElementDto());
    };

    const onDropdownChangeDocumentIndexElements = (e: any, field: string) => {
        setDocumentIndexElements((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onInputTextChangeDocumentIndexElements = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDocumentIndexElements({ ...documentIndexElements, [name]: val })
    };

    const docsIndexation = () => {
        return (
            <div className={`m-4`}>
                <div>
                    <div className="grid">
                        <div className="field col-8">
                            <label htmlFor="content">{t("document.content")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="content" value={item.content}
                                    onChange={(e) => { }} rows={15} cols={30} disabled={!isDocumentUploaded()} />
                            </span>
                        </div>
                        <div className="field col-4">
                            <div className="field col-12">
                                <label htmlFor="indexElement">{t("documentIndexElement.indexElement")}</label>
                                <Dropdown id="indexElementDropdown" value={documentIndexElements.indexElement}
                                    options={indexElements}
                                    onChange={(e) => onDropdownChangeDocumentIndexElements(e, 'indexElement')}
                                    placeholder={t("documentIndexElement.indexElementPlaceHolder")} filter
                                    filterPlaceholder={t("documentIndexElement.indexElementPlaceHolderFilter")}
                                    optionLabel="libelle" autoFocus onClick={() => { }}
                                    disabled={!isDocumentUploaded()}
                                />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="value">{t("documentIndexElement.value")}</label>
                                <InputTextarea id="value" value={documentIndexElements.value}
                                    onChange={(e) => onInputTextChangeDocumentIndexElements(e, 'value')}
                                    rows={5} onClick={() => { }}
                                    disabled={!isDocumentUploaded()}
                                />
                            </div>
                            <div className="field col-12">
                                <Button
                                    raised label={t("save")}
                                    onClick={addDocumentIndexElements}
                                    disabled={!isDocumentUploaded()}
                                />
                            </div>
                        </div>
                    </div>
                    <DataTable value={item.documentIndexElements} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="indexElement.libelle"
                            header={t("documentIndexElement.indexElement")}></Column>
                        <Column field="value" header={t("documentIndexElement.value")}></Column>
                        <Column field="description" header={t("documentIndexElement.description")} hidden></Column>
                        <Column header={t("actions")} body={(rowData) => (<div>
                            <Button raised icon="pi pi-times" severity="warning" className="mr-2 p-button-danger"
                                onClick={() => deleteDocumentIndexElements(rowData)} />
                            {/* <Button raised  icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDocumentIndexElements(rowData)} />  */}
                        </div>)}></Column>
                    </DataTable>
                </div>
            </div>
        );
    };

    return (
        <>
            <Dialog
                visible={visible}
                closeOnEscape
                style={{ width: '85vw', height: '95vh' }}
                header={<Header />}
                modal
                className="p-fluid"
                onHide={onClose}
                footer={
                    <>
                        <div>
                            <Button label={t('cancel')} severity="danger" onClick={onClose} />
                            <Button label={t('save')}
                                className="hover:bg-green-700"
                                disabled={!isFormValid()}
                                loading={loading}
                                onClick={async () => {
                                    await handleSave();
                                    onClose();
                                }}
                            /> : <></>
                        </div>
                    </>
                }
            >

                <div>
                    <SelectButton
                        className="mb-3"
                        value={importDocs ? "import" : createDocument ? "create" : scanDocs ? "scan" : importFromPere ? "importFromPere" : "download"}
                        options={documentCreationOptions()}
                        onChange={(e) => {
                            setImportDocs(e.value === "import");
                            setCreateDocument(e.value === "create");
                            setScanDocs(e.value === "scan");
                            setImportFromPere(e.value === "importFromPere");
                            setFileUrl(null);
                            setDocumentToPreview(null);
                            setFiles([]);
                        }}
                    />
                </div>
                {!scanDocs && <div className="flex flex-row">
                    <div className="formgrid grid flex-1">
                        {/*----------------------------------- Courriel Related --------------------------*/}
                        <Divider align="left">
                            <span className="p-tag">{toTitleCase(t('bo.courriel'))}</span>
                        </Divider>
                        {courrielForm()}
                        {/* ----------------------------------- Documents Related ---------------------------- */}
                        <Divider align="left">
                            <span className="p-tag">{toTitleCase(t('audit.document'))}</span>
                        </Divider>
                        {courrielDocsData()}
                    </div>
                    {
                        <div className="flex-1  w-full  pl-5" style={{ height: "70%" }}>
                            <div className={createDocument ? "" : ""} style={{ width: '40vw', height: '120vh' }}>
                                {/* -------------------------- Text Editor -------------------------- */}
                                {createDocument &&
                                    <div>
                                        {!isFormValid() && !fileSavedTextEditor && <small className="text-red-500">*{t("document.saveDocument")}</small>}
                                        <CreateDocument showToast={showToast} files={files}
                                            setFiles={(files) => {
                                                setFiles(files);
                                                handleFileUrl(files);
                                                startOcr(files[0]);
                                            }}
                                            setFileSaved={setFileSavedTextEditor} />
                                    </div>
                                }

                                {/* -------------------------- File viewer -------------------------- */}
                                {!createDocument && <>
                                    <div className="overflow-auto" style={{ width: '40vw', height: '100vh' }} >
                                        {(fileUrl) ? (
                                            <div className="" >
                                                <FileViewer file={fileUrl} className=" mx-auto w-min " twoPages={false} height={850} />
                                            </div>
                                        ) :
                                            (documentToPreview) ? (
                                                <div className="" >
                                                    <FileViewer documentId={documentToPreview.id} className=" mx-auto w-min " twoPages={false} height={850} />
                                                </div>
                                            ) :
                                                (<>
                                                    <div className="  flex flex-column align-items-center justify-content-center border-double border-500 " style={{ width: '40vw', height: '100vh' }}>
                                                        <p>{t("noFileToDisplay")}</p>
                                                        <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                                                    </div>
                                                </>)}
                                    </div>

                                </>}
                            </div>
                        </div>}

                </div>}
                {/* -------------------------- scan -------------------------- */}
                {scanDocs &&
                    <div className="formgrid grid">

                        <Divider align="left">
                            <span className="p-tag">{toTitleCase(t('bo.courriel'))}</span>
                        </Divider>
                        {courrielForm()}

                        <Divider align="left">
                            <span className="p-tag">{toTitleCase(t('audit.document'))}</span>
                        </Divider>
                        {courrielDocsData()}
                        <div className="field col-12">
                            <DWT
                                setUploadedFile={(blob: Blob) => {
                                    setScanedFile(blob);
                                    handleFileUrl([blob]);
                                    startOcr(blob);
                                }}
                                features={[
                                    "scan",
                                    "load",
                                    "save",
                                    "upload",
                                    "uploader"
                                ]}
                            />
                        </div>
                    </div>}

                {/* -------------------------- OCR -------------------------- */}
                {!importDocs && !importFromPere && <>
                    {loadingOcr && <div className="flex justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>}
                    {errorOcr && <div className="flex justify-content-center">
                        <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                    </div>}
                    {!loadingOcr && !errorOcr && <>
                        <>
                            <Divider align="center">
                                <span className="p-tag">{toTitleCase(t('document.documentIndexElements'))}</span>
                            </Divider>
                            {docsIndexation()}
                        </>
                    </>}
                </>}

            </Dialog>
            <GeneratedNumeroCourrielPopup
                visible={showNumeroCourrielDialog}
                generatedNumeroCourriel={generatedNumeroCourriel}
                cancelNumeroCourrielDialog={() => {
                    setGeneratedNumeroCourriel("");
                    setShowNumeroCourrielDialog(false);
                }}
            />
        </>
    );
};

export default CreateCourrielsBureauOrdre