import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import { CourrielBureauOrdre } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import { WorkflowDto } from 'app/controller/model/Workflow.model';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { WorkflowPreset } from 'app/controller/model/workflow/workflowPreset';
import { WorkflowService } from 'app/controller/service/admin/WorkflowService.service';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import React, { useEffect, useState } from 'react'

type DemarerWFProps = {
    selectedCourriel: CourrielBureauOrdre;
    disabled: boolean;
    toastRef: React.Ref<Toast>;
    t: TFunction;
}
const DemarerWF = ({ t, selectedCourriel, disabled, toastRef }: DemarerWFProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [workflowPresets, setWorkflowPresets] = useState<WorkflowPreset[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowPreset>(new WorkflowPreset());
    const [stepsDto, setStepsDto] = useState<StepDTO[]>([]);
    const [item, setItem] = useState<WorkflowDto>(new WorkflowDto());
    const [loading, setLoading] = useState<boolean>(false);
    const { connectedUser } = useConnectedUserStore();

    const fetchWorkflowPresets = async () => {
        const response = await WorkflowPresetService.getAllWorkflowsPresetByEntite(selectedCourriel?.entiteInterne.libelle);
        setWorkflowPresets(response.data);
    };
    const handleWorkflowChange = (e: { value: WorkflowPreset }) => {
        setSelectedWorkflow(e.value);
    };
    const saveSteps = (workflow: WorkflowPreset): Promise<StepDTO[]> => {
        return new Promise((resolve, reject) => {
            if (!workflow.stepPresets) {
                resolve([]);
                return;
            }
    
            const steps: StepDTO[] = workflow.stepPresets.map(stepPreset => ({
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
            }));
    
            resolve(steps);
        });
    };
    const SaveWorkflow = (steps: StepDTO[]) => {
        setLoading(true);

        item.id = 0;
        item.title= selectedCourriel.sujet;
        item.description= selectedCourriel.sujet;
        item.flag = 'NORMALE';
        item.stepDTOList = steps;
        item.workflowPresetDTO = selectedWorkflow;
        item.initiateurId = connectedUser!.id;
        item.documents = selectedCourriel.documents;

        WorkflowService.createWorkflow(item)
            .then((response) => {
                MessageService.showSuccess(toastRef, "Création!", "Workflow créé avec succès");
                setVisible(false);
                setLoading(false);
            })
            .catch(error => console.log(error))
    }
    const envoyerCourriel = () => {
        saveSteps(selectedWorkflow)
        .then((stepsDto) => {
            SaveWorkflow(stepsDto);
            MessageService.showSuccess(toastRef, t('success.success'), t("success.operation"));
        })
        .catch((error) => {
            console.log(error);
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
        });
    }
  return (
    <>
        <Button
            className='mr-2'
            disabled={disabled}
            raised
            label={t("bo.envoyerWF")}
            icon="pi pi-send"
            tooltip={t('bo.tooltip.envoyerWF')}
            tooltipOptions={{ position: 'bottom', showOnDisabled: true }}
            onClick={() => {
                setVisible(true);
                fetchWorkflowPresets();
            }}
        />
        <Dialog 
            header={t("bo.envoyerUnCourriel")}
            visible={visible}
            style={{ width: '45vw' }}
            onHide={() => setVisible(false)}
            footer={
                <div>
                    <Button label={t("cancel")} severity='secondary' onClick={() => setVisible(false)} tooltip={t('bo.tooltip.annulerOperation')} tooltipOptions={{ position: 'bottom' }} />
                    <Button label={t("bo.envoyer")} icon='pi pi-send' onClick={() => envoyerCourriel()} loading={loading} />
                </div>
            }
        >
            <div className="field col-6">
                <label htmlFor="Workflow">Workflow Preset</label>
                <Dropdown
                    id="workflow-dropdown"
                    value={selectedWorkflow}
                    options={workflowPresets.map(preset => ({ label: preset.title, value: preset }))}
                    onChange={handleWorkflowChange}
                    filter
                    placeholder="Choose a workflow"
                />
            </div>
        </Dialog>
    </>
  )
}

export default DemarerWF