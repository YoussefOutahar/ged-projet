import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model'
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model'
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO'
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service'
import { workflowService } from 'app/controller/service/workflow/workflowService'
import { AuthService } from 'app/zynerator/security/Auth.service'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StepHierarchy from './StepHierarchy'
import WorkflowView from './WorkflowView'
import { Toast } from 'primereact/toast'
import { WorkflowDto } from 'app/controller/model/Workflow.model'
import Create from './workflow-create-form'
import useListHook from 'app/component/zyhook/useListhook'
import { WorkflowCriteria } from 'app/controller/criteria/workflow/workflowCriteria.model'
import { WorkflowService } from 'app/controller/service/admin/WorkflowService.service'
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset'
import { Toolbar } from 'primereact/toolbar'
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service'
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service'
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model'
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import axiosInstance from 'app/axiosInterceptor'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Paginator } from 'primereact/paginator'
import { Workflow } from 'app/controller/model/workflow/workflow'
import { number } from 'yup'
import { useRouter } from 'next/router'
import { TypeCourriel } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre'
import { useCourrielCreationContext } from '../bureau-ordre/Providers/CourrielsCreationProvider'
import { StepDTO } from 'app/controller/model/workflow/stepDTO'
import { MailRequest } from 'app/controller/model/mail/MailRequest'
import { MailService } from 'app/controller/service/mail/mailService'
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;


