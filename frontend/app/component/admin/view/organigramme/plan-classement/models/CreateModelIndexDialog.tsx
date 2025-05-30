import { PlanClassementModelDto } from 'app/controller/model/PlanClassementModel.model'
import { PlanClassementModelIndexDto } from 'app/controller/model/PlanClassementModelIndex.model'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import React, { useEffect, useState } from 'react'
import { toTitleCase } from '../../../bureau-ordre/BO_courriels/BO_Utils'
import { PlanClassementIndexDto } from 'app/controller/model/PlanClassementIndex.model'
import { PlanClassementIndexAdminService } from 'app/controller/service/admin/PlanClassementIndexAdminService.service'
import { MultiSelect } from 'primereact/multiselect'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axiosInstance from 'app/axiosInterceptor'
import { MessageService } from 'app/zynerator/service/MessageService'
import usePlanClassementStore from 'Stores/PlanClassementStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    refetch: () => void
    toast: React.RefObject<Toast>
}


const CreateModelIndexDialog = ({refetch,toast}: Props) => {

    const [visible, setVisible] = useState(false)
    const [plancClassementModel, setPlanClassementModel] = useState<PlanClassementModelDto>(new PlanClassementModelDto())
    
    const {planClassementsIndex: indexs} = usePlanClassementStore();
    const [indexsSelected, setIndexsSelected] = useState<PlanClassementIndexDto[]>([])


    const isFormValid = () => {
        return plancClassementModel.code!='' && plancClassementModel.libelle!='' && indexsSelected.length>0;
    }

    const [loading, setLoading] = useState(false)
    const handleSave = async () => {
        setLoading(true)
        let planClassementModelToSave = plancClassementModel
        planClassementModelToSave.planClassementModelIndexDtos = indexsSelected.map(index=>{
            let indexModel = new PlanClassementModelIndexDto()
            indexModel.planClassementIndex = index
            return indexModel
         })

         return await axiosInstance.post(`${API_URL}/admin/planClassementModel/create`,planClassementModelToSave).then(()=>{
            MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
            refetch()
            setVisible(false)
         }).catch(error=>{
            console.log(error)
            MessageService.showError(toast, t('error.error'), t("error.operation"));
         }).finally(()=>{
            setLoading(false)
         })


    }

    const handleCancel = () => {
        setVisible(false)
        // reset form
        setPlanClassementModel(new PlanClassementModelDto())
        setIndexsSelected([])
    }
    
  return (
    <>
    <Button label={t("add")} icon="pi pi-plus" className='mr-2' raised onClick={()=>setVisible(true)} />
    <Dialog
        header={t("planClassement.models.create")}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={handleCancel}
        closeOnEscape={true}
        footer={
            <div>
                <Button label={t("cancel")} icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
                <Button disabled={!isFormValid()||loading} label={t("save")} icon={loading?"pi pi-spin pi-spinner":"pi pi-check"} onClick={handleSave} autoFocus />
            </div>
        }
    >
        <div className='grid'>

            {/* ---------------------------------------------- Model ----------------------------------------------      */}
            <Divider align="left">
                <span className="p-tag">{toTitleCase(t('planClassement.models.model'))}</span>
            </Divider>            
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='code'>{t("planClassement.models.code")}</label>
                <InputText id='code' value={plancClassementModel.code} onChange={(e)=>setPlanClassementModel({...plancClassementModel,code:e.target.value})}   />
                {!isFormValid() && plancClassementModel.code ==''  && <small className='text-danger text-red-500'>*{t("required")}</small>}
            </div>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='libelle'>{t("planClassement.models.libelle")}</label>
                <InputText id='libelle' value={plancClassementModel.libelle} onChange={(e)=>setPlanClassementModel({...plancClassementModel,libelle:e.target.value})}  />
                {!isFormValid() && plancClassementModel.libelle ==''  && <small className='text-danger text-red-500'>*{t("required")}</small>}

            </div>
            <div className='flex flex-column col-6'>
                <label className='mb-1' htmlFor='description'>{t("planClassement.models.description")}</label>
                <InputTextarea id='description' value={plancClassementModel.description} onChange={(e)=>setPlanClassementModel({...plancClassementModel,description:e.target.value})}/>
            </div>   

            {/* ---------------------------------------------- Indexs ----------------------------------------------      */}
            <Divider align="left">
                <span className="p-tag">{toTitleCase(t('planClassement.indexs.indexElement'))}</span>
            </Divider>
            <div className='flex flex-column col-6'>
                <MultiSelect 
                    id='indexs'
                    value={indexsSelected}
                    options={indexs}
                    optionLabel="code"
                    onChange={(e) => setIndexsSelected(e.value)}
                    filter
                    placeholder={t("planClassement.indexs.chooseIndexs")}
                />
            </div>  
            <div className='flex flex-column col-12'>
                <DataTable
                    value={indexsSelected}
                    dataKey="id"
                    emptyMessage={<div className="flex justify-content-center text-red-500">*{t("planClassement.indexs.selectAtLeastOneIndex")}</div>}
                    className="datatable-responsive"
                >
                    <Column field="code" style={{paddingLeft:"3rem"}} header={t("indexElement.code")} sortable></Column>
                    <Column field="libelle" header={t("indexElement.libelle")} sortable ></Column>
                    <Column field="description" header={t("indexElement.description")} ></Column>
                    <Column style={{width:"6rem"}} header={t("actions")} body={
                        (rowData: PlanClassementIndexDto) => {
                            return (
                                <div className="flex justify-content-center gap-1">
                                    <Button icon="pi pi-times" severity='danger' rounded text onClick={()=>setIndexsSelected(indexsSelected.filter(e=>e.id!=rowData.id))} />
                                </div>
                            )
                        }
                    }>
                    </Column>
                </DataTable>
            </div>

        </div>
    </Dialog>
    </>
)
}

export default CreateModelIndexDialog