import React, { useEffect, useState } from "react";

import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { TFunction } from "i18next";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { MessageService } from "app/zynerator/service/MessageService";
import FileViewer from "app/component/admin/view/doc/document/preview/FileViewer";
import { ProgressSpinner } from "primereact/progressspinner";
import { Timeline } from "primereact/timeline";

type DocumentHistoryAdminType = {
    onClose: () => void;
    selectedItem: DocumentDto;
    service: DocumentAdminService;
    showToast: React.Ref<Toast>;
    t: TFunction;
    visible: boolean;
    data: DocumentDto[]
};
const History: React.FC<DocumentHistoryAdminType> = ({
    onClose,
    selectedItem,
    service,
    showToast,
    t,
    visible,
    data
}) => {

    const hideDialog = () => {
        onClose();
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
    const [fileUrl, setFileUrl] = useState("");
    const [numPages, setNumPages] = useState(0);
    const [loadingFile, setLoadingFile] = useState(false);
    const [error, setError] = useState(false);
    const displayDocument = (item: DocumentDto) => {
        setLoadingFile(true);
        service.downloadFile(item.referenceGed)
            .then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data]));
                setFileUrl(url);
            })
            .catch((error) => {
                setError(true);
                MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de la récupération du document");
                return "";
            })
            .finally(() => {
                setLoadingFile(false);
            });

    };
    useEffect(() => {
        displayDocument(selectedItem);
    }, []);
    const handleItemClick = (item: DocumentDto) => {
        displayDocument(item);
    };


    return (
        <Dialog
            visible={visible}
            maximizable
            style={{ width: "70vw" }}
            header={t("document.tabPan")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={hideDialog}
        >
            <TabView >
                <TabPanel header={t("document.viewDocument")}>
                    <>  
                    <div  className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', width: '100%', height: '100vh', }} >
                    <Timeline
    value={data}
    align="alternate"
    content={(item, index) => (
        <div
            onClick={() => handleItemClick(item)}
            style={{
                cursor: 'pointer',
                padding: '10px',
                position: 'relative',
                borderRadius: '5px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: index === data.length - 1 ? '#e0e0e0' : '#f9f9f9',
                transition: 'background-color 0.3s',
                fontWeight: index === data.length - 1 ? 'bold' : 'normal',
            }}
        >
            {item.reference}
        </div>
    )}
/>
                        {fileUrl &&
                            <div  style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', width: '100%', height: '100vh',  position: 'relative' ,
                            left:'3cm',}} >
                                <FileViewer
                                    twoPages={false}
                                    className="mx-auto w-min"
                                    setNumPages={setNumPages}
                                    file={fileUrl}
                                />

                            </div>

                        }
                        {loadingFile && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <ProgressSpinner />
                            </div>
                        )}
                        {error && (
                            <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                        )}
                        </div>
                    </>
                </TabPanel>

            </TabView>
        </Dialog>
    );
};

export default History;
