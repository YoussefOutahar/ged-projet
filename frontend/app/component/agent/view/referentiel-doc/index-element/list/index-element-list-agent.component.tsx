import { Button } from 'primereact/button';
import { Column } from 'primereact/column';


import useListHook from "app/component/zyhook/useListhook";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect } from 'react';


import { IndexElementCriteria } from 'app/controller/criteria/IndexElementCriteria.model';
import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { IndexElementAgentService } from 'app/controller/service/agent/IndexElementAgentService.service';


import { useTranslation } from 'react-i18next';

import Create from '../create/index-element-create-agent.component';
import Edit from '../edit/index-element-edit-agent.component';
import View from '../view/index-element-view-agent.component';


const List = () => {

    const { t } = useTranslation();

    const emptyItem = new IndexElementDto();
    const emptyCriteria = new IndexElementCriteria();
    const service = new IndexElementAgentService();


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
        findByCriteriaShow,
        handleCancelClick,
        confirmDeleteSelected,
        exportCSV,
        deleteItem,
        deleteItemDialogFooter,
        leftToolbarTemplate,
        rightToolbarTemplate,
        actionBodyTemplate,
        header,
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
        hideDeleteItemsDialog
    } = useListHook<IndexElementDto, IndexElementCriteria>({ emptyItem, emptyCriteria, service, t })

    useEffect(() => {
        fetchItems(criteria);
    }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    {findByCriteriaShow && (
                        <Card className="mb-5">
                            <div className="grid">
                                <div className="flex flex-column col-3">
                                    <label className="mb-1" htmlFor="1">{t("indexElement.code")}</label>
                                    <InputText id="1" value={criteria.codeLike} onChange={(e) => setCriteria({ ...criteria, codeLike: e.target.value })} />
                                </div>
                                <div className="flex flex-column col-3">
                                    <label className="mb-1" htmlFor="2">{t("indexElement.libelle")}</label>
                                    <InputText id="2" value={criteria.libelleLike} onChange={(e) => setCriteria({ ...criteria, libelleLike: e.target.value })} />
                                </div>
                                {/* <div className="flex flex-column col-3">
                                    <label className="mb-1" htmlFor="3">{t("indexElement.description")}</label>
                                    <InputText id="3" value={criteria.description} onChange={(e) => setCriteria({ ...criteria, description: e.target.value })} />
                                </div> */}
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                                <Button raised  label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={handleValidateClick} />
                                <Button raised  label={t("reinitialiser")} className="p-button-secondary mr-2" icon="pi pi-times" onClick={handleCancelClick} />
                            </div>
                        </Card>
                    )}
                    <DataTable ref={dt}  emptyMessage={<div className="flex justify-content-center"><ProgressSpinner /></div>} value={items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value as IndexElementDto[])} dataKey="id" className="datatable-responsive" globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column><Column field="code" header={t("indexElement.code")} sortable></Column>
                        <Column field="libelle" header={t("indexElement.libelle")} sortable></Column><Column header={t("actions")} body={actionBodyTemplate}></Column>
                    </DataTable>
                    <div className="p-d-flex p-ai-center p-jc-between">
                        <Paginator onPageChange={onPage} first={first} rows={rows} totalRecords={totalRecords} />
                    </div>
                    {showCreateDialog && <Create visible={showCreateDialog} onClose={() => setShowCreateDialog(false)} add={add} showToast={toast} list={items} service={service} t={t} />}

                    {showEditDialog && <Edit visible={showEditDialog} onClose={() => { setShowEditDialog(false); setSelectedItem(emptyItem); }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service} t={t} />}

                    {showViewDialog && <View visible={showViewDialog} onClose={() => { setShowViewDialog(false); setSelectedItem(emptyItem); }} selectedItem={selectedItem} t={t} />}
                    <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header={t("confirm")} modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("indexElement.deleteIndexElementConfirmationMessage")} </span>)}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog} >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && <span>{t("indexElement.deleteIndexElementsConfirmationMessage")}</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default List;

