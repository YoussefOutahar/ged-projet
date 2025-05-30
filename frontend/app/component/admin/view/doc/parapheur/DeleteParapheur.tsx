import { ConfirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import React from "react";
import { confirmPopup } from "primereact/confirmpopup";
import axiosInstance from "app/axiosInterceptor";
import { Toast } from "primereact/toast";
import { MessageService } from "app/zynerator/service/MessageService";
import { TFunction } from "i18next";
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";

type Props = {
    setSelectedParapheur: (parapheur: any[]) => void;
    selectedParapheur: any[];
    refetchParapheur: () => void;
    showToast: React.Ref<Toast>;
    t:TFunction;
}


const DeleteParapheur = (
    {setSelectedParapheur,selectedParapheur, refetchParapheur, showToast,t}: Props
) => {

    
    const deleteParapheur = async (selectedParapheur: any[]) => {
        if (selectedParapheur.length>1) {
            const ids = selectedParapheur.map(parapheur => parapheur.id);
            await parapheurService.DeleteParapheurs(ids).then((res) => {
                MessageService.showSuccess(showToast, t('parapheurs suprimes avec succes'),t("success.operation"));
            }).catch((err) => {
                MessageService.showError(showToast, t('error.error'),t("error.operation"));
            });
            await refetchParapheur();
            setSelectedParapheur([]);          
        }
        else{
            await parapheurService.DeleteParapheur(selectedParapheur[0].id).then((res) => {
                MessageService.showSuccess(showToast, t('parapheur suprime avec succes'),t("success.operation"));
            }).catch((err) => {
                MessageService.showError(showToast, t('error.error'),t("error.operation"));
            });
            await refetchParapheur();
            setSelectedParapheur([]);
           
        }
        
    }

    return (
        <>
        <ConfirmPopup />
        <Button disabled={selectedParapheur.length === 0} label="Supprimer" icon="pi pi-trash" className="p-button-danger mr-2"
            onClick={(e) => confirmPopup({
                target: e.currentTarget,
                message: 'Are you sure you want to delete the selected parapheur?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteParapheur(selectedParapheur),
                acceptClassName: 'p-button-danger',
                rejectClassName: 'p-button-secondary'
            })} />
        </>
    );
}

export default DeleteParapheur;