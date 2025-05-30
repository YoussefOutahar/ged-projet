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

import { GroupeDto } from 'app/controller/model/Groupe.model';

type GroupeViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: GroupeDto,
    t: TFunction
}

const View: React.FC<GroupeViewAdminType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<GroupeDto>({ selectedItem, onClose, t })


    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("groupe.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("groupe.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-6">
                            <label htmlFor="code">{t("groupe.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={selectedItem?.code} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="libelle">{t("groupe.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={selectedItem?.libelle} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="utilisateur">{t("groupe.utilisateur")}</label>
                            <InputText id="utilisateurDropdown" value={selectedItem?.utilisateur?.nom} disabled />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header={t("groupe.groupeUtilisateurs")}>
                    <div className="card">
                        <DataTable value={selectedItem?.groupeUtilisateurs} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                            <Column field="utilisateur.nom" header={t("groupeUtilisateur.utilisateur")}></Column>
                            <Column field="dateAjout" header={t("groupeUtilisateur.dateAjout")} body={formateDate("dateAjout")} ></Column>
                            <Column field="etatUtilisateur.libelle" header={t("groupeUtilisateur.etatUtilisateur")}></Column>
                            <Column field="roleUtilisateur.libelle" header={t("groupeUtilisateur.roleUtilisateur")}></Column>
                        </DataTable>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
