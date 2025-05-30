import React, { useEffect, useState } from 'react';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { stepService } from 'app/controller/service/workflow/stepService';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Tache from './Tache-action';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { workflowService } from 'app/controller/service/workflow/workflowService';
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { t } from 'i18next';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chip } from 'primereact/chip';
import { WorkflowDto } from 'app/controller/model/Workflow.model';
import { ACTION } from 'app/controller/model/workflow/stepPresetDTO';
import { CourrielCreationProvider } from '../bureau-ordre/Providers/CourrielsCreationProvider';
import CreateCourrielsBureauOrdre from '../bureau-ordre/BO_courriels/creationForm/CreateCourrielsBO';
import { RegistreProvider } from '../bureau-ordre/Providers/RegistreProvider';
import { EtablissementProvider } from '../bureau-ordre/Providers/EtablissementProvider';
import { Paginator } from 'primereact/paginator';

interface Task {
  step: StepDTO;
  workflow: WorkflowDTO;
}

const MesTaches = () => {
  const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [TasksAffiche, setTasksAffiche] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('WAITING');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const statusOptions = [
    { label: t('status.Waiting'), value: 'WAITING' },
    // { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: t('status.Done'), value: 'DONE' },
  ];

  const authService = new AuthService();
  const utilisateurService = new UtilisateurAdminService();

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

  const FlagCell = (rowData: Task) => {
    // Utilisez la valeur de flag pour déterminer la couleur du Tag
    const flag = rowData?.workflow?.flag ;
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

  const stepStatusCell = (status: StepDTO.StatusEnum) => {
    switch (status) {
      case StepDTO.StatusEnum.DONE:
        return <Tag value={t('status.Done')} severity={statusColor(status)}  />;
      case StepDTO.StatusEnum.WAITING:
        return <Tag value={t('status.Waiting')} severity={statusColor(status)}  />;
      case StepDTO.StatusEnum.PARTIAL:
        return <Tag value={t('status.Partial')} severity={statusColor(status)} />;
      case StepDTO.StatusEnum.COMPLEMENT:
        return <Tag value={t('status.Complement')} severity={statusColor(status)} />;
      default:
        return <Tag value={status} />;
    }
    
  }

  const getItemTemplateStyle = (option : string) => {
    switch (option) {  
      case 'DONE':
        return { backgroundColor: '#98C34D' }; break // Vert 
        case 'WAITING':
          return { backgroundColor: '#FFA500' }; break // Orange
      default:
        return { backgroundColor: '#D3D3D3' };
    }
  }
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [stepsPage, setStepsPage] = useState<Page<StepDTO>>();
  const fetchStepsAndWorkflows = async (status: any, userId: number, page : number, keywordSearch : string) => {
    try {
      setLoading(true); // Démarre le chargement

      let stepsResponse;
      stepsResponse = await stepService.stepsByDestinataireIdAndStatus(userId, status as string, page, size,keywordSearch);
      const stepsPage : Page<StepDTO> = stepsResponse.data;
      setStepsPage(stepsPage);
      const steps = stepsPage?.content;
      const workflowPromises = steps.map((step: { workflowId: number; }) => workflowService.getWorkflowById(step.workflowId));
      const workflowResponses = await Promise.all(workflowPromises);
      const fetchedWorkflows = workflowResponses.map(response => response.data);
      const tasksToDisplay = steps.map((step: StepDTO, index: any) => ({
        step: step,
        workflow: fetchedWorkflows[index],
      }));
      setTasksAffiche(tasksToDisplay);
      setFilteredTasks(tasksToDisplay);
    } catch (error) {
      console.error('Failed to fetch steps or workflows', error);
    }
    finally {
      setLoading(false); // Arrête le chargement
    }
  };



  useEffect(() => {
    if (connectedUser.id) {
        setPage(0);
        setSearch('');
        fetchStepsAndWorkflows(selectedStatus, connectedUser.id, 0,"");
    }
  }, [selectedStatus, connectedUser.id]);

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    setSearch(value);
  };

  const onStatusChange = (e: any) => {
    setSelectedStatus(e.value);
  };
  const tacheColumnTemplate = (rowData: any) => {
    return <Tache key={`tache-${rowData.id}`} workflow={rowData.workflow} step={rowData.step} refetch={() => fetchStepsAndWorkflows(selectedStatus, connectedUser.id, page, search)} />;

  };

  const actionColor = (rowData: ACTION) => {
    if(rowData === ACTION.APPROVE){
      return "success"
    }else if(rowData === ACTION.PARAPHER){
      return "warning"
    }else if(rowData === ACTION.PRESIGNER){
      return "warning"
    }else if (rowData === ACTION.SIGN){
      return "warning"
    }else if(rowData === ACTION.ENVOI_COURRIER){
      return "warning"
    }else if(rowData === ACTION.REJECT){
      return "danger"
    }else{
      return "info"
    }
  }
  const stepActionsPalette = [
    { label: t("stepActions.approuver"), icon: 'pi pi-thumbs-up', className: 'bg-primary', action: ACTION.APPROVE },
    { label: t("stepActions.rejeter"), icon: 'pi pi-thumbs-down', className: 'bg-red-700', action: ACTION.REJECT },
    { label: t("stepActions.parapher"), icon: 'pi pi-book', className: 'bg-orange-700', action: ACTION.PARAPHER },
    { label: t("stepActions.presigner"), icon: 'pi pi-check', className: 'bg-primary-reverse border-1 hover:bg-primary', action: ACTION.PRESIGNER },
    { label: t("stepActions.signer"), icon: 'pi pi-verified', className: 'bg-green-700', action: ACTION.SIGN },
    { label: t("stepActions.envoyerCourrier"), icon: 'pi pi-envelope', className: 'bg-blue-700', action: ACTION.ENVOI_COURRIER }
  ]
  const getActionPalette = (action: ACTION) => {
    return stepActionsPalette.filter(item => item.action === action)[0] || { label: 'Aucun', icon: '', className: 'bg-orange-700 text-white', action: ACTION.APPROVE };
  }



  const statusColor = (rowData: StepDTO.StatusEnum) => {
    if(rowData === StepDTO.StatusEnum.DONE){
      return "success"
    }else if(rowData === StepDTO.StatusEnum.PARTIAL){
      return "info"
    }else if(rowData === StepDTO.StatusEnum.WAITING){
      return "warning"
    }else if(rowData === StepDTO.StatusEnum.COMPLEMENT){
      return "danger"
    }
  }

  return (
    <CourrielCreationProvider>
      <RegistreProvider>
        <EtablissementProvider>

          <CreateCourrielsBureauOrdre showToast={() => { }} />
          <div className='w-full'>
            <div className='p-3'>
              <h2 className='text-2xl text-indigo-800'>{t("appBar.MesTaches")}</h2>
              <Toolbar
                start={<span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText value={search} onChange={onGlobalFilterChange} placeholder={t("search")}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setPage(0);
                        fetchStepsAndWorkflows(selectedStatus, connectedUser.id, 0, search);
                      }
                    }
                    }
                  />
                </span>}
                end={
                  <Dropdown
                    className='w-10rem'
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={onStatusChange}
                    placeholder="Select a Status"
                    itemTemplate={(option) => <Tag value={option.label} style={getItemTemplateStyle(option.value)}></Tag>}
                    valueTemplate={(option) => <Tag value={option.label} style={getItemTemplateStyle(option.value)}></Tag>}
                  />
                }
                className='p-2 mt-0 mb-5' />
              {loading && <>
                <div className='flex justify-content-center'>
                  <ProgressSpinner />
                </div>

              </>
              }
              {!loading && <>
                <DataTable className="custom-header" value={filteredTasks}  dataKey="step.id" emptyMessage={t("tableEmpty")} header={<h5 className="m-0">{t("totalRecords", { totalRecords: stepsPage?.totalElements })}</h5>} loading={loading}>
                  <Column field="workflow.title" header={t("workflow.titre")} />
                  <Column field="workflow.initiateurNom" header={t("workflow.Createur")} body={(rowData: Task) => {
                    return (
                      <div className="flex align-items-center gap-2">
                        <img alt="" src="/user-avatar.png" width="32" />
                        <span className='font-bold'>{rowData.workflow.initiateurNom}</span>
                      </div>
                    )
                  }} />
                  <Column field="workflow.flag" header={t("workflow.flag")} body={(rowData) => FlagCell(rowData)} />
                  <Column field="step.stepPreset.title" header={t("Tache")} />
                  <Column field="step.status" header={t("workflow.status")} body={(rowData: Task) => {
                    return (
                      <>
                        {stepStatusCell(rowData.step.status)}
                      </>
                    )
                  }} />
                  <Column field="step.stepPreset.description" header={t("actions")} body={(rowData: Task) => {
                    return (
                      <div className="flex align-items-center gap-2">
                        {rowData.step.stepPreset.actions?.map((action: ACTION, index) =>
                          <Tag key={`action-${index}`} className={`${getActionPalette(action).className} h-fit w-fit p-1.5`}>
                            <div className="flex align-items-center font-sm gap-2 p-0">
                              <i className={`${getActionPalette(action).icon}`} />
                              <span className='text-sm'>{getActionPalette(action).label}</span>
                            </div>
                          </Tag>)
                        } </div>
                    )
                  }} />
                  <Column body={tacheColumnTemplate} />
                </DataTable>
                <Paginator
                        first={(stepsPage?.number ?? 0) * (stepsPage?.size ?? 0)}
                        rows={stepsPage?.size}
                        totalRecords={stepsPage?.totalElements}
                        onPageChange={(e) => {
                            setPage(e.page);
                            fetchStepsAndWorkflows(selectedStatus, connectedUser.id, e.page, search);                            
                        }}
                    /> 

                  </>}

            </div>
          </div>
        </EtablissementProvider>

      </RegistreProvider>
    </CourrielCreationProvider>

  );
};

export default MesTaches;
