import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';

interface CommissionKpi {
    title: string;
    nombreTotal: number;
    nombreCertifValide: number;
    nombreCertifRejete: number;
    nombreCertifSigne: number;
    reste: number;
}

const CertificationsPerWorkflow: React.FC = () => {
    const workflowKPIService = new WorkflowKPIService();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await workflowKPIService.getWorkflowKPIDto();
                const data: CommissionKpi[] = res.data;
                processChartData(data);
            } catch (err) {
                console.error("Error fetching workflow KPI data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const processChartData = (data: CommissionKpi[]) => {
        const labels = data.map(item => item.title);
        const datasets = [
            {
                type: 'bar',
                label: 'Signés',
                backgroundColor: '#FFD54F', // Light Amber
                data: data.map(item => item.nombreCertifSigne)
            },
            {
                type: 'bar',
                label: 'Validés',
                backgroundColor: '#81C784', // Light Green
                data: data.map(item => item.nombreCertifValide)
            },
            {
                type: 'bar',
                label: 'Rejetés',
                backgroundColor: '#E57373', // Light Red
                data: data.map(item => item.nombreCertifRejete)
            },
            {
                type: 'bar',
                label: 'Non chargés',
                backgroundColor: '#cfd0d1', // Light Blue
                data: data.map(item => item.reste)
            },
        ];

        setChartData({ labels, datasets });

        const options = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    // text: 'État des certificats par commission'
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Nombre de certificats'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Workflows'
                    }
                }
            }
        };

        setChartOptions(options);
    };

    return (
        <div className="card flex flex-column  h-full">
            <h5 className='mx-auto'>État des certificats par workflow</h5>
            <div className="flex-grow-1 flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                {isLoading ? (
                    <ProgressSpinner />
                ) : (
                    <Chart type="bar" data={chartData} options={chartOptions} className="w-full h-full" />
                )}
            </div>
        </div>
    );
}

export default CertificationsPerWorkflow;