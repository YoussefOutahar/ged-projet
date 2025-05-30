import usePlanClassementStore from 'Stores/PlanClassementStore'
import CreateIndexDialog from 'app/component/admin/view/organigramme/plan-classement/index-element/CreateIndexDialog'
import DeleteIndexButton from 'app/component/admin/view/organigramme/plan-classement/index-element/DeleteIndexButton'
import UpdateIndexDialog from 'app/component/admin/view/organigramme/plan-classement/index-element/UpdateIndexDialog'
import { PlanClassementIndexDto } from 'app/controller/model/PlanClassementIndex.model'
import { t } from 'i18next'
import { queryClient } from 'pages/_app'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useState } from 'react'

type Props = {}

const PlanClassementIndexs = (props: Props) => {

    // const [indexs, setIndexs] = useState<PlanClassementIndexDto[]>([]) 
    const {planClassementsIndex: indexs} = usePlanClassementStore();

    const [globalFilter, setGlobalFilter] = useState<string>("")
    const toast = React.useRef<Toast>(null);

    const [loading, setLoading] = useState(false)
    const fetchIndexs = () => {
        
        queryClient.invalidateQueries({queryKey:["PlanClassementsIndex"]});
        // setLoading(true)
        // planClassementIndexAdminService.getList().then((res) => {
        //     setIndexs(res.data)
        // }).catch((error) => {
        //     console.log("Can't fetch planClassement indexs: ",error)
        // }).finally(() => {
        //     setLoading(false)
        // })
    }

    const toolbarStart = () => {
        return (
            <React.Fragment>
                <div className="flex gap-1">
                    <CreateIndexDialog refetch={fetchIndexs} toast={toast}/>
                </div>
            </React.Fragment>
        )
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("planClassement.indexs.tabHeader", { totalRecords: indexs.length })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText id='search' type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} /> </span>
        </div>
    );

  return (
    <div className='card flex flex-column gap-5'>
        <Toolbar start = {toolbarStart} />

        <DataTable
                value={indexs}
                dataKey="id"
                emptyMessage={<div className="flex justify-content-center">{loading?<ProgressSpinner className='w-5rem' />:t("tableEmpty")}</div>}
                className="datatable-responsive"
                header={header}
                globalFilter={globalFilter}
                paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
            >
                <Column field="code" style={{paddingLeft:"3rem"}} header={t("planClassement.indexs.code")} sortable></Column>
                <Column field="libelle" header={t("planClassement.indexs.libelle")} sortable ></Column>
                <Column field="description" header={t("planClassement.indexs.description")} ></Column>
                <Column style={{width:"6rem"}} header={t("actions")} body={
                    (rowData: PlanClassementIndexDto) => {
                        return (
                            <div className="flex justify-content-center gap-1">
                                <UpdateIndexDialog refetch={fetchIndexs} toast={toast} planIndex={rowData} />
                                <DeleteIndexButton refetch={fetchIndexs} toast={toast} indexId={rowData.id} />

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

export default PlanClassementIndexs