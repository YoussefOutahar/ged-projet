import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { InputSwitch } from 'primereact/inputswitch';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

import { MessageService } from 'app/zynerator/service/MessageService';

import { DocumentCategorieIndexRuleAgentService } from 'app/controller/service/agent/DocumentCategorieIndexRuleAgentService.service';
import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

import { DocumentCategorieIndexRuleCriteria } from "app/controller/criteria/DocumentCategorieIndexRuleCriteria.model";
import useEditHook from "app/component/zyhook/useEdit.hook";


type DocumentCategorieIndexRuleEditAgentType = {
    visible: boolean,
    onClose: () => void,
    showToast: React.Ref<Toast>,
    selectedItem: DocumentCategorieIndexRuleDto
    update: (item: DocumentCategorieIndexRuleDto) => void,
    list: DocumentCategorieIndexRuleDto[],
    service: DocumentCategorieIndexRuleAgentService,
    t: TFunction
}
const Edit: React.FC<DocumentCategorieIndexRuleEditAgentType> = ({ visible, onClose, showToast, selectedItem, update, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.code == '')
            errorMessages.push("code Obligatoire")
        if (item.libelle == '')
            errorMessages.push("libelle Obligatoire")
        if (item.expresion == '')
            errorMessages.push("expresion Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new DocumentCategorieIndexRuleDto();


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
        onDropdownChange,
        onTabChange,
        hideDialog,
        editItem,
        formateDate,
        parseToIsoFormat,
        adaptDate
    } = useEditHook<DocumentCategorieIndexRuleDto, DocumentCategorieIndexRuleCriteria>({ list, selectedItem, onClose, update, showToast, service, t, isFormValid })





    useEffect(() => {

    }, []);







    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={editItem} /> </>
    );



    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorieIndexRule.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorieIndexRule.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("documentCategorieIndexRule.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item ? item.code : ''} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")}).</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("documentCategorieIndexRule.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item ? item.libelle : ''} onChange={(e) => onInputTextChange(e, 'libelle')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="expresion">{t("documentCategorieIndexRule.expresion")}</label>
                            <InputText id="expresion" value={item ? item.expresion : ''} onChange={(e) => onInputTextChange(e, 'expresion')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.expresion })} />
                            {submitted && !item.expresion && <small className="p-invalid p-error font-bold">Expresion Obligatoire.</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="description">{t("documentCategorieIndexRule.description")}</label>
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


