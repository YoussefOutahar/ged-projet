import { IntervenantCourriel, StatutIntervention } from "app/controller/model/BureauOrdre/IntervenantCourriel";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { Button } from "primereact/button";
import { t } from "i18next";
import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import axiosInstance from "app/axiosInterceptor";
import { MessageService } from "app/zynerator/service/MessageService";
import { Toast } from "primereact/toast";
import saveAs from "file-saver";
import { useCourrielsContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsProvider";
import { Timeline } from "primereact/timeline";
import { toTitleCase } from "app/component/admin/view/bureau-ordre/BO_courriels/BO_Utils";
import ExpandableCard from "./ExpandableCard";
import { ProgressBar } from "primereact/progressbar";
import { Chip } from "primereact/chip";
import { InputTextarea } from "primereact/inputtextarea";
import { DocumentDto } from "app/controller/model/Document.model";
import InterventionAddFilesButton from "./InterventionAddFilesButton";
import FileChip from "./FileChip";
import { doc } from "prettier";
import { isPdf } from "app/utils/documentUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface CustomEvent {
    id?: number;
    done: boolean;
    commentaire: string;
    dateCreation: string;
    dateIntervention: string;
    action: string;
    statut: StatutIntervention;
    createdBy: UtilisateurDto | null;
    responsables: UtilisateurDto[];
    intervenant: UtilisateurDto | null;
    documents: DocumentDto[];
    color?: string;
    icon?: string;
}

interface Props {
    connectedUser?: UtilisateurDto | null;
    courriel: CourrielBureauOrdre;
    setCourriel?: (courriel: CourrielBureauOrdre) => void;
    toast?: React.Ref<Toast>;
    canUpdate: boolean;
    confirmRejectInterventionPopup?: (e: any, intervenant: IntervenantCourriel) => void;
}

