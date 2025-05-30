import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { t } from 'i18next';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import React, { useState } from 'react'

type Props = {
    idWorkFlowPreset : number
    onHideDialog: () => void;
refresh: () => void;

}

const DeleteWorkflowPreset = ({ idWorkFlowPreset, onHideDialog , refresh}: Props) => {

    const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);



  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await WorkflowPresetService.DeleteWorkflowPresetById(idWorkFlowPreset);
      onHideDialog();
refresh();

    } catch (error) {
      console.log("error");
    } finally {
      setIsDeleting(false);
      
      

    }
  };


  return (
    <div  >    
    <Button 
  
        label={t("delete")}   
        severity="danger" raised   icon="pi pi-trash" 
        onClick={
            (e) => {
                confirmPopup({
                    target: e.currentTarget,
                    message: t("workflow.deleteMsg"),
                    icon: "pi pi-exclamation-triangle",
                    accept: () =>handleDelete()});}}
                      
            />
            <ConfirmPopup/>

          
</div>

  )
}

export default DeleteWorkflowPreset