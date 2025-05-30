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

import { RoleUtilisateurDto } from 'app/controller/model/RoleUtilisateur.model';

type RoleUtilisateurViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: RoleUtilisateurDto,
    t: TFunction
}

const View: React.FC<RoleUtilisateurViewAdminType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<RoleUtilisateurDto>({ selectedItem, onClose, t })


    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("roleUtilisateur.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("roleUtilisateur.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-6">
                            <label htmlFor="code">{t("roleUtilisateur.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={selectedItem?.code} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="libelle">{t("roleUtilisateur.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={selectedItem?.libelle} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="description">{t("roleUtilisateur.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={selectedItem?.description} disabled rows={5} cols={30} />
                            </span>
                        </div>

                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
