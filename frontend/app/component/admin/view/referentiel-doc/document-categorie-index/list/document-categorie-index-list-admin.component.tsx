import { Button } from 'primereact/button';
import { Column } from 'primereact/column';


import useListHook from "app/component/zyhook/useListhook";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useState } from 'react';


import { DocumentCategorieIndexCriteria } from 'app/controller/criteria/DocumentCategorieIndexCriteria.model';
import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';
import { DocumentCategorieIndexAdminService } from 'app/controller/service/admin/DocumentCategorieIndexAdminService.service';

import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { DocumentCategorieIndexRuleAdminService } from 'app/controller/service/admin/DocumentCategorieIndexRuleAdminService.service';
import { IndexElementAdminService } from 'app/controller/service/admin/IndexElementAdminService.service';

import { useTranslation } from 'react-i18next';

import { ProgressSpinner } from 'primereact/progressspinner';
import Create from '../create/document-categorie-index-create-admin.component';
import Edit from '../edit/document-categorie-index-edit-admin.component';
import View from '../view/document-categorie-index-view-admin.component';


const List = () => {

    const { t } = useTranslation();

    const emptyItem = new DocumentCategorieIndexDto();
    const emptyCriteria = new DocumentCategorieIndexCriteria();
    const service = new DocumentCategorieIndexAdminService();


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
    } = useListHook<DocumentCategorieIndexDto, DocumentCategorieIndexCriteria>({ emptyItem, emptyCriteria,service, t})



    const [indexElements, setIndexElements] = useState<IndexElementDto[]>([]);
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const [documentCategorieIndexRules, setDocumentCategorieIndexRules] = useState<DocumentCategorieIndexRuleDto[]>([]);

    const indexElementAdminService = new IndexElementAdminService();
    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const documentCategorieIndexRuleAdminService = new DocumentCategorieIndexRuleAdminService();

    useEffect(() => {

        indexElementAdminService.getList().then(({data}) => setIndexElements(data)).catch(error => console.log(error));
        documentCategorieAdminService.getList().then(({data}) => setDocumentCategories(data)).catch(error => console.log(error));
        documentCategorieIndexRuleAdminService.getList().then(({data}) => setDocumentCategorieIndexRules(data)).catch(error => console.log(error));
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
                                <label className="mb-1"  htmlFor="1">{t("documentCategorieIndex.indexElementPlaceHolder")}</label>
                                <Dropdown id="1" value={criteria.indexElement} options={indexElements} onChange={(e) => setCriteria({ ...criteria, indexElement: e.target.value })} optionLabel="libelle" filter showClear/>
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="2">{t("documentCategorieIndex.documentCategoriePlaceHolder")}</label>
                                <Dropdown id="2" value={criteria.documentCategorie} options={documentCategories} onChange={(e) => setCriteria({ ...criteria, documentCategorie: e.target.value })} optionLabel="libelle" filter showClear/>
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="3">{t("documentCategorieIndex.documentCategorieIndexRulePlaceHolder")}</label>
                                <Dropdown id="3" value={criteria.documentCategorieIndexRule} options={documentCategorieIndexRules} onChange={(e) => setCriteria({ ...criteria, documentCategorieIndexRule: e.target.value })} optionLabel="libelle" filter showClear/>
                            </div>
                        </div>
                        <div style={{ marginTop : '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                            <Button raised  label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={handleValidateClick} />
                            <Button raised  label={t("reinitialiser")} className="p-button-secondary mr-2"  icon="pi pi-times" onClick={handleCancelClick} />
                        </div>
                </Card>
                )}
                <DataTable ref={dt}  emptyMessage={<div className="flex justify-content-center"><ProgressSpinner /></div>} value={items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value as DocumentCategorieIndexDto[])} dataKey="id" className="datatable-responsive" globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column><Column field="indexElement.libelle" header={t("documentCategorieIndex.indexElement")} sortable ></Column>
                    <Column field="documentCategorie.libelle" header={t("documentCategorieIndex.documentCategorie")} sortable ></Column>
                    <Column field="documentCategorieIndexRule.libelle" header={t("documentCategorieIndex.documentCategorieIndexRule")} sortable ></Column>
                    <Column header={t("actions")} body={actionBodyTemplate}></Column>
               
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
                    {item && (<span>{t("documentCategorieIndex.deleteDocumentCategorieIndexConfirmationMessage")}</span>)}
                    </div>
                </Dialog>

            <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog} >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {item && <span>documentCategorieIndex.deleteDocumentCategorieIndexsConfirmationMessage</span>}
                </div>
            </Dialog>

            </div>
        </div>
    </div>
);
};
export default List;

