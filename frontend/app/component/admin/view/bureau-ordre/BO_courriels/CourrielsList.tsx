import axiosInstance from "app/axiosInterceptor";
import { MessageService } from "app/zynerator/service/MessageService";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import React, { useEffect } from "react";
import { useState } from "react";
import { TFunction } from "i18next";
import TreeNode from "primereact/treenode";
import { TreeTable, TreeTableEvent } from 'primereact/treetable';
import { Checkbox } from "primereact/checkbox";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";

const PlanClassementTab = React.lazy(() => import('app/component/admin/view/bureau-ordre/BO_courriels/PlanClassementBO/PlanClassementTab'));
const ViewCourrielBO = React.lazy(() => import('app/component/admin/view/bureau-ordre/BO_courriels/ViewCourrielBO'));
import { StatutInterventionOptions } from "app/controller/model/BureauOrdre/IntervenantCourriel";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import { CourrielBureauOrdre, EtatAvancementCourriel, VoieEnvoiOptions } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { useCourrielsContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsProvider";
import { useCourrielSelectionContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsSelectionProvider";
import { Paginator } from "primereact/paginator";
import CourrielImpression from "./Impression";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    showToast: (severity: SeverityType, summary: string) => void;
    toastRef: React.Ref<Toast>;
    t: TFunction;
    isResponsable?: boolean;
};

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const CourrielsTree = ({ t, showToast, toastRef, isResponsable = false }: Props) => {

    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [showFiltre, setShowFiltre] = useState<boolean>(false);
    const {
        courriels,
        courrielsNearDeadline,
        courrielsNeedingAttention,
        loadingCourriels,
        errorCourriels,
        planClassementId: planClassementKey,
        fetchCourriels: refetchCourriels,
        toggleCourrielsNearDeadline,
        viewCourrielsNearDeadline,
        toggleCourrielsNeedingAttention,
        viewCourrielsNeedingAttention,
        setPlanClassementId: setPlanClassementKey,
        handlePageNumberChange,
        setSearch,
    } = useCourrielsContext();
    const {
        select,
        selectedCourriels,
        setSelectedCourriels,
        unselect
    } = useCourrielSelectionContext();

    const [selectedPlanClassementName, setSelectedPlanClassementName] = useState<string | null>(null);
    useEffect(() => {
        const getSelectedPlanClassement = async () => {
            await axiosInstance.get<PlanClassementBO>(`${API_URL}/plan-classement-bo/${planClassementKey}`).then((res) => {
                setSelectedPlanClassementName(res.data.libelle);
            }).catch((err) => {
                console.log('err:', err);
            });
        };

        if (planClassementKey == -1) {
            setSelectedPlanClassementName(t('bo.tousLesCourriels'))
        } else {
            getSelectedPlanClassement();
        }
    }, [planClassementKey])

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <div className="flex flex-column md:flex-row md:align-items-center">
                {showFiltre ? (
                    <Button raised icon="pi pi-filter-slash"
                        className=" mr-2" severity="danger" onClick={() => {setShowFiltre(false)}} />
                ):(
                    <Button raised icon="pi pi-filter"
                        className=" mr-2" severity="secondary" onClick={() => {setShowFiltre(true)}} />
                )}
                <PlanClassementTab planClassementKey={planClassementKey} setPlanClassementKey={setPlanClassementKey} refetchCourriels={refetchCourriels} showToast={showToast} toastRef={toastRef} t={t} />
                <h5 className="m-3">{selectedPlanClassementName}</h5>
                <h5 className="m-3 ml-0">{t('bo.totalRecords').replace("{{totalRecords}}", courriels?.totalElements?.toString() ?? "0")}</h5>
            </div>
            <div className="flex flex-row ml-auto">
                {
                    !isResponsable &&
                    courrielsNearDeadline?.totalElements !== 0 &&
                    <div className="relative inline-block">
                        <Button
                            raised
                            rounded
                            tooltip={t('bo.tooltip.echeanceFilter')}
                            tooltipOptions={{ position: 'bottom' }}
                            className={`border-none mr-3 ${viewCourrielsNearDeadline ? 'bg-red-700' : 'bg-white'}`}
                            icon={`pi pi-stopwatch text-xl ${viewCourrielsNearDeadline ? '' : 'text-red-500 font-semibold'} `}
                            onClick={() => {
                                setSelectedCourriels([]);
                                toggleCourrielsNearDeadline();
                            }}
                        />
                        <Badge value={courrielsNearDeadline?.totalElements} className="absolute top-0 right-0 bg-red-500 text-white" style={{ fontSize: '1rem' }} />
                    </div>
                }
                {
                    isResponsable &&
                    courrielsNeedingAttention?.totalElements !== 0 &&
                    <div className="relative inline-block">
                        <Button
                            raised
                            rounded
                            tooltip={t('bo.tooltip.courrierNeedAttentionFilter')}
                            tooltipOptions={{ position: 'bottom' }}
                            className={`border-none mr-3 ${viewCourrielsNeedingAttention ? 'bg-blue-700' : 'bg-white'}`}
                            icon={`pi pi-check-square text-xl ${viewCourrielsNeedingAttention ? '' : 'text-blue-500 font-semibold'} `}
                            onClick={() => {
                                setSelectedCourriels([]);
                                toggleCourrielsNeedingAttention();
                            }}
                        />
                        <Badge value={courrielsNeedingAttention?.totalElements} className="absolute top-0 right-0 bg-blue-500 text-white" style={{ fontSize: '1rem' }} />
                    </div>
                }
            </div>
            <span className="block ml-2 mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search " />
                <InputText
                    type="search"
                    onChange={(e: any) => setSearch(e.target.value)}
                    placeholder={t("globalSearch")}
                />
            </span>
        </div>
    );

    const priorityTagTemplate = (option: { label: string, value: string }) => {
        if (option) {
            if (option.value === 'HAUTE') {
                return (
                    <Tag value="Haute" severity="success" />
                )
            } else if (option.value === 'MOYENNE') {
                return (
                    <Tag value="Moyenne" severity="warning" />
                )
            } else if (option.value === 'BASSE') {
                return (
                    <Tag value="Basse" severity="info" />
                )
            }
        }
        return null;
    };

    const updateCourrielPriority = async (courriel: CourrielBureauOrdre) => {
        return await axiosInstance.put(`${API_URL}/courriels/${courriel.id}`, courriel).then((res) => {
            refetchCourriels(Number(planClassementKey) === 0 ? -1 : Number(planClassementKey));
            MessageService.showSuccess(toastRef, t('success.success'), t("success.operation"));
        }).catch((err) => {
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
        });
    }

    const courrielInterventionEtatAvancement = (courriel: CourrielBureauOrdre) => {
        if (courriel.intervenants) {
            let intervenant = courriel.intervenants[courriel.intervenants.length - 1];
            let statutOption = StatutInterventionOptions.filter((option) => option.value === intervenant.statut)[0];
            let label = statutOption ? statutOption.label : "test";
            let color = statutOption ? statutOption.color : "black";
            return <Tag value={label} style={{ background: color }} />;
        } else {
            return <Tag value={"En Attente"} style={{ background: "orange" }} />;
        }
    }

    // define courriels nodes 
    const [dataNodes, setDataNodes] = useState<TreeNode[]>([]);

    const define_children_recursivly = (courriel: CourrielBureauOrdre) => {
        let children: TreeNode[] = [];
        if (courriel.complement) {
            let complementNode = {
                key: courriel.id?.toString(),
                label: 'Complement',
                data: courriel.complement,
                children: define_children_recursivly(courriel.complement)
            };
            children.push(complementNode);
        }
        if (courriel.reponse) {
            let reponseNode = {
                key: courriel.id?.toString(),
                label: 'Reponse',
                data: courriel.reponse,
                children: define_children_recursivly(courriel.reponse)
            };
            children.push(reponseNode);
        }
        return children;
    }

    useEffect(() => {
        if (courriels?.content) {
            setDataNodes(courriels?.content.map((courriel) => {
                return {
                    key: courriel.id?.toString(),
                    label: 'pere',
                    data: courriel,
                    children: define_children_recursivly(courriel)
                }
            }));
        }
    }, [courriels?.content]);

    return (
        <>
            {errorCourriels && <div className="flex justify-content-center">
                <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
            </div>}
            {showFiltre && <CourrielImpression all={!isResponsable} />}
            {!errorCourriels && (
                <><TreeTable
                    value={dataNodes}
                    loading={loadingCourriels}
                    emptyMessage="Aucun Courriels touvés"
                    globalFilter={globalFilter}
                    header={header}
                    resizableColumns
                    onRowClick={(event: TreeTableEvent) => {
                        const clickedCourriel = event.node.data as CourrielBureauOrdre;
                        selectedCourriels.some(courriel => courriel.id === clickedCourriel.id) ?
                            unselect(clickedCourriel) : select(clickedCourriel);
                    }}
                    rowClassName={(rowData) => {
                        var confidentialite = rowData.data.confidentialite;
                        if (confidentialite === 'TOP_CONFIDENTIEL') {
                            return { "bg-red-100": true };
                        } else if (confidentialite === 'CONFIDENTIEL') {
                            return { 'bg-orange-100': true };
                        } else {
                            return {};
                        }
                    }}
                >

                    <Column
                        resizeable={false}
                        style={{ width: '3rem' }}
                        header={<Checkbox
                            checked={selectedCourriels.length === (courriels?.content?.length ?? 0)}
                            onChange={e => e.checked ? setSelectedCourriels(courriels?.content ?? []) : setSelectedCourriels([])} />}
                        body={(node: TreeNode) => (
                            <Checkbox
                                checked={selectedCourriels.some(courriel => courriel.id === node.data.id)}
                                onChange={e => e.checked ? select(node.data) : unselect(node.data)} />
                        )} />
                    <Column
                        expander
                        field="sujet"
                        header={t('bo.data.sujet')}
                        className="w-15rem "
                        sortable
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        body={(rowData) => {
                            return (
                                <span>
                                    {rowData.data.etatAvancement === EtatAvancementCourriel.REJETE && <><Tooltip target=".pi" /><i className="pi pi-minus-circle " data-pr-tooltip={t('bo.tooltip.courrielRejeter')} style={{ marginRight: '0.5rem', fontSize: '1rem', color: 'var(--red-700)' }}></i></>}
                                    {rowData.data.etatAvancement === EtatAvancementCourriel.EN_ATTENTE && <><Tooltip target=".pi" /><i className="pi pi-send " data-pr-tooltip={t('bo.tooltip.enAttente')} style={{ marginRight: '0.5rem', fontSize: '1rem', color: 'var(--orange-400)', transform: 'scaleX(-1)' }}></i></>}
                                    {rowData.data.etatAvancement !== EtatAvancementCourriel.REJETE && rowData.data.etatAvancement !== EtatAvancementCourriel.EN_ATTENTE && rowData.label === 'pere' && rowData.data.type === "SORTANT" && <><Tooltip target=".pi" /><i className="pi pi-sign-out " data-pr-tooltip={t('bo.tooltip.sortant')} style={{ marginRight: '0.5rem', fontSize: '1rem', color: 'var(--blue-700)', transform: 'scaleX(-1)' }}></i></>}
                                    {rowData.label === 'pere' && rowData.data.type === "ENTRANT" && <><Tooltip target=".pi" /><i className="pi pi-sign-in" data-pr-tooltip={t('bo.tooltip.entrant')} style={{ marginRight: '0.5rem', fontSize: '1rem', color: 'green' }}></i></>}

                                    {rowData.label === 'Complement' && rowData.data.type === "ENTRANT" && <><Tooltip target=".pi" /><i className="pi pi-tags " data-pr-tooltip={t('bo.tooltip.complement')} style={{ marginRight: '0.5rem', fontSize: '1.5rem', color: 'slateblue', transform: 'scaleX(-1)' }}></i></>}
                                    {rowData.label === 'Complement' && rowData.data.type === "SORTANT" && <><Tooltip target=".pi" /><i className="pi pi-tags " data-pr-tooltip={t('bo.tooltip.complement')} style={{ marginRight: '0.5rem', fontSize: '1.5rem', color: 'slateblue' }}></i></>}

                                    {rowData.label === 'Reponse' && rowData.data.type === "ENTRANT" && <><Tooltip target=".pi" /><i className="pi pi-reply" data-pr-tooltip={t('bo.tooltip.reponse')} style={{ marginRight: '0.5rem', fontSize: '1.5rem', color: 'green' }}></i></>}
                                    {rowData.label === 'Reponse' && rowData.data.type === "SORTANT" && <><Tooltip target=".pi" /><i className="pi pi-reply" data-pr-tooltip={t('bo.tooltip.reponse')} style={{ marginRight: '0.5rem', fontSize: '1.5rem', color: 'green', transform: 'scaleX(-1)' }}></i></>}

                                    <span> {rowData.data.sujet}</span>
                                </span>
                            );
                        }} />

                    <Column
                        header={t('bo.data.expediteur')}
                        body={(rowData) => {
                            if (rowData.data.type === 'ENTRANT' && rowData.data.entiteExterne?.nom) {
                                return <span>{rowData.data.entiteExterne.nom}</span>;
                            } else if (rowData.data.type === 'SORTANT' && rowData.data.entiteInterne?.libelle) {
                                return <span>{rowData.data.entiteInterne.libelle}</span>;
                            }
                        }} />
                    <Column
                        header={t('bo.data.destinataire')}
                        body={(rowData) => {
                            if (rowData.data.type === 'SORTANT' && rowData.data.entiteExterne?.nom) {
                                return <span>{rowData.data.entiteExterne.nom}</span>;
                            } else if (rowData.data.type === 'ENTRANT' && rowData.data.entiteInterne?.libelle) {
                                return <span>{rowData.data.entiteInterne.libelle}</span>;
                            }
                        }} />
                    <Column
                        header={t('bo.data.voiEnvoi')}
                        field="voieEnvoi"
                        body={(rowData) => {
                            return <span>{VoieEnvoiOptions.filter((option) => option.value === rowData.data.voieEnvoi)[0].label}</span>;
                        }} />

                    <Column
                        header={t('bo.data.dateReception')}
                        body={(rowData) => new Date(rowData.data.dateReception).toLocaleDateString('fr-FR').replaceAll('/', '-')} />
                    <Column
                        header={t('bo.data.dateEcheance')}
                        body={(rowData) => {
                            let currentDate = new Date();
                            let dateEcheance = new Date(rowData.data.dateEcheance);
                            let day_in_milliseconds = 1000 * 60 * 60 * 24;
                            const icon = () => {
                                if (dateEcheance <= currentDate && rowData.data.etatAvancement === EtatAvancementCourriel.EN_ATTENTE) {

                                    return <><Tooltip target=".pi" /><i className="pi pi-exclamation-circle" data-pr-tooltip={t('bo.tooltip.echeanceDepassee')} style={{ color: 'red', fontSize: '1rem', fontWeight: 'bold' }}></i></>;
                                } else if (dateEcheance.valueOf() <= currentDate.valueOf() + day_in_milliseconds && rowData.data.etatAvancement === EtatAvancementCourriel.EN_ATTENTE) {
                                    return <><Tooltip target=".pi" /><i className="pi pi-exclamation-triangle" data-pr-tooltip={t('bo.tooltip.echeanceProche')} style={{ color: 'orange', fontSize: '1rem' }}></i></>;
                                } else {
                                    return (<></>
                                        // date countdown
                                        // <Badge value={Math.floor((dateEcheance.valueOf()-currentDate.valueOf())/day_in_milliseconds)}  style={{ fontSize: '1rem' }} />
                                    );
                                }
                            };
                            return <div className="flex flex-row  gap-1">
                                <span>{dateEcheance.toLocaleDateString('fr-FR').replaceAll('/', '-')}</span>
                                {icon()}
                            </div>;
                        }} />
                    <Column
                        header={t('bo.data.numeroCourriel')}
                        field="numeroCourriel"
                        body={(rowData) => rowData.data.numeroCourriel} />

                    <Column
                        header={t('bo.data.priorite')}
                        field="priorite"
                        body={(rowData) => {
                            return <>
                                <Tooltip target="#prioriteDropdown" />
                                <Dropdown
                                    id="prioriteDropdown"
                                    data-pr-tooltip={t('bo.tooltip.modifPriority')}
                                    className="w-8rem"
                                    style={{ border: 'none' }}
                                    value={rowData.data.priorite}
                                    options={[{ label: 'Haute', value: 'HAUTE' }, { label: 'Moyenne', value: 'MOYENNE' }, { label: 'Basse', value: 'BASSE' }]}
                                    valueTemplate={priorityTagTemplate}
                                    itemTemplate={priorityTagTemplate}
                                    onChange={(e) => updateCourrielPriority({ ...rowData.data, priorite: e.value as string })} /></>;
                        }} />
                    <Column
                        header={t('bo.data.etatAvancement')}
                        field="etatAvancement"
                        body={(rowData) => {
                            return courrielInterventionEtatAvancement(rowData.data);
                        }} />
                    <Column
                        header={t('bo.data.actions')}
                        field="Actions"
                        body={(rowData) => {
                            return <div>
                                <ViewCourrielBO courriel={rowData.data} refetchCourriels={refetchCourriels} showToast={showToast} />
                            </div>;
                        }} />
                </TreeTable>
                    <Paginator
                        first={(courriels?.number ?? 0) * (courriels?.size ?? 0)}
                        rows={courriels?.size}
                        totalRecords={courriels?.totalElements}
                        onPageChange={(e) => {
                            handlePageNumberChange(e.page);
                            setSelectedCourriels([]);
                        }}
                    />
                </>
            )}
            <Toast ref={toastRef} />

        </>
    );
};

export default CourrielsTree;