import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { parapheurService } from 'app/controller/service/parapheur/parapheurService.service';

type ParapheurKpiSpecProps = {
  title: string;
};

type ParapheurKPI = {
  title: string;
  status: string;
  nombreDocumentTotal: number;
  nombreDocumentSigne: number;
  nombreDocumentNonSigne: number;
  nombreCommentaire: number;
  nombreUserAssocie: number;
};

const ParapheurKpiSpec: React.FC<ParapheurKpiSpecProps> = ({ title }) => {
  const [parapheursKpi, setParapheursKpi] = useState<ParapheurKPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parapheurService
      .getAllKPIParapheurByTitle(title)
      .then((res) => {
        setParapheursKpi(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [title]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'status-pending';
      case 'termine':
        return 'status-completed';
      default:
        return 'status-undefined';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'termine':
        return 'Terminé';
      default:
        return 'Non défini';
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .parapheur-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
          }
          .parapheur-card {
            overflow: hidden;
          }
          .parapheur-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
          .parapheur-header h2 {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0;
          }
          .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            color: white;
          }
          .status-pending {
            background-color: #EAB308;
          }
          .status-completed {
            background-color: #22C55E;
          }
          .status-undefined {
            background-color: #EF4444;
          }
          .parapheur-chart {
            margin-bottom: 1rem;
            height: 100px;
          }
          .parapheur-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .stat-item {
            display: flex;
            align-items: center;
            font-size: 0.875rem;
          }
          .stat-item i {
            margin-right: 0.5rem;
          }
          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
          }
        `}
      </style>
      <div className="parapheur-grid">
        {parapheursKpi && parapheursKpi.length > 0 && parapheursKpi.map((item, index) => {
          const {
            title,
            status,
            nombreDocumentSigne,
            nombreDocumentNonSigne,
            nombreCommentaire,
            nombreUserAssocie,
          } = item;

          const chartData = {
            labels: ['Documents'],
            datasets: [
              {
                label: 'Signés',
                backgroundColor: '#22C55E',
                data: [nombreDocumentSigne]
              },
              {
                label: 'Non signés',
                backgroundColor: '#EF4444',
                data: [nombreDocumentNonSigne]
              }
            ]
          };

          const chartOptions = {
            indexAxis: 'y' as const,
            plugins: {
              legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                  boxWidth: 10,
                  font: {
                    size: 10
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.x !== null) {
                      label += context.parsed.x;
                    }
                    return label;
                  }
                }
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                ticks: {
                  stepSize: 1
                }
              },
              y: {
                stacked: true
              }
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            },
          };

          return (
            <Card key={index} className="parapheur-card">
              <div className="parapheur-header">
                <h2>{title}</h2>
                <span className={`status-badge ${getStatusClass(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
              <div className="parapheur-chart">
                <Chart type="bar" data={chartData} options={chartOptions} />
              </div>
              <div className="parapheur-stats mt-8">
                <div className="stat-item">
                  <i className="pi pi-check-circle"></i>
                  <span>Signés: {nombreDocumentSigne}</span>
                </div>
                <div className="stat-item">
                  <i className="pi pi-times-circle"></i>
                  <span>Non signés: {nombreDocumentNonSigne}</span>
                </div>
                <div className="stat-item">
                  <i className="pi pi-comments"></i>
                  <span>Commentaires: {nombreCommentaire}</span>
                </div>
                <div className="stat-item">
                  <i className="pi pi-users"></i>
                  <span>Utilisateurs: {nombreUserAssocie}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default ParapheurKpiSpec;