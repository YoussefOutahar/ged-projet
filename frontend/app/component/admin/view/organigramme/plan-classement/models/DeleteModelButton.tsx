import axiosInstance from 'app/axiosInterceptor'
import { PlanClassementModelDto } from 'app/controller/model/PlanClassementModel.model'
import { PlanClassementModelAdminService } from 'app/controller/service/admin/PlanClassementModelAdminService.service'
import { MessageService } from 'app/zynerator/service/MessageService'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Toast } from 'primereact/toast'
import React from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    modelId: number,
    refetch: () => void
    toast: React.RefObject<Toast>
}

const DeleteModelButton = ({modelId,refetch,toast}: Props) => {

    const planClassementModelAdminService = new PlanClassementModelAdminService()

    const deleteModel = async (id:number) => {
        return await axiosInstance.delete(`${API_URL}/admin/planClassementModel/${id}`)
        .then((res)=>{
            res.data===true
            ? MessageService.showSuccess(toast, t('success.success'), t("success.operation"))
            : MessageService.showError(toast, t('error.error'), t("planClassement.models.deleteError"));
            refetch()
        }).catch((error) => {
            console.log("Can't delete planClassement model: ",error)
            MessageService.showError(toast, t('error.error'), t("error.operation"));
        })
    }

    const confirmDeletePopup = (e: any, id : number) => {
        confirmPopup({
            target: e.currentTarget,
            message: t('success.suppressionConfirmation'),
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteModel(id),
            reject: () => { }
        });
    }

  return (
    <>
    <Button
        icon="pi pi-trash"
        rounded
        severity="danger"
        onClick={(e) => { confirmDeletePopup(e,modelId)} } 
        />
    <ConfirmPopup />
    </>
)
}

export default DeleteModelButton