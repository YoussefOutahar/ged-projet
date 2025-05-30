import axiosInstance from 'app/axiosInterceptor';
import { CourrielBureauOrdre, EtatAvancementCourriel } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import { RegistreDto } from 'app/controller/model/BureauOrdre/Registre';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import React, { useEffect, useState } from 'react'
import GeneratedNumeroCourrielPopup from './GeneratedNumeroCourrielPopup';
import { useCourrielSelectionContext } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsSelectionProvider';
import { set } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    selectedCourriel: CourrielBureauOrdre;
    disabled: boolean;
    toastRef: React.Ref<Toast>;
    t: TFunction;
    refetchCourriels: (planClassementId: number) => void;
    planClassementId: number;
    registres: RegistreDto[];
}

const EnvoyerCourrielBO = ({ t, selectedCourriel, disabled, toastRef, refetchCourriels, planClassementId, registres }: Props) => {
    const [courriel, setCourriel] = useState<CourrielBureauOrdre>(new CourrielBureauOrdre());
    useEffect(() => {
        setCourriel(selectedCourriel);
    }, [selectedCourriel]);

    const [visible, setVisible] = useState<boolean>(false);

    const {setSelectedCourriels} = useCourrielSelectionContext();

    const queryClient = useQueryClient();
    const updateCourriel = async () => {
        await axiosInstance.put(`${API_URL}/courriels/${courriel.id}`, courriel).then((res) => {
            queryClient.invalidateQueries({queryKey: ['courriels','courrielsNearDeadline']});
            if (courriel.etatAvancement === EtatAvancementCourriel.EN_COURS) {
                displayGeneratedNumeroCourriel(res.data.numeroCourriel);
            }
            setCourriel(new CourrielBureauOrdre())
            setSelectedCourriels([]);
            refetchCourriels(planClassementId);
            setVisible(false);
            MessageService.showSuccess(toastRef, t('success.success'), t("success.operation"));
        }).catch((err) => {
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
        });
    }

    const envoyerCourriel = async () => {
        courriel.etatAvancement = EtatAvancementCourriel.EN_COURS;
        updateCourriel();
    }
    const rejeterCourriel = async () => {
        courriel.etatAvancement = EtatAvancementCourriel.REJETE;
        courriel.numeroRegistre = "";
        updateCourriel();
    }

    const confirmRejectCourrielPopup = (e: any) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Voulez-vous vraiment rejeter ce courriel ?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => rejeterCourriel(),
            reject: () => { }
        });
    }

    //Form validation

    const isFormValid = () => {
        return courriel?.numeroRegistre?.trim().length > 0;
    }

    // Display the generated numero courriel at the end of the process
    const [generatedNumeroCourriel, setGeneratedNumeroCourriel] = useState<string>("");
    const [showNumeroCourrielDialog, setShowNumeroCourrielDialog] = useState<boolean>(false);

    const displayGeneratedNumeroCourriel = (numeroCourriel: string) => {
        setGeneratedNumeroCourriel(numeroCourriel);
        setShowNumeroCourrielDialog(true);
    }

    return (
        <>
            <Button
                className='mr-2'
                disabled={disabled}
                raised
                label={t("bo.envoyer")}
                icon="pi pi-send"
                tooltip={t('bo.tooltip.envoyerSortant')}
                tooltipOptions={{ position: 'bottom', showOnDisabled: true }}
                onClick={() => setVisible(true)}
            />
            <Dialog
                header={t("bo.envoyerUnCourriel")}
                visible={visible}
                style={{ width: '45vw' }}
                onHide={() => setVisible(false)}
                footer={
                    <div>
                        <Button label={t("cancel")} severity='secondary' onClick={() => setVisible(false)} tooltip={t('bo.tooltip.annulerOperation')} tooltipOptions={{ position: 'bottom' }} />
                        <Button className='ml-4' label={t("reject")} icon="pi pi-minus-circle" severity='danger' onClick={(e) => confirmRejectCourrielPopup(e)} />
                        <Button disabled={!isFormValid()} label={t("bo.envoyer")} icon='pi pi-send' onClick={() => envoyerCourriel()} />
                    </div>
                }
            >
                <div className='flex gap-3'>


                    <div className='flex flex-column gap-1 '>
                        <label htmlFor="registre">{t("bo.registre.registre")}</label>
                        <Dropdown
                            id="registre"
                            className='w-15rem'
                            value={courriel?.numeroRegistre}
                            options={registres.map(registre => ({ label: registre.libelle, value: registre.numero }))}
                            onChange={(e) => setCourriel({ ...courriel, numeroRegistre: e.value })}
                        />
                        {!isFormValid() && courriel?.numeroRegistre?.trim().length === 0 && <small className="text-red-500">*{t("requiredField")}</small>}
                    </div>

                </div>
            </Dialog>
            <ConfirmPopup />
            <GeneratedNumeroCourrielPopup
                visible={showNumeroCourrielDialog}
                generatedNumeroCourriel={generatedNumeroCourriel}
                cancelNumeroCourrielDialog={() => {
                    setGeneratedNumeroCourriel("");
                    setShowNumeroCourrielDialog(false);
                }}
            />
        </>
    )
}

export default EnvoyerCourrielBO