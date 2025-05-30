import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { workflowService } from 'app/controller/service/workflow/workflowService';

const WorkflowsByDepartmentPolarArea: React.FC = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const response = await workflowService.getAllWorkflows();
                const workflowsData = response.data;
                const uniqueDepartments = Array.from(new Set(workflowsData.map(workflow => workflow.workflowPresetDTO.departement).filter(dep => dep)));

                const countByDepartment = workflowsData.reduce((acc: any, workflow: any) => {
                    const department = workflow.workflowPresetDTO.departement || 'Unknown';
                    acc[department] = (acc[department] || 0) + 1;
                    return acc;
                }, {});

                const data = {
                    labels: uniqueDepartments,
                    datasets: [{
                        label: 'Number of Workflows',
                        data: uniqueDepartments.map(dept => countByDepartment[dept as string] || 0),
                        backgroundColor: uniqueDepartments.map((_, index) => `hsl(${index * 360 / uniqueDepartments.length}, 70%, 70%)`),
                        hoverOffset: 4
                    }]
                };

                setChartData(data);
                setChartOptions({
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                });
            } catch (error) {
                console.error('Error loading Workflows:', error);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <div className="card h-full">
            <h5>Workflow par departement</h5>
            <div className="flex justify-content-center align-items-center h-20rem">
                <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full" />
            </div>
        </div>
    );
};

export default WorkflowsByDepartmentPolarArea;