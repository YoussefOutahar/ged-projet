import useViewHook from "app/component/zyhook/useViewhook";
import { TFunction } from "i18next";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react';

import { EntiteAdministrativeTypeDto } from 'app/controller/model/EntiteAdministrativeType.model';

type EntiteAdministrativeTypeViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: EntiteAdministrativeTypeDto,
    t: TFunction
}

const View: React.FC<EntiteAdministrativeTypeViewAdminType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        activeIndex
    } = useViewHook<EntiteAdministrativeTypeDto>({ selectedItem, onClose, t })


    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '70vw' }} header={t("entiteAdministrativeType.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("entiteAdministrativeType.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-6">
                            <label htmlFor="code">{t("entiteAdministrativeType.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={selectedItem?.code} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="libelle">{t("entiteAdministrativeType.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={selectedItem?.libelle} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="description">{t("entiteAdministrativeType.description")}</label>
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
