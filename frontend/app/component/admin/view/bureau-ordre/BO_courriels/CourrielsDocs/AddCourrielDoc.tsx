import axiosInstance from "app/axiosInterceptor";
import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentCategorieDto } from "app/controller/model/DocumentCategorie.model";
import { PlanClassementDto } from "app/controller/model/PlanClassement.model";
import { DocumentCategorieAdminService } from "app/controller/service/admin/DocumentCategorieAdminService.service";
import { t } from "i18next";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { SelectButton } from "primereact/selectbutton";
import { use, useEffect, useRef, useState } from "react";
import ImportDocumentsFromGed from "./ImportDocumentsFromGed";
import CreateDocument from "./CreateDoc";
import DWT from "app/component/dwt/DynamsoftSDK";
import FileViewer from "../../../doc/document/preview/FileViewer";


const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface Props {
    isResponsable?: boolean;
    courriel: CourrielBureauOrdre;
    refetchCourriels: (planClassementId: number) => void;
    showToast: (severity: SeverityType, summary: string) => void;
}

type SeverityType = 'success' | 'info' | 'warn' | 'error';



const AddCourrielDoc = ({ isResponsable = false, courriel, refetchCourriels, showToast }: Props) => {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const [files, setFiles] = useState<any[]>();
    const handleFileUpload = (e: any) => {
        const files = e.files;
        setFiles(files);
        setFilesUploaded(true);
        handleFileUrl(files);
        showToast('success', t('success.uploadSuccess', { totalRecords: files.length }));
    };

    const [scanedFile, setScanedFile] = useState<Blob>();
    useEffect(() => {
        if (scanedFile) {
            setFiles([scanedFile]);
        }
    }, [scanedFile]);

    const [item, setItem] = useState<DocumentDto>(new DocumentDto());

    const [filesUploaded, setFilesUploaded] = useState(false);
    const fileUploadRef = useRef(null);

    const [planClassements, setPlanClassements] = useState<PlanClassementDto[]>([]);
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const documentCategorieAdminService = new DocumentCategorieAdminService();

    useEffect(() => {
        documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));

        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
            .then(response => setPlanClassements(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, [showDialog]);

    const onClose = () => {
        setShowDialog(false);
    };

    const onSave = async () => {
        if (!importDocs && !createDocument && !scanDocs) {
            if (!filesUploaded) {
                showToast('error', 'Veuillez d\'abord charger les fichiers.');
                return;
            }
        }

        setLoading(true);

        const form = new FormData();
        const courrielDocs: DocumentDto[] = [];

        if (!createDocument && !importDocs ) {
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (file instanceof Blob) {
                        form.append('files', file);
                        courrielDocs.push(item);
                    }
                })
                form.append('documentDtos', JSON.stringify(courrielDocs));
                sendAddDocumentRequest(form);
            }
        }

        if (importDocs) {
            sendAddExistingDocumentsRequest(selectedDocuments);
        }

        if (createDocument) {
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (file instanceof Blob) {
                        form.append('files', file);
                        courrielDocs.push(item);
                    }
                })
                form.append('documentDtos', JSON.stringify(courrielDocs));
                sendAddDocumentRequest(form);
            }
        }
    };

    const sendAddDocumentRequest = async (form: FormData) => {
        axiosInstance.put(`${API_URL}/courriels/${courriel.id}/add-documents`, form).then((res) => {
            setLoading(false);
            refetchCourriels(courriel.planClassement.id as number);
            setShowDialog(false);
            showToast('success', t('success.uploadSuccess'));
        }).catch((err) => {
            console.error('Error adding documents:', err);
            setLoading(false);
            setShowDialog(false);
            showToast('error', t('error.uploadError'));
        });
    }

    const sendAddExistingDocumentsRequest = async (docs: DocumentDto[]) => {
        axiosInstance.put(`${API_URL}/courriels/${courriel.id}/add-documents/existing-files`, docs).then((res) => {
            setLoading(false);
            refetchCourriels(courriel.planClassement.id as number);
            setShowDialog(false);
            // showToast('success', `${files.length}` + t('success.uploadSuccess'));
        }).catch((err) => {
            console.error('Error adding documents:', err);
            setLoading(false);
            setShowDialog(false);
            // showToast('error', t('error.uploadError'));
        });
    };

    const [importDocs, setImportDocs] = useState(false);
    const [selectedDocuments, setSelectedDocument] = useState<DocumentDto[]>([]);

    const [createDocument, setCreateDocument] = useState(false);
    const [fileSavedTextEditor, setFileSavedTextEditor] = useState(false);
    const [scanDocs, setScanDocs] = useState(false);
    

    const documentCreationOptions = () => {
        return [
            { label: t("document.uploadDocuments"), value: "download" },
            { label: t("document.scanDocument"), value: "scan" },
            { label: t("document.importDocumentsFromGED"), value: "import" },
            { label: t("document.textEditor"), value: "create" }
        ]
    }

    const footerTemplate = () => {
        return (
            <>
                <Button label="Annuler" onClick={onClose} />
                <Button label="Enregistrer" 
                    disabled={!isFormValid()}
                    loading={loading}
                    onClick={async () => {
                        await onSave();
                    }}
                />
            </>
        );
    };

    // -------------------------- PDF Viewer --------------------------
    const [documentToPreview, setDocumentToPreview] = useState<DocumentDto | null>();
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleFileUrl = (files: Blob[]) => {
        const fileUrl = files && files[0];
        if (fileUrl) {
            const localFileUrl = URL.createObjectURL(fileUrl);
            setFileUrl(localFileUrl);
        }
    }


    // Form validation
    const isFormValid = () => {
        if (importDocs) {
            return selectedDocuments.length > 0;
        } else if (createDocument) {
            return fileSavedTextEditor && item.documentCategorie?.code !== '' && item.uploadDate && item.planClassement?.code !== '';
        } else if (scanDocs) {
            return scanedFile && item.documentCategorie?.code !== '' && item.uploadDate && item.planClassement?.code !== '';;
        }
        else {
            return filesUploaded && item.documentCategorie?.code !== '' && item.uploadDate && item.planClassement?.code !== '';
        }
    }


    return (
        <>
            <Button
                label="Add New Document"
                icon="pi pi-plus"
                style={
                    { display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content' }
                }
                onClick={() => {
                    setShowDialog(true);
                }}
            />
            <Dialog
                header={"Ajouter un document"}
                visible={showDialog}
                closeOnEscape
                modal
                className="p-fluid"
                style={{ width: '70vw', height: '80vh'}}
                footer={footerTemplate}
                onHide={() => setShowDialog(false)}
            >
                    <SelectButton
                        className="mb-6"
                        value={importDocs ? "import" : createDocument ? "create" : scanDocs ? "scan" : "download"}
                        options={documentCreationOptions()}
                        onChange={(e) => {
                            setImportDocs(e.value === "import");
                            setCreateDocument(e.value === "create");
                            setScanDocs(e.value === "scan");
                            setFileUrl(null);
                        }}
                    />
                <div className="flex gap-2 h-full">
                
                    <div
                        className="formgrid grid "
                        style={loading ? { pointerEvents: 'none' } : {flex: 2}}
                    >

                        {!importDocs && <div className="field col-4">
                            <label htmlFor="documentCategorieCode">{t("document.documentCategorie")}</label>
                            <Dropdown showClear id="documentCategorieDropdown"
                                value={item?.documentCategorie}
                                options={documentCategories}
                                placeholder={t("document.documentCategoriePlaceHolder")}
                                onChange={(e) => {
                                    setItem({ ...item, ['documentCategorie']: e.value })
                                    // documentCategorieIndexAdminService.findByDocumentCategorieId(e.value.id).then(({ data }) => setIndexElements(data.map(e => e.indexElement))).catch(error => console.log(error));
                                }}
                                filter
                                optionLabel={t("libelle")} />
                            {!isFormValid() && item?.documentCategorie?.code === '' && <small className="text-red-500">*{t("requiredField")}</small>}
                        </div>}
                        {!importDocs && <div className="field col-4">
                            <label htmlFor="uploadDate">{t("document.documentDate")}</label>
                            <Calendar
                                id="uploadDate"
                                value={item.uploadDate ? new Date(item.uploadDate) : new Date()}
                                onChange={(e) => {
                                    const dateValue = e.value instanceof Date ? e.value : new Date()
                                    setItem({ ...item, ["uploadDate"]: dateValue })
                                }}
                                showIcon={true}
                            />
                            {!isFormValid() && !item?.uploadDate && <small className="text-red-500">*{t("requiredField")}</small>}
                        </div>}
                        {!importDocs && <div className="field col-4">
                            <label htmlFor="planClassementCode">{t("document.classificationPlan")}</label>
                            <Dropdown showClear id="planClassementDropdown"
                                value={item?.planClassement}
                                options={planClassements}
                                placeholder={"Selectionner un plan"}
                                onChange={(e) => {
                                    setItem({ ...item, ["planClassement"]: e.value });
                                }}
                                filter
                                optionLabel="libelle" />
                            {!isFormValid() && item?.planClassement?.code === '' && <small className="text-red-500">*{t("requiredField")}</small>}
                        </div>}
                        {!importDocs && <div className="field col-12">
                            <label htmlFor="description">{t("document.description")}</label>
                            <InputTextarea
                                id="description"
                                name="description"
                                value={item?.description || ""}
                                onChange={(e) => {
                                    setItem({ ...item, description: e.target.value });
                                }}
                                rows={4} cols={30} />
                        </div>}

                        {!importDocs && !createDocument && !scanDocs && <div className="field col-12">
                            <label>{t("document.files")}</label>
                            <FileUpload
                                ref={fileUploadRef}
                                name="files[]"
                                multiple
                                customUpload //change status file in upload to completed
                                uploadHandler={handleFileUpload}
                                chooseLabel={t('choose')}
                                uploadLabel={t('upload')}
                                cancelLabel={t('cancel')}
                                onClear={() => setFileUrl(null)}
                                emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
                            />
                        </div>}

                        {/* -------------------------- scan -------------------------- */}
                        {scanDocs &&
                            <div className="field col-12">
                                <div className="" >
                                    <DWT
                                        setUploadedFile={(blob: Blob) => {
                                            setScanedFile(blob);
                                        }}
                                        features={[
                                            "scan",
                                            // "load",
                                            "save",
                                            "upload",
                                            "uploader"
                                        ]}
                                    />
                                </div>
                            </div>
                        }

                        {/* ----------------------- importer depuis GED ----------------------- */}
                        {importDocs && <div className="field col-12">
                            <ImportDocumentsFromGed selectedDocuments={selectedDocuments} setSelectedDocuments={setSelectedDocument} setDocumentToPreview={setDocumentToPreview}  />
                            {!isFormValid() && selectedDocuments.length === 0 && <small className="text-red-500">*{t("document.importDocumentsFromGED")}</small>}
                        </div>}

                        {createDocument && <div className="field col-12">
                            <CreateDocument showToast={showToast} files={files} setFiles={setFiles} setFileSaved={setFileSavedTextEditor} />
                        </div>}
                    </div>

                    {/* // -------------------------- PDF Viewer -------------------------- */}

                    {
                        ( createDocument || scanDocs)?null:
                        (fileUrl) ? (
                                        <div className="overflow-auto" style={{ flex:2 }}>
                                            <FileViewer file={fileUrl} twoPages={false} height={700} />
                                        </div>
                                    ) : 
                                    documentToPreview ?
                                    <div className="flex align-items-center justify-content-center  " style={{ flex:2 }}>
                                        <FileViewer className="" documentId={documentToPreview.id} twoPages={false}/> 
                                        </div>
                                    : (<>
                                        <div className="flex flex-column align-items-center justify-content-center border-double border-500 " style={{ flex:2 }}>
                                            <p>{t("noFileToDisplay")}</p>
                                            <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                                        </div>
                                    </>)
                    }
                </div>
            </Dialog>
        </>
    );
};

export default AddCourrielDoc;