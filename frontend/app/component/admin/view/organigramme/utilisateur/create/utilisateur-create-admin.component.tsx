import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { RoleDto } from "app/zynerator/dto/RoleDto.model";
import RoleService from "app/zynerator/service/RoleService";

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { GenderDto } from 'app/controller/model/Gender.model';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { GenderAdminService } from 'app/controller/service/admin/GenderAdminService.service';
import { TFunction } from "i18next";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";


type UtilisateurCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: UtilisateurDto[],
    service: UtilisateurAdminService,
    t: TFunction
}
const Create: React.FC<UtilisateurCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.email == '')
            errorMessages.push("email Obligatoire")
        if (item.nom == '')
            errorMessages.push("nom Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new UtilisateurDto();
    const {
        item,
        setItem,
        submitted,
        activeIndex,
        onInputTextChange,
        onInputDateChange,
        onMultiSelectChange,
        onTabChange,
        onDropdownChange,
        hideDialog,
        saveItem,
    } = useCreateHook<UtilisateurDto, UtilisateurCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })
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
        setItem({ ...item, username:"", password:"" });
    }, []);

    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );

    const onRoleChange = (e: DropdownChangeEvent) => {
        setItem({ ...item, roles: [e.value] });
    };

    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '85vw' }} header={t("utilisateur.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
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
                            <Calendar inputId='dateNaissance' id="dateNaissanceCalendar" value={item.dateNaissance} onChange={(e) => onInputDateChange(e, 'dateNaissance')} dateFormat="dd/mm/yy" showIcon={true} />
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
                            <Dropdown inputId='gender' id="genderDropdown" value={item.gender} options={genders} onChange={(e) => onDropdownChange(e, 'gender')} placeholder={t("utilisateur.genderPlaceHolder")} filter filterPlaceholder={t("utilisateur.genderPlaceHolderFilter")} optionLabel="libelle" showClear />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">{t("utilisateur.entiteAdministrative")}</label>
                            <Dropdown inputId='entiteAdministrative' id="entiteAdministrativeDropdown" value={item.entiteAdministrative} options={entiteAdministratives} onChange={(e) => onDropdownChange(e, 'entiteAdministrative')} placeholder={t("utilisateur.entiteAdministrativePlaceHolder")} filter filterPlaceholder={t("utilisateur.entiteAdministrative")} optionLabel="libelle" showClear />
                        </div>
                        <div className="form-separator col-12"></div>
                        <div className="form-separator col-12"></div>
                        <div className="field col-4">
                            <label htmlFor="username">{t("utilisateur.username")} <b className="font-italic"> ({t("document.uniqueFields")})</b></label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText id="username" value={item.username} onChange={(e) => onInputTextChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !item.username })} autoComplete="off" />
                            </span>
                            {submitted && !item.username && <small className="p-invalid p-error font-bold">Username Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="password">{t("utilisateur.password")}</label>
                            <Password inputId='password' id="passwordField" value={item.password} onChange={(e) => onInputTextChange(e, 'password')} required className={classNames({ 'p-invalid': submitted && !item.password })} autoComplete="off" />
                            {submitted && !item.password && <small className="p-invalid p-error font-bold">Password Obligatoire.</small>}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="roles">{t("utilisateur.roles")}</label>
                            <Dropdown showClear inputId='roles' id="documentTypeDropdown" value={item.roles && item.roles.length > 0 ? item.roles[0] : null}
                                options={roles} onChange={(e) => onRoleChange(e)}
                                placeholder="Droit d'access" filter
                            />
                        </div>
                        <div className="field col-12 mb-5 mt-5 font-italic">
                            <span className="">
                                <b>Important à retenir :</b> Une fois qu'un utilisateur a été créé,
                                il a la possibilité de se connecter en utilisant l'identifiant
                                qui lui a été fourni ainsi que le mot de passe. Nous recommandons vivement qu'il procède ensuite
                                à la modification de son mot de passe dans son profil dès sa première connexion.
                            </span>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Create;
