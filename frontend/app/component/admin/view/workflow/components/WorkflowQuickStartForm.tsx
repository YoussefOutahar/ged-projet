import axiosInstance from 'app/axiosInterceptor';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentSummaryDto } from 'app/controller/model/DocumentSummary.model';
import { DocumentTypeDto } from 'app/controller/model/DocumentType.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { WorkflowDto } from 'app/controller/model/Workflow.model';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset';
import { DocumentTypeAdminService } from 'app/controller/service/admin/DocumentTypeAdminService.service';
import { WorkflowService } from 'app/controller/service/admin/WorkflowService.service';
import { isExcel } from 'app/utils/documentUtils';
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'

const procesVerbalCategory = process.env.NEXT_PUBLIC_PV_CATEGORY_CODE;
const certificatsCategory = process.env.NEXT_PUBLIC_DEFAULT_DOCUMENT_CATEGORY_WORKFLOW;

type Props = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    workflowPreset: WorkflowPreset,
    connectedUser: UtilisateurDto,
    showToast: React.Ref<Toast>,
    entiteAdministratives: EntiteAdministrativeDto[]
    documentCategories: DocumentCategorieDto[]


}

const WorkflowQuickStartForm = ({ visible, setVisible, workflowPreset, connectedUser, showToast, entiteAdministratives, documentCategories }: Props) => {

    const [workflowDto, setWorkflowDto] = useState<WorkflowDto>(new WorkflowDto())
    const [loading, setLoading] = useState<boolean>(false)

    const [pjAddedSuccess, setPjAddedSuccess] = useState<boolean>(false);
    const [pieceJointeDialog, setPieceJointeDialog] = useState<boolean>(false);
    const [filesUploadedPJ, setFilesUploadedPJ] = useState(false);
    const [pieceJointes, setPieceJointes] = useState<DocumentDto[]>([]);
    const fileUploadPJRef = useRef(null);
    const [files, setFiles] = useState<any[]>();
    const [documentTypes, setDocumentTypes] = useState<DocumentTypeDto[]>([]);
    const documentTypeAdminService = new DocumentTypeAdminService();
    useEffect(() => {
        documentTypeAdminService.getList().then(({ data }) => setDocumentTypes(data)).catch(error => console.log(error));
    }, [])

    const [document, setDocument] = useState<DocumentDto>(new DocumentDto());

    const handleFileUploadPJ = async (e: any) => {
        const files = e.files;
        setFiles(files);
        document.reference = files[0].name;
        const exceldocumentType = documentTypes.filter(docType => isExcel(docType.libelle))[0]
        if (exceldocumentType) document.documentType = exceldocumentType
        document.utilisateur = connectedUser
        document.entiteAdministrative = connectedUser.entiteAdministrative
        document.documentCategorie = documentCategories.find(docCat => docCat?.code?.toLowerCase() === procesVerbalCategory) || null as any;
        if(document.documentCategorie) await getPlanCreation(document.documentCategorie.libelle, workflowDto.title);

        setDocument({ ...document });
        setFilesUploadedPJ(true);
        MessageService.showSuccess(showToast, "Création!", `${files.length} fichier(s) chargé(s) avec succès`);
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
        itemSummary.documentStateId = item.documentState?.id;
        itemSummary.documentTypeId = item.documentType?.id;
        itemSummary.documentCategorieId = item.documentCategorie?.id;
        itemSummary.entiteAdministrativeId = item.entiteAdministrative?.id || connectedUser!.entiteAdministrative?.id;
        itemSummary.planClassementId = item.planClassement?.id;
        itemSummary.utilisateurId = item.utilisateur.id || connectedUser!.id;
        itemSummary.utilisateurEmail = item.utilisateur.email || connectedUser!.email;

        return itemSummary;
    }

    const [loadingPJ, setLoadingPJ] = useState<boolean>(false);
    const AjouterPieceJointe = async () => {
        setPjAddedSuccess(false);
        try {
            setLoadingPJ(true);
            const formData = new FormData();
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (file instanceof Blob) {

                        formData.append('files', file);
                    }
                })
                const documentSummary = toDocumentSummary(document);
                formData.append("documentDTO", JSON.stringify(documentSummary));
            }
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/v2/with-files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setPieceJointes(response.data);
            setLoadingPJ(false);
            setFiles([]);
            let newDocument = new DocumentDto();
            newDocument.entiteAdministrative = document?.entiteAdministrative;
            newDocument.utilisateur = document?.utilisateur;
            newDocument.documentCategorie = document?.documentCategorie;
            newDocument.planClassement = document?.planClassement;
            setDocument(newDocument);
            setFilesUploadedPJ(false);
            setPieceJointeDialog(false);
            setPjAddedSuccess(true);
            MessageService.showSuccess(showToast, "Création!", `Pièce(s) jointe(s) chargée(s) avec succès`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du document:', error);
            setLoadingPJ(false);
            throw error;
        }
    }

    const onHidePjDialog = () => {
        setPieceJointeDialog(false)
        setFiles([]);
        setFilesUploadedPJ(false);
        setDocument(new DocumentDto());
    }

    const getPlanCreation = async (categorieLibelle: string, workflowTitle: string) => {
        const plans = [{ libelle: categorieLibelle }, { libelle: workflowTitle }];
        plans.push({ libelle: 'PV' });
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/multiple`, plans);
            document.planClassement = response.data;
            setDocument({ ...document });
        } catch (error) {
            console.error('Error submitting plans', error);
        }
    }

    const generateEvPlanClassement = async () => {
        const categoryCE = documentCategories.find(docCat => docCat.libelle.toLowerCase() === certificatsCategory)?.libelle || null as any;
        const workflowTitle = workflowDto.title || '';
        if (!workflowPreset.stepPresets || workflowPreset.stepPresets?.length == 0 || categoryCE == null || workflowTitle == "") {
            return null;
        }
        const stepEvaluateurs = workflowPreset.stepPresets?.find(stepPreset => stepPreset.level == 1);

        if (stepEvaluateurs?.destinataires) {
            for (let i = 0; i < stepEvaluateurs?.destinataires?.length; i++) {
                const destinataire = stepEvaluateurs.destinataires[i];
                const ev = "EV" + i.toString() + "-" + destinataire.utilisateur.nom + "-" + destinataire.utilisateur.prenom;
                const plans = [{ libelle: categoryCE }, { libelle: workflowTitle }, { libelle: "CE" }, { libelle: ev }];
                await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/multiple`, plans).catch(error => console.log(error));
            }
        }
    }


    const onCategorieChangeDoc = async (e: DropdownChangeEvent, field: string) => {
        document.documentCategorie = e.value;
        setDocument({ ...document });
        if (e.value) {
            await getPlanCreation(e.value.libelle, workflowDto.title);
        }
    };

    const handleClose = () => {
        setWorkflowDto(new WorkflowDto())
        setPieceJointes([])
        setPjAddedSuccess(false);
        setDocument(new DocumentDto())
        setVisible(false)
    }
    const handleSave = () => {
        setLoading(true); // Activer le spinner et désactiver le bouton

        workflowDto.id = 0;
        workflowDto.stepDTOList = [];
        workflowDto.piecesJointes = pieceJointes;
        workflowPreset.stepPresets?.forEach((stepPreset: StepPresetDTO) => {
            const step: StepDTO = {
                id: 0,
                stepPreset: stepPreset,
                workflowId: 0,
                status: "WAITING",
                discussions: [],
                documents: [],
                createdOn: new Date().toISOString(),
                updatedOn: new Date().toISOString(),
                createdBy: connectedUser!.username,
                updatedBy: connectedUser!.username
            };
            workflowDto.stepDTOList?.push(step)
        })
        workflowDto.workflowPresetDTO = workflowPreset;
        workflowDto.initiateurId = connectedUser.id;

        WorkflowService.createWorkflow(workflowDto)
            .then((response) => {
                MessageService.showSuccess(showToast, "Création!", "Workflow créé avec succès");
                generateEvPlanClassement();
                handleClose();

            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }

    const isFormValid = () => {
        return pieceJointes?.length > 0 && workflowDto?.title.length > 0 && workflowDto?.description && workflowDto.description.length > 0
    }
    return (
        <div>
            <Dialog
                header="Demarrage rapide du flux"
                visible={visible}
                className='relative'
                style={{ width: 'fit' }}
                onHide={handleClose}
                footer={
                    <div className='flex flex-row  gap-2'>
                        <Button label={t("cancel")} onClick={handleClose} text icon="pi pi-times" className='ml-auto ' />
                        <Button label={t("save")} disabled={!isFormValid()} onClick={handleSave} />
                    </div>
                }
            >
                {
                    loading &&
                    <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
                        <ProgressSpinner />
                    </div>
                }
                <div className='grid'>
                    <div className="col-5 ">
                        <label className=' text-base font-semibold ' htmlFor="title">{t("workflow.titre")} </label>
                        <div className='mt-2'>
                            <InputText
                                id="title"
                                value={workflowDto.title}
                                className='w-full'
                                onChange={(e) => setWorkflowDto({ ...workflowDto, title: e.target.value })}
                                required
                                autoFocus
                            />
                        </div>
                        {!isFormValid() && workflowDto.title.length == 0 && <small className="text-red-500">*{t("requiredField")}</small>}
                    </div>
                    <div className=" col-5  ">
                        <label className='mb-2 text-base font-semibold my-0' htmlFor="flag">{t("workflow.flag")}</label>
                        <div className="flex mt-2  ">
                            <Button
                                className={`flex-grow-1 mr-0 border-noround-right  ${workflowDto.flag === 'BASSE' ? '' : 'bg-white text-900'}`}
                                label={WorkflowDTO.getWorkflowFlagLabel(WorkflowDTO.FlagEnum.BASSE)}
                                severity={'secondary'}
                                onClick={() => { setWorkflowDto({ ...workflowDto, flag: WorkflowDTO.FlagEnum.BASSE }); }}
                            />
                            <Button
                                className={`flex-grow-1 ml-0 border-noround  ${workflowDto.flag === WorkflowDTO.FlagEnum.NORMALE ? '' : 'bg-white text-900'}`}
                                label={WorkflowDTO.getWorkflowFlagLabel(WorkflowDTO.FlagEnum.NORMALE)}
                                severity={workflowDto.flag === 'NORMALE' ? 'info' : 'secondary'}
                                onClick={() => { setWorkflowDto({ ...workflowDto, flag: WorkflowDTO.FlagEnum.NORMALE }); }}
                            />
                            <Button
                                className={`flex-grow-1 ml-0 border-noround-left  ${workflowDto.flag === 'URGENT' ? 'bg-red-700' : 'bg-white text-900'}`}
                                label={WorkflowDTO.getWorkflowFlagLabel(WorkflowDTO.FlagEnum.URGENT)}
                                severity={workflowDto.flag === 'URGENT' ? 'danger' : 'secondary'}
                                onClick={() => { setWorkflowDto({ ...workflowDto, flag: 'URGENT' }); }}
                            />
                        </div>
                    </div>
                    <div className="field col-2 ">
                        <label className='mb-2 text-base font-semibold my-0' htmlFor="pieceJointe">{t("workflow.pieceJointes")}</label>
                        <div className='mt-2'>
                            <Button
                                className={`${pjAddedSuccess ? "bg-primary" : "bg-primary-reverse"} w-full   `}
                                label={`${pjAddedSuccess ? "Chargés" : "Charger"}`}
                                icon={`${pjAddedSuccess ? "pi pi-paperclip" : "pi pi-plus"}`}
                                onClick={(e) => { setPieceJointeDialog(true); }}
                                disabled={workflowDto?.title === ''}
                            />
                        </div>
                    </div>
                    <div className="flex flex-column  col-12 mt-0 gap-0">
                        <label className=' text-base font-semibold mb-2 ' htmlFor="description">Demande</label>
                        <div className='w-full flex flex-column '>
                            <InputTextarea
                                id="description"
                                value={workflowDto.description}
                                rows={5}
                                className='w-full'
                                onChange={(e) => setWorkflowDto({ ...workflowDto, description: e.target.value })}
                                required
                            />
                            {!isFormValid() && (!workflowDto.description || workflowDto.description.length == 0) && <small className="text-red-500">*{t("requiredField")}</small>}
                        </div>

                    </div>
                </div>
            </Dialog>
            <Dialog header="Ajouter des Pièces Jointes" visible={pieceJointeDialog} modal style={{ width: '47vw' }} onHide={onHidePjDialog}
                footer={
                    <>
                        <Button label="Annuler" icon="pi pi-times" severity='danger' onClick={onHidePjDialog} className="p-button-text" loading={loadingPJ} />
                        <Button label="Valider" icon="pi pi-check" severity="info" disabled={files?.length == 0 || !document || document?.documentCategorie == null || document?.entiteAdministrative == null} onClick={AjouterPieceJointe} autoFocus />
                    </>
                }>
                {loadingPJ &&
                    <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
                        <ProgressSpinner />
                    </div>
                }
                <FileUpload
                    ref={fileUploadPJRef}
                    name="files[]"
                    customUpload
                    chooseLabel={t("choose")}
                    uploadLabel={t("upload")}
                    cancelLabel={t("cancel")}
                    multiple
                    accept=".xls, .xlsx, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
                    uploadHandler={handleFileUploadPJ}
                    emptyTemplate={<p className="m-0">{t("document.dragDrop")}</p>}
                />
                {filesUploadedPJ &&
                    <div className="formgrid grid">
                        <Divider layout='horizontal'></Divider>
                        <div className="field col-12">
                            <span className='text-blue-700 font-bold text-lg'>{t("document.classifyNewDocument")}</span>
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                            <Dropdown showClear id="documentCategorieDropdown" value={document.documentCategorie}
                                options={documentCategories}
                                onChange={(e) => onCategorieChangeDoc(e, 'documentCategorie')}
                                placeholder={t("document.documentCategoriePlaceHolder")} filter
                                filterPlaceholder={t("document.documentCategoriePlaceHolderFilter")}
                                optionLabel="libelle" className='w-full' />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label>
                            <Dropdown
                                id="entiteAdministrativeDropdown"
                                showClear
                                value={document?.entiteAdministrative?.libelle}
                                options={entiteAdministratives.map((entite) => entite.libelle)}
                                onChange={(e) => {
                                    document.entiteAdministrative = entiteAdministratives.find(entite => entite.libelle === e.value) || null as any;
                                    setDocument({ ...document });
                                }}
                                placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                                filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                                className='w-full' />
                        </div>
                    </div>
                }
            </Dialog>
        </div>
    )
}

export default WorkflowQuickStartForm 