import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useRegistresContext } from 'app/component/admin/view/bureau-ordre/Providers/RegistreProvider';
import { DocumentCategorieCriteria } from 'app/controller/criteria/DocumentCategorieCriteria.model';
import { EntiteAdministrativeCriteria } from 'app/controller/criteria/EntiteAdministrativeCriteria.model';
import { Confidentialite, CourrielBureauOrdre, EtatAvancementCourriel, PrioriteCourrielOptions, TypeCourriel, VoieEnvoi, VoieEnvoiOptions } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre';
import { IntervenantCourriel } from 'app/controller/model/BureauOrdre/IntervenantCourriel';
import { PlanClassementBO } from 'app/controller/model/BureauOrdre/PlanClassementBo';
import { RegistreDto } from 'app/controller/model/BureauOrdre/Registre';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentStateDto } from 'app/controller/model/DocumentState.model';
import { DocumentTypeDto } from 'app/controller/model/DocumentType.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { PlanClassementDto } from 'app/controller/model/PlanClassement.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { DocumentStateAdminService } from 'app/controller/service/admin/DocumentStateAdminService.service';
import { DocumentTypeAdminService } from 'app/controller/service/admin/DocumentTypeAdminService.service';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import axios from 'axios';
import AppConfig from 'layout/AppConfig';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Page } from "types/types";
const DWT = dynamic(() => import('app/component/dwt/DynamsoftSDK'), { ssr: false });

