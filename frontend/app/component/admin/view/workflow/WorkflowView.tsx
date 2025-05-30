import useViewHook from 'app/component/zyhook/useViewhook'
import { WorkflowDto } from 'app/controller/model/Workflow.model'
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO'
import { TFunction } from 'i18next'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Fieldset } from 'primereact/fieldset'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { TabPanel, TabView } from 'primereact/tabview'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import React, { useEffect, useState } from 'react'
import { pdfjs } from "react-pdf";
import { DocumentDto } from 'app/controller/model/Document.model'
import { Workflow } from 'app/controller/model/workflow/workflow'
import FileChip from '../bureau-ordre/BO_courriels/Intervention/FileChip'
import FileViewer from '../doc/document/preview/FileViewer'
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

type WorkFlowViewType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: WorkflowDto,
    t: TFunction,
    showToast: React.Ref<Toast>
}

const WorkflowView: React.FC<WorkFlowViewType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        activeIndex
    } = useViewHook<WorkflowDto>({ selectedItem, onClose, t })

    const [viewDocument, setViewDocument] = useState(false);
    const [viewDocumentStep, setViewDocumentStep] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true); // Commence avec true pour être initialement fermé
    const [documents, setDocuments] = useState<DocumentDto[]>([]);

    const [documentToView, setDocumentToView] = useState<number>();


    
  
    const getAlldocument = () => {
        selectedItem.stepDTOList?.map((step) => {
            step.documentsActions?.map((document) => {
                documents.push(document)
            })
        })
    }
    useEffect(() => {
        getAlldocument()
    }, [selectedItem])


    return (
        <div>
            <Dialog visible={visible} closeOnEscape style={{ width: '70vw' }} header={"Workflow"} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
                <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                    <TabPanel header={t("document.informations")}>
                        <div className="formgrid grid">
                            <div className="field col-4">
                                <label htmlFor="reference">Title</label>
                                <InputText id="reference" value={selectedItem.title || ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">Status</label>
                                <InputText id="reference" value={selectedItem.status || ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">{t("workflow.flag")}</label>
                                <InputText id="reference" value={WorkflowDTO.getWorkflowFlagLabel(selectedItem.flag) || ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">Date de Création</label>
                                <InputText id="reference" value={selectedItem.dateC ? new Date(selectedItem.dateC).toLocaleDateString() : ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">Workflow Preset</label>
                                <InputText id="reference" value={selectedItem.workflowPresetDTO?.title || ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">Initiateur</label>
                                <InputText id="reference" value={selectedItem.initiateurNom || ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">Departement</label>
                                <InputText id="reference" value={selectedItem.workflowPresetDTO?.departement || ""} disabled />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="reference">Steps</label>
                                <InputText id="reference" value={(selectedItem.stepDTOList?.length || 0).toString()} disabled />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="description">{t("document.description")}</label>
                                <span className="p-float-label">
                                    <InputTextarea id="description" value={selectedItem?.description || ""} disabled rows={5} cols={30} />
                                </span>
                            </div>
                        </div>
                    </TabPanel>
                    {/* ajouter datatable with button view afficher document */}
                    {selectedItem.documents?.length !== 0 && (
                        <TabPanel header={"Voir les documents"}>
                            <DataTable value={selectedItem.documents} paginator rows={5} className='w-full'>
                                <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                                <Column field="planClassement.libelle" header="Plan Classement" sortable />
                                <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                                <Column header="Actions" body={(rowData) => (
                                    <>
                                        <Button icon="pi pi-eye" severity='help' onClick={() => {
                                            setViewDocument(true);
                                            setDocumentToView(rowData.id)
                                        }} className='ml-1' />
                                    </>
                                )} />
                            </DataTable>
                            {viewDocument && (
                                <div className='mx-auto w-fit'>

                                <FileViewer documentId={documentToView} />
                                </div>
                            )}
                        </TabPanel>
                    )}
                    <TabPanel header={"Steps"}>
                        {selectedItem.stepDTOList?.map((step) => (
                            <Fieldset
                                legend={
                                    <>
                                        {step.stepPreset.title} <Tag value={`Level: ${step.stepPreset.level}`} className="ml-2" />
                                    </>
                                }
                                style={{ marginBottom: "1rem" }}
                                toggleable
                                collapsed={true} // Utilise l'état pour définir si le Fieldset est ouvert ou fermé
                                // onToggle={(e) => setIsCollapsed(e.value)}
                            >
                                <div className="formgrid grid">
                                    <div className="field col-6 flex ">
                                        <label htmlFor="title" className='font-bold col-4'>{t("workflow.titre")}</label>
                                        <span className='col-1 font-bold' >:</span>
                                        <p id="reference" className="text-base col-7">{step.stepPreset.title}</p>
                                    </div>
                                    <div className="field col-6">

                                        <label htmlFor="actions" className='font-bold col-2 '>{t("workflow.Action")}</label>
                                        <span className='col-1 font-bold' >:</span>
                                        <div className='col-9 inline  '>
                                            {step.stepPreset.actions?.length === 0
                                                ?
                                                <Tag className="" icon="pi pi-info-circle" severity="warning" value="No actions"></Tag>
                                                :
                                                step.stepPreset.actions?.map((action, index) => (
                                                    <Tag key={index} className='mt-0 mx-2 bg-green-500 ' >
                                                        <div className="flex align-items-center font-sm gap-2 p-0  ">
                                                            <span className='text-sm '>{action}</span>
                                                        </div>
                                                    </Tag>

                                                ))

                                            }
                                            <Tag className='mt-0 mx-2 bg-red-600 ' >
                                                <div className="flex align-items-center font-sm gap-2 p-0  ">
                                                    <span className='text-sm '>REJECT</span>
                                                </div>
                                            </Tag>
                                        </div>
                                        
                                    </div>
                                    <div className="field col-12 mt-3">
                                        <label htmlFor="description" className='font-bold col-2'>Description</label>
                                        <span className='col-2 font-bold' >:</span>
                                        <div className='col-8 ml-2 inline-flex  '>
                                            <InputTextarea className=' ' id="description" value={step.stepPreset.description} rows={4} />
                                        </div>    
                                    </div>

                                    <div className="flex field col-12 mt-3 align-items-center ">
                                        <label htmlFor="destinataires" className='font-bold col-2 '>Destinataires</label>
                                        <span className='ml-2 mr-3 font-bold' >:</span>
                                        <div className="col-9 inline-flex flex-wrap gap-2 ">
                                            {
                                                step.stepPreset.destinataires?.length === 0
                                                    ?
                                                    <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
                                                    :
                                                    step.stepPreset.destinataires?.map((destinataire, index) => (
                                                        <div key={index} className="flex flex-row surface-300 border-round-3xl p-0 pr-3 align-items-center  gap-2  ">
                                                            <img className='' alt="" src="/user-avatar.png" width="36" />
                                                            <div className='flex flex-column justify-content-around '>
                                                                <span className='text-sm font-bold text-800'>{destinataire.utilisateur?.nom} {destinataire.utilisateur?.prenom}</span>
                                                                {/* <span className='text-sm'>{destinataire.utilisateur?.email}</span> */}
                                                                <span className='text-sm'>{destinataire.utilisateur?.entiteAdministrative?.libelle}</span>
                                                            </div>
                                                        </div>
                                                    ))

                                            }
                                        </div>
                                        {/* <DataTable value={step.stepPreset.destinataires} tableStyle={{ minWidth: '50rem' }} dataKey="id"
                                            paginator rows={5}>
                                            <Column field="utilisateur.nom" header={t("document.utilisateur")} body={(rowData) => {
                                                if (rowData?.utilisateur?.nom) {
                                                    return (
                                                        <div className="flex align-items-center gap-2">
                                                            <img alt="" src="/user-avatar.png" width="32" />
                                                            <span className='font-bold'>{rowData.utilisateur.nom} {rowData.utilisateur.prenom}</span>
                                                        </div>
                                                    )
                                                }
                                            }}></Column>
                                            <Column field="utilisateur.entiteAdministrative.libelle" header="Departement"></Column>
                                            <Column field="poids" header="Poids"></Column>
                                        </DataTable> */}
                                    </div>

                                    <div className="field col-12 mt-3">
                                        <label htmlFor="document" className='font-bold col-2'>Document</label>
                                        <span className='col-1 mr-3 font-bold' >:</span>
                                        <div className="col-9 inline-flex flex-wrap gap-2 ">
                                            {
                                                step.documents?.length === 0
                                                    ?
                                                    <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="aucun"></Tag>
                                                    :
                                                    step.documents?.map((document, index) => (
                                                        <FileChip key={index} document={document} />
                                                    ))
                                            }
                                        </div>
                                    </div>
                                    {/* <DataTable value={step.documents} paginator rows={5} className='w-full'>
                                        <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                                        <Column field="planClassement.libelle" header="Plan Classement" sortable />
                                        <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                                        <Column header="Actions" body={(rowData) => (
                                            <Button icon="pi pi-eye" severity='help' onClick={(e) => { handleviewDocumentStep(); setDocumentToView(rowData.id) }} className='ml-1' />
                                        )} />
                                    </DataTable>
                                    {viewDocumentStep && (
                                        <FileViewer documentId={documentToView} />
                                    )} */}
                                </div>
                            </Fieldset>
                        ))}
                    </TabPanel>
                    {selectedItem.status === Workflow.StatusEnum.CLOSED && (
                    <TabPanel header={"Voir les documents"} >

                        <DataTable value={documents} paginator rows={5} className='w-full'>
                            <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                            <Column field="planClassement.libelle" header="Plan Classement" sortable />
                            <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                            <Column header="Actions" body={(rowData) => (
                                <>
                                    <Button icon="pi pi-eye" severity='help' onClick={() => {
                                        setViewDocument(true);
                                        setDocumentToView(rowData.id)
                                    }} className='ml-1' />
                                </>
                            )} />
                        </DataTable>                        
                        {viewDocument && (
                            <div className='mx-auto w-fit'>
                                <FileViewer documentId={documentToView} />
                            </div>
                            )}

                    </TabPanel>
                    )}
                </TabView>
            </Dialog>
        </div>
    )
}

export default WorkflowView