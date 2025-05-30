import axiosInstance from "app/axiosInterceptor";
import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { CourrielHistory } from "app/controller/model/BureauOrdre/CourrielHistory";
import { format } from "date-fns";
import saveAs from "file-saver";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Timeline } from 'primereact/timeline';
import { useEffect, useState } from "react";
import { toTitleCase } from "app/component/admin/view/bureau-ordre/BO_courriels/BO_Utils";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { IntervenantCourriel } from "app/controller/model/BureauOrdre/IntervenantCourriel";
import { ProgressBar } from "primereact/progressbar";



const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface CustomEvent {
    id?: number;
    name?: string;
    message?: string;
    date?: string;
    type?: string;
    initiator?: UtilisateurDto;
    intervenant?: IntervenantCourriel;
    color?: string;
    icon?: string;
    image?: string;
}

const CourrielHistoryView = ({ courriel }: { courriel: CourrielBureauOrdre }) => {

    const [history, setHistory] = useState<CourrielHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchCourrielHistory = async () => {
        setLoading(true);
        await axiosInstance.get(`${API_URL}/courriel-history/courriel/${courriel.id}`).then((res) => {
            setHistory(res.data);
            setLoading(false);
        }).catch((err) => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchCourrielHistory();
    }, []);

    const [events, setEvents] = useState<CustomEvent[]>([]);

    const mapCourrielHistoryToEvents = (courrielHistories: CourrielHistory[]): CustomEvent[] => {
        return courrielHistories.map(courrielHistory => ({
            id: courrielHistory.id,
            name: courrielHistory.type,
            message: courrielHistory.message,
            date: format(new Date(courrielHistory.dateAction), "dd/MM/yyyy"),
            type: courrielHistory.type,
            initiator: courrielHistory.initiator,
            intervenant: courrielHistory.intervenant,
        }));
    };

    useEffect(() => {
        setEvents(mapCourrielHistoryToEvents(history));
    }, [history]);

    const downloadPDF = async (courrielId: number) => {
        await axiosInstance.get(`${API_URL}/courriel-history/history-pdf/${courrielId}`, { responseType: 'blob' })
            .then((res) => {
                const blob = new Blob([res.data], { type: 'application/pdf' });
                saveAs(blob, `${courriel.sujet}-${courriel.id}.pdf`);
            })
            .catch((err) => {
                console.error(err);
            });

    };

    const calculateProgressBarValue = (dateCreationStr: string, dateEcheanceStr: string): number => {
        const dateCreation = new Date(dateCreationStr);
        const dateEcheance = new Date(dateEcheanceStr);

        dateEcheance.setHours(23, 59, 59, 999);

        if (dateCreation > dateEcheance) {
            return 100;
        }

        const totalDurationHours = (dateEcheance.getTime() - dateCreation.getTime()) / 1000 / 60 / 60;
        const elapsedDurationHours = (new Date().getTime() - dateCreation.getTime()) / 1000 / 60 / 60;

        if (totalDurationHours <= 0 || elapsedDurationHours <= 0) {
            return 0;
        }

        const progress = Math.min((elapsedDurationHours / totalDurationHours) * 100, 100);
        return progress;
    };

    return (
        <>
            {loading && <div className="flex justify-content-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>}
            {error && <div className="flex justify-content-center">
                <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
            </div>}

            {!loading && !error &&
                <div style={{ width: '100%' }}>
                    <div className="flex flex-column">
                        <div className="flex align-self-end mb-6">
                            <Button
                                label="Download PDF"
                                icon="pi pi-download"
                                className="p-button-raised p-button-rounded p-button-text bg-primary"
                                onClick={() => {
                                    if (courriel.id !== null) {
                                        downloadPDF(courriel.id);
                                    } else {
                                        console.error('courriel.id is null');
                                    }
                                }}
                            />
                        </div>
                        <Timeline
                            align="alternate"
                            value={events}
                            style={{ width: '100%' }}
                            marker={(item: CustomEvent) => <i
                                className="pi pi-file-edit"
                                style={{ fontSize: '1.5em' }}
                            ></i>}
                            content={(item: CustomEvent) => {
                                const dateCreation = new Date(item.intervenant?.dateCreation || "");
                                const dateEcheance = new Date(courriel.dateEcheance);
                                let color;

                                if (item.intervenant?.done) {
                                    color = 'green';
                                } else if (dateCreation > dateEcheance) {
                                    color = 'red';
                                } else {
                                    color = 'blue';
                                }
                                return (<Card
                                    title={
                                        <div className="flex justify-content-between flex-wrap">
                                            <div className="flex align-items-center justify-content-between">
                                                {item.name?.length === 0 ? "New Entry" : toTitleCase(item.name)}
                                            </div>
                                            {item.intervenant ?
                                                <>{item.intervenant.done ?
                                                    <i className="pi pi-check-circle"
                                                        style={{
                                                            fontSize: '1em',
                                                            color: 'green'
                                                        }}
                                                    /> :
                                                    <i className="pi pi-times-circle" style={{
                                                        fontSize: '1em',
                                                        color: 'red'
                                                    }} />
                                                }</>
                                                : <></>}
                                        </div>
                                    }
                                    subTitle={<p className="flex align-items-start gap-2">{item.date}</p>}
                                    style={{
                                        backgroundColor: item.type === 'INFORMATION' ? 'rgba(0, 123, 255, 0.1)' :
                                            item.type === 'CREATION' ? 'rgba(40, 167, 69, 0.1)' :
                                                item.type === 'ETAT_CHANGE' ? 'rgba(255, 193, 7, 0.1)' :
                                                    item.type === 'INTERVENTION' ? 'rgba(23, 162, 184, 0.1)' :
                                                        item.type === 'MODIFICATION' ? 'rgba(255, 206, 86, 0.1)' :
                                                            item.type === 'DELETION' ? 'rgba(220, 53, 69, 0.1)' :
                                                                'rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {!item.intervenant ?
                                        <p className="flex align-items-start gap-2 text-lg font-medium">{item.message}</p>
                                        : <div>
                                            <p className="flex align-items-start gap-2 text-lg font-medium">{toTitleCase(item.intervenant.action)}</p>
                                            <ProgressBar
                                                showValue={false}
                                                style={{ height: '.5rem', color: color }}
                                                value={calculateProgressBarValue(item.intervenant.dateCreation, courriel.dateEcheance)}
                                            />
                                        </div>
                                    }
                                    {item.initiator ?
                                        <div className="flex align-items-start gap-2 mt-5">
                                            <img alt="" src="/user-avatar.png" width="32" />
                                            <span className='font-bold'>{item.initiator?.nom}</span>
                                        </div> :
                                        <></>}
                                </Card>);
                            }

                            }
                        />
                    </div>
                </div>}
        </>
    );
};

export default CourrielHistoryView;