const WorkflowList = () => {

  const [workflowAs, setWorkflowAs] = useState<WorkflowDTO[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedWorkflowType, setSelectedWorkflowType] = useState<Workflow.StatusEnum>(Workflow.StatusEnum.OPEN);


  const { t } = useTranslation();

  const [openPage, setOpenPage] = useState(0);
  const [closedPage, setClosedPage] = useState(0);
  const rows = 7; // Nombre de lignes par page
  const utilisateurCriteria = new UtilisateurCriteria();
  const authService = new AuthService();
  const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
  const utilisateurService = new UtilisateurAdminService();

  const [addDocument, setAddDocument] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WorkflowDTO>();
  const toast = useRef<Toast>(null);

  const emptyItem = new WorkflowDto();
    const emptyCriteria = new WorkflowCriteria();
    const service = new WorkflowService();


    const documentCategorieAdminService = new DocumentCategorieAdminService();    
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
    const utilisateurAdminService = new UtilisateurAdminService();


    
    const refresh = () => {
        //refresh data
    }
  const {
    items,
    item,
    dt,
    add,
} = useListHook<WorkflowDto, WorkflowCriteria>({ emptyItem, emptyCriteria, service, t, refresh });

  useEffect(() => {
    const connectedUserName = authService.getUsername();
    if (connectedUserName) {
      utilisateurAdminService.getList()
        .then(({ data }) => {
          setUtilisateurs(data); 
  
          // Trouve et met à jour l'utilisateur connecté en utilisant la liste récupérée
          const userConnected = data.find(user => user.username === connectedUserName);
          if (userConnected) {
            setConnectedUser(userConnected);
          }
        })
        .catch(error => console.error("Erreur lors de la récupération des utilisateurs", error));
    

      documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
      entiteAdministrativeAdminService.getList().then(({ data }) => setEntiteAdministratives(data)).catch(error => console.log(error));
      
      axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
        .then(response => setPlans(response.data))
        .catch(error => console.error('Error loading plans', error));
    }


  }, []);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalpageNumber, setTotalPageNumber] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);





  const fetchWorkflows = async ( status : Workflow.StatusEnum ,  pageNumber: number ) => {
    try {
      setLoading(true); // Démarre le chargement

      const response = await workflowService.getWorkflowByInitiatuerIdByStatusPaginate(connectedUser.id ,status , pageNumber);
      setWorkflowAs(response.data.content);
      setTotalRecords(response.data.totalElements);
      setTotalPageNumber(response.data.totalElements);
     } catch (error) {
      console.error('Erreur lors du chargement des Workflows : ', error);
    }
    finally {
      setLoading(false); // Arrête le chargement
    }
  };


    useEffect(() => {
    if (connectedUser && connectedUser.id) {
      fetchWorkflows(selectedWorkflowType , pageNumber);
    }
  }, [connectedUser]); 



  const showViewModal = (item: WorkflowDTO) => {
    setSelectedItem(item);
    setShowViewDialog(true);
  };
  const hideAddDialog = () =>{
    setAddDocument(false);
  }

  const annulerWorkflow = (item: number) => {
    WorkflowService.annulerWorkflow(item)
        .then(response => {                
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Workflow annulé avec succès', life: 3000 });     
            fetchWorkflows( selectedWorkflowType , pageNumber);        
        })
        .catch(error => {
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de lannulation de la Workflow', life: 3000 });
        });
};


  const StatusCell = (rowData: WorkflowDTO) => {
    let statusLabel 
    switch (rowData.status) {
        case 'OPEN':
              statusLabel = t("workflow.Open");
              break;
            case 'CLOSED':
              statusLabel = t("workflow.Closed");
            break;
        case 'REJECTED':
            statusLabel = t("workflow.Rejeted");
            break;

            case 'Annulled':
              statusLabel = t("Annuler");
              break;
            case 'REOPENED':
              statusLabel = t("workflow.Reopen");
              break;
        default:
            statusLabel = 'Inconnu'; 
    }
    let tagSeverity: "success" | "danger" | "warning" | "info" | null | undefined = null;
    switch (rowData.status) {
        case 'OPEN':
            tagSeverity = 'info';
            break;
        case 'CLOSED':
            tagSeverity = 'success';
            break;
        case 'REJECTED':
            tagSeverity = 'danger'; 
            break;
            case 'Annulled':
              tagSeverity = 'warning'; 
              break;
            case 'REOPENED':
              tagSeverity = 'warning';
              break;
        default:
            tagSeverity = 'info'; 
    }

    return (
        <div style={{ marginBlock: "0rem" }}>
            <Tag value={statusLabel} severity={tagSeverity} />
        </div>
    );
};

  const FlagCell = (rowData: WorkflowDTO) => {
    const flag = rowData?.flag ;
    return (
      <div style={{ marginBlock: "0rem" }}>
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

  const handleWfPoke = (workflow: WorkflowDTO) => {
    const firstWaitingStep = workflow.stepDTOList?.find(step => step.status === StepDTO.StatusEnum.WAITING);
    const destinataires = firstWaitingStep?.stepPreset.destinataires || [];
    destinataires.forEach(destinataire => {     
      let newMailRequest = new MailRequest()
      newMailRequest.toEmail = destinataire.utilisateur.email;
      newMailRequest.subject = `${workflow.title} - ${workflow.workflowPresetDTO?.title} : Tâches en attente`;
      newMailRequest.message = `Bonjour,\n\n   Vous avez des tâches en attente dans les Workflows ${workflow.title} - ${workflow.workflowPresetDTO?.title}.\nMerci de les traiter dans les plus brefs délais.\n\nCordialement.\n${connectedUser.nom} ${connectedUser.prenom}`;
      MailService.sendMail(newMailRequest)
    }
    );
  }

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');

  const showFullDescription = (rowData : any ) => {
    setSelectedDescription(rowData.description);
    setDialogVisible(true);
  };

  const reOpen = (item: WorkflowDTO) => {
    WorkflowService.reOpen(item)
        .then(response => {                
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Workflow reouverte avec succès', life: 3000 });     
            setSelectedWorkflowType(selectedWorkflowType);
            fetchWorkflows( selectedWorkflowType , pageNumber);        
        })
        .catch(error => {
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la récouvrement du workflow', life: 3000 });
        });
  }

  const close = (item: WorkflowDTO) => {
    WorkflowService.close(item)
        .then(response => {                
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Workflow fermé avec succès', life: 3000 });     
            setSelectedWorkflowType(selectedWorkflowType);
            fetchWorkflows( selectedWorkflowType , pageNumber);        
        })
        .catch(error => {
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la fermeture du Workflow', life: 3000 });
        });
  }

  const descriptionBodyTemplate = (rowData : any) => {
    return (
      <>
        {rowData.description.length > 20 ? (
          <div>
            {rowData.description.substring(0, 20)}
            <Button label="..." className="p-0 ml-0 p-button-text p-button-sm -mt-4" onClick={() => showFullDescription(rowData)} />
          </div>
        ) : (
          rowData.description
        )}
      </>
    );
  };

  const handleWorkflowTypeChange = (e: DropdownChangeEvent ) => {
    setSelectedWorkflowType(e.value);
    setPageNumber(0);
    fetchWorkflows(e.value ,0);
  };
  const handlePageNumberChange = ( ePage :number) => {
    setPageNumber(ePage);
    fetchWorkflows(selectedWorkflowType , ePage);
  };


  const workflowTable = (workflows: WorkflowDTO[], title: string, onPageChange: (e: any) => void, page: number) => (
    <div>
      <div className="p-4">
      <h2 className='text-2xl text-indigo-800'>{title}</h2>
    <Toolbar   
    // start={<h5 className="m-0">{t("workflow.header", {totalRecords})}</h5>}
    // center={<span className="block mt-2 md:mt-0 p-input-icon-left">
    //         <i className="pi pi-search" />
    //         <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
    //             placeholder={t("search")} /> </span>}  
    start={<Dropdown 
          value={selectedWorkflowType} 
          options={[
            {label: t('workflow.OpenWorkflows'), value: Workflow.StatusEnum.OPEN}, 
            {label: t('workflow.ClosedWorkflows'), value: Workflow.StatusEnum.CLOSED},
            {label: t('workflow.RejectedWorkflows'), value: Workflow.StatusEnum.REJECTED},
            {label: t('Worflow annuler '), value: Workflow.StatusEnum.Annulled},
          ]}
          onChange={(e) => handleWorkflowTypeChange(e) }             
          placeholder={t('Select Workflow Type')} 
        />}  
        className='p-2 mt-0 mb-5'  />

          {loading && <>
          <div className='flex justify-content-center'>
          <ProgressSpinner  />
          </div>
          </>
          } 

        {!loading && <>
          <DataTable  
          className=''  
          header={
          <div className='flex flex-row justify-content-between align-items-center'>
            <h5 className="m-0">{t("workflow.header", {totalRecords})}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                placeholder={t("search")} /> </span>
          </div>}
        value={workflowAs} 
        rows={rows} 
        emptyMessage={<div className="flex justify-content-center">Aucun Workflow trouvé</div>} 
        globalFilter={globalFilter}
        onPage={onPageChange}
        totalRecords={totalRecords}
        first={page * rows}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="{totalRecords} Workflows total, {first} to {last}">          
        <Column field="title" header={t("workflow.titre")} />
        <Column field="dateC" header={t("workflow.DateCreation")} body={(rowData: any) => (
          <span>{rowData.dateC ? new Date(rowData.dateC).toLocaleDateString() : ""}</span>)} />
        <Column field="status" header={t("workflow.status")} body={StatusCell} />
        <Column field="description" header={t("workflow.Description")} body={descriptionBodyTemplate} />
        <Column field="flag" header={t("workflow.flag")} body={(rowData)=>FlagCell(rowData)} />
        <Column field="workflowPresetDTO.title" header={t("appBar.workflowPreset")} />
        <Column body={actionTemplate}  />
      </DataTable>
      <Paginator first={pageNumber * rows} rows={rows} totalRecords={totalpageNumber} onPageChange={(e) => handlePageNumberChange(e.page)} />
        </>}
      <Dialog  className='w-6' visible={dialogVisible} onHide={() => setDialogVisible(false)} header={t("workflow.Description")}  modal>
        <p>{selectedDescription}</p>
      </Dialog>
      {addDocument && (
        <Create visible={addDocument} onClose={hideAddDialog} add={add}
          showToast={toast} list={items} service={service} t={t}
          workflowDto={selectedItem as WorkflowDto}
          workflowPreset={selectedItem && selectedItem.workflowPresetDTO ? selectedItem.workflowPresetDTO : new WorkflowPreset()}
          connectedUser={connectedUser} utilisateurs={utilisateurs}
          documentCategories={documentCategories} entiteAdministratives={entiteAdministratives}
          plans={plans}
        />  
      )}
      {showViewDialog && <WorkflowView visible={showViewDialog} onClose={() => {
        setShowViewDialog(false);
        setSelectedItem(undefined);
      }} selectedItem={selectedItem as WorkflowDto} t={t} showToast={toast} />}
      </div>
    </div>
  );

    return (
    <div> 
        <Toast ref={toast} />
      <div className='flex flex-row'>
      </div>
      <div className="datatable-templating-demo">
        
      {selectedWorkflowType ===  Workflow.StatusEnum.OPEN && workflowTable(workflowAs, t('workflow.OpenWorkflows'), (e) => setOpenPage(e.page), openPage)}
      {selectedWorkflowType ===  Workflow.StatusEnum.CLOSED && workflowTable(workflowAs, t('workflow.ClosedWorkflows'),  (e) => setClosedPage(e.page), closedPage)}
      {selectedWorkflowType ===  Workflow.StatusEnum.REJECTED && workflowTable(workflowAs, t('workflow.RejectedWorkflows'),  (e) => setClosedPage(e.page), closedPage)}
      {selectedWorkflowType ===  Workflow.StatusEnum.Annulled && workflowTable(workflowAs, t('workflow annuler '),  (e) => setClosedPage(e.page), closedPage)}
        

        
       
      </div>
    </div>
  );

  function actionTemplate(rowData:WorkflowDTO) {
    const router = useRouter();
    const COURRIELS_URL = process.env.NEXT_PUBLIC_COURRIEL_URL as string;
    // const getCourriel = (workflowId: number) =>{
    //   axiosInstance.get(`${COURRIELS_URL}workflow/${workflowId}`)
    //   .then((response) => {
    //     if(response.data.length > 0){
    //       localStorage.setItem('courriel', JSON.stringify(response.data[0]));
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    // }
    const [isHovered,setIsHovered] = useState(false);
    return (
      <React.Fragment>
        <div  onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {
            selectedWorkflowType === Workflow.StatusEnum.OPEN && (
              <Button className={`mr-2  text-xl font-bold bg-primary-reverse hover:bg-blue-500 hover:text-white  ${!isHovered && "opacity-0"}`} icon="pi pi-envelope " severity='info' text  rounded raised  tooltip='Notifier par mail'
                onClick={
                  (e) => {
                      confirmPopup({
                          target: e.currentTarget,
                          message:"Notifier les personnes concernées de finir les taches liées à ce flux ?",
                          icon: "pi pi-exclamation-triangle",
                          accept: () => handleWfPoke(rowData),
                          acceptLabel: "Je confirme",
                          rejectLabel: "Annuler"
                      });
                  }
              } 
              />
            )
          }
        
        {selectedWorkflowType === Workflow.StatusEnum.CLOSED && (<Button icon="pi pi-replay" tooltip='Reouvrir le flux' severity='success' 
          //onClick={(e) => reOpen(rowData)} 
          onClick={
            (e) => {
                confirmPopup({
                    target: e.currentTarget,
                    message:"Vous voulez vraiment reouvrir ce Workflow ?",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => reOpen(rowData),
                    acceptLabel: "Oui",
                    rejectLabel: "Non"
                });
            }
        }     
          className='mr-1' />)}
        {rowData.status === Workflow.StatusEnum.REOPENED && (
          <Button raised icon="pi pi-check-circle" severity="success" className="mr-1" tooltip='Valider le flux'
            onClick=
            {
                (e) => {
                    confirmPopup({
                        target: e.currentTarget,
                        message:"Vous voulez vraiment fermé ce Workflow ?",
                        icon: "pi pi-exclamation-triangle",
                        accept: () => close(rowData),
                        acceptLabel: "Oui",
                        rejectLabel: "Non"
                    });
                }
            }                 
          />                  
        )}
        {selectedWorkflowType === Workflow.StatusEnum.OPEN && rowData.status !== Workflow.StatusEnum.REOPENED && (<Button icon="pi pi-replay" severity='warning' onClick={(e) => {setAddDocument(true); setSelectedItem(rowData)}} className='mr-1' />)}
        <StepHierarchy workflow={rowData}></StepHierarchy>
        <Button raised icon="pi pi-eye" severity="help" className="mr-1" onClick={() => showViewModal(rowData)} />
        
        {selectedWorkflowType === Workflow.StatusEnum.OPEN && (
          <Button raised icon="pi pi-times-circle" severity="danger" className="mr-1"
            onClick=
            {
                (e) => {
                    confirmPopup({
                        target: e.currentTarget,
                        message:"Vous voulez vraiment annulée ce Workflow ?",
                        icon: "pi pi-exclamation-triangle",
                        accept: () => annulerWorkflow(rowData.id||0),
                        acceptLabel: "Oui",
                        rejectLabel: "Non"
                    });
                }
            }                 
          />                  
        )}
        <ConfirmPopup/>
        {/* {selectedWorkflowType === Workflow.StatusEnum.CLOSED && (
             <Button icon="pi pi-envelope" severity='info' 
             onClick={(e) => {
               getCourriel(rowData.id || 0)
               localStorage.setItem("bureauOrdreCourriel", "true");
               localStorage.setItem('workflow', JSON.stringify(rowData));
               router.push("/bureau-ordre-courriels")
             }}
             className='mr-1 bg-blue-500 border-blue-500 hover:bg-blue-700 hover:border-blue-700' 
           />
        )} */}
        </div>
       
      </React.Fragment>
    );
  }
}

export default WorkflowList;