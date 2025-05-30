import usePlanClassementStore from 'Stores/PlanClassementStore'
import CreateModelIndexDialog from 'app/component/admin/view/organigramme/plan-classement/models/CreateModelIndexDialog'
import DeleteModelButton from 'app/component/admin/view/organigramme/plan-classement/models/DeleteModelButton'
import UpdateModelIndexDialog from 'app/component/admin/view/organigramme/plan-classement/models/UpdateModelIndexDialog'
import { PlanClassementModelDto } from 'app/controller/model/PlanClassementModel.model'
import { PlanClassementModelIndexDto } from 'app/controller/model/PlanClassementModelIndex.model'
import { t } from 'i18next'
import { queryClient } from 'pages/_app'
import { Chip } from 'primereact/chip'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useState } from 'react'

type Props = {}

const PlanClassementModels = (props: Props) => {
  const {planClassementsModel: plancClassementModels} = usePlanClassementStore();
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = React.useRef<Toast>(null);

  const [loading, setLoading] = useState(false)
  const fetchPlanClassementModels = () => {
    queryClient.invalidateQueries({queryKey:["PlanClassementsModel"]});
    // setLoading(true)
    // planClassementModelAdminService.getList().then((res) => {
    //     setPlanClassementModels(res.data)
    // }).catch((error) => {
    //     console.log("Can't fetch planClassement models: ",error)
    // }).finally(() => {
    //     setLoading(false)
    // })
  }

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">{t("planClassement.models.tabHeader", { totalRecords: plancClassementModels.length })}</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
          <InputText id='search' type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t("search")} /> 
      </span>
    </div>
  );
  return (
    <div className='card flex flex-column gap-5'>
      <Toolbar 
        start = {() => {
          return (
            <React.Fragment>
              <div className="flex gap-1">
                <CreateModelIndexDialog refetch={fetchPlanClassementModels} toast={toast}/>
              </div>
            </React.Fragment>
          )
        }}
      />
      <DataTable
        value={plancClassementModels}
        dataKey="id"
        emptyMessage={<div className="flex justify-content-center">{loading?<ProgressSpinner className='w-5rem' />:t("tableEmpty")}</div>}
        className="datatable-responsive"
        header={header}
        globalFilter={globalFilter}
        paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column field="code" header={t("planClassement.models.code")} />
        <Column field="libelle" header={t("planClassement.models.libelle")} />
        <Column field="description" header={t("planClassement.models.description")} />
        <Column field="planClassementModelIndexDtos" header={t("planClassement.indexs.indexElement")} body={(rowData: PlanClassementModelDto) => {
          return (
            <div className="flex flex-wrap gap-1 max-w-10rem">
              {rowData.planClassementModelIndexDtos?.map((index: PlanClassementModelIndexDto) => {
                return (
                  <Chip key={index.id}   label={index.planClassementIndex.code}  />
                )
              })}
            </div>
          )
        }} />
        <Column style={{width:"6rem"}} header={t("actions")} body={
          (rowData: PlanClassementModelDto) => {
            return (
              <div className="flex justify-content-center gap-1">
                <UpdateModelIndexDialog planClassementModel={rowData} refetch={fetchPlanClassementModels} toast={toast} />
                <DeleteModelButton modelId={rowData.id} refetch={fetchPlanClassementModels} toast={toast} />
              </div>
            )
          }
        }>
        </Column>
      </DataTable>
      <Toast ref={toast} />
    </div>
  )
}

export default PlanClassementModels