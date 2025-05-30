import axiosInstance from 'app/axiosInterceptor';
import { DocumentDto } from 'app/controller/model/Document.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { parapheurService } from 'app/controller/service/parapheur/parapheurService.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import React, { useState } from 'react'
import useUtilisateurStore from 'Stores/Users/UtilsateursStore';

type DocumentSaveParapheur = {
  onClose: () => void;
  selectedItems: DocumentDto[];
  showToast: React.Ref<Toast>;
  t: TFunction;
  update: (item: DocumentDto) => void;
  visible: boolean;
};

const SaveParapheur :React.FC<DocumentSaveParapheur> = ({
  onClose,
  selectedItems,
  showToast,
  t,
  update,
  visible,
}) => {
  const [title,setTitle] = useState('');
  const [intervenants, setIntervenants] = useState<UtilisateurDto[]>([]);
  const utilisateurs = useUtilisateurStore(state => state.utilisateurs);
  const [addUsers, setAddUsers] = useState<boolean>(false);

  const isFormValid = () => {
    let errorMessages = new Array<string>();
    if (title == '')
        errorMessages.push("Nom Obligatoire")
    return errorMessages.length == 0;
  }

  const hideDialog = () => {
    onClose();
};
 
  const handleSave = async () => {
    if (isFormValid()) {
      await parapheurService.createParapheur(selectedItems,title,intervenants)
      .then((response)=> {
        //const isDTOList = requestBody.every(item => item instanceof DocumentDto);
        if (response.status === 226)
        {
          MessageService.showError(showToast, "Error!", "verifier les documents selectionnès");
        }
        else if(response.status === 201){
          MessageService.showSuccess(showToast, "Mise à jour!", "parapheur créé avec succès");
          onClose();
        }
       
      })
      .catch(error => {
        
        console.error('Erreur lors de la création du parapheur:', error);
        MessageService.showError(showToast, "Error!", "Erreur lors de la création du parapheur");
      });   
    }
  };
  const itemDialogFooter = (
    <>
        <Button raised
            label={t("cancel")}
            icon="pi pi-times"
            text
            onClick={hideDialog}
        />
        <Button raised label={t("save")} icon="pi pi-check" onClick={handleSave} />{" "}
    </>
);
  return (
    <Dialog
            visible={visible}
            maximizable
            style={{ width: "50vw" }}
            header={t("parapheur.title")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={hideDialog}
        >
            <TabView>
                <TabPanel header={t("parapheur.title")}>
                    <div className="formgrid grid">
                        <div className="field col-6 mt-2">
                            <label htmlFor="planClassement">
                              {t("parapheur.name")}
                            </label>
                            <InputText className="p-inputtext mt-1" id="1" value={title} placeholder={t("parapheur.name")}
                                onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="intervenants">{t("bo.intervenants")}</label>
                            <InputSwitch id="addUSers" checked={addUsers} onChange={(e) => setAddUsers(!addUsers)} className="ml-3" />
                            <MultiSelect
                                id="utilisateurs"
                                value={intervenants}
                                options={utilisateurs}
                                placeholder={t("selectionner des utilisateurs")}
                                onChange={(e) => setIntervenants(e.value)}
                                filter
                                optionLabel="nom"
                                multiple
                                disabled={!addUsers}
                             />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
  )
}

export default SaveParapheur