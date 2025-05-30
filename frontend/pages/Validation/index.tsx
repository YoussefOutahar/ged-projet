import useDocCategorieStore from 'Stores/DocumentCategorieStore';
import axiosInstance from 'app/axiosInterceptor';
import View from 'app/component/admin/view/doc/document/view/document-view-admin.component';
import Save from 'app/component/admin/view/quality/echantillon/save/save-echantillon-document';
import useListHook from 'app/component/zyhook/useListhook';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { PlanClassementDto } from 'app/controller/model/PlanClassement.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
interface Node {
    key: string;
    label: string;
    children?: Node[];
    archive?: boolean;
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const Validation = () => {

    const emptyItem = new DocumentDto();
    const emptyCriteria = new DocumentCriteria();
    const service = new DocumentAdminService();

    const { t } = useTranslation();

    const {
        items,
        showSearch,
        deleteItemDialog,
        item,
        selectedItems,
        setSelectedItems,
        hideDeleteItemDialog,
        globalFilter,
        setGlobalFilter,
        showCreateDialog,
        setShowCreateDialog,
        showEditDialog,
        setShowEditDialog,
        showViewDialog,
        setShowViewDialog,
        selectedItem,
        setSelectedItem,
        rows,
        totalRecords,
        criteria,
        setCriteria,
        first,
        fetchItems,
        toast,
        dt,
        confirmDeleteSelected,
        exportCSV,
        deleteItem,
        deleteItemDialogFooter,
        rightToolbarTemplate,
        CustomBooleanCell,
        handleValidateClick,
        onPage,
        showCreateModal,
        showEditModal,
        showViewModal,
        add,
        update,
        confirmDeleteItem,
        statusBodyTemplate,
        formateDate,
        deleteSelectedItems,
        deleteItemsDialog,
        deleteItemsDialogFooter,
        hideDeleteItemsDialog,
        fetchItemsFromElastic
    } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t });

    const [dataSize, setDataSize] = useState<Number>(0);
    const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
    const [percent, setPercent] = useState<any>();
    const [loading, setLoading] = useState(false);
    const toastRef = useRef<Toast>(null);

    const [planClassements, setPlanClassements] = useState<PlanClassementDto[]>([]);
    const {categories: documentCategories} = useDocCategorieStore();

    const [selectedDocumentCategorieId, setSelectedDocumentCategorieId] = useState<DocumentCategorieDto>();
    const [selectedPlanClassementId, setSelectedPlanClassementId] = useState<PlanClassementDto>();

    useEffect(() => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
            .then(response => setPlanClassements(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, []);
    const showToast = (severity: SeverityType, summary: string) => {
        if (toastRef.current) {
            toastRef.current.show({ severity, summary, life: 4000 });
        }
    };

    const [showSaveDialogQuality, setShowSaveDialogQuality] = useState(false);
    const showSaveModal= ()=>{
        setShowSaveDialogQuality(true);
    }
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                        <>
                            <Button raised label={t("echantillon.enregistrer")} icon="pi pi-plus" severity="info" className=" mr-2"
                                onClick={showSaveModal} disabled={!selectedItems || !selectedItems.length}/>
                        </>
                </div>
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: DocumentDto) => {
        return (
            <div style={{ width: "150px" }}>
                <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                    onClick={() => showViewModal(rowData)} />
            </div>
        );
    };

    const fetchDataForNode = async (percent: any) => {
        setLoading(true);
        try {
            const requestBody = {
                planClassement: {id:selectedPlanClassementId?.id},
                documentCategorie : {id:selectedDocumentCategorieId?.id}
            };
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria/quality/${percent}`, requestBody);
            setSelectedNodeData(response.data.list);
            setDataSize(response.data.dataSize);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data HELP:', error);
            showToast('error',`Impossible de sélectionner ${percent}% des documents `)
        }
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
    const onChangeDocumentCategorie = (e: DropdownChangeEvent) => {
        setSelectedDocumentCategorieId(e.value);
    };

    const onChangePlanClassement = (e: DropdownChangeEvent) => {
        setSelectedPlanClassementId(e.value);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <div className='flex flex-col'>
                        <div className="flex flex-row gap-1 mb-5 col-12">
                            <div className="p-inputgroup col-4">
                                <Dropdown
                                    showClear
                                    id="documentCategorieDropdown"
                                    value={selectedDocumentCategorieId}                                        options={documentCategories}
                                    onChange={onChangeDocumentCategorie}   
                                    placeholder={t("document.documentCategoriePlaceHolder")}
                                    filter
                                    filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                                    optionLabel="libelle"
                                />
                            </div>
                            <div className="p-inputgroup col-4">
                                <Dropdown
                                    showClear
                                    id="planClassementDropdown"
                                    value={selectedPlanClassementId}
                                    options={planClassements}
                                    onChange={onChangePlanClassement}
                                    placeholder={t("document.classificationPlan")}
                                    filter
                                    filterPlaceholder={t("document.planPlaceHolderFilter")}
                                    optionLabel="libelle"
                                />
                            </div>
                            <div className="p-inputgroup col-4">
                                <InputNumber className="p-inputtext-m" id="1" value={percent} placeholder={t("Pourcentage des document a qualifiés")}
                                    onChange={(e) => setPercent(e.value)}/>
                                <Button
                                    className="p-button-succes"
                                    icon="pi pi-percentage"
                                    onClick={() => fetchDataForNode(percent)}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>
                    <DataTable ref={dt} emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>} value={selectedNodeData}
                        onSelectionChange={(e) => setSelectedItems(e.value as DocumentDto[])} dataKey="id"
                        header={header} globalFilter={globalFilter} selection={selectedItems}
                        className="datatable-responsive" paginator rows={10} rowsPerPageOptions={[5, 10, 20, 50]}
                        responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                        <Column field="reference" header={t("document.reference")} sortable className="font-bold"></Column>
                        <Column field="uploadDate" header={t("document.uploadDate")} sortable
                            body={formateDate("uploadDate")}></Column>
                        <Column field="utilisateur.nom" header={t("document.utilisateur")} sortable body={(rowData) => {
                            if (rowData?.utilisateur?.nom) {
                                return (
                                    <div className="flex align-items-center gap-2">
                                        <img alt="" src="/user-avatar.png" width="32" />
                                        <span className='font-bold'>{rowData.utilisateur.nom}</span>
                                    </div>
                                )
                            }
                        }}></Column>
                        <Column field="documentCategorie.libelle" header={t("document.documentCategorie")}
                            sortable ></Column>
                        <Column field="documentState.libelle" header={t("document.documentState")} sortable
                            body={(rowData) => statusBodyTemplate(rowData.documentState?.libelle, rowData.documentState?.style)}></Column>
                        
                        <Column field="entiteAdministrative.libelle" header={t("document.entiteAdministrative")}
                            sortable></Column>
                        <Column field="planClassement.libelle" header={t("document.classificationPlan")}
                            sortable></Column>
                        <Column field="documentIndexElements" header={t("document.indexation")} body={(rowData) => {
                            if (rowData.documentIndexElements && rowData.documentIndexElements.length > 0) {
                                return (
                                    <Tag value="Indexé" severity="success" />
                                )
                            } else {
                                return (
                                    <Tag value="En Cours" severity="warning" />
                                )
                            }
                        }}
                            sortable></Column>
                        <Column header={t("actions")} body={actionBodyTemplate}></Column>
                    </DataTable>
                        {showViewDialog && <View visible={showViewDialog} onClose={() => {
                            setShowViewDialog(false);
                            setSelectedItem(emptyItem);
                        }} selectedItem={selectedItem} t={t} showToast={toast} />}
                        {showSaveDialogQuality && <Save visible={showSaveDialogQuality} onClose={() => {
                            setShowSaveDialogQuality(false);
                            setSelectedItem(emptyItem);
                            showToast("success","Echantillon créé avec succès");
                        }} showToast={toast}  selectedItems={selectedItems} update={update} list={selectedItems} service={service}
                            t={t} />}
                 </div>        
            </div>
            <Toast ref={toastRef} />
        </div>
    )
}

export default Validation