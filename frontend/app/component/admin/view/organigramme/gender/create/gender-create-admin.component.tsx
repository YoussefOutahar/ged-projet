import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { format } from 'date-fns';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { MessageService } from 'app/zynerator/service/MessageService';

import { GenderAdminService } from 'app/controller/service/admin/GenderAdminService.service';
import { GenderDto } from 'app/controller/model/Gender.model';
import { GenderCriteria } from "app/controller/criteria/GenderCriteria.model";

import { TFunction } from "i18next";
import { Toast } from "primereact/toast";
import useCreateHook from "app/component/zyhook/useCreate.hook";



type GenderCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: GenderDto[],
    service: GenderAdminService,
    t: TFunction
}
const Create: React.FC<GenderCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.code == '')
            errorMessages.push("code Obligatoire")
        if (item.libelle == '')
            errorMessages.push("libelle Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new GenderDto();
    const {
        item,
        setItem,
        submitted,
        setSubmitted,
        activeIndex,
        setActiveIndex,
        activeTab,
        setActiveTab,
        onInputTextChange,
        onInputDateChange,
        onInputNumerChange,
        onMultiSelectChange,
        onBooleanInputChange,
        onTabChange,
        onDropdownChange,
        hideDialog,
        saveItem,
        formateDate
    } = useCreateHook<GenderDto, GenderCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })




    useEffect(() => {
    }, []);








    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );

    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("gender.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("gender.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("gender.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item.code} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")}).</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("gender.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item.libelle} onChange={(e) => onInputTextChange(e, 'libelle')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="description">{t("gender.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={item.description} onChange={(e) => onInputTextChange(e, 'description')} rows={5} cols={30} />
                            </span>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Create;
