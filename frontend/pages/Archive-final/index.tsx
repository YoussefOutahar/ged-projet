import axiosInstance from 'app/axiosInterceptor';
import ViewArchive from 'app/component/admin/view/doc/document/view/archive-view-admin.component';
import View from 'app/component/admin/view/doc/document/view/document-view-admin.component';
import useListHook from 'app/component/zyhook/useListhook';
import { ArchiveCriteria } from 'app/controller/criteria/ArchiveCriteria.model';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { ArchiveDto } from 'app/controller/model/DocumentArchive.model';
import { ArchiveAdminService } from 'app/controller/service/admin/ArchiveAdminService.service';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { setYear } from 'date-fns';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree'
import TreeNode from 'primereact/treenode';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
interface Node {

    label: string;
    data?: any;

}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const index = () => {
    const emptyItem = new ArchiveDto();
    const emptyCriteria = new ArchiveCriteria();
    const service = new ArchiveAdminService();

    const { t } = useTranslation();

    const {

        globalFilter,
        setGlobalFilter,

        showViewDialog,
        setShowViewDialog,
        selectedItem,
        setSelectedItem,
        toast,
        dt,
        CustomBooleanCell,
        showViewModal,
        statusBodyTemplate,
        formateDate,
    } = useListHook<ArchiveDto, ArchiveCriteria>({ emptyItem, emptyCriteria, service, t });
    const [plans, setPlans] = useState<any[]>([]);
    const [clickedNode, setClickedNode] = useState<Node | null>(null);
    const [dataSize, SetDataSize] = useState<Number>(0);
    const [documentYear, setDocumentYear] = useState<Number>(0);

    const [id, setIdPlanArchive] = useState<Number>();
    const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
    const [nodeToArchiver, setNodeToArchiver] = useState<TreeNode | null>(null);
    const [confirmationVisibleArchive, setConfirmationVisibleArchive] = useState(false);
    const toastRef = useRef<Toast>(null);

    const showToast = (severity: SeverityType, summary: string) => {
        if (toastRef.current) {
            toastRef.current.show({ severity, summary, life: 4000 });
        }
    };

    useEffect(() => {
        refreshPlans();
    }, []);
    const [start, setStart] = useState(0);
    const [onRows, setOnRows] = useState(5);
    const actionBodyTemplate = (rowData: ArchiveDto) => {
        return (
            <div style={{ width: "150px" }}>
                <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                    onClick={() => showViewModal(rowData)} />
            </div>
        );
    };

    const fetchDataForNode = async (x: Number) => {
        setDocumentYear(x);
        try {
            const requestBody = {
                maxResults: onRows
            };
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-archive-by-year?year=${x} `, requestBody);

            // Utilisation des fonctions de mise à jour d'état
            setSelectedNodeData(response.data.list);
            SetDataSize(response.data.dataSize);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const refreshPlans = async () => {
        const response = await axiosInstance.get<number[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/years`);
        setPlans(response.data.map((year) => {
            return {
                key: year.toString(),
                label: year.toString(),
                children: []
            };
        }));
        //setYear(response.key);

    };
    const handleNodeClick = (node: TreeNode) => {
        setClickedNode((prevClickedNode) => {
            if (prevClickedNode && prevClickedNode.label === node.key) {
                return null;
            } else {
                return node as Node;
            }
        });
        const fetchData = async () => {
            const year = Number(node.key);
            setIdPlanArchive(id);
            await fetchDataForNode(year);
        };
        fetchData();
    };
    const nextPage = async (event: PaginatorPageChangeEvent) => {
        try {
            const requestBody = {
                maxResults: onRows,
                page: event.page
            };
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-archive-by-year?year=${documentYear} `, requestBody);


            // Utilisation des fonctions de mise à jour d'état
            setSelectedNodeData(response.data.list);
            SetDataSize(response.data.dataSize);

            setStart(event.first);
            setOnRows(event.rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleReload = (node: TreeNode) => {
        setNodeToArchiver(node);
        setConfirmationVisibleArchive(true);
    };
    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        const isClickedNode = clickedNode && clickedNode.data === node.key;

        return (
            <div className='cursor-pointer'>
                <i
                    className="pi pi-bookmark-fill"
                    style={{ marginRight: '0.5rem', color: '#49509f', fontSize: '18px' }} />
                <span style={{ color: '#49509f', fontWeight: 'normal', marginRight: '0.8rem', fontSize: '16px' }} >{node.label}</span>
                {isClickedNode && (
                    <div style={{ float: 'right' }}>
                        <Button icon="pi pi-replay" onClick={() => handleReload(node)} className="p-button-warning" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
                    </div>
                )}
            </div>
        );
    };
   
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: dataSize })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );
    return (
        <div>
            <div className='flex flex-row'>
                <h2 className='mr-8'>{t("document.gestionArchive")}</h2>
            </div>
            <div className='flex flex-row'>
                <Tree
                    value={plans} nodeTemplate={nodeTemplate}
                    style={{ minWidth: '300px', maxWidth: '350px', minHeight: '570px', marginRight: '10px', borderRadius: '15px', backgroundColor: '#f6f8fa', marginBottom: '1rem' }}
                    onNodeClick={(e) => handleNodeClick(e.node)}
                />
                <div>
                    <DataTable ref={dt} emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>} value={selectedNodeData}
                        dataKey="id" header={header} globalFilter={globalFilter}
                        className="datatable-responsive"
                        responsiveLayout="scroll" style={{ minWidth: 1200 }}>
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                        <Column field="reference" header={t("document.reference")} sortable></Column>
                        <Column field="planClassement.code" header={t("document.reference")} sortable></Column>
                        <Column field="uploadDate" header={t("document.uploadDate")} sortable
                            body={formateDate("uploadDate")}></Column>
                        <Column field="snapshot" header={t("document.snapshot")} sortable hidden></Column>  
                        <Column field="ligne" header={t("document.line")} sortable ></Column>                    
                        <Column field="colonne" header={t("document.colonne")} sortable ></Column>                    
                        <Column field="numBoite" header={t("document.boite")} sortable ></Column>                    
                  
                        <Column field="referenceGed" header={t("document.referenceGed")} sortable></Column>
                        <Column header={t("actions")} body={actionBodyTemplate}></Column>
                    </DataTable>
                    <div className="p-d-flex p-ai-center p-jc-between">
                        <Paginator onPageChange={nextPage} first={start} rows={onRows} totalRecords={dataSize as number} />
                    </div>
                    {showViewDialog && <ViewArchive visible={showViewDialog} onClose={() => {
                        setShowViewDialog(false);
                        setSelectedItem(emptyItem);
                    }} selectedItem={selectedItem} t={t} showToast={toast} />}
                </div>
            </div>
            <Toast ref={toastRef} />
        
        </div>
    )
}

export default index