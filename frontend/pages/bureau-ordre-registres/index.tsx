import axiosInstance from 'app/axiosInterceptor'
import AjouterRegistre from 'app/component/admin/view/bureau-ordre/BO_registres/AjouterRegistre'
import SupprimerRegistre from 'app/component/admin/view/bureau-ordre/BO_registres/SupprimerRegistre'
import Registre from 'app/component/admin/view/bureau-ordre/BO_registres/components/Registre'
import { RegistreDto } from 'app/controller/model/BureauOrdre/Registre'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { use, useEffect, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {}

const Registres = (props: Props) => {

  const toast = useRef<Toast>(null);
  const [registres, setRegistres] = useState<RegistreDto[]>([]);
  const [selectedRegistres, setSelectedRegistres] = useState<RegistreDto[]>([]);
  const [loadingRegistres, setLoadingRegistres] = useState<boolean>(true);
  const [errorRegistres, setErrorRegistres] = useState<boolean>(false);

  const [tableView, setTableView] = useState<boolean>(false);
  const [listView, setListView] = useState<boolean>(true);

  const [globalFilter, setGlobalFilter] = useState<string>('');

  const fetchRegistres = async () => {
    setLoadingRegistres(true);
    return await axiosInstance.get(`${API_URL}/courriel/registre`).then((res) => {
      setRegistres(res.data);
      setLoadingRegistres(false);
    }).catch((err) => {
      setErrorRegistres(true);
      console.log('err:', err);
    }).finally(() => {
      setLoadingRegistres(false);
    });
  };


  useEffect(() => {
    fetchRegistres();
  }, []);

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">{t('bo.registre.registres')} {t('bo.totalRecords').replace("{{totalRecords}}", registres?.length.toString())}</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
        <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={t("search")} />
      </span>

    </div>
  );

  return (
    <>
      <div className='flex flex-row gap-3 my-3'>
      <h1 className="text-3xl font-bold text-blue-800">{t('bo.registre.registres')}</h1>
        <div className='mt-1'>
          <Button severity={tableView?'info':'secondary'} icon="pi pi-align-justify" className='p-1  ' style={{borderTopRightRadius:'0',borderBottomRightRadius:'0'}} onClick={()=>{setTableView(true),setListView(false)}}/>
          <Button severity={listView?'info':'secondary'} icon="pi pi-th-large" className='p-1' style={{borderTopLeftRadius:'0',borderBottomLeftRadius:'0'}} onClick={()=>{setTableView(false),setListView(true)}}/>
        </div>
      </div>
      
      <Toolbar className="mb-4"
        style={{ opacity: loadingRegistres || errorRegistres ? 0.5 : 1, pointerEvents: loadingRegistres || errorRegistres ? 'none' : 'auto' }}
        start={() => {
          return (
            <React.Fragment>
              <AjouterRegistre refetchRegistres={fetchRegistres} toast={toast} />
            </React.Fragment>
          )
        }}
        end={() => {
          return (
            <React.Fragment>
              {
                tableView && <SupprimerRegistre refetchRegistres={fetchRegistres} toast={toast} selectedRegistres={selectedRegistres} />
              }
            </React.Fragment>
          )
        }}
      >
      </Toolbar>

      {loadingRegistres && <div className="flex justify-content-center">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
      </div>}
      {errorRegistres && <div className="flex justify-content-center">
        <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
      </div>}

      {listView && !loadingRegistres && !errorRegistres && 
        <Registre registres={registres} refetchRegistres={fetchRegistres} toast={toast}/>
      }     
      {tableView && !loadingRegistres && !errorRegistres && <DataTable
        emptyMessage={<div className='flex justify-content-center'><p>{t('tableEmpty')}</p></div>}
        value={registres}
        selection={selectedRegistres} onSelectionChange={(e) => setSelectedRegistres(e.value as RegistreDto[])}
        dataKey="id"
        className="datatable-responsive"
        globalFilter={globalFilter}
        header={header}
        paginator rows={10}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="libelle" header={t('bo.registre.libelle')} sortable />
        <Column field="numero" header={t('bo.registre.numero')} sortable />
        <Column field='size' header={t('bo.registre.size')} sortable />


      </DataTable>
      }
       
      <Toast ref={toast} />
    </>
  )
}

export default Registres