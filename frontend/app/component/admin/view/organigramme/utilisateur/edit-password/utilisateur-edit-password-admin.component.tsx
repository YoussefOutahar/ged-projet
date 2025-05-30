import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';

import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

import useEditHook from "app/component/zyhook/useEdit.hook";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { Password } from "primereact/password";


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

const EditPassword: React.FC<UtilisateurEditAdminType> = ({ visible, onClose, showToast, selectedItem, update, list, service, t }) => {
    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (password == '')
            errorMessages.push("password Obligatoire")
        if (confirmPwd == '')
            errorMessages.push("password Obligatoire")
        return errorMessages.length == 0;
    }

    const {
        item,
        submitted,
        setSubmitted,
        activeIndex,
        onTabChange,
        hideDialog } = useEditHook<UtilisateurDto, UtilisateurCriteria>({ list, selectedItem, onClose, update, showToast, service, t, isFormValid });

    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    const handlePwdChange = () => {
        setSubmitted(true)
        if (isFormValid()) {
            if (password == "" || confirmPwd == "") {
                MessageService.showError(showToast, "Erreur!", "Les mots ne pas pas etre vide.")
            }
            else if (password == confirmPwd) {
                service.changePassword(item.username, password)
                MessageService.showSuccess(showToast, "Mise à jour", "Opération faite avec success.")
                onClose();
                setSubmitted(false);
            }
            else if (password != confirmPwd) {
                MessageService.showError(showToast, "Erreur!", "Les mots de passe sont pas identiques.")
            }
        }

    }

    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={handlePwdChange} /> </>
    );

    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '85vw' }} header={t("utilisateur.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
            <Toast ref={showToast} />
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header="Changement de mot de passe">
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="new_password">Nouveau Mot de passe</label>
                            <Password value={password} onChange={(event) => setPassword(event.target.value)} toggleMask />
                            {submitted && !password && <small className="p-invalid p-error font-bold">Mot de passe Obligatoire.</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="new_password">Confirmation du Mot de passe</label>
                            <Password value={confirmPwd} onChange={(event) => setConfirmPwd(event.target.value)} toggleMask />
                            {submitted && !confirmPwd && <small className="p-invalid p-error font-bold">Mot de passe Obligatoire.</small>}
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default EditPassword;
