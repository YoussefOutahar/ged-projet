import { Column } from 'primereact/column';
import { TabPanel, TabView } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { TFunction } from "i18next";
import useViewHook from "app/component/zyhook/useViewhook";

import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';

type UtilisateurViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: UtilisateurDto,
    t: TFunction
}

const View: React.FC<UtilisateurViewAdminType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<UtilisateurDto>({ selectedItem, onClose, t })


    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("utilisateur.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("utilisateur.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-6">
                            <label htmlFor="email">{t("utilisateur.email")}</label>
                            <InputText id="email" value={selectedItem?.email} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="telephone">{t("utilisateur.telephone")}</label>
                            <InputText id="telephone" value={selectedItem?.telephone} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="nom">{t("utilisateur.nom")}</label>
                            <InputText id="nom" value={selectedItem?.nom} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="prenom">{t("utilisateur.prenom")}</label>
                            <InputText id="prenom" value={selectedItem?.prenom} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="dateNaissance">{t("utilisateur.dateNaissance")}</label>
                            <Calendar id="dateNaissance" value={adaptDate(selectedItem?.dateNaissance)} disabled dateFormat="dd/mm/yy" showIcon={true} />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="gender">{t("utilisateur.gender")}</label>
                            <InputText id="genderDropdown" value={selectedItem?.gender?.libelle} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="entiteAdministrative">{t("utilisateur.entiteAdministrative")}</label>
                            <InputText id="entiteAdministrativeDropdown" value={selectedItem?.entiteAdministrative?.libelle} disabled />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
