import { Button } from 'primereact/button';
import { Column } from 'primereact/column';


import useListHook from "app/component/zyhook/useListhook";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useState } from 'react';


import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';

import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { GenderDto } from 'app/controller/model/Gender.model';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { GenderAdminService } from 'app/controller/service/admin/GenderAdminService.service';

import { useTranslation } from 'react-i18next';

import Create from '../create/utilisateur-create-admin.component';
import EditPassword from '../edit-password/utilisateur-edit-password-admin.component';
import Edit from '../edit/utilisateur-edit-admin.component';
import View from '../view/utilisateur-view-admin.component';


const List = () => {

    const { t } = useTranslation();
    const emptyItem = new UtilisateurDto();
    const emptyCriteria = new UtilisateurCriteria();
    const service = new UtilisateurAdminService();

    const {
        items,
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
        deleteItemDialogFooter,
        leftToolbarTemplate,
        rightToolbarTemplate,
        CustomBooleanCell,
        handleValidateClick,
        onPage,
        showEditModal,
        showViewModal,
        add,
        update,
        confirmDeleteItem,
        formateDate,
        deleteItemsDialog,
        deleteItemsDialogFooter,
        hideDeleteItemsDialog,
        showEditPasswordDialog,
        setShowEditPasswordDialog,
        showEditPasswordModal
    } = useListHook<UtilisateurDto, UtilisateurCriteria>({ emptyItem, emptyCriteria, service, t });

    const genderAdminService = new GenderAdminService();
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();

    useEffect(() => {
        fetchItems(criteria);
    }, []);

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("utilisateur.header", { totalRecords: totalRecords })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText id='search' type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} /> </span>
        </div>
    );

    const actionBodyTemplate = (rowData: UtilisateurDto) => {
        return (<div style={{ width: "200px" }}>
            <Button raised icon="pi pi-pencil" severity="info" className="mr-1"
                onClick={() => showEditModal(rowData)} />
            <Button raised icon="pi pi-trash" severity="danger" className="mr-1"
                onClick={() => confirmDeleteItem(rowData)} /> 
            <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                onClick={() => showViewModal(rowData)} />
            <Button raised icon="pi pi-key" severity="success" className="mr-1"
                onClick={() => showEditPasswordModal(rowData)} />
        </div>
        );
    };

    //console.log({ showEditPasswordDialog })

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    {/* {findByCriteriaShow && (
                        <Card className="mb-5">
                            <div className="grid">
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="1">{t("utilisateur.email")}</label>
                                    <InputText id="1" value={criteria.emailLike} onChange={(e) => setCriteria({ ...criteria, emailLike: e.target.value })} />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="2">{t("utilisateur.telephone")}</label>
                                    <InputText id="2" value={criteria.telephoneLike} onChange={(e) => setCriteria({ ...criteria, telephoneLike: e.target.value })} />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="3">{t("utilisateur.nom")}</label>
                                    <InputText id="3" value={criteria.nomLike} onChange={(e) => setCriteria({ ...criteria, nomLike: e.target.value })} />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="4">{t("utilisateur.prenom")}</label>
                                    <InputText id="4" value={criteria.prenomLike} onChange={(e) => setCriteria({ ...criteria, prenomLike: e.target.value })} />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="6">{t("utilisateur.genderPlaceHolder")}</label>
                                    <Dropdown id="6" value={criteria.gender} options={genders} onChange={(e) => setCriteria({ ...criteria, gender: e.target.value })} optionLabel="libelle" filter showClear />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="7">{t("utilisateur.entiteAdministrativePlaceHolder")}</label>
                                    <Dropdown id="7" value={criteria.entiteAdministrative} options={entiteAdministratives} onChange={(e) => setCriteria({ ...criteria, entiteAdministrative: e.target.value })} optionLabel="libelle" filter showClear />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                                <Button raised label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={handleValidateClick} />
                                <Button raised label={t("cancel")} className="p-button-secondary mr-2" icon="pi pi-times" onClick={handleCancelClick} />
                            </div>
                        </Card>
                    )} */}
                    <DataTable ref={dt} emptyMessage={<div className="flex justify-content-center"><ProgressSpinner /></div>} value={items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value as UtilisateurDto[])} dataKey="id" className="datatable-responsive" globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                        <Column field="email" header={t("utilisateur.email")} sortable></Column>
                        <Column field="nom" header={t("utilisateur.nom")} sortable></Column>
                        <Column field="prenom" header={t("utilisateur.prenom")} sortable></Column>
                        <Column field="enabled" header={t("utilisateur.enabled")} body={CustomBooleanCell("enabled")} sortable></Column>
                        <Column field="telephone" header={t("utilisateur.telephone")} sortable></Column>
                        <Column field="dateNaissance" header={t("utilisateur.dateNaissance")} sortable body={formateDate("dateNaissance")}></Column>
                        <Column field="gender.libelle" header={t("utilisateur.gender")} sortable ></Column>
                        <Column field="entiteAdministrative.libelle" header={t("utilisateur.entiteAdministrative")} sortable ></Column>

                        <Column header={t("actions")} body={actionBodyTemplate}></Column>
                    </DataTable>
                    <div className="p-d-flex p-ai-center p-jc-between">
                        <Paginator onPageChange={onPage} first={first} rows={rows} totalRecords={totalRecords} />
                    </div>
                    {showCreateDialog && <Create visible={showCreateDialog} onClose={() => setShowCreateDialog(false)} add={add} showToast={toast} list={items} service={service} t={t} />}

                    {showEditDialog && <Edit visible={showEditDialog} onClose={() => { setShowEditDialog(false); setSelectedItem(emptyItem); }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service} t={t} />}

                    {showEditPasswordDialog && <EditPassword visible={showEditPasswordDialog} onClose={() => { setShowEditPasswordDialog(false); }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service} t={t} />}

                    {showViewDialog && <View visible={showViewDialog} onClose={() => { setShowViewDialog(false); setSelectedItem(emptyItem); }} selectedItem={selectedItem} t={t} />}


                    {/* <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header={t("confirm")} modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("utilisateur.deleteUtilisateurConfirmationMessage")} <b>{item.nom}</b>?</span>)}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog} >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && <span>{t("utilisateur.deleteUtilisateursConfirmationMessage")}</span>}
                        </div>
                    </Dialog> */}

                </div>
            </div>
        </div>
    );
};
export default List;

