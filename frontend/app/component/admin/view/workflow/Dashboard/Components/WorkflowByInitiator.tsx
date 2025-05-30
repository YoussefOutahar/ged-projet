import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { WorkflowService } from 'app/controller/service/admin/WorkflowService.service';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { t } from 'i18next';
import StepHierarchy from '../../StepHierarchy';
import { workflowService } from 'app/controller/service/workflow/workflowService';
import WorkflowView from '../../WorkflowView';
import { WorkflowDto } from 'app/controller/model/Workflow.model';
import InsightsComponent from './InsightsComponent';

interface WorkflowByInitiatorProps {
    isAdmin: boolean;
    toast: React.RefObject<Toast>;
}

const WorkflowByInitiator: React.FC<WorkflowByInitiatorProps> = ({ isAdmin, toast }) => {
    const [utilisateur, setUtilisateur] = useState<UtilisateurDto>({} as UtilisateurDto);
    const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedWorkflowType, setSelectedWorkflowType] = useState<WorkflowDTO.StatusEnum>(WorkflowDTO.StatusEnum.OPEN);
    const [workflowAs, setWorkflowAs] = useState<WorkflowDTO[]>([]);
    const rows = 5;
    const [openPage, setOpenPage] = useState(0);
    const [closedPage, setClosedPage] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedItem, setSelectedItem] = useState<WorkflowDTO>();
    const [showViewDialog, setShowViewDialog] = useState<boolean>(false);

    const workflowKPIService = new WorkflowKPIService();
    const utilisateurAdminService = new UtilisateurAdminService();

    useEffect(() => {
        utilisateurAdminService.getList().then(({ data }) => setUtilisateurs(data)).catch(error => console.log(error));
    }, []);

    const onDropdownChange = (e: DropdownChangeEvent, field: string) => {
        if (field === 'utilisateur' && e.value) {
            setUtilisateur(e.value);
            const fetchWorkflows = async (status: WorkflowDTO.StatusEnum) => {
                try {
                    const response = await workflowService.getWorkflowByInitiatuerIdByStatus(e.value.id, status);
                    setWorkflowAs(response.data);
                } catch (error) {
                    console.error('Erreur lors du chargement des Workflows : ', error);
                }
            };

            fetchWorkflows(selectedWorkflowType);
        }
    };

    const handlePageNumberChange = (e: DropdownChangeEvent) => {
        setSelectedWorkflowType(e.value);
        if (utilisateur.id) {
            const fetchWorkflows = async (status: WorkflowDTO.StatusEnum) => {
                try {
                    const response = await workflowService.getWorkflowByInitiatuerIdByStatus(utilisateur.id, status);
                    setWorkflowAs(response.data);
                } catch (error) {
                    console.error('Erreur lors du chargement des Workflows : ', error);
                }
            };

            fetchWorkflows(e.value);
        }
    };

    const showFullDescription = (rowData: any) => {
        setSelectedDescription(rowData.description);
        setDialogVisible(true);
    };

    const descriptionBodyTemplate = (rowData: any) => {
        return (
            <>
                {rowData.description.length > 20 ? (
                    <div>
                        {rowData.description.substring(0, 20)}
                        <Button label="..." className="p-0 ml-0 p-button-text p-button-sm -mt-4" onClick={() => showFullDescription(rowData)} />
                    </div>
                ) : (
                    rowData.description
                )}
            </>
        );
    };

    const StatusCell = (rowData: WorkflowDTO) => {
        let statusLabel
        switch (rowData.status) {
            case 'OPEN':
                statusLabel = t("workflow.Open");
                break;
            case 'CLOSED':
                statusLabel = t("workflow.Closed");
                break;
            case 'REJECTED':
                statusLabel = t("workflow.Rejeted");
                break;
            case 'Annulled':
                statusLabel = t("Annuler");
                break;
            default:
                statusLabel = 'Inconnu';
        }
        let tagSeverity: "success" | "danger" | "warning" | "info" | null | undefined = null;
        switch (rowData.status) {
            case 'OPEN':
                tagSeverity = 'info';
                break;
            case 'CLOSED':
                tagSeverity = 'success';
                break;
            case 'REJECTED':
                tagSeverity = 'danger';
                break;
            case 'Annulled':
                tagSeverity = 'warning';
                break;
            default:
                tagSeverity = 'info';
        }

        return (
            <div style={{ marginBlock: "0rem" }}>
                <Tag value={statusLabel} severity={tagSeverity} />
            </div>
        );
    };

    const FlagCell = (rowData: WorkflowDTO) => {
        const flag = rowData?.flag;
        return (
            <div style={{ marginBlock: "0rem" }}>
                {flag === WorkflowDTO.FlagEnum.NORMALE ? (
                    <Tag value={WorkflowDTO.getWorkflowFlagLabel(flag)} />
                ) : flag === WorkflowDTO.FlagEnum.URGENT ? (
                    <Tag value={WorkflowDTO.getWorkflowFlagLabel(flag)} className='bg-red-600' />
                ) : (
                    <Tag value={WorkflowDTO.getWorkflowFlagLabel(flag)} className='surface-600' />
                )}
            </div>
        );
    };

    const showViewModal = (item: WorkflowDTO) => {
        setSelectedItem(item);
        setShowViewDialog(true);
    };

    const annulerWorkflow = (item: number) => {
        WorkflowService.annulerWorkflow(item)
            .then(response => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Workflow annulé avec succès', life: 3000 });
            })
            .catch(error => {
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de lannulation du Workflow', life: 3000 });
            });
    };

    const actionTemplate = (rowData: WorkflowDTO) => {
        return (
            <React.Fragment>
                <StepHierarchy workflow={rowData}></StepHierarchy>
                <Button raised icon="pi pi-eye" severity="help" className="mr-1"
                    onClick={() => showViewModal(rowData)} />

                {selectedWorkflowType === WorkflowDTO.StatusEnum.OPEN && (
                    <Button raised icon="pi pi-times-circle" severity="danger" className="mr-1"
                        onClick={
                            (e) => {
                                confirmPopup({
                                    target: e.currentTarget,
                                    message: "Vous voulez vraiment annulée ce worflow ?",
                                    icon: "pi pi-exclamation-triangle",
                                    accept: () => annulerWorkflow(rowData.id || 0)
                                });
                            }
                        }
                    />
                )}
                <ConfirmPopup />
            </React.Fragment>
        );
    };

    const workflowTable = (workflows: WorkflowDTO[], title: string, onPageChange: (e: any) => void, page: number) => (
        <div>
            <div className="card">
                <h2 className='text-2xl text-indigo-800'>{title}</h2>
                <Toolbar
                    start={<h5 className="m-0">{t("workflow.header", { totalRecords: workflowAs.length })}</h5>}
                    center={<span className="block mt-2 md:mt-0 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                            placeholder={t("search")} /> </span>}
                    end={<Dropdown
                        value={selectedWorkflowType}
                        options={[
                            { label: t('workflow.OpenWorkflows'), value: WorkflowDTO.StatusEnum.OPEN },
                            { label: t('workflow.ClosedWorkflows'), value: WorkflowDTO.StatusEnum.CLOSED },
                            { label: t('workflow.RejectedWorkflows'), value: WorkflowDTO.StatusEnum.REJECTED },
                            { label: t('Workflow annuler '), value: WorkflowDTO.StatusEnum.Annulled },
                        ]}
                        onChange={(e) => handlePageNumberChange(e)}
                        placeholder={t('Select Workflow Type')}
                    />}
                    className='p-1 mt-0 mb-5' />
                <DataTable
                    value={workflows}
                    paginator
                    rows={rows}
                    emptyMessage={<div className="flex justify-content-center">Aucun Workflow trouvé</div>}
                    globalFilter={globalFilter}
                    onPage={onPageChange}
                    totalRecords={workflows.length}
                    first={page * rows}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="{totalRecords} workflows total, {first} to {last}">
                    <Column field="title" header={t("workflow.titre")} />
                    <Column field="dateC" header={t("workflow.DateCreation")} body={(rowData: any) => (
                        <span>{rowData.dateC ? new Date(rowData.dateC).toLocaleDateString() : ""}</span>
                    )} />
                    <Column field="status" header={t("workflow.status")} body={StatusCell} />
                    <Column field="description" header={t("workflow.Description")} body={descriptionBodyTemplate} />
                    <Column field="flag" header={t("workflow.flag")} body={FlagCell} />
                    <Column field="workflowPresetDTO.title" header={t("appBar.workflowPreset")} />
                    <Column body={actionTemplate} />
                </DataTable>
                <Dialog className='w-6' visible={dialogVisible} onHide={() => setDialogVisible(false)} header={t("workflow.Description")} modal>
                    <p>{selectedDescription}</p>
                </Dialog>

                {showViewDialog && <WorkflowView visible={showViewDialog} onClose={() => {
                    setShowViewDialog(false);
                    setSelectedItem(undefined);
                }} selectedItem={selectedItem as WorkflowDto} t={t} showToast={toast} />}
            </div>
        </div>
    );

    return (
        <div className={`${isAdmin ? 'grid' : 'card w-full'}`}>
            {isAdmin && (
                <>
                    <Dropdown
                        className="w-full mb-5"
                        showClear
                        id="utilisateurDropdown"
                        value={utilisateur}
                        options={utilisateurs}
                        onChange={(e) => onDropdownChange(e, 'utilisateur')}
                        placeholder={t("document.utilisateurPlaceHolder")}
                        filter
                        filterPlaceholder={t("document.utilisateurPlaceHolderFilter")}
                        optionLabel="nom"
                        disabled={!isAdmin}
                    />
                    {utilisateur.id && <InsightsComponent isAdmin={isAdmin} userId={utilisateur.id} />}
                </>
            )}
            <div className="col-12">
                {selectedWorkflowType === WorkflowDTO.StatusEnum.OPEN && workflowTable(workflowAs, t('workflow.OpenWorkflows'), (e) => setOpenPage(e.page), openPage)}
                {selectedWorkflowType === WorkflowDTO.StatusEnum.CLOSED && workflowTable(workflowAs, t('workflow.ClosedWorkflows'), (e) => setClosedPage(e.page), closedPage)}
                {selectedWorkflowType === WorkflowDTO.StatusEnum.REJECTED && workflowTable(workflowAs, t('workflow.RejectedWorkflows'), (e) => setClosedPage(e.page), closedPage)}
                {selectedWorkflowType === WorkflowDTO.StatusEnum.Annulled && workflowTable(workflowAs, t('workflow annuler '), (e) => setClosedPage(e.page), closedPage)}
            </div>
        </div>
    );
};

export default WorkflowByInitiator;