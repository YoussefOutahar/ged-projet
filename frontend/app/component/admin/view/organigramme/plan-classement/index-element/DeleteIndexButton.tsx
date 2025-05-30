import axiosInstance from 'app/axiosInterceptor'
import { PlanClassementIndexAdminService } from 'app/controller/service/admin/PlanClassementIndexAdminService.service'
import { MessageService } from 'app/zynerator/service/MessageService'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Toast } from 'primereact/toast'
import React from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    indexId: number
    refetch: () => void
    toast: React.RefObject<Toast>
    className?: string
}

const DeleteIndexButton = ({className="",indexId,refetch,toast}: Props) => {

  const planClassementIndexAdminService = new PlanClassementIndexAdminService();

  const deleteIndex = async (id: number) => {
    return await axiosInstance.delete(`${API_URL}/admin/planClassementIndex/${id}`).then((res) => {
        refetch();
        res.data===true?
        MessageService.showSuccess(toast, t('success.success'), t("success.operation"))
        :
        MessageService.showError(toast, t('error.error'), t("planClassement.indexs.deleteError"));

      }).catch((error) => {
        console.log("Can't delete planClassement index: ",error);
        MessageService.showError(toast, t('error.error'), t("error.operation"));
      })
  }

  const confirmDeletePopup = (e: any, id : number) => {
    confirmPopup({
        target: e.currentTarget,
        message: t('success.suppressionConfirmation'),
        icon: 'pi pi-exclamation-triangle',
        acceptClassName: 'p-button-danger',
        accept: () => deleteIndex(id),
        reject: () => { }
    });
}


  return (
    <>
    <Button raised rounded icon="pi pi-trash" severity="danger" className={className}
        onClick={(e)=>confirmDeletePopup(e,indexId)}  />
    <ConfirmPopup />
    </>
  )
}

export default DeleteIndexButton