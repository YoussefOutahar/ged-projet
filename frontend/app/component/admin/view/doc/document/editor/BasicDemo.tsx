import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Button } from "primereact/button";
import axiosInstance from "app/axiosInterceptor";
import { DocumentDto } from "app/controller/model/Document.model";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { MessageService } from "app/zynerator/service/MessageService";
import { IndexElementAdminService } from "app/controller/service/admin/IndexElementAdminService.service";
import { DocumentCategorieAdminService } from "app/controller/service/admin/DocumentCategorieAdminService.service";
import { IndexElementDto } from "app/controller/model/IndexElement.model";
import { DocumentCategorieDto } from "app/controller/model/DocumentCategorie.model";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { DocumentCategorieIndexAdminService } from "app/controller/service/admin/DocumentCategorieIndexAdminService.service";
import { InputTextarea } from "primereact/inputtextarea";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { DocumentIndexElementDto } from "app/controller/model/DocumentIndexElement.model";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import ChoisirModel from "./ChoisirModel";
import AddModeleButton from "./AddModeleButton";
import useDocTypeStore from "Stores/DocumentTypeStore";
import useDocumentStateStore from "Stores/DocumentStateStore";
import usePlanClassementStore from "Stores/PlanClassementStore";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import useDocCategorieStore from "Stores/DocumentCategorieStore";
import useDocModelsStore from "Stores/DocModelsStore";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "pages/_app";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
type BasicDemoProps = {
    display?: boolean;
    uploadLocalFile?: boolean;
}

