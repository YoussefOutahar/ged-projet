import { Dialog } from 'primereact/dialog'
import React, { use, useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';
import { Toast } from 'primereact/toast';
import { Document, Page, pdfjs } from "react-pdf";

import { OrganizationChart } from 'primereact/organizationchart';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { Badge } from 'primereact/badge';
import Discussions from './Discussions';
import { DocumentDto } from 'app/controller/model/Document.model';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { t } from 'i18next';
import EditFile from '../doc/document/edit/document-edit-file-admin.component';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import useListHook from 'app/component/zyhook/useListhook';
import { tr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Step } from 'app/controller/model/workflow/step';
import { stepService } from 'app/controller/service/workflow/stepService';
import SignDocument from '../doc/parapheur/SignDocument';
import { MessageService } from 'app/zynerator/service/MessageService';
import { PA } from 'country-region-data';


type Props = {
    workflow: WorkflowDTO;

}
interface DocumentViewerProps {
    loading: boolean;
    error: boolean;
    documentBase64: string[];
    numPages: number;
    pageNumber: number;
    onPageChange: (pageNumber: number) => void;
    setNumPages: (numPages: number) => void;
}

type Level = {
    expanded: boolean | undefined;
    label: number | undefined;
    type: string | 'level';
    data: StepDTO[] | undefined;
    children: any[];
}
const StepHierarchy = ({ workflow }: Props) => {

    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const [tree] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDocumentsStep, setCurrentDocumentsStep] = useState<DocumentDto[]>([]);
    const [showDocumentsStep, setShowDocumentsStep] = useState(false);
    const [viewDocument, setViewDocument] = useState(false);
    const documentAdminService = new DocumentAdminService();
    const [documentBase64, setDocumentBase64] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const service = new DocumentAdminService();

    const [currentStep, setCurrentStep] = useState<StepDTO | null>(null); // Track current step

    const [descriptionDialogVisible, setDescriptionDialogVisible] = useState(false);
    const [currentDescription, setCurrentDescription] = useState("");

    const truncateDescription = (description: string, length = 100) => {
        if (description.length > length) {
            return `${description.substring(0, length)}`;
        }
        return description;
    };






    const    handleViewStepDocuments = (step: StepDTO) => {
        setCurrentStep(step);
        setCurrentDocumentsStep(step.documentsActions || []);
        setShowDocumentsStep(true);
        setDocumentViewDialogVisible(true);


    };

    const docEdited = (document: DocumentDto) => {
        if (currentStep) {
          currentStep.documentsActions?.push(document);
            stepService.updateStepDocument(currentStep).then(() => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Document ajouté avec succès', life: 3000 });
            }).catch(() => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une erreur s est produite lors de l ajout du document', life: 3000 });
            });

        }
    };
    const [documentS, setdocumentS] = useState<DocumentDto>();

    const singDoc = (idDocument: string) => {
        const criteria = new DocumentCriteria();
        criteria.reference = idDocument;

        documentAdminService.findPaginatedByCriteria(criteria)
        .then(({ data }) => {
            if (currentStep) {
                currentStep.documentsActions?.push(data.list[0]);
                  stepService.updateStepDocument(currentStep).then(() => {
                      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Document ajouté avec succès', life: 3000 });
                  }).catch(() => {
                      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une erreur s est produite lors de l ajout du document', life: 3000 });
                  });
      
              }

        })
        .catch((error) => {
          setError(true);
          MessageService.showError(toast.current, "Error!", "Une erreur s'est produite lors de la récupération du document");
        })
   
    };



    // const handleDocumentSigned = (signedDocument : DocumentDto) => {
    //     if (signedDocument) {
    //         console.log('Document signé reçu:', signedDocument);
    //         // Vous pouvez maintenant utiliser le document signé ici
    //     } else {
    //         console.error('Échec de la signature du document');
    //     }
    // };

    const DocumentViewer: React.FC<DocumentViewerProps> = ({ loading, error, documentBase64, numPages, pageNumber, onPageChange, setNumPages }) => {
        return (
            <>
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <ProgressSpinner />
                    </div>
                )}
                {error && (
                    <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                )}
                {!loading && !error && documentBase64 && (
                    <div> 
                        {numPages > 1 && (
                            <div className="mb-3">
                                <p>Page {pageNumber} of {numPages}</p>
                                <Button
                                    raised
                                    label="Previous"
                                    className="mr-5 w-2"
                                    onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                                    disabled={pageNumber === 1}
                                />
                                <Button
                                    raised
                                    label="Next"
                                    className="mr-2 w-2"
                                    onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
                                    disabled={pageNumber === numPages}
                                />
                            </div>
                        )}
                        <div style={{ width: "100%", height: 920, padding: "50px" }}>
                        <iframe src={`data:application/pdf;base64,${documentBase64}`} width="100%" height="100%" title="document" />

                        </div>
                    </div>
                )}
            </>
        );
    };
    const [documentViewDialogVisible, setDocumentViewDialogVisible] = useState(false);

    const onPageChange = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };

    const closeDialog = () => {
        setDocumentBase64([]);
        setDocumentViewDialogVisible(false);
        setShowDocumentsStep(false); // Assurez-vous de réinitialiser également cet état si nécessaire
        setViewDocument(false); // Assurez-vous de réinitialiser également cet état si nécessaire
    };
    const getDocumentBase64 = (index: number) => {
        setLoading(true);
        documentAdminService.getDocumentBase64(index)
            .then(({ data }) => {
                setDocumentBase64(data);
            })
            .catch((error) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une erreur s est produite lors de la récupération du document', life: 3000 });
            })
            .finally(() => {
                setLoading(false);
            });
    }
    const op = useRef<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    const toggleOverlayPanel = (e: any) => {
        setIsVisible(prev => !prev);
        if (!isVisible) {
            op.current?.toggle(e);
        }
    };
 
    const toastRef = useRef<Toast>(null);
    const defineLevels = (steps: StepDTO[]) => {
        let levels: Level[] = [];
        steps.forEach((step) => {
            const foundLevel = levels.find((level) => level.label === step.stepPreset.level);
            if (foundLevel) {
                if (!foundLevel.data) {
                    foundLevel.data = [];
                }
                foundLevel.data.push(step);
            } else {
                levels.push({
                    expanded: true,
                    label: step.stepPreset.level,
                    type: 'level',
                    data: [step],
                    children: []
                });
            }
        });
        return levels;
    }
    const statusToFrench: { [key: string]: string } = {
        WAITING: t("workflow.Waiting"),
        IN_PROGRESS: t("workflow.Progress"),
        REJECTED: t("workflow.Rejeter"),
        DONE: t("workflow.Done"),
        Annulled: t("annuler"),
        PARTIAL: t("workflow.Partial"),
        COMPLEMENT: t("workflow.Complement"),
    };

    const constructTree = (levels: Level[]) => {
        for (let i = 0; i < levels.length; i++) {
            if (i === 0) {
                tree.push(levels[i]);
            } else {
                let parent = levels[i - 1];
                let current = levels[i];
                parent.children.push(current);
            }
        }
    };
    useEffect(() => {
        if (workflow) {
            const levels = defineLevels(workflow.stepDTOList || []);
            constructTree(levels);
        }
    }, [workflow]);

    const statusToColor: { [key: string]: "success" | "info" | "warning" | "danger" } = {
        WAITING: 'warning',
        IN_PROGRESS: 'info',
        REJECTED: 'danger',
        DONE: 'success',
        Annulled: 'danger',
        PARTIAL: 'info',
    };
    const [docSlectedFTable, setDocSlectedFTable] = useState<DocumentDto>();


    const emptyItem = new DocumentDto();
    const emptyCriteria = new DocumentCriteria();
    const refresh = () => {
    }
    const { items, update } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t, refresh });
    const [showDialogEditFile, setShowDialogEditFile] = useState(false);
    const showEditFileModal = () => {
        setShowDialogEditFile(true);
    }

    const ViewDocument = () => {
        if(viewDocument){
          setViewDocument(false);
        }else{
          setViewDocument(true);}
        }


     
   

    const nodeTemplate = (node: any) => {
        if (node.type === 'level') {
            return (
                <div>
                    <div className="node-content flex flex-wrap gap-4 justify-content-center">
                        {
                            node.data?.map((step: StepDTO) => (
                                <div style={{ 
                                    position: 'relative', 
                                    boxShadow: step.status === StepDTO.StatusEnum.WAITING ? '0px 0px 20px 5px rgba(255, 165, 0, 0.5)' : step.status === StepDTO.StatusEnum.DONE ? '0px 0px 20px 5px rgba(0, 255, 0, 0.5)' : step.status === StepDTO.StatusEnum.REJECTED ? '0px 0px 20px 5px rgba(255, 0, 0, 0.5)' : step.status === StepDTO.StatusEnum.PARTIAL ? '0px 0px 20px 5px rgba(0, 0, 255, 0.5)' : 'none',
                                }} className="">
                                    {
                                        (step.discussions && step.discussions.length > 0) && (
                                            <Discussions step={step} />
                                        )
                                    }
                                    {(step.documentsActions && step.documentsActions.length > 0) && (
                                        <button type="button" className="p-link layout-topbar-button" onClick={() => handleViewStepDocuments(step)} style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '2rem', zIndex: '1' }}>
                                            <i className="pi pi-file p-overlay-badge text-4xl"></i>
                                        </button>
                                    )

                                    }

                                    


                                    <Card key={step.id} className="node-child w-23rem flex flex-column gap-1" title={step.stepPreset.title}>



                                    <div className='flex mb-3'>
                                <span className='flex text-500'>Description:</span>
                                <span className=' flex'>
                                    {truncateDescription(step.stepPreset.description ?? '', 20)}
                                    {step.stepPreset.description && step.stepPreset.description.length > 100 && (
                                        <Button label="..." className=" ml-2 p-0 p-button-text p-button-rounded" onClick={() => {
                                            setCurrentDescription(step.stepPreset.description ?? '');
                                            setDescriptionDialogVisible(true);
                                        }} />
                                    )}
                                </span>
                            </div>
                                        <div className='grid'>
                                            <span className='col-3  text-500'>actions: </span>
                                            <div className='col '>
                                                {
                                                    step.stepPreset.actions?.map((action, index) => (
                                                        <Tag key={index} value={action} className='mx-2 '></Tag>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className='grid'>
                                            <span className='col-3 text-500 mt-1'>destinataires: </span>
                                            <div className='col'>
                                                {step.stepPreset.destinataires && step.stepPreset.destinataires.length > 0 && (
                                                    <>
                                                        <Chip className='text-xs' label={`${step.stepPreset.destinataires[0].utilisateur.nom} ${step.stepPreset.destinataires[0].utilisateur.prenom}`} icon="pi pi-user" />
                                                        {step.stepPreset.destinataires.length > 1 && (

                                                            //    <Chip icon="pi pi-users" onClick={toggleOverlayPanel} />

                                                            <Button icon="pi pi-users" className="  h-2rem w-2rem  p-button-rounded p-button-outlined p-button-secondary ml-2" onClick={toggleOverlayPanel} />


                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <OverlayPanel ref={op} dismissable>
                                            {step.stepPreset.destinataires?.slice(1).map((destinataire, index) => (
                                                <Chip key={index} className='text-xs mt-2' label={`${destinataire.utilisateur.nom} ${destinataire.utilisateur.prenom}`} icon="pi pi-user" />
                                            ))}
                                        </OverlayPanel>
                                        <div className='grid'>
                                            <span className='col-3  text-500'>Status: </span>
                                            <div className='col '>

                                                <Tag value={statusToFrench[step.status]} severity={statusToColor[step.status]} className="mx-2"></Tag>


                                            </div>
                                        </div>

                                        {/* code pour afficher le document  */}




                                        <Dialog header="Visualisation du Document" visible={documentViewDialogVisible} style={{ width: '50vw' }} onHide={closeDialog} modal>


                    
                                            {showDocumentsStep && (
                                                <div>
                                                    <DataTable value={currentDocumentsStep} paginator rows={5} className='w-full'
                                                         dataKey="id" tableStyle={{ minWidth: '50rem' }}
                                                    >
                                                        <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                                                        <Column field="planClassement.libelle" header="Plan Classement" sortable />
                                                        <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                                                        <Column header="Actions" body={(rowData) => (
                                                            <>
                                                                <Button icon="pi pi-eye" severity='help' onClick={(e) => {
                                                                        ViewDocument();
                                                                        getDocumentBase64(rowData.id)
                                                                }} className='ml-1' />

                                                            </>
                                                        )} />
                                                    </DataTable>
                                                    {viewDocument && (
                                                        <DocumentViewer
                                                            loading={loading}
                                                            error={error}
                                                            documentBase64={documentBase64}
                                                            numPages={numPages}
                                                            pageNumber={pageNumber}
                                                            onPageChange={onPageChange}
                                                            setNumPages={setNumPages}
                                                        />

                                                    )}
                                                </div>

                                            )}
                                            <Button label="Fermer" icon="pi pi-times" className="p-button-text" onClick={closeDialog} />
                                        </Dialog>

                                    </Card>

                                </div>

                            ))
                        }
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            <Button raised className='rounded mr-1 ' icon="pi pi-sitemap" severity="info" onClick={() => setVisible(true)} />

            <Dialog
                header={
                    <div className="flex justify-content-center align-items-center">
                        <i className="pi pi-sitemap text-4xl mr-2 text-primary"></i>
                        <span className="text-2xl text-primary">{workflow.title}</span>
                    </div>
                }
                visible={visible}
                dismissableMask={true}
                headerStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}  
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                style={{ minWidth: '40vw', width: "fit-content", maxWidth:"60vw" }}
                onHide={() => setVisible(false)}
            >
                <OrganizationChart value={tree} nodeTemplate={nodeTemplate} />
                {showDialogEditFile && <EditFile visible={showDialogEditFile} onClose={() => {
                    setShowDialogEditFile(false);
                }} showToast={toast} selectedItem={docSlectedFTable as DocumentDto} service={service} update={update} list={items}
                    t={t} onDocumentSave={docEdited} />}

            </Dialog>
            <Toast ref={toastRef} />
        </>
    )
}

export default StepHierarchy
