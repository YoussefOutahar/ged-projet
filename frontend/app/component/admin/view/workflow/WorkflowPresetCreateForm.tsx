import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react'
import StepPresetCreateForm from 'app/component/admin/view/workflow/StepPresetCreateForm';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { InputTextarea } from 'primereact/inputtextarea';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { workflowPresetDtoSchema } from 'app/component/admin/view/workflow/formValidation/objectSchemas/workflowPresetDTOShema';
import { t } from 'i18next';
import { ref } from 'yup';
import { duration } from 'moment';

type Props = {
  refresh: () => void;
  utilisateurs : UtilisateurDto[];
  connectedUser: UtilisateurDto;
}

const WorkflowPresetCreateForm = ({refresh , utilisateurs, connectedUser}: Props) => {

  const toast = useRef<Toast>(null);


  const workflowPresetSevice = new WorkflowPresetService();
  const [isFormValid, setIsFormValid] = useState(false);


  const [visible, setVisible] = useState(false);
  const [workflowPreset, setWorkflowPreset] = useState<Partial<WorkflowPresetDTO>>(
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
        actions: [],
        duration: 1,
        addPV: false,
      }], 
      dateC: "",
      dateUpdate: "",
      createurId: 0,
      createurNom: '',
      createurPrenom:'',
      departement: '',
    }
  );
  
  const showDialog = () => {
    setVisible(true);
  };
  
  const hideDialog = () => {
    setVisible(false);
  };
  
  


  useEffect(() => {
    formik.setFieldValue('createurId', connectedUser.id);
    formik.setFieldValue('createurNom', connectedUser.nom);
    formik.setFieldValue('createurPrenom', connectedUser.prenom);
  }, [connectedUser]);

  const formik = useFormik(
    {
      initialValues: workflowPreset,
      validationSchema: workflowPresetDtoSchema,
      onSubmit: (values)=> handleSubmit(),
    }
  );
  const handleSubmit = async () => {

    try {
      const response = await workflowPresetSevice.createWorkflowPreset({
        ...formik.values,
        stepPresets: formik.values.stepPresets?.map(({ id, ...rest }) => rest),
      } as  WorkflowPresetDTO);
  
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Workflow Preset created successfully', life: 3000 });
      setVisible(false);
      refresh();
    } catch (error) {
      console.error(error);
      // Handle the error appropriately, e.g., show an error message
    }
  };
  return (
    <div className="p-2 ml-4 mr-4 w-1/3">
      <Toast ref={toast}/>
      {/* -----------------Button that shows the Dialog------------*/}
      <Button icon="pi pi-plus" className="mr-2" onClick={showDialog} disabled/>
      {/* -----------------Dialog that contains the form------------*/}
      <Dialog
        header={
          <h3 className="text-900 font-medium text-3xl text-indigo-800">{workflowPreset.title || "Create Workflow Preset"}</h3>
        }
        visible={visible}
        style={{ width: '50vw', height: '90vh' }}
        onHide={hideDialog}
        footer={
          <div className="p-d-flex p-jc-between">
            <Button label="Cancel" className="p-button-secondary" onClick={hideDialog} />
            <Button type="submit" label="Submit" className="p-button-primary" disabled={!isFormValid} 
 onClick={formik.submitForm} />
          </div>
        }
      >        
        <div className="p-fluid   ">

          <div className="p-field flex flex-column">

          {/*------------------------ WorkflowPreset Title  ---------------------------------*/}
            <label htmlFor="title">{t("workflow.titre")}</label>
            <InputText type="text" className='w-8' id="title" value={formik.values.title} onChange={formik.handleChange} />
            {formik.touched.title && formik.errors.title && (
              <div className="p-error">{formik.errors.title}</div>
            )}
           
          {/*------------------------ WorkflowPreset Description  ---------------------------------*/}
            <label htmlFor='description'>{t("workflow.Description")}</label>
            <InputTextarea id="description" value={formik.values.description} onChange={formik.handleChange} />
            {formik.touched.description && formik.errors.description && (
              <div className="p-error">{formik.errors.description}</div>
            )}

          </div>
          {/*------------------------ WorkflowPreset Steps  ---------------------------------*/}
          <h3 className="text-900 font-medium text-3xl text-indigo-800">Steps</h3>

          {
          formik.values.stepPresets?.map((stepPreset, index) => (
            <StepPresetCreateForm
              key={index}      
              utilisateurs={utilisateurs}
              stepPreset={stepPreset}
              onStepPresetChange={(updatedStepPreset) =>
                formik.setFieldValue('stepPresets', formik.values.stepPresets?.map((s, i) => (i === index ? { ...s, ...updatedStepPreset } : s)))
              }
              onRemoveStepPreset={() =>{
                formik.setFieldValue('stepPresets', formik.values.stepPresets?.filter((_, i) => i !== index))
              }}
              editable={true}
              setIsFormValid={setIsFormValid}

            />            
            
          ))

          }

         
         
          <Button
            label="Add Step"
            icon="pi pi-plus"
            severity="secondary"
            style={{ width: 'fit-content', marginTop: '1rem' }}
            onClick={() =>
              formik.setFieldValue('stepPresets', [
                ...formik.values.stepPresets || [],
                {
                  
                  title: 'New Step',
                  level: (formik.values.stepPresets?.[formik.values.stepPresets.length - 1]?.level ?? 0) + 1,
                  description: '',
                  workflowPresetId: 0,
                  destinataires: [],
                  actions: [],
                  duration: 1,
                  addPV: false,
                },
              ])
            }
            outlined

          />

        </div>
      </Dialog>
    </div>


  )
}

export default WorkflowPresetCreateForm
