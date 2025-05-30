import { MessageService } from 'app/zynerator/service/MessageService';
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitchChangeEvent } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

import { GroupeCriteria } from "app/controller/criteria/GroupeCriteria.model";
import { GroupeDto } from 'app/controller/model/Groupe.model';
import { GroupeAdminService } from 'app/controller/service/admin/GroupeAdminService.service';

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { EtatUtilisateurDto } from 'app/controller/model/EtatUtilisateur.model';
import { GroupeUtilisateurDto } from 'app/controller/model/GroupeUtilisateur.model';
import { RoleUtilisateurDto } from 'app/controller/model/RoleUtilisateur.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { EtatUtilisateurAdminService } from 'app/controller/service/admin/EtatUtilisateurAdminService.service';
import { GroupeUtilisateurAdminService } from 'app/controller/service/admin/GroupeUtilisateurAdminService.service';
import { RoleUtilisateurAdminService } from 'app/controller/service/admin/RoleUtilisateurAdminService.service';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";



type GroupeCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: GroupeDto[],
    service: GroupeAdminService,
    t: TFunction
}
const Create: React.FC<GroupeCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.code == '')
            errorMessages.push("code Obligatoire")
        if (item.libelle == '')
            errorMessages.push("libelle Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new GroupeDto();
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
    } = useCreateHook<GroupeDto, GroupeCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
    const [etatUtilisateurs, setEtatUtilisateurs] = useState<EtatUtilisateurDto[]>([]);
    const [roleUtilisateurs, setRoleUtilisateurs] = useState<RoleUtilisateurDto[]>([]);

    const [groupeUtilisateurs, setGroupeUtilisateurs] = useState<GroupeUtilisateurDto>(new GroupeUtilisateurDto());

    const roleUtilisateurAdminService = new RoleUtilisateurAdminService();
    const groupeUtilisateurAdminService = new GroupeUtilisateurAdminService();
    const utilisateurAdminService = new UtilisateurAdminService();
    const etatUtilisateurAdminService = new EtatUtilisateurAdminService();

    useEffect(() => {
        utilisateurAdminService.getList().then(({ data }) => setUtilisateurs(data)).catch(error => console.log(error));
        utilisateurAdminService.getList().then(({ data }) => setUtilisateurs(data)).catch(error => console.log(error));
        etatUtilisateurAdminService.getList().then(({ data }) => setEtatUtilisateurs(data)).catch(error => console.log(error));
        roleUtilisateurAdminService.getList().then(({ data }) => setRoleUtilisateurs(data)).catch(error => console.log(error));
    }, []);

    const addGroupeUtilisateurs = () => {
        setSubmitted(true);
        if (item.groupeUtilisateurs == null)
            item.groupeUtilisateurs = new Array<GroupeUtilisateurDto>();
        let _item = groupeUtilisateurs;
        if (!_item.id) {
            item.groupeUtilisateurs.push(_item);
            setItem((prevState: any) => ({ ...prevState, groupeUtilisateurs: item.groupeUtilisateurs }));
        } else {
            const updatedItems = item.groupeUtilisateurs.map((item) => item.id === groupeUtilisateurs.id ? { ...groupeUtilisateurs } : item);
            setItem((prevState: any) => ({ ...prevState, groupeUtilisateurs: updatedItems }));
        }
        setGroupeUtilisateurs(new GroupeUtilisateurDto());
    };

    const deleteGroupeUtilisateurs = (rowData: any) => {
        const updatedItems = item.groupeUtilisateurs.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, groupeUtilisateurs: updatedItems }));
        setGroupeUtilisateurs(new GroupeUtilisateurDto());
    };

    const onDropdownChangeGroupeUtilisateurs = (e: any, field: string) => {
        setGroupeUtilisateurs((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onBooleanInputChangeGroupeUtilisateurs = (e: InputSwitchChangeEvent, name: string) => {
        const val = e.value;
        setGroupeUtilisateurs((prevItem) => ({ ...prevItem, [name]: val, }));
    };

    const onInputDateChangeGroupeUtilisateurs = (e: CalendarChangeEvent, name: string) => {
        const val = e.value || '';
        setGroupeUtilisateurs({ ...groupeUtilisateurs, [name]: val })
    };

    const onInputTextChangeGroupeUtilisateurs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setGroupeUtilisateurs({ ...groupeUtilisateurs, [name]: val })
    };




    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );

    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("groupe.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("groupe.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("groupe.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item.code} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")}).</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("groupe.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item.libelle} onChange={(e) => onInputTextChange(e, 'libelle')} required className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="utilisateur">{t("groupe.utilisateur")}</label>
                            <Dropdown inputId='utilisateur' id="utilisateurDropdown" value={item.utilisateur} options={utilisateurs} onChange={(e) => onDropdownChange(e, 'utilisateur')} placeholder={t("groupe.utilisateurPlaceHolder")} filter filterPlaceholder={t("groupe.utilisateurPlaceHolderFilter")} optionLabel="nom" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header={t("groupe.groupeUtilisateurs")}>
                    <div className="grid">
                        <div className="field col-4">
                            <label htmlFor="utilisateur">{t("groupeUtilisateur.utilisateur")}</label>
                            <Dropdown id="utilisateurDropdown" value={groupeUtilisateurs.utilisateur} options={utilisateurs} onChange={(e) => onDropdownChangeGroupeUtilisateurs(e, 'utilisateur')} placeholder={t("groupeUtilisateur.utilisateurPlaceHolder")} filter filterPlaceholder={t("groupeUtilisateur.utilisateurPlaceHolderFilter")} optionLabel="nom" />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="etatUtilisateur">{t("groupeUtilisateur.etatUtilisateur")}</label>
                            <Dropdown id="etatUtilisateurDropdown" value={groupeUtilisateurs.etatUtilisateur} options={etatUtilisateurs} onChange={(e) => onDropdownChangeGroupeUtilisateurs(e, 'etatUtilisateur')} placeholder={t("groupeUtilisateur.etatUtilisateurPlaceHolder")} filter filterPlaceholder={t("groupeUtilisateur.etatUtilisateurPlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="roleUtilisateur">{t("groupeUtilisateur.roleUtilisateur")}</label>
                            <Dropdown id="roleUtilisateurDropdown" value={groupeUtilisateurs.roleUtilisateur} options={roleUtilisateurs} onChange={(e) => onDropdownChangeGroupeUtilisateurs(e, 'roleUtilisateur')} placeholder={t("groupeUtilisateur.roleUtilisateurPlaceHolder")} filter filterPlaceholder={t("groupeUtilisateur.roleUtilisateurPlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="dateAjout">{t("groupeUtilisateur.dateAjout")}</label>
                            <Calendar id="dateAjout" value={groupeUtilisateurs.dateAjout} onChange={(e) => onInputDateChangeGroupeUtilisateurs(e, 'dateAjout')} dateFormat="dd/mm/yy" showIcon={true} disabled />
                        </div>
                        <div className="field col-2 mt-1">
                            <Button raised icon="pi pi-plus" label={t("save")} className="mt-4" onClick={addGroupeUtilisateurs} />
                        </div>
                    </div>
                    <div className="card">
                        <DataTable value={item.groupeUtilisateurs} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                            <Column field="utilisateur.nom" header={t("groupeUtilisateur.utilisateur")}></Column>
                            <Column field="dateAjout" header={t("groupeUtilisateur.dateAjout")} body={formateDate("dateAjout")}></Column>
                            <Column field="etatUtilisateur.libelle" header={t("groupeUtilisateur.etatUtilisateur")}></Column>
                            <Column field="roleUtilisateur.libelle" header={t("groupeUtilisateur.roleUtilisateur")}></Column>
                            <Column header={t("actions")} body={(rowData) => (
                                <div>
                                    <Button raised icon="pi pi-times" severity="warning" className="mr-2 p-button-danger" onClick={() => deleteGroupeUtilisateurs(rowData)} />
                                    {/* <Button raised  icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editGroupeUtilisateurs(rowData)} /> */}
                                </div>)}>
                            </Column>
                        </DataTable>
                    </div>
                    {/* <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                        <TabPanel header={t("creation")}>
                        </TabPanel>
                        <TabPanel header={t("list")}>
                        </TabPanel>
                    </TabView> */}
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Create;
