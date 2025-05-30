import React from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ChartData, ChartOptions } from 'chart.js';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';
import { InputText } from 'primereact/inputtext';
import { t } from 'i18next';
import { ProgressSpinner } from 'primereact/progressspinner';

type WorkflowStatus = 'OPEN' | 'CLOSED' | 'REOPENED';

interface EvaluateurCertifCount {
    evaluateur: string;
    nombreCertif: number;
}

interface CommissionKpi {
    title: string;
    status: WorkflowStatus;
    nombreTotal: number;
    nombreEvaluateur: number;
    nombreCertifParEvaluateur: EvaluateurCertifCount[];
    nombreCertifValide: number;
    nombreCertifRejete: number;
    nombreCertifSigne: number;
    reste: number;
}


const WorkflowKpiCharts: React.FC = () => {


    const workflowKPIService = new WorkflowKPIService();

    const [data, setData] = React.useState<CommissionKpi[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const fetchData = async () => {
        setLoading(true);
        const data = await workflowKPIService.getWorkflowKPIDto().then((res) => res.data);
        setData(data);
        setLoading(false);
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchDataByTitle = async (title: string) => {
        setLoading(true);
        const data = await workflowKPIService.getWorflowKPIDtoByWorkflowTitle(title).then((res) => res.data);
        setData(data);
        setLoading(false);
    }

    const getStatusSeverity = (status: WorkflowStatus): 'success' | 'danger' | 'warning' | 'info' => {
        switch (status) {
            case 'OPEN':
                return 'success';
            case 'CLOSED':
                return 'danger';
            case 'REOPENED':
                return 'warning';
            default:
                return 'info';
        }
    };

    const createChartData = (commission: CommissionKpi): ChartData => {
        return {
            labels: ['Validé', 'Rejeté', 'Signé', 'Non chargé'],
            datasets: [
                {
                    label: 'Nombre de certificats',
                    data: [
                        commission.nombreCertifValide,
                        commission.nombreCertifRejete,
                        commission.nombreCertifSigne,
                        commission.reste
                    ],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 206, 86, 0.8)'
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 206, 86)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    };

    const createUploadProgressChartData = (commission: CommissionKpi): ChartData => {
        const evaluateurData = commission.nombreCertifParEvaluateur.map(e => ({
            label: e.evaluateur,
            value: e.nombreCertif
        }));

        // Sort evaluateurs by their contribution, descending
        evaluateurData.sort((a, b) => b.value - a.value);

        const labels = evaluateurData.map(e => e.label);
        labels.push('Non chargées');  // Add 'Restants' as the last label

        const data = evaluateurData.map(e => e.value);
        data.push(commission.reste);  // Add 'reste' as the last data point

        // Use a better color palette
        const colorPalette = [
            'rgba(54, 162, 235, 0.8)',   // blue
            'rgba(75, 192, 192, 0.8)',   // green
            'rgba(153, 102, 255, 0.8)',  // purple
            'rgba(255, 159, 64, 0.8)',   // orange
            'rgba(255, 99, 132, 0.8)',   // red
        ];

        // Ensure we have enough colors
        while (colorPalette.length < labels.length) {
            colorPalette.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`);
        }

        // Use yellow for 'Restants'
        colorPalette[labels.length - 1] = 'rgba(255, 206, 86, 0.8)';

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colorPalette,
                    borderColor: colorPalette.map(color => color.replace('0.8', '1')),
                    borderWidth: 1
                }
            ]
        };
    };

    const chartOptions: ChartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    const donutChartOptions: ChartOptions = {
        responsive: true,
        // cutout: '50%',
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw as number;
                        const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="relative card flex flex-column gap-3">
            {
                loading &&
                <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
                    <ProgressSpinner />
                </div>
            }
            <h4 className="text-xl font-semibold">KPI des Workflow</h4>
            <div>
                <span className="block ml-2 mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search " />
                    <InputText
                        type="search"
                        onChange={(e: any) => e.target.value == '' && fetchData()}
                        onKeyDown={(e: any) => e.key === 'Enter' && fetchDataByTitle(e.target.value)}
                        placeholder={t("globalSearch")}
                    />
                </span>
            </div>
            <div className="p-1 pb-4 flex flex-row gap-5 overflow-x-auto" >
            {Array.isArray(data) && data.length > 0 ? (
                data.map((commission, index) => (
                    <Card key={index} className="relative w-fit">
                        <Tag className='absolute top-0 right-0' value={commission.status} severity={getStatusSeverity(commission.status)} />
                        <div className="">
                            <h3 className="text-xl font-bold">{commission.title}</h3>
                        </div>

                        <div className={`flex  ${data.length > 2 ? "flex-column" : "flex-row"} align-items-center `}>
                            {/* -------------- Donut Chart -------------- */}
                            <div className='relative'>
                                <h4 className="text-lg font-semibold mt-4 mb-2">Progrès des uploads par évaluateur</h4>
                                <Chart type="doughnut" data={createUploadProgressChartData(commission)} options={donutChartOptions} />
                                <div
                                    className='absolute flex flex-column align-items-center justify-content-around'
                                    style={{ top: "40%", left: "40%", width: "20%", height: "20%" }}
                                >
                                    <span className='text-lg'>Total </span>
                                    <span className='text-lg'>CE: {commission.nombreTotal} </span>
                                    <span className='text-lg'>EV: {commission.nombreEvaluateur} </span>
                                </div>
                            </div>

                            {/* -------------- Bar Chart -------------- */}
                            <div className=' ' style={{ height: "max-content" }} >
                                <h4 className="text-lg font-semibold mt-4 mb-2">Statut des certificats</h4>
                                <div className="my-auto">
                                    <Chart type="bar" className='my-auto' data={createChartData(commission)} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
            <p>No data available</p> 
          )}
          </div>
        </div>
    );
};

export default WorkflowKpiCharts;