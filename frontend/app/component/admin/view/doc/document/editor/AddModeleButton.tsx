import axiosInstance from 'app/axiosInterceptor';
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useState } from 'react'
import { classNames } from "primereact/utils";
import { useMutation } from '@tanstack/react-query';
import useDocModelsStore from 'Stores/DocModelsStore';
import { queryClient } from 'pages/_app';

type Props = {
    text: string;
    toast: React.Ref<Toast>;
}

const AddModeleButton = ({text, toast}: Props) => {

    const [addModels, setAddModels] = useState<boolean>(false);
    const [loadingM, setLoadingM] = useState<boolean>(false);


    const [modelImage, setModelImage] = useState('');
    const [nameModel, setNameModel] = useState<string>('');

    const {createDocModel} = useDocModelsStore();
    const addModelMutation = useMutation({
        mutationKey: ['models'],
        mutationFn: async (model: any) => {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`, model);
            return response;
        },
        onSuccess: () => {
            createDocModel({libelle: nameModel, content: text, image: modelImage});
            setAddModels(false);
            setNameModel('');
            MessageService.showSuccess(toast, 'Add Model', "Operation réussite!");
            queryClient.invalidateQueries({queryKey: ['models']});
        },
        onError: (error) => {
            console.error('Error Add models', error);
            MessageService.showError(toast, 'Error!', "Error add Model");
        }
    });

    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (nameModel == '')
            errorMessages.push("reference Obligatoire")
        return errorMessages.length == 0;
    }

    const saveModel = async () => {
        const model = {
            libelle : nameModel,
            content : text,
            image: modelImage
        }
        if(isFormValid()){
            addModelMutation.mutate(model);
            // axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`,model)
            //     .then(response => {
            //         fetchModels();
            //         setAddModels(false);
            //         setNameModel('');
            //         MessageService.showSuccess(toast, 'Add Model', "Operation réussite!");
            //     })
            //     .catch(error => {
            //         console.error('Error Add models', error);
            //         MessageService.showError(toast, 'Error!', "Error add Model");
            //     });
        }
    }
    const handleImageChange = (e: any) => {
        const file = e.files && e.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setModelImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
    
    const modelDialogFooter = (
        <div>
            <Button raised label={t("cancel")} icon="pi pi-check" onClick={()=>{setAddModels(false)}} />
            <Button raised label={t("save")} icon="pi pi-check" loading={loadingM} onClick={saveModel} disabled={!isFormValid()}/>
        </div>
    );



  return (
    <div>
        <Button disabled={text.length===0} label="Add Modele" onClick={() => setAddModels(true)} severity="info" className="mr-2"/>


        <Dialog visible={addModels} style={{ width: '650px' }} header={"Ajouter un Modele"} modal
                footer={modelDialogFooter} onHide={()=>{setAddModels(false)}}>
                <div className="field col-6">
                    <label htmlFor="nameModel">{t("document.reference")}</label>
                    <InputText id="nameModel" value={nameModel}
                        onChange={(e) => setNameModel(e.target.value)} required style={{minWidth: '450px'}}
                        className={classNames({ 'p-invalid': !isFormValid() })} autoFocus />
                    {!isFormValid() &&
                        <small className="p-invalid p-error font-bold">Nom Modèle Obligatoire.</small>
                    }
                </div>
                <div className="field col-12">
                    <label htmlFor="image">Image du modèle</label>
                    <FileUpload id="image" name="demo[]" url="./upload" accept="image/*" maxFileSize={1000000} onSelect={(e) => handleImageChange(e)} />
                </div>
            </Dialog>
    </div>
  )
}

export default AddModeleButton