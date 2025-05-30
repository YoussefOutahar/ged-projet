import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { Tag } from 'primereact/tag';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { ACTION } from 'app/controller/model/workflow/stepPresetDTO';
import { stepService } from 'app/controller/service/workflow/stepService';
import { Toast } from 'primereact/toast';
import { pdfjs } from "react-pdf";
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { DocumentDto } from 'app/controller/model/Document.model';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputTextarea } from 'primereact/inputtextarea';
import * as Yup from 'yup';
import { CommentaireDTO } from 'app/controller/model/workflow/commentaireDTO';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { t } from 'i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MessageService } from 'app/zynerator/service/MessageService';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import axiosInstance from 'app/axiosInterceptor';
import AjouterDocument from './AjouterDocument';
import { Steps } from 'primereact/steps';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import useListHook from 'app/component/zyhook/useListhook';
import { parapheurService } from 'app/controller/service/parapheur/parapheurService.service';
import { workflowService } from 'app/controller/service/workflow/workflowService';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import FileViewer from 'app/component/admin/view/doc/document/preview/FileViewer';
import { Divider } from 'primereact/divider';
import { FileUpload } from 'primereact/fileupload';
import { CompareRequest } from 'app/controller/model/CompareRequest.model';
import OtpProcess, { OtpProcessHandles, OtpType } from 'app/component/otp/otp_process';
import Discussions from './Discussions';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DocumentTypeDto } from 'app/controller/model/DocumentType.model';
import { DocumentTypeAdminService } from 'app/controller/service/admin/DocumentTypeAdminService.service';
import { DocumentSummaryDto } from 'app/controller/model/DocumentSummary.model';
import { ParapheurDto } from 'app/controller/model/parapheur/parapheurDto.model';
import ParapheurViewer from 'app/component/admin/view/doc/document/preview/ParapheurViewer';
import ParapheurComments from 'app/component/admin/view/doc/parapheur/ParapheurComments';
import { StatusEnum } from 'app/controller/model/enums/StatusEnum';
import { useRouter } from 'next/router';
import { useCourrielCreationContext } from '../bureau-ordre/Providers/CourrielsCreationProvider';
import { associateDocumentType } from 'app/utils/documentUtils';
import EtablissementParCE from './components/EtablissementParCE';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const validationSchema = Yup.object({
  rejectReason: Yup.string().required("Un motif de rejet est requis."),
});

const initialValues = {
  rejectReason: '',
};

interface DocumentViewerProps {
  loading: boolean;
  error: boolean;
  documentBase64: string[];
  numPages: number;
  pageNumber: number;
  onPageChange: (pageNumber: number) => void;
  setNumPages: (numPages: number) => void;
}

type Props = {
  step: StepDTO;
  workflow: WorkflowDTO;
  refetch: () => void;
}

