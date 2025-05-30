import axiosInstance from 'app/axiosInterceptor'
import { DocumentDto } from 'app/controller/model/Document.model'
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model'
import { DocumentSummaryDto } from 'app/controller/model/DocumentSummary.model'
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model'
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model'
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service'
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service'
import { associateDocumentType } from 'app/utils/documentUtils'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FileUpload, ItemTemplateOptions } from 'primereact/fileupload'
import { InputTextarea } from 'primereact/inputtextarea'
import { TabPanel, TabView } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useDocCategorieStore from 'Stores/DocumentCategorieStore'
import useDocTypeStore from 'Stores/DocumentTypeStore'
import useEntiteAdministrativesStore from 'Stores/EntiteAdministrativesStore'
import usePlanClassementStore from 'Stores/PlanClassementStore'
import useDocumentStateStore from 'Stores/DocumentStateStore';
import { doc } from 'prettier'
import { set } from 'lodash'
import { AuthService } from 'app/zynerator/security/Auth.service'
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service'
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model'
import { Tag } from 'primereact/tag'
import { ProgressSpinner } from 'primereact/progressspinner'
import { ProgressBar } from 'primereact/progressbar'
import { AutoComplete } from 'primereact/autocomplete'
import axios from 'axios'

interface DocumentFormDialogProps {
    visible: boolean;
    onClose: () => void;
    showToast: (severity: SeverityType, summary: string) => void;
    plan? : any
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const AddSummary: React.FC<DocumentFormDialogProps>= ({visible, onClose, showToast, plan}) => {

    const { t } = useTranslation();

    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef(null);

    const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {documentState} = useDocumentStateStore(state => ({documentState: state.state6}));
    const [document, setDocument] = useState<DocumentDto>(new DocumentDto());

    useEffect(() => {
        if (plan) {
            document.planClassement = plan;
            setDocument({ ...document});
        }
    }, [plan]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [noResults, setNoResults] = useState(false);
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
        if (plan == null ) return
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

    const[loading, setLoading] = useState(false);

    const [files, setFiles] = useState<any[]>();
    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
    const [filesUploadedWF, setFilesUploadedWF] = useState(false);

    const { documentTypes, documentType } = useDocTypeStore(state => ({ documentTypes: state.types, documentType: state.type }));

    
    const authService = new AuthService();
    const utilisateurService = new UtilisateurAdminService();

    useEffect(() => {
        const connectedUserName = authService.getUsername();
        if (connectedUserName) {
            const utilisateurCriteria = new UtilisateurCriteria();
            utilisateurCriteria.username = connectedUserName;
            utilisateurService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
                const user = data?.list[0];
                if (user) {
                    setConnectedUser(user);
                }
            });
        }
    }, []);
    const [progressBar , setProgressBar] = useState(false);
    const handleFileUpload = async (e: any) => {
        const files = e.files;
        setFiles(files);
        const initialStatus: { [key: string]: string }= {};
        files.forEach((file: any) => {
            initialStatus[file.name] = 'Pending';
        });
        setUploadStatus(initialStatus);
        setProgressBar(true)

        document.entiteAdministrative = connectedUser.entiteAdministrative;
        document.planClassement = plan;

        for (const file of files) {
          await simulateFileUpload(file);
        }

        setProgressBar(false);

        const fileUrl = e.files && e.files[0];
        const docType = await associateDocumentType(fileUrl,  documentTypes);
        if (docType) {
            setDocument({ ...document, documentType: docType });   
        }
        setFilesUploadedWF(true);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `${files.length}fichier(s) chargé(s) avec succès`, life: 3000 });
    };
    const onCategorieChangeDoc = async (e: DropdownChangeEvent, field: string) => {
        document.documentCategorie = e.value;
        setDocument({ ...document });
    };
    const onEntiteAdministrativeChange = (e: DropdownChangeEvent, field: string) => {
        const selectedEntiteAdministrative = entiteAdministratives.find(entite => entite.libelle === e.value);
        setDocument((prevState) => ({ ...prevState, [field]: selectedEntiteAdministrative }));
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDocument({
          ...document,
          [e.target.name]: e.target.value,
        });
    };
    const onDropdownChange = (e: DropdownChangeEvent, field: string) => {
        document.planClassement = e.value;
        setDocument({ ...document });
    };

    const toDocumentSummary = (item: DocumentDto) => {
        const itemSummary = new DocumentSummaryDto();
        itemSummary.reference = item.reference;
        itemSummary.description = item.description;
        itemSummary.colonne = item.colonne;
        itemSummary.ligne = item.ligne;
        itemSummary.numBoite = item.numBoite;
        itemSummary.size = item.size;
        itemSummary.uploadDate = item.uploadDate.toString();
        itemSummary.documentStateId = documentState && documentState?.id;
        itemSummary.documentTypeId = documentType && documentType?.id;
        itemSummary.documentCategorieId = item.documentCategorie?.id;
        itemSummary.entiteAdministrativeId = item.entiteAdministrative.id || connectedUser!.entiteAdministrative.id;
        itemSummary.planClassementId = item.planClassement.id || plan.id;
        itemSummary.utilisateurId = connectedUser!.id;
        itemSummary.utilisateurEmail = item.utilisateur.email || connectedUser!.email;

        return itemSummary;
    }
    const ajouterDocumentV2Masse = () => {
        setLoading(true);
        const form = new FormData();

        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file instanceof Blob) {
                    form.append('files', file);
                }
            })
            const documentSummary = toDocumentSummary(document);
            form.append('documentDTO', JSON.stringify(documentSummary));

            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-files`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((responses) => {
                    showToast('success', 'Success: Opération faite avec success');
                    setLoading(false);
                    onHideDialog();
                })
                .catch((error) => {
                    console.error('Erreur lors de la résolution des requêtes:', error);
                    showToast('error', 'Error: Erreur lors de l\'ajout des documents');
                });
        }
    };
    const onHideDialog = () => {
        onClose();
        setFiles([]);
        setFilesUploadedWF(false);
        setDocument(new DocumentDto());
    }
    const itemDialogFooter = (
        <>
          <Button raised label={t("cancel")} icon="pi pi-times" text onClick={onHideDialog} />
          <Button raised label={t("save")} icon="pi pi-check" loading={loading} 
            disabled={
                !files || 
                files.length === 0 || 
                !plan || 
                !document.planClassement?.id || 
                !document.entiteAdministrative?.id || 
                !document.documentCategorie?.id
            } 
            onClick={ajouterDocumentV2Masse} />
        </>
    );
   
    const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>({});

    const itemTemplate = (file: object, options: ItemTemplateOptions) => {
        const fileName = (file as { name?: string }).name || 'Unknown file';
        const fileSize = (file as { size?: number }).size || 0;
        const fileSizeKB = ((fileSize / 1024) / 1024).toFixed(3); 
        return (
            <div className="flex justify-content-between align-items-center w-full">
                <div className="flex flex-column">
                    <span> <i className="pi pi-file mr-2"></i>{fileName}</span>
                    <small className="flex align-items-center">{fileSizeKB} MB 
                        <Tag
                            value={uploadStatus[fileName] || 'Pending'}
                            severity={uploadStatus[fileName] === 'Completed' ? 'success' : 'warning'}
                            className="ml-2 text-xs"
                            rounded
                        />
                    </small>
                </div>
                <Button
                    icon="pi pi-times"
                    onClick={(e) => {
                        options.onRemove && options.onRemove(e);
                        setFiles(prevFiles => prevFiles && prevFiles.filter((f) => f !== file));
                        setUploadStatus(prev => ({ ...prev, [fileName]: 'Pending' }));
                    }}
                    style={{ width: '2rem', height: '2rem' }}
                    className="p-button-text p-button-rounded p-button-plain"
                />
          </div>
        );
    };


    
      const simulateFileUpload = (file: any) => {
        return new Promise<void>((resolve) => {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'Completed' }));
            resolve();
        });
      };
      const progressBarTemplate = (file: any) => {
        return (
            <>
                {progressBar && (
                    <ProgressBar className='w-full' 
                        mode="indeterminate"
                        //strokeWidth="2" animationDuration=".5s" 
                        //fill="var(--surface-ground)" 
                    />
                )}
            </>
        );
      }

  return (
    <div>
      <Dialog
      visible={visible}
      closeOnEscape
      style={{ width: '70vw' }}
      header="Ajouter un document"
      modal
      className="p-fluid"
      footer={itemDialogFooter}
      onHide={onHideDialog}
     >
      <TabView activeIndex={0} onTabChange={() => {}}>
        <TabPanel header="Document Details">
          <div className="formgrid grid">
          <div className="field col-12">
              <label>{t("document.files")}</label>
              <FileUpload
                className=''
                ref={fileUploadRef}
                name="files[]"
                customUpload
                multiple
                uploadHandler={handleFileUpload}
                chooseLabel={t('choose')}
                uploadLabel={t('upload')}
                cancelLabel={t('cancel')}
                itemTemplate={itemTemplate}
                progressBarTemplate={progressBarTemplate}
                emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
              />
            </div>
            {filesUploadedWF && 
                <>
                     <div className="field col-4">
                        <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label><br />
                        <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                            options={documentCategories}
                            className='w-full'
                            onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                            placeholder={t("document.documentCategoriePlaceHolder")} filter
                            filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                            optionLabel="libelle" />
                    </div>
                    <div className="field col-4">
                        <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label><br />
                        <Dropdown showClear id="entiteAdministrativeDropdown" 
                            value={document?.entiteAdministrative?.libelle}
                            options={entiteAdministratives.map((entite) => entite.libelle)}
                            className='w-full'
                            onChange={(e) => onEntiteAdministrativeChange(e, 'entiteAdministrative')}
                            placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                            filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                             />
                    </div>
                    <div className="field col-4">
                    <label htmlFor="planClassementCode">{t("document.classificationPlan")}</label>
                        <AutoComplete
                            inputId='planClassement'
                            id="planClassementDropdown"
                            value={document.planClassement}
                            suggestions={filteredPlans}
                            itemTemplate={(item: any) => <>{planHierarchieTemplate(item)}</>}
                            completeMethod={searchPlans}
                            field="libelle"
                            onChange={(e) => onDropdownChange(e, 'planClassement')}
                            placeholder={t("document.classificationPlan")}
                        /> 
                        {noResults && (
                            <small className="p-invalid p-error font-bold">Aucun plan de classement trouvé.</small>
                        )} 
                    </div>
                    <div className="field col-12">
                    <label htmlFor="description">{t("document.description")}</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={document.description}
                        onChange={handleInputChange}
                        rows={5} cols={30}
                    />
                    </div>
                </>
            }
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
    </div>
  )
}

export default AddSummary;
