import useEditHook from 'app/component/zyhook/useEdit.hook';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { TabPanel, TabView } from 'primereact/tabview'
import { Toast } from 'primereact/toast';
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import React, { useEffect, useState } from 'react'
import { MessageService } from 'app/zynerator/service/MessageService';
import { pdfjs } from 'react-pdf';
import axiosInstance from 'app/axiosInterceptor';

type DocumentEditAdminType = {
    list: DocumentDto[];
    onClose: () => void;
    selectedItem: DocumentDto;
    service: DocumentAdminService;
    showToast: React.Ref<Toast>;
    t: TFunction;
    update: (item: DocumentDto) => void;
    visible: boolean;
    onDocumentSave?: (savedDocument: DocumentDto) => void; // New callback prop

};
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const EditFile : React.FC<DocumentEditAdminType> = ({
    list,
    onClose,
    selectedItem,
    service,
    showToast,
    t,
    update,
    visible,
    onDocumentSave,
}) => {
    const isFormValid = () => {
        const errorMessages = new Array<string>();
        if (item.reference == "") errorMessages.push("reference Obligatoire");
        return errorMessages.length == 0;
    };
    const {
        activeIndex,
        activeTab,
        adaptDate,
        editItem,
        formateDate,
        hideDialog,
        item,
        onBooleanInputChange,
        onDropdownChange,
        onInputDateChange,
        onInputNumerChange,
        onInputTextChange,
        onMultiSelectChange,
        onTabChange,
        parseToIsoFormat,
        setActiveIndex,
        setActiveTab,
        setItem,
        setSubmitted,
        submitted,
    } = useEditHook<DocumentDto, DocumentCriteria>({
        list,
        selectedItem,
        onClose,
        update,
        showToast,
        service,
        t,
        isFormValid,
    });
    const [text, setText] = useState<string>('');
    const [documentBase64, setDocumentBase64] = useState("");
    useEffect(() => {
        setText(selectedItem.content);
    }, []);
    // useEffect(() => {
    //     service.getDocumentBase64(selectedItem.id)
    //         .then(({ data }) => {
    //             setDocumentBase64(data);
    //             const uint8Array = base64ToUint8Array(data);
    //             pdfjs.getDocument(uint8Array).promise.then((pdf) => {
    //                 const totalPages = pdf.numPages;
    //                 let combinedText = '';
    //                 for (let i = 1; i <= totalPages; i++) {
    //                     pdf.getPage(i).then((page) => {
    //                         page.getTextContent().then((textContent) => {
    //                             const pageText = textContent.items.map((item) => {
    //                                 if ('str' in item) {
    //                                     const textItem = item as any;
    //                                     return textItem.str;
    //                                 } else {
    //                                     return '';
    //                                 }
    //                             }).join(' ');
    //                             combinedText += pageText + '\n';
    //                             if (i === totalPages) {
    //                                 setText(combinedText);
    //                             }
    //                         });
    //                     });
    //                 }
    //             });
    //             // const decodedText = atob(data);
    //             // setText(decodedText);
    //         })
    //         .catch((error) => {
    //             console.log("error", error);
    //             MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de la récupération du document");
    //         });
    // }, []);
    const base64ToUint8Array = (base64: string) => {
        const binaryString = window.atob(base64);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray;
    };
    const convertToPdf = async () => {
        try {
            const response = await axiosInstance.post(`${API_URL}/admin/textEditor/convertToPdf`, text, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: "application/pdf" });
            MessageService.showSuccess(showToast, 'Upload File', "Operation réussite!");
            return blob; 
        } catch (error) {
            console.error("Error converting HTML to PDF:", error);
            MessageService.showError(showToast, 'Error!', "Error converting HTML to PDF");
            throw error;
        }
    }
    const [loading, setLoading] = useState<boolean>(false);
    const generateRandomSuffix = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*';
        let suffix = '';
        for (let i = 0; i < 3; i++) {
            suffix += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return suffix;
    }
    const saveFile = async() => {
        setLoading(true);
        const blob = await convertToPdf();
        const itemClone = {...selectedItem};
        itemClone.content = text;
        const sufix = generateRandomSuffix();
        itemClone.reference = selectedItem.reference.concat(`_copy_${sufix}`);
        try {    
            const form = new FormData();
            form.append('file', blob);
            form.append("documentDTO", JSON.stringify(itemClone));
            
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/with-file`, form , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {
    
                setLoading(false);
                if (onDocumentSave) {
                    onDocumentSave(response.data); // Trigger callback with updated document
                }
                onClose();
                MessageService.showSuccess(showToast, 'Upload File', "Operation spécite!");
            })
        }catch (error) {
            console.error('Error saving item', error);
            setLoading(false);
            MessageService.showError(showToast, 'Error!', "Error saving item");
        };
            
    }
    const itemDialogFooter = (
        <>
            <Button raised
                label={t("cancel")}
                icon="pi pi-times"
                text
                onClick={onClose}
            />
            <Button raised label={t("save")} icon="pi pi-check" loading={loading} onClick={saveFile} />{" "}
        </>
    );
    
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
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header="Editeur File">
                    <Editor  
                        value={text} 
                        onTextChange={(e: EditorTextChangeEvent) => {
                            setText(e.htmlValue||'');
                        }} 
                        style={{ minHeight: '500px' }} 
                    />
                </TabPanel>
            </TabView>
        </Dialog>
  )
}

export default EditFile
