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


import {DocumentCategorieModelAgentService} from 'app/controller/service/agent/DocumentCategorieModelAgentService.service';
import {DocumentCategorieModelDto}  from 'app/controller/model/DocumentCategorieModel.model';
import {DocumentCategorieModelCriteria} from 'app/controller/criteria/DocumentCategorieModelCriteria.model';

import {DocumentCategorieDto} from 'app/controller/model/DocumentCategorie.model';
import {DocumentCategorieAgentService} from 'app/controller/service/agent/DocumentCategorieAgentService.service';

import { useTranslation } from 'react-i18next';

import Edit from '../edit/document-categorie-model-edit-agent.component';
import Create from '../create/document-categorie-model-create-agent.component';
import View from '../view/document-categorie-model-view-agent.component';
import { ProgressSpinner } from 'primereact/progressspinner';


const List = () => {

    const { t } = useTranslation();

    const emptyItem = new DocumentCategorieModelDto();
    const emptyCriteria = new DocumentCategorieModelCriteria();
    const service = new DocumentCategorieModelAgentService();


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
    } = useListHook<DocumentCategorieModelDto, DocumentCategorieModelCriteria>({ emptyItem, emptyCriteria,service, t})



    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);

    const documentCategorieAgentService = new DocumentCategorieAgentService();

    useEffect(() => {

        documentCategorieAgentService.getList().then(({data}) => setDocumentCategories(data)).catch(error => console.log(error));
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
                                <label className="mb-1"  htmlFor="1">{t("documentCategorieModel.code")}</label>
                                <InputText id="1" value={criteria.code} onChange={(e) => setCriteria({ ...criteria, code: e.target.value })} />
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="2">{t("documentCategorieModel.libelle")}</label>
                                <InputText id="2" value={criteria.libelle} onChange={(e) => setCriteria({ ...criteria, libelle: e.target.value })} />
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="4">{t("documentCategorieModel.description")}</label>
                                <InputText id="4" value={criteria.description} onChange={(e) => setCriteria({ ...criteria, description: e.target.value })} />
                            </div>
                            <div className="flex flex-column col-3">
                                <label className="mb-1"  htmlFor="5">{t("documentCategorieModel.documentCategoriePlaceHolder")}</label>
                                <Dropdown id="5" value={criteria.documentCategorie} options={documentCategories} onChange={(e) => setCriteria({ ...criteria, documentCategorie: e.target.value })} optionLabel="libelle" filter showClear/>
                            </div>
                        </div>
                        <div style={{ marginTop : '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                            <Button raised  label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={handleValidateClick} />
                            <Button raised  label={t("reinitialiser")} className="p-button-secondary mr-2"  icon="pi pi-times" onClick={handleCancelClick} />
                        </div>
                </Card>
                )}
                <DataTable ref={dt}  emptyMessage={<div className="flex justify-content-center"><ProgressSpinner /></div>} value={items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value as DocumentCategorieModelDto[])} dataKey="id" className="datatable-responsive" globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column><Column field="code" header={t("documentCategorieModel.code")} sortable></Column>
                    <Column field="libelle" header={t("documentCategorieModel.libelle")} sortable></Column>
                    <Column field="referenceGed" header={t("documentCategorieModel.referenceGed")} sortable></Column>
                    <Column field="documentCategorie.libelle" header={t("documentCategorieModel.documentCategorie")} sortable ></Column><Column header={t("actions")} body={actionBodyTemplate}></Column>
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
                    {item && (<span>{t("documentCategorieModel.deleteDocumentCategorieModelConfirmationMessage")} </span>)}
                    </div>
                </Dialog>

            <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog} >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {item && <span>documentCategorieModel.deleteDocumentCategorieModelsConfirmationMessage</span>}
                </div>
            </Dialog>

            </div>
        </div>
    </div>
);
};
export default List;

