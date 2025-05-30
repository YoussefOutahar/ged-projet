import {Button} from 'primereact/button';
import {Column} from 'primereact/column';


import {DataTable} from 'primereact/datatable';
import {Dialog} from 'primereact/dialog';
import {FileUpload} from 'primereact/fileupload';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import React, {useEffect, useRef, useState} from 'react';
import {Paginator, PaginatorPageChangeEvent} from 'primereact/paginator';
import {Card} from 'primereact/card';
import {Calendar} from 'primereact/calendar';
import {InputNumber} from 'primereact/inputnumber';
import {Dropdown} from 'primereact/dropdown';
import {format} from "date-fns";
import useListHook from "app/component/zyhook/useListhook";
import {MessageService} from 'app/zynerator/service/MessageService';


import {DocumentCategorieIndexAgentService} from 'app/controller/service/agent/DocumentCategorieIndexAgentService.service';
import {DocumentCategorieIndexDto}  from 'app/controller/model/DocumentCategorieIndex.model';
import {DocumentCategorieIndexCriteria} from 'app/controller/criteria/DocumentCategorieIndexCriteria.model';

import {IndexElementDto} from 'app/controller/model/IndexElement.model';
import {IndexElementAgentService} from 'app/controller/service/agent/IndexElementAgentService.service';
import {DocumentCategorieDto} from 'app/controller/model/DocumentCategorie.model';
import {DocumentCategorieAgentService} from 'app/controller/service/agent/DocumentCategorieAgentService.service';
import {DocumentCategorieIndexRuleDto} from 'app/controller/model/DocumentCategorieIndexRule.model';
import {DocumentCategorieIndexRuleAgentService} from 'app/controller/service/agent/DocumentCategorieIndexRuleAgentService.service';

import { useTranslation } from 'react-i18next';

import Edit from '../edit/document-categorie-index-edit-agent.component';
import Create from '../create/document-categorie-index-create-agent.component';
import View from '../view/document-categorie-index-view-agent.component';
import { ProgressSpinner } from 'primereact/progressspinner';


const List = () => {

    const { t } = useTranslation();

    const emptyItem = new DocumentCategorieIndexDto();
    const emptyCriteria = new DocumentCategorieIndexCriteria();
    const service = new DocumentCategorieIndexAgentService();


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

    const indexElementAgentService = new IndexElementAgentService();
    const documentCategorieAgentService = new DocumentCategorieAgentService();
    const documentCategorieIndexRuleAgentService = new DocumentCategorieIndexRuleAgentService();

    useEffect(() => {

        indexElementAgentService.getList().then(({data}) => setIndexElements(data)).catch(error => console.log(error));
        documentCategorieAgentService.getList().then(({data}) => setDocumentCategories(data)).catch(error => console.log(error));
        documentCategorieIndexRuleAgentService.getList().then(({data}) => setDocumentCategorieIndexRules(data)).catch(error => console.log(error));
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
                    <Column field="documentCategorieIndexRule.libelle" header={t("documentCategorieIndex.documentCategorieIndexRule")} sortable ></Column><Column header={t("actions")} body={actionBodyTemplate}></Column>
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

