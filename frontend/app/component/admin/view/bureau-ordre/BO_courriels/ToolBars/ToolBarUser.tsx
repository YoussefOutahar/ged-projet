import DeleteCourrielsBureauOrdre from "app/component/admin/view/bureau-ordre/BO_courriels/DeleteCourrielsBureauOrdre";
import UpdateCourrielsBureauOrdre from "app/component/admin/view/bureau-ordre/BO_courriels/UpdateCourrielsBureauOrdre";
import { useCourrielsContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsProvider";
import { CourrielBureauOrdre, TypeCourriel } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { TFunction } from "i18next";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useEtablissementsBOContext } from "app/component/admin/view/bureau-ordre/Providers/EtablissementProvider";
import AffectationCourriel from "app/component/admin/view/bureau-ordre/BO_courriels/AffectationCourriel";
import { useCourrielSelectionContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsSelectionProvider";
import { useCourrielCreationContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsCreationProvider";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import DemarerWF from "app/component/admin/view/bureau-ordre/BO_courriels/BO_TO_WF";

interface Props {
    t: TFunction;
    toastRef: React.Ref<Toast>;
}

const CourrielToolBarUser = ({ t, toastRef }: Props) => {
    const { loadingCourriels, errorCourriels, planClassementId, fetchCourriels } = useCourrielsContext();
    const { selectedCourriels, setSelectedCourriels } = useCourrielSelectionContext();
    const { setTypeCourriel, setOperationType, setShowCreateCourriel } = useCourrielCreationContext();
    const { EtablissementsBO } = useEtablissementsBOContext();
    const { connectedUser } = useConnectedUserStore();

    const openCreateCourriel = (type: TypeCourriel) => {
        setTypeCourriel(type);
        setOperationType('');
        setShowCreateCourriel(true);
    }

    const openComplementCourriel = (courrielPere: CourrielBureauOrdre) => {
        setTypeCourriel(selectedCourriels[0].type || TypeCourriel.ENTRANT);
        setOperationType("Complement");
        setShowCreateCourriel(true);
    }

    const openResponseCourriel = (courrielPere: CourrielBureauOrdre) => {
        let typePere: TypeCourriel | null = selectedCourriels[0].type;
        if (typePere === TypeCourriel.ENTRANT) {
            setTypeCourriel(TypeCourriel.SORTANT);
        } else if (typePere === TypeCourriel.SORTANT) {
            setTypeCourriel(TypeCourriel.ENTRANT);
        }
        setOperationType("Reponse");
        setShowCreateCourriel(true);
    }

    return (
        <Toolbar className="mb-4"
            style={{ opacity: loadingCourriels || errorCourriels ? 0.5 : 1, pointerEvents: loadingCourriels || errorCourriels ? 'none' : 'auto' }}
            start={() => {
                return (
                    <React.Fragment>
                        <Button raised label={t("bo.envoyerUnCourriel")} icon="pi pi-send" className='mr-2' onClick={() => openCreateCourriel(TypeCourriel.SORTANT)} tooltip={t('bo.tooltip.envoyerVersBO')} tooltipOptions={{ showOnDisabled: true, position: 'bottom' }} />

                        <Button className='mr-2' disabled={selectedCourriels.length !== 1 || selectedCourriels[0]?.complement !== null} raised label={t("bo.complement")} icon="pi pi-tags" onClick={() => openComplementCourriel(selectedCourriels[0])} tooltip={t('bo.tooltip.addComplement')} tooltipOptions={{ showOnDisabled: true, position: 'bottom' }} />
                        <Button className='mr-2' disabled={selectedCourriels.length !== 1 || selectedCourriels[0]?.reponse !== null} raised label={t("bo.reponse")} icon="pi pi-reply" onClick={() => openResponseCourriel(selectedCourriels[0])} tooltip={t('bo.tooltip.addReponse')} tooltipOptions={{ showOnDisabled: true, position: 'bottom' }} />

                        <AffectationCourriel connectedUser={connectedUser!} t={t} disabled={selectedCourriels.length !== 1} toast={toastRef} selectedCourriel={selectedCourriels[0]} />
                        <DemarerWF selectedCourriel={selectedCourriels[0]} disabled={selectedCourriels.length !== 1} toastRef={toastRef} t={t} />
                    </React.Fragment>
                )
            }}
            end={() => {
                return (
                    <React.Fragment>
                        <UpdateCourrielsBureauOrdre disabled={selectedCourriels.length !== 1} t={t} listEtablissementBO={EtablissementsBO} showToast={toastRef} planClassementId={Number(planClassementId)} refetchCourriels={fetchCourriels} selectedCourriel={selectedCourriels[0]} />
                        <DeleteCourrielsBureauOrdre t={t} showToast={toastRef} planClassementId={Number(planClassementId)} refetchCourriels={fetchCourriels} selectedCourriels={selectedCourriels} setSelectedCourriels={setSelectedCourriels} />
                    </React.Fragment>
                )
            }}>

        </Toolbar>
    );
}

export default CourrielToolBarUser;