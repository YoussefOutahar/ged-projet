import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { ACTION, StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Tag } from 'primereact/tag';
import React, { useRef } from 'react'
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';

type Props = {

  stepPreset: StepPresetDTO;
    utilisateurs: UtilisateurDto[];
    onStepPresetChange: (updatedStepPreset: Partial<StepDTO>) => void;

  
}

  
const StepCreateForm = ({utilisateurs,stepPreset,onStepPresetChange}: Props) => {
    // const overlayPanel = useRef(null);
    // const overlayPanelDestinataire = useRef(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
       onStepPresetChange({ [name]: value });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onStepPresetChange({ [name]: parseInt(value, 10) || undefined });
  };
  
  const toast = useRef(null);

  const onUpload = () => {
      // toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  };




  return (
    <Fieldset legend={stepPreset.title} style={{ marginBottom: "1rem" }} toggleable >
    <div className='flex flex-column gap-2'>

        {/* -------------------------------- Title & Level -------------------------------- */}
        <div className='flex gap-3'>
            <div className="flex flex-column ">
                <label htmlFor="title">Title</label>
                <InputText id="title" name="title" value={stepPreset.title}  />
            </div>
            <div className="flex flex-column " >
                <label htmlFor="level">Level</label>
                <InputText
                    id="level"
                    name="level"
                    type="number"
                    min={1}
                    value={stepPreset.level?.toString()}
                    onChange={handleNumberInputChange}
                />
            </div>
        </div>

        {/* --------------------------------- Description ---------------------------------- */}
        <div className="p-fluid">
            <label htmlFor="description">Description</label>
            <InputTextarea
                id="description"
                name="description"
                value={stepPreset.description}
                rows={3}
                maxLength={500}
                autoResize
                onChange={handleInputChange}
            />
        </div>

        {/* --------------------------------- Actions ----------------------------------------- */}

        <div className='flex gap-5'>
        <div className='flex flex-column '>
            <label htmlFor="actions">Actions</label>
            <div className="flex flex-row  gap-2  ">
                {
                    stepPreset.actions?.length === 0
                        ?
                        <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="No actions"></Tag>
                        :
                        stepPreset.actions?.map((action, index) => (
                            <Tag key={action} style={{height:"fit-content",marginTop:"auto",marginBottom:"auto"}}>
                                <div className="flex align-items-center font-sm gap-2">
                                    <span className='text-sm'>{action}</span>
                                </div>
                            </Tag>
                        ))
                }
                <OverlayPanel>
                    <ListBox  
                        name='addAction'
                        options={[ACTION.SIGN, ACTION.APPROVE, ACTION.REJECT, ACTION.PARAPHER, ACTION.PRESIGNER,ACTION.ENVOI_COURRIER].filter((option) => !stepPreset.actions?.includes(option))}
                        className="w-full md:w-14rem" />
                </OverlayPanel>
            </div>
        </div>

        {/* --------------------------------- Destinataires ------------------------------------- */}
        <div className='flex flex-column '>
            <label htmlFor="destinataires">Destinataires</label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {
                    stepPreset.destinataires?.length === 0
                        ?
                        <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="No destinataires"></Tag>
                        :
                        stepPreset.destinataires?.map((destinataire, index) => (
                            <Tag key={destinataire.utilisateur?.id} style={{height:"fit-content",marginTop:"auto",marginBottom:"auto"}} >
                                <div className="flex align-items-center font-sm gap-2">
                                    <div className='flex flex-column pl-1 '>
                                        <span className='text-sm'>{destinataire.utilisateur?.nom} {destinataire.utilisateur?.prenom}</span>
                                        <span className='text-xs'>{destinataire.utilisateur?.email}</span>
                                    </div>
                                  
                                </div>
                            </Tag>
                        ))
                        
                }
               
            </div>

            
        </div>
        </div>

        <div className="card flex justify-content-center">
            <Toast ref={toast}></Toast>
            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
        </div>  



      
    </div>
</Fieldset>
);
  
}

export default StepCreateForm