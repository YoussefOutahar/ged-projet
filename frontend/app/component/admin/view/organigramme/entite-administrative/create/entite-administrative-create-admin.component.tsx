import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

import { EntiteAdministrativeCriteria } from "app/controller/criteria/EntiteAdministrativeCriteria.model";
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { EntiteAdministrativeTypeDto } from 'app/controller/model/EntiteAdministrativeType.model';
import { GenderDto } from 'app/controller/model/Gender.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { EntiteAdministrativeTypeAdminService } from 'app/controller/service/admin/EntiteAdministrativeTypeAdminService.service';
import { GenderAdminService } from 'app/controller/service/admin/GenderAdminService.service';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
type EntiteAdministrativeCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: EntiteAdministrativeDto[],
    service: EntiteAdministrativeAdminService,
    t: TFunction
}
const Create: React.FC<EntiteAdministrativeCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {

    const isFormValid = () => {
        let errorMessages = new Array<string>();

        if (item.code == '') {
            errorMessages.push("code Obligatoire")
        }
        if (item.libelle == '') {
            errorMessages.push("libelle Obligatoire")
        }

        return errorMessages.length == 0;
    }
    const [archiveLawDuration, setArchiveLawDuration] = useState<Date | null>(null);
    const onDurationChange = (value: Date) => {
        setArchiveLawDuration(value);
    };
    const emptyItem = new EntiteAdministrativeDto();
    const {
        item,
        submitted,
        activeIndex,
        onInputTextChange,
        onInputNumerChange,
        onTabChange,
        onDropdownChange,
        hideDialog,
        saveItem } = useCreateHook<EntiteAdministrativeDto, EntiteAdministrativeCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [entiteAdministrativeTypes, setEntiteAdministrativeTypes] = useState<EntiteAdministrativeTypeDto[]>([]);
    //const [genders, setGenders] = useState<GenderDto[]>([]);
    const [entiteAdministrativeParents, setEntiteAdministrativeParents] = useState<EntiteAdministrativeDto[]>([]);
    const [chefs, setChefs] = useState<UtilisateurDto[]>([]);

    //const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto>(new UtilisateurDto());

    const utilisateurAdminService = new UtilisateurAdminService();
    const entiteAdministrativeTypeAdminService = new EntiteAdministrativeTypeAdminService();
    //const genderAdminService = new GenderAdminService();

    useEffect(() => {
        service.getList().then(({ data }) => setEntiteAdministrativeParents(data)).catch(error => console.log(error));
        utilisateurAdminService.getList().then(({ data }) => setChefs(data)).catch(error => console.log(error));
        entiteAdministrativeTypeAdminService.getList().then(({ data }) => setEntiteAdministrativeTypes(data)).catch(error => console.log(error));
        //genderAdminService.getList().then(({ data }) => setGenders(data)).catch(error => console.log(error));
    }, []);

    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );
    const [newDate, setNewDate] = useState<Date>(new Date());
    const onDateDurationChange = () => {
        const newDate = new Date();
        newDate.setFullYear(newDate.getFullYear() + item.archiveLawDuration!)
        setNewDate(newDate);
    };
    useEffect(() => {
        onDateDurationChange();
    }, [item.archiveLawDuration]);


    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '90vw' }} header={t("entiteAdministrative.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("entiteAdministrative.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="code">{t("entiteAdministrative.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item.code} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="libelle">{t("entiteAdministrative.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item.libelle} onChange={(e) => onInputTextChange(e, 'libelle')} required className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrativeType">{t("entiteAdministrative.entiteAdministrativeType")}</label>
                            <Dropdown inputId='entiteAdministrativeType' id="entiteAdministrativeTypeDropdown" value={item.entiteAdministrativeType} options={entiteAdministrativeTypes} onChange={(e) => onDropdownChange(e, 'entiteAdministrativeType')} placeholder={t("entiteAdministrative.entiteAdministrativeTypePlaceHolder")} filter filterPlaceholder={t("entiteAdministrative.entiteAdministrativeTypePlaceHolderFilter")} optionLabel="libelle" showClear />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrativeParent">{t("entiteAdministrative.entiteAdministrativeParent")}</label>
                            <Dropdown inputId='entiteAdministrativeParent' id="entiteAdministrativeParentDropdown" value={item.entiteAdministrativeParent} options={entiteAdministrativeParents} onChange={(e) => onDropdownChange(e, 'entiteAdministrativeParent')} placeholder={t("entiteAdministrative.entiteAdministrativeParentPlaceHolder")} filter filterPlaceholder={t("entiteAdministrative.entiteAdministrativeParentPlaceHolderFilter")} optionLabel="libelle" showClear />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="chef">{t("entiteAdministrative.chef")}</label>
                            <Dropdown inputId='chef' id="chefDropdown" value={item.chef} options={chefs} onChange={(e) => onDropdownChange(e, 'chef')} placeholder={t("entiteAdministrative.chefPlaceHolder")} filter filterPlaceholder={t("entiteAdministrative.chefPlaceHolderFilter")} optionLabel="nom" showClear />
                        </div>
                        <div className="field col-4">
                                <label htmlFor="duration">Durée du loi d'archive</label>
                                <div className="p-inputgroup">
                                    <InputNumber inputId='duration' id="archiveLawDuration" value={item.archiveLawDuration} onChange={(e) => onInputNumerChange(e,"archiveLawDuration")} placeholder={t("entiteAdministrative.numberYears")} />
                                    <Calendar value={newDate} onChange= {(e) => onDateDurationChange( )} showIcon={true} placeholder="Date d'archivage Final"/>
                                </div>
                        </div>;
                        <div className="field col-6">
                            <label htmlFor="description">{t("entiteAdministrative.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={item.description} onChange={(e) => onInputTextChange(e, 'description')} rows={5} cols={30} />
                            </span>
                        </div>
                        <div className="field col-12 mt-5 mb-5 font-italic">
                            <span className="p-float-label">
                                <b>{t("document.NoteImportant")} : </b>{t("document.NoteMessage")} 
                            </span>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Create;

