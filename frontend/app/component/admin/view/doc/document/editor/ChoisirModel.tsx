import { useMutation } from '@tanstack/react-query';
import useDocModelsStore from 'Stores/DocModelsStore';
import axiosInstance from 'app/axiosInterceptor';
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import { queryClient } from 'pages/_app';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import React, { use, useEffect, useState } from 'react'

type Props = {
    models: any[];
    selectedModel: any;
    setSelectedModel: (model: any) => void;
    toast: React.Ref<Toast>;
    setText: (text: string) => void;
    setUpdateItemDialog: (updateItemDialog: boolean) => void;
}

const ChoisirModel = ({models,selectedModel, setSelectedModel, toast, setText, setUpdateItemDialog}: Props) => {
    
    const [showTableModels, setShowTableModels] = useState<boolean>(true);

    const productTemplate = (model:any) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3" style={{ maxWidth: '250px', maxHeight: '380px' }}>
                <div className="mb-3">
                    <div style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    {model.image ? (
                        <img src={`${model.image}`} alt={model.name} className="w-8 h-auto shadow-2" width='250' />
                    ):(
                        <img src={`/template.jpg`} alt={model.name} className="w-8 h-auto shadow-2" width='250' />
                    )}
                    </div>
                </div>
                <div style={{ height: '40%' }}>
                    <h3 className="mb-1 text-base">{model.libelle}</h3>
                    <Tag value={"Valide"} severity={'success'} style={{ width: '30%' }}></Tag>
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-pencil" className="p-button p-button-rounded p-button-small" severity="warning" aria-label="Edit" onClick={(e) => {setSelectedModel(model);setText(model.content);setUpdateItemDialog(true)}}/>
                        <Button icon="pi pi-trash" className="p-button-rounded" severity="danger" aria-label="Cancel" onClick={(e) => {setSelectedModel(model); setDeleteItemDialog(true)}}/>
                    </div>
                </div>
            </div>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 3,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 2,
            numScroll: 1
        }
    ];
    
    // Delete Model
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);


    const {deleteDocModel} = useDocModelsStore();
    const deleteMutation = useMutation({
        mutationKey: ['models'],
        mutationFn: (id: number) => axiosInstance.delete(`${process.env.NEXT_PUBLIC_ADMIN_URL}model/${id}`),
        onSuccess: () => {
            setDeleteItemDialog(false);
            deleteDocModel(selectedModel.id);
            setSelectedModel(null);
            MessageService.showSuccess(toast, 'Delete Model', "Operation réussite!");
            queryClient.invalidateQueries({queryKey: ['models']});
        },
        onError: (error) => {
            console.error('Error Add models', error);
            MessageService.showError(toast, 'Error!', "Error add Model");
        }
    });

    const deleteModel = ()=>{
        deleteMutation.mutate(selectedModel.id);
        // axiosInstance.delete(`${process.env.NEXT_PUBLIC_ADMIN_URL}model/${selectedModel.id}`)
        //     .then(response => {
        //         setDeleteItemDialog(false);
        //         fetchModels();
        //         setSelectedModel(null);
        //         MessageService.showSuccess(toast, 'Add Model', "Operation réussite!");
        //     })
        //     .catch(error => {
        //         console.error('Error Add models', error);
        //         MessageService.showError(toast, 'Error!', "Error add Model");
        //     });
    }
    const deleteItemDialogFooter = (
        <>
            <Button raised label={t("no")} icon="pi pi-times" text onClick={()=>{setDeleteItemDialog(false)}} />
            <Button raised label={t("yes")} icon="pi pi-check" onClick={deleteModel} />
        </>
    );

    return (
        <div>
            <div className="mb-4">
                {showTableModels ? (
                    <Button icon="pi pi-download" label="Choisir un Modèle" onClick={() => setShowTableModels(false)} severity="success" className="mr-2"/>
                ):(
                    <Button icon="pi pi-eject" label="Fermer les Modèles" onClick={() => setShowTableModels(true)} severity="danger" className="mr-2"/>
                )}
            </div>
            {!showTableModels && 
            <>
                <span className="text-3xl font-bold">Liste des Modèles </span>
                <div className="card" style={{maxHeight: '500px', overflow: 'auto'}}>
                    <Carousel value={models} numVisible={4} numScroll={4} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                        autoplayInterval={3000} itemTemplate={productTemplate} />
                </div>
            </>
            }
            <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={deleteItemDialogFooter} onHide={()=>{setDeleteItemDialog(false)}}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Voulez vous vraiment supprimer les documents selectionnés ?</span>
                        </div>
            </Dialog>
    </div>
  )
}

export default ChoisirModel