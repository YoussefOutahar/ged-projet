import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre'
import axios from 'axios';
import { Button } from 'primereact/button';
import React from 'react'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { MessageService } from 'app/zynerator/service/MessageService';
import { TFunction } from 'i18next';

const ETABLISSEMENT_URL = process.env.NEXT_PUBLIC_ETABLISSEMENT_URL as string;

type Props = {
    selectedEtablissements: EtablissementBureauOrdre[];
    setSelectedEtablissements: (etablissements: EtablissementBureauOrdre[]) => void;
    refetchEtablissements: () => void;
    showToast: React.Ref<any>;
    t: TFunction;
}

const DeleteEtablissementBureauOrdre = ({ t, showToast, setSelectedEtablissements, selectedEtablissements, refetchEtablissements }: Props) => {

    const deleteEtablissement = async (id: number) => {

        return await axios.delete(`${ETABLISSEMENT_URL}${id}`).then((res) => {
            MessageService.showSuccess(showToast, t('success.success'), t("success.operation"));
            setSelectedEtablissements([]);
            refetchEtablissements();

        }).catch((err) => {
            MessageService.showError(showToast, t('error.error'), t("error.operation"));
        });
    }

    const deleteMultipleEtablissements = async (etablissements: EtablissementBureauOrdre[]) => {
        etablissements.forEach(async (etablissement) => {
            await deleteEtablissement(etablissement.id as number);
        });
    }
    return (
        <>
            <ConfirmPopup />
            <Button disabled={selectedEtablissements.length === 0} label="Suppression" icon="pi pi-trash" className="p-button-danger"
                onClick={(e) => confirmPopup({
                    target: e.currentTarget,
                    message: 'Are you sure you want to delete the selected etablissements?',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => deleteMultipleEtablissements(selectedEtablissements),
                    acceptClassName: 'p-button-danger',
                    rejectClassName: 'p-button-secondary'
                })}

            />
        </>
    )
}

export default DeleteEtablissementBureauOrdre