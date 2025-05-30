import { Button } from 'primereact/button';
import { Column } from 'primereact/column';


import useListHook from "app/component/zyhook/useListhook";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect } from 'react';


import { DocumentCategorieIndexRuleCriteria } from 'app/controller/criteria/DocumentCategorieIndexRuleCriteria.model';
import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { DocumentCategorieIndexRuleAdminService } from 'app/controller/service/admin/DocumentCategorieIndexRuleAdminService.service';


import { useTranslation } from 'react-i18next';

import { ProgressSpinner } from 'primereact/progressspinner';
import Create from '../create/document-categorie-index-rule-create-admin.component';
import Edit from '../edit/document-categorie-index-rule-edit-admin.component';
import View from '../view/document-categorie-index-rule-view-admin.component';


const List = () => {

    const { t } = useTranslation();

    const emptyItem = new DocumentCategorieIndexRuleDto();
    const emptyCriteria = new DocumentCategorieIndexRuleCriteria();
    const service = new DocumentCategorieIndexRuleAdminService();


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
    } = useListHook<DocumentCategorieIndexRuleDto, DocumentCategorieIndexRuleCriteria>({ emptyItem, emptyCriteria,service, t})





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
                                <label className="mb-1"  htmlFor="1">{t("documentCategorieIndexRule.code")}</label>
                                <InputText id="1" value={criteria.codeLike} onChange={(e) => setCriteria({ ...criteria, codeLike: e.target.value })} />
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="2">{t("documentCategorieIndexRule.libelle")}</label>
                                <InputText id="2" value={criteria.libelleLike} onChange={(e) => setCriteria({ ...criteria, libelleLike: e.target.value })} />
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="3">{t("documentCategorieIndexRule.expresion")}</label>
                                <InputText id="3" value={criteria.expresionLike} onChange={(e) => setCriteria({ ...criteria, expresionLike: e.target.value })} />
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="4">{t("documentCategorieIndexRule.description")}</label>
                                <InputText id="4" value={criteria.descriptionLike} onChange={(e) => setCriteria({ ...criteria, descriptionLike: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ marginTop : '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                            <Button raised  label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={handleValidateClick} />
                            <Button raised  label={t("reinitialiser")} className="p-button-secondary mr-2"  icon="pi pi-times" onClick={handleCancelClick} />
                        </div>
                </Card>
                )}
                <DataTable ref={dt}  emptyMessage={<div className="flex justify-content-center"><ProgressSpinner /></div>} value={items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value as DocumentCategorieIndexRuleDto[])} dataKey="id" className="datatable-responsive" globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column><Column field="code" header={t("documentCategorieIndexRule.code")} sortable></Column>
                    <Column field="libelle" header={t("documentCategorieIndexRule.libelle")} sortable></Column>
                    <Column field="expresion" header={t("documentCategorieIndexRule.expresion")} sortable></Column><Column header={t("actions")} body={actionBodyTemplate}></Column>
                </DataTable>
                <div className="p-d-flex p-ai-center p-jc-between">
                    <Paginator onPageChange={onPage} first={first} rows={rows} totalRecords={totalRecords} />
                </div>
                {showCreateDialog && <Create visible={showCreateDialog} onClose={() => setShowCreateDialog(false)} add={add} showToast={toast} list={items} service={service} t={t} />}

                {showEditDialog && <Edit  visible={showEditDialog} onClose={() =>  { setShowEditDialog(false); setSelectedItem(emptyItem); }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service}   t={t} />}

                {showViewDialog && <View visible={showViewDialog} onClose={() =>  { setShowViewDialog(false); setSelectedItem(emptyItem); }} selectedItem={selectedItem}   t={t} />}
                <Dialog visible={deleteItemDialog} style={{width: '450px'}} header={t("confirm")} modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                    <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    {item && (<span>{t("documentCategorieIndexRule.deleteDocumentCategorieIndexRuleConfirmationMessage")}</span>)}
                    </div>
                </Dialog>

            <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog} >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {item && <span>documentCategorieIndexRule.deleteDocumentCategorieIndexRulesConfirmationMessage</span>}
                </div>
            </Dialog>

            </div>
        </div>
    </div>
);
};
export default List;

