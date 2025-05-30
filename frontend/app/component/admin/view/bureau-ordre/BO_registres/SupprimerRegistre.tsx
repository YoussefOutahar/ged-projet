import axiosInstance from 'app/axiosInterceptor'
import { RegistreDto } from 'app/controller/model/BureauOrdre/Registre'
import { MessageService } from 'app/zynerator/service/MessageService'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Toast } from 'primereact/toast'
import React from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    refetchRegistres: () => void;
    selectedRegistres: RegistreDto[];
    toast : React.Ref<Toast>;
}

const SupprimerRegistre = ({selectedRegistres, toast, refetchRegistres}: Props) => {

    
    const deleteRegistre = async (registre: RegistreDto) => {
        axiosInstance.delete(`${API_URL}/courriel/registre/${registre.id}`).then((res) => {
            MessageService.showSuccess(toast, t('success.success'),t("success.operation"));
            refetchRegistres();
        }).catch((err) => {
            MessageService.showError(toast, t('error.error'),t("error.operation"));
        });
    }

    const deleteMultipleRegistre = async (registres: RegistreDto[]) => {
        registres.forEach(async (registre) => {
            await deleteRegistre(registre);
        });
    }

    const confirmDeletePopup = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Are you sure you want to delete the selected courriels?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteMultipleRegistre(selectedRegistres),
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-secondary'
        });
    }

  return (
    <>
    <Button 
        disabled={selectedRegistres.length === 0}
        label={t('delete')} 
        icon="pi pi-trash" 
        severity='danger' 
        onClick={(e) => confirmDeletePopup(e)}
        />
    <ConfirmPopup />

    </>
    )
}

export default SupprimerRegistre