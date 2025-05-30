import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';
import { TabPanel, TabView } from 'primereact/tabview';

interface WorkflowData {
    workflowId: string;
    stepName: string;
    duree: string;
    evaluation: string;
}

const TopSlowSteps: React.FC = () => {
    const [workflowPresetSelected, setWorkflowPresetSelected] = useState<WorkflowPresetDTO>();
    const [workflowPresets, setWorkflowPresets] = useState<WorkflowPresetDTO[]>([]);
    const [top3Lentes, setTop3Lentes] = useState<WorkflowData[]>([]);
    const [top3Rapides, setTop3Rapides] = useState<WorkflowData[]>([]);
    const [chartDataTop3Lentes, setChartDataTop3Lentes] = useState<{ labels: string[], datasets: any[] }>({
        labels: [],
        datasets: []
    });
    const [chartDataTop3Rapides, setChartDataTop3Rapides] = useState<{ labels: string[], datasets: any[] }>({
        labels: [],
        datasets: []
    });
    const workflowKPIService = new WorkflowKPIService();

    useEffect(() => {
        WorkflowPresetService.getAllWorkflowsPreset().then(({ data }) => setWorkflowPresets(data)).catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (workflowPresetSelected) {
            workflowKPIService.top3Lentes(workflowPresetSelected?.id).then(({ data }) => setTop3Lentes(data)).catch(error => console.log(error));
            workflowKPIService.top3Rapides(workflowPresetSelected?.id).then(({ data }) => setTop3Rapides(data)).catch(error => console.log(error));
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

    useEffect(() => {
        const groupedData: { [key: string]: WorkflowData[] } = top3Lentes.reduce((acc, cur) => {
            acc[cur.workflowId] = [...(acc[cur.workflowId] || []), cur];
            return acc;
        }, {} as { [key: string]: WorkflowData[] });

        const labels = Object.keys(groupedData); // Workflow names on the x-axis
        const allStepNames = Array.from(new Set(top3Lentes.map((item) => item.stepName)));

        // Prepare datasets for the 3 steps
        const datasets = allStepNames.map((stepName, index) => {
            return {
                label: stepName,
                data: labels.map((workflowId) => {
                    const stepData = groupedData[workflowId].find((step) => step.stepName === stepName);
                    if (stepData) {
                        const duration = convertDurationToMinutes(stepData.duree);
                        return duration;
                    }
                    return 0; // Default value for missing data
                }),
                backgroundColor: `rgba(${(index * 60) % 255}, ${(index * 80 + 100) % 255}, ${(index * 200 + 50) % 255}, 0.8)`,
                originalDurations: labels.map((workflowId) => {
                    const stepData = groupedData[workflowId].find((step) => step.stepName === stepName);
                    return stepData ? stepData.duree : 'N/A';
                })
            };
        });

        setChartDataTop3Lentes({
            labels: labels,
            datasets: datasets,
        });
    }, [top3Lentes]);

    useEffect(() => {
        const groupedData: { [key: string]: WorkflowData[] } = top3Rapides.reduce((acc, cur) => {
            acc[cur.workflowId] = [...(acc[cur.workflowId] || []), cur];
            return acc;
        }, {} as { [key: string]: WorkflowData[] });

        const labels = Object.keys(groupedData); // Workflow names on the x-axis
        const allStepNames = Array.from(new Set(top3Rapides.map((item) => item.stepName)));

        // Prepare datasets for the 3 steps
        const datasets = allStepNames.map((stepName, index) => {
            return {
                label: stepName,
                data: labels.map((workflowId) => {
                    const stepData = groupedData[workflowId].find((step) => step.stepName === stepName);
                    if (stepData) {
                        const duration = convertDurationToMinutes(stepData.duree);
                        return duration;
                    }
                    return 0; // Default value for missing data
                }),
                backgroundColor: `rgba(${(index * 60) % 255}, ${(index * 80 + 100) % 255}, ${(index * 200 + 50) % 255}, 0.8)`,
                originalDurations: labels.map((workflowId) => {
                    const stepData = groupedData[workflowId].find((step) => step.stepName === stepName);
                    return stepData ? stepData.duree : 'N/A';
                })
            };
        });

        setChartDataTop3Rapides({
            labels: labels,
            datasets: datasets,
        });
    }, [top3Rapides]);

    const optionsTop3 = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        const dataset = chartDataTop3Lentes.datasets[tooltipItem.datasetIndex];
                        const originalDuration = dataset.originalDurations[tooltipItem.dataIndex];
                        return `${dataset.label}: ${originalDuration}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Workflows',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Duration (days)',
                },
            },
        },
    };
    const optionsTop3R = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        const dataset = chartDataTop3Rapides.datasets[tooltipItem.datasetIndex];
                        const originalDuration = dataset.originalDurations[tooltipItem.dataIndex];
                        return `${dataset.label}: ${originalDuration}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Workflows',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Duration (days)',
                },
            },
        },
    };

    return (
        <div>
            <div className="col-6">
                <Dropdown value={workflowPresetSelected}
                    options={workflowPresets}
                    onChange={(e) => setWorkflowPresetSelected(e.value)}
                    filterPlaceholder="Rechercher par Workflow preset"
                    placeholder="Rechercher par Workflow preset"
                    optionLabel="title" className='w-full' filter showClear />
            </div>
            <TabView>
                <TabPanel header="Étapes les Plus Lentes">
                    <h3>Top 3 des Étapes les Plus Lentes par Workflow (en jours)</h3>
                    <Chart type="bar" data={chartDataTop3Lentes} options={optionsTop3} />
                </TabPanel>
                <TabPanel header="Étapes les Plus Rapides">
                    <h3>Top 3 des Étapes les Plus Rapides par workflow (en jours)</h3>
                    <Chart type="bar" data={chartDataTop3Rapides} options={optionsTop3R} />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default TopSlowSteps;