import axiosInstance from 'app/axiosInterceptor';
import { CourrielBureauOrdre } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import { IntervenantCourriel, StatutIntervention } from 'app/controller/model/BureauOrdre/IntervenantCourriel';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import React, { useEffect, useState } from 'react'
import { Divider } from 'primereact/divider';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import Intervention from './Intervention/Intervention';
import { useCourrielsContext } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsProvider';
import { useAnnotationContext } from 'app/component/admin/view/bureau-ordre/Providers/AnnotationProvider';
import { useQueryClient } from '@tanstack/react-query';
import InterventionAddFilesButton from './Intervention/InterventionAddFilesButton';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    selectedCourriel: CourrielBureauOrdre;
    toast: React.Ref<Toast>;
    disabled: boolean;
    t: TFunction;
    connectedUser: UtilisateurDto;
}

const AffectationCourriel = ({ toast, selectedCourriel, disabled, t }: Props) => {

    const {
        fetchCourriels,
        planClassementId,
    } = useCourrielsContext();

    const { connectedUser } = useConnectedUserStore();

    const { actions } = useAnnotationContext();

    const [showAffectation, setShowAffectation] = useState<boolean>(false);
    // Courriel 
    const [courriel, setCourriel] = useState<CourrielBureauOrdre>(new CourrielBureauOrdre());
    useEffect(() => {
        setCourriel(selectedCourriel);
    }, [selectedCourriel]);

    // Fetch departements
    const [departements, setDepartements] = useState<EntiteAdministrativeDto[]>([]);
    const [selectedDepartement, setSelectedDepartement] = useState<EntiteAdministrativeDto>();
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    useEffect(() => {
        entiteAdministrativeAdminService.getList().then(({ data }) => setDepartements(data)).catch(error => console.log(error));
    }, []);

    // add intervenant
    const [addIntervenantVisible, setAddIntervenantVisible] = useState<boolean>(false);
    const [newIntervenant, setNewIntervenant] = useState<IntervenantCourriel>(new IntervenantCourriel());
    const [addIntervenantLoading, setAddIntervenantLoading] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const saveCourriel = async () => {
        setAddIntervenantLoading(true);
        newIntervenant.statut = StatutIntervention.EN_COURS;
        newIntervenant.createdBy = connectedUser;
        return await axiosInstance.put(`${API_URL}/courriel/intervenants-courriel/add-intervenants/${courriel.id}`, newIntervenant)
            .then((res) => {
                MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
                emptyFields();
                setAddIntervenantVisible(false);
                queryClient.invalidateQueries({ queryKey: ['courriels'] });
                fetchCourriels(planClassementId);
                setCourriel(res.data);
                setAddIntervenantLoading(false);
            }).catch((err) => {
                console.log('err:', err);
                MessageService.showError(toast, t('error.error'), t("error.operation"));
                setAddIntervenantLoading(false);
            });

    }

    const emptyFields = () => {
        setNewIntervenant(new IntervenantCourriel());
        setSelectedDepartement(new EntiteAdministrativeDto());
    }

    const canAddNewAffectation = (): boolean => {
        let res: boolean = true;

        courriel?.intervenants?.forEach((intervention) => {
            if (intervention.statut !== StatutIntervention.CLOTURE && intervention.statut !== StatutIntervention.ANNULE) {
                res = false;
            }
        })

        return res;
    }

    const confirmRejectInterventionPopup = (e: any, intervenant: IntervenantCourriel) => {
        confirmPopup({
            target: e.currentTarget,
            message: t('bo.intervention.confirmationSuppression'),
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => rejectIntervention({ ...intervenant, intervenant: connectedUser }),
            reject: () => { }
        });
    }

    const rejectIntervention = async (intervenant: IntervenantCourriel) => {
        return await axiosInstance.put(`${API_URL}/courriel/intervenants-courriel/rejet/${courriel.id}`, intervenant)
            .then((res) => {
                MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
                fetchCourriels(planClassementId);
                setCourriel(res.data);
            }).catch((err) => {
                console.log('err:', err);
                MessageService.showError(toast, t('error.error'), t("error.operation"));
            });
    }

    // Form validation
    const isFormValid = (): boolean => {
        return newIntervenant.action !== "" && newIntervenant.responsables.length > 0 && !(!selectedDepartement || selectedDepartement?.code === '');
    }

    return (
        <>
            <Button disabled={disabled} label={t('bo.interventions')} icon="pi pi-check-square" className="p-button mr-2" onClick={() => setShowAffectation(true)} tooltip={t('bo.tooltip.interventions')} tooltipOptions={{ showOnDisabled: true, position: 'bottom' }} />
            <Dialog
                header={t('bo.interventions')}
                visible={showAffectation}
                style={{ width: 'fit-content' }}
                modal={true}
                onHide={() => setShowAffectation(false)}
            >
                {/* -----------------------------  intervenants view list --------------------------- */}

                <Intervention canUpdate={true} connectedUser={connectedUser} courriel={courriel} confirmRejectInterventionPopup={confirmRejectInterventionPopup} setCourriel={setCourriel} toast={toast} />

                {/* ----------------------------- add intervenant --------------------------- */}
                {
                    addIntervenantVisible
                    &&
                    <div className='card m-1 mb-3 mx-auto p-4 shadow-2 ' style={{width:"50vw"}}>
                        <div className="font-medium text-xl text-900 mb-3">{t("bo.intervention.ajouterIntervention")}</div>
                        <Divider />
                        <div className=" grid ">
                            <div className="flex flex-column field col-4">
                                <label htmlFor="departement">{t('Departement')}</label>
                                <Dropdown
                                    showClear
                                    id="departement"
                                    value={selectedDepartement}
                                    options={departements}
                                    placeholder={'Selectionner un departement'}
                                    onChange={(e) => {
                                        setSelectedDepartement(e.value);
                                        setNewIntervenant({ ...newIntervenant, responsables: [] });
                                    }}
                                    filter
                                    optionLabel="libelle" />
                                {!isFormValid() && (!selectedDepartement || selectedDepartement?.code === '') && <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>

                            <div className="flex flex-column field col-4">
                                <label htmlFor="intervenants">{t('bo.intervention.Responsable')}</label>
                                <MultiSelect
                                    id="intervenants"
                                    value={newIntervenant?.responsables}
                                    options={selectedDepartement?.utilisateurs}
                                    placeholder={t("selectionner des intervenants")}
                                    filter
                                    optionLabel="nom"
                                    multiple
                                    disabled={selectedDepartement === null}
                                    onChange={(e) => setNewIntervenant({ ...newIntervenant, responsables: e.value })}
                                />
                                {!isFormValid() && newIntervenant.responsables.length === 0 && <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>
                            <div className="flex flex-column field col-4">
                                <label htmlFor="action">{t('bo.intervention.action')}</label>
                                <Dropdown
                                    id="action"
                                    value={newIntervenant?.action}
                                    options={actions.map(action => ({ label: action, value: action }))}
                                    onChange={(e) => setNewIntervenant({ ...newIntervenant, action: e.value })}
                                />
                                {!isFormValid() && newIntervenant.action === "" && <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>
                            <div >
                                <InterventionAddFilesButton courrier={courriel} addedDocuments={newIntervenant.documents} setAddedDocuments={(docs) => setNewIntervenant({ ...newIntervenant, documents: docs })} />
                            </div>
                        </div>

                        <div className="flex justify-content-end">
                            <Button
                                disabled={!isFormValid() || addIntervenantLoading}
                                label={t('add')}
                                icon={addIntervenantLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                className="p-button-text"
                                onClick={saveCourriel}
                            />
                        </div>
                    </div>
                }
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {
                        canAddNewAffectation() &&
                        <Button
                            icon={addIntervenantVisible ? "pi pi-minus" : "pi pi-plus"}
                            className={addIntervenantVisible ? "p-button-danger" : "p-button-success"}
                            style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }}
                            onClick={() => {
                                setAddIntervenantVisible(!addIntervenantVisible);
                                emptyFields();
                            }}
                        />
                    }
                </div>

            </Dialog>
            <ConfirmPopup />
        </>
    )
}

export default AffectationCourriel