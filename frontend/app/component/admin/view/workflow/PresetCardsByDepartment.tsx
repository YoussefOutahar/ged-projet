import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'primereact/carousel';
import { InputText } from 'primereact/inputtext';
import WorkflowPresetEdit from './WorkflowPresetEdit';
import StepPresetsHierarchy from './StepPresetsHierarchy';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import WorkflowPresetCreateForm from './WorkflowPresetCreateForm';
import { Chip } from 'primereact/chip';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { Tooltip } from 'primereact/tooltip';

const PresetCardsByDepartment = () => {
  const [workflowPresets, setWorkflowPresets] = useState<WorkflowPreset[]>([]);
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [presetsByDepartment, setPresetsByDepartment] = useState<Record<string, WorkflowPreset[]>>({});
  const utilisateurAdminService = new UtilisateurAdminService();
  const authService = new AuthService();
  const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);

  const [UserForD, setUserForD] = useState<UtilisateurDto>(new UtilisateurDto());


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
  useEffect(() => {
    fetchWorkflowPresets();

    const connectedUserName = authService.getUsername();
    if (connectedUserName) {
      utilisateurAdminService.getList()
        .then(({ data }) => {
          setUtilisateurs(data); // Met à jour la liste des utilisateurs

          // Trouve et met à jour l'utilisateur connecté en utilisant la liste récupérée
          const userConnected = data.find(user => user.username === connectedUserName);
          if (userConnected) {
            setConnectedUser(userConnected);
            setUserForD(userConnected);
          }
        })
        .catch(error => console.error("Erreur lors de la récupération des utilisateurs", error));
    }
  }, []);





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

  const handleDepartmentChange = (e: any) => {
    setSelectedDepartment(e.value);
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value.toLowerCase());
  };


  const placeholderPreset = () => ({
    isPlaceholder: true // Ajouter un indicateur pour reconnaître les placeholders
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



  ////

  const truncateDescription = (description: string, length = 90) => {
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

  const presetTemplate = (item: any) => {
    // Vérifier si l'item est un placeholder
    if (item.isPlaceholder) {
      return (
        <div style={{ background: "#F8F9FA", width: "270px", height: "235px" }} className="p-3 my-1 border-round-md group shadow-2 hover:shadow-6">
          <div className="bg-slate-300 p-3">
            <div className="text-center">Aucun contenu supplémentaire</div>

            <div className='flex justify-content-center mt-6'>
              <WorkflowPresetCreateForm utilisateurs={utilisateurs} connectedUser={connectedUser} refresh={() => fetchWorkflowPresets()} />
            </div>
          </div>
        </div>
      );
    } else { // Render la carte normale
      return (
        <div style={{ background: "#F8F9FA", width: "270px" }}  className="p-3 my-1 border-round-md group shadow-2 hover:shadow-6">
          <div className="bg-slate-600 border-slate-500 rounded-lg shadow-sm overflow-hidden p-0">
            <div className="p-0">
              <div className="  px-2 mb-4 text-center " style={{overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
                <h4 style={{ background: "#F8F9FA" }} className="font-bold text-blue-900 mb-0 mt-0 text-lg">{item.title}</h4>
              </div>
              <div className="line-height-4 ">
                <div className="p-1 overflow-hidden border-2 border-round border-blue-800 h-5rem  " style={{ height: "55px", fontSize: '0.875rem' }}>
                  <p className="text-black-alpha-80 mb-3">
                    {truncateDescription(item.description)}
                  </p>
                </div>
              </div>
              <div className="mb-2 pt-2">
                <span className="mt-2 mb-1 text-xs font-semibold text-blue-900 uppercase">{t("workflow.CreatedBy")} :</span>
                <span className="text-gray-800 text-xs ml-2">{item.createurNom} {item.createurPrenom}</span>
              </div>
              <div className="mb-2 ">
                <span className=" mb-1 text-xs font-semibold text-blue-900 uppercase">{t("workflow.DateCreation")} :</span>
                <span className="text-gray-800 text-xs ml-2">{item.dateC ? new Date(item.dateC).toLocaleDateString() : ""}</span>
              </div>
              <div style={{ background: "#F8F9FA" }}>
                <footer className="p-0 bg-gray-100 rounded-b-lg flex justify-between items-center ">
                  <WorkflowPresetEdit utilisateurs={utilisateurs} workflowPresteId={item.id} refresh={() => fetchWorkflowPresets()}></WorkflowPresetEdit>
                  <StepPresetsHierarchy workflowPreset={item}></StepPresetsHierarchy>
                </footer>
              </div>
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

  const filteredAndSortedPresetsByDepartment: Record<string, WorkflowPreset[]> = Object.entries(sortedPresetsByDepartment)
    .filter(([department]) => !selectedDepartment || department === selectedDepartment)
    .reduce((acc: Record<string, WorkflowPreset[]>, [department, presets]) => {
      acc[department] = presets;
      return acc;
    }, {});

  const startContent = <WorkflowPresetCreateForm utilisateurs={utilisateurs} connectedUser={connectedUser} refresh={() => fetchWorkflowPresets()} />;
  const searchContent = (
    <InputText
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder={t("Rechercher...")}
      className="p-mr-2"
    />
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
      <Toolbar start={startContent} center={searchContent} end={endContent} className='p-1 mt-0' />
      {Object.entries(filteredAndSortedPresetsByDepartment).map(([department, presets]) => (
        <div key={department}>
          <Chip
            label={department}
            icon="pi pi-building"
            className="text-lg text-white bg-blue-900 px-3 mb-1 my-2"
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
        </div>
      ))}
    </div>
  );
}
export default PresetCardsByDepartment;
