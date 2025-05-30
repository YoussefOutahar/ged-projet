import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';

const WorkflowDuration: React.FC = () => {
    const [workflowPresetSelected, setWorkflowPresetSelected] = useState<WorkflowPresetDTO>();
    const [workflowPresets, setWorkflowPresets] = useState<WorkflowPresetDTO[]>([]);
    const [workflowDuration, setWorkflowDuration] = useState<any[]>([]);
    const workflowKPIService = new WorkflowKPIService();

    useEffect(() => {
        WorkflowPresetService.getAllWorkflowsPreset().then(({ data }) => setWorkflowPresets(data)).catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (workflowPresetSelected) {
            workflowKPIService.workflowDuration(workflowPresetSelected?.id).then(({ data }) => setWorkflowDuration(data)).catch(error => console.log(error));
        }
    }, [workflowPresetSelected]);

    const convertDurationToMinutes = (duration: string) => {
        const parts = duration.split(' ');
        let totalJours = 0;

        for (let i = 0; i < parts.length; i += 2) {
            const value = parseInt(parts[i]);
            const unit = parts[i + 1];

            if (unit) {
                if (unit.includes('jour')) {
                    totalJours += value;
                } else if (unit.includes('heure')) {
                    totalJours += value / 24; // 1 jour = 24 heures
                } else if (unit.includes('minute')) {
                    totalJours += value / 1440; // 1 jour = 1440 minutes
                }
            }
        }

        return totalJours;
    }

    const dataWorkflowDuration = workflowDuration && workflowDuration.length > 0 ? workflowDuration.map(workflow => ({
        label: workflow.title,
        value: convertDurationToMinutes(workflow.duration),
        brute: workflow.duration
    })) : [];

    const chartDataWF = {
        labels: dataWorkflowDuration.map(item => item.label),
        datasets: [
            {
                label: 'Durée des Worflows',
                data: dataWorkflowDuration.map(item => item.value),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function (context: { dataIndex: any; dataset: { label: string; }; }) {
                        const dataIndex = context.dataIndex;
                        const dataPoint = dataWorkflowDuration[dataIndex];
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (dataPoint) {
                            label += `${dataPoint.brute}`;
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div>
            <div className="col-4">
                <Dropdown value={workflowPresetSelected}
                    options={workflowPresets}
                    onChange={(e) => setWorkflowPresetSelected(e.value)}
                    filterPlaceholder="Rechercher par workflow preset"
                    placeholder="Rechercher par workflow preset"
                    optionLabel="title" className='w-full' filter showClear />
            </div>
            <div className="col-12">
                <Chart type="bar" data={chartDataWF} options={options} />
            </div>
        </div>
    );
};

export default WorkflowDuration;