const TacheT = ({ workflow, step, refetch }: Props) => {

  const otpRef = React.useRef<OtpProcessHandles>(null);

  const { setShowCreateCourriel, setLaunchAfterCreateSuccess } = useCourrielCreationContext();

  const [visible, setVisible] = useState(false);
  const [visibleStepDes, setvisibleStepDes] = useState(false);
  const [visibleWFDes, setvisibleWFDes] = useState(false);
  const [visibleDDT, setvisibleDDT] = useState(false);
  const toast = useRef<Toast>(null); // Ensure toast is properly referenced
  const documentAdminService = new DocumentAdminService();
  const documentCategorieAdminService = new DocumentCategorieAdminService();
  const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
  const utilisateurAdminService = new UtilisateurAdminService();
  const [visibleRejectDialog, setVisibleRejectDialog] = useState(false);
  const authService = new AuthService();
  const utilisateurService = new UtilisateurAdminService();
  const [currentAction, setCurrentAction] = useState<any>();
  const [viewDocument, setViewDocument] = useState(false);
  const [documentIdToView, setDocumentIdToView] = useState<number>();
  const [allDocuments, setAllDocuments] = useState<any[]>([]); // Collect all documents here
  const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
  const [commentaire, setCommentaire] = useState<CommentaireDTO>({
    id: 0,
    stepId: step.id,
    utilisateur: connectedUser,
    message: ' ',
  });

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setActiveIndex(1);
  }
  const showStepDescriptionDialog = () => setvisibleStepDes(true);
  const hideStepDescriptionDialog = () => setvisibleStepDes(false);
  const showWFDescriptionDialog = () => setvisibleWFDes(true);
  const hideWFDescriptionDialog = () => setvisibleWFDes(false);
  const [documentBase64, setDocumentBase64] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const service = new DocumentAdminService();
  const [PreviousSteps, setPreviousSteps] = useState<StepDTO[]>([]);
  const [NextSteps, setNextSteps] = useState<StepDTO[]>([]);
  const [priviousStepVisible, setPriviousStepVisible] = useState(true);
  const [nextStepVisible, setNextStepVisible] = useState(true);
  const [rejectParapher, setRejectParapher] = useState(false);
  const [rejectDocParapher, setRejectDocParapher] = useState(false);
  const [viewDocumentParapher, setViewDocumentParapher] = useState(false);
  const [selectedDocumentsParapher, setSelectedDocumentsParapher] = useState<DocumentDto[]>([]);
  const [viewWorflowDocs, setViewWorflowDocs] = useState(false);
  const [viewWorflowPJDocs, setViewWorflowPJDocs] = useState(false);
  const [viewWorflowParapheurs, setViewWorflowParapheurs] = useState(false);
  const [viewStepDocs, setViewStepDocs] = useState(false);
  const [pjAddedSuccess, setPjAddedSuccess] = useState<boolean>(false);
  const [pieceJointes, setPieceJointes] = useState<DocumentDto[]>([]);
  const [pieceJointeDialog, setPieceJointeDialog] = useState<boolean>(false);
  const [showEtablissemntParCEDiaglog, setShowEtablissemntParCEDiaglog] = useState<boolean>(false);
  const fileUploadPJRef = useRef(null);

  const loadDocument = (documentId: number, type: any) => {
    setLoading(true);
    setError(false);
    let serviceCall;
    if (type === 'step') {
      serviceCall = service.getDocumentBase64(documentId);
    } else if (type === 'workflow') {
      serviceCall = service.getDocumentBase64(documentId);
    }

    if (serviceCall) {
      serviceCall.then(response => {
        setDocumentBase64(response.data);
      }).catch(() => {
        setError(true);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const getDocumentBase64 = (index: number) => {
    setLoading(true);
    documentAdminService.getDocumentBase64(index)
      .then(({ data }) => {
        setDocumentBase64(data);
      })
      .catch((error) => {
        setError(true);
        MessageService.showError(toast.current, "Error!", "Une erreur s'est produite lors de la récupération du document");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };


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
            <div style={{ width: "100%", height: 620, padding: "10px" }}>
              <iframe src={`data:application/pdf;base64,${documentBase64}`} width="100%" height="100%" title="document" />
            </div>
          </div>
        )}
      </>
    );
  };

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
  const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
  const [documentActionsInStep, setDocumentActionsInStep] = useState<DocumentDto[]>([]);
  const [documentPresignInStep, setDocumentPresignInStep] = useState<DocumentDto[]>([]);
  const [addDocStep, setAddDocStep] = useState<boolean>(false);
  const [workflowPV, setWorkflowPV] = useState<WorkflowDTO>();

  useEffect(() => {
    setWorkflowPV(workflow);
  }, []);

  useEffect(() => {
    documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
    entiteAdministrativeAdminService.getList().then(({ data }) => setEntiteAdministratives(data)).catch(error => console.log(error));
    utilisateurAdminService.getList().then(({ data }) => {
      setUtilisateurs(data);
    }).catch(error => console.log(error));
    axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
      .then(response => setPlans(response.data))
      .catch(error => console.error('Error loading plans', error));
  }, []);

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

  useEffect(() => {
    if (step.documents && step.documents.length > 0) {
      loadDocument(step.documents[0].id, 'step');
    }
  }, [step]);

  const [documentActions, setDocumentActions] = useState<DocumentDto[]>([]);
  useEffect(() => {
    if (workflow && workflow.id)
      workflowService.getDocumentActions(workflow.id).then(({ data }) => setDocumentActions(data)).catch(error => console.log(error));
  },[]);

  useEffect(() => {
    stepService.getPriviousStep(step.id)
      .then(({ data, status }) => {
        if (status === 204) {
          setPriviousStepVisible(false);
        } else if (data !== null) {
          setPreviousSteps(data);
          setPriviousStepVisible(true);
        }
      })
      .catch((error) => {
        setPriviousStepVisible(false);
        console.error('Error loading previous step', error);
      });

    stepService.getNextStep(step.id)
      .then(({ data, status }) => {
        if (status === 204) {
          setNextStepVisible(false);
        } else if (data !== null && data.length > 0) {
          setNextSteps(data);
          setNextStepVisible(true);
        } else {
          setNextStepVisible(false);
        }
      })
      .catch((error) => {
        setNextStepVisible(false);
        console.error('Error loading next step', error);
      });
      stepService.getDocumentsActionsByStep(step.id).then(({ data }) => setDocumentActionsInStep(data)).catch(error => console.log(error));
      if(step.actions?.includes(ACTION.PRESIGNER) || step.actions?.includes(ACTION.APPROVE)){
        stepService.getDocumentsPresign(step.id).then(({ data }) => setDocumentPresignInStep(data)).catch(error => console.log(error));
      }
  }, [step]);

  function truncateText(text: any, length = 10) {
    return text?.length > length ? (
      <div>
        {`${text.substring(0, length)}...  `}
      </div>
    ) : (
      text
    );
  }
  const parapher = async (stepId: number) => {
    await createParapheur();

      stepService.parapherStep(stepId, connectedUser.id).then(response => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Step approved successfully', life: 3000 });
        if(step.stepPreset.actions?.includes(ACTION.APPROVE) && !rejectParapher){
          approveStep(stepId);
        }
        hideDialog();
        refetch();
      }).catch(error => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error approving Step', life: 3000 });
      });
    
  }
  const presigner = (stepId: number) => {
    const workflowSteps = workflow.stepDTOList;
    if (workflowSteps) {
      const lastStep = workflowSteps.find(step => step.stepPreset.actions?.includes(ACTION.SIGN));
      const destinataires = lastStep ? lastStep.stepPreset.destinataires : [];
      // const destinatairesLastStep = lastStep.stepPreset.destinataires || [];
      // const destinataireStep = step.stepPreset.destinataires || [];
      // const destinataires = [...destinatairesLastStep, ...destinataireStep];
      if (destinataires) {
        const utilisateurs: UtilisateurDto[] = destinataires.map(destinataire => destinataire.utilisateur);
        parapheurService.addUsers(workflow.id || 0, utilisateurs).then(response => {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Parapheur created successfully', life: 3000 });
          stepService.presignerStep(stepId, connectedUser.id).then(response => {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Step approved successfully', life: 3000 });
            approveStep(stepId);
            hideDialog();
            refetch();
          }).catch(error => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error approving Step', life: 3000 });
          });
        })
      }
    }
  }
  const approveStep = (stepId: number) => {
    if (step.stepPreset.level == 1 && workflow.id) {
      addDocToSteps(workflow.id)
    }
    if(step.stepPreset.level == 3 && workflow.id) {
      const nextStep = workflow.stepDTOList?.find(s => step.stepPreset?.level && s.stepPreset?.level === step.stepPreset?.level + 1);
      const previousStep = workflow.stepDTOList?.find(s => step.stepPreset?.level && s.stepPreset?.level === step.stepPreset?.level - 1);
      const destinataires = nextStep && nextStep.stepPreset.destinataires || [];
      if (destinataires && previousStep && previousStep.stepPreset.actions?.includes(ACTION.PARAPHER)) {
        const utilisateurs: UtilisateurDto[] = destinataires.map(destinataire => destinataire.utilisateur);
        parapheurService.addUsers(workflow.id || 0, utilisateurs).then(response => {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Parapheur created successfully', life: 3000 });
          }).catch(error => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error approving Step', life: 3000 });
          });
      }
    }
    stepService.approveStep(stepId, connectedUser.id).then(response => {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Step approved successfully', life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error approving Step', life: 3000 });
    });
  };
  const addDocToSteps = async (wokflowId: number) => {
    await workflowService.addDocumentToStep(wokflowId).then(response => {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Operation created successfully', life: 3000 });
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error addDocToSteps', life: 3000 });
    })
  }
  const createParapheur = async () => {
    let documentsParapheur: DocumentDto[] = []
    if (rejectParapher) {
      documentsParapheur = selectedDocumentsParapher;
    } else {
      if (step.documents) {
        documentsParapheur = step.documents.filter((doc) => !doc.signed && !doc.paraphed && !(doc.documentState.libelle === 'Rejeté'));
      } else if (workflow.documents) {
        documentsParapheur = workflow.documents.filter((doc) => !doc.signed && !doc.paraphed && !(doc.documentState.libelle === 'Rejeté'));
      }
    }
    await stepService.preSignDocs(step.id, documentsParapheur).then(response => {
      toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Step action Document successfully', life: 3000 });
      setvisibleDDT(false);
      // setLoadingA(false);
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error add action doc ', life: 3000 });
    });

    let utilisateursParaph: UtilisateurDto[] = [];
    const nextStep = workflow.stepDTOList?.find(s => step.stepPreset?.level && s.stepPreset?.level === step.stepPreset?.level + 1);
    if(nextStep) {
      const destinataires = nextStep.stepPreset.destinataires || [];
      utilisateursParaph = destinataires.map(destinataire => destinataire.utilisateur);
    }

    await parapheurService.createParapheur(documentsParapheur, workflow.title ? workflow.title : "parapheur", utilisateursParaph)
      .then(response => {
        workflowService.associateWorkflowToParapheur(workflow.id ? workflow.id : 0, response.data.id, step.id).then(response => {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Parapheur created successfully', life: 3000 });
        })
        
        if (rejectParapher) {
          hideDialog();
          refetch();
          setRejectParapher(false);
          setSelectedDocumentsParapher([]);
        }
      }).catch(error => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error creating Parapheur', life: 3000 });
      })
  }
  const signStep = (stepId: number) => {
    stepService.signStep(stepId, connectedUser.id).then(response => {
      toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Step signed successfully', life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error signing Step', life: 3000 });
    });
  };

  const rejectStep = (stepId: number) => {
    stepService.rejectStep(stepId).then(response => {
      toast.current?.show({ severity: 'warn', summary: 'Success', detail: 'Step rejected successfully', life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error rejecting Workflow Preset', life: 3000 });
    });
  };
  const isButtonDisabled = (step: StepDTO, rowData: any) => {
    const documentState = rowData.documentState.libelle;
    const stepLevel = step.stepPreset.level;

    if (stepLevel === 3) {
        return documentState !== 'Validé';
    }else if (stepLevel === 4) {
        return documentState !== 'Prêt à signé';
    }
  };
  const complimentStep = (stepId: number, specificStepId?: number) => {
    stepService.complimentStep(stepId, specificStepId).then(response => {
      toast.current?.show({ severity: 'warn', summary: 'Success', detail: 'Step compliment successfully', life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error compliment Workflow Preset', life: 3000 });
    });
  };

  const rejectDocFromStep = (documents: DocumentDto[]) => {
    stepService.rejectDocFromStep(step.id, documents).then(response => {
      toast.current?.show({ severity: 'warn', summary: 'Success', detail: 'Document rejected successfully', life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error rejecting Workflow Preset', life: 3000 });
    })
    
  }

  const rejectDocFromParapheur = (documents: DocumentDto[]) => {
    stepService.rejectDocFromParapheur(step.id, documents).then(response => {
      toast.current?.show({ severity: 'warn', summary: 'Success', detail: 'Document rejected successfully', life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error rejecting Workflow Preset', life: 3000 });
    })
  }
  const envoiCourrierDone = () => {
    setLoadingA(true);
    stepService.envoiCourrierDone(step.id).then(response => {
      toast.current?.show({ severity: 'info', summary: t("success.success"), detail:t("success.operation") , life: 3000 });
      hideDialog();
      refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: t("error.error"), detail: t("error.operation"), life: 3000 });
    }).finally(() => {
      setLoadingA(false);
      setLaunchAfterCreateSuccess(()=>{})
    });
  };

  const handleDocumentSave = async (document: DocumentDto[]) => { 
    setLoadingA(true);
    await onSubmitCommentaire();
    document.length > 0 && stepService.actionDocument(step.id, document).then(response => {
      toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Step action Document successfully', life: 3000 });
      setvisibleDDT(false);
      setLoadingA(false);

    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error add action doc ', life: 3000 });
    });
  };
  const addDocStepDialog  = async (document: DocumentDto[]) => {
    addDocumentsToStep(document);
  }


  const workflowStatusTag = (status: WorkflowDTO.StatusEnum) => {
    switch (status) {
      case WorkflowDTO.StatusEnum.OPEN:
        return <Tag value={t('status.Open')} severity="info"  className='h-fit my-auto' />;
      case WorkflowDTO.StatusEnum.CLOSED:
          return <Tag value={t('status.Closed')} severity="danger" className='h-fit my-auto'  />;
      case WorkflowDTO.StatusEnum.Annulled:
        return <Tag value={t('status.Annulled')} severity="danger" className='h-fit my-auto' />;
      case WorkflowDTO.StatusEnum.REJECTED:
          return <Tag value={t('status.Rejeted')} severity="danger" className='h-fit my-auto' />;
      default:
        return <Tag value={status} className='h-fit my-auto' />;
    }
    
  }

  const [parapheursToSign, setParapheursToSign] = useState<ParapheurDto[]>([]);
  const [loadingParapheurs, setLoadingParapheurs] = useState<boolean>(true);
  const [errorParapheurs, setErrorParapheurs] = useState<boolean>(false);
  const [showSignDialog, setShowSignDialog] = useState<boolean>(false);
  const fetchParapheurToSign = async (workflowId : number) => {
    setParapheursToSign([]);
    setErrorParapheurs(false);
    setLoadingParapheurs(true);
    try {
      const response = await workflowService.getParpheursByWorkflowId(workflowId);
      setParapheursToSign(response.data);
      return response.data
    } catch (error) {
      console.error('Error getting parapheurs tasks :', error);
      setErrorParapheurs(true);
    } finally {
      setLoadingParapheurs(false);
    }
  }
  useEffect(() => {
    if (visible ) {
      fetchParapheurToSign(workflow.id || 0);
    }
  }, [visible]);
  const refetchAndCheckIfAllSigned = async (workflowId : number) => {
    await fetchParapheurToSign(workflowId).then((parapheurs) => {
      if(parapheurs && parapheurs.length > 0 && parapheurs.every(paraph => paraph.parapheurEtat === "termine")){
        signStep(step.id);
      }
    })
  }
  const [signingInProgress, setSigningInProgress] = useState<boolean>(false);
  const signParaph = async (idParaph: number) => {
    await parapheurService.signAll(idParaph, connectedUser, toast, () => refetchAndCheckIfAllSigned(workflow.id || 0), setSigningInProgress);
  }
 
  const signActionDialog = () => {

    return (
      <Dialog
        header="Liste des parapheurs à signer"
        visible={showSignDialog}
        style={{ minWidth: '50vw', width: 'fit-content', minHeight: '50vh' }}
        onHide={() => setShowSignDialog(false)}
        dismissableMask={true}
      >
        {
          loadingParapheurs ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <ProgressSpinner />
            </div>
          ) : errorParapheurs ? (
            <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
          ) : (
            <div className="p-grid p-fluid">
              <div className="p-col-12">
                <DataTable
                  value={parapheursToSign}
                  header={
                    <div className='flex flex-row justify-content-between align-items-center'>
                      <h5 className="m-0">Liste des parapheurs: {parapheursToSign.length}</h5>
                      <span className="block mt-2 md:mt-0 p-input-icon-left" />
                    </div>}
                  className="p-datatable-sm"
                  emptyMessage={t("parapheur.noParapheursToSign") }
                >
                  <Column field="title" header="Title" />
                  <Column field="utilisateur" header="Responsable" body={(rowData) => {
                    if (rowData?.utilisateur) {
                      return (
                        <div className="flex align-items-center gap-2">
                          <img alt="" src="/user-avatar.png" width="32" />
                          <span className='font-bold'>{rowData?.utilisateur.nom}{' '}{rowData?.utilisateur.prenom}</span>
                        </div>
                      );
                    }
                  }} />                      
                  <Column field="parapheurEtat" header="Statut" body={(rowData) => {
                    if (rowData.parapheurEtat === "en_attente") {
                      return (
                        <Tag value="En Attente" severity="info" />
                      );
                    } else if (rowData.parapheurEtat === "en_cours") {
                      return (
                        <Tag value="En Cours" severity="warning" />
                      );
                    } else if (rowData.parapheurEtat === "rejete") {
                      return (
                        <Tag value="Rejeté" severity="danger" />
                      );
                    } else if (rowData.parapheurEtat === "termine") {
                      return (
                        <Tag value="Terminé" severity="success" />
                      );
                    }
                  }} />
                  <Column field="createdOn" header="Date de création" />
                  <Column
                    header="Action"
                    body={(rowData) => <ParapheurViewer parapheur={rowData} signAll={signParaph} signingInProgress={signingInProgress} />}
                  />
                </DataTable>
              </div>
            </div>
          )

        }
      </Dialog>
    );
  }

  const handleSignAction = () => {
    setShowSignDialog(true);
    fetchParapheurToSign(workflow.id || 0);
  }

  const renderActionButtons = () => {
    if (!step.actions || step.actions.length === 0) {
      return null;
    }
    return step.actions.map((action, index) => {
      switch (action) {
        case ACTION.APPROVE:
          return <Button key={index} label={step.stepPreset.level === 1 ? t('workflow.Importer') : t('workflow.Approuver')} icon="pi pi-check" className="" severity='info' onClick={() => openActionDialog('approve')} />;
        case ACTION.SIGN:  
          return <Button key={index} label={t('workflow.Signer')} icon="pi pi-pencil" className="p-button-info" onClick={() => {
            // openActionDialog('sign')
            handleSignAction();
          }} />;
        case ACTION.REJECT:
          return <Button key={index} label={t('workflow.Rejeter')} icon="pi pi-times" className="p-button-danger" onClick={() => openActionDialog('reject')} />;
        case ACTION.PARAPHER:
          return <Button key={index} label={t('workflow.Parapher')} icon="pi pi-folder" className="p-button-warning"
            // onClick={() => openActionDialog('parapher')} 
            onClick={(e) => {
              confirmPopup({
                target: e.currentTarget,
                message: step.status === 'PARTIAL' ? t("confirmPopup.cannotSignWhenPartial") : t("confirmPopup.confirmSign"),
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  openActionDialog('parapher');
                },
                reject() {
                  //choose docs to sign
                  setRejectParapher(true);
                },
                acceptClassName: 'p-button-danger',
                rejectClassName: 'p-button-secondary'
              })
            }}
          />;
        case ACTION.PRESIGNER:
          return <Button key={index} label={t('workflow.Presigner')} icon="pi pi-pencil" className="p-button-info" onClick={() => openActionDialog('presigner')} />
        case ACTION.ENVOI_COURRIER:
          return <Button key={index} label={t('stepActions.envoyerCourrier')} icon="pi pi-envelope" className="p-button-info" 
            onClick={() => {setShowEtablissemntParCEDiaglog(true);}}
            />;
        default:
          return null;
      }
    });
  };

  const renderRejectButtons = () => {
    if (step.status === 'DONE') {
      return null;
    } else {
      return <Button key="reject" label={t('workflow.Rejeter')} icon="pi pi-times" className="p-button-danger" onClick={() => openActionDialog('reject')} />;
    }
  };

  const renderComplimentButtons = () => {
    if (step.status === 'DONE') {
      return null;
    } else {
      if (step.stepPreset.level !== 1 && !step.stepPreset.actions?.includes(ACTION.SIGN)){
        return <Button key="complement" label={t('workflow.Revert')} icon="pi pi-directions-alt text-xl  "  
            className=' bg-purple-700 border-purple-700 hover:bg-purple-500 hover:border-purple-500 hover:text-white'
            //severity='help' 
            tooltip={t('workflow.tooltip.revertButton')}
            tooltipOptions={{ position: 'top' }}
            onClick={() => {
              if(PreviousSteps.length > 1) {
                setRejectParapher(true);
              }else{
                setRejectDocParapher(true);
              }
            }} />;
      }
    }
  };

  const openActionDialog = (action: any) => {
    setCurrentAction(action);
    setVisibleRejectDialog(true);
  };

  const onSubmitCommentaire = () => {
    commentaire.utilisateur = connectedUser;
    const performAction = () => {
      return stepService.addCommentaireToStep(step.id, commentaire).then(() => {
        switch (currentAction) {
          case 'approve':
            return approveStep(step.id);
          case 'sign':
            return signStep(step.id);
          case 'reject':
            return rejectStep(step.id);
          case 'parapher':
            return parapher(step.id);
          case 'presigner':
            return presigner(step.id);
          case 'compliment':
            return rejectDocFromStep(selectedDocumentsParapher);
          case 'rejectTochef':
            return rejectDocFromParapheur(selectedDocumentsParapher)
          default:
            return Promise.reject(new Error('Action inconnue'));
        }
      });
    };

    performAction().then(() => {
      toast.current?.show({ severity: 'success', summary: 'Succès', detail: 'Action réalisée avec succès et commentaire sauvegardé.', life: 3000 });
      // setVisibleRejectDialog(false);
      // resetForm();
      // refetch();
    }).catch(error => {
      toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la réalisation de l\'action.', life: 3000 });
    });
  };

  const emptyItem = new DocumentDto();
  const emptyCriteria = new DocumentCriteria();
  const [currentStep, setCurrentStep] = useState<StepDTO | null>(null);

  const refresh = () => {
  };

  const { items, update } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t, refresh });
  const [showDialogEditFile, setShowDialogEditFile] = useState(false);
  const [docSlectedFTable, setDocSlectedFTable] = useState<DocumentDto>();

  const showEditFileModal = () => {
    setShowDialogEditFile(true);
  };

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

  const signDocument = (document: DocumentDto) => {
    if (step) {
      stepService.signDocumentWF(step.id, document).then(() => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Document signé avec succès', life: 3000 });
      }).catch(() => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une erreur s est produite lors de l ajout du document', life: 3000 });
      });
    }
  };

  const handleDocumentSigned = (signedDocument: string) => {
    if (signedDocument) {
      const criteria = new DocumentCriteria();
      criteria.reference = signedDocument;
      documentAdminService.findPaginatedByCriteria(criteria)
        .then(({ data }) => {
          signDocument(data.list[0]);
        })
        .catch((error) => {
          setError(true);
          MessageService.showError(toast.current, "Error!", "Une erreur s'est produite lors de la récupération du document");
        });
    } else {
      console.error('Échec de la signature du document');
    }
  };

  const [activeIndex, setActiveIndex] = useState(1);

  const itemIndexHaveRejectedStep = (itemIndex : number)=>{
    let steps = [] as StepDTO[]
    if(itemIndex === 0){
      steps = PreviousSteps
    }else if (itemIndex === 1){
      steps = [step]
    } else if (itemIndex === 2){
      steps = NextSteps
    }
    
    return steps.some(step => step.status == StepDTO.StatusEnum.REJECTED)

  }

  const itemRenderer = (item: any, itemIndex: any) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = itemIndexHaveRejectedStep(itemIndex)? "red" : isActiveItem ? (activeIndex === 1 ? 'var(--primary-color)' : 'silver') : 'var(--surface-b)';
    const textColor = itemIndexHaveRejectedStep(itemIndex)? 'var(--surface-b)' : isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

    return (
      <span
        className="inline-flex align-items-center justify-content-center align-items-center border-circle border-primary border-1 h-3rem w-3rem z-1 cursor-pointer"
        style={{ backgroundColor: backgroundColor, color: textColor, marginTop: '-25px' }}
        onClick={() => setActiveIndex(itemIndex)}
      >
        <i className={`${item.icon} text-xl`} />
      </span>
    );
  };

  const itemsU = [
    {
      icon: 'pi pi-chevron-circle-left',
      template: (item: any) => priviousStepVisible ? itemRenderer(item, 0) : null, // Afficher seulement si previousStep existe
      label: t("workflow.tachePrecedente")
    },
    {
      icon: 'pi pi-check-circle',
      template: (item: any) => itemRenderer(item, 1),
      label: t("workflow.tacheActuelle")
    },
    {
      icon: 'pi pi-chevron-circle-right',
      template: (item: any) => nextStepVisible ? itemRenderer(item, 2) : null, // Afficher seulement si nextStep existe
      label: t("workflow.tacheSuivante")
    }
  ];

  const activeIndexInfo = () => {
    if (activeIndex === 0) {
      return PreviousSteps;
    } else if (activeIndex === 1) {
      return [step];
    } else if (activeIndex === 2) {
      return NextSteps;
    }
    return [];
  };

  const activeIndexDocuments = (step: StepDTO) => {
    let documents: DocumentDto[] = [];
    if (activeIndex === 0 && PreviousSteps) {
      documents = step?.documentsActions || [];
    } else if (activeIndex === 1) {
      documents = step.documents || [];
    } else if (activeIndex === 2) {
      documents = step?.documentsActions || [];
    }
    return documents;
  }

  const canSeeDocuments = () => {
    return activeIndex == 1 && step.actions?.includes(ACTION.APPROVE) || step.actions?.includes(ACTION.PARAPHER) || step.status == 'DONE' && step.stepPreset.actions?.includes(ACTION.APPROVE || ACTION.PARAPHER);  }

  const isActionFormValide = ()=>{
    if(currentAction === 'reject'){
      return commentaire.message !== '';
    }
    return true;
  }


  type ActiveStepTemplateProps = {
    stepI: StepDTO;
  }
  const [files, setFiles] = useState<any[]>([]);
  const [loadingPJ, setLoadingPJ] = useState<boolean>(false);
  const [filesUploadedPJ, setFilesUploadedPJ] = useState<boolean>(false);
  const[document, setDocument] = useState<DocumentDto>(new DocumentDto());
  
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeDto[]>([]);
    const documentTypeAdminService = new DocumentTypeAdminService();

  useEffect(() => {
      documentTypeAdminService.getList().then(({ data }) => setDocumentTypes(data)).catch(error => console.log(error));
  },[])
  const handleFileUploadPJ = async (e: any) => {
    const files = e.files;
    setFiles(files);
    document.reference = files[0].name;
    document.utilisateur = connectedUser
    document.entiteAdministrative = connectedUser.entiteAdministrative
    const fileUrl = e.files && e.files[0];
    const docType = await associateDocumentType(fileUrl,  documentTypes);
    if (docType) {
      document.documentType = docType;
    }
    setFilesUploadedPJ(true);
    MessageService.showSuccess(toast.current, "Création!", `${files.length} fichier(s) chargé(s) avec succès`);
  };

  const getPlanCreation = async (categorieLibelle: string, workflowTitle: string, thirdPlan?: string) => {
    const plans = [{ libelle: categorieLibelle }, { libelle: workflowTitle }];
    if (thirdPlan) {
        plans.push({ libelle: thirdPlan });
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
    await getPlanCreation(e.value.libelle, workflow.title ?? '');
  };

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
  const AjouterPieceJointe = async () => {
    setPjAddedSuccess(false);
    if (document.documentCategorie && workflow && workflow.title ) {
      await getPlanCreation(document.documentCategorie.libelle, workflow.title , "PV");
    }
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
        if(response){
          workflow.piecesJointes = response.data;
          workflowService.addPVToWorkflow(workflow.id ?? 0, response.data).then((response)=>{
            setWorkflowPV(response.data);
            MessageService.showSuccess(toast.current, "Création!", `Pièce(s) jointe(s) chargée(s) avec succès`);
          }).catch((error)=>{
            MessageService.showError(toast.current, "Error!", `Pièce(s) jointe(s) chargée(s)`);
          })
        }
        setLoadingPJ(false);
        setFiles([]);
        setDocument(new DocumentDto());
        setFilesUploadedPJ(false);
        setPieceJointeDialog(false);
        setPjAddedSuccess(true);
        MessageService.showSuccess(toast.current, "Création!", `Pièce(s) jointe(s) chargée(s) avec succès`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du document:', error);
        setLoadingPJ(false);
        throw error;
    }
}

const [specificStepId, setSpecificStepId] = useState<number | null>(null);
const rejectStepEvaluateur = (stepI: StepDTO) => {
  setSpecificStepId(stepI.id);
}
  const ActiveStepsTemplate = ({stepI}: ActiveStepTemplateProps) => {
    return (
      <div className='w-full'>
        <div className="field grid col-12">
          {/* {activeIndex === 0 && PreviousSteps.length > 1 && step.status !== StatusEnum.DONE && (
              <div className="field grid col-12 my-3">
                <Button
                  icon="pi pi-directions-alt text-2xl"
                  label="Réinitialiser l'étape"
                  text
                  rounded
                  className='border-2 text-purple-700 border-purple-700 hover:bg-purple-700 hover:text-white'
                  severity='danger'
                  onClick={() => {rejectStepEvaluateur(stepI); openActionDialog('compliment');}}
                />
              </div>
          )} */}
          <label htmlFor="title" className="col-2 text-black-alpha-80 font-bold">  {t("Titre")} </label>
          <span className='col-1 font-bold'>:</span>
          <p className='col-8' id="reference">{stepI?.stepPreset.title}</p>
        </div>
        <div className="field grid col-12">
          <label htmlFor="description" className="col-2 mb-auto text-black-alpha-80 font-bold"> {t("workflow.Description")} </label>
          <span className='col-1 mb-auto font-bold'>:</span>
          <p className='col-9 mb-auto ' onClick={showStepDescriptionDialog} >{truncateText(stepI?.stepPreset.description, 100)}</p>
          <Dialog header="Description" visible={visibleStepDes} style={{ width: '50vw' }} onHide={hideStepDescriptionDialog}>
            <p>{stepI?.stepPreset.description}</p>
          </Dialog>
        </div>
        {
          step.status === StepDTO.StatusEnum.REJECTED && stepI.discussions &&
          <>
            <div className="field grid  col-12">
              <label htmlFor="status" className=" col-2 text-black-alpha-80 font-bold"> {t("Status")}  </label>
              <span className='col-1 font-bold'>:</span>
              <Tag className="" value="Rejeté" severity="danger"></Tag>
            </div>
            <div className="field grid  col-12">
              <label htmlFor="motif" className=" col-2 text-black-alpha-80 font-bold"> {t("Motif de rejet ")}  </label>
              <span className='col-1 font-bold'>:</span>
              <p className='col-9 mb-auto ' onClick={showStepDescriptionDialog} >{truncateText(stepI.discussions[stepI.discussions?.length - 1]?.message, 100)}</p>
              <Dialog header="motif" visible={visibleStepDes} style={{ width: '50vw' }} onHide={hideStepDescriptionDialog}>
                <p>{stepI.discussions[stepI.discussions?.length - 1]?.message}</p>
              </Dialog>
            </div>
          </>

        }
      </div>
    )
  }

  const isDocumentAction = (document: DocumentDto) => {
    return documentActionsInStep.some(actionDoc => actionDoc.id === document.id);
  };
  const isDocumentPresign = (document: DocumentDto) => {
    return documentPresignInStep.some(actionDoc => actionDoc.id === document.id);
  };

  const removeDocFromStep = (document: DocumentDto) => {
    stepService.removeDocumentsFromStep(step.id, [document]).then((response) => {
      step.documents = response.data;
      setRejectParapher(false);
      hideDialog();
      refetch();
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Document removed successfully', life: 3000 });
    })
  }

  const addDocumentsToStep = (document: DocumentDto[]) => {
    stepService.addDocumentsToStep(step.id, document).then((response) => {
      step.documents = response.data;
      setRejectParapher(false);
      setAddDocStep(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Document added successfully', life: 3000 });
    })
  }
  const ActiveStepDocuments = ({stepI}: ActiveStepTemplateProps) => {
    return  (
      <div className="field grid  col-12">
        <label htmlFor="title" className=" col-2 my-auto text-black-alpha-80 font-bold"> {t("documents")}  </label>
        <span className='col-1 my-auto font-bold'>:</span>
        {
          activeIndexDocuments(stepI).length > 0 ? (
            <>
              <Button className='' rounded text label={viewStepDocs ? t("document.hideDocuments") : t("document.viewDocuments")} icon={viewStepDocs ? "pi pi-eye-slash" : "pi pi-eye"} onClick={() => setViewStepDocs(prev => !prev)} />
              {viewStepDocs &&
                <div className='mt-3'>
                  <DataTable dataKey='id' value={activeIndexDocuments(stepI)} paginator  rows={5} className='w-full'
                    header={
                      <div className='flex flex-row justify-content-between align-items-center'>
                        <h5 className="m-0">Liste des documents: {activeIndexDocuments(stepI).length}</h5>
                        <span className="block mt-2 md:mt-0 p-input-icon-left" />
                      </div>}>
                    <Column field="reference"  style={{ minWidth: '15rem' , paddingLeft:"3rem" }} />
                    {/* <Column field="planClassement.libelle"   /> */}
                    <Column field="documentCategorie.libelle" style={{ minWidth: '15rem' }} />
                    <Column field="documentState.libelle" style={{ minWidth: '8rem' }}
                        body={(rowData) => 
                          (<Tag value={rowData?.documentState?.libelle} severity={rowData?.documentState?.style} />)}></Column>
                    {/* <Column field="type"   style={{ minWidth: '8rem' }} /> */}
                    {/* {stepI.actions?.includes(ACTION.PRESIGNER) ?
                      <Column body={(rowData) => (
                        isDocumentPresign(rowData) ? (
                          <Tag severity="success" value="Presign" />
                        ) : (
                          <Tag severity="info" value="Non Presign" />
                        )
                      )} style={{ minWidth: '10rem' }} /> 
                    :
                      <Column  body={(rowData) => (
                        rowData.signed ? (
                          <Tag severity="info" value="Signé" />
                        ) : (
                          <Tag severity="success" value="Non Signé" />
                        )
                      )} style={{ minWidth: '10rem' }} />             
                    } */}
                    <Column style={{ minWidth: '10rem' }} body={(rowData) => (
                      <>
                        <Button icon="pi pi-eye" text rounded raised onClick={(e) => {
                          setViewDocument(true);
                          setDocumentIdToView(rowData.id);
                        }} className='ml-1 bg-white text-primary text-lg  hover:shadow-4 hover:bg-primary hover:text-white' />
                      </>
                    )} />
                  </DataTable>
                </div>}
            </>
          ) : (
            <Tag className="mr-2" icon="pi pi-info-circle" severity="warning" value={t("aucunDocument")}></Tag>
          )
        }
      </div>
    )
  }

  return (
    <div>
      <Toast ref={toast} /> {/* Ensure Toast is referenced */}
      <Button raised icon="pi pi-eye" onClick={showDialog} />
      <Dialog 
        header={<h5 className="text-900 font-medium text-3xl text-indigo-800">{currentAction === 'reject' ? t("motifRejet") : t("addCommentsAndDocs")}</h5>} 
        visible={visibleRejectDialog} 
        onHide={() => setVisibleRejectDialog(false)} 
        style={{width:"50vw", position:"relative"}}
        modal

      >
        {
          loadingA &&
          <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
            <ProgressSpinner />
          </div>
        } 
        <div className="field w-full">
          {/* {step.stepPreset.addPV &&
            <>
              <label className='mb-2 text-base font-semibold my-0' htmlFor="pieceJointe">{t("workflow.pieceJointes")}</label>
              <div className='mt-2'>
                  <Button 
                    className={`${pjAddedSuccess?"bg-primary":"bg-primary-reverse"} w-full   `} 
                    label={`${pjAddedSuccess?"Chargés":"Charger"}`} 
                    icon={`${pjAddedSuccess?"pi pi-paperclip":"pi pi-plus"}`}
                    onClick={(e) => {setPieceJointeDialog(true);}}
                    disabled={workflow?.title === ''}
                  />
              </div>
            </>
          } */}
            <label className="col-12 text-primary font-bold" htmlFor="rejectReason">{currentAction === 'reject' ? t("motifRejet") : t("addComment")} </label>
          <br></br>
          <InputTextarea id="rejectReason" name="rejectReason" rows={5} style={{ width: "100%" }} onChange={(e)=>setCommentaire({...commentaire,message: e.target.value})} value={commentaire.message} />
          <br></br>
          { !isActionFormValide() && commentaire.message =='' && <small className="p-error">* Un motif de rejet est requis.</small>}
        </div>
        <label  className="col-12 text-primary font-bold">Ajouter des documents :</label>
        <AjouterDocument onDocumentSave={handleDocumentSave} workflow={workflow} onCancel={()=>{setVisibleRejectDialog(false)}} disabled={!isActionFormValide()}></AjouterDocument>

      </Dialog>
      {showSignDialog && signActionDialog()}
      <Dialog header="Ajouter des Pièces Jointes" visible={pieceJointeDialog} modal style={{ width: '47vw' }} onHide={() => {setPieceJointeDialog(false)}}
        footer={
          <>
            <Button label="Annuler" icon="pi pi-times" severity='danger' onClick={() => {setPieceJointeDialog(false)}} className="p-button-text"  />
            <Button label="Valider" icon="pi pi-check" severity="info" onClick={AjouterPieceJointe} autoFocus loading={loadingPJ} />
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
            uploadHandler={handleFileUploadPJ}
            emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
        />
        {filesUploadedPJ &&
          <div className="formgrid grid">
            <Divider layout='horizontal'></Divider>
            <div className="field col-12">
                <span className='text-blue-700 font-bold text-lg'>{t("document.classifyNewDocument")}</span>
            </div>
            <div className="field col-4">
                <label htmlFor="documentType">{t("document.documentType")}</label>
                <Dropdown showClear id="documentTypeDropdown" value={document.documentType}
                    options={documentTypes}
                    onChange={(e) => setDocument((prevState) => ({ ...prevState, ['documentType']: e.value }))}
                    placeholder={t("document.documentTypePlaceHolder")} filter
                    filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                    optionLabel="libelle" className='w-full'/>
            </div>
            <div className="field col-4">
                <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                    options={documentCategories}
                    onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                    placeholder={t("document.documentCategoriePlaceHolder")} filter
                    filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                    optionLabel="libelle" className='w-full' />
            </div>
          </div>
        }
      </Dialog>
      <EtablissementParCE step={step}  markStepAsDone={envoiCourrierDone} workflow={workflow} visible={showEtablissemntParCEDiaglog} setVisible={setShowEtablissemntParCEDiaglog} />
      <Dialog style={{ width: '70vw' }} header={<h5 className="text-900 font-medium text-3xl text-indigo-800">Ajouter Documents Step</h5>} visible={addDocStep} onHide={() => setAddDocStep(false)}>
        <AjouterDocument onDocumentSave={addDocStepDialog} workflow={workflow} onCancel={()=>{setAddDocStep(false)}} />
      </Dialog>
      <Dialog header={<h5 className="text-900 font-medium text-3xl text-indigo-800">Documents Parapheur</h5>} visible={rejectParapher} onHide={() => setRejectParapher(false)}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }} style={{ width: '70vw' }}
        footer={<div className="flex justify-content-end">
          <Button label="Annuler" icon="pi pi-times" onClick={() => setRejectParapher(false)} className="p-button-text" />
          <Button label="Enregistrer" icon="pi pi-check" onClick={() => otpRef.current?.startOtpProcess()} className="p-button-text" autoFocus />
        </div>} >
        <div className="flex field col-8">
          <div className="field col-2 ">
              <div className='mt-2'>
                  <Button 
                      className={`bg-primary-reverse w-full hover:bg-primary hover:text-white`} 
                      label={"Ajouter"} 
                      icon={`pi pi-plus text-2xl`}
                      onClick={(e) => {setAddDocStep(true)}}
                  /> 
              </div>
          </div>
          <div className="field col-4 ">
            <div className='mt-2'>
              <Button
                icon="pi pi-directions-alt text-2xl"
                label="Rejeter"
                text
                className='text-purple-700 border-purple-700 hover:bg-purple-700 hover:text-white'
                severity='danger'
                onClick={() => {openActionDialog('compliment');}}
                disabled={selectedDocumentsParapher.length < 1}
              />
            </div>
          </div>
        </div>
        <span className='mb-2 font-semibold'>Liste des documents selectionnés</span>
        <DataTable value={step.documents} paginator rows={5} className='max-w-10'
        header={
          <div className='flex flex-row justify-content-between align-items-center'>
            <h5 className="m-0">Liste des documents: {step.documents?.length}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left" />
          </div>}
          rowClassName={(rowData: DocumentDto) => (rowData.signed || rowData.paraphed || rowData.documentState.libelle === 'Rejeté'  ? 'pointer-events-none opacity-50' : '')}
          selectionMode="multiple" selection={selectedDocumentsParapher} 
          // onSelectionChange={(e) => setSelectedDocumentsParapher(e.value as DocumentDto[])}
          onSelectionChange={(e) => {
            const filteredSelection = (e.value as DocumentDto[]).filter(
                (doc) => !doc.signed && !doc.paraphed && !(doc.documentState.libelle === 'Rejeté')
            );
            setSelectedDocumentsParapher(filteredSelection);
          }}
        >
          <Column selectionMode="multiple" style={{ width: '2em' }}  />
          <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
          <Column field="utilisateur.nom" header={t("document.evaluateur")} sortable body={(rowData) => {
              if (rowData?.utilisateur?.nom) {
                  return (
                      <div className="flex align-items-center gap-2">
                          <img alt="" src="/user-avatar.png" width="32" />
                          <span className='font-bold'>{rowData.utilisateur.nom}</span>
                      </div>
                  )
              }
          }}></Column>
          <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
          <Column field="entiteAdministrative.libelle" header="Entité" sortable style={{ minWidth: '8rem' }} />
          <Column header="Actions" className='pointer-events-auto opacity-100' style={{ minWidth: '15rem' }}  body={(rowData: DocumentDto) => (
            <>
              <Button icon="pi pi-directions-alt text-xl" severity='help'
                //onClick={(e) => { removeDocFromStep(rowData)}}  
                onClick={(e) => {
                  confirmPopup({
                    target: e.currentTarget,
                    message: 'Êtes-vous sûr de vouloir rejeter ce document?',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {setSelectedDocumentsParapher([rowData]); openActionDialog('compliment')},
                    reject() {},
                    acceptClassName: 'p-button-danger',
                    rejectClassName: 'p-button-secondary'
                  })
                }}
                className={`mr-2`}
                tooltip='Rejeter Document'
                disabled={!!rowData.signed || !!rowData.paraphed || rowData.documentState.libelle === 'Rejeté'} />
              <Button icon="pi pi-eye" onClick={(e) => { setViewDocumentParapher(true); getDocumentBase64(rowData.id); }} severity='secondary' />
              <Button icon="pi pi-trash" severity='danger'
                //onClick={(e) => { removeDocFromStep(rowData)}}  
                onClick={(e) => {
                  confirmPopup({
                    target: e.currentTarget,
                    message: 'Êtes-vous sûr de vouloir supprimer ce document?',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => removeDocFromStep(rowData),
                    reject() {},
                    acceptClassName: 'p-button-danger',
                    rejectClassName: 'p-button-secondary'
                  })
                }}
                className={`ml-2`}
                tooltip='Supprimer Definitivement'
                disabled={!!rowData.signed || !!rowData.paraphed} />
            </>
          )} />
        </DataTable>
        {viewDocumentParapher && <div>
          <DocumentViewer
            loading={loading}
            error={error}
            documentBase64={documentBase64}
            numPages={numPages}
            pageNumber={pageNumber}
            onPageChange={onPageChange}
            setNumPages={setNumPages}
          />
        </div>}
      </Dialog>
      <Dialog header={<h5 className="text-900 font-medium text-3xl text-indigo-800">Documents Parapheur</h5>} visible={rejectDocParapher} onHide={() => setRejectDocParapher(false)}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }} style={{ width: '70vw' }}
        footer={<div className="flex justify-content-end">
          <Button label="Annuler" icon="pi pi-times" onClick={() => setRejectDocParapher(false)} className="p-button-text" />
        </div>} >
        <div className="flex field col-8">
          <div className="field col-4 ">
            <div className='mt-2'>
              <Button
                icon="pi pi-directions-alt text-2xl"
                label="Rejeter"
                text
                className='text-purple-700 border-purple-700 hover:bg-purple-700 hover:text-white'
                severity='danger'
                onClick={() => {openActionDialog('rejectTochef');}}
                disabled={selectedDocumentsParapher.length < 1}
              />
            </div>
          </div>
        </div>
        <span className='mb-2 font-semibold'>Liste des documents selectionnés</span>
        <DataTable value={step.documents} paginator rows={5} className='max-w-10'
        header={
          <div className='flex flex-row justify-content-between align-items-center'>
            <h5 className="m-0">Liste des documents: {step.documents?.length}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left" />
          </div>}
          rowClassName={(rowData: DocumentDto) => (isButtonDisabled(step, rowData) ? 'pointer-events-none opacity-50' : '')}
          selectionMode="multiple" selection={selectedDocumentsParapher} 
          onSelectionChange={(e) => {
            const filteredSelection = (e.value as DocumentDto[]).filter(
                (doc) => {
                  if (step.stepPreset.level === 3) {
                    return doc.documentState.libelle === 'Validé';
                  }
                  if (step.stepPreset.level === 4) {
                      return doc.documentState.libelle === 'Prêt à signé';
                  }
                }
            );
            setSelectedDocumentsParapher(filteredSelection);
          }}
        >
          <Column selectionMode="multiple" style={{ width: '2em' }}  />
          <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
          <Column field="utilisateur.nom" header={t("document.evaluateur")} sortable body={(rowData) => {
              if (rowData?.utilisateur?.nom) {
                  return (
                      <div className="flex align-items-center gap-2">
                          <img alt="" src="/user-avatar.png" width="32" />
                          <span className='font-bold'>{rowData.utilisateur.nom}</span>
                      </div>
                  )
              }
          }}></Column>
          <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
          <Column field="entiteAdministrative.libelle" header="Entité" sortable style={{ minWidth: '8rem' }} />
          <Column header="Actions" className='pointer-events-auto opacity-100' style={{ minWidth: '15rem' }}  body={(rowData: DocumentDto) => (
            <>
              <Button icon="pi pi-directions-alt text-xl" severity='help'
                onClick={(e) => {
                  confirmPopup({
                    target: e.currentTarget,
                    message: 'Êtes-vous sûr de vouloir rejeter ce document?',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {setSelectedDocumentsParapher([rowData]);openActionDialog('rejectTochef')},
                    reject() {},
                    acceptClassName: 'p-button-danger',
                    rejectClassName: 'p-button-secondary'
                  })
                }}
                className={`mr-2`}
                tooltip='Rejeter Document'
                disabled={isButtonDisabled(step, rowData)} />
              <Button icon="pi pi-eye" onClick={(e) => { setViewDocumentParapher(true); getDocumentBase64(rowData.id); }} severity='secondary' />
            </>
          )} />
        </DataTable>
        {viewDocumentParapher && <div>
          <DocumentViewer
            loading={loading}
            error={error}
            documentBase64={documentBase64}
            numPages={numPages}
            pageNumber={pageNumber}
            onPageChange={onPageChange}
            setNumPages={setNumPages}
          />
        </div>}
      </Dialog>
      <Dialog
        visible={visible}
        style={{ width: '87vw', height: '91vh', position:'relative' }}
        onHide={hideDialog}
        footer={
          <div className="flex justify-content-between flex-wrap">
            <Button label={t('cancel')} className="p-button-secondary" onClick={hideDialog} />
            <div className={`${activeIndex !== 1 && 'hidden'} `}>
              <div className="action-buttons  flex align-items-center justify-content-center ">
                {renderComplimentButtons()}
                {renderActionButtons()}
                {renderRejectButtons()}
              </div>
            </div>
          </div>
        }
      >
        {
          loadingA &&
          <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
            <ProgressSpinner />
          </div>
        } 
        <div>
          <Toast ref={toast} />
          <div className='flex flex-row gap-4 '>

            <div className=' flex-1 '>

              {/* --------------------------------- Worflow info----------------------------------------- */}

              <div className="card grid mt-1 relative border-primary">
                <span className="p-tag absolute text-sm top-0 left-0">{t('workflow.titre')}</span>
                <div className="col-6 grid ">
                  <label htmlFor="title" className="col-4 text-black-alpha-80 font-bold"> {t("workflow.CreatedBy")} </label>
                  <span className='col-1 font-bold' >:</span>
                  <span className='col-7' id="reference"> {workflow.initiateurNom} </span>
                </div>
                <div className="col-6 grid ">
                  <label htmlFor="title" className="col-4 text-black-alpha-80 font-bold"> {t("le")}  </label>
                  <span className='col-1 font-bold'>:</span>
                  <p className='col-7' >{workflow.dateC ? new Date(workflow.dateC).toLocaleDateString() : ""}</p>
                </div>
                <div className="col-6 grid ">
                  <label htmlFor="title" className=" col-4 text-black-alpha-80 font-bold"> {t("workflow.flag")}</label>
                  <span className=' col-1 font-bold'>:</span>
                  <Tag className='h-fit my-auto' value={t(WorkflowDTO.getWorkflowFlagLabel(workflow.flag))} severity={workflow.flag === 'URGENT' ? 'danger' : 'info'}></Tag>
                </div>
                <div className="col-6 grid ">
                  <label htmlFor="title" className="col-4 text-black-alpha-80 font-bold">  {t("workflow.status")}</label>
                  <span className='col-1 font-bold'>:</span>
                  {workflowStatusTag(workflow?.status ?? "" as WorkflowDTO.StatusEnum)}
                </div>
                <div className="col-12 grid">
                  <label htmlFor="description" className="col-2 col-fixed text-black-alpha-80 font-bold"> {t("workflow.Description")}</label>
                  <span className='my-auto mx-2 font-bold'>:</span>
                  <p className='col-7' onClick={showWFDescriptionDialog} >{truncateText(workflow.description, 100)}</p>
                  <Dialog header="Description" visible={visibleWFDes} style={{ width: '50vw' }} onHide={hideWFDescriptionDialog}>
                    <p>{workflow.description}</p>
                  </Dialog>
                </div>
                {step.stepPreset.level && step.stepPreset.level > 1 &&
                  canSeeDocuments() && (
                    <div className="col-12 grid ">
                      <label htmlFor="title" className=" col-2 my-auto text-black-alpha-80 font-bold"> {t("Documents")}  </label>
                      <span className='my-auto mx-2 font-bold'>:</span>
                      {
                        (workflow.documents && workflow.documents.length > 0) || (documentActions && documentActions.length > 0) ? (
                          <>
                            <Button className='' rounded text label={viewWorflowDocs ? t("document.hideDocuments")  : t("document.viewDocuments")} icon={viewWorflowDocs ? "pi pi-eye-slash" : "pi pi-eye"} onClick={() => setViewWorflowDocs(prev => !prev)} />
                            {viewWorflowDocs &&
                              <div className='mt-2'>
                                <DataTable  value={workflow.documents && workflow.documents.length > 0 ? workflow.documents.concat(documentActions) : documentActions.length > 0 ? documentActions : []} paginator rows={5} className='w-full'
                                  header={
                                    <div className='flex flex-row justify-content-between align-items-center'>
                                      <h5 className="m-0">Liste des documents: {workflow.documents && workflow.documents.length > 0 ? workflow.documents.concat(documentActions).length : documentActions.length > 0 ? documentActions.length : 0}</h5>
                                      <span className="block mt-2 md:mt-0 p-input-icon-left" />
                                    </div>}>
                                  <Column field="reference" style={{ minWidth: '15rem' }} />
                                  {/* <Column field="planClassement.libelle" header="Plan Classement" sortable /> */}
                                  <Column field="documentCategorie.libelle"  style={{ minWidth: '10rem' }} />
                                  {/* <Column field="type" header="Type" sortable style={{ minWidth: '8rem' }} /> */}
                                  <Column  style={{ minWidth: '10rem' }} body={(rowData) => {
                                    const isWorkflowDocument =  workflow.documents && workflow.documents.some(doc => doc.id === rowData.id);
    
                                    return isWorkflowDocument ? (
                                      <Tag value="WF Document" severity="success" />
                                    ) : (
                                      <Tag value="Action Document" severity="info" />
                                    );
                                  }} />
                                  <Column style={{ minWidth: '10rem' }}  body={(rowData) => (
                                    <>
                                      <Button icon="pi pi-eye" text rounded raised onClick={(e) => {
                                        setViewDocument(true);
                                        setDocumentIdToView(rowData.id);
                                      }} className='ml-1 bg-white text-primary text-lg  hover:shadow-4 hover:bg-primary hover:text-white' />
                                    </>
                                  )} />
                                </DataTable>
                              </div>}
                          </>
                        ) : (
                          <Tag className="ml-2 h-fit my-auto " icon="pi pi-info-circle" severity="warning" value={t("aucunDocument")}></Tag>
                        )
                      }
                    </div>

                  )
                }
                {step.stepPreset.addPV && <div className="col-12 grid ">
                  <label htmlFor="title" className=" col-2 my-auto text-black-alpha-80 font-bold"> PV </label>
                  <span className='my-auto mx-2 font-bold'>:</span>
                  <Button 
                    className={`${pjAddedSuccess?"bg-primary":"bg-primary-reverse"} hover:bg-blue-200`} 
                    label={`${pjAddedSuccess?t("uploaded"):t("upload")}`} 
                    rounded text
                    icon={`${pjAddedSuccess?"pi pi-paperclip":"pi pi-plus"}`}
                    onClick={(e) => {setPieceJointeDialog(true);}}
                    disabled={workflow?.title === ''}
                  />
                </div>}
                {workflow.piecesJointes && workflow.piecesJointes.length> 0 && (
                  <div className="col-12 grid ">
                  <label htmlFor="title" className=" col-2 my-auto text-black-alpha-80 font-bold"> {t("PV.pj")}  </label>
                  <span className='my-auto mx-2 font-bold'>:</span>
                  <Button className='ml-2' rounded text label={viewWorflowPJDocs ? t("PV.cacherPJ"):t("PV.afficherPJ") } icon="pi pi-download" onClick={() => setViewWorflowPJDocs(prev => !prev)} />
                  {viewWorflowPJDocs &&
                    <div className='mt-2 col-12'>
                      <DataTable  value={workflowPV ? workflowPV.piecesJointes : workflow.piecesJointes} paginator rows={5} className='w-full'
                      header={
                        <div className='flex flex-row justify-content-between align-items-center'>
                          <h5 className="m-0">Liste des PV: {workflowPV ? workflowPV.piecesJointes?.length : workflow.piecesJointes.length}</h5>
                          <span className="block mt-2 md:mt-0 p-input-icon-left" />
                        </div>}>
                        <Column field="reference" style={{ minWidth: '15rem' }} />
                        {/* <Column field="planClassement.libelle" header="Plan Classement" sortable /> */}
                        <Column field="documentCategorie.libelle"  style={{ minWidth: '15rem' }} />
                        {/* <Column field="type" header="Type" sortable style={{ minWidth: '8rem' }} /> */}
                        <Column style={{ minWidth: '10rem' }}  body={(rowData) => (
                          <>
                            <Button icon="pi pi-eye" text rounded raised onClick={(e) => {
                              setViewDocument(true);
                              setDocumentIdToView(rowData.id);
                            }} className='ml-1 bg-white text-primary text-lg  hover:shadow-4 hover:bg-primary hover:text-white' />
                          </>
                        )} />
                      </DataTable>
                  </div>}
                  </div>
                )}
                {parapheursToSign && parapheursToSign.length > 0 && (
                  <div className="col-12 grid ">
                    <label htmlFor="title" className=" col-2 my-auto text-black-alpha-80 font-bold"> {t("parapheur.title")}  </label>
                    <span className='my-auto mx-2 font-bold'>:</span>
                    <Button className='ml-2' rounded text label={viewWorflowParapheurs ? t("parapheur.cacher") : t("parapheur.voir") } icon={viewWorflowParapheurs?"pi pi-times":"pi pi-book"} onClick={() => setViewWorflowParapheurs(prev => !prev)} />
                    {viewWorflowParapheurs &&
                      <div className='mt-2 w-full'>
                        <DataTable
                          value={parapheursToSign}
                          header={
                            <div className='flex flex-row justify-content-between align-items-center'>
                              <h5 className="m-0">Liste des parapheurs: {parapheursToSign.length}</h5>
                              <span className="block mt-2 md:mt-0 p-input-icon-left" />
                            </div>}
                          className="w-full"
                          emptyMessage={t("parapheur.noParapheursToSign")}
                        >
                          <Column field="title" header="Title"  />
                          <Column field="parapheurEtat" header="Statut" body={(rowData) => {
                            if (rowData.parapheurEtat === "en_attente") {
                              return (
                                <Tag value="En Attente" severity="info" />
                              );
                            } else if (rowData.parapheurEtat === "en_cours") {
                              return (
                                <Tag value="En Cours" severity="warning" />
                              );
                            } else if (rowData.parapheurEtat === "rejete") {
                              return (
                                <Tag value="Rejeté" severity="danger" />
                              );
                            } else if (rowData.parapheurEtat === "termine") {
                              return (
                                <Tag value="Terminé" severity="success" />
                              );
                            }
                          }} />
                          <Column
                            header={t("Comments")}
                            body={(rowData) => {
                              return (
                                <div className='flex flex-row gap-2 justify-content-center'>
                                  <ParapheurComments parapheur={rowData} />
                                </div>
                              )
                            }
                            }
                            className='w-6rem'
                          />
                          <Column
                            header="Action"
                            body={(rowData) => {
                              return (
                                <div className='flex flex-row gap-2'>
                                  <ParapheurViewer parapheur={rowData} signingInProgress={signingInProgress} signAll={step?.actions && step.actions?.includes(ACTION.SIGN) ? signParaph : undefined} />
                                </div>
                              )
                            }
                            }
                            className='w-5rem'
                          />
                          
                        </DataTable>

                      </div>}
                  </div>
                )}

              </div>

              {/* ------------------------------------ Step info----------------------------------------- */}

              <div key="stepcontainer" className={`card grid mt-1 relative ${activeIndex===1 && "border-primary"}`}>
                {activeIndex === 0 && (<span className="p-tag surface-500 absolute text-sm top-0 left-0">{t("workflow.tachePrecedente")}</span>)}
                {activeIndex === 1 && (<span className="p-tag absolute text-sm top-0 " style={{ left: "43%" }}>{t("workflow.tacheActuelle")}</span>)}
                {activeIndex === 2 && (<span className="p-tag surface-500 absolute text-sm top-0 right-0">{t("workflow.tacheSuivante")}</span>)}


                <Steps model={itemsU} activeIndex={activeIndex} readOnly={false} className="mt-4 col-12" />
                {
                  activeIndexInfo()?.map((item, index) => {
                    return<div key={`stepDiv-${index}`} className='col-12'>
                      {item.discussions && item.discussions.length > 0 &&
                        <div key={`discussions-${index}`} style={{position: 'relative', marginTop: '1rem'}}> <Discussions key={`discussionComp-${index}`} step={item}/> </div>  
                      }
                      
                      <ActiveStepsTemplate  key={`active-step-template-${item.id}`}  stepI={item} />
                      {activeIndex <= 2 && <ActiveStepDocuments key={`active-step-documents-${index}`} stepI={item} />}
                      {index < activeIndexInfo()?.length - 1 && <Divider key={`divider-${index}`}/>}
                    </div>
                  }
                  )
                }
                
              </div>
            </div>

            {/* ---------------------------------------- File viewer ------------------------------------- */}

            <div className='flex-1 overflow-auto ml-5  '>
              <div className='fixed overflow-auto  ' style={{maxHeight:"75vh", maxWidth:"40vw"}}>

              {viewDocument && documentIdToView ? (
                <div className='mx-auto  '>

                  <FileViewer  documentId={documentIdToView} twoPages={false}  />
                </div> 
              ) :
                <div className="  flex flex-column align-items-center justify-content-center border-double border-500 " style={{ width: '35vw', height: '70vh' }}>
                  <p>{t("noFileToDisplay")}</p>
                  <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                </div>
              }
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <ConfirmPopup />

      <OtpProcess 
        otpType={OtpType.General}
        ref={otpRef}
        onSuccess={() => {
            parapher(step.id);
          }}
      />

    </div>
  );
};

export default TacheT;
