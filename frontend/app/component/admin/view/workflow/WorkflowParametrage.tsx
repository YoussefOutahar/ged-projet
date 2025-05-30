import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'primereact/carousel';
import { InputText } from 'primereact/inputtext';
import StepPresetsHierarchy from './StepPresetsHierarchy';
import { Button } from 'primereact/button';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import Create from './workflow-create-form';

import useListHook from 'app/component/zyhook/useListhook';
import { WorkflowDto } from 'app/controller/model/Workflow.model';
import { WorkflowCriteria } from 'app/controller/criteria/workflow/workflowCriteria.model';
import { WorkflowService } from 'app/controller/service/admin/WorkflowService.service';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import axiosInstance from 'app/axiosInterceptor';
import { Tooltip } from 'primereact/tooltip';
import WorkflowQuickStartForm from './components/WorkflowQuickStartForm';
import WorkflowPresetEdit from './WorkflowPresetEdit';
import { Dialog } from 'primereact/dialog';

const PresetCardsByDepartment = () => {
  const [workflowPresets, setWorkflowPresets] = useState<WorkflowPreset[]>([]);
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [presetsByDepartment, setPresetsByDepartment] = useState<Record<string, WorkflowPreset[]>>({});
  const [dialogAddVisible, setDialogAddVisible] = useState(false);
  const [dialogEditVisible, setDialogEditVisible] = useState(false);
  const [selectedWorkflowPreset, setSelectedWorkflowPreset] = useState<WorkflowPreset | null>(null);

  const [showWorkflowQuickStartDialog, setShowWorkflowQuickStartDialog] = useState<boolean>(false);

  const utilisateurAdminService = new UtilisateurAdminService();
  const authService = new AuthService();
  const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);

  const documentCategorieAdminService = new DocumentCategorieAdminService();
  const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
  const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
  const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const [UserForD, setUserForD] = useState<UtilisateurDto>(new UtilisateurDto());



  const emptyItem = new WorkflowDto();
  const emptyCriteria = new WorkflowCriteria();
  const service = new WorkflowService();
  const refresh = () => {
    //refresh data
  }
  const {
    items,
    showSearch,
    deleteItemDialog,
    archiveItemDialog,
    item,
    loading,
    selectedItems,
    setSelectedItems,
    hideDeleteItemDialog,
    hideArchivedItemDialog,
    globalFilter,
    setGlobalFilter,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showViewDialog,
    setShowViewDialog,
    selectedItem,
    setSelectedItem,
    rows,
    totalRecords,
    criteria,
    setCriteria,
    first,
    fetchItems,
    toast,
    dt,
    confirmDeleteSelected,
    confirmArchiveSelected,
    confirmMergeSelected,
    mergeItemsDialogFooter,
    hideMergeItemsDialog,
    mergeItemsDialog,
    exportCSV,
    deleteItem,
    deleteItemDialogFooter,
    rightToolbarTemplate,
    CustomBooleanCell,
    handleValidateClick,
    onPage,
    showCreateModal,
    showEditModal,
    showViewModal,
    add,
    update,
    confirmDeleteItem,
    statusBodyTemplate,
    formateDate,
    deleteSelectedItems,
    archiveSelectedItems,
    deleteItemsDialog,
    deleteItemsDialogFooter,
    hideDeleteItemsDialog,
    archiveItemsDialog,
    archiveItemsDialogFooter,
    hideArchiveItemsDialog,
    fetchItemsFromElastic
  } = useListHook<WorkflowDto, WorkflowCriteria>({ emptyItem, emptyCriteria, service, t, refresh });
  const handleCloseDialog = () => {
    setDialogAddVisible(false);
  };

  const refetchWorkflowPresets = async () => {
    const response = await WorkflowPresetService.getAllWorkflowsPreset();
    setWorkflowPresets(response.data);

    const groupedByDepartment = response.data.reduce((acc: any, preset: any) => {
      const department = preset.departement || "Unknown";
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(preset);
      return acc;
    }, {});

    setPresetsByDepartment(groupedByDepartment);
    setDialogEditVisible(false);
  };
  useEffect(() => {
    const fetchWorkflowPresets = async () => {
      const response = await WorkflowPresetService.getAllWorkflowsPreset();
      setWorkflowPresets(response.data);

      const groupedByDepartment = response.data.reduce((acc: any, preset: any) => {
        const department = preset.departement || "Unknown";
        if (!acc[department]) {
          acc[department] = [];
        }
        acc[department].push(preset);
        return acc;
      }, {});

      setPresetsByDepartment(groupedByDepartment);
    };

    const connectedUserName = authService.getUsername();
    if (connectedUserName) {
      utilisateurAdminService.getList()
        .then(({ data }) => {
          setUtilisateurs(data);

          const userConnected = data.find(user => user.username === connectedUserName);
          if (userConnected) {
            setConnectedUser(userConnected);
            setUserForD(userConnected);
          }
        })
        .catch(error => console.error("Erreur lors de la récupération des utilisateurs", error));
    }
    documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
    entiteAdministrativeAdminService.getList().then(({ data }) => setEntiteAdministratives(data)).catch(error => console.log(error));
    axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
      .then(response => setPlans(response.data))
      .catch(error => console.error('Error loading plans', error));

    fetchWorkflowPresets();

  }, []);



  // useEffect(() => {
  //   setUserForD(connectedUser);
  // }, [connectedUser]);


  const departmentOptions = [
    { label: t('workflow.TousLesDépartements'), value: '' },
    ...Array.from(new Set(workflowPresets.map(preset => preset.departement)))
      .sort((a, b) => a === UserForD.entiteAdministrative?.libelle ? -1 : b === UserForD.entiteAdministrative?.libelle ? 1 : 0)
      .map(department => ({
        label: department, value: department
      }))
  ];


  const sortedPresetsByDepartment: Record<string, WorkflowPreset[]> = Object.entries(presetsByDepartment)
    .sort(([deptA], [deptB]) => deptA === UserForD.entiteAdministrative?.libelle ? -1 : deptB === UserForD.entiteAdministrative?.libelle ? 1 : 0)
    .reduce((acc: Record<string, WorkflowPreset[]>, [department, presets]) => {
      acc[department] = presets.filter(preset => preset.title.toLowerCase().includes(searchTerm) || preset.description?.toLowerCase().includes(searchTerm));
      return acc;
    }, {});


  const filteredAndSortedPresetsByDepartment: Record<string, WorkflowPreset[]> = Object.entries(sortedPresetsByDepartment)
    .filter(([department]) => !selectedDepartment || department === selectedDepartment)
    .reduce((acc: Record<string, WorkflowPreset[]>, [department, presets]) => {
      acc[department] = presets;
      return acc;
    }, {});




  const handleDepartmentChange = (e: any) => {
    setSelectedDepartment(e.value);
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  ////////
  const placeholderPreset = () => ({
    isPlaceholder: true
  });

  const renderPresets = (presets: any) => {
    // Copie des presets pour éviter de modifier directement l'état
    let itemsToDisplay = [...presets];
    const placeholdersCount = Math.max(0, 4 - presets.length);
    for (let i = 0; i < placeholdersCount; i++) {
      itemsToDisplay.push(placeholderPreset());
    }
    return itemsToDisplay;
  };

  const truncateDescription = (description: string, length = 150) => {
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

  const presetTemplate = (workflowPreset: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const [display, setDisplay] = useState('none');

    useEffect(() => {
      let timeout:  NodeJS.Timeout | undefined;
      if (!isHovered) {
        setDisplay('none');
      } else {
        timeout = setTimeout(() => setDisplay('block'), 170); // Delay in milliseconds
      }
      return () => clearTimeout(timeout);
    }, [isHovered]);

    if (workflowPreset.isPlaceholder) {
      return (
        <div style={{ background: "#F8F9FA", width: "270px", height: "200px" }} className="pb-4 flex flex-column align-items-center justify-content-center p-3 my-1 border-round-md group shadow-2 hover:shadow-6">
          <div className="bg-slate-300 p-3 ">
              Aucun contenu supplémentaire
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{ background: "#F8F9FA", width: "270px", minHeight: "200px" , height: "200" , overflow: "clip" }}
          className="relative p-3 my-1 border-round-md group shadow-2 hover:shadow-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-slate-600 border-slate-500 rounded-lg shadow-sm overflow-hidden">
            <div className="px-2 pt-2 "  >
              <div className='formgroup-inline'>
                <div className='field'> <StepPresetsHierarchy workflowPreset={workflowPreset}></StepPresetsHierarchy></div>


                <div className=" ml-0 mt-1 p-0  surface-overlay w-8 white-space-nowrap overflow-hidden text-overflow-clip">

                  <h4 style={{ background: "#F8F9FA" }} className="font-bold text-blue-900 mb-0 mt-0 text-lg">{workflowPreset.title}</h4>
                </div>

              </div>


              <div className="scroll-auto  surface-overlay p-2 border-blue-800 border-2 border-round" style={{ height: isHovered?"55px":"110px", overflowY: "clip",textOverflow:"ellipsis", fontSize: '0.875rem',   transition: 'height 0.3s ease-in-out' }}>
                <p className="text-black-alpha-80 mb-3 text-xs"  >
                  {
                    truncateDescription(workflowPreset.description)
                  }
                </p>
              </div>

              <div style={{
                opacity: isHovered ? 1 : 0,
                // visibility: isHovered ? 'visible' : 'hidden',
                overflow: 'hidden',
                display: display,
                minHeight: isHovered ? 'auto' : '0',
                transition: 'opacity 0.3s, visibility 0.3s, height 0.3s'
              }} className='group/test mx-6'>
                <footer className="rounded-b-lg flex justify-content-center align-items-center ">
                  <Button
                    className='text-xs p-2 mt-3 pr-3 transition-opacity duration-300'
                    severity='success'
                    type="button"
                    label={t("appBar.lancezWorkflow")}
                    icon="pi pi-play"
                    onClick={() => { setDialogAddVisible(true); setSelectedWorkflowPreset(workflowPreset); }}
                    style={{
                      // backgroundColor: isHovered ? '' : 'initial',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }}
                  />
                </footer>
              </div>
              <Button
                    className='absolute bottom-0 right-0 transition-opacity duration-300'
                    type="button"
                    rounded
                    text
                    tooltip='Démarrage rapide'
                    icon="pi pi-bolt text-yellow-400 text-2xl p-0 m-0 h-fit w-fit"
                    onClick={() => { setShowWorkflowQuickStartDialog(true); setSelectedWorkflowPreset(workflowPreset); }}
                    style={{
                      // backgroundColor: isHovered ? '' : 'initial',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }}
                  />
                  <Button className='absolute bottom-0 left-03 transition-opacity duration-300'
                    severity='warning'
                    text
                    icon="pi pi-pencil text-xl p-0 m-0 h-fit w-fit"
                    tooltip='Editer le paramétrage'
                    onClick={() => { setDialogEditVisible(true); setSelectedWorkflowPreset(workflowPreset); }}
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }}
                  />
            </div>
          </div>

        </div>
      );

    }

  };

  const filteredPresetsByDepartment: Record<string, WorkflowPreset[]> = Object.entries(presetsByDepartment)
    .filter(([department]) => !selectedDepartment || department === selectedDepartment)
    .reduce((acc: Record<string, WorkflowPreset[]>, [department, presets]) => {
      acc[department] = presets.filter(preset => preset.title.toLowerCase().includes(searchTerm) || preset.description?.toLowerCase().includes(searchTerm));
      return acc;
    }, {});

  const startContent = (
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText placeholder={t("search")}
        value={searchTerm}
        onChange={handleSearchChange}

      />
    </span>
  );
  const endContent = (
    <Dropdown
      value={selectedDepartment}
      options={departmentOptions}
      onChange={handleDepartmentChange}
      placeholder={t("Sélectionner un département")}
    />
  );
  return (
    <div>
      <Toolbar start={startContent} end={endContent} className='p-1 mt-0' />
      {Object.entries(filteredAndSortedPresetsByDepartment).map(([department, presets]) => (
        <div key={department}>
          <Chip
            label={department}
            icon="pi pi-building"
            className="text-lg text-white  bg-blue-900  px-3 mb-1 my-2"
          />

          <Carousel value={renderPresets(presets)} itemTemplate={presetTemplate} numVisible={4} numScroll={1} responsiveOptions={[
            {
              breakpoint: '1024px',
              numVisible: 3,
              numScroll: 3
            },
            {
              breakpoint: '600px',
              numVisible: 2,
              numScroll: 2
            },
            {
              breakpoint: '480px',
              numVisible: 1,
              numScroll: 1
            }
          ]} />
          <Create visible={dialogAddVisible} onClose={handleCloseDialog} add={add}
            showToast={toast} list={items} service={service} t={t}
            workflowPreset={selectedWorkflowPreset ? selectedWorkflowPreset : new WorkflowPreset()}
            connectedUser={connectedUser} utilisateurs={utilisateurs}
            documentCategories={documentCategories} entiteAdministratives={entiteAdministratives}
            plans={plans}
          />
          <WorkflowQuickStartForm
            visible={showWorkflowQuickStartDialog}
            setVisible={setShowWorkflowQuickStartDialog}
            connectedUser={connectedUser}
            showToast={toast}
            workflowPreset={selectedWorkflowPreset ? selectedWorkflowPreset : new WorkflowPreset()}
            documentCategories={documentCategories} entiteAdministratives={entiteAdministratives}
          />
          {dialogEditVisible && 
          <Dialog visible={dialogEditVisible} style={{ width: '50vw' }} header="Editer le paramétrage" modal className="p-fluid" onHide={() => setDialogEditVisible(false)}>
            <div className="flex justify-center w-full my-4">
              <div className="w-full max-w-md">
                <WorkflowPresetEdit 
                  utilisateurs={utilisateurs} 
                  workflowPresteId={selectedWorkflowPreset ? selectedWorkflowPreset?.id : 0} 
                  refresh={() => refetchWorkflowPresets()}
                  editVisible={dialogEditVisible}
                  setDialogEditVisible={setDialogEditVisible}
                />
              </div>
            </div>
          </Dialog>
          }
          <Toast ref={toast} />

        </div>
      ))}
    </div>
  );
};

export default PresetCardsByDepartment;
