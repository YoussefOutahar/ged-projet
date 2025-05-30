import { PlanClassementIndexDto } from 'app/controller/model/PlanClassementIndex.model'
import { PlanClassementIndexAdminService } from 'app/controller/service/admin/PlanClassementIndexAdminService.service'
import { MessageService } from 'app/zynerator/service/MessageService'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import React, { useState } from 'react'

type Props = {
    planIndex: PlanClassementIndexDto,
    refetch: () => void
    toast: React.RefObject<Toast>
}

const UpdateIndexDialog = ({planIndex,refetch,toast}: Props) => {

    const [visible, setVisible] = useState(false)
    const [updatedIndex, setUpdatedIndex] = useState<PlanClassementIndexDto>(planIndex)
    const [loading, setLoading] = useState(false)

    const handleCancle = () => {
        setVisible(false)
        setUpdatedIndex(planIndex)
    }

    const planClassementIndexAdminService = new PlanClassementIndexAdminService();

    const updateIndex = ()=>{
        setLoading(true)
        planClassementIndexAdminService.update(updatedIndex).then((res) => {
            MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
            setVisible(false)
            refetch()
        }).catch((error) => {
            console.log("Can't update planClassement index: ",error)
            MessageService.showError(toast, t('error.error'), t("error.operation"));
        }).finally(() => {
            setLoading(false)
        })
    }

    const isFormValid = () => {
        return updatedIndex.libelle!='' ;
    }

  return (
    <>
    <Button  icon="pi pi-pencil" rounded onClick={()=>setVisible(true)}  />
    <Dialog
        header={t("update")}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={handleCancle}
        closeOnEscape={true}
        footer={
            <div>
                <Button label="Annuler" icon="pi pi-times" onClick={()=>{setVisible(false)}} className="p-button-text" />
                <Button 
                    disabled={!isFormValid()||loading} 
                    label={t("save")} 
                    icon={loading?"pi pi-spin pi-spinner":"pi pi-check"} 
                    onClick={()=>updateIndex()}  />
            </div>
        }
    >
         <div className='grid'>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='code'>{t("indexElement.code")}</label>
                <InputText id='code' value={updatedIndex?.code} disabled   />
            </div>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='libelle'>{t("indexElement.libelle")}</label>
                <InputText id='libelle' value={updatedIndex?.libelle} onChange={(e)=>setUpdatedIndex({...updatedIndex,libelle:e.target.value})}  />
                {!isFormValid() && updatedIndex.libelle ==''  && <small className='text-danger text-red-500'>*{t("required")}</small>}
            </div>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='description'>{t("indexElement.description")}</label>
                <InputTextarea id='description' value={updatedIndex?.description} onChange={(e)=>setUpdatedIndex({...updatedIndex,description:e.target.value})}/>
            </div>        

        </div>
    </Dialog>

    </>
  )
}

export default UpdateIndexDialog