type SeverityType = 'success' | 'info' | 'warn' | 'error';
const queryClient = new QueryClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const Facture: Page = () => {
    const { t } = useTranslation();

    const [verifySignature, setVerifySignature] = useState<boolean>(false);

    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [clicked, setClicked] = useState(false);
    const [startFacture, setStartFacture] = useState(false);
    const [hoveredEnvoiDemande, setHoveredEnvoiDemande] = useState(false);
    const [hoveredVerificationSignature, setHoveredVerificationSignature] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<Blob>(new Blob());

    const toast = useRef<Toast>(null);
    const showToast = (severity: SeverityType, summary: string) => {
        if (toast.current) {
        toast.current.show({ severity, summary, life: 4000 });
        }
    };

    const steps = [
        { label: 'Charger Document' },
        { label: 'Insérer Informations' }
    ];
    const [loading , setLoading] = useState(false);
    const barreCode = async (inputFile : Blob) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file',inputFile);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BARRE_CODE_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const value = response.data;
            const barcodeValueMatch = value.match(/Value:\s+([^\s]+)/);
            if (barcodeValueMatch && barcodeValueMatch.length > 1) {
                const barcodeValue = barcodeValueMatch[1];
                setLoading(false);
                return barcodeValue;
            }else{
                const responseOCR = await axios.post(`${process.env.NEXT_PUBLIC_OCR_GDP_URL}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "language": "fra"
                    }
                });
                const valueOCR = responseOCR.data;
                const facturevalueMatch = valueOCR.match(/Numéro de facture :\s+(\d{6})/);
                if (facturevalueMatch && facturevalueMatch.length > 1) {
                    const facturevalue  = facturevalueMatch[1];
                    setLoading(false);
                    return facturevalue;
            }

        }
    } catch (error) {
            console.error('cannot extract this file', error);
        }
    }
    const nextStep = async () => {
        if(activeIndex === 0) {
            const valueCodeBarre = await barreCode(uploadedFile);
            if(valueCodeBarre){
                setReference(valueCodeBarre);
            }
        }
        setActiveIndex(prevIndex => prevIndex + 1);
    };

    const prevStep = () => {
        setActiveIndex(prevIndex => prevIndex - 1);
    };
    const [document, setDocument] = useState<DocumentDto>(new DocumentDto());
    const [reference, setReference] = useState('');
    const [ registres, setRegistres ] = useState<RegistreDto[]>([]);
    const currentDate = new Date();
    const [dateReception, setDateReception] = useState<string>(currentDate as unknown as string);
    const deadlineDate = new Date(currentDate);
    deadlineDate.setDate(deadlineDate.getDate() + 5);
    const [dateEcheance, setDateEcheance] = useState<string>(deadlineDate as unknown as string);

    const [priorite, setPriorite] = useState<string>('MOYENNE');
    const [voieEnvoi, setVoieEnvoi] = useState<VoieEnvoi>(VoieEnvoi.AUTRE);
    // ou cas de creation
    const [entiteExterne, setEntiteExterne] = useState<EtablissementBureauOrdre | null>(null);

    const [plan, setPlan] = useState<PlanClassementDto>(new PlanClassementDto());
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const [documentState, setDocumentState] = useState<DocumentStateDto>();
    const [documentType, setDocumentType] = useState<DocumentTypeDto>();
    const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    const [entiteAdministrativeCriteria, setEntiteAdministrativeCriteria] = useState<EntiteAdministrativeCriteria>(new EntiteAdministrativeCriteria());
    const [documentCategorieCriteria, setDocumentCategorieCriteria] = useState<DocumentCategorieCriteria>(new DocumentCategorieCriteria());
    const [planClassementCourrielOptions, setPlanClassementCourrielOptions] = useState<PlanClassementBO[]>([]);

    const documentTypeAdminService = new DocumentTypeAdminService();
    const documentStateAdminService = new DocumentStateAdminService();
    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    const [etablissementBO, setEtablissementBO] = useState<EtablissementBureauOrdre>(new EtablissementBureauOrdre());
    const [etablissement, setEtablissement]= useState('');
    const [facture , setFacture]= useState<boolean>(false);
    useEffect(() => {
        axios.get(`${API_URL}/courriel/registre`).then((res) => {
            setRegistres(res.data);
        }).catch((err) => {
            console.log('err:', err);
        });
        entiteAdministrativeCriteria.codeLike = 'bo-ref';
        documentCategorieCriteria.codeLike = 'facture';
        entiteAdministrativeAdminService.findPaginatedByCriteria(entiteAdministrativeCriteria).then((res) => {
            setEntiteAdministratives(res.data.list);
        })
        documentCategorieAdminService.findPaginatedByCriteria(documentCategorieCriteria).then((res) => {
            setDocumentCategories(res.data.list);
        })
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan-classement-bo`).then((res) => {
            setPlanClassementCourrielOptions(res.data);
        }).catch((err) => {
            console.log('err:', err);
        });
        axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/libelle/${'bo'}`)
            .then(response => setPlan(response.data[0]))
            .catch(error => console.error('Error loading plans', error));
        documentTypeAdminService.getDocumentTypeByID(1).then(({ data }) => setDocumentType(data)).catch(error => console.log(error));
        documentStateAdminService.getDocumentStateByID(1).then(({ data }) => setDocumentState(data)).catch(error => console.log(error));
    }, []);
    const [loadingA , setLoadingA] = useState(false);
    const saveFacture = () => {
        //edit
        handleSaveItem();
        sendCourriel();
    }
    const handleSaveItem = () => {
        if (uploadedFile) {
            document.reference=reference;
            documentState && (document.documentState = documentState);
            documentType && (document.documentType = documentType);
            document.planClassement = plan;
            document.entiteAdministrative = entiteAdministratives[0];
            document.utilisateur = entiteAdministratives[0].chef;
            document.documentCategorie = documentCategories[0];

            return document;
        }
    }
    const initCourriel = (courriel: CourrielBureauOrdre) => {
        courriel.sujet = reference.concat('_Facture');
        courriel.dateReception = dateReception;
        courriel.dateEcheance = dateEcheance;
        courriel.voieEnvoi = voieEnvoi;
        courriel.numeroRegistre = registres[0].numero;
        courriel.numeroCourrielExterne = reference;

        courriel.etatAvancement = EtatAvancementCourriel.EN_COURS;
        courriel.priorite = priorite;
        courriel.type = TypeCourriel.ENTRANT;
        courriel.confidentialite = Confidentialite.NORMAL
        const intervenant = new IntervenantCourriel();
        courriel.intervenants = [{...intervenant, 'responsables': [entiteAdministratives[0].chef]}];
        courriel.planClassement = planClassementCourrielOptions ? planClassementCourrielOptions[0] : new PlanClassementBO();
        courriel.entiteExterne = etablissementBO;
        courriel.entiteInterne = entiteAdministratives[0];

        return courriel;
    };
    const [filesUploaded, setFilesUploaded] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleFileUpload = async (e: any) => {
        const files = e.files;
        const fileUrl = e.files && e.files[0];
        setUploadedFile(files[0]);
        setFilesUploaded(true);
        MessageService.showSuccess(showToast, 'chargement', t('success.uploadSuccess',{totalRecords:files.length}));
        if (fileUrl) {
            const localFileUrl = URL.createObjectURL(fileUrl);
            setFileUrl(localFileUrl);
        }
    };
    const sendCourriel = async () =>{
        handleSaveItem();
        const form = new FormData();
        form.append('id', JSON.stringify(-1));
        form.append('createCourrielOperationType', "CourrielCreation");
        const courriel: CourrielBureauOrdre = new CourrielBureauOrdre();
        initCourriel(courriel);

        // Setting up documents
        courriel.documents = [document];
        form.append('files', uploadedFile);
        form.append('courrielDto', JSON.stringify(courriel));

        await SendCreateRequest(form)
    };
    
    const SendCreateRequest = async (form: FormData) => {
        setLoadingA(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courriels/`, form)
            .then((responses) => {
                showToast('success', t("success.operation"))
                queryClient.invalidateQueries({ queryKey: ['courriels'] });
                setActiveIndex(0);
                setReference('');
                setUploadedFile(new Blob());
                setDocument(new DocumentDto());
                setEtablissement('');
                setLoadingA(false);
                setFileUrl(null);
                setFacture(false);
                return responses.data
            }).catch((error) => {
                console.error('Erreur lors de la résolution des requêtes:', error);
                showToast('error', "Erreur lors de l'ajout des documents");
            });
    };
    const validEtablissement = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/etablissements/nom/${etablissement}`);
        if(response.data){
            setEtablissementBO(response.data);
            setFacture(true);
            setStartFacture(false);
            showToast('success', "Etablissement valide");
        }else{
            showToast('error', "Etablissement non valide. Veuillez contacter l'administrateur!");
        }
    }
    const confirmationFooter = (
        <div>
            <Button raised label={t("save")} icon="pi pi-check" onClick={validEtablissement} />
        </div>
    );
  return (
    <QueryClientProvider client={queryClient}>
        <div className="layout-topbar flex justify-between items-center">
            <div className='flex items-center cursor-pointer ml-5' onClick={() => {router.push('/')}}>
                <img src='/Images/logo-yan.png' alt="logo" width={50}/>
                <span style={{color:'#98c34d', fontSize:'2.3rem', fontWeight: 700}}>YANDOC</span>
                <p className='text-xs mt-4 ml-2' style={{color:'#49509f',fontSize:'2.3rem',fontWeight: 700}}>Solution</p>
            </div>
            <div className="layout-topbar-menu mr-1">
                <Button label="Se Connecter" 
                    icon={clicked ? `pi pi-lock-open`: `pi pi-lock`} 
                    style={{background:'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' , border: 'none', width:'180px', height:'40px'}} 
                    rounded onClick={() => {setClicked(true); router.push('/auth')}}/>
            </div>
        </div>
        <Toast ref={toast} />
        <Dialog
                header="Confirmation"
                visible={startFacture}
                style={{ width: '30vw' }} 
                onHide={() => setStartFacture(false)}
                footer={confirmationFooter}
            >
                <div className="mb-3 field col-12">
                    <label htmlFor="username" className="block text-base font-medium text-gray-700">Intitulé Entreprise</label>
                    <div className="mt-1">
                        <InputText id="etablissement" aria-describedby="username-help" 
                            onChange={(e) => setEtablissement(e.target.value)}
                            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                    </div>
                                
                </div>
            </Dialog>
        {!facture && <div>
            <div className='min-h-[50vh] flex justify-center items-center lg:px-32 px-5 py-8' style={{backgroundColor: '#fefefe'}}>
                <div className='mt-8 items-center text-center w-full lg:w3/4'>
              <h1 className='text-6xl font-semibold leading-tight mt-24 text-center' style={{color: '#4b21a9'}}>Espaces Visiteurs YanDoc</h1>
              <h1 className='text-6xl font-semibold leading-tight mt-24 text-center' style={{color: '#3d9dc3'}}>E-Facture</h1>
              <span className='text-blue-800 text-3xl font-semibold text-center'>Envoyer votre Facture à un partenaire YanDoc</span>
                <p className='ml-8 mr-8 text-lg mt-2 text-justify my-4'>
                Dans le cadre d'une application de GED, l'e-facturation permet de centraliser et de gérer efficacement toutes les 
                factures entrantes et sortantes. Les fonctionnalités clés incluent la réception électronique des factures, la validation
                automatique des données, la routage pour l'approbation et le paiement, ainsi que l'archivage sécurisé conforme aux réglementations
                en vigueur.      
                </p>
                <p className='ml-8 mr-8 text-justify text-lg mt-2 my-6'>
                Grâce à une intégration étroite avec le système de gestion de documents, les utilisateurs peuvent facilement accéder
                aux factures électroniques depuis une seule plateforme, rechercher et récupérer des documents rapidement, et suivre
                l'état des paiements et des approbations en temps réel. De plus, les outils d'analyse intégrés offrent une visibilité 
                accrue sur les tendances des dépenses et les performances financières globales de l'entreprise.
                </p>
              <div className='flex items-center ml-5 text-xl font-semibold px-4 transition-all py-[0.5rem]'>
                <Button label="Envoyer une Demande" icon={!hoveredEnvoiDemande ? "pi pi-arrow-right" : "pi pi-plus"} severity="help" rounded onClick={() => setStartFacture(true)}
                  className='flex items-center ml-5 text-xl font-semibold px-4 transition-all py-[0.5rem] rounded-xl cursor-pointer'
                  style={{background: !hoveredEnvoiDemande ? 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' : 'linear-gradient(-235deg,#4801FF 0%,#0191ff 48%,#bbd151 100%)' , border: 'none'}}
                  onMouseEnter={() => setHoveredEnvoiDemande(true)}
                  onMouseLeave={() => setHoveredEnvoiDemande(false)}
                  />
                  <Button 
                        label="Verifier une signature" 
                        icon={!hoveredVerificationSignature ? "pi pi-arrow-right" : "pi pi-plus"} 
                        severity="help" 
                        rounded 
                        onClick={() => router.push('/verify-signature')}
                        className='flex items-center ml-5 text-xl font-semibold px-4 transition-all py-[0.5rem] rounded-xl cursor-pointer'
                        style={{background: !hoveredVerificationSignature ? 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' : 'linear-gradient(-235deg,#4801FF 0%,#0191ff 48%,#bbd151 100%)' , border: 'none'}}
                        onMouseEnter={() => setHoveredVerificationSignature(true)}
                        onMouseLeave={() => setHoveredVerificationSignature(false)}
                  />
              </div>
          </div>
          <div className='mt-20'>
              <img src="/Images/E-Facture1.jpg" alt='img' width={800}/>
          </div>
      </div>
        </div>}
        {facture && <div className="items-center mt-5">
            <div className="flex justify-center w-full">
                <div className='card p-5 w-full max-w-screen-lg mt-4 min-h-[80vh]'>
                    <Steps model={steps} activeIndex={activeIndex} className='mb-6'/>
                    {activeIndex === 0 && (
                        <div className="flex justify-center gap-4">
                            <div className="flex flex-column justify-center align-items-center" style={{ width: '50%' }}>
                            <FileUpload
                                name="files[]"
                                customUpload
                                uploadHandler={handleFileUpload}
                                chooseLabel={t('choose')}
                                uploadLabel={t('upload')}
                                cancelLabel={t('cancel')}
                                style={{ width: '100%' , height: '500px'}}
                                emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
                            />
                            </div>
                            <div style={{ width: '50%', height: '100%' }}>
                            {(fileUrl) ? (
                                <div style={{ width: '100%', height: '100%' }}>
                                    <iframe title="pdf-preview" src={fileUrl} style={{ width: '100%', height: '800px', border: 'none' }} />
                                </div>
                            ) : (<>
                                <div className="flex flex-column align-items-center justify-content-center border-double border-500 " style={{ width: '100%', height: '700px' }}>
                                    <p>{t("noFileToDisplay")}</p>
                                    <i className="pi pi-file-excel" style={{ fontSize: '2rem', color: '#708090' }}></i>
                                </div>
                            </>)}
                            </div>
                            {/* {fileUrl && <iframe title="pdf-preview" src={fileUrl} width="100%" height="600px" />} */}
                        </div>
                    )}
                    {activeIndex === 1 && (
                        <div className="formgrid grid">
                            <Divider align="left">
                                <span className="p-tag">Informations de l'etablissemant</span>
                            </Divider>
                            <div className="mb-3 field col-6">
                                <label htmlFor="etablissement" className="block text-base font-medium text-gray-700">Intitulé de l'entreprise</label>
                                <div className="mt-1">
                                    <InputText id="etablissement" 
                                        value={etablissementBO.nom}
                                        aria-describedby="username-help"
                                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div className="mb-3 field col-6">
                                <label htmlFor="username" className="block text-base font-medium text-gray-700">Secteur d'activité</label>
                                <div className="mt-1">
                                    <InputText id="username" 
                                    value={etablissementBO.secteur}
                                    aria-describedby="username-help" className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div className="mb-3 field col-6">
                                <label htmlFor="etablissement" className="block text-base font-medium text-gray-700">Pays</label>
                                <div className="mt-1">
                                    <InputText id="etablissement" 
                                        value={etablissementBO.pays}
                                        aria-describedby="username-help"
                                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div className="mb-3 field col-6">
                                <label htmlFor="etablissement" className="block text-base font-medium text-gray-700">Ville</label>
                                <div className="mt-1">
                                    <InputText id="etablissement" 
                                        value={etablissementBO.ville}
                                        aria-describedby="username-help"
                                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <Divider align="left">
                                <span className="p-tag">Informations personnelles</span>
                            </Divider>
                            <div className="p-inputgroup mb-3 field col-6">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Prénom" />
                            </div>
                            <div className="p-inputgroup mb-3 field col-6">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Nom" />
                            </div>
                            <div className="mb-3 field col-6">
                                <label htmlFor="username" className="block text-base font-medium text-gray-700">Numero de Facture</label>
                                <div className="mt-1">
                                    <InputText id="username" aria-describedby="username-help" 
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                                </div>
                                {reference === '' && <small id="username-help" className='text-red-500'>
                                    Enter your N° to validate your facture.
                                </small>}
                            </div>
                            <div className="mb-3 field col-6">
                                <label htmlFor="username" className="block text-base font-medium text-gray-700">RC</label>
                                <div className="mt-1">
                                    <InputText id="username" aria-describedby="username-help" className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                                </div>
                                <small id="username-help">
                                    Enter your Etablissement to validate your facture.
                                </small>
                            </div>
                            {/* <Divider align="left">
                                <span className="p-tag">Envoyer Document au BO</span>
                            </Divider>
                            <div className="mb-3 field col-6">
                                <label htmlFor="dateReception" className="block text-base font-medium text-gray-700">{t("bo.data.dateReception")}</label>
                                <div className="mt-1">
                                <Calendar
                                    id="dateReception"
                                    value={dateReception}
                                    onChange={(e) => setDateReception(e.target.value as string)}
                                    dateFormat="dd/mm/yy"
                                    showIcon={true}
                                    style={{ width: '100%' }}
                                />
                                </div>
                            </div>
                            <div className="mb-3 field col-6">
                                <label htmlFor="dateEcheance" className="block text-base font-medium text-gray-700">{t("bo.data.dateEcheance")}</label>
                                <div className="mt-1">
                                <Calendar
                                    id="dateEcheance"
                                    value={dateEcheance}
                                    onChange={(e) => setDateEcheance(e.target.value as string)}
                                    dateFormat="dd/mm/yy"
                                    showIcon={true}
                                    style={{ width: '100%' }}
                                />
                                </div>
                            </div> */}
                        </div>
                    )}
                    <div className="flex justify-between mt-3">
                        {activeIndex > 0 && <Button label="Précédent" severity='secondary' icon="pi pi-arrow-left" onClick={prevStep} className="mr-2" />}
                        {activeIndex === 1 && <Button label="Sauvegarder" severity='success' icon="pi pi-check" onClick={saveFacture} disabled={reference === ''} loading={loadingA} />}
                        {activeIndex === 0 && <Button label="Suivant" icon="pi pi-arrow-right" onClick={nextStep} disabled={activeIndex === 0 && !filesUploaded} loading={loading} />}
                    </div>
                </div>
            </div>
            
            <Toast ref={toast} />
        </div>}
    </QueryClientProvider>
  )
}
Facture.getLayout = function getLayout(page: ReactElement) {
    return (
      <React.Fragment>
        {page}
        <AppConfig simple />
      </React.Fragment>
    );
  };
export default Facture