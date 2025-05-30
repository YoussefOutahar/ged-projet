import React, { useEffect, useRef, useState } from "react";

import useEditHook from "app/component/zyhook/useEdit.hook";
import { DocumentCriteria } from "app/controller/criteria/DocumentCriteria.model";
import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentIndexElementDto } from "app/controller/model/DocumentIndexElement.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { TFunction } from "i18next";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { PlanClassementDto } from "app/controller/model/PlanClassement.model";
import axiosInstance from "app/axiosInterceptor";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { FileUpload } from "primereact/fileupload";
import { MessageService } from "app/zynerator/service/MessageService";
import { AuthService } from "app/zynerator/security/Auth.service";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import useDocCategorieStore from "Stores/DocumentCategorieStore";
import useDocTypeStore from "Stores/DocumentTypeStore";
import useDocumentStateStore from "Stores/DocumentStateStore";
import useUtilisateurStore from "Stores/Users/UtilsateursStore";
import useEntiteAdministrativesStore from "Stores/EntiteAdministrativesStore";
import useIndexElementsStore from "Stores/IndexElementsStore";
import FileViewer from "../preview/FileViewer";
import { ProgressSpinner } from "primereact/progressspinner";
import { getMediaType } from "app/utils/documentUtils";

type DocumentEditAdminType = {
    list: DocumentDto[];
    onClose: () => void;
    selectedItem: DocumentDto;
    service: DocumentAdminService;
    showToast: React.Ref<Toast>;
    t: TFunction;
    update: (item: DocumentDto) => void;
    visible: boolean;
};
const Edit: React.FC<DocumentEditAdminType> = ({
    list,
    onClose,
    selectedItem,
    service,
    showToast,
    t,
    update,
    visible,
}) => {
    const isFormValid = () => {
        const errorMessages = new Array<string>();
        if (item.reference == "") errorMessages.push("reference Obligatoire");
        return errorMessages.length == 0;
    };
    const emptyItem = new DocumentDto();

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
    const fileUploadRef = useRef(null);

    const utilisateurs = useUtilisateurStore(state => state.utilisateurs);
    const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
    const [planClassements, setPlanClassements] = useState<
        PlanClassementDto[]
    >([]);
    const { documentTypes } = useDocTypeStore(state => ({ documentTypes: state.types}));
    const {indexElements, setIndexElements} = useIndexElementsStore(state => ({indexElements: state.indexElements, setIndexElements: state.setIndexElements}));
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {documentStates} = useDocumentStateStore(state => ({documentStates: state.states }));

    const [documentIndexElements, setDocumentIndexElements] =
        useState<DocumentIndexElementDto>(new DocumentIndexElementDto());

    useEffect(() => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list`)
          .then(response => setPlanClassements(response.data))
          .catch(error => console.error('Error loading plans', error));
    }, []);
    const addDocumentIndexElements = () => {
        setSubmitted(true);
        if (item.documentIndexElements == null)
            item.documentIndexElements = new Array<DocumentIndexElementDto>();
        const _item = documentIndexElements;
        if (!_item.id) {
            item.documentIndexElements.push(_item);
            setItem((prevState: any) => ({
                ...prevState,
                documentIndexElements: item.documentIndexElements,
            }));
        } else {
            const updatedItems = item.documentIndexElements.map((item) =>
                item.id === documentIndexElements.id
                    ? { ...documentIndexElements }
                    : item,
            );
            setItem((prevState: any) => ({
                ...prevState,
                documentIndexElements: updatedItems,
            }));
        }
        setDocumentIndexElements(new DocumentIndexElementDto());
    };

    const deleteDocumentIndexElements = (rowData: any) => {
        const updatedItems = item.documentIndexElements.filter(
            (val) => val !== rowData,
        );
        setItem((prevState) => ({
            ...prevState,
            documentIndexElements: updatedItems,
        }));
        setDocumentIndexElements(new DocumentIndexElementDto());
    };

    const editDocumentIndexElements = (rowData: any) => {
        setActiveTab(0);
        setDocumentIndexElements(rowData);
    };

    const onDropdownChangeDocumentIndexElements = (e: any, field: string) => {
        setDocumentIndexElements((prevState) => ({
            ...prevState,
            [field]: e.value,
        }));
    };

    const onInputTextChangeDocumentIndexElements = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        name: string,
    ) => {
        const val = (e.target && e.target.value) || "";
        setDocumentIndexElements({ ...documentIndexElements, [name]: val });
    };
    const authService = new AuthService();
    const utilisateurCriteria = new UtilisateurCriteria();

    const itemDialogFooter = (
        <>
            <Button raised
                label={t("cancel")}
                icon="pi pi-times"
                text
                onClick={hideDialog}
            />
            <Button raised label={t("save")} icon="pi pi-check" onClick={editItem} />{" "}
        </>
    );
    const [isArchivagePhysiqueChecked, setIsArchivagePhysiqueChecked] = useState(false);

    const handleArchivagePhysiqueSwitchChange = (e : InputSwitchChangeEvent) => {
      setIsArchivagePhysiqueChecked(e.value ?? false);
    };
    const [fileUrl, setFileUrl] = useState("");
    const [numPages, setNumPages] = useState(0);
    const [loadingFile, setLoadingFile] = useState(false);
    const [error, setError] = useState(false);

    const [showDWT, setShowDWT] = useState(false);
    useEffect(() => {
        setLoadingFile(true);
        service.downloadFile(selectedItem.referenceGed)
            .then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data], { type: getMediaType(selectedItem.documentType.libelle) }));
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
    }, []);
    const handleModifierClick = () => {
        setShowDWT(true);
    };

    const handleAnnulerClick = () => {
        setShowDWT(false);
    };
    const [file, setFile] = useState<any>(); 
    const [fileUploaded, setFileUploaded] = useState(false);
    const handleFileUpload = (e: any) => {
        const uploadedFile = e.files[0];
        setFile(uploadedFile);
        setFileUploaded(true);
        MessageService.showSuccess(showToast, "Mise à jour!", "Le fichier est chargé avec succès");
    };
    const [loading, setLoading] = useState(false);
    const [loadingIndex, setLoadingIndex] = useState(false);
    const updateFile = () => {
        setLoading(true);
        if(!fileUploaded){
            MessageService.showError(showToast, "Erreur!", "Le fichier n'est pas chargé");
            setLoading(false);
        }else{
            const form = new FormData();

            if (file && file instanceof Blob) {
                form.append('file', file);
            }
            const itemJson = JSON.stringify(item);
            form.append('documentDTO', itemJson);
            
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/update/with-file`, form , {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            })
            .then((responses) => {
                MessageService.showSuccess(showToast, "Mise à jour!", 'Opération faite avec success');
                setLoading(false);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur lors de la résolution des requêtes:', error);
                MessageService.showError(showToast, "Error!", "Erreur lors de la modification des documents");
            });
        }
    }
    const updateFileIndexer = () => {
        setLoadingIndex(true);
        if(!fileUploaded){
            MessageService.showError(showToast, "Erreur!", "Le fichier n'est pas chargé");
            setLoadingIndex(false);
        }else{
            const form = new FormData();

            if (file && file instanceof Blob) {
                form.append('file', file);
            }
            const itemJson = JSON.stringify(item);
            form.append('documentDTO', itemJson);
            
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/update/with-Index`, form , {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            })
            .then((responses) => {
                MessageService.showSuccess(showToast, "Mise à jour!", 'Opération faite avec success');
                setLoadingIndex(false);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur lors de la résolution des requêtes:', error);
                MessageService.showError(showToast, "Error!", "Erreur lors de la modification des documents");
            });
        }
    }
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
                <TabPanel header={t("document.viewDocument")}>
                    {!showDWT &&
                        <>
                            <Button icon="pi pi-pencil" label={t("document.updateDocument")} className="p-button-warning w-3 mb-2" onClick={handleModifierClick}/>
                            {fileUrl &&
                                <div style={{ width: '100%', height: '100vh' }}>
                                    <FileViewer
                                        // key={docHeight}
                                        // height={docHeight}
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
                        </>
                    }
                    {showDWT && 
                        <>
                            <Button icon="pi pi-replay" label="Annuler" className="p-button-secondary w-3 mb-2" onClick={handleAnnulerClick}/>
                            <Button icon="pi pi-check" label="Valider" className="p-button-success w-3 mb-2 ml-3" loading={loading} onClick={updateFile}/>
                            <Button icon="pi pi-check" label="Valider avec Index" className="p-button-warning w-3 mb-2 ml-3" loading={loadingIndex} onClick={updateFileIndexer}/>
                            <div className="field col-12">
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="files[]"
                                    customUpload //change status file in upload to completed
                                    uploadHandler={handleFileUpload}
                                    emptyTemplate={<p className="m-0">Drag and drop file to here to upload.</p>}
                                />
                            </div>
                        </>
                    }
                </TabPanel>
                <TabPanel header={t("document.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="reference">{t("document.reference")}</label>
                            <InputText
                                id="reference"
                                value={item.reference}
                                onChange={(e) => onInputTextChange(e, "reference")}
                                required
                                className={classNames({
                                    "p-invalid": submitted && !item.reference,
                                })}
                                autoFocus
                            />
                            {submitted && !item.reference && (
                                <small className="p-invalid p-error font-bold">Reference Obligatoire.</small>
                            )}
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentType">{t("document.documentType")}</label>
                            <Dropdown
                                showClear
                                id="documentTypeDropdown"
                                value={item.documentType}
                                options={documentTypes}
                                onChange={(e) => onDropdownChange(e, "documentType")}
                                placeholder={t("document.documentTypePlaceHolder")}
                                filter
                                filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                                optionLabel="libelle"
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentState">
                                {t("document.documentState")}
                            </label>
                            <Dropdown
                                showClear
                                id="documentStateDropdown"
                                value={item.documentState}
                                options={documentStates}
                                onChange={(e) => onDropdownChange(e, "documentState")}
                                placeholder={t("document.documentStatePlaceHolder")}
                                filter
                                filterPlaceholder={t("document.documentStatePlaceHolderFilter")}
                                optionLabel="libelle"
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentCategorie">
                                {t("document.documentCategorie")}
                            </label>
                            <Dropdown
                                showClear
                                id="documentCategorieDropdown"
                                value={item.documentCategorie}
                                options={documentCategories}
                                onChange={(e) => onDropdownChange(e, "documentCategorie")}
                                placeholder={t("document.documentCategoriePlaceHolder")}
                                filter
                                filterPlaceholder={t(
                                    "document.documentCategoriePlaceHolderFilter",
                                )}
                                optionLabel="libelle"
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                            <Calendar
                                id="uploadDate"
                                value={adaptDate(item.uploadDate)}
                                onChange={(e) => onInputDateChange(e, "uploadDate")}
                                dateFormat="dd/mm/yy"
                                showIcon={true}
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="size">{t("document.size")}</label>
                            <InputNumber
                                id="size"
                                value={item.size}
                                onChange={(e) => onInputNumerChange(e, "size")}
                                disabled
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                            <Dropdown
                                showClear
                                id="utilisateurDropdown"
                                value={item.utilisateur}
                                options={utilisateurs}
                                onChange={(e) => onDropdownChange(e, "utilisateur")}
                                placeholder={t("document.utilisateurPlaceHolder")}
                                filter
                                filterPlaceholder={t("document.utilisateurPlaceHolderFilter")}
                                optionLabel="nom"
                                disabled
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">
                                {t("document.entiteAdministrative")}
                            </label>
                            <Dropdown
                                showClear
                                id="entiteAdministrativeDropdown"
                                value={item.entiteAdministrative}
                                options={entiteAdministratives}
                                onChange={(e) => onDropdownChange(e, "entiteAdministrative")}
                                placeholder={t("document.entiteAdministrativePlaceHolder")}
                                filter
                                filterPlaceholder={t(
                                    "document.entiteAdministrativePlaceHolderFilter",
                                )}
                                optionLabel="libelle"
                                disabled
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="planClassement">
                                Plan de classement
                            </label>
                            <Dropdown
                                showClear
                                id="planClassementDropdown"
                                value={item.planClassement}
                                options={planClassements}
                                onChange={(e) => onDropdownChange(e, "planClassement")}
                                placeholder={item.planClassement.libelle}
                                filter
                                filterPlaceholder="planClassementPlaceHolderFilter"
                                optionLabel="libelle"
                                disabled
                            />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="description">{t("document.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea
                                    id="description"
                                    value={item.description}
                                    onChange={(e) => onInputTextChange(e, "description")}
                                    rows={5}
                                    cols={30}
                                />
                            </span>
                        </div>
                        <div className="field col-2">
                            <label htmlFor="archivagePhysique">Archivage Physique</label>
                            <span className="p-float-label">
                                <InputSwitch
                                    //  checked={item.ligne == null && item.colonne == null}
                                    checked={ isArchivagePhysiqueChecked}
                                    onChange={handleArchivagePhysiqueSwitchChange}
                                />
                            </span>
                        </div>
                        {isArchivagePhysiqueChecked &&(
                            <>
                                <div className="field col-3">
                                    <label htmlFor="ligne">Row</label>
                                    <InputNumber
                                        id="ligne"
                                        name="ligne"
                                        showButtons
                                        min={0}
                                        value={item.ligne ? item.ligne : 0}
                                        onChange={(e) => onInputNumerChange(e, "ligne")}

                                        
                                        //onChange={(e) => setLigne(e.value ?? null)}
                                    />
                                </div>
                                <div className="field col-3">
                                    <label htmlFor="colonne">Colonne</label>
                                    <InputNumber
                                        id="colonne"
                                        name="colonne"
                                        showButtons
                                        min={0}
                                        value={item.colonne ? item.colonne : 0}
                                        onChange={(e) => onInputNumerChange(e, "colonne")}

                                        //onChange={(e) => setColonne(e.value ?? null)}
                                    />
                                </div>
                                <div className="field col-3">
                                    <label htmlFor="numBoite">N° Boite</label>
                                    <InputNumber
                                        id="numBoite"
                                        name="numBoite"
                                        showButtons
                                        min={0}
                                        value={item.numBoite ? item.numBoite : 0}
                                        onChange={(e) => onInputNumerChange(e, "numBoite")}

                                        
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </TabPanel>
                <TabPanel header={t("document.documentIndexElements")}>
                    <div>
                        <div className="grid">
                            <div className="field col-12">
                                <label htmlFor="content">{t("document.content")}</label>
                                <span className="p-float-label">
                                    <InputTextarea id="content" value={item.content}
                                        onChange={(e) => onInputTextChange(e, 'content')} rows={15} cols={30} />
                                </span>
                            </div>
                            <div className="field col-4">
                                <label htmlFor="indexElement">
                                    {t("documentIndexElement.indexElement")}
                                </label>
                                <Dropdown
                                    id="indexElementDropdown"
                                    value={documentIndexElements.indexElement}
                                    options={indexElements}
                                    onChange={(e) =>
                                        onDropdownChangeDocumentIndexElements(e, "indexElement")
                                    }
                                    placeholder={t(
                                        "documentIndexElement.indexElementPlaceHolder",
                                    )}
                                    filter
                                    filterPlaceholder={t(
                                        "documentIndexElement.indexElementPlaceHolderFilter",
                                    )}
                                    optionLabel="libelle"
                                    autoFocus
                                />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="value">{t("documentIndexElement.value")}</label>
                                <InputTextarea
                                    id="value"
                                    value={documentIndexElements.value}
                                    onChange={(e) =>
                                        onInputTextChangeDocumentIndexElements(e, "value")
                                    }
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !item.documentIndexElements,
                                    })}
                                    rows={4}
                                />
                            </div>
                            {/* <div className="field col-12">
                                    <label htmlFor="description">{t("documentIndexElement.description")}</label>
                                    <InputText id="description" value={documentIndexElements.description} onChange={(e) => onInputTextChangeDocumentIndexElements(e, 'description')} required className={classNames({ 'p-invalid': submitted && !item.documentIndexElements })} />
                                </div> */}
                            <div className="field col-2">
                                <Button raised
                                    icon="pi pi-plus"
                                    label={t("save")}
                                    onClick={addDocumentIndexElements}
                                />
                            </div>
                        </div>
                        <div className="card">
                            <DataTable
                                value={item.documentIndexElements}
                                tableStyle={{ minWidth: "50rem" }}
                                dataKey="id"
                            >
                                <Column
                                    field="indexElement.libelle"
                                    header={t("documentIndexElement.indexElement")}
                                ></Column>
                                <Column
                                    field="value"
                                    header={t("documentIndexElement.value")}
                                ></Column>
                                <Column
                                    field="description"
                                    header={t("documentIndexElement.description")}
                                    hidden
                                ></Column>
                                <Column
                                    header={t("actions")}
                                    body={(rowData) => (
                                        <div>
                                            <Button raised
                                                icon="pi pi-times"
                                                severity="warning"
                                                className="mr-2 p-button-danger"
                                                onClick={() => deleteDocumentIndexElements(rowData)}
                                            />
                                            <Button raised
                                                icon="pi pi-pencil"
                                                severity="success"
                                                className="mr-2"
                                                onClick={() => editDocumentIndexElements(rowData)}
                                            />
                                        </div>
                                    )}
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default Edit;
