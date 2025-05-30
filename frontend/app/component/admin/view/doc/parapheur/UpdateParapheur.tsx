import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TFunction } from "i18next";
import { Dialog } from "primereact/dialog";
import { MessageService } from "app/zynerator/service/MessageService";
import { Toast } from "primereact/toast";
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";
import { MultiSelect } from "primereact/multiselect";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import useUtilisateurStore from "Stores/Users/UtilsateursStore";

type Props = {
    disabled: boolean;
    t: TFunction;
    selectedParapheur: any;
    refetchParapheur: () => void;
    showToast: React.Ref<Toast>,

}

const UpdateParapheur = ({ disabled,t, selectedParapheur, refetchParapheur,showToast }: Props) => {

    const [showDialog, setShowDialog] = useState(false); 
    const [titre, setTitre] = useState('');
    const [action, setAction] = useState({});
    const [intervenants, setIntervenants] = useState<UtilisateurDto[]>([]);
    const utilisateurs = useUtilisateurStore(state => state.utilisateurs);

    const actions=[
        { label: 'En Attente', value: 'en_attente' },
        { label: 'En cours', value: 'en_cours' },
        { label: 'Rejete', value: 'rejete' },
        { label: 'Termine', value: 'termine' }
    ]
    useEffect(() => {
        setIntervenants(selectedParapheur?.utilisateurDtos);
    }, [selectedParapheur])

        const submitUpdate = () => {
            selectedParapheur.title=titre;
            selectedParapheur.parapheurEtat=action;
            selectedParapheur.utilisateurDtos=intervenants;
            parapheurService.updatePrapheur(selectedParapheur.id,selectedParapheur).then( (res) => {
            MessageService.showSuccess(showToast, t('success.success'), t("success.operation"));
            refetchParapheur();
            setShowDialog(false);
                if(intervenants.length>0){
                    
                }
            }).catch((err) => {
                MessageService.showError(showToast, t('error.error'), t("error.operation"));
            });
        }
    return (
        <>
            <Button className='mr-2 hover:bg-blue-700' disabled={disabled} label={t("Modifier")} onClick={() =>{
                setShowDialog(true);
                setTitre(selectedParapheur.title);
                setAction(selectedParapheur.parapheurEtat)       
            }}/>
            <Dialog
                header={t("Modifier Parapheur")}
                style={{  width: '40vw'}}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                footer={
                    <div className="flex flex-row justify-content-end">
                        <Button className="hover:bg-red-700" label={t("Annuler")} onClick={() => setShowDialog(false)} />
                        <Button className="hover:bg-blue-700" type="submit" label={t("Enregistrer")} onClick={submitUpdate} />
                    </div>
                }
            >
                <div className="flex flex-column gap-3 mr-3">
                   
                      
                            <label >{t("Titre")}</label>
                            <InputText
                                id="sujet"
                                name="title"
                               value={titre}
                               onChange={(e) => { setTitre(e.target.value) }}
                            />
                        
                            <label htmlFor="etat">{t("Etat")}</label>
                            <Dropdown
                                id="etat"
                                name="action"
                                optionLabel="label"
                                options={actions}  
                                value={action}                               
                                onChange={(e) => { setAction(e.target.value) }}
                                placeholder={t("Etat")}                                
                                filter
                            />

                            <label htmlFor="intervenants">{t("bo.intervenants")}</label>
                            <MultiSelect
                                id="utilisateurs"
                                value={intervenants}
                                options={utilisateurs}
                                placeholder={t("selectionner des utilisateurs")}
                                onChange={(e) => setIntervenants(e.value)}
                                filter
                                display="chip"
                                optionLabel="nom"
                                multiple
                             />
                </div>
            </Dialog>
        </>
    );
}

export default UpdateParapheur;