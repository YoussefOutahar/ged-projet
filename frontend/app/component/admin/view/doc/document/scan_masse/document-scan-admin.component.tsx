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
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";
import {
    DocumentCategorieIndexAdminService
} from "../../../../../../controller/service/admin/DocumentCategorieIndexAdminService.service";
import axios from 'axios';
import axiosInstance from 'app/axiosInterceptor';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { PDFDocument } from 'pdf-lib';
import { TabPanel, TabView } from 'primereact/tabview';
import { FileUpload } from 'primereact/fileupload';
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
import { IndexElementDto } from 'app/controller/model/IndexElement.model';
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
const Scan: React.FC<DocumentCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {
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
        if(item.entiteAdministrative == undefined || item.entiteAdministrative.libelle.trim() === '')
            errorMessages.push("entiteAdministrative Obligatoire")
        if(item.utilisateur == undefined || item.utilisateur.nom.trim() === '')
            errorMessages.push("documentState utilisateur")
        if(item.planClassement == undefined || item.planClassement.libelle.trim() === '')
            errorMessages.push("planClassement Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new DocumentDto();
    const [documentDtos , setDocumentDtos] = useState<DocumentDto[]>([]);
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
    const [isArchivagePhysiqueChecked, setIsArchivagePhysiqueChecked] = useState(false);
    const [isOCRChecked, setIsOCRChecked] = useState(false);
    const [isOCRDone, setIsOCRDone] = useState(false);
    const [isOCRnotDone, setIsOCRnotDone] = useState(false);
    
    const items = [
        {
            label: 'Scan Document'
        },
        {
            label: "Documents Extraits"
        },
        {
            label: 'Informations'
        },
        {
            label: "Champs d'indexation"
        },
        {
            label: "Validation"
        },
    ];
    const connectedUser = useConnectedUserStore(state => state.connectedUser);
    const fileUploadRef = useRef(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>();
    const [filesUploaded, setFilesUploaded] = useState(false);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [fileUrlIndex, setFileUrlIndex] = useState<string>('');

    const { featureFlags, isActiveBack, updateValue, isActiveFront} = useFeatureFlags();
    const [OCR_URL, setOCR_URL] = useState<string>('');
    const [runOCR, setRunOCR] = useState<boolean>(false);
    const [featureBarreCode, setFeatureFlagsBarreCode ] = useState<boolean>(false);

    useEffect(() => {
        const feature = isActiveFront('ocr');
        const withOCR = isActiveFront('runOcr');
        setFeatureFlagsBarreCode(isActiveFront('barreCode'));
        setRunOCR(withOCR);
        if(feature){
            const OCR_URL = `${process.env.NEXT_PUBLIC_ADMIN_URL}document/ocr`;
            setOCR_URL(OCR_URL);
        }else{
            const OCR_URL = `${process.env.NEXT_PUBLIC_OCR_GDP_URL}`;
            setOCR_URL(OCR_URL);
        }
    },[featureFlags])

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

    const [loading, setLoading] = useState(false);
    const [loadingExtraction, setLoadingExtraction] = useState(false);
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
    const getPDFDocByPages = async (inputFile: any, startPageNumber: number, endPageNumber: number) => {
        const pdfDoc = await PDFDocument.load(await inputFile.arrayBuffer());
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdfDoc, Array.from({ length: endPageNumber - startPageNumber + 1 }, (_, i) => i + startPageNumber - 1));
        copiedPages.forEach(page => newDoc.addPage(page));
        const pageBytes = await newDoc.save();
        return new Blob([pageBytes], { type: 'application/pdf' });
    };
    const extractPDFDoc = async (inputFile : Blob) => {
        const formData = new FormData();
        formData.append('file',inputFile);
        try {
            setLoadingExtraction(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_EXTRACTION_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response){
                setLoadingExtraction(false);
            }
            const newFiles = [];
            for (const fileData of response.data) {
                const newFile = await getPDFDocByPages(inputFile, fileData.startPage, fileData.endPage);
                newFiles.push(newFile);
            }
            return newFiles;
        } catch (error) {
            console.error('cannot extract this file', error);
            setLoadingExtraction(false);
        }
    }
    const barreCode = async (inputFile : Blob) => {
        const formData = new FormData();
        formData.append('file',inputFile);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BARRE_CODE_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const value = response.data;
            return value;
        } catch (error) {
            console.error('cannot extract this file', error);
        }
    }
    const [pageBlobs, setPageBlobs] = useState<Blob[]>([]);
    const handleNextStep = async() => {

        if (activeIndex === 0) {

            if (item.documentIndexElements == null) {
                item.documentIndexElements = new Array<DocumentIndexElementDto>();
            }
            const formData = new FormData();
            if(!isOCRChecked){
                if (uploadedFile instanceof Blob) {
                    const blobs = await extractPDFDoc(uploadedFile);
                    if (blobs) {
                        setPageBlobs(blobs);
                        formData.append('file', blobs[numPages-1]);
                        const localFileUrl = URL.createObjectURL(blobs[numPages-1]);
                        setFileUrlIndex(localFileUrl);
                        formData.append('language', encodeURIComponent('fra+ara'));
                        if(featureBarreCode){
                            const valueCodeBarre: any[] = await barreCode(blobs[numPages-1]);
                            const documentIndexElements: DocumentIndexElementDto[] = [];
                            if(valueCodeBarre.length > 0){
                                valueCodeBarre.forEach((value, index)=>{
                                    
                                    const element = new DocumentIndexElementDto();
                                    element.value = value.value as string;
                                    element.indexElement = new IndexElementDto();
                                    element.indexElement = indexElements[0];

                                    documentIndexElements.push(element);
                                
                                })
                                setItem({...item, 
                                    documentIndexElements :documentIndexElements,
                                    reference: valueCodeBarre.length > 0 ? valueCodeBarre[0].value : ''});
                            }
                        }
                        if(runOCR){
                            axios.post(`${OCR_URL}`, formData, {
                            headers: {
                            'Content-Type': 'multipart/form-data', 'Accept-Charset': 'UTF-8',
                            }}).then(({ data }) => {
                            const itemClone =  {...item};
                            itemClone.content = data;
                            documentState && (itemClone.documentState = documentState);
                            documentType && (itemClone.documentType = documentType);
                            setIsOCRDone(true);
                            setItem(itemClone);
                            }).catch((error)=>{
                                setIsOCRDone(true);
                                setIsOCRnotDone(true);
                            })
                        }else{
                            const itemClone =  {...item};
                            documentState && (itemClone.documentState = documentState);
                            documentType && (itemClone.documentType = documentType);
                            setIsOCRDone(true);
                            setItem(itemClone);
                        }
                    } else {
                        console.error('Error: pageBlobs is undefined');
                    }
                }else{
                    console.error('Invalid file format or file not available.');
                }
            }else{
                if (!filesUploaded) {
                    MessageService.showError(showToast, "Error!", 'Veuillez d\'abord charger les fichiers.');
                    return;
                }
                if (files && files.length > 0) {
                    const blobs = await extractPDFDoc(files[0]);                    
                    if (blobs) {
                        setPageBlobs(blobs);
                        formData.append('file', blobs[numPages-1]);
                        const localFileUrl = URL.createObjectURL(blobs[numPages-1]);
                        setFileUrlIndex(localFileUrl);
                        formData.append('destinationLanguage', encodeURIComponent('fra'));
                        if(featureBarreCode){
                            const valueCodeBarre: any[] = await barreCode(blobs[numPages-1]);
                            item.reference = valueCodeBarre.length > 0 ? valueCodeBarre[0].value : '';
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
                        if(runOCR){
                            axios.post(`${OCR_URL}`, formData, {
                            headers: {
                            'Content-Type': 'multipart/form-data', 'Accept-Charset': 'UTF-8',
                            }}).then(({ data }) => {
                            const itemClone =  {...item};
                            itemClone.content = data;
                            itemClone.size = (blobs[numPages-1].size / (1000 * 1000));
                            documentState && (itemClone.documentState = documentState);
                            documentType && (itemClone.documentType = documentType);
                            setIsOCRDone(true);
                            setItem(itemClone);
                            }).catch((error)=>{
                                setIsOCRDone(true);
                                setIsOCRnotDone(true);
                            })
                        }else{
                            const itemClone =  {...item};
                            documentState && (itemClone.documentState = documentState);
                            documentType && (itemClone.documentType = documentType);
                            itemClone.size = (blobs[numPages-1].size / (1000 * 1000));
                            setIsOCRDone(true);
                            setItem(itemClone);
                        }
                    } else {
                        console.error('Error: pageBlobs is undefined');
                    }
                }
            }
        }
        setActiveIndex((prevState) => prevState + 1);
    }
    const [numPages, setNumPages] = useState(1); 
    const [editItem, setEditItem] = useState<boolean>(false);
    const [showIFrame, setShowIFrame] = useState<boolean>(false);

    const saveItemOverride = async () => {
        setIsOCRnotDone(false);
        const size = pageBlobs.length;
        const currentItem = { ...item };
        if(!editItem){
            if (numPages < size) {
                setIsOCRDone(false);
                setDocumentDtos(prevDocumentDtos => [...prevDocumentDtos, currentItem]);
                setNumPages(numPages + 1);
                setDocumentIndexElements(new DocumentIndexElementDto());
                item.documentIndexElements = [];
                setItem({...item,documentIndexElements:[], reference:''});
                setActiveIndex(2);
                const formData = new FormData(); 
                    formData.append('file', pageBlobs[numPages]);
                    const localFileUrl = URL.createObjectURL(pageBlobs[numPages]);
                    setFileUrlIndex(localFileUrl);
                    formData.append('language', encodeURIComponent('fra+ara'));
                    if(featureBarreCode){
                        const valueCodeBarre: any[] = await barreCode(pageBlobs[numPages]);
                        const documentIndexElements: DocumentIndexElementDto[] = [];
                        if(valueCodeBarre.length > 0){
                            valueCodeBarre.forEach((value, index)=>{
                                
                                const element = new DocumentIndexElementDto();
                                element.value = value.value as string;
                                element.indexElement = new IndexElementDto();
                                element.indexElement = indexElements[0];

                                documentIndexElements.push(element);
                            
                            })
                            setItem({...item, 
                                documentIndexElements :documentIndexElements,
                                reference : valueCodeBarre.length > 0 ? valueCodeBarre[0].value : ''});
                        }
                    }
                    if(runOCR){
                        axios.post(`${OCR_URL}`, formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data', 'Accept-Charset': 'UTF-8',
                        }}).then(({ data }) => {
                        setIsOCRDone(true);
                        setItem({...item,content:data,size:(pageBlobs[numPages].size / (1000 * 1000))});
                        }).catch((error)=>{
                            setIsOCRDone(true);
                            setItem({...item,size:(pageBlobs[numPages].size / (1000 * 1000))});
                            setIsOCRnotDone(true);
                        })
                    }else{
                        setIsOCRDone(true);
                    }
            } else if (numPages === size) {
                setDocumentDtos(prevDocumentDtos => [...prevDocumentDtos, currentItem]);
                setActiveIndex(4);
            }
        }else{
            const updatedDocumentDtos = documentDtos.map(doc => {
                if (doc.reference === currentItem.reference) {
                    return currentItem;
                }
                return doc;
            });
            setDocumentDtos(updatedDocumentDtos);
            setActiveIndex(4);
        }
        
    }
    const saveItemFinale = async () => {
        setLoading(true);
        const promises: Promise<any>[] = [];
        pageBlobs.forEach((file, index) => {
            const form = new FormData();
            if (file instanceof Blob) {
                form.append('file', file);
            }
            form.append("documentDTO", JSON.stringify(documentDtos[index]));
            promises.push(service.saveFormData(form));
        });
        Promise.all(promises).then(() => {
            add();
            MessageService.showSuccess(showToast, "Création!", "Opération faite avec succès.");
            setLoading(false);
            onClose();
            setSubmitted(false);
            window.location.reload();
        }).catch(error => {
            console.error("Une erreur est survenue lors de l'enregistrement :", error);
            MessageService.showError(showToast, "Error!", "Erreur lors de l'ajout des document scannés.");
            setLoading(false);
        });

    }
    const itemDialogFooter = (
        <div>
            {(activeIndex == 1 || activeIndex == 2 || activeIndex == 3) && <Button raised severity="secondary" icon="pi pi-step-backward-alt" label="Précedent" onClick={() => setActiveIndex((prevState) => prevState - 1)} />}
            {activeIndex < 3 && <Button 
                raised severity="secondary" 
                icon="pi pi-step-forward-alt" 
                loading={loadingExtraction}
                label="Suivant" onClick={handleNextStep} 
                disabled={activeIndex === 0 && uploadedFile.size === 0 && filesUploaded === false || activeIndex === 2 && !isFormValid()} 
                />}

            {activeIndex === 3 && <Button raised label={t("save")} icon="pi pi-check" onClick={saveItemOverride} />}
            {activeIndex === 4 && <Button raised label="valider" icon="pi pi-check" loading={loading} onClick={saveItemFinale} />}
        </div>
    );

    const handleArchivagePhysiqueSwitchChange = (e : InputSwitchChangeEvent) => {
        setIsArchivagePhysiqueChecked(e.value ?? false);
    };
    const onCategorieChange = (e: DropdownChangeEvent, field: string) => {
        setItem((prevState) => ({ ...prevState, [field]: e.value }));
        if (e.value && e.value.id) {
            documentCategorieIndexAdminService.findByDocumentCategorieId(e.value.id)
                .then(({ data }) => setIndexElements(data.map(e => e.indexElement)))
                .catch(error => console.log(error));
        }
    };
    const HideDialogReload = () =>{
        hideDialog();
        window.location.reload();
    };
    const handleLoadDocument = ()=>{
        setIsOCRChecked(true);
    };
    const handleScanDocument = ()=>{
        setIsOCRChecked(false);
    };
    const handleFileUpload = (e: any) => {
        const files = e.files;
        const fileUrl = e.files && e.files[0];
        setFiles(files);
        setFilesUploaded(true);
        MessageService.showSuccess(showToast, "Chargement!", `${files.length} fichier chargé avec succès`);
        if (fileUrl) {
            const localFileUrl = URL.createObjectURL(fileUrl);
            setFileUrl(localFileUrl);
        }
    };

    const [selectedFile, setSelectedFile] = useState<number>(0);
    const fileIframe = async (index:number) => {
        setShowIFrame(true);
        setSelectedFile(index);
    }
    return (
        <Dialog visible={visible}  closeOnEscape maximizable style={{ width: '85vw' }} header={
            <>
                {t("document.tabPan")}
                <Steps className='mt-2' activeIndex={activeIndex} model={items} onSelect={(event) => onTabChange(event)} readOnly />
            </>
        } modal className="p-fluid" footer={itemDialogFooter} onHide={HideDialogReload}>
            <div className={`mt-4 mb-2 ${activeIndex !== 0 && 'hidden'}`}>
                <div className="field col-12 text-center">
                    <span className="p-float-label justify-content-center">
                        <Button label="Charger Document" icon="pi pi-upload" className="p-button-success w-4" onClick={handleLoadDocument} />
                        <Button label="Scanner Document" icon="pi pi-camera" className="p-button-help w-4 ml-2" onClick={handleScanDocument} />
                    </span>
                </div>
                {isOCRChecked ? (
                    <div className="field col-12">
                        <FileUpload
                            ref={fileUploadRef}
                            name="files[]"
                            customUpload
                            uploadHandler={handleFileUpload}
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        />
                        {fileUrl && (
                            <div className='overflow-auto'>
                                <h4> </h4>
                                <FileViewer file={fileUrl}  height={700} />
                            </div>
                        )}
                    </div>
                ):(
                    <DWT setUploadedFile={setUploadedFile} features={[
                        "scan",
                        //"load",
                        "save",
                        "upload",
                        "uploader"
                    ]}
                    />
                )}
            </div>
            <div className={`m-4 ${activeIndex !== 1 && 'hidden'}`}>
            <TabView>
                    {pageBlobs.map((blob, index) => (
                        <TabPanel key={index} header={`Document ${index + 1}`}>
                            <div className="document-table">
                                <iframe
                                    title={`Document ${index + 1}`}
                                    src={URL.createObjectURL(blob)}
                                    width="100%"
                                    height="500px"
                                    frameBorder="0"
                                />
                            </div>
                        </TabPanel>
                    ))}
                </TabView>
            </div>
            <div className={`m-4 ${activeIndex !== 2 && 'hidden'}`}>
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
                            className={classNames({ 'p-invalid': touchedInputs.reference && !item.reference })} autoFocus disabled={!isOCRDone}/>
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
                            optionLabel="libelle" disabled={!isOCRDone}/>
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
                            optionLabel="libelle" disabled={!isOCRDone}/>
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
                            optionLabel="libelle" disabled={!isOCRDone}/>
                        {touchedInputs.documentCategorie && !item.documentCategorie &&
                            <small className="p-invalid p-error font-bold">Categorie du document Obligatoire.</small>}
                    </div>
                    <div className="field col-4">
                        <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                        <Calendar id="uploadDate" value={item.uploadDate}
                            onChange={(e) => onInputDateChange(e, 'uploadDate')} dateFormat="dd/mm/yy"
                            showIcon={true} disabled={!isOCRDone}/>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="size">{t("document.size")}</label>
                        <InputNumber id="size" value={item.size} onChange={(e) => onInputNumerChange(e, 'size')} disabled/>
                    </div>
                    <div className="field col-4">
                        <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                        <Dropdown showClear id="utilisateurDropdown" value={item.utilisateur} options={utilisateurs}
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
                        <Dropdown showClear id="entiteAdministrativeDropdown" value={item.entiteAdministrative}
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
                        <label htmlFor="planClassement">Plan de Classement :</label>
                        <Dropdown showClear id="planClassementDropdown" value={item.planClassement}
                            options={plans}
                            onChange={(e) => onDropdownChange(e, 'planClassement')}
                            placeholder="Plan de Classement" 
                            filter
                            filterPlaceholder="Plan de Classement"
                            onClick={() => handleInputClick('planClassement')}
                            className={classNames({ 'p-invalid': !item.planClassement && !isFormValid() })}
                            optionLabel="libelle" disabled={!isOCRDone}/>
                        {touchedInputs.planClassement && !item.planClassement &&
                            <small className="p-invalid p-error font-bold">Plan de Classement Obligatoire.</small>}
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
                        <label htmlFor="archivagePhysique">Archivage Physique</label>
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
                            <label htmlFor="ligne">Row</label>
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
                            <label htmlFor="colonne">Colonne</label>
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
                            <label htmlFor="numBoite">N° Boite</label>
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
            <div className={`m-4 ${activeIndex !== 3 && 'hidden'}`}>
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
                            fileUrlIndex && (
                                <div>
                                    <h4> </h4>
                                    <iframe title="pdf-preview" src={fileUrlIndex} width="100%" height="600px" />
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
                                <Button raised label="Sauvegarder" onClick={addDocumentIndexElements} />
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
            <div className={`m-4 ${activeIndex !== 4 && 'hidden'}`}>
                <div>
                    <DataTable value={documentDtos} tableStyle={{ minWidth: '50rem' }} dataKey="id" paginator 
                        rows={5} rowsPerPageOptions={[5, 10, 20, 50]}>
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }} hidden> </Column>
                        <Column field="reference"
                            header="reference"></Column>
                        <Column field="uploadDate" header={t("document.uploadDate")}
                            body={formateDate("uploadDate")}></Column>
                        <Column field="description" header={t("documentIndexElement.description")} hidden></Column>
                        <Column field="utilisateur.nom" header={t("document.utilisateur")} sortable body={(rowData) => {
                            if (rowData?.utilisateur?.nom) {
                                return (
                                    <div className="flex align-items-center gap-2">
                                        <img alt="" src="/user-avatar.png" width="32" />
                                        <span className='font-bold'>{rowData.utilisateur.nom}</span>
                                    </div>
                                ) 
                            }
                        }}></Column>
                        <Column field="entiteAdministrative.libelle" header={t("document.entiteAdministrative")}
                            sortable></Column>
                        <Column field="planClassement.libelle" header={"Plan Classement"}
                            sortable></Column>
                        <Column header={t("actions")} body={(rowData, rowIndex) => (<div style={{width: "150px"}}>
                            <Button raised icon="pi pi-eye" severity="success" className="mr-2" onClick={()=>{fileIframe(documentDtos.indexOf(rowData))}}/>
                            <Button raised icon="pi pi-pencil" severity="warning" className="mr-2" onClick={()=>{setEditItem(true);setActiveIndex(1); setItem(rowData)}}/>
                        </div>)}></Column>
                    </DataTable>
                    {showIFrame && <div className='card mt-4'>
                    <Button raised icon="pi pi-times" severity="secondary" className="mr-2" onClick={()=>{setShowIFrame(false)}}/>
                    <iframe
                        title="Prévisualisation du document"
                        width="100%"
                        height="600"
                        className='mt-4'
                        src={URL.createObjectURL(pageBlobs[selectedFile])}
                    >
                    </iframe>
                    </div>}
                </div>
            </div>
        </Dialog >
  )
}

export default Scan
