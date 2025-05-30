import useViewHook from "app/component/zyhook/useViewhook";
import { TFunction } from "i18next";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react';

import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';

type EntiteAdministrativeViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: EntiteAdministrativeDto,
    t: TFunction
}

const View: React.FC<EntiteAdministrativeViewAdminType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<EntiteAdministrativeDto>({ selectedItem, onClose, t })

    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("entiteAdministrative.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("entiteAdministrative.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-4">
                            <label htmlFor="code">{t("entiteAdministrative.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={selectedItem?.code} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="libelle">{t("entiteAdministrative.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={selectedItem?.libelle} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrativeType">{t("entiteAdministrative.entiteAdministrativeType")}</label>
                            <InputText id="entiteAdministrativeTypeDropdown" value={selectedItem?.entiteAdministrativeType?.libelle} disabled />
                        </div>

                        <div className="field col-4">
                            <label htmlFor="entiteAdministrativeParent">{t("entiteAdministrative.entiteAdministrativeParent")}</label>
                            <InputText id="entiteAdministrativeParentDropdown" value={selectedItem?.entiteAdministrativeParent?.libelle} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="chef">{t("entiteAdministrative.chef")}</label>
                            <InputText id="chefDropdown" value={selectedItem?.chef?.nom} disabled />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="description">{t("entiteAdministrative.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={selectedItem?.description} disabled rows={5} cols={30} />
                            </span>
                        </div>
                        {/* <div className="field col-6">
                            <label htmlFor="referenceGed">{t("entiteAdministrative.referenceGed")}</label>
                            <InputText id="referenceGed" value={selectedItem?.referenceGed} disabled />
                        </div> */}
                    </div>
                </TabPanel>
                <TabPanel header={t("entiteAdministrative.utilisateurs")}>
                    <div className="card">
                        <DataTable value={selectedItem?.utilisateurs} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                            <Column field="email" header={t("utilisateur.email")}   ></Column>
                            <Column field="gender.libelle" header={t("utilisateur.gender")}></Column>
                            <Column field="nom" header={t("utilisateur.nom")}   ></Column>
                            <Column field="prenom" header={t("utilisateur.prenom")}   ></Column>
                            <Column field="telephone" header={t("utilisateur.telephone")}   ></Column>
                            <Column field="dateNaissance" header={t("utilisateur.dateNaissance")} body={formateDate("dateNaissance")} ></Column>
                        </DataTable>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