export default function BasicDemo({ display, uploadLocalFile=false }: BasicDemoProps) {

    const { t } = useTranslation();
    const toast = useRef<Toast>(null);
    const [text, setText] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [addDialogVisible, setAddDialogVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [onSave, setOnSave] = useState<boolean>(false);
    const [item, setItem] = useState<DocumentDto>(new DocumentDto());

    const {planClassementsNoArchive: plans} = usePlanClassementStore();
    const {models,updateDocModel} = useDocModelsStore();
    const { documentType } = useDocTypeStore(state => ({ documentType: state.type }));
    const [indexElements, setIndexElements] = useState<IndexElementDto[]>([]);
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {documentState} = useDocumentStateStore(state => ({documentState: state.state6}));
    const [documentIndexElements, setDocumentIndexElements] = useState<DocumentIndexElementDto>(new DocumentIndexElementDto());

    const documentCategorieIndexAdminService = new DocumentCategorieIndexAdminService();
    const indexElementAdminService = new IndexElementAdminService();
    const connectedUser = useConnectedUserStore(state => state.connectedUser);

    useEffect(() => {
        indexElementAdminService.getList().then(({ data }) => setIndexElements(data)).catch(error => console.log(error));
    }, []);
    
    useEffect(() => {
        const itemClone = { ...item };
        connectedUser && (itemClone.utilisateur = connectedUser);
        connectedUser && (itemClone.entiteAdministrative=connectedUser?.entiteAdministrative)
        documentState && (itemClone.documentState = documentState);
        documentType && (itemClone.documentType = documentType);
        setItem(itemClone);
    }, [connectedUser,documentState,documentType]);

    const convertToPdf = async () => {
        item.content = content;
        setOnSave(true);
        try {
            const response = await axiosInstance.post(`${API_URL}/admin/textEditor/convertToPdf`, text, { responseType: 'blob' });
            // Créer un objet Blob à partir des données de réponse
            const blob = new Blob([response.data], { type: "application/pdf" });

            // Create a download link for the blob object
            // const downloadLink = document.createElement("a");
            // downloadLink.href = window.URL.createObjectURL(blob);
            // downloadLink.download = "output.pdf";

            // // Trigger a click event on the download link to download the PDF file
            // downloadLink.click();
            MessageService.showSuccess(toast, 'Upload File', "Operation réussite!");
            setOnSave(false);
            setAddDialogVisible(true);
            return blob; 
        } catch (error) {
            console.error("Error converting HTML to PDF:", error);
            MessageService.showError(toast, 'Error!', "Error converting HTML to PDF");
            setOnSave(false);
            throw error;
        }
    }
    const saveDocument = async () => {
        setLoading(true);
        const blob = await convertToPdf();
        item.content = text;
        const form = new FormData();
        form.append('file', blob);

        form.append("documentDTO", JSON.stringify(item));

        axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/with-file`, form , {
            headers: {
            'Content-Type': 'multipart/form-data',
            }
        })
        .then((response) => {
            setLoading(false);
            setAddDialogVisible(false);
            MessageService.showSuccess(toast, t('success.creation'), "Document ajouté avec succes dans GED");
        })
        .catch((error) => {
            console.error('Erreur lors de l\'ajout de document:', error);
            setLoading(false);
            MessageService.showError(toast, 'Error!', "Erreur lors de l'ajout de document");
        });
    }

     // Form Validation
     const isSaveAsPdfFormValid = () => {
        return item?.reference && (item.documentCategorie && item.documentCategorie.code !=="") && (item.planClassement && item.planClassement.code !=="") ;
    }

    const convertToDocx = async () => {
        await axiosInstance.post(`${API_URL}/admin/textEditor/convertToDocx`, text, { responseType: 'blob' })
            .then((response) => {
                // Create a blob object from the response data
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    
                // Create a download link for the blob object
                const downloadLink = document.createElement("a");
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = "output.docx";
    
                // Trigger a click event on the download link to download the DOCX file
                downloadLink.click();
            })
            .catch((error) => {
                console.error("Error converting HTML to DOCX:", error);
            }); 
    }
    const onInputTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const value = (e.target && e.target.value) || "";
        setItem({ ...item, [name]: value });
    };
    const onDropdownChange = (e: DropdownChangeEvent, field: string) => {
        setItem((prevState) => ({ ...prevState, [field]: e.value }));
    };
    const onCategorieChange = (e: DropdownChangeEvent, field: string) => {
        setItem((prevState) => ({ ...prevState, [field]: e.value }));
        documentCategorieIndexAdminService.findByDocumentCategorieId(e.value.id).then(({ data }) => setIndexElements(data.map(e => e.indexElement))).catch(error => console.log(error));
    };
    const onInputTextChangeDocumentIndexElements = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDocumentIndexElements({ ...documentIndexElements, [name]: val })
    };
    const deleteDocumentIndexElements = (rowData: any) => {
        const updatedItems = item.documentIndexElements.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentIndexElements: updatedItems }));
        setDocumentIndexElements(new DocumentIndexElementDto());
    };
    const itemDialogFooter = (
        <div>
            <Button raised label={t("cancel")} icon="pi pi-check" onClick={()=>{setAddDialogVisible(false)}} />
            <Button disabled={!isSaveAsPdfFormValid()} raised label={t("save")} icon="pi pi-check" loading={loading} onClick={saveDocument} />
        </div>
    );
   
   
    const onDropdownChangeDocumentIndexElements = (e: any, field: string) => {
        setDocumentIndexElements((prevState) => ({ ...prevState, [field]: e.value }));
    };
    const addDocumentIndexElements = () => {
        if (item.documentIndexElements == null)
            item.documentIndexElements = new Array<DocumentIndexElementDto>();
        let _item = documentIndexElements;
        if (!_item.id) {
            item.documentIndexElements.push(_item);
            setItem((prevState: any) => ({ ...prevState, documentIndexElements: item.documentIndexElements }));
        } else {
            const updatedItems = item.documentIndexElements.map((item) => item.id === documentIndexElements.id ? { ...documentIndexElements } : item);
            setItem((prevState: any) => ({ ...prevState, documentIndexElements: updatedItems }));
        }
        setDocumentIndexElements(new DocumentIndexElementDto());
    };

    const [selectedModel, setSelectedModel] = useState<any>(null);

    // const showTextModel = (e: any) => {
    //     setSelectedModel(e);
    //     setText(e?.content || '');
    // }
    // const [globalFilter, setGlobalFilter] = useState('');
    // const header = (
    //     <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
    //         <h5 className="m-0">{t("document.header", { totalRecords: models.length})}</h5>
    //         <span className="block mt-2 ml-3 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
    //             <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
    //                 placeholder={t("search")} /> 
    //         </span>
    //     </div>
    // );
  
    


    // convert pdf to html
    const pdfToHtml = async (file : Blob) => {
        const form = new FormData();
        form.append('file', file);
        return await axiosInstance.post(`${API_URL}/admin/textEditor/convertToHtml`, form)
            .then((response) => {
                setText(response.data);
            })
            .catch((error) => {
                console.error("Error converting PDF to HTML:", error);
            });
    }
    const customBase64Uploader = async (event: FileUploadHandlerEvent) => {
        const file :any = event.files[0];
        pdfToHtml(file);
    };

    // Update Model
    const [updateItemDialog, setUpdateItemDialog] = useState(false);

    const updateModelMutation = useMutation({
        mutationKey: ['models'],
        mutationFn: (model: any) => axiosInstance.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`,model),
        onSuccess: () => {
            setUpdateItemDialog(false);
            updateDocModel(selectedModel);
            setSelectedModel(null);
            MessageService.showSuccess(toast, 'Edit Model', "Operation réussite!");
            queryClient.invalidateQueries({queryKey: ['models']});
        },
        onError: (error) => {
            console.error('Error Add models', error);
            MessageService.showError(toast, 'Error!', "Error add Model");
        }
    });
    const updateModel = () => {
        const model = {
            id: selectedModel.id,
            libelle : selectedModel.libelle,
            content : text
        }
        updateModelMutation.mutate(model);
        // axiosInstance.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`,model)
        //     .then(response => {
        //         fetchModels();
        //         setSelectedModel(null);
        //         setUpdateItemDialog(false);
        //         MessageService.showSuccess(toast, 'Edit Model', "Operation réussite!");
        //     })
        //     .catch(error => {
        //         console.error('Error Add models', error);
        //         MessageService.showError(toast, 'Error!', "Error add Model");
        //     });
    }

   

    return (
        <div className="card h-full">

            {/* ---------------------- Header ----------------------- */}
            <ChoisirModel models={models} selectedModel={selectedModel} setSelectedModel={setSelectedModel} setText={setText} setUpdateItemDialog={setUpdateItemDialog} toast={toast}/>
            {uploadLocalFile && <FileUpload mode="basic" name="demo[]" url="/api/upload"  customUpload uploadHandler={customBase64Uploader} />}

            {/* ---------------------- Editor ----------------------- */}
            <Editor  
                value={text} 
                onTextChange={(e: EditorTextChangeEvent) => {
                    setText(e.htmlValue||'');
                    setContent(e.textValue || '');
                }} 
                style={{ minHeight: '500px' }} 
            />

            {/* ---------------------- Footer ----------------------- */}
            <div className="flex justify-content-end mt-2 gap-2">
                {display && <>
                    <AddModeleButton text={text} toast={toast} />
                    {updateItemDialog && selectedModel && <Button disabled={text.length===0} label="Edit Modele" onClick={updateModel} severity="warning" className="mr-2"/>}
                </>}
                <Button disabled={text.length===0} label="Save as PDF" loading={onSave} onClick={() => convertToPdf()} />
            </div>

            
            {/* ----------------- Save as pdf and add document ----------------------- */}
            <Dialog 
                visible={addDialogVisible}  
                closeOnEscape 
                maximizable 
                style={{ width: '85vw' }} 
                header={t("document.tabPan")}
                modal 
                className="p-fluid" 
                footer={itemDialogFooter} 
                onHide={()=>{setAddDialogVisible(false)}}
            >
                <div className="formgrid grid">
                    <div className="field col-4">
                        <label htmlFor="reference">{t("document.reference")}</label>
                        <InputText id="reference" value={item.reference}
                            onChange={(e) => onInputTextChange(e, 'reference')} required autoFocus/>
                        {!isSaveAsPdfFormValid() && !item.reference && <small className="p-invalid p-error font-bold">*{t("requiredField")}</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                        <Dropdown showClear id="documentCategorieDropdown" value={item.documentCategorie}
                            options={documentCategories}
                            onChange={(e) => onCategorieChange(e, 'documentCategorie')}
                            placeholder={t("document.documentCategoriePlaceHolder")} filter
                            filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                            optionLabel="libelle"/>
                        {!isSaveAsPdfFormValid() && (!item.documentCategorie || item.documentCategorie.code ==="") && <small className="p-invalid p-error font-bold">*{t("requiredField")}</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="planClassement">{t("document.classificationPlan")} :</label>
                        <Dropdown showClear id="planClassementDropdown" value={item.planClassement}
                            options={plans}
                            onChange={(e) => onDropdownChange(e, 'planClassement')}
                            placeholder={t("document.classificationPlan")}
                            filter
                            filterPlaceholder="Plan de Classement"
                            optionLabel="libelle"/>
                        {!isSaveAsPdfFormValid() && (!item.planClassement || item.planClassement.code ==="") && <small className="p-invalid p-error font-bold">*{t("requiredField")}</small>}
                    </div>
                </div>
                <Divider />
                <div>
                    <div className="grid">
                        <div className="field col-8">
                            <label htmlFor="content">{t("document.content")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="content" value={item.content}
                                    onChange={(e) => onInputTextChange(e, 'content')} rows={15} cols={30} />
                            </span>
                        </div>
                        <div className="field col-4">
                            <div className="field col-12">
                                <label htmlFor="indexElement">{t("documentIndexElement.indexElement")}</label>
                                <Dropdown id="indexElementDropdown" value={documentIndexElements.indexElement}
                                    options={indexElements}
                                    onChange={(e) => onDropdownChangeDocumentIndexElements(e, 'indexElement')}
                                    placeholder={t("documentIndexElement.indexElementPlaceHolder")} filter
                                    filterPlaceholder={t("documentIndexElement.indexElementPlaceHolderFilter")}
                                    optionLabel="libelle" autoFocus />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="value">{t("documentIndexElement.value")}</label>
                                <InputTextarea id="value" value={documentIndexElements.value}
                                    onChange={(e) => onInputTextChangeDocumentIndexElements(e, 'value')}
                                    rows={5} />
                            </div>
                            <div className="field col-12">
                                <Button raised label={t("save")} onClick={addDocumentIndexElements} />
                            </div>
                        </div>
                    </div>
                    <DataTable value={item.documentIndexElements} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                        <Column field="indexElement.libelle"
                            header={t("documentIndexElement.indexElement")}></Column>
                        <Column field="value" header={t("documentIndexElement.value")}></Column>
                        <Column field="description" header={t("documentIndexElement.description")} hidden></Column>
                        <Column header={t("actions")} body={(rowData) => (<div>
                            <Button raised icon="pi pi-times" severity="warning" className="mr-2 p-button-danger"
                                onClick={() => deleteDocumentIndexElements(rowData)} />
                        </div>)}></Column>
                    </DataTable>
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    )
}
        