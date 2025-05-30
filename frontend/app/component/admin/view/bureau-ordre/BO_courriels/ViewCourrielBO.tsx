import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";
import PreviewCourrielFilesButton from "./CourrielsDocs/PreviewCourrielFilesButton";
import CourrielHistoryView from "./CourrielBOHistory/CourrielBOHistory";
import { InputText } from "primereact/inputtext";
import { t } from "i18next";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import React from "react";
import Intervention from "./Intervention/Intervention";
import { toTitleCase } from "./BO_Utils";

type Props = {
    courriel: CourrielBureauOrdre;
    refetchCourriels: (planClassementId: number) => void;
    showToast: (severity: SeverityType, summary: string) => void;
};

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const ViewCourrielBO = ({ courriel, refetchCourriels, showToast }: Props) => {
    const [visible, setVisible] = useState(false);

    const priorityTagTemplate = (option: { label: string, value: string }) => {
        const style = { fontSize: '1rem' };
        const className = "pt-2 pb-2 pr-3 pl-3"
        if (option) {
            if (option.value === 'HAUTE') {
                return (
                    <Tag className={className} value="Haute" severity="success" style={style} />
                )
            } else if (option.value === 'MOYENNE') {
                return (
                    <Tag className={className} value="Moyenne" severity="warning" style={style} />
                )
            } else if (option.value === 'BASSE') {
                return (
                    <Tag className={className} value="Basse" severity="info" style={style} />
                )
            }
        }
        return null;
    };

    const avancementTagTemplate = (rowData: { label: string, value: string }) => {
        const style = { fontSize: '1rem' };
        const className = "pt-2 pb-2 pr-3 pl-3"
        if (rowData.value === 'EN_ATTENTE') {
            return (
                <Tag className={className} value="En Attente" severity="info" style={style} />
            )
        } else if (rowData.value === 'EN_COURS') {
            return (
                <Tag className={className} value="En Cours" severity="warning" style={style} />
            )
        } else if (rowData.value === 'REJETE') {
            return (
                <Tag className={className} value="Rejeté" severity="danger" style={style} />
            )
        } else if (rowData.value === 'TERMINE') {
            return (
                <Tag className={className} value="Terminé" severity="success" style={style} />
            )
        } else {
            return (
                <Tag value="Inconnu" style={style} />
            )
        }
    }

    return (
        <>
            <Button raised icon="pi pi-eye" className="p-button-rounded mr-2" onClick={() => setVisible(true)} tooltip={t('bo.tooltip.plusInfo')} />
            <Dialog
                header={courriel.sujet}
                visible={visible}
                className="p-fluid"
                style={{ width: "70%" }}
                onHide={() => {
                    setVisible(false);
                }}
            >
                <TabView>
                    <TabPanel header="Details" leftIcon="pi pi-info-circle mr-2">
                        <div className="formgrid grid">
                            <Divider align="left">
                                <span className="p-tag">{toTitleCase(t('bo.courriel'))}</span>
                            </Divider>
                            <div className="field col-4">
                                <label htmlFor="externe">{courriel.type === "ENTRANT" ? t('bo.data.expediteur') : t('bo.data.destinataire')}</label>
                                <InputText
                                    id="externe"
                                    value={courriel.entiteExterne?.nom}
                                    disabled
                                />
                            </div>

                            <div className="field col-4">
                                <label htmlFor="interne">{courriel.type === "ENTRANT" ? t('bo.data.destinataire') : t('bo.data.expediteur')}</label>
                                <InputText
                                    id="interne"
                                    value={courriel.entiteInterne?.libelle}
                                    disabled
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="sujet">{t("sujet")}</label>
                                <InputText
                                    id="sujet"
                                    name="sujet"
                                    value={courriel.sujet}
                                    disabled
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="dateReception">{t('bo.data.dateReception')}</label>
                                <Calendar
                                    id="dateReception"
                                    value={new Date(courriel.dateReception)}
                                    disabled
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="dateEcheance">{t('bo.data.dateEcheance')}</label>
                                <Calendar
                                    id="dateEcheance"
                                    value={new Date(courriel.dateEcheance)}
                                    disabled
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="numeroRegistre">{t('bo.data.numeroRegistre')}</label>
                                <InputText
                                    id="numeroRegistre"
                                    value={courriel.numeroRegistre?.toString()}
                                    disabled
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="numeroCourriel">{t('bo.data.numeroCourriel')}</label>
                                <InputText
                                    id="numeroCourriel"
                                    value={courriel.numeroCourriel?.toString()}
                                    disabled
                                />
                            </div>
                            {courriel.type === "ENTRANT" &&
                                <div className="field col-4">
                                    <label htmlFor="numeroCourrielExterne">{t('bo.data.numeroCourrielExterne')}</label>
                                    <InputText
                                        id="numeroCourrielExterne"
                                        value={courriel.numeroCourrielExterne}
                                        disabled
                                    />
                                </div>}
                            <div className="field col-4">
                                <label htmlFor="planClassement">{t('bo.planClassement')}</label>
                                <InputText
                                    id="planClassement"
                                    value={courriel?.planClassement?.libelle ? courriel?.planClassement?.libelle : ""}
                                    disabled
                                />
                            </div>

                            <Divider align="left">
                                <span className="p-tag">Status</span>
                            </Divider>

                            <div className="field col-3">
                                <label htmlFor="voieenvoie">{t('bo.data.voiEnvoi')}</label>
                                <InputText
                                    id="voieenvoie"
                                    value={courriel.voieEnvoi}
                                    disabled
                                />
                            </div>
                            <div className="field col-3">
                                <label htmlFor="type">Type</label>
                                <InputText
                                    id="type"
                                    value={courriel.type ? courriel.type : ""}
                                    disabled
                                />
                            </div>

                            <div className="field col-3">
                                <label htmlFor="etatavancement">{t('bo.data.etatAvancement')}</label>
                                <div>
                                    {avancementTagTemplate({ label: courriel.etatAvancement, value: courriel.etatAvancement })}
                                </div>
                            </div>
                            <div className="field col-3">
                                <label htmlFor="priorite">{t('bo.data.priorite')}</label>
                                <div>
                                    {priorityTagTemplate({ label: courriel.priorite, value: courriel.priorite })}
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Files" leftIcon="pi pi-file-pdf mr-2">
                        <PreviewCourrielFilesButton courriel={courriel} showToast={showToast} />
                    </TabPanel>
                    <TabPanel header="Fiche de liaison" leftIcon="pi pi-list mr-2">
                        <Intervention canUpdate={true} courriel={courriel} />
                    </TabPanel>
                    <TabPanel header="History" leftIcon="pi pi-history mr-2">
                        <CourrielHistoryView courriel={courriel} />
                    </TabPanel>
                </TabView>
            </Dialog>
        </>
    );
};

export default ViewCourrielBO;