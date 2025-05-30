import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { use, useEffect, useState } from 'react'
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';

import { AuthService } from 'app/zynerator/security/Auth.service';
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { SelectButton } from 'primereact/selectbutton';
import StepCreateForm from './StepCreateForm';
import { workflowService } from 'app/controller/service/workflow/workflowService';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { number } from 'yup';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { stepPresetService } from 'app/controller/service/workflow/stepPresetService';


type Props = {
    workflowPresetId : number

}

const CreatWorkflowForm = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [selectedStepPreset,setselectedStepPreset ] = useState<StepPresetDTO[]> (new Array <StepPresetDTO> ())
  const utilisateurService = new UtilisateurAdminService();
  const utilisateurCriteria = new UtilisateurCriteria();
  const utilisateurAdminService = new UtilisateurAdminService();
  const authService = new AuthService();
  const [selectedWorkflowPreset, setSelectedWorkflowPreset] = useState<WorkflowPresetDTO>(  {
    id: 0,
    title: '',
    description: '',
    stepPresets: [{
       id: 0,
      title: "Step 1",
      level: 1,
      description: "",
      workflowPresetId: 0,
      destinataires: [],
      actions: []
    }],
    dateC: '',
    dateUpdate: '',
    createurId: 0,
    createurNom: '',
    createurPrenom:'',
    departement: '',
  });
  const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
  
  useEffect(() => {
    //Get all users
    utilisateurAdminService.getList().then(({ data }) => {
      setUtilisateurs(data);
    }).catch(error => console.log(error));  

    //Get connected user
    const connectedUserName = authService.getUsername();
    utilisateurCriteria.username = connectedUserName;

    utilisateurService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
        const user = data?.list[0];
        setConnectedUser(user);
    });
   

  }, []);


  const [workflowDTO, setWorkflowDTO] = useState< WorkflowDTO>({
    title: '',
    description: '',
    status:'CLOSED' ,
    flag: 'NORMALE',
    dateC: '',
    dateUpdate: '',
    initiateurId: connectedUser.id,
    stepDTOList :[], 
    workflowPresetDTO: selectedWorkflowPreset,
  })


  const [stepPresets, setStepPresets] = useState<StepPresetDTO[]>([{
    id: 0,
    title: "Step 1",
    level: 1,
    description: "",
    workflowPresetId: 0,
    destinataires: [],
    actions: []
  }]);
 





  const onStepPresetChange = (updatedStepPreset: Partial<StepPresetDTO>, index: number) => {
    const updatedPresets = [...stepPresets];
    updatedPresets[index] = { ...updatedPresets[index], ...updatedStepPreset };
        setStepPresets(updatedPresets);
  };
   
   const flagOptions = WorkflowDTO.workflowFlagOptions;

   const [steps, setSteps] = useState<StepDTO[]>([]);



   useEffect(() => {
    if (selectedStepPreset && selectedStepPreset.length > 0) {
      // Pour chaque élément dans selectedStepPreset, crée un nouvel élément StepDTO et l'ajoute à 'steps'
      selectedStepPreset.forEach((stepPreset) => {
        const step :StepDTO ={
          id : 0,
          stepPreset : stepPreset,
           workflowId : workflowDTO.id ||0,
           status :'WAITING',
           discussions :[],
           documents : [],
           createdOn: new Date().toISOString(),
           updatedOn: new Date().toISOString(),
           createdBy: connectedUser!.username,
           updatedBy: connectedUser!.username
          }
        // Ajoute le nouveau step à l'état existant
         setSteps(prevSteps => [...prevSteps, step]);
      });
    }
  }, [selectedStepPreset, workflowDTO.id]);  // Attention à l'ajout de `steps` dans les dépendances




  const showDialog = async (  ) => {
    try {

      
      WorkflowPresetService.getWorkflowPresetById(props.workflowPresetId).then(({ data } )=>{
        setSelectedWorkflowPreset(data);}).catch(error => console.log(error));
      
        stepPresetService.getStepPresetByWorkflow(props.workflowPresetId).then(({ data } )=>{
          setselectedStepPreset(data);
        
        }).catch(error => console.log(error));

      

      setVisible(true);
    } catch (error) {
      console.error('Error fetching workflow preset:', error);
      // Gérer les erreurs de requête ici
    }
  };

  const hideDialog = () => {
    setVisible(false);
  };


 
  const handleSubmit = () => {
    workflowDTO.stepDTOList =steps
    workflowDTO.initiateurId=connectedUser.id;
    workflowDTO.workflowPresetDTO =selectedWorkflowPreset
        
    workflowService.createWorkflow(workflowDTO as WorkflowDTO)
    .then((response) => {
    console.log('Form submitted:', response.data);
    }).catch(error => console.log(error));

      console.log(workflowDTO)
   
    setVisible(false); 
  };

  return (

    <div>
      <div className="flex justify-center mt-1">
      {/* -----------------Button that shows the Dialog------------*/}
      <Button className='flex-auto' type="button"  label="Lancer le workflow  "onClick={() => showDialog()} />

      {/* -----------------Dialog that contains the form------------*/}
      <Dialog
        header={
          <h3 className="text-900 font-medium text-3xl text-indigo-800">{ selectedWorkflowPreset.title||"Create Workflow "}</h3>
        }
        visible={visible}
        style={{ width: '50vw', height: '90vh' }}
        onHide={hideDialog}
        footer={
          <div className="p-d-flex p-jc-between">
            <Button label="Cancel" className="p-button-secondary" onClick={hideDialog} />
            <Button label="Submit" className="p-button-primary" onClick={handleSubmit} />
          </div>
        }
      >
        <div className="p-fluid   ">

          {/*------------------------ WorkflowPreset Title and Description ---------------------------------*/}
          <div className="p-field flex flex-column">
            <label htmlFor="title">Title</label>
            <InputText type="text" className='w-8 ' id="title" value={selectedWorkflowPreset.title} disabled />
            <label htmlFor='description'>Description</label>
            <InputTextarea id="description" value={selectedWorkflowPreset.description} disabled />
          
            <label htmlFor="title">Title</label>
            <InputText type="text" className='w-8' id="title" value={workflowDTO.title} onChange={(e) => setWorkflowDTO({ ...workflowDTO,title : e.target.value })} />

            <label htmlFor='description'>Description</label>
            <InputTextarea id="description" value={workflowDTO.description}  onChange={(e) => setWorkflowDTO({ ...workflowDTO,description : e.target.value })} />
          
            
            <SelectButton className='m-5' value={workflowDTO.flag} onChange={(e) => setWorkflowDTO({ ...workflowDTO,flag : e.value })}    options={flagOptions} />
            
          </div>

          {/*------------------------ WorkflowPreset Steps  ---------------------------------*/}
          <h3 className="text-900 font-medium text-3xl text-indigo-800">Steps</h3>
             
        
             {          

            selectedStepPreset.map((stepPreset, index) => {
              return (
                
                <StepCreateForm  key={index}   utilisateurs={utilisateurs} stepPreset={stepPreset} onStepPresetChange={(updatedStep) => onStepPresetChange(updatedStep, index)}  />

              );
            })
          }
         

        </div>
      </Dialog>
    </div>

         </div>
  )
};

export default CreatWorkflowForm;



