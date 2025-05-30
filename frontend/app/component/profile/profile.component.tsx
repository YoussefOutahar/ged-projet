import axiosInstance from "app/axiosInterceptor";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { GenderDto } from "app/controller/model/Gender.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { GenderAdminService } from "app/controller/service/admin/GenderAdminService.service";
import { UtilisateurAdminService } from "app/controller/service/admin/UtilisateurAdminService.service";
import { AuthService } from "app/zynerator/security/Auth.service";
import { MessageService } from "app/zynerator/service/MessageService";
import router, { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import ProfileCard from "./profile-card";
import SignatureCanvas from "./signature";
import FaceRegister from "./face-register";
import LicenceCard from "./licence-card";
import UserCertifications, { UserCertificationsRef } from "./UserCertifications";


const Profile = () => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
    const [genders, setGenders] = useState<GenderDto[]>([]);
    const [displayDialog, setDisplayDialog] = useState(true);
    const utilisateurCriteria = new UtilisateurCriteria();
    const authService = new AuthService();
    const utilisateurService = new UtilisateurAdminService();
    const genderAdminService = new GenderAdminService();


    const router = useRouter();

    const showToast = useRef(null);

    const onDropdownChange = (e: DropdownChangeEvent, field: string) => {
        setConnectedUser((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const handlePwdChange = () => {
        utilisateurService.changePassword(connectedUser.username, password).then(() =>
            MessageService.showSuccess(showToast, "Mise à jour !", 'Opération faite avec succes.'))
            .catch(() => MessageService.showError(showToast, "Erreur!", "Une erreur s'est produite, veuillez réessayer ultérieurement."))
    }

    const signOut = async () => {
        try {
            await axiosInstance.put(`${process.env.NEXT_PUBLIC_CONNEXION_URL}update-status/${connectedUser.username}`);
            authService.signOut();
            router.push("/");
        } catch (error) {
            console.error('Error updating connexion status:', error);
        }
    }

    const handleUpdateInfosClick = () => {
        utilisateurService.update(connectedUser).then(({ data }) => console.log(data));
        MessageService.showSuccess(showToast, "Mise à jour !", 'Opération faite avec succes.');
    }

    const onInputTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const value = (e.target && e.target.value) || '';
        setConnectedUser({ ...connectedUser, [name]: value });
    };

    useEffect(() => {
        genderAdminService.getList().then(({ data }) => setGenders(data)).catch(error => console.log(error));

        const connectedUserName = authService.getUsername();
        utilisateurCriteria.username = connectedUserName;

        utilisateurService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
            const user = data?.list[0];
            setConnectedUser(user);
        });
    }, []);

    const certificationsRef = useRef<UserCertificationsRef>(null);

    const handleSignatureUpdate = () => {
        certificationsRef.current?.refetchCertificate();
    };

    //console.log({ connectedUser })
    const dialogFooter = (
        <div>
            <Button label="OK" icon="pi pi-check" onClick={() => setDisplayDialog(false)} autoFocus style={{ position: 'relative', right: '8cm' }} />
        </div>
    );
    return (
        <div className="flex flex-column">
            {connectedUser.passwordChanged === false && (<div><Dialog header="Important à retenir" visible={displayDialog} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => setDisplayDialog(false)}>
                <p style={{ color: "#AC3B61" }}><b>Votre sécurité est importante ! Nous vous recommandons vivement de changer votre mot de passe par <br></br>défaut pour protéger votre compte. Merci pour votre coopération. ?</b></p>
            </Dialog></div>)}
            <div className="flex flex-column align-self-center mb-6">
                <ProfileCard user={connectedUser} />
            </div>
            <div className="card p-fluid">
                <div className="field col-12 pl-5">
                    <h5>Données personnelles</h5>
                </div>
                <div className="formgrid grid col-12 pl-4">
                    <div className="field col-4">
                        <label htmlFor="username" className="col-12">
                            Username
                        </label>
                        <div className="col-12">
                            <InputText id="username" value={connectedUser.username} onChange={(e) => onInputTextChange(e, 'username')} disabled />
                        </div>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="nom" className="col-12">
                            Nom
                        </label>
                        <div className="col-12">
                            <InputText id="nom" value={connectedUser.nom} onChange={(e) => onInputTextChange(e, 'nom')} disabled />
                        </div>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="prenom" className="col-12">
                            Prénom
                        </label>
                        <div className="col-12">
                            <InputText id="prenom" value={connectedUser.prenom} onChange={(e) => onInputTextChange(e, 'prenom')} disabled />
                        </div>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="email" className="col-12">
                            Email
                        </label>
                        <div className="col-12">
                            <InputText id="email" value={connectedUser.email} onChange={(e) => onInputTextChange(e, 'email')} />
                        </div>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="tel" className="col-12">
                            Télephone
                        </label>
                        <div className="col-12">
                            <InputText id="tel" value={connectedUser.telephone} onChange={(e) => onInputTextChange(e, 'telephone')} />
                        </div>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="genderDropdown">{t("utilisateur.gender")}</label>
                        <Dropdown id="gender" inputId="genderDropdown" value={connectedUser.gender} options={genders} onChange={(e) => onDropdownChange(e, 'gender')} placeholder={t("utilisateur.genderPlaceHolder")} filter filterPlaceholder={t("utilisateur.genderPlaceHolderFilter")} optionLabel="libelle" showClear />
                    </div>

                    <div className="field col-4 justify-content-end">
                        <div className="field col-12" style={{ marginTop: '7px' }}>
                            <br />
                            <Button raised severity="info" label="Enregistrer" onClick={handleUpdateInfosClick} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="card p-fluid">
                <div className="field col-12 pl-5">
                    <h5>Mot de passe</h5>
                </div>
                <div className="formgrid grid col-12 pl-4">
                    <div className="field col-4">
                        <label htmlFor="new_password" className="col-12">
                            Nouveau Mot de passe
                        </label>
                        <div className="col-12">
                            <Password inputId="new_password" value={password} onChange={(event) => setPassword(event.target.value)} toggleMask />
                        </div>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="confirm_password" className="col-12">
                            Confirmer votre Mot de passe
                        </label>
                        <div className="col-12">
                            <Password inputId="confirm_password" value={confirmPwd} onChange={(event) => setConfirmPwd(event.target.value)} toggleMask />
                        </div>
                    </div>
                    <div className="field col-3">
                        <div className="field col-12" style={{ marginTop: '7px' }}>
                            <br />
                            <Button raised severity="info" label="Changer Mot de passe" onClick={() => {
                                handlePwdChange();
                                signOut();
                            }}
                                disabled={password == "" || confirmPwd == "" || password != confirmPwd} />
                        </div>
                    </div>
                    <div className="field col-12 mb-5 mt-1 font-italic">
                        {connectedUser.passwordChanged === false && <span className="" style={{ color: "#AC3B61" }}>
                            <b style={{ color: "#123C69" }}> Important à retenir :</b> <b> Votre sécurité est importante ! Nous vous recommandons vivement
                                de changer votre mot de passe par défaut pour protéger votre compte. Merci pour votre coopération.</b>

                        </span>}
                    </div>
                </div>
            </div>
            <div className="card p-fluid">
                <div className="field col-12 pl-5">
                    <h5>Signature and Certifications</h5>
                </div>
                <div className="grid">
                    <div className="col-6">
                        <div className="card">
                            <h6>Signature</h6>
                            <SignatureCanvas onSignatureUpdate={handleSignatureUpdate} />
                        </div>
                    </div>
                    <div className="col-6" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h6>Certifications</h6>
                            <UserCertifications ref={certificationsRef} />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                <Button
                    icon="pi pi-id-card"
                    raised
                    style={{ border: 'none' }}
                    className="m-1 mb-3 p-3 text-large hover:bg-green-600"
                    onClick={() => router.push("/face-registration")}
                />
            </div>  */}
            {/* <div className="card flex flex-column justify-content-center align-items-center">
                <div className="field col-12 pl-4">
                    <h5>Face Auth</h5>
                </div>
                <div className="field col-6">
                    <FaceRegister />
                </div>
            </div> */}
            {/* <div className="card flex flex-column">
                <div className="field col-12">
                    <h5>Yandoc Licence</h5>
                </div>
                <div className="field col-6">
                    <LicenceCard/>
                </div>
            </div> */}
            <Toast ref={showToast} />
        </div>
    );
};

export default Profile;