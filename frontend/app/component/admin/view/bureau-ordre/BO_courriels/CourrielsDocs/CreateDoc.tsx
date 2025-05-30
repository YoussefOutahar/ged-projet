import axiosInstance from "app/axiosInterceptor";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentCategorieDto } from "app/controller/model/DocumentCategorie.model";
import { DocumentIndexElementDto } from "app/controller/model/DocumentIndexElement.model";
import { DocumentStateDto } from "app/controller/model/DocumentState.model";
import { DocumentTypeDto } from "app/controller/model/DocumentType.model";
import { EntiteAdministrativeDto } from "app/controller/model/EntiteAdministrative.model";
import { IndexElementDto } from "app/controller/model/IndexElement.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { DocumentCategorieAdminService } from "app/controller/service/admin/DocumentCategorieAdminService.service";
import { DocumentCategorieIndexAdminService } from "app/controller/service/admin/DocumentCategorieIndexAdminService.service";
import { DocumentStateAdminService } from "app/controller/service/admin/DocumentStateAdminService.service";
import { DocumentTypeAdminService } from "app/controller/service/admin/DocumentTypeAdminService.service";
import { EntiteAdministrativeAdminService } from "app/controller/service/admin/EntiteAdministrativeAdminService.service";
import { IndexElementAdminService } from "app/controller/service/admin/IndexElementAdminService.service";
import { UtilisateurAdminService } from "app/controller/service/admin/UtilisateurAdminService.service";
import { AuthService } from "app/zynerator/security/Auth.service";
import { MessageService } from "app/zynerator/service/MessageService";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface Props {
    showToast: (severity: SeverityType, summary: string) => void;
    files: Blob[] | undefined;
    setFiles: (files: Blob[]) => void;
    setFileSaved?: (fileSaved: boolean) => void;
}

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const CreateDocument = ({ showToast, setFiles, setFileSaved = (fileSaved: boolean) => { } }: Props) => {
    const { t } = useTranslation();
    const toast = useRef<Toast>(null);
    const [text, setText] = useState<string>('');
    const [loadingM, setLoadingM] = useState<boolean>(false);
    const [onSave, setOnSave] = useState<boolean>(false);

    const [models, setModels] = useState<any[]>([]);
    const [showModels, setShowModels] = useState<boolean>(false);
    const [addModels, setAddModels] = useState<boolean>(false);

    const fetchModels = () => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`)
            .then(response => setModels(response.data))
            .catch(error => console.error('Error loading models', error));
    }
    useEffect(() => {
        fetchModels();
    }, []);


    const convertToPdf = async () => {
        // item.content = content;
        setOnSave(true);
        try {
            const response = await axiosInstance.post(`${API_URL}/admin/textEditor/convertToPdf`, text, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: "application/pdf" });
            setFiles([blob]);
            setFileSaved(true);
            showToast("success", "Operation réussite!");
            setOnSave(false);
            return blob;
        } catch (error) {
            console.error("Error converting HTML to PDF:", error);
            showToast('error', 'Error converting HTML to PDF');
            setOnSave(false);
            setFileSaved(false);
            throw error;
        }
    }

    const [nameModel, setNameModel] = useState<string>('');
    const saveModel = async () => {
        const model = {
            libelle: nameModel,
            content: text
        }
        axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`, model)
            .then(response => {
                fetchModels();
                setAddModels(false);
                setNameModel('');
                MessageService.showSuccess(toast, 'Add Model', "Operation réussite!");
            })
            .catch(error => {
                console.error('Error Add models', error);
                MessageService.showError(toast, 'Error!', "Error add Model");
            });
    }
    const convertToDocx = async () => {
        await axiosInstance.post(`${API_URL}/courriels/convertToDocx`, text, { responseType: 'blob' })
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

    const modelDialogFooter = (
        <div>
            <Button raised label={t("cancel")} icon="pi pi-check" onClick={() => { setAddModels(false) }} />
            <Button raised label={t("save")} icon="pi pi-check" loading={loadingM} onClick={saveModel} />
        </div>
    );
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const showTextModel = (e: any) => {
        setSelectedModel(e);
        setText(e?.content || '');
    }

    return (
        <div className="card h-full">
            <div className="flex mb-4">
                <Button
                    label="Choisir un Modele"
                    onClick={() => showModels ? setShowModels(false) : setShowModels(true)}
                    severity="help"
                    className="mr-2 w-6"
                />
                {showModels && <Dropdown showClear id="model" value={selectedModel}
                    options={models} onChange={(e) => showTextModel(e.value)}
                    placeholder={t("document.documentTypePlaceHolder")} filter
                    filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                    style={{ minWidth: '250px' }}
                    optionLabel="libelle" />}
            </div>
            <Editor
                value={text}
                onTextChange={(e: EditorTextChangeEvent) => {
                    setText(e.htmlValue || '');
                }}
                style={{ minHeight: '500px' }}
            />
            <div className="flex justify-content-end mt-2 gap-2">
                {/* <Button disabled={text.length===0} className="" label="Save as Word" onClick={() => convertToDocx()} /> */}
                <Button disabled={text.length === 0} label="Add Modele" onClick={() => setAddModels(true)} severity="info" className="mr-2" />
                <Button disabled={text.length === 0} label="Save as PDF" loading={onSave} onClick={() => convertToPdf()} />
            </div>
            <Dialog visible={addModels} style={{ width: '450px' }} header={"Ajouter un Modele"} modal
                footer={modelDialogFooter} onHide={() => { setAddModels(false) }}>
                <div className="field col-6">
                    <label htmlFor="reference">{t("document.reference")}</label>
                    <InputText id="reference" value={nameModel}
                        onChange={(e) => setNameModel(e.target.value)} required
                    />
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    )
};

export default CreateDocument;