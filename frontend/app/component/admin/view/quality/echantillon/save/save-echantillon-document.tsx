import axiosInstance from 'app/axiosInterceptor';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
type SeverityType = 'success' | 'info' | 'warn' | 'error';

type DocumentSaveEchantillonAdminType = {
  list: DocumentDto[];
  onClose: () => void;
  selectedItems: DocumentDto[];
  service: DocumentAdminService;
  showToast: React.Ref<Toast>;
  t: TFunction;
  update: (item: DocumentDto) => void;
  visible: boolean;
};
const Save :React.FC<DocumentSaveEchantillonAdminType> = ({
  list,
  onClose,
  selectedItems,
  service,
  showToast,
  t,
  update,
  visible,
}) => {
  const [nomEchantillon,setNomEchantillon] = useState('');
  const toastRef = useRef<Toast>(null);
  const showToasts = (severity: SeverityType, summary: string) => {
    if (toastRef.current) {
        toastRef.current.show({ severity, summary, life: 4000 });
    }
  };
  const isFormValid = () => {
    let errorMessages = new Array<string>();
    if (nomEchantillon == ''){
      showToasts("error", "Le Nom l'échantillon est Obligatoire");
        errorMessages.push("Nom Obligatoire")
    }
      
    return errorMessages.length == 0;
  }

  const hideDialog = () => {
    onClose();
};
  // const handleSaves = () => {
  //   if (isFormValid()) {
  //     console.log('save echantillon',list)

  //   }
  // }
  const handleSave = async () => {
    if (isFormValid()) {
      const requestBody = {
        nomEchantillon: nomEchantillon,
        documents: list 
      };
      axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/create/Echantillon`, requestBody)
      .then((response)=> {
        showToasts("success","Echantillon créé avec succès");
        onClose();
      })
      .catch(error => {
        console.error('Erreur lors de la création de l\'échantillon:', error);
        showToasts("error","Erreur lors de la création de l'échantillon");
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
            header={t("document.tabPan")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={hideDialog}
        >
            <TabView>
                <TabPanel header={t("document.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-8">
                            <label htmlFor="planClassement">
                              {t("echantillon.name")}
                            </label>
                            <InputText className="p-inputtext" id="1" value={nomEchantillon} placeholder={t("echantillon.name")}
                                onChange={(e) => setNomEchantillon(e.target.value)} />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
            <Toast ref={toastRef} />
        </Dialog>
  )
}

export default Save