import axiosInstance from 'app/axiosInterceptor';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Paginator } from 'primereact/paginator';

const index = () => {
    const [audits, setAudits] = useState<any[]>([]);
    const [statsAudits, setAuditStats] = useState<any[]>([]);
    const { t } = useTranslation();
    const [globalFilter, setGlobalFilter] = useState('');
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_API_URL}/workflows/audit/audit-stats`).then((response) => setAuditStats(response.data)).catch((error) => console.log(error));
        axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/workflows/audit/page`,{
            params: {page, size}
        }).then((response) => {
            setAudits(response.data.content);
            setTotalRecords(response.data.totalElements);
        }).catch((error) => console.log(error));
    }, [page,size]);
    
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords})}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} /> 
            </span>
        </div>
    );
    const actionColors: { [key: string]: string } = {};
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const [firstTable, setFirstTable] = useState(0);

    const onPageChange = (event: any) => {
        setFirstTable(event.first);
        setPage(event.page);
        setSize(event.rows);
    };
    const onPageChangeSlide = (event: any) => {
        setFirst(event.first);
    };
  return (
    <div className="grid crud-demo">
        <div className="col-12">
            <div className="card">
                <div className='flex flex-row'>
                    <h2 className='mr-8'>Journal des Workflows</h2>
                </div>
                {statsAudits.length > 4 && (
                    <Paginator first={first} rows={4} totalRecords={statsAudits.length} onPageChange={onPageChangeSlide} template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} />
                )}                
                <div className='grid mb-4'>
                    {statsAudits.slice(first, first + 4).map((statAudit, index) =>{
                    const auditColor = getRandomColor();
                    return (    
                        <div className="col-12 md:col-6 xl:col-3" key={index}>
                            <div className="card shadow-1 flex flex-column" style={{color: `${auditColor}`, borderLeft: "4px solid"}}>
                                <div className="flex align-items-center">
                                    <div className="flex justify-content-center align-items-center p-2 border-round" style={{backgroundColor: `${auditColor}`}}>
                                        <i className="pi pi-cog" style={{color:" rgb(255, 255, 255)"}}></i>
                                    </div>
                                    <span className="text-xl ml-2 font-semibold" style={{color: `${auditColor}`}}>{Object.keys(statAudit)[0]}</span>
                                </div>
                                <div className="grid mt-3">
                                    <div className="col-6 flex flex-column p-3 text-center border-right-1 surface-border">
                                        <i className="pi pi-file" style={{color:" rgb(48, 63, 159)"}}></i>
                                        <span className="text-color text-2xl font-semibold">{statAudit[Object.keys(statAudit)[0]].nbWorkflows}</span>
                                        <span className="text-color font-semibold">Workflows</span>
                                    </div>
                                    <div className="col-6 flex flex-column p-3 text-center ">
                                        <i className="pi pi-user" style={{color:" rgb(48, 63, 159)"}}></i>
                                        <span className="text-color text-2xl font-semibold">{statAudit[Object.keys(statAudit)[0]].nbUsers}</span>
                                        <span className="text-color font-semibold">Users</span>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    )})}  
                </div>                                                             
                <DataTable value={audits} paginator rows={size} first={firstTable} rowsPerPageOptions={[5, 10, 20]} className="datatable-responsive" 
                    emptyMessage={<div className="flex justify-content-center">Aucun audits touvés</div>} style={{minWidth:1000}} 
                    header={header} globalFilter={globalFilter} totalRecords={totalRecords} lazy onPage={onPageChange} >
                    <Column field="workflow.title" header={t("audit.workflow")} sortable/>
                    <Column field="utilisateur.nom" header={t("audit.user")} sortable
                    body={(rowData) => {
                        if (rowData?.utilisateur?.nom) {
                            return (
                                <div className="flex align-items-center gap-2">
                                    <img alt="" src="/user-avatar.png" width="32" />
                                    <span className='font-bold'>{rowData.utilisateur.nom +' '+rowData.utilisateur.prenom}</span>
                                </div>
                            ) 
                        }
                    }}/>
                    <Column field="createdOn" header={t("audit.date")} body={(rowData)=>{
                        if(rowData.createdOn){
                            return format(new Date(rowData.createdOn[0], rowData.createdOn[1] - 1, rowData.createdOn[2]), "dd/MM/yyyy");
                        }else{
                            return 'nan';
                    }}} sortable/>
                    <Column field="createdOn" header={t("audit.heure")} body={(rowData)=>{
                        if(rowData.createdOn){
                            return format(new Date(rowData.createdOn[0], rowData.createdOn[1] - 1, rowData.createdOn[2],rowData.createdOn[3], rowData.createdOn[4]), "HH:mm");
                        }else{
                            return 'nan';
                    }}} sortable/>
                    <Column field="action" header={t("audit.action")} sortable
                    body={(rowData)=>{
                        if (rowData.action) {
                            if (!actionColors[rowData.action]) {
                                actionColors[rowData.action] = getRandomColor(); // Assigner une couleur aléatoire si l'action n'a pas de couleur
                            }
                            const actionColor = actionColors[rowData.action]; // Utiliser la couleur associée à l'action
                            return (
                                <Tag
                                    value={rowData.action}
                                    style={{ backgroundColor: actionColor, color: 'white' }}
                                />
                            );
                        } else {
                            return 'nan';
                        }
                    }}
                    />
                </DataTable>
            </div>
        </div>
    </div>
  )
}

export default index
