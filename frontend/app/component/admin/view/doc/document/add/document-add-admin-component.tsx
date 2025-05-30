import useDocCategorieStore from 'Stores/DocumentCategorieStore';
import useEntiteAdministrativesStore from 'Stores/EntiteAdministrativesStore';
import usePlanClassementStore from 'Stores/PlanClassementStore';
import useUtilisateurStore from 'Stores/Users/UtilsateursStore';
import axiosInstance from 'app/axiosInterceptor';
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';

interface DocumentDTOSummary {
    reference: string;
    description: string;
    dateDocument: string;
    documentCategorieCode: string;
    documentStateCode: string;
    userName: string;
    entiteAdministrativeCode: string;
    planClassementCode: string;
    ligne: number | null;
    colonne:number | null;
    numBoite:number | null;
}
interface DocumentFormDialogProps {
    visible: boolean;
    onClose: () => void;
    showToast: (severity: SeverityType, summary: string) => void;
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const AddMasse: React.FC<DocumentFormDialogProps>= ({visible, onClose,showToast}) => {
    const [formData, setFormData] = useState<DocumentDTOSummary>({
        reference: '',
        description: '',
        dateDocument: '',
        documentCategorieCode: '',
        documentStateCode: '',
        userName: '',
        entiteAdministrativeCode: '',
        planClassementCode: '',
        ligne: null,
        colonne: null,
        numBoite: null,
    });
    const [selectedData, setSelectedData] = useState({
        documentCategorieCode: '',
        userName: '',
        entiteAdministrativeCode: '',
    });
    const [ligne, setLigne] = useState<number | null>();
    const [colonne, setColonne] = useState<number | null>();
    const [numBoite, setNumBoite] = useState<number | null>();

    const utilisateurs = useUtilisateurStore(state => state.utilisateurs);
    const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {planClassementsNoArchive: planClassements} = usePlanClassementStore();
    const [filesUploaded, setFilesUploaded] = useState(false);

    const fileUploadRef = useRef(null);
    const { t } = useTranslation();

    const flattenDropdownOptions = (
        plans: any[],
        parentLabel: string = '',
        processedChildren = new Set()
      ): { label: string; value: any }[] => {
        return plans.reduce((options, plan) => {
          const fullLabel = parentLabel ? `${parentLabel} > ${plan.libelle}` : plan.libelle;
          //options.push({ label: fullLabel, value: plan.code });
      
          if (!processedChildren.has(plan.code)) {
            options.push({ label: fullLabel, value: plan.code });
            processedChildren.add(plan.code);
      
            if (plan.children && plan.children.length > 0) {
              // Ajouter le code de l'enfant à l'ensemble des enfants traités
              options = options.concat(flattenDropdownOptions(plan.children, fullLabel, processedChildren));
            }
          }
      
          return options;
        }, [] as { label: string; value: any }[]);
    };
    const planClassementOptions = flattenDropdownOptions(planClassements);

    const [isArchivagePhysiqueChecked, setIsArchivagePhysiqueChecked] = useState(false);

    const handleArchivagePhysiqueSwitchChange = (e : InputSwitchChangeEvent) => {
      setIsArchivagePhysiqueChecked(e.value ?? false);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    };
    const onInputDateChange = (e: CalendarChangeEvent, name: string) => {
      const value = (e.value) || "";
      setFormData({ ...formData, [name]: value });
    };
    const handleDropdownChange = (fieldName: string, e: DropdownChangeEvent) => {
        if(fieldName === 'userName'){
            setSelectedData((prevValues) => ({
                ...prevValues,
                userName: e.value.username,
            }));
        }else{
            setSelectedData((prevValues) => ({
                ...prevValues,
                [fieldName]: e.value.code,
            }));
        }
        setFormData({
            ...formData,
            [fieldName]: e.value,
        });
    };
    const [files, setFiles] = useState<any[]>();
    const handleFileUpload = (e: any) => {
        const files = e.files;
        setFiles(files);
        setFilesUploaded(true);
        showToast('success', `${files.length}`+t('success.uploadSuccess')); 
    };
    const ajouterDocumentV2 = () => {
        const postPromises: Promise<any>[] = [];

        if (files && files.length > 0) {
            Array.from(files).forEach((file) => {
              if (file instanceof Blob) {
                const form = new FormData();

                form.append('file', file);
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                form.append('documentDTO', JSON.stringify({
                    ...formData,
                    reference: fileName,
                    //documentStateCode: selectedData.documentStateCode,
                    documentCategorieCode: selectedData.documentCategorieCode,
                    entiteAdministrativeCode: selectedData.entiteAdministrativeCode,
                    //planClassementCode: selectedData.planClassementCode,
                    userName : selectedData.userName,
                }));
                postPromises.push(
                    axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-file`, form , {
                        headers: {
                        'Content-Type': 'multipart/form-data',
                        }
                    })
                );
                Promise.all(postPromises)
                    .then((responses) => {
                        showToast('success', 'Toutes les requêtes POST ont réussi');
                        onClose();
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la résolution des requêtes:', error);
                        showToast('error', "Erreur lors de la résolution des requêtes");
                    });
              }
            });
        }
    };
    const [loading, setLoading] = useState(false);
    const ajouterDocumentV2Masse = () => {
      setLoading(true);
      if (!filesUploaded) {
        showToast('error', 'Veuillez d\'abord charger les fichiers.'); // Show error toast if files are not uploaded
        return;
      }
        const form = new FormData();

        if (files && files.length > 0) {
            files.forEach((file) => {
              if (file instanceof Blob) {

                form.append('files', file);
              }
            })
            form.append('documentDTO', JSON.stringify({
                ...formData,
                documentCategorieCode: selectedData.documentCategorieCode,
                entiteAdministrativeCode: selectedData.entiteAdministrativeCode,
                userName : selectedData.userName,
                ligne: ligne,
                colonne: colonne,
                numBoite: numBoite,
            }));

            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-files`, form , {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            })
            .then((responses) => {
                showToast('success', 'Opération faite avec success');
                setLoading(false);
                onClose();
                setLigne(null);
                setColonne(null);
                setNumBoite(null);
                setFormData({
                  reference: '',
                  description: '',
                  dateDocument: '',
                  documentCategorieCode: '',
                  documentStateCode: '',
                  userName: '',
                  entiteAdministrativeCode: '',
                  planClassementCode: '',
                  ligne: null,
                  colonne: null,
                  numBoite: null,
                });
                setIsArchivagePhysiqueChecked(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la résolution des requêtes:', error);
                showToast('error', "Erreur lors de l'ajout des documents");
            });
        }
    };
    const itemDialogFooter = (
        <>
          <Button raised label={t("cancel")} icon="pi pi-times" text onClick={onClose} />
          <Button raised label={t("save")} icon="pi pi-check" loading={loading} onClick={ajouterDocumentV2Masse} />
        </>
    );
  return (
    <Dialog
      visible={visible}
      closeOnEscape
      style={{ width: '70vw' }}
      header="Ajouter un document"
      modal
      className="p-fluid"
      footer={itemDialogFooter}
      onHide={onClose}
     >
      <TabView activeIndex={0} onTabChange={() => {}}>
        <TabPanel header="Document Details">
          <div className="formgrid grid">
            <div className="field col-4">
              <label htmlFor="documentCategorieCode">{t("document.documentCategorie")}</label>
                <Dropdown showClear id="documentCategorieDropdown" 
                  value={formData.documentCategorieCode}
                  options={documentCategories} 
                  placeholder={t("document.documentCategoriePlaceHolder")} 
                  onChange={(e) => handleDropdownChange('documentCategorieCode', e)}
                  filter
                  optionLabel={t("libelle")} />
            </div>
            {/* <div className="field col-4">
              <label htmlFor="uploadDate">{t("document.documentDate")}</label>
                <Calendar id="uploadDate" value={formData.dateDocument}
                  onChange={(e) => onInputDateChange(e, 'uploadDate')} 
                  dateFormat="dd/mm/yy"
                  showIcon={true} />
            </div> */}
            <div className="field col-4">
              <label htmlFor="entiteAdministrativeCode">{t("document.entiteAdministrative")}</label>
                <Dropdown showClear id="entiteAdministrativeDropdown" 
                  value={formData.entiteAdministrativeCode}
                  options={entiteAdministratives} 
                  placeholder={t("document.entiteAdministrativePlaceHolder")} 
                  onChange={(e) => handleDropdownChange('entiteAdministrativeCode', e)}
                  filter
                  optionLabel="libelle" />
            </div>
            <div className="field col-4">
              <label htmlFor="planClassementCode">{t("document.classificationPlan")}</label>
                <Dropdown showClear id="planClassementDropdown" 
                  value={formData.planClassementCode}
                  options={planClassementOptions} 
                  placeholder={"Selectionner un plan"} 
                  onChange={(e) => handleDropdownChange('planClassementCode', e)}
                  filter
                  optionLabel="label" optionValue='value' />
            </div>
            {/* <div className="field col-4">
              <label htmlFor="userName">{t("document.utilisateur")}</label>
                <Dropdown showClear id="userDropdown" 
                  value={formData.userName}
                  options={utilisateurs} 
                  placeholder={t("document.utilisateurPlaceHolder")}
                  onChange={(e) => handleDropdownChange('userName', e)}
                  filter
                  optionLabel="nom" />
            </div> */}
            <div className="field col-12">
              <label htmlFor="description">{t("document.description")}</label>
              <InputTextarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5} cols={30}
              />
            </div>
            <div className="field col-12">
              <label>{t("document.files")}</label>
              <FileUpload
                ref={fileUploadRef}
                name="files[]"
                multiple
                customUpload //change status file in upload to completed
                uploadHandler={handleFileUpload}
                chooseLabel= {t('choose')}
                uploadLabel={t('upload')}
                cancelLabel={t('cancel')}
                emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
              />
            </div>
            {/* <div className="field col-2">
              <label htmlFor="archivagePhysique">{t("appBar.archive")}</label>
              <span className="p-float-label">
                <InputSwitch
                  checked={isArchivagePhysiqueChecked}
                  onChange={handleArchivagePhysiqueSwitchChange}
                />
              </span>
            </div> */}
            {isArchivagePhysiqueChecked && (
              <>
                <div className="field col-3">
                  <label htmlFor="ligne">{t("document.line")}</label>
                  <InputNumber
                    id="ligne"
                    name="ligne"
                    showButtons
                    min={0}
                    value={formData.ligne}
                    onChange={(e) => setLigne(e.value ?? null)}
                  />
                </div>
                <div className="field col-3">
                  <label htmlFor="colonne">{t("document.colone")}</label>
                  <InputNumber
                    id="colonne"
                    name="colonne"
                    showButtons
                    min={0}
                    value={formData.colonne}
                    onChange={(e) => setColonne(e.value ?? null)}
                  />
                </div>
                <div className="field col-3">
                  <label htmlFor="numBoite">{t("document.boite")}</label>
                  <InputNumber
                    id="numBoite"
                    name="numBoite"
                    showButtons
                    min={0}
                    value={formData.numBoite}
                    onChange={(e) => setNumBoite(e.value ?? null)}
                  />
                </div>
              </>
            )}
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
  )
}

export default AddMasse