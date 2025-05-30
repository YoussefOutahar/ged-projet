import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { RoleDto } from "app/zynerator/dto/RoleDto.model";
import RoleService from "app/zynerator/service/RoleService";
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

import useEditHook from "app/component/zyhook/useEdit.hook";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { GenderDto } from 'app/controller/model/Gender.model';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { GenderAdminService } from 'app/controller/service/admin/GenderAdminService.service';


type UtilisateurEditAdminType = {
    visible: boolean,
    onClose: () => void,
    showToast: React.Ref<Toast>,
    selectedItem: UtilisateurDto
    update: (item: UtilisateurDto) => void,
    list: UtilisateurDto[],
    service: UtilisateurAdminService,
    t: TFunction
}

const Edit: React.FC<UtilisateurEditAdminType> = ({ visible, onClose, showToast, selectedItem, update, list, service, t }) => {

    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.email == '')
            errorMessages.push("email Obligatoire")
        if (item.nom == '')
            errorMessages.push("nom Obligatoire")
        return errorMessages.length == 0;
    }
    
    const {
        item,
        submitted,
        activeIndex,
        onInputTextChange,
        onInputDateChange,
        onMultiSelectChange,
        onBooleanInputChange,
        onDropdownChange,
        onTabChange,
        hideDialog,
        editItem,
        adaptDate
    } = useEditHook<UtilisateurDto, UtilisateurCriteria>({ list, selectedItem, onClose, update, showToast, service, t, isFormValid })

    const [roles, setRoles] = useState<RoleDto[]>([]);
    const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    const [genders, setGenders] = useState<GenderDto[]>([]);

    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    const genderAdminService = new GenderAdminService();
    const roleService = new RoleService();


    useEffect(() => {
        genderAdminService.getList().then(({ data }) => setGenders(data)).catch(error => console.log(error));
        entiteAdministrativeAdminService.getList().then(({ data }) => setEntiteAdministratives(data)).catch(error => console.log(error));
        roleService.getList().then(({ data }) => setRoles(data)).catch(error => console.log(error));
    }, []);
    
    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={editItem} /> </>
    );

    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '85vw' }} header={t("utilisateur.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
            <Toast ref={showToast} />
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("utilisateur.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="email">{t("utilisateur.email")}</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-at" />
                                <InputText id="email" value={item.email} onChange={(e) => onInputTextChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !item.email })} />
                            </span>
                            {submitted && !item.email && <small className="p-invalid p-error font-bold">Email Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="nom">{t("utilisateur.nom")}</label>
                            <InputText id="nom" value={item.nom} onChange={(e) => onInputTextChange(e, 'nom')} required className={classNames({ 'p-invalid': submitted && !item.nom })} />
                            {submitted && !item.nom && <small className="p-invalid p-error font-bold">Nom Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="prenom">{t("utilisateur.prenom")}</label>
                            <InputText id="prenom" value={item.prenom} onChange={(e) => onInputTextChange(e, 'prenom')} required className={classNames({ 'p-invalid': submitted && !item.prenom })} />
                            {submitted && !item.prenom && <small className="p-invalid p-error font-bold">Prenom Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="dateNaissance">{t("utilisateur.dateNaissance")}</label>
                            <Calendar id="dateNaissance" value={adaptDate(item.dateNaissance)} onChange={(e) => onInputDateChange(e, 'dateNaissance')} dateFormat="dd/mm/yy" showIcon={true} />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="telephone">{t("utilisateur.telephone")}</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-phone" />
                                <InputText id="telephone" value={item.telephone} onChange={(e) => onInputTextChange(e, 'telephone')} required className={classNames({ 'p-invalid': submitted && !item.telephone })} />
                            </span>
                            {submitted && !item.telephone && <small className="p-invalid p-error font-bold">Telephone Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="gender">{t("utilisateur.gender")}</label>
                            <Dropdown id="genderDropdown" value={item.gender} options={genders} onChange={(e) => onDropdownChange(e, 'gender')} placeholder={t("utilisateur.genderPlaceHolder")} filter filterPlaceholder={t("utilisateur.genderPlaceHolderFilter")} optionLabel="libelle" showClear />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">{t("utilisateur.entiteAdministrative")}</label>
                            <Dropdown id="entiteAdministrativeDropdown" value={item.entiteAdministrative} options={entiteAdministratives} onChange={(e) => onDropdownChange(e, 'entiteAdministrative')} placeholder={t("utilisateur.entiteAdministrativePlaceHolder")} filter filterPlaceholder={t("utilisateur.entiteAdministrativePlaceHolderFilter")} optionLabel="libelle" showClear />
                        </div>

                        <div className="field col-4">
                            <label htmlFor="username">{t("utilisateur.username")}</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText id="username" value={item.username} onChange={(e) => onInputTextChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !item.username })} />
                            </span>
                            {submitted && !item.username && <small className="p-invalid p-error font-bold">Username Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="roles">{t("utilisateur.roles")}</label>
                            <Dropdown showClear id="documentTypeDropdown" value={item?.roles?.[0] ?? ''}
                                options={roles} onChange={(e) => onMultiSelectChange(e, 'roles')}
                                placeholder="Droit d'access" filter
                            />
                        </div>
                        <div className="form-separator col-12"></div>
                        <div className="field col-3">
                            <div className="label-inputswitch">
                                <span className="p-float-label">
                                    <ToggleButton checked={item.enabled} onChange={(e) => onBooleanInputChange(e, 'enabled')} onLabel={t("utilisateur.enabled")} offLabel={t("utilisateur.enabled")} onIcon="pi pi-check" offIcon="pi pi-times"/>
                                </span>
                            </div>
                        </div>
                        <div className="field col-3">
                            <div className="label-inputswitch">
                                <span className="p-float-label">
                                    <ToggleButton checked={item.accountNonExpired} onChange={(e) => onBooleanInputChange(e, 'accountNonExpired')} onLabel={t("utilisateur.accountNonExpired")} offLabel={t("utilisateur.accountNonExpired")} onIcon="pi pi-check" offIcon="pi pi-times"/>
                                </span>
                            </div>
                        </div>
                        <div className="field col-3">
                            <div className="label-inputswitch">
                                <span className="p-float-label">
                                    <ToggleButton checked={item.accountNonLocked} onChange={(e) => onBooleanInputChange(e, 'accountNonLocked')} onLabel={t("utilisateur.accountNonLocked")} offLabel={t("utilisateur.accountNonLocked")} onIcon="pi pi-check" offIcon="pi pi-times"/>
                                </span>
                            </div>
                        </div>
                        <div className="field col-3">
                            <div className="label-inputswitch">
                                <span className="p-float-label">
                                    <ToggleButton checked={item.passwordChanged} onChange={(e) => onBooleanInputChange(e, 'passwordChanged')} onLabel={t("utilisateur.passwordChanged")} offLabel={t("utilisateur.passwordChanged")} onIcon="pi pi-check" offIcon="pi pi-times"/>
                                </span>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Edit;
