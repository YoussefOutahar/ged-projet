import { MessageService } from 'app/zynerator/service/MessageService';
import dynamic from "next/dynamic";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Steps } from 'primereact/steps';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const DWT = dynamic(() => import('app/component/dwt/DynamsoftSDK'), { ssr: false });

import { DocumentCriteria } from "app/controller/criteria/DocumentCriteria.model";
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { DocumentIndexElementDto } from 'app/controller/model/DocumentIndexElement.model';
import { DocumentTagDto } from 'app/controller/model/DocumentTag.model';
import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { TagDto } from 'app/controller/model/Tag.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";
import {
    DocumentCategorieIndexAdminService
} from "../../../../../../controller/service/admin/DocumentCategorieIndexAdminService.service";
import axios from 'axios';
import axiosInstance from 'app/axiosInterceptor';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import { PDFDocument } from 'pdf-lib';
import { ProgressBar } from 'primereact/progressbar';
import useFeatureFlags from 'app/component/admin/view/featureFlag/list/FeatureFlagsComponent';
import useDocCategorieStore from 'Stores/DocumentCategorieStore';
import useDocTypeStore from 'Stores/DocumentTypeStore';
import useDocumentStateStore from 'Stores/DocumentStateStore';
import useUtilisateurStore from 'Stores/Users/UtilsateursStore';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import useEntiteAdministrativesStore from 'Stores/EntiteAdministrativesStore';
import useIndexElementsStore from 'Stores/IndexElementsStore';
import usePlanClassementStore from 'Stores/PlanClassementStore';
import FileViewer from '../preview/FileViewer';


type DocumentCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: DocumentDto[],
    service: DocumentAdminService,
    t: TFunction
}
const Ai: React.FC<DocumentCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {
    const [selectedLangue, setSelectedLangue] = useState<Langue | null>(null);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [showContent, setShowContent] = useState<boolean>(false);

    const langues = [
        { name: 'Français', code: 'fra' },
        { name: 'Anglais', code: 'eng' },
        { name: 'Arabe', code: 'ara' },
        { name: 'Arabe/Français', code: 'fra+ara' },
        { name: 'Tous', code: 'fra+ara+eng' }
    ];
    type Langue = typeof langues[number];

    const [touchedInputs, setTouchedInputs] = useState<Record<string, boolean>>({});

    const handleInputClick = (inputName: string) => {
        setTouchedInputs({ ...touchedInputs, [inputName]: true });
    };

    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.reference == '')
            errorMessages.push("reference Obligatoire")
        if (item.documentType == undefined || item.documentType.libelle.trim() === '')
            errorMessages.push("documentType Obligatoire")
        if (item.documentState == undefined || item.documentState.libelle.trim() === '')
            errorMessages.push("documentState Obligatoire")
        if (item.documentCategorie == undefined || item.documentCategorie.libelle.trim() === '')
            errorMessages.push("documentCategorie Obligatoire")
        if (item.entiteAdministrative == undefined || item.entiteAdministrative.libelle.trim() === '')
            errorMessages.push("entiteAdministrative Obligatoire")
        if (item.utilisateur == undefined || item.utilisateur.nom.trim() === '')
            errorMessages.push("documentState utilisateur")
        if (item.planClassement == undefined || item.planClassement.libelle.trim() === '')
            errorMessages.push("planClassement Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new DocumentDto();
    const {
        item,
        setItem,
        submitted,
        setSubmitted,
        activeIndex,
        setActiveIndex,
        activeTab,
        setActiveTab,
        onInputTextChange,
        onInputDateChange,
        onInputNumerChange,
        onMultiSelectChange,
        onBooleanInputChange,
        onTabChange,
        onDropdownChange,
        hideDialog,
        saveItem,
        formateDate
    } = useCreateHook<DocumentDto, DocumentCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [uploadedFile, setUploadedFile] = useState<Blob>(new Blob());
    const utilisateurs = useUtilisateurStore(state => state.utilisateurs);
    const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
    const { documentTypes, documentType } = useDocTypeStore(state => ({ documentTypes: state.types, documentType: state.type }));
    const {indexElements, setIndexElements} = useIndexElementsStore(state => ({indexElements: state.indexElements, setIndexElements: state.setIndexElements}));
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {documentStates,documentState} = useDocumentStateStore(state => ({documentStates: state.states, documentState: state.state}));

    const [documentIndexElements, setDocumentIndexElements] = useState<DocumentIndexElementDto>(new DocumentIndexElementDto());
    
    const {planClassementsNoArchive: plans} = usePlanClassementStore();

    const documentCategorieIndexAdminService = new DocumentCategorieIndexAdminService();
    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const [isArchivagePhysiqueChecked, setIsArchivagePhysiqueChecked] = useState(false);
    const [isOCRChecked, setIsOCRChecked] = useState(false);
    const [isOcrSpecChecked, setIsOcrSpecChecked] = useState(false);
    const [isOCRDone, setIsOCRDone] = useState(false);
    const [isOCRnotDone, setIsOCRnotDone] = useState(false);

    const items = [
        {
            label: t('document.scanDocument')
        },
        {
            label: t('document.informations')
        },
        {
            label: t('document.champsIndexation')
        },
    ];

    const connectedUser = useConnectedUserStore(state => state.connectedUser);

    const fileUploadRef = useRef(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>();
    const [filesUploaded, setFilesUploaded] = useState(false);
    const { featureFlags, isActiveFront } = useFeatureFlags();
    const [OCR_URL, setOCR_URL] = useState<string>('');
    const [runOCR, setRunOCR] = useState<boolean>(false);

    useEffect(() => {
        const feature = isActiveFront('ocr');
        const withOCR = isActiveFront('runOcr');
        setRunOCR(withOCR);
        if (feature) {
            const OCR_URL = `${process.env.NEXT_PUBLIC_ADMIN_URL}document/ocr`;
            setOCR_URL(OCR_URL);
        } else {
            const OCR_URL = `${process.env.NEXT_PUBLIC_OCR_GDP_URL}`;
            setOCR_URL(OCR_URL);
        }
    }, [featureFlags])

    useEffect(() => {
        if (connectedUser) {
            setItem(prevItem => ({
                ...prevItem,
                utilisateur: connectedUser,
                entiteAdministrative: connectedUser.entiteAdministrative,
            }));
        }
    }, [connectedUser]);

    useEffect(() => {
        setItem({ ...item, size: uploadedFile.size });
        const localFileUrl = URL.createObjectURL(uploadedFile);
        setFileUrl(localFileUrl);
    }, [uploadedFile])

    const handleArchivagePhysiqueSwitchChange = (e: InputSwitchChangeEvent) => {
        setIsArchivagePhysiqueChecked(e.value ?? false);
    };
    const handleOcrSpecSwitchChange = (e: InputSwitchChangeEvent) => {
        setIsOcrSpecChecked(e.value ?? false);
    };
    const handleOCRSwitchChange = (e: InputSwitchChangeEvent) => {
        setIsOCRChecked(e.value ?? false);
    };

    const prepareDocumentTag = (tag: TagDto) => {
        const documentTag = new DocumentTagDto();
        documentTag.tag = tag;
        return documentTag;
    }

    const saveItemOverride = () => {
        setLoading(true);
        const documentFormData = new FormData();
        if (!isOCRChecked) {
            documentFormData.append("file", uploadedFile);
            documentFormData.append("documentDTO", JSON.stringify(item));

            setSubmitted(true);
            if (isFormValid()) {
                service.saveFormData(documentFormData).then(({ data }) => {
                    add();
                    MessageService.showSuccess(showToast, t('success.creation'), t('success.creationSuccess'));
                    setLoading(false);
                    onClose();
                    setSubmitted(false);
                    window.location.reload();
                });
            }
        } else {
            if (!filesUploaded) {
                MessageService.showError(showToast, t('error.error'), t('error.uploadDocumentFirst'));
                return;
            }
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (file instanceof Blob) {
                        documentFormData.append('file', file);
                        documentFormData.append("documentDTO", JSON.stringify(item));
                    }
                })
                setSubmitted(true); service.saveFormData(documentFormData).then(({ data }) => {
                    add();
                    MessageService.showSuccess(showToast, t('success.creation'), t('success.creationSuccess'));
                    setLoading(false);
                    onClose();
                    setSubmitted(false);
                    window.location.reload();
                });
                if (isFormValid()) {

                }
            }
        }
    }
    const [errors, setErrors] = useState({ indexElement: false, value: false });
    const addDocumentIndexElements = () => {
        setSubmitted(true);
        if (documentIndexElements.indexElement.libelle.trim() === '') {
            setErrors(prevState => ({ ...prevState, indexElement: true }));
        } else {
            setErrors(prevState => ({ ...prevState, indexElement: false }));
        }
        if (!documentIndexElements.value) {
            setErrors(prevState => ({ ...prevState, value: true }));
        } else {
            setErrors(prevState => ({ ...prevState, value: false }));
        }
        if (documentIndexElements.indexElement.libelle.trim() === '' || !documentIndexElements.value) {
            return;
        }
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

    const deleteDocumentIndexElements = (rowData: any) => {
        const updatedItems = item.documentIndexElements.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentIndexElements: updatedItems }));
        setDocumentIndexElements(new DocumentIndexElementDto());
    };

    const onDropdownChangeDocumentIndexElements = (e: any, field: string) => {
        setDocumentIndexElements((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onInputTextChangeDocumentIndexElements = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDocumentIndexElements({ ...documentIndexElements, [name]: val })
    };
    const getPagePDFDoc = async (inputFile: any, pageNumber: number) => {
        const pdfDoc = await PDFDocument.load(await inputFile.arrayBuffer());
        const newDoc = await PDFDocument.create();
        const copiedPage = await newDoc.copyPages(pdfDoc, [pageNumber - 1]);
        newDoc.addPage(copiedPage[0]);
        const pageBytes = await newDoc.save();
        return new Blob([pageBytes], { type: 'application/pdf' });
    }
    const getPagesPDFDoc = async (inputFile: any, startPageNumber: number, endPageNumber: number) => {
        const pdfDoc = await PDFDocument.load(await inputFile.arrayBuffer());
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdfDoc, Array.from({ length: endPageNumber - startPageNumber + 1 }, (_, i) => i + startPageNumber - 1));
        copiedPages.forEach(page => newDoc.addPage(page));
        const pageBytes = await newDoc.save();
        return new Blob([pageBytes], { type: 'application/pdf' });
    };
    const classifyExtractedText = async (extractedText: string) => {
        try {
            const requestBody = {
                content: extractedText
            };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/classify-ai/`, requestBody)
            if (response.data && response.data.predicted_category) {
                return response.data.predicted_category;
            }
        } catch (error) {
            console.error('An error occurred while classifying extracted text:', error);
        }
    }
    const handleNextStep = async () => {
        setLoadingAI(true);
        if (activeIndex === 0) {
            if (item.documentIndexElements == null) {
                item.documentIndexElements = new Array<DocumentIndexElementDto>();
            }
            try {
                const formData = new FormData();
                if (!isOCRChecked) {
                    if (uploadedFile instanceof Blob) {
                        if (isOcrSpecChecked) {
                            const blob = await getPagesPDFDoc(uploadedFile, startPage, endPage);
                            formData.append('file', blob);
                            if (selectedLangue) {
                                formData.append('language', encodeURIComponent(selectedLangue.code));
                            }
                        } else {
                            formData.append('file', uploadedFile);
                            formData.append('language', encodeURIComponent('fra+ara'));
                        }
                        if(runOCR){
                        axios.post(`${OCR_URL}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data', 'Accept-Charset': 'UTF-8',
                            }
                        }).then(({ data }) => {
                            const itemClone = { ...item };
                            itemClone.content = data;
                            documentState && (itemClone.documentState = documentState);
                            documentType && (itemClone.documentType = documentType);
                            setItem(itemClone);
                            setIsOCRDone(true);
                            classifyExtractedText(data)
                                .then((predictedCategory) => {
                                    if (predictedCategory) {
                                        documentCategorieAdminService.getDocumentCategorieBylibelle(predictedCategory)
                                            .then(({ data }) => {
                                                if (data) {
                                                    const newItem = { ...itemClone, documentCategorie: data };
                                                    setItem(newItem);
                                                }
                                            })
                                            .catch(error => console.log(error));
                                    }
                                })
                                .catch((error) => {
                                    console.error('An error occurred while classifying extracted text:', error);
                                });
                        }).catch((error) => {
                            setIsOCRDone(true);
                            setIsOCRnotDone(true);
                        })
                    } else {
                        const itemClone = { ...item };
                        documentState && (itemClone.documentState = documentState);
                        documentType && (itemClone.documentType = documentType);
                        setItem(itemClone);
                        setIsOCRDone(true);
                    }
                    } else {
                        console.error('Invalid file format or file not available.');
                    }
                } else {
                    if (!filesUploaded) {
                        MessageService.showError(showToast, t('error.error'), t('error.uploadDocumentFirst'));
                        return;
                    }
                    const formIA = new FormData();
                    if (files && files.length > 0) {
                        for (const file of files) {
                            if (file instanceof Blob) {
                                if (isOcrSpecChecked) {
                                    if (selectedLangue) {
                                        formData.append('language', encodeURIComponent(selectedLangue.code));
                                    }
                                    const blob = await getPagesPDFDoc(file, startPage, endPage);
                                    formData.append('file', blob);
                                    formIA.append('file', file);
                                } else {
                                    formData.append('file', file);
                                    formData.append('language', encodeURIComponent('fra+ara'));
                                    formIA.append('file', file);
                                }
                            }
                        }
                        const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/upload-ai/`, formIA,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                        if (response) {
                            setLoadingAI(false);
                        } else {
                            setLoadingAI(false);
                        }

                        const { data } = response;
                        for (const [key, value] of Object.entries(data)) {
                            const documentIndexElement = new DocumentIndexElementDto();
                            documentIndexElement.value = value as string;
                            documentIndexElement.indexElement = new IndexElementDto();
                            documentIndexElement.indexElement.libelle = key;

                            item.documentIndexElements.push(documentIndexElement);
                        }
                        setItem((prevState: any) => ({ ...prevState, documentIndexElements: item.documentIndexElements }));
                        if(runOCR){
                            axios.post(`${OCR_URL}`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data', 'Accept-Charset': 'UTF-8',
                                }
                            }).then(({ data }) => {
                                const itemClone = { ...item };
                                itemClone.content = data;
                                documentState && (itemClone.documentState = documentState);
                                documentType && (itemClone.documentType = documentType);
                                itemClone.size = (files[0].size / (1000 * 1000));
                                setItem(itemClone);
                                setIsOCRDone(true);
                                classifyExtractedText(data)
                                    .then((predictedCategory) => {
                                        if (predictedCategory) {
                                            documentCategorieAdminService.getDocumentCategorieBylibelle(predictedCategory)
                                                .then(({ data }) => {
                                                    if (data) {
                                                        const newItem = { ...itemClone, documentCategorie: data };
                                                        setItem(newItem);
                                                    }
                                                })
                                                .catch(error => console.log(error));
                                        }
                                    })
                                    .catch((error) => {
                                        console.error('An error occurred while classifying extracted text:', error);
                                    });
                            }).catch((error) => {
                                setIsOCRDone(true);
                                setIsOCRnotDone(true);
                            })
                        }else{
                            const itemClone = { ...item };
                            documentState && (itemClone.documentState = documentState);
                            documentType && (itemClone.documentType = documentType);
                            itemClone.size = (files[0].size / (1000 * 1000));
                            setItem(itemClone);
                            setIsOCRDone(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la requête OCR :", error);
            }
            // try{
            //     const formData = new FormData();
            //     formData.append('file', uploadedFile, 'file.pdf');
            //     formData.append("documentDTO", JSON.stringify(item));
            //     const response = await axios.post('https://demo-ia.digiged.com/uploadfile',
            //         formData,
            //         {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data',
            //             },
            //         });
            //     const { data } = response;
            //     for (const [key, value] of Object.entries(data)) {
            //         const documentIndexElement = new DocumentIndexElementDto();
            //         documentIndexElement.value = value as string;
            //         documentIndexElement.indexElement = new IndexElementDto();
            //         documentIndexElement.indexElement.libelle = key;

            //         item.documentIndexElements.push(documentIndexElement);
            //     }
            //     setItem((prevState: any) => ({ ...prevState, documentIndexElements: item.documentIndexElements }));
            // }catch (error) {
            //     console.error("Erreur lors de l'indexation des champs file :", error);
            // }
        }
        setActiveIndex((prevState) => prevState + 1);
    }
    const handleLoadDocument = () => {
        setIsOCRChecked(true);
    }
    const handleScanDocument = () => {
        setIsOCRChecked(false);
    }
    const [loading, setLoading] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    const itemDialogFooter = (
        <div>
            {(activeIndex == 1 || activeIndex == 2) && <Button raised severity="secondary" icon="pi pi-step-backward-alt" label={t("previous")} onClick={() => setActiveIndex((prevState) => prevState - 1)} />}
            {activeIndex < 2 && <Button
                raised severity="secondary"
                icon="pi pi-step-forward-alt"
                loading={loadingAI}
                label={t("document.suivant")} onClick={handleNextStep}
                disabled={activeIndex === 0 && uploadedFile.size === 0 && filesUploaded === false}
            />}

            {activeIndex === 2 && <Button raised label={t("save")} icon="pi pi-check" loading={loading} onClick={saveItemOverride} />}
        </div>
    );

    const onCategorieChange = (e: DropdownChangeEvent, field: string) => {
        setItem((prevState) => ({ ...prevState, [field]: e.value }));
        if (e.value && e.value.id) {
            documentCategorieIndexAdminService.findByDocumentCategorieId(e.value.id)
                .then(({ data }) => setIndexElements(data.map(e => e.indexElement)))
                .catch(error => console.log(error));
        }
    };
    const handleFileUpload = (e: any) => {
        const files = e.files;
        const fileUrl = e.files && e.files[0];
        setFiles(files);
        setFilesUploaded(true);
        MessageService.showSuccess(showToast, 'chargement', t('success.uploadSuccess', { totalRecords: files.length }));
        if (fileUrl) {
            const localFileUrl = URL.createObjectURL(fileUrl);
            setFileUrl(localFileUrl);
        }
    };
    const HideDialogReload = () => {
        hideDialog();
        window.location.reload();
    }

    return (
        <Dialog visible={visible} closeOnEscape maximizable style={{ width: '85vw' }} header={
            <>
                {t("document.tabPan")}
                <Steps className='mt-2' activeIndex={activeIndex} model={items} onSelect={(event) => onTabChange(event)} readOnly />
            </>
        } modal className="p-fluid" footer={itemDialogFooter} onHide={HideDialogReload}>
            <div className={`mt-4 mb-2 ${activeIndex !== 0 && 'hidden'}`}>
                <div className="field col-12 text-center">
                    <span className="p-float-label justify-content-center">
                        <Button label={t("document.chargerDocument")} icon="pi pi-upload" className="p-button-success w-4" onClick={handleLoadDocument} />
                        <Button label={t("document.scanDocument")} icon="pi pi-camera" className="p-button-help w-4 ml-2" onClick={handleScanDocument} />
                    </span>
                </div>
                <div className='flex col-12 '>
                    <div className="field col-3">
                        <label htmlFor="OCR">Specifecation d'OCR</label>
                        <span className="p-float-label">
                            <InputSwitch
                                checked={isOcrSpecChecked}
                                onChange={handleOcrSpecSwitchChange}
                            />
                        </span>
                    </div>
                    {isOcrSpecChecked && (
                        <>
                            <div className="field col-3">
                                <label htmlFor="page">Start Page</label>
                                <InputNumber
                                    id="StartPage"
                                    name="StartPage"
                                    showButtons
                                    min={0}
                                    value={startPage}
                                    onChange={(e) => setStartPage(e.value != null ? e.value : 1)}
                                />
                            </div>
                            <div className="field col-3">
                                <label htmlFor="page">End Page</label>
                                <InputNumber
                                    id="EndPage"
                                    name="EndPage"
                                    showButtons
                                    min={0}
                                    value={endPage}
                                    onChange={(e) => setEndPage(e.value != null ? e.value : 1)}
                                />
                            </div>
                            <div className="field col-3">
                                <label htmlFor="langue">Langue</label>
                                <Dropdown value={selectedLangue}
                                    onChange={(e) => setSelectedLangue(e.value)}
                                    options={langues}
                                    optionLabel="name"
                                    placeholder="Select a langue"
                                />
                            </div>
                        </>
                    )}
                </div>
                {isOCRChecked ? (
                    <div className="field col-12">
                        <FileUpload
                            ref={fileUploadRef}
                            name="files[]"
                            customUpload // change status file in upload to completed
                            uploadHandler={handleFileUpload}
                            chooseLabel={t('choose')}
                            uploadLabel={t('upload')}
                            cancelLabel={t('cancel')}
                            emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
                        />
                        {fileUrl && (
                            <div className='overflow-auto'>
                                <h4> </h4>
                                <FileViewer file={fileUrl}  height={700} />
                            </div>
                        )}
                    </div>
                ) : (
                    <DWT setUploadedFile={setUploadedFile} features={[
                        "scan",
                        //"load",
                        "save",
                        "upload",
                        "uploader"
                    ]}
                    />)}
            </div>
            <div className={`m-4 ${activeIndex !== 1 && 'hidden'}`}>
                <div className="formgrid grid">
                    {!isOCRDone &&
                        <div className='field col-12'>
                            <label>Numérisation de texte OCR</label>
                            <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
                        </div>
                    }
                    {isOCRnotDone &&
                        <div className='field col-12'>
                            <span className='pi pi-exclamation-triangle text-red-600'>{' '}</span>
                            <label className='text-red-600'>Numérisation de texte OCR n'a pas été exécutée avec succès!</label>
                        </div>
                    }
                    <div className="field col-4">
                        <label htmlFor="reference">{t("document.reference")}</label>
                        <InputText id="reference" value={item.reference}
                            onChange={(e) => onInputTextChange(e, 'reference')} required
                            onClick={() => handleInputClick('reference')}
                            className={classNames({ 'p-invalid': touchedInputs.reference && !item.reference })} autoFocus disabled={!isOCRDone} />
                        {touchedInputs.reference && !item.reference &&
                            <small className="p-invalid p-error font-bold">Reference Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentType">{t("document.documentType")}</label>
                        <Dropdown showClear id="documentTypeDropdown" value={item.documentType}
                            options={documentTypes} onChange={(e) => onDropdownChange(e, 'documentType')}
                            placeholder={t("document.documentTypePlaceHolder")} filter
                            filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                            onClick={() => handleInputClick('documentType')}
                            className={classNames({ 'p-invalid': !item.documentType && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone} />
                        {touchedInputs.documentType && !item.documentType &&
                            <small className="p-invalid p-error font-bold">Type du document Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentState">{t("document.documentState")}</label>
                        <Dropdown showClear id="documentStateDropdown" value={item.documentState}
                            options={documentStates} onChange={(e) => onDropdownChange(e, 'documentState')}
                            placeholder={t("document.documentStatePlaceHolder")} filter
                            filterPlaceholder={t("document.documentStatePlaceHolderFilter")}
                            onClick={() => handleInputClick('documentState')}
                            className={classNames({ 'p-invalid': !item.documentState && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone} />
                        {touchedInputs.documentState && !item.documentState &&
                            <small className="p-invalid p-error font-bold">État du document obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                        <Dropdown showClear id="documentCategorieDropdown" value={item.documentCategorie}
                            options={documentCategories}
                            onChange={(e) => onCategorieChange(e, 'documentCategorie')}
                            placeholder={t("document.documentCategoriePlaceHolder")} filter
                            filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                            onClick={() => handleInputClick('documentCategorie')}
                            className={classNames({ 'p-invalid': !item.documentCategorie && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone} />
                        {touchedInputs.documentCategorie && !item.documentCategorie &&
                            <small className="p-invalid p-error font-bold">Categorie du document Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                        <Calendar id="uploadDate" value={item.uploadDate}
                            onChange={(e) => onInputDateChange(e, 'uploadDate')} dateFormat="dd/mm/yy"
                            showIcon={true} disabled={!isOCRDone} />
                    </div>
                    <div className="field col-4">
                        <label htmlFor="size">{t("document.size")}</label>
                        <InputNumber id="size" value={item.size} onChange={(e) => onInputNumerChange(e, 'size')} disabled />
                    </div>
                    <div className="field col-4">
                        <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                        <Dropdown showClear id="utilisateurDropdown" value={item.utilisateur} options={utilisateurs}
                            onChange={(e) => onDropdownChange(e, 'utilisateur')}
                            placeholder={t("document.utilisateurPlaceHolder")} filter
                            onClick={() => handleInputClick('utilisateur')}
                            className={classNames({ 'p-invalid': !item.utilisateur && !isFormValid() })}
                            filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" disabled={!isOCRDone} />
                        {touchedInputs.utilisateur && !item.utilisateur &&
                            <small className="p-invalid p-error font-bold">Utilisateur Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label>
                        <Dropdown showClear id="entiteAdministrativeDropdown" value={item.entiteAdministrative}
                            options={entiteAdministratives}
                            onChange={(e) => onDropdownChange(e, 'entiteAdministrative')}
                            placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                            filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                            onClick={() => handleInputClick('entiteAdministrative')}
                            className={classNames({ 'p-invalid': !item.entiteAdministrative && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone} />
                        {touchedInputs.entiteAdministrative && !item.entiteAdministrative && !isFormValid() &&
                            <small className="p-invalid p-error font-bold">Entite Administrative Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="planClassement">{t("document.classificationPlan")} :</label>
                        <Dropdown showClear id="planClassementDropdown" value={item.planClassement}
                            options={plans}
                            onChange={(e) => onDropdownChange(e, 'planClassement')}
                            placeholder={t("document.classificationPlan")}
                            filter
                            filterPlaceholder="Plan de Classement"
                            onClick={() => handleInputClick('planClassement')}
                            className={classNames({ 'p-invalid': !item.planClassement && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone} />
                        {touchedInputs.planClassement && !item.planClassement &&
                            <small className="p-invalid p-error font-bold">Plan de Classement Obligatoire.</small>}
                    </div>
                    <div className="field col-12">
                        <label htmlFor="description">{t("document.description")}</label>
                        <span className="p-float-label">
                            <InputTextarea id="description" value={item.description}
                                onChange={(e) => onInputTextChange(e, 'description')} rows={5}
                                cols={30} disabled={!isOCRDone} />
                        </span>
                    </div>
                    <div className="field col-2">
                        <label htmlFor="archivagePhysique">{t("appBar.archive")}</label>
                        <span className="p-float-label">
                            <InputSwitch
                                checked={isArchivagePhysiqueChecked}
                                onChange={handleArchivagePhysiqueSwitchChange}
                                disabled={!isOCRDone}
                            />
                        </span>
                    </div>
                    {isArchivagePhysiqueChecked && (
                        <>
                            <div className="field col-3">
                                <label htmlFor="ligne">{t("document.line")}</label>
                                <InputNumber
                                    id="ligne"
                                    name="ligne"
                                    showButtons
                                    min={0}
                                    value={item.ligne}
                                    onChange={(e) => onInputNumerChange(e, 'ligne')}
                                />
                            </div>
                            <div className="field col-3">
                                <label htmlFor="colonne">{t("document.colone")}</label>
                                <InputNumber
                                    id="colonne"
                                    name="colonne"
                                    showButtons
                                    min={0}
                                    value={item.colonne}
                                    onChange={(e) => onInputNumerChange(e, 'colonne')}
                                />
                            </div>
                            <div className="field col-3">
                                <label htmlFor="numBoite">{t("document.boite")}</label>
                                <InputNumber
                                    id="numBoite"
                                    name="numBoite"
                                    showButtons
                                    min={0}
                                    value={item.numBoite}
                                    onChange={(e) => onInputNumerChange(e, 'numBoite')}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className={`m-4 ${activeIndex !== 2 && 'hidden'}`}>
                <div>
                    <div className="grid">
                        <div className="field col-8">
                        {!showContent ? (
                                <Button raised icon="pi pi-align-justify" label='show Content'
                                    className=" mr-2" severity="info" onClick={() => {setShowContent(!showContent)}} />
                            ):(
                                <Button raised icon="pi pi-file" label='show Pdf'
                                    className=" mr-" severity="secondary" onClick={() => {setShowContent(!showContent)}} />
                            )}
                            {!showContent ? (
                                fileUrl && (
                                    <div className='overflow-auto'>
                                        <h4> </h4>
                                        <FileViewer file={fileUrl}  height={700} />
                                    </div>
                                )
                            ):(
                                <>
                                    <label htmlFor="content">{t("document.content")}</label>
                                    <span className="p-float-label">
                                        <InputTextarea id="content" value={item.content}
                                            onChange={(e) => onInputTextChange(e, 'content')} rows={15} cols={30} />
                                    </span>
                                </>

                            )}
                        </div>
                        <div className="field col-4">
                            <div className="field col-12">
                                <label htmlFor="indexElement">{t("documentIndexElement.indexElement")}</label>
                                <Dropdown id="indexElementDropdown" value={documentIndexElements.indexElement}
                                    options={indexElements}
                                    onChange={(e) => onDropdownChangeDocumentIndexElements(e, 'indexElement')}
                                    placeholder={t("documentIndexElement.indexElementPlaceHolder")} filter
                                    filterPlaceholder={t("documentIndexElement.indexElementPlaceHolderFilter")}
                                    className={classNames({ 'p-invalid': touchedInputs.value && errors.value })}
                                    optionLabel="libelle" autoFocus onClick={() => handleInputClick('indexElement')} />
                                {errors.indexElement && <small className="p-invalid p-error font-bold">Index Element is required</small>}
                            </div>
                            <div className="field col-12">
                                <label htmlFor="value">{t("documentIndexElement.value")}</label>
                                <InputTextarea id="value" value={documentIndexElements.value}
                                    onChange={(e) => onInputTextChangeDocumentIndexElements(e, 'value')}
                                    className={classNames({ 'p-invalid': touchedInputs.value && errors.value })}
                                    rows={5} onClick={() => handleInputClick('value')} />
                                {errors.value && <small className="p-invalid p-error font-bold">Value is required</small>}
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
                            {/* <Button raised  icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDocumentIndexElements(rowData)} />  */}
                        </div>)}></Column>
                    </DataTable>
                </div>
            </div>
        </Dialog >
    );
};
export default Ai;
