import { DocumentDto } from 'app/controller/model/Document.model';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import React, { useEffect, useState } from 'react'
import FileViewer from 'app/component/admin/view/doc/document/preview/FileViewer';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';

type CompareDocument = {
  onClose: () => void;
  selectedItems?: DocumentDto[];
  showToast: React.Ref<Toast>;
  t: TFunction;
  visible: boolean;
  message: string;
};

const CompareDocument :React.FC<CompareDocument> = ({
  onClose,
  selectedItems,
  showToast,
  t,
  visible,
  message
}) => {
  const [fileUrl, setFileUrl] = useState('');
  const [fileUrl1, setFileUrl1] = useState('');
  const [loading, setLoading] = useState(false);
  const documentAdminService = new DocumentAdminService();
  const fetchDocument = () => {
    if (!(selectedItems && selectedItems.length > 0)) return
    setLoading(true);
    documentAdminService.downloadFile(selectedItems[0].referenceGed)
        .then(({ data }) => {
            setLoading(false);
            const url = window.URL.createObjectURL(new Blob([data]));
            setFileUrl(url);
        })
        .catch((error) => {
            MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de la récupération du document");
            return "";
        })
        if (!(selectedItems.length > 1)) return
        documentAdminService.downloadFile(selectedItems[1].referenceGed)
                .then(({ data }) => {
                    const url1 = window.URL.createObjectURL(new Blob([data]));
                    setFileUrl1(url1);
                })
                .catch((error) => {
                    MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de la récupération du document");
                })         
               
  }


useEffect(() => {
    fetchDocument();
}, [selectedItems]);


  const hideDialog = () => {
    onClose();
};
const targetMessage = "les documents sont identiques";
const isIdentical = message === targetMessage;
const messageStyle = {
    color: isIdentical ? 'green' : 'red',
    fontSize: '18px', 
    padding: '10px', 
    borderRadius: '5px',
    backgroundColor: isIdentical ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', 
    border: `2px solid ${isIdentical ? 'green' : 'red'}`, 
    display: 'inline-block', 
    fontFamily: 'Arial, sans-serif',
};
  const itemDialogFooter = (
    <>
        <Button raised
            label={t("cancel")}
            icon="pi pi-times"
            text
            onClick={hideDialog}
        />
    </>
);
  return (
    <Dialog
            visible={visible}
            maximizable
            style={{ width: "66vw", textAlign: "center", overflow: 'auto'   }}
            header={<span style={messageStyle}>{message}</span>}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={hideDialog}
        >
            <TabView>
                <TabPanel header={t("Comparaison")}>
                    <div className="formgrid grid">
                        <div className="field col-8">
                            {selectedItems && selectedItems.length > 0 && fileUrl.length != 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', }}>
                               <FileViewer file={fileUrl} twoPages={false} 
                                className="mx-auto w-min"/>
                                <FileViewer file={fileUrl1} twoPages={false} 
                                className="mx-auto w-min"/>
                                </div>
                            )}
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
  )
}
export default CompareDocument