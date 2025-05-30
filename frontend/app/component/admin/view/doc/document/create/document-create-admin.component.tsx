import { MessageService } from 'app/zynerator/service/MessageService';
import dynamic from "next/dynamic";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
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
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";
import {
    DocumentCategorieIndexAdminService
} from "app/controller/service/admin/DocumentCategorieIndexAdminService.service";
import axios, { AxiosRequestConfig } from 'axios';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import { PDFDocument } from 'pdf-lib';
import { ProgressBar } from 'primereact/progressbar';
import useFeatureFlags from 'app/component/admin/view/featureFlag/list/FeatureFlagsComponent';
import { convertDocxToPdf, convertXlsxToPdf } from 'app/component/admin/view/doc/ConvertFile/convert-file';
import { DocumentSummaryDto } from 'app/controller/model/DocumentSummary.model';
import { DocumentIndexElementSummaryDto } from 'app/controller/model/DocumentIndexElementSummary.model';
import useDocCategorieStore from 'Stores/DocumentCategorieStore';
import useDocTypeStore from 'Stores/DocumentTypeStore';
import useDocumentStateStore from 'Stores/DocumentStateStore';
import useUtilisateurStore from 'Stores/Users/UtilsateursStore';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import useEntiteAdministrativesStore from 'Stores/EntiteAdministrativesStore';
import useIndexElementsStore from 'Stores/IndexElementsStore';
import { uploadFileInChunks } from 'app/controller/service/admin/uploadFileInChunks';
import FileViewer from 'app/component/admin/view/doc/document/preview/FileViewer';
import { associateDocumentType, getDocumentTypeFromFileUrl, getTypeAliases, typeIsValide } from 'app/utils/documentUtils';


type DocumentCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: DocumentDto[],
    service: DocumentAdminService,
    t: TFunction,
    plan? : any,

}
const Create: React.FC<DocumentCreateAdminType> = ({ visible,plan, onClose, add, showToast, list, service, t }) => {
    const [selectedLangue, setSelectedLangue] = useState<Langue | null>(null);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
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
        if(item.documentType == undefined || item.documentType.libelle.trim() === '')
            errorMessages.push("documentType Obligatoire")
        if(item.documentState == undefined || item.documentState.libelle.trim() === '')
            errorMessages.push("documentState Obligatoire")
        if(item.documentCategorie == undefined || item.documentCategorie.libelle.trim() === '')
            errorMessages.push("documentCategorie Obligatoire")
        if(item.entiteAdministrative == undefined || item.entiteAdministrative.libelle?.trim() === '')
            errorMessages.push("entiteAdministrative Obligatoire")
        if(item.utilisateur == undefined || item.utilisateur.nom.trim() === '')
            errorMessages.push("documentState utilisateur")
        if(item.planClassement == undefined || item.planClassement.libelle?.trim() === '')
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




    useEffect(() => {
        setItem((prevState) => ({ ...prevState, planClassement: plan }));
    }, [plan]);

    const [uploadedFile, setUploadedFile] = useState<Blob>(new Blob());
    const utilisateurs = useUtilisateurStore(state => state.utilisateurs);
    const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
    const { documentTypes, documentType } = useDocTypeStore(state => ({ documentTypes: state.types, documentType: state.type }));
    const {indexElements, setIndexElements} = useIndexElementsStore(state => ({indexElements: state.indexElements, setIndexElements: state.setIndexElements}));
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {documentStates,documentState} = useDocumentStateStore(state => ({documentStates: state.states, documentState: state.state6}));

    const [documentIndexElements, setDocumentIndexElements] = useState<DocumentIndexElementDto>(new DocumentIndexElementDto());

    const documentCategorieIndexAdminService = new DocumentCategorieIndexAdminService();

    const [isArchivagePhysiqueChecked, setIsArchivagePhysiqueChecked] = useState(false);
    const [isOCRChecked, setIsOCRChecked] = useState(true);
    const [isOcrSpecChecked, setIsOcrSpecChecked] = useState(false);
    const [isOCRDone, setIsOCRDone] = useState(false);
    const [isOCRnotDone, setIsOCRnotDone] = useState(false);
    const [chunkFile, setChunkFile] = useState<boolean>(false);

    const [featureBarreCode, setFeatureFlagsBarreCode ] = useState<boolean>(false);
    const [loadingfeatureBarreCode, setLoadingfeatureBarreCode] = useState(false);
    const [values, setValues] = useState<{numPage: number,value: string}[]>([]);
    const { featureFlags, isActiveBack, isActiveFront} = useFeatureFlags();
    const [OCR_URL, setOCR_URL] = useState<string>('');
    const [runOCR, setRunOCR] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);
    useEffect(() => {
        const feature = isActiveFront('ocr');
        const withOCR = isActiveFront('runOcr');
        const chunkfile = isActiveFront('chunkFile');
        setFeatureFlagsBarreCode(isActiveFront('barreCode'));

        setRunOCR(withOCR);
        setChunkFile(chunkfile);
        if(feature){
            const OCR_URL = `${process.env.NEXT_PUBLIC_ADMIN_URL}document/ocr`;
            setOCR_URL(OCR_URL);
        }else{
            const OCR_URL = `${process.env.NEXT_PUBLIC_OCR_GDP_URL}`;
            setOCR_URL(OCR_URL);
        }
    },[featureFlags])


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
    }, [uploadedFile])

    useEffect(() => {
        if(files && files.length > 0){
            const localFileUrl = URL.createObjectURL(files[0]);
            setFileUrl(localFileUrl);
        }
    }, [files]);

    const handleArchivagePhysiqueSwitchChange = (e: InputSwitchChangeEvent) => {
        setIsArchivagePhysiqueChecked(e.value ?? false);
    };
    const handleOcrSpecSwitchChange = (e : InputSwitchChangeEvent) => {
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

    const [loading, setLoading] = useState(false);

   const saveItemOverride = () => {
    setLoading(true);
    const documentFormData = new FormData();
    if (!isOCRChecked) {
        documentFormData.append("file", uploadedFile);
        documentFormData.append("documentDTO", JSON.stringify(item));

        setSubmitted(true);
        if (isFormValid()) {
            service.saveFormData(documentFormData)
                .then(({ data }) => {
                    add();
                    MessageService.showSuccess(showToast, t('success.creation'), t('success.creationSuccess'));
                    setLoading(false);
                    onClose();
                    setSubmitted(false);
                    HideDialogReload();
                    // window.location.reload();
                })
                .catch(error => {
                    console.error("Error saving form data: ", error);
                    MessageService.showError(showToast, t('error.error'), t('error.operationFailed'));
                    setLoading(false); 
                    setSubmitted(false); 
                });
        } else {
            setLoading(false); 
        }
    } else {
        if (!filesUploaded) {
            MessageService.showError(showToast, t('error.error'), t('error.uploadDocumentFirst'));
            setLoading(false); 
            return;
        }
        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file instanceof Blob) {
                    documentFormData.append('file', file);
                    documentFormData.append("documentDTO", JSON.stringify(item));
                }
            });
            setSubmitted(true);
            if (isFormValid()) {
                service.saveFormData(documentFormData)
                    .then(({ data }) => {
                        add();
                        MessageService.showSuccess(showToast, t('success.creation'), t('success.creationSuccess'));
                        setLoading(false);
                        onClose();
                        setSubmitted(false);
                        HideDialogReload();
                        // window.location.reload();
                    })
                    .catch(error => {
                        console.error("Error saving form data: ", error);
                        MessageService.showError(showToast, t('error.error'), t('error.operationFailed'));
                        setLoading(false); 
                        setSubmitted(false); 
                    });
            } else {
                setLoading(false); 
            }
        } else {
            setLoading(false); 
        }
    }
};

    // const [documentSummary, setDocumentSummary] = useState<DocumentSummaryDto>(new DocumentSummaryDto());
    const toDocumentSummary = (item: DocumentDto) => {
        const itemSummary = new DocumentSummaryDto();
        itemSummary.reference = item.reference;
        itemSummary.description = item.description;
        itemSummary.content = item.content;
        itemSummary.colonne = item.colonne;
        itemSummary.ligne = item.ligne;
        itemSummary.numBoite = item.numBoite;
        itemSummary.size = item.size;
        itemSummary.uploadDate = item.uploadDate.toString();
        itemSummary.documentStateId = item.documentState?.id;
        itemSummary.documentTypeId = item.documentType?.id;
        itemSummary.documentCategorieId = item.documentCategorie?.id;
        itemSummary.entiteAdministrativeId = item.entiteAdministrative.id || connectedUser!.entiteAdministrative.id;
        itemSummary.planClassementId = item.planClassement.id || plan.id;
        itemSummary.utilisateurId = item.utilisateur.id || connectedUser!.id;
        itemSummary.utilisateurEmail = item.utilisateur.email || connectedUser!.email;
        item.documentIndexElements.forEach(element => {
            const indexSummary = new DocumentIndexElementSummaryDto();
            indexSummary.indexElementId = element.indexElement?.id;
            indexSummary.value = element.value;
            indexSummary.description = element.description;
            itemSummary.documentIndexElements.push(indexSummary);
        });
        // setDocumentSummary(itemSummary);
        return itemSummary;
    }

    const onChunkUploadError = (error: any) => {
        console.error(error);
        MessageService.showError(showToast, t('error.error'), t('error.operation'));
        setLoading(false);
        setSubmitted(false);
        HideDialogReload();
    }

    const onChunkUploadSuccess = () => {
        MessageService.showSuccess(showToast, t('success.creation'), t('success.operation'));
        onClose();
        setLoading(false);
        setSubmitted(false);
        HideDialogReload();
    }


    const [progress, setProgress] = useState(0);

    const saveItemSummaryOverride = async () => {
        setLoading(true);
        setProgress(0);
    
        const documentFormData = new FormData();
        if (!isOCRChecked) {
            // feature flip
            if(chunkFile){
                const documentSummary = toDocumentSummary(item);
                setSubmitted(true);
                if (isFormValid()) {
                    uploadFileInChunks({
                        file: uploadedFile,
                        documentDto: documentSummary,
                        setProgress: setProgress,
                        onSuccess: onChunkUploadSuccess,
                        onError: onChunkUploadError
                    });
                }
            }else{
                documentFormData.append("file", uploadedFile);
                const documentSummary = toDocumentSummary(item);
                documentFormData.append("documentDTO", JSON.stringify(documentSummary));
                setSubmitted(true);
                if (isFormValid()) {
                    try {
                        let config: AxiosRequestConfig = {
                            onUploadProgress(progressEvent) {
                                const percentCompleted = progressEvent.total ? Math.floor((progressEvent.loaded * 100) / progressEvent.total) : 0;
                                setProgress(percentCompleted);
                            },
                        };

                        // No more progress simulation we only do the real stuff here
                        // for (let i = 0; i <= 90; i += 10) {
                        //     setTimeout(() => setProgress(i), i * 50);
                        // }
        
                        await service.saveFormDataSummary(documentFormData, config);
        
                        setProgress(100);
                        MessageService.showSuccess(showToast, t('success.creation'), t('success.creationSuccess'));
                    } catch (error) {
                        console.error("Error saving form data: ", error);
                        MessageService.showError(showToast, t('error.error'), t('error.operationFailed'));
                        setProgress(0); // Réinitialiser la progression en cas d'erreur
                    } finally {
                        setLoading(false);
                        setSubmitted(false);
                        onClose();
                        HideDialogReload();
                        // window.location.reload();
                    }
                }
            }
            
        } else {
            if (!filesUploaded) {
                MessageService.showError(showToast, t('error.error'), t('error.uploadDocumentFirst'));
                setLoading(false);
                return;
            }
            if (files && files.length > 0) {
                // feature flip
                if(chunkFile){
                    const documentSummary = toDocumentSummary(item);
                    if (isFormValid()) {
                        setSubmitted(true);
                        files.forEach((file) => {
                            if (file instanceof Blob) {
                                uploadFileInChunks({
                                    file:file, 
                                    documentDto:documentSummary,
                                    setProgress: setProgress,
                                    onSuccess: onChunkUploadSuccess,
                                    onError:onChunkUploadError
                                });
                            }
                        });
                    }
                }else{
                    files.forEach((file) => {
                        if (file instanceof Blob) {
                            documentFormData.append('file', file);
                            const documentSummary = toDocumentSummary(item);
                            documentFormData.append("documentDTO", JSON.stringify(documentSummary));
                        }
                    });
                    setSubmitted(true);
                    if (isFormValid()) {
                        try {
                            let config: AxiosRequestConfig = {
                                onUploadProgress(progressEvent) {
                                    const percentCompleted = progressEvent.total ? Math.floor((progressEvent.loaded * 100) / progressEvent.total) : 0;
                                    setProgress(percentCompleted);
                                },
                            };
    
                            // No more progress simulation we only do the real stuff here
                            // for (let i = 0; i <= 90; i += 10) {
                            //     setTimeout(() => setProgress(i), i * 50);
                            // }
        
                            // Attendez la réponse de l'endpoint
                            await service.saveFormDataSummary(documentFormData, config);
        
                            // Complétez la progression à 100%
                            setProgress(100);
                            MessageService.showSuccess(showToast, t('success.creation'), t('success.creationSuccess'));
                        } catch (error) {
                            console.error("Error saving form data: ", error);
                            MessageService.showError(showToast, t('error.error'), t('error.operationFailed'));
                            setProgress(0); // Réinitialiser la progression en cas d'erreur
                        } finally {
                            setLoading(false);
                            setSubmitted(false);
                            onClose();
                            HideDialogReload();
                            // window.location.reload();
                        }
                    }
                }
            }
        }
    };
    

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
        if (documentIndexElements.indexElement.libelle.trim() === ''|| !documentIndexElements.value) {
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
    const getPagePDFDoc = async (inputFile : any , pageNumber: number) => {
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
    const barreCode = async (inputFile : Blob) => {
        const formData = new FormData();
        formData.append('file',inputFile);
        try {
            setLoadingfeatureBarreCode(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BARRE_CODE_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const value = response.data;
            if(response){setLoadingfeatureBarreCode(false)}
            setValues(value);
            // const barcodeValueMatch = value.match(/Value:\s+([^\s]+)/);
            // if (barcodeValueMatch && barcodeValueMatch.length > 1) {
            //     const barcodeValue = barcodeValueMatch[1];
            //     return barcodeValue;
            // }
            return value;
        } catch (error) {
            console.error('cannot extract this file', error);
        }
    }

    const [filteredPlans, setFilteredPlans] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const generateRandomSuffix = () => {
        return Math.random().toString(36).substring(2, 8);
    }
    const searchPlans = async (event  : any) => {
        if (event.query.length > 2) { 
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/search/${event.query}`);
                const plans = response.data;
                setFilteredPlans(plans);
                setNoResults(plans.length === 0);
            } catch (error) {
                console.error('Error fetching plans', error);
            }
        } else {
            setFilteredPlans([]);
        }
    };
    const planHierarchieTemplate = (plan: any) => {
        let plansHierarchie: string[] = plan.plansHierarchie ?? [];
        return <>
            <span className='font-bold'>{plan.libelle}</span>
            {plansHierarchie.length > 0 &&
                <>
                    <br />
                    <span
                        className="font-light"
                        style={{
                            display: 'inline-block',
                            maxWidth: '25rem',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            direction: 'rtl',
                            textOverflow: 'ellipsis',
                            textAlign: 'left' 
                        }}
                    >
                        {plansHierarchie?.map((plan: any) => plan).join(' / ')}
                    </span>
                </>
            }
        </>
    };
    const handleNextStep = async () => {

        if (activeIndex === 0) {
            if (item.documentIndexElements == null) {
                item.documentIndexElements = new Array<DocumentIndexElementDto>();
            }
            try {
                const formData = new FormData();
                if (!isOCRChecked) {
                    if (uploadedFile instanceof Blob) {
                        const randomSuffix = generateRandomSuffix();
                        if(isOcrSpecChecked){
                            const blob = await getPagesPDFDoc(uploadedFile, startPage, endPage);
                            formData.append('file', blob);
                            if (selectedLangue) {
                                formData.append('language', encodeURIComponent(selectedLangue.code));
                            }
                        }else{
                            formData.append('file', uploadedFile);
                            formData.append('language', encodeURIComponent('fra+ara'));
                        } 
                        if(featureBarreCode){
                            const valueCodeBarre: any[] = await barreCode(uploadedFile);
                            item.reference = valueCodeBarre.length > 0 ? valueCodeBarre[0].value : randomSuffix;
                            if(valueCodeBarre){
                                const documentIndexElements: DocumentIndexElementDto[] = [];
                                if(valueCodeBarre.length > 0){
                                    valueCodeBarre.forEach((value, index)=>{
                                    
                                        const element = new DocumentIndexElementDto();
                                        element.value = value.value as string;
                                        element.indexElement = new IndexElementDto();
                                        element.indexElement = indexElements[0];

                                        documentIndexElements.push(element);
                                
                                    })
                                    item.documentIndexElements = documentIndexElements;
                                }
                            }
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
                                featureBarreCode === false && ( item.reference = randomSuffix);
                                // documentType && (itemClone.documentType = documentType);
                                setItem(itemClone);
                                setIsOCRDone(true);
                            }).catch((error)=>{
                                setIsOCRDone(true);
                                setIsOCRnotDone(true);
                            })
                        }else{
                            setIsOCRDone(true);
                            const itemClone = { ...item };
                            documentState && (itemClone.documentState = documentState);
                            featureBarreCode === false && ( item.reference = randomSuffix);
                            // documentType && (itemClone.documentType = documentType);
                            setItem(itemClone);
                        }
                    } else {
                        console.error('Invalid file format or file not available.');
                    }
                } else {
                    if (!filesUploaded) {
                        MessageService.showError(showToast, t('error.error'),  t('error.uploadDocumentFirst'));
                        return;
                    }
                    if (files && files.length > 0) {
                        for (const file of files){
                            if (file instanceof Blob) {
                                if(isOcrSpecChecked){
                                    if(selectedLangue){
                                        formData.append('language', encodeURIComponent(selectedLangue.code));
                                    }
                                    const blob = await getPagesPDFDoc(file, startPage, endPage);
                                    formData.append('file', blob);
                                }else{
                                    // formData.append('file', file);
                                    formData.append('language', encodeURIComponent('fra+ara'));
                                }
                                // if (file.type.includes('wordprocessingml')) {
                                //     const fileConvert = await convertDocxToPdf(file);
                                //     formData.append('file', fileConvert);
                                // } else if (file.type.includes('pdf')) {
                                //     formData.append('file', file);
                                // } else if (file.type.includes('spreadsheetml')) {
                                //     const fileConvert = await convertXlsxToPdf(file);
                                //     formData.append('file', fileConvert);
                                // } else {
                                // }   
                                formData.append('file', file);
                                item.reference = files[0].name;
                            }
                        }
                        if(featureBarreCode){
                            const valueCodeBarre: any[] = await barreCode(files[0]);
                            item.reference = valueCodeBarre.length > 0 ? valueCodeBarre[0].value : files[0].name;
                            const documentIndexElements: DocumentIndexElementDto[] = [];
                            if(valueCodeBarre.length > 0){
                                valueCodeBarre.forEach((value, index)=>{
                                    
                                    const element = new DocumentIndexElementDto();
                                    element.value = value.value as string;
                                    element.indexElement = new IndexElementDto();
                                    element.indexElement = indexElements[0];
                                    console.log("element", element)

                                    documentIndexElements.push(element);
                                
                                })
                                item.documentIndexElements = documentIndexElements;
                            }
                            // if(valueCodeBarre){
                            //     axios.get(`${process.env.NEXT_PUBLIC_CLIENT_URL}/${valueCodeBarre}`)
                            //     .then((response) => {console.log("response client", response.data)
                            //     const responseData = response.data;

                            //     const documentIndexElements: DocumentIndexElementDto[] = [];
                            //     const labels = ["cin", "nom", "prenom", "ville"];

                            //     labels.forEach(label => {
                            //         const element = new DocumentIndexElementDto();
                            //         element.value = responseData[label] as string;
                            //         element.indexElement = new IndexElementDto();
                            //         element.indexElement.libelle = label;
                            //         documentIndexElements.push(element);
                            //     });
                                
                            //     item.documentIndexElements = documentIndexElements;
                            
                            //     })
                            //     .catch((error) => console.error("errur lors de get client", error))
                            // }
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
                                // documentType && (itemClone.documentType = documentType);
                                featureBarreCode === false && ( item.reference = files[0].name);
                                itemClone.size = (files[0].size / (1000 * 1000));
                                setItem(itemClone);
                                setIsOCRDone(true);
                            }).catch((error)=>{
                                setIsOCRDone(true);
                                setIsOCRnotDone(true);
                            })
                        }else{
                            setIsOCRDone(true);
                            const itemClone = { ...item };
                            documentState && (itemClone.documentState = documentState);
                            // documentType && (itemClone.documentType = documentType);
                            featureBarreCode === false && ( item.reference = files[0].name);
                            itemClone.size = (files[0].size / (1000 * 1000));
                            setItem(itemClone);
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la requête OCR :", error);
            }
        }
        setActiveIndex((prevState) => prevState + 1);
    }
    const handleLoadDocument = () => {
        setIsOCRChecked(true);
    }
    const handleScanDocument = () => {
        setIsOCRChecked(false);
    }
    const itemDialogFooter = (
        <div>
            {(activeIndex == 1 || activeIndex == 2) && !loading && <Button raised severity="secondary" icon="pi pi-step-backward-alt" label={t("previous")} onClick={() => setActiveIndex((prevState) => prevState - 1)} />}
            {activeIndex < 2 &&
               
                <Button
                    raised severity="secondary"
                    icon="pi pi-step-forward-alt"
                    label={t("document.suivant")} onClick={handleNextStep}
                    disabled={activeIndex === 0 && uploadedFile.size === 0 && filesUploaded === false || activeIndex === 1 && !isFormValid()}
                    loading={activeIndex === 0 && loadingfeatureBarreCode && featureBarreCode}
                />

                
            
            }


{activeIndex === 2 && (
                <>
                    {!loading && <Button raised label={t("save")} icon="pi pi-check" onClick={saveItemSummaryOverride} />}
                    {loading && <ProgressBar value={progress.toFixed(2)} />}
                </>
            )}
    
            </div>
    );

    const onCategorieChange = (e: DropdownChangeEvent, field: string) => {
        setItem((prevState) => ({ ...prevState, [field]: e.value }));
        if (e.value && e.value.id) {
            documentCategorieIndexAdminService.findByDocumentCategorieId(e.value.id)
                .then(({ data }) => setIndexElements(data.map(e => e.indexElement)))
                .catch(error => console.log(error));
        }
        //documentCategorieIndexAdminService.findByDocumentCategorieId(e.value.id).then(({ data }) => setIndexElements(data.map(e => e.indexElement))).catch(error => console.log(error));
    };
    const handleFileUpload = async (e: any) => {
        const files = e.files;
        const fileUrl = e.files && e.files[0];
        setFiles(files);
        setFilesUploaded(true);
        MessageService.showSuccess(showToast, 'chargement', t('success.uploadSuccess',{totalRecords:files.length}));
        // if (fileUrl.type.includes('spreadsheetml')) {
        //     const blob = await convertXlsxToPdf(fileUrl)
        //     const localFileUrl = URL.createObjectURL(blob);
        //     setFileUrl(localFileUrl);
        // }else{
        //     const localFileUrl = URL.createObjectURL(fileUrl);
        //     setFileUrl(localFileUrl);
        // }
        const docType = await associateDocumentType(fileUrl,  documentTypes);
        
        if (docType) {
            setItem({ ...item, documentType: docType });        
        }
    };

    const HideDialogReload = () =>{
        hideDialog();
        setUploadedFile(new Blob())
        setFileUrl('')
        setFiles([])
        setItem(new DocumentDto())
        setActiveIndex(0)
        setIsOCRChecked(false)
        setFilesUploaded(false)
    }
    const HideDialogReloadScan = () => {
        HideDialogReload();
        window.location.reload();
    }

    return (
        <Dialog visible={visible} closeOnEscape maximizable style={{ width: '85vw' }} header={
            <>
                {t("document.tabPan")}
                <Steps className='mt-2' activeIndex={activeIndex} model={items} onSelect={(event) => onTabChange(event)} readOnly />
            </>
        } modal className="p-fluid" footer={itemDialogFooter} onHide={HideDialogReloadScan}>
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
                            inputId='OCR'
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
                            customUpload 
                            uploadHandler={handleFileUpload}
                            chooseLabel={t('choose')}
                            uploadLabel={t('upload')}
                            cancelLabel={t('cancel')}
                            emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
                        />
                        {fileUrl && filesUploaded && (
                            <div className='w-fit mx-auto' style={{}}>
                                <FileViewer file={fileUrl} twoPages={false} height={700} />
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
                    /> )}
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
                            className={classNames({ 'p-invalid': touchedInputs.reference && !item.reference && !isFormValid() })} autoFocus disabled={!isOCRDone}/>
                        {touchedInputs.reference && !item.reference &&
                            <small className="p-invalid p-error font-bold">Reference Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentType">{t("document.documentType")}</label>
                        <Dropdown showClear inputId='documentType' id="documentTypeDropdown" value={item.documentType}
                            options={documentTypes} onChange={(e) => onDropdownChange(e, 'documentType')}
                            placeholder={t("document.documentTypePlaceHolder")} filter
                            filterPlaceholder={t("document.documentTypePlaceHolderFilter")}
                            onClick={() => handleInputClick('documentType')}
                            className={classNames({ 'p-invalid': !item.documentType && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone}/>
                        {touchedInputs.documentType && !item.documentType &&
                            <small className="p-invalid p-error font-bold">Type du document Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentState">{t("document.documentState")}</label>
                        <Dropdown showClear inputId='documentState' id="documentStateDropdown" value={item.documentState}
                            options={documentStates} onChange={(e) => onDropdownChange(e, 'documentState')}
                            placeholder={t("document.documentStatePlaceHolder")} filter
                            filterPlaceholder={t("document.documentStatePlaceHolderFilter")}
                            onClick={() => handleInputClick('documentState')}
                            className={classNames({ 'p-invalid': !item.documentState && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone}/>
                        {touchedInputs.documentState && !item.documentState &&
                            <small className="p-invalid p-error font-bold">État du document obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                        <Dropdown showClear inputId='documentCategorie' id="documentCategorieDropdown" value={item.documentCategorie}
                            options={documentCategories}
                            onChange={(e) => onCategorieChange(e, 'documentCategorie')}
                            placeholder={t("document.documentCategoriePlaceHolder")} filter
                            filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                            onClick={() => handleInputClick('documentCategorie')}
                            className={classNames({ 'p-invalid': !item.documentCategorie && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone}/>
                        {touchedInputs.documentCategorie && !item.documentCategorie &&
                            <small className="p-invalid p-error font-bold">Categorie du document Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                        <Calendar inputId='uploadDate' id="uploadDateCalendar" value={item.uploadDate}
                            onChange={(e) => onInputDateChange(e, 'uploadDate')} dateFormat="dd/mm/yy"
                            showIcon={true} disabled={!isOCRDone}/>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="size">{t("document.size")}</label>
                        <InputNumber inputId='size' id="sizeNumber" value={item.size} onChange={(e) => onInputNumerChange(e, 'size')} disabled />
                    </div>
                    <div className="field col-4">
                        <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                        <Dropdown showClear inputId='utilisateur' id="utilisateurDropdown" value={item.utilisateur} options={utilisateurs}
                            onChange={(e) => onDropdownChange(e, 'utilisateur')}
                            placeholder={t("document.utilisateurPlaceHolder")} filter
                            onClick={() => handleInputClick('utilisateur')}
                            className={classNames({ 'p-invalid': !item.utilisateur && !isFormValid() })}
                            filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" disabled={!isOCRDone}/>
                        {touchedInputs.utilisateur && !item.utilisateur &&
                            <small className="p-invalid p-error font-bold">Utilisateur Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label>
                        <Dropdown showClear inputId='entiteAdministrative' id="entiteAdministrativeDropdown" value={item.entiteAdministrative}
                            options={entiteAdministratives}
                            onChange={(e) => onDropdownChange(e, 'entiteAdministrative')}
                            placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                            filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                            onClick={() => handleInputClick('entiteAdministrative')}
                            className={classNames({ 'p-invalid': !item.entiteAdministrative && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone}/>
                        {touchedInputs.entiteAdministrative && !item.entiteAdministrative && !isFormValid() &&
                            <small className="p-invalid p-error font-bold">Entite Administrative Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="planClassement">{t("document.classificationPlan")} :</label>
                        <AutoComplete
                            inputId='planClassement'
                            id="planClassementDropdown"
                            value={item.planClassement}
                            suggestions={filteredPlans}
                            itemTemplate={(item: any) => <>{planHierarchieTemplate(item)}</>}
                            completeMethod={searchPlans}
                            field="libelle"
                            onChange={(e) => onDropdownChange(e, 'planClassement')}
                            placeholder={t("document.classificationPlan")}
                            className={classNames({ 'p-invalid': !item.planClassement && !isFormValid() })}
                            disabled={!isOCRDone}
                            onClick={() => handleInputClick('planClassement')}
                        />
                        {noResults && (
                            <small className="p-invalid p-error font-bold">Aucun plan de classement trouvé.</small>
                        )}
                        {touchedInputs.planClassement && !item.planClassement && (
                            <small className="p-invalid p-error font-bold">Plan de Classement Obligatoire.</small>
                        )}
                    </div>
                    <div className="field col-12">
                        <label htmlFor="description">{t("document.description")}</label>
                        <span className="p-float-label">
                            <InputTextarea id="description" value={item.description}
                                onChange={(e) => onInputTextChange(e, 'description')} rows={5}
                                cols={30} disabled={!isOCRDone}/>
                        </span>
                    </div>
                    <div className="field col-2">
                        <label htmlFor="archivagePhysique">{t("appBar.archive")}</label>
                        <span className="p-float-label">
                            <InputSwitch
                                inputId='archivagePhysique'
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
                                <Button raised icon="pi pi-align-justify" label='Voir le contenu'
                                    className=" mr-2" severity="info" onClick={() => {setShowContent(!showContent)}} />
                            ):(
                                <Button raised icon="pi pi-file" label='Voir le document'
                                    className=" mr-" severity="secondary" onClick={() => {setShowContent(!showContent)}} />
                            )}
                            {!showContent ? (
                                fileUrl && (
                                    <div className='overflow-auto ' style={{maxHeight:"100%"}}>
                                        <h4> </h4>
                                        <FileViewer file={fileUrl} twoPages={false} height={700} />  
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
                                <Dropdown inputId='indexElement' id="indexElementDropdown" value={documentIndexElements.indexElement}
                                    options={indexElements}
                                    onChange={(e) => onDropdownChangeDocumentIndexElements(e, 'indexElement')}
                                    placeholder={t("documentIndexElement.indexElementPlaceHolder")} filter
                                    filterPlaceholder={t("documentIndexElement.indexElementPlaceHolderFilter")}
                                    className={classNames({ 'p-invalid': touchedInputs.value && errors.value })}
                                    optionLabel="libelle" autoFocus onClick={() => handleInputClick('indexElement')}/>
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
export default Create;


