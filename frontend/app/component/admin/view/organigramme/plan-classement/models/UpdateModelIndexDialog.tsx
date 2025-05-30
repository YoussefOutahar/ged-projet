import { PlanClassementModelDto } from 'app/controller/model/PlanClassementModel.model'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect } from 'primereact/multiselect'
import React, { useState } from 'react'
import { toTitleCase } from '../../../bureau-ordre/BO_courriels/BO_Utils'
import { t } from 'i18next'
import { PlanClassementIndexDto } from 'app/controller/model/PlanClassementIndex.model'
import { PlanClassementModelIndexDto } from 'app/controller/model/PlanClassementModelIndex.model'
import { PlanClassementModelAdminService } from 'app/controller/service/admin/PlanClassementModelAdminService.service'
import { MessageService } from 'app/zynerator/service/MessageService'
import { Toast } from 'primereact/toast'
import { PlanClassementIndexAdminService } from 'app/controller/service/admin/PlanClassementIndexAdminService.service'
import axiosInstance from 'app/axiosInterceptor'
import usePlanClassementStore from 'Stores/PlanClassementStore'
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    planClassementModel: PlanClassementModelDto,
    toast : React.RefObject<Toast>,
    refetch: () => void
}

const UpdateModelIndexDialog = ({planClassementModel,toast,refetch}: Props) => {

    const [visible, setVisible] = useState(false)
    const [updatedPlanClassementModel, setUpdatedPlanClassementModel] = useState<PlanClassementModelDto>(planClassementModel)
    
    const [indexsSelected, setIndexsSelected] = useState<PlanClassementIndexDto[]>([])
    
    const {planClassementsIndex: indexs} = usePlanClassementStore();

    React.useEffect(() => {
        setIndexsSelected(planClassementModel?.planClassementModelIndexDtos?.map(indexModel=>indexModel.planClassementIndex)|| [])
    },[planClassementModel])

    const [loading, setLoading] = useState(false)
    const handleSave = async() => {
        setLoading(true)
        let planClassementModelToUpdate = updatedPlanClassementModel
        planClassementModelToUpdate.planClassementModelIndexDtos = indexsSelected.map(index=>{
            let indexModel = new PlanClassementModelIndexDto()
            indexModel.planClassementIndex = index
            return indexModel
        })

        return await axiosInstance.put(`${API_URL}/admin/planClassementModel/withIndexs`,planClassementModelToUpdate)
            .then((res)=>{
                MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
                refetch()
                setVisible(false)
            }).catch((error) => {
                console.log("Can't update planClassement model: ",error)
                MessageService.showError(toast, t('error.error'), t("error.operation"));
            }).finally(()=>setLoading(false))
    }

    const handleCancel = () => {
        setVisible(false)
    }

    const isFormValid = () => {
        return  updatedPlanClassementModel.libelle!='' && indexs?.length>0;
    }


  return (
    <>
        <Button icon="pi pi-pencil"  rounded  onClick={()=>{setVisible(true)}} />
        <Dialog
            header={t("planClassement.models.update")}
            visible={visible}
            style={{ width: '50vw' }}
            modal
            onHide={handleCancel}
            footer={
                <div>
                    <Button label={t("cancel")} icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
                    <Button disabled={!isFormValid() || loading} label={t("save")} icon={loading?"pi pi-spin pi-spinner":"pi pi-check"} onClick={handleSave} autoFocus />
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
                    <InputText id='code' value={updatedPlanClassementModel?.code} disabled   />
                </div>
                <div className='flex flex-column col-6'>
                    <label className='mb-1' htmlFor='libelle'>{t("planClassement.models.libelle")}</label>
                    <InputText id='libelle' value={updatedPlanClassementModel.libelle} onChange={(e)=>setUpdatedPlanClassementModel({...updatedPlanClassementModel,libelle:e.target.value})}  />
                    {!isFormValid() && updatedPlanClassementModel.libelle ==''  && <small className='text-danger text-red-500'>*{t("required")}</small>}

                </div>
                <div className='flex flex-column col-6'>
                    <label className='mb-1' htmlFor='description'>{t("planClassement.models.description")}</label>
                    <InputTextarea id='description' value={updatedPlanClassementModel.description} onChange={(e)=>setUpdatedPlanClassementModel({...updatedPlanClassementModel,description:e.target.value})}/>
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
                                        {
                                            planClassementModel.planClassementModelIndexDtos?.find(e=>e.planClassementIndex.id==rowData.id)
                                            ?<></>
                                            :<Button icon="pi pi-times" severity='danger' rounded text onClick={()=>setIndexsSelected(indexsSelected.filter(e=>e.id!=rowData.id))} />
                                        }
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

export default UpdateModelIndexDialog