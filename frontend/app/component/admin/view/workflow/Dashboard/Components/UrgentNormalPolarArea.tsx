import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';
import { Workflow } from 'app/controller/model/workflow/workflow';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { t } from 'i18next';

interface UrgentNormalePolarAreaProps {
    isAdmin: boolean;
}

const UrgentNormalePolarArea: React.FC<UrgentNormalePolarAreaProps> = ({ isAdmin }) => {
    const [doughnutData, setDoughnutData] = useState({});
    const [doughnutOptions, setDoughnutOptions] = useState({});
    const [workflowUrgentCount, setWorkflowUrgentCount] = useState<number>(0);
    const [workflowNormaleCount, setWorkflowNormaleCount] = useState<number>(0);
    const [workflowLowPriorityCount, setWorkflowLowPriorityCount] = useState<number>(0);

    const workflowKPIService = new WorkflowKPIService();

    useEffect(() => {
        workflowKPIService.countWorkflowsByFlag(WorkflowDTO.FlagEnum.URGENT)
            .then(response => setWorkflowUrgentCount(response.data))
            .catch(error => console.log(error));

        workflowKPIService.countWorkflowsByFlag(WorkflowDTO.FlagEnum.NORMALE)
            .then(response => setWorkflowNormaleCount(response.data))
            .catch(error => console.log(error));
        
        workflowKPIService.countWorkflowsByFlag(WorkflowDTO.FlagEnum.BASSE)
            .then(response => setWorkflowLowPriorityCount(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            datasets: [
                {
                    data: [workflowUrgentCount, workflowNormaleCount, workflowLowPriorityCount],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--cyan-500')
                    ],
                    label: 'My dataset'
                }
            ],
            labels: [t("priorite.Haute"), t("priorite.Moyenne"),t("priorite.Basse")]
        };
        setDoughnutData(data);
        setDoughnutOptions({
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        });
    }, [workflowNormaleCount, workflowUrgentCount, workflowLowPriorityCount]);

    return (
        <div className="flex flex-column align-items-center card h-full gap-3">
            <h5>Nombre de Workflow par priorité </h5>
            <div className="my-auto flex justify-content-center align-items-center h-20rem">
                <Chart type="doughnut" data={doughnutData} options={doughnutOptions} className="w-full" />
            </div>
        </div>
    );
};

export default UrgentNormalePolarArea;