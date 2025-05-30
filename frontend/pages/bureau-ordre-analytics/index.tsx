import axiosInstance from "app/axiosInterceptor";
import { ChartData, ChartOptions } from "chart.js";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OrganizationChart } from "primereact/organizationchart";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import React from "react";

const ViewCourrielBO = React.lazy(() => import('app/component/admin/view/bureau-ordre/BO_courriels/ViewCourrielBO'));
import { CourrielHistory } from "app/controller/model/BureauOrdre/CourrielHistory";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import { CourrielBureauOrdre, PrioriteCourriel, PrioriteCourrielOptions } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SeverityType = 'success' | 'info' | 'warn' | 'error';

interface Node {
    key: string;
    label: string;
    children?: Node[];
    expanded: boolean;
    style?: object;
    className?: string;
}

const index = () => {

    const toast = useRef<Toast>(null);
    const showToast = (severity: SeverityType, summary: string) => {
        if (toast.current) {
            toast.current.show({ severity, summary, life: 4000 });
        }
    };

    const [courrielsCount, setCourrielsCount] = useState<number>(0);
    const [courrielClotureCount, setCourrielClotureCount] = useState<number>(0);
    const [courrielNonClotureCount, setCourrielNonClotureCount] = useState<number>(0);
    const [courrielEnAttentCount, setCourrielEnAttentCount] = useState<number>(0);
    const [courrielBlockedCount, setCourrielBlockedCount] = useState<number>(0);
    const [courrielEnCoursCount, setCourrielEnCoursCount] = useState<number>(0);
    const insights = () => {
        return (<>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Courriels</span>
                            <div className="text-900 font-medium text-xl">{courrielsCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Cloture</span>
                            <div className="text-900 font-medium text-xl">{courrielClotureCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-check-circle text-green-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Bloque</span>
                            <div className="text-900 font-medium text-xl">{courrielBlockedCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-times-circle text-orange-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">En Cours</span>
                            <div className="text-900 font-medium text-xl">{courrielEnCoursCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-clock text-purple-500 text-xl"></i>
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span> */}
                </div>
            </div>
        </>);
    };
    useEffect(() => {
        axiosInstance.get(`${API_URL}/courriels/kpi/count/deleted/false`)
            .then(response => {
                setCourrielsCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axiosInstance.get(`${API_URL}/courriels/kpi/count/cloture`)
            .then(response => {
                setCourrielClotureCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axiosInstance.get(`${API_URL}/courriels/kpi/count/non-cloture`)
            .then(response => {
                setCourrielNonClotureCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axiosInstance.get(`${API_URL}/courriels/kpi/count/en-attent`)
            .then(response => {
                setCourrielEnAttentCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axiosInstance.get(`${API_URL}/courriels/kpi/count/blocked`)
            .then(response => {
                setCourrielBlockedCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axiosInstance.get(`${API_URL}/courriels/kpi/count/en-cours`)
            .then(response => {
                setCourrielEnCoursCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // ============================ Courriel Recent ============================
    const [recentCourriels, setRecentCourriels] = useState<CourrielBureauOrdre[]>([]);
    const courrielsRecent = () => {
        return (
            <div className="card">
                <h5>Courriel Recent</h5>
                {recentCourriels && (
                    <DataTable
                        value={recentCourriels}
                        rows={5}
                        emptyMessage="Aucun Courriels touvés"
                        paginator
                        responsiveLayout="scroll"
                    >
                        <Column
                            expander
                            field="sujet"
                            header="Sujet"
                            className="w-15rem "
                            sortable
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            body={(rowData) => {
                                return (
                                    <span >
                                        {rowData.label === 'pere' && rowData.type === "SORTANT" && <i className="pi pi-sign-out " style={{ marginRight: '0.5rem', fontSize: '1rem', color: 'var(--blue-700)', transform: 'scaleX(-1)' }}></i>}
                                        {rowData.label === 'pere' && rowData.type === "ENTRANT" && <i className="pi pi-sign-in" style={{ marginRight: '0.5rem', fontSize: '1rem', color: 'green' }}></i>}
                                        {rowData.label === 'Complement' && <i className="pi pi-tags " style={{ marginRight: '0.5rem', fontSize: '1.5rem', color: 'slateblue' }}></i>}
                                        {rowData.label === 'Reponse' && <i className="pi pi-reply" style={{ marginRight: '0.5rem', fontSize: '1.5rem', color: 'green' }}></i>}
                                        <span> {rowData.sujet}</span>
                                    </span>
                                )
                            }}
                        />
                        <Column
                            header="Expediteur"
                            body={(rowData) => {
                                if (rowData.type === 'ENTRANT' && rowData.entiteExterne?.nom) {
                                    return <span>{rowData.entiteExterne.nom}</span>
                                } else if (rowData.type === 'SORTANT' && rowData.entiteInterne?.libelle) {
                                    return <span>{rowData.entiteInterne.libelle}</span>
                                }
                            }}
                        />
                        <Column
                            header="Destinataire"
                            body={(rowData) => {
                                if (rowData.type === 'SORTANT' && rowData.entiteExterne?.nom) {
                                    return <span>{rowData.entiteExterne.nom}</span>
                                } else if (rowData.type === 'ENTRANT' && rowData.entiteInterne?.libelle) {
                                    return <span>{rowData.entiteInterne.libelle}</span>
                                }
                            }}
                        />
                        <Column field="Actions" header="Actions"
                            body={
                                (rowData) => {
                                    return <div>
                                        <ViewCourrielBO courriel={rowData} refetchCourriels={() => { }} showToast={showToast} />
                                    </div>
                                }
                            }
                        />
                    </DataTable>)}
                <Toast ref={toast} />
            </div>
        );
    };
    useEffect(() => {
        axiosInstance.get(`${API_URL}/courriels/kpi/recent`)
            .then(response => {
                setRecentCourriels(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // ============================ Courriel par Priorite ============================
    const [countCourrielPioriteBasse, setCountCourrielPioriteBasse] = useState<number>(0);
    const [countCourrielPioriteMoyenne, setCountCourrielPioriteMoyenne] = useState<number>(0);
    const [countCourrielPioriteHaute, setCountCourrielPioriteHaute] = useState<number>(0);
    const courrielParPriorite = () => {
        return (
            <div className="card">
                <div className="flex justify-content-between align-items-center mb-5">
                    <h5>Courriel par Priorite</h5>
                </div>
                <ul className="list-none p-0 m-0">
                    {PrioriteCourrielOptions.map((priorite, index) => {
                        let percent: number = 0;
                        if (priorite.value === 'BASSE') {
                            percent = (countCourrielPioriteBasse / courrielsCount) * 100;
                        } else if (priorite.value === 'MOYENNE') {
                            percent = (countCourrielPioriteMoyenne / courrielsCount) * 100;
                        } else {
                            percent = (countCourrielPioriteHaute / courrielsCount) * 100;
                        }
                        let styleWidth = `${percent}%`;
                        return (
                            <li key={index} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{priorite.label}</span>
                                    <div className="mt-1 text-600">
                                        {priorite.value === 'BASSE' ? countCourrielPioriteBasse :
                                            priorite.value === 'MOYENNE' ? countCourrielPioriteMoyenne :
                                                countCourrielPioriteHaute}
                                    </div>
                                </div>
                                <div className="mt-2 md:mt-0 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className="bg-orange-500 h-full" style={{ width: styleWidth }} />
                                    </div>
                                    <span className="text-orange-500 ml-3 font-medium">
                                        {percent.toFixed(2)}%
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };
    useEffect(() => {
        axiosInstance.get(`${API_URL}/courriels/kpi/count/priorite/${PrioriteCourriel.BASSE}`)
            .then(response => {
                setCountCourrielPioriteBasse(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        axiosInstance.get(`${API_URL}/courriels/kpi/count/priorite/${PrioriteCourriel.MOYENNE}`)
            .then(response => {
                setCountCourrielPioriteMoyenne(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        axiosInstance.get(`${API_URL}/courriels/kpi/count/priorite/${PrioriteCourriel.HAUTE}`)
            .then(response => {
                setCountCourrielPioriteHaute(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // ============================ Courriel History ============================
    const [history, setHistory] = useState<CourrielHistory[]>([]);
    const groupByDate = (list: CourrielHistory[]) => {
        const map = new Map();
        list.forEach((item: CourrielHistory) => {
            const date = new Date(item.dateAction).toDateString();
            const collection = map.get(date);
            if (!collection) {
                map.set(date, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    };
    const courrielHistory = () => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        return (
            <div className="card">
                <div className="flex align-items-center justify-content-between mb-4">
                    <h5>History</h5>
                </div>
                {Array.from(groupByDate(history))
                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                    .map(([date, items], index) => {
                        let heading;
                        if (date === today) {
                            heading = 'TODAY';
                        } else if (date === yesterday) {
                            heading = 'YESTERDAY';
                        } else {
                            heading = date;
                        }

                        return (<div key={index}>
                            <span className="block text-600 font-medium mb-3">{heading}</span>
                            <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                                {items.map((item: CourrielHistory, index: number) => {
                                    return (
                                        <li
                                            key={index}
                                            className="flex align-items-center justify-content-between py-2 border-bottom-1 surface-border bg-blue"
                                        >
                                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                                <i className="pi pi-file-edit text-xl text-blue-500" />
                                            </div>
                                            <span className="text-900 line-height-3">
                                                {item.message}
                                            </span>
                                            {item.initiator ?
                                                <div className="flex align-items-center gap-2">
                                                    <img alt="" src="/user-avatar.png" width="32" />
                                                    <span className='font-bold'>{item.initiator?.nom}</span>
                                                </div> :
                                                <></>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>);
                    })}
            </div>
        );
    };
    useEffect(() => {
        axiosInstance.get(`${API_URL}/courriels/kpi/history/recent`)
            .then(response => {
                setHistory(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // ============================ Courriel Entrant/Sortant ============================
    const [doughnutData, setDoughnutData] = useState({});
    const [doughnutOptions, setDoughnutOptions] = useState({});
    const [countCourrielEntrant, setCountCourrielEntrant] = useState<number>(0);
    const [countCourrielSortant, setCountCourrielSortant] = useState<number>(0);
    const courrielSortantEntrantPolarArea = () => {
        return (
            <div className="card flex flex-column">
                <h5 className="flex align-self-start">Courriel Entrant/Sortant</h5>
                <Chart type="doughnut" data={doughnutData} options={doughnutOptions} className="flex align-self-center w-1/2" />
            </div>
        );
    };
    useEffect(() => {
        axiosInstance.get(`${API_URL}/courriels/kpi/count/entrants`)
            .then(response => {
                setCountCourrielEntrant(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axiosInstance.get(`${API_URL}/courriels/kpi/count/sortants`)
            .then(response => {
                setCountCourrielSortant(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            datasets: [
                {
                    data: [countCourrielEntrant, countCourrielSortant],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--blue-500')
                    ],
                    label: 'My dataset'
                }
            ],
            labels: ['Entrants', 'Sortant',]
        };
        setDoughnutData(data);
    }, [countCourrielEntrant, countCourrielSortant]);


    // ============================ Courrier Timeline ============================
    const [lineData, setLineData] = useState<ChartData>();
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const courrierTimeline = () => {
        return (
            <div className="card">
                <h5>Courrier Timeline</h5>
                <Chart type="line" data={lineData} options={lineOptions} />
            </div>
        );
    };
    useEffect(() => {
        axiosInstance.get(`${API_URL}/courriels/kpi/timeline`)
            .then(response => {
                const dates = Object.keys(response.data);
                const counts = Object.values(response.data) as number[];

                const data: ChartData = {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Count per day',
                            data: counts,
                            fill: true,
                            backgroundColor: '#2f4860',
                            borderColor: '#2f4860',
                            tension: 0.4
                        },
                    ]
                };

                setLineData(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    // ============================ Plan Classement ============================
    const [planClassementData, setPlanClassementData] = useState<PlanClassementBO[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    const convertToTreeNode = (data: PlanClassementBO): Node | null => {
        const treeNode: Node = {
            key: data.id?.toString() as string,
            label: data.libelle ? data.libelle : "Plan Classement",
            expanded: true,
            style: { borderRadius: '12px', backgroundColor: "#123C69" },
            className: 'text-white',
        };

        if (data.children && data.children.length > 0) {
            treeNode.children = data.children.map(convertToTreeNode).filter((node: any): node is Node => node !== null);
        }

        return treeNode;
    };
    const planTemplate = (node: Node) => {
        return (
            <div style={{ borderRadius: "10px" }} className="flex flex-column border-round-xs">
                <div className="flex flex-column align-items-center border-round-lg">
                    <span className="font-bold mb-3">{node.label}</span>
                    {/* {node.utilisateurInfo && (
                        <div style={{ borderBlock: "1px solid #dee2e6" }} className="flex p-2">
                            <span className='pr-2'>Chef:</span>
                            <span className='pr-2'>hhhhh</span>
                            <span> hhhhhh</span>
                        </div>
                    )} */}
                </div>
            </div>
        );
    };
    useEffect(() => {
        fetchPlanClassementBo();
    }, []);

    const fetchPlanClassementBo = async () => {
        await axiosInstance.get<PlanClassementBO[]>(`${API_URL}/plan-classement-bo/parents`).then((res) => {
            const filteredNodes = res.data.map(convertToTreeNode).filter((node): node is Node => node !== null);
            setNodes(prevNodes => [...prevNodes, ...filteredNodes]);
        }).catch((err) => {
            console.log('err:', err);
        });
    };

    return (
        <>
            <div className="grid">
                {insights()}
                <div className="col-12 xl:col-6">
                    {courrielsRecent()}
                    {courrielSortantEntrantPolarArea()}
                    {courrielParPriorite()}
                </div>
                <div className="col-12 xl:col-6">
                    {courrierTimeline()}
                    {courrielHistory()}
                </div>
                <div className="card col-12 m-2">
                    <h5>Plan Classement</h5>
                    <div className="flex">
                        {nodes.length != 0 && nodes.map((node, index) => (
                            <OrganizationChart key={index} value={[node]} nodeTemplate={planTemplate} />

                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default index;