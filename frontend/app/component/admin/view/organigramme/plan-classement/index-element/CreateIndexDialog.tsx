import { PlanClassementIndexDto } from 'app/controller/model/PlanClassementIndex.model'
import { PlanClassementIndexAdminService } from 'app/controller/service/admin/PlanClassementIndexAdminService.service'
import { MessageService } from 'app/zynerator/service/MessageService'
import { set } from 'date-fns'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import React, { use, useEffect, useState } from 'react'

type Props = {
    toast: React.RefObject<Toast>
    refetch: () => void
}

const CreateIndexDialog = ({toast, refetch}: Props) => {

    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [planClassementIndex, setPlanClassementIndex] = useState<PlanClassementIndexDto>(new PlanClassementIndexDto())
    const planClassementIndexAdminService = new PlanClassementIndexAdminService();

    const handleSave = () => {
        setLoading(true)
        planClassementIndexAdminService.save(planClassementIndex).then((res) => {
            MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
            setVisible(false)
            setPlanClassementIndex(new PlanClassementIndexDto())
            refetch()
        }).catch((error) => {
            console.log("Can't save planClassement index: ",error)
            MessageService.showError(toast, t('error.error'), t("error.operation"));
        }).finally(() => {
            setLoading(false)
        })
    }

    const isFormValid = () => {
        return planClassementIndex.code!='' && planClassementIndex.libelle!='' 
    }
  return (
    <>
    <Button raised label={t("new")} icon="pi pi-plus" severity="info" className=" mr-2" onClick={()=>{setVisible(true)}} />
    <Dialog
        header={t("indexElement.tabPan")}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={()=>{setVisible(false)}}
        footer={
            <div>
                <Button label={t("cancel")} icon="pi pi-times" onClick={()=>{setVisible(false)}} className="p-button-text" />
                <Button label={t("save")} disabled={!isFormValid() || loading} icon={loading?"pi pi-spin pi-spinner":"pi pi-check"} onClick={()=>{handleSave()}}  />
            </div>
        }
    >
        <div className='grid'>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='code'>{t("indexElement.code")}</label>
                <InputText id='code' value={planClassementIndex.code} onChange={(e)=>setPlanClassementIndex({...planClassementIndex,code:e.target.value})}   />
                {!isFormValid() && planClassementIndex.code ==''  && <small className='text-danger text-red-500'>*{t("required")}</small>}
            </div>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='libelle'>{t("indexElement.libelle")}</label>
                <InputText id='libelle' value={planClassementIndex.libelle} onChange={(e)=>setPlanClassementIndex({...planClassementIndex,libelle:e.target.value})}  />
                {!isFormValid() && planClassementIndex.libelle ==''  && <small className='text-danger text-red-500'>*{t("required")}</small>}

            </div>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='description'>{t("indexElement.description")}</label>
                <InputTextarea id='description' value={planClassementIndex.description} onChange={(e)=>setPlanClassementIndex({...planClassementIndex,description:e.target.value})}/>

            </div>        

        </div>
    </Dialog>
    </>
  )
}

export default CreateIndexDialog