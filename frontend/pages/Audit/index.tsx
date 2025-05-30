import axiosInstance from 'app/axiosInterceptor';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Paginator } from 'primereact/paginator';
import useAuditStore from 'Stores/AuditStore';

const index = () => {
    const { auditStats: statsAudits } = useAuditStore();
    const { t } = useTranslation();
    const [globalFilter, setGlobalFilter] = useState('');
    
    // Pagination pour statsAudits
    const [first, setFirst] = useState(0);
    
    // Pagination pour la table d'audits
    const [auditPage, setAuditPage] = useState(0);
    const [auditRows, setAuditRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [audits, setAudits] = useState<any[]>([]);
    
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: totalRecords })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} /> 
            </span>
        </div>
    );
    
    const fetchAudits = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}audit/page`, {
                params: {
                    page: auditPage,
                    size: auditRows,
                }
            });
            setAudits(response.data.content);
            setTotalRecords(response.data.totalElements);
        } catch (error) {
            console.error("Erreur lors de la récupération des audits :", error);
        }
    };
    
    useEffect(() => {
        fetchAudits();
    }, [auditPage, auditRows]);
    
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    
    // Handler pour la pagination des statsAudits
    const onPageChange = (event: any) => {
        setFirst(event.first);
    };
    
    // Handler pour la pagination des audits
    const onAuditPageChange = (event: DataTablePageEvent) => {
        setAuditPage(event.page ?? 0);
        setAuditRows(event.rows);
    };
    
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <div className='flex flex-row'>
                        <h2 className='mr-8'>Journal des Consultants</h2>
                    </div>
                    {statsAudits.length > 4 && (
                        <Paginator 
                            first={first} 
                            rows={4} 
                            totalRecords={statsAudits.length} 
                            onPageChange={onPageChange} 
                            template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} 
                        />
                    )}                
                    <div className='grid mb-4'>
                        {statsAudits
                            .slice(first, first + 4)
                            .map((statAudit, index) => {
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
                                                    <span className="text-color text-2xl font-semibold">{statAudit[Object.keys(statAudit)[0]].nbDocuments}</span>
                                                    <span className="text-color font-semibold">Documents</span>
                                                </div>
                                                <div className="col-6 flex flex-column p-3 text-center ">
                                                    <i className="pi pi-user" style={{color:" rgb(48, 63, 159)"}}></i>
                                                    <span className="text-color text-2xl font-semibold">{statAudit[Object.keys(statAudit)[0]].nbUsers}</span>
                                                    <span className="text-color font-semibold">Users</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                )
                            })
                        }  
                    </div>  
                </div>     
                <div className="card">                                      
                    <DataTable 
                        value={audits} 
                        className="datatable-responsive"
                        emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>} 
                        style={{minWidth:1000}} 
                        header={header} 
                        globalFilter={globalFilter}
                        lazy
                        paginator
                        rows={auditRows}
                        totalRecords={totalRecords}
                        first={auditPage * auditRows}
                        onPage={onAuditPageChange}
                        rowsPerPageOptions={[5, 10, 20]}
                    >
                        <Column field="document.reference" header={t("audit.document")} sortable/>
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
                            }
                        }} sortable/>
                        <Column field="createdOn" header={t("audit.heure")} body={(rowData)=>{
                            if(rowData.createdOn){
                                return format(new Date(rowData.createdOn[0], rowData.createdOn[1] - 1, rowData.createdOn[2], rowData.createdOn[3], rowData.createdOn[4]), "HH:mm");
                            }else{
                                return 'nan';
                            }
                        }} sortable/>
                        <Column field="action" header={t("audit.action")} sortable
                        body={(rowData)=>{
                            if(rowData.action === "Consulter" ){
                                return (
                                    <Tag value="Consulté" severity="success" />
                                ) 
                            }else if(rowData.action === "MODIFIER_DOC"){
                                return (
                                    <Tag value="Modifié" severity="warning" />
                                )
                            }else if(rowData.action === "AJOUTER_DOC"){
                                return (
                                    <Tag value="Ajouté" severity="info" />
                                )
                            }else if(rowData.action === "PARTAGER_DOC"){
                                return (
                                    <Tag value="partagé" severity="danger" />
                                )
                            }else if(rowData.action === "Modifier_File"){
                                return(
                                    <Tag value="Modifié File" severity="warning" />
                                )
                            }else if(rowData.action === "Ajouter-Masse"){
                                return(
                                    <Tag value="Ajouté Masse" severity="info" />
                                )
                            }else{
                                return (
                                    <Tag value={rowData.action} severity="info" />
                                )
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