const Intervention = ({ courriel, setCourriel, toast, connectedUser, canUpdate, confirmRejectInterventionPopup = () => { } }: Props) => {

    const { fetchCourriels: refetchCourriels, planClassementId } = useCourrielsContext();

    const mapInterventionTimelineData = (intervenants: IntervenantCourriel[]): CustomEvent[] => {
        return intervenants.map((intervenant) => {
            return {
                id: intervenant.id ?? 0,
                done: intervenant.done,
                commentaire: intervenant.commentaire,
                dateCreation: intervenant.dateCreation,
                dateIntervention: intervenant.dateIntervention,
                action: intervenant.action,
                statut: intervenant.statut,
                createdBy: intervenant.createdBy,
                responsables: intervenant.responsables,
                intervenant: intervenant.intervenant,
                documents: intervenant.documents,
                color: intervenant.statut ==
                    StatutIntervention.CLOTURE ? 'rgba(40, 167, 69, 0.1)' : // green
                    intervenant.statut == StatutIntervention.ANNULE ? 'rgba(220, 53, 69, 0.1)' : // red
                        'rgba(255, 206, 86, 0.1)', // yellow
            }
        });
    }

    const updateIntervention = async (intervention: IntervenantCourriel) => {
        return await axiosInstance.put(`${API_URL}/courriel/intervenants-courriel/update-intervenants/${courriel.id}`, intervention)
            .then((res) => {
                MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
                refetchCourriels(planClassementId!);
                setCourriel!(res.data);
            }).catch((err) => {
                console.log('err:', err);
                MessageService.showError(toast, t('error.error'), t("error.operation"));
            });
    }

    const canDoIntervention = (intervention: IntervenantCourriel): boolean => {
        if (!connectedUser) return false;
        if (intervention.statut !== StatutIntervention.CLOTURE && intervention.statut !== StatutIntervention.ANNULE && intervention.responsables.some(res => res.id === connectedUser!.id)) {
            return true;
        }
        return false
    }

    const downloadPDF = async (courrielId: number) => {
        await axiosInstance.get(`${API_URL}/courriel/intervenants-courriel/intervenants-pdf/${courrielId}`, { responseType: 'blob' })
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
            {courriel?.intervenants == null || courriel.intervenants.length === 0 ?
                <p style={{ textAlign: "center" }}>{t('bo.intervention.aucuneIntervention')}</p> :
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
                        align="left"
                        value={mapInterventionTimelineData(courriel.intervenants)}
                        className="w-min"
                        marker={(item: CustomEvent, index: number) => {
                            return canDoIntervention(item as IntervenantCourriel) ?
                                <i
                                    key={index}
                                    className="pi pi-circle-fill"
                                    style={{ color: '#23C552', fontSize: '1.5rem' }} /> :
                                item.done ?
                                    <i

                                        key={index}
                                        className="pi pi-check-circle"
                                        style={{ color: '#23C552', fontSize: '1.5rem' }} /> :
                                    <i

                                        key={index}
                                        className="pi pi-times-circle"
                                        style={{ color: '#FF0000', fontSize: '1.5rem' }} />
                        }}
                        // opposite={(item: CustomEvent) => (<div style={{ display: 'none', flex: '0', width: '0px' }}></div>)}
                        content={(item: CustomEvent, index: number) => (
                            <ExpandableCard
                                key={item.id}
                                color={item.color}
                                Header={
                                    <div style={{ display: 'flex', width: '50rem' }}>
                                        <div className='flex flex-row gap-2 align-items-center'>
                                            <span className="text-3xl font-medium text-900 mb-4">{toTitleCase(item.action) || 'aucun'}</span>
                                        </div>
                                    </div>
                                }
                                Footer=
                                {<div
                                    key={index}
                                >
                                    {
                                        item.statut !== StatutIntervention.CLOTURE &&
                                        item.statut !== StatutIntervention.ANNULE &&
                                        <ProgressBar
                                            showValue={true}
                                            className="mb-3"
                                            value={Math.floor(calculateProgressBarValue(item.dateCreation, courriel.dateEcheance))}
                                            displayValueTemplate={(value) => <div className="text-xs" >{`${value}%`}</div>}
                                        />}
                                    <div
                                        className="spacer"
                                        key={index}
                                    >
                                        {
                                            item.dateIntervention &&
                                            <span className="align-self-center">
                                                <b>{t('bo.intervention.DateModification')}:  </b>
                                                {new Date(item.dateIntervention).toLocaleDateString('fr-FR')}
                                                <span>  </span>
                                                {new Date(item.dateIntervention).toLocaleTimeString('fr-FR')}
                                            </span>
                                        }

                                        {canDoIntervention(item as IntervenantCourriel) && canUpdate &&
                                            <div
                                                key={index}
                                            >

                                                {
                                                    item.action?.toLowerCase() !== "avis de rejet" &&
                                                    <Button className='mr-2 hover:bg-red-600' severity='danger' icon='pi pi-times-circle' label={t('reject')}
                                                        onClick={(e) => {
                                                            const intervenant = {
                                                                id: item.id,
                                                                dateIntervention: item.dateIntervention,
                                                                done: false,
                                                                statut: StatutIntervention.ANNULE,
                                                                intervenant: connectedUser!,
                                                                action: item.action,
                                                                commentaire: item.commentaire,
                                                                dateCreation: item.dateCreation,
                                                                responsables: item.responsables,
                                                                createdBy: item.createdBy,
                                                                documents: item.documents
                                                            } as IntervenantCourriel;
                                                            confirmRejectInterventionPopup(e, intervenant)
                                                        }}
                                                    />}

                                                <Button className='hover:bg-green-600' icon='pi pi-check-circle' label={item.action?.toLowerCase() !== "avis de rejet" ? t('bo.intervention.markAsDone') : t('Marquer comme vu')}
                                                    onClick={
                                                        () => {
                                                            const intervenant = {
                                                                id: item.id,
                                                                dateIntervention: item.dateIntervention,
                                                                done: true,
                                                                statut: StatutIntervention.CLOTURE,
                                                                intervenant: connectedUser!,
                                                                action: item.action,
                                                                commentaire: item.commentaire,
                                                                dateCreation: item.dateCreation,
                                                                responsables: item.responsables,
                                                                createdBy: item.createdBy,
                                                                documents: item.documents
                                                            } as IntervenantCourriel;
                                                            updateIntervention(intervenant)
                                                        }
                                                    }
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>}
                                Content={<div
                                    key={index}
                                >
                                    <ul className="list-none p-0 m-0">
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('CreatedBy')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {item.createdBy ? (
                                                    <div className="flex align-items-center gap-2">
                                                        <img alt="" src="/user-avatar.png" width="32" />
                                                        <span className='font-bold'>{item.createdBy.nom}</span>
                                                    </div>
                                                ) : '-'
                                                }
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.intervenant')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {item.intervenant ? (
                                                    <div className="flex align-items-center gap-2">
                                                        <img alt="" src="/user-avatar.png" width="32" />
                                                        <span className='font-bold'>{item.intervenant.nom}</span>
                                                    </div>
                                                ) : t('bo.intervention.aucunIntervenant')
                                                }
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.annotation')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {toTitleCase(item.action) || '-'}
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.statut')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {toTitleCase(item.statut) || '-'}
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.DateCreation')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {new Date(item.dateCreation).toLocaleDateString('fr-FR')}
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.DateModification')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {item.dateIntervention ? new Date(item.dateIntervention).toLocaleDateString('fr-FR') : t('bo.intervention.aucuneModification')}
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.Responsable')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                {item.responsables.map((responsable, index) => {
                                                    return (
                                                        <Chip key={index} label={responsable.nom} icon="pi pi-user" className="text-sm mr-2 mt-2" />
                                                    );
                                                })}
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.Files')}</div>
                                            <div className="flex text-900 w-full md:w-8 md:flex-order-0 flex-order-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    {item.documents && item.documents.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.documents.map((doc, index) => {
                                                                return (
                                                                    <FileChip key={index} document={doc} signDocument={item.statut === StatutIntervention.EN_COURS && item.action.toLowerCase() == "signer" && isPdf(doc.documentType?.code ?? "pdf-ref")} />
                                                                );
                                                            })}
                                                        </div>
                                                    ) : t('bo.intervention.aucunFichier')}
                                                </div>
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">{t('bo.intervention.Commentaire')}</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                {
                                                    canDoIntervention(item as IntervenantCourriel) && canUpdate
                                                        ?
                                                        <InputTextarea
                                                            className='w-full'
                                                            value={courriel.intervenants[index].commentaire}
                                                            onChange={(e) => setCourriel!({ ...courriel, intervenants: courriel.intervenants.map((interv, i) => i === index ? { ...interv, commentaire: e.target.value } : interv) })}
                                                        />
                                                        :
                                                        item.commentaire || 'aucun'
                                                }
                                            </div>
                                            <div className="w-6 md:w-2 flex justify-content-end">
                                                {
                                                    canDoIntervention(item as IntervenantCourriel) && canUpdate &&
                                                    <Button className='mr-2 hover:bg-blue-600' icon='pi pi-pencil' label={t('edit')}
                                                        onClick={() => {
                                                            const intervenant = {
                                                                id: item.id,
                                                                dateIntervention: item.dateIntervention,
                                                                done: false,
                                                                statut: StatutIntervention.EN_COURS,
                                                                intervenant: connectedUser!,
                                                                action: item.action,
                                                                commentaire: item.commentaire,
                                                                dateCreation: item.dateCreation,
                                                                responsables: item.responsables,
                                                                createdBy: item.createdBy,
                                                                documents: item.documents
                                                            } as IntervenantCourriel;
                                                            updateIntervention(intervenant)
                                                        }}
                                                    />
                                                }
                                            </div>
                                        </li>
                                    </ul>
                                </div>}
                            />
                        )}
                    />
                    {/* < Accordion className='mb-4' multiple >
                        {
                            courriel.intervenants?.map((intervenant, index) => (
                                <AccordionTab
                                    key={index}
                                    headerTemplate={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '50rem' }}>
                                            <div className='flex flex-row gap-2 align-items-center'>
                                                <span className="font-bold white-space-nowrap">{toTitleCase(intervenant.action) || 'aucun'}</span>
                                                
                                            </div>
                                            {intervenant.done ? (
                                                <i className="pi pi-check" style={{ color: 'green' }}></i>
                                            ) : (intervenant.statut === StatutIntervention.CLOTURE &&
                                                <i className="pi pi-times" style={{ color: 'red' }}></i>
                                            )}
                                        </div>

                                    }
                                >
                                    <div className="surface-0">

                                    </div>
                                    {
                                        canDoIntervention(intervenant) && canUpdate &&
                                        <div className='flex flex-row justify-content-end '>

                                            <Button className='mt-3 mr-2 hover:bg-red-600' severity='danger' icon='pi pi-times-circle' label={t('reject')}
                                                onClick={(e) => confirmRejectInterventionPopup(e, intervenant)}
                                            />

                                            <Button className='mt-3 hover:bg-green-600' icon='pi pi-check-circle' label={t('bo.intervention.markAsDone')}
                                                onClick={
                                                    () => updateIntervention({ ...intervenant, done: true, statut: StatutIntervention.CLOTURE, intervenant: connectedUser! })
                                                }
                                            />
                                        </div>
                                    }

                                </AccordionTab>
                            ))
                        }
                    </Accordion > */}
                </div >
            }
        </>
    );
};

export default Intervention;