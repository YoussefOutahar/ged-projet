import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React from 'react';


import { EntiteAdministrativeTypeDto } from 'app/controller/model/EntiteAdministrativeType.model';
import { EntiteAdministrativeTypeAdminService } from 'app/controller/service/admin/EntiteAdministrativeTypeAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

import useEditHook from "app/component/zyhook/useEdit.hook";
import { EntiteAdministrativeTypeCriteria } from "app/controller/criteria/EntiteAdministrativeTypeCriteria.model";


type EntiteAdministrativeTypeEditAdminType = {
    visible: boolean,
    onClose: () => void,
    showToast: React.Ref<Toast>,
    selectedItem: EntiteAdministrativeTypeDto
    update: (item: EntiteAdministrativeTypeDto) => void,
    list: EntiteAdministrativeTypeDto[],
    service: EntiteAdministrativeTypeAdminService,
    t: TFunction
}
const Edit: React.FC<EntiteAdministrativeTypeEditAdminType> = ({ visible, onClose, showToast, selectedItem, update, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.code == '')
            errorMessages.push("code Obligatoire")
        if (item.libelle == '')
            errorMessages.push("libelle Obligatoire")
        return errorMessages.length == 0;
    }


    const {
        item,
        submitted,
        activeIndex,
        onInputTextChange,
        onTabChange,
        hideDialog,
        editItem } = useEditHook<EntiteAdministrativeTypeDto, EntiteAdministrativeTypeCriteria>({ list, selectedItem, onClose, update, showToast, service, t, isFormValid })


    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={editItem} /> </>
    );

    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '70vw' }} header={t("entiteAdministrativeType.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("entiteAdministrativeType.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("entiteAdministrativeType.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item ? item.code : ''} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")}).</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("entiteAdministrativeType.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item ? item.libelle : ''} onChange={(e) => onInputTextChange(e, 'libelle')} required className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="description">{t("entiteAdministrativeType.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={item ? item.description : ''} onChange={(e) => onInputTextChange(e, 'description')} rows={5} cols={30} />
                            </span>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Edit;


