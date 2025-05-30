import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react'
import DeleteWorkflowPreset from './DeleteWorkflowPreset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import StepPresetCreateForm from './StepPresetCreateForm';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { stepPresetService } from 'app/controller/service/workflow/stepPresetService';
import { t } from 'i18next';

type Props = {
  workflowPresteId : number
  utilisateurs : UtilisateurDto[]
  refresh: () => void;
  editVisible?: boolean;
  setDialogEditVisible?: (visible: boolean) => void;
}

const WorkflowPresetEdit = ({refresh,workflowPresteId, utilisateurs, editVisible, setDialogEditVisible}: Props) => {
    
    const [visible, setVisible] = useState(false);
    const [editable, setEditable] = useState(false);
    const [selectedStepPreset,setselectedStepPreset ] = useState<StepPresetDTO[]> (new Array <StepPresetDTO> ())
    const [isFormValid, setIsFormValid] = useState(false);

    const [selectedWorkflowPreset, setSelectedWorkflowPreset] = useState<WorkflowPresetDTO>(
      {
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
      }
    );

  const hideDialog = () => {
    setVisible(false);
    setDialogEditVisible && setDialogEditVisible(false);
  };
  const handleEditClick = () => {
    setEditable(true);
  };

  useEffect(() => {
    if (editVisible) {
      showDialog(workflowPresteId);
    }
  }, [editVisible]);



  
  const showDialog = async ( workflowPresetId : number) => {
    try {

            
      WorkflowPresetService.getWorkflowPresetById(workflowPresetId).then(({ data } )=>{
        setSelectedWorkflowPreset(data);}).catch(error => console.log(error));
      
        stepPresetService.getStepPresetByWorkflow(workflowPresetId).then(({ data } )=>{
          setselectedStepPreset(data);
        
        }).catch(error => console.log(error));

      
      
      setVisible(true);
      setDialogEditVisible && setDialogEditVisible(true);

    } catch (error) {
      console.error('Error fetching workflow preset:', error);
      // Gérer les erreurs de requête ici
    }
  };

  const [stepPresets, setStepPresets] = useState<StepPresetDTO[]>([]);

  const onStepPresetChange = (updatedStepPreset: Partial<StepPresetDTO>, index: number) => {
    const updatedPresets = [...selectedStepPreset];
    updatedPresets[index] = { ...updatedPresets[index], ...updatedStepPreset };
    setselectedStepPreset(updatedPresets);
  };

  const onRemoveStepPreset = (index: number) => {
    const updatedPresets = [...selectedStepPreset];
    updatedPresets.splice(index, 1);
    setselectedStepPreset(updatedPresets);
  };

  const handleAddStepClick = () => {
    setselectedStepPreset([...selectedStepPreset, {
      id:1,
      title: "New Step",
      level:  1,
      description: "",
      workflowPresetId: 0,
      destinataires: [],
      actions: []
    }]);
  };

  const handleSaveClick = () => {
    // Préparez l'objet à envoyer avec la mise à jour des stepPresets
    const updatedWorkflowPreset = {
      ...selectedWorkflowPreset,
      stepPresets: selectedStepPreset
    };
  
    // Appel API pour mettre à jour le WorkflowPreset
    WorkflowPresetService.updateWorkflowPreset(updatedWorkflowPreset)
      .then(({ data }) => {
        // Mise à jour de l'état avec les données retournées par l'API
        setSelectedWorkflowPreset(data);
  
        // Fermeture du formulaire et retour à l'affichage non éditable
        setEditable(false);
        setVisible(false);
        hideDialog();
        refresh();
      })
      .catch(error => {
        console.log(error);
        // Gérer l'erreur, par exemple en informant l'utilisateur que la sauvegarde a échoué
      });

  };
  

  return (
    <div>
      <div className="flex justify-center mt-1">
        {/* -----------------Button that shows the Dialog------------*/}
        {!editVisible && <Button label={t("workflow.Details")} rounded className=' ml-6 py-2 px-3 rounded'  severity='secondary' onClick={() => showDialog(workflowPresteId)} />}
        <Dialog
          header={<h3 className="text-900 font-medium text-3xl text-indigo-800">{ selectedWorkflowPreset.title|| "Create Workflow Preset"}</h3>}
          visible={visible}
          style={{ width: '50vw', height: '90vh' }}
          onHide={hideDialog}
          footer={
            <div className=" grid">
              <div className='col-span-1 m-2'>
                <Button label={t("cancel")}  className="p-button-secondary  mb-2  "  icon="pi pi-times"  onClick={hideDialog} />
              </div>  
              <div className='col'>
                {!editable && (
                  <Button 
                    label={t("edit")}  
                    icon="pi pi-pencil" 
                    onClick={handleEditClick} 
                    className="p-button block mb-2  "
                  />
                )}

                {editable && (
                  <Button 
                    label={t("save")} 
                    icon="pi pi-save" 
                    onClick={handleSaveClick} 
                    className="p-button-success block mb-2  "
                  />
                )}
              </div>

              <div className='col'>
                <DeleteWorkflowPreset  idWorkFlowPreset={selectedWorkflowPreset.id}  onHideDialog={hideDialog} refresh={refresh}></DeleteWorkflowPreset>   
              </div>
            </div>
          }
        >
          {selectedWorkflowPreset  &&  (
        
            <div className="p-fluid">
              {/*------------------------ WorkflowPreset Title and Description ---------------------------------*/}
              <div className="p-field flex flex-column">
                <label htmlFor="title">{t("workflow.titre")}</label>
                <InputText type="text"  disabled={!editable} className='w-8' id="title" value={selectedWorkflowPreset.title}   onChange={(e) => setSelectedWorkflowPreset({ ...selectedWorkflowPreset, title: e.target.value })}   />
                <label htmlFor='description'>{t("workflow.Description")}</label>
                <InputTextarea id="description" disabled={!editable} value={selectedWorkflowPreset.description} onChange={(e) => setSelectedWorkflowPreset({ ...selectedWorkflowPreset, description: e.target.value })} /> 
                <div className='grid'>
                  <div className='col-4 my-1'>
                <label htmlFor="title">{t("workflow.Createur")}  </label> <br />
                <InputText type="text" disabled className='w-8' id="title" value={`${selectedWorkflowPreset.createurNom} ${selectedWorkflowPreset.createurPrenom}`} />
                </div>
                <div className='col-4 my-1' >        
                <label htmlFor="title">{t("workflow.Departement")}</label> <br />
                <InputText type="text" disabled={!editable} className='w-8' id="title" value={selectedWorkflowPreset.departement} onChange={(e) => setSelectedWorkflowPreset({ ...selectedWorkflowPreset, departement: e.target.value })} />
                </div> 
                <div className='col-4 my-1'>
                <label htmlFor="title">{t("workflow.DateCreation")} </label> <br />
                <InputText type="text" disabled className='w-8' id="title" value={selectedWorkflowPreset.dateC ? new Date(selectedWorkflowPreset.dateC).toLocaleDateString() : ""} />   
                </div>       
                </div>
                
              </div>
              {/*------------------------ WorkflowPreset Steps  ---------------------------------*/}
          
              {selectedStepPreset && selectedStepPreset.length > 0 && (
                <h3 className="text-900 font-medium text-3xl text-indigo-800">{t("workflow.Steps")}</h3>)
              }
              {
                selectedStepPreset.map((stepPreset, index) => {
                  return (
                    <StepPresetCreateForm key={index} utilisateurs={utilisateurs} stepPreset={stepPreset} onStepPresetChange={(updatedStepPreset) =>
                      onStepPresetChange(updatedStepPreset, index)} onRemoveStepPreset={() => onRemoveStepPreset(index)} editable={editable}
                      setIsFormValid={setIsFormValid} editVisible={editVisible} />
                  );
                })
              }

              {editable && (
                <Button
                  label="Add Step"
                  icon="pi pi-plus"
                  severity="secondary"
                  style={{ width: 'fit-content', marginTop: '1rem' }}
                  onClick={handleAddStepClick}
                  outlined
                  disabled={editVisible ? true : false}
                />)
              }

            </div>
          )}    
        </Dialog>
      </div>
    </div>
  )
}

export default WorkflowPresetEdit

