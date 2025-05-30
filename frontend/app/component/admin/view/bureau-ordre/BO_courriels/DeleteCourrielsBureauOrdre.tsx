import { ConfirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import React from "react";
import { confirmPopup } from "primereact/confirmpopup";
import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import axiosInstance from "app/axiosInterceptor";
import { Toast } from "primereact/toast";
import { MessageService } from "app/zynerator/service/MessageService";
import { TFunction } from "i18next";
import { useQueryClient } from "@tanstack/react-query";

const COURRIELS_URL = process.env.NEXT_PUBLIC_COURRIEL_URL as string;

type Props = {
    setSelectedCourriels: (courriels: CourrielBureauOrdre[]) => void;
    selectedCourriels: CourrielBureauOrdre[];
    planClassementId: number;
    refetchCourriels: (planClassementId: number) => void;
    showToast: React.Ref<Toast>;
    t:TFunction;
}

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const DeleteCourrielsBureauOrdre = (
    {setSelectedCourriels, selectedCourriels, planClassementId, refetchCourriels, showToast,t}: Props
) => {

    const queryClient = useQueryClient();
    const deleteCourriel = async (id: number) => {
        axiosInstance.delete(`${COURRIELS_URL}${id}`).then((res) => {
            queryClient.invalidateQueries({queryKey: ['courriels']});
            MessageService.showSuccess(showToast, t('success.success'),t("success.operation"));
            refetchCourriels(planClassementId);
        }).catch((err) => {
            console.log('courriel not deleted err:', err);
            MessageService.showError(showToast, t('error.error'),t("error.operation"));
        });
    }

    const deleteMultipleCourriels = async (courriels: CourrielBureauOrdre[]) => {
        courriels.forEach(async (courriel) => {
            await deleteCourriel(courriel.id as number);
        });
        setSelectedCourriels([]);
    }

    return (
        <>
        <ConfirmPopup />
        <Button disabled={selectedCourriels.length === 0} label={t('delete')} icon="pi pi-trash" className="p-button-danger mr-2"
            onClick={(e) => confirmPopup({
                target: e.currentTarget,
                message: 'Are you sure you want to delete the selected courriels?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteMultipleCourriels(selectedCourriels),
                acceptClassName: 'p-button-danger',
                rejectClassName: 'p-button-secondary'
            })} />
        </>
    );
}

export default DeleteCourrielsBureauOrdre;