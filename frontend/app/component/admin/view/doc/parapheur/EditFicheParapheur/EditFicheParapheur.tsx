import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { fetchCertificateData, fetchSignersData, regenerateFicheParapheur } from "./api";
import CertificateDataSection from "./CertificateDataSection";
import SignersDataSection from "./SignersDataSection";
import { useTranslation } from "react-i18next";

type Props = {
    parapheur: ParapheurDto;
}

const EditFicheParapheur: React.FC<Props> = ({ parapheur }) => {
    const { t } = useTranslation();

    const queryClient = useQueryClient();
    const toast = useRef<Toast>(null);

    const [displayDialog, setDisplayDialog] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const certificateDataQueryKey = ['certificateData', parapheur.id];
    const signersDataQueryKey = ['signersData', parapheur.id];

    const { data: certificateData, isLoading: isCertificateDataLoading } = useQuery<ParapheurCertificateDataDTO[], Error>({
        queryKey: certificateDataQueryKey,
        queryFn: () => fetchCertificateData(parapheur.id),
        enabled: displayDialog,
    });

    const { data: signersData, isLoading: isSignersDataLoading } = useQuery<ParapheurSignersDataDTO[], Error>({
        queryKey: signersDataQueryKey,
        queryFn: () => fetchSignersData(parapheur.id),
        enabled: displayDialog,
    });

    const regenerateFicheParapheurMutation = useMutation({
        mutationFn: (forceRegen: boolean) => regenerateFicheParapheur(parapheur.id, forceRegen),
        onMutate: () => {
            setIsRegenerating(true);
        },
        onSuccess: (_, useDataExtraction) => {
            queryClient.invalidateQueries({ queryKey: certificateDataQueryKey });
            queryClient.invalidateQueries({ queryKey: signersDataQueryKey });
            setDisplayDialog(false);
            toast.current?.show({ 
                severity: 'success', 
                summary: t("parapheur.editParapheur.success"), 
                detail: useDataExtraction 
                    ? t("parapheur.editParapheur.automaticRegenerationSuccess")
                    : t("parapheur.editParapheur.manualRegenerationSuccess")
            });

            if(!useDataExtraction) window.location.reload(); 
        },
        onError: (error, useDataExtraction) => {
            console.error(t("parapheur.editParapheur.error"), error);
            toast.current?.show({ 
                severity: 'error', 
                summary: t("parapheur.editParapheur.error"), 
                detail: useDataExtraction 
                    ? t("parapheur.editParapheur.automaticRegenerationError")
                    : t("parapheur.editParapheur.manualRegenerationError")
            });
        },
        onSettled: () => {
            setIsRegenerating(false);
        }
    });

    const confirmRegenerate = (forceRegen: boolean) => {
        confirmDialog({
            message: forceRegen 
                ? t("parapheur.editParapheur.confirmAutomaticRegeneration")
                : t("parapheur.editParapheur.confirmManualRegeneration"),
            header: t("parapheur.editParapheur.regenerationConfirmation"),
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                regenerateFicheParapheurMutation.mutate(forceRegen);
                if (forceRegen) {
                    setDisplayDialog(false);
                    toast.current?.show({ 
                        severity: 'info', 
                        summary: t("parapheur.editParapheur.information"), 
                        detail: t("parapheur.editParapheur.automaticRegenerationStarted") 
                    });
                }
            },
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <Button
                icon="pi pi-file-edit"
                className='bg-orange-600 border-white font-bold text-lg'
                rounded
                tooltip={t("parapheur.editParapheur.editFicheParapheur")}
                onClick={() => setDisplayDialog(true)}
                disabled={parapheur.parapheurEtat.toLowerCase() === "termine"}
            />
            <Dialog
                header={t("parapheur.editParapheur.editFicheParapheur")}
                visible={displayDialog}
                style={{ width: '90vw' }}
                onHide={() => setDisplayDialog(false)}
                onClick={(e) => e.stopPropagation()}
                footer={
                    <div>
                        <Button label={t("parapheur.editParapheur.cancel")} icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-text" />
                        <Button label={t("parapheur.editParapheur.restoreDefaultValues")} icon="pi pi-refresh" onClick={() => confirmRegenerate(true)} className="p-button-warning" />
                        <Button label={t("parapheur.editParapheur.modifyValues")} icon="pi pi-sync" onClick={() => confirmRegenerate(false)} className="p-button-info ml-2" />
                    </div>
                }
            >
                {isRegenerating ? (
                    <div className="flex flex-column align-items-center justify-content-center">
                        <ProgressSpinner />
                        <p className="text-center mt-4">
                            {t("parapheur.editParapheur.regenerationInProgress")}<br />
                            {t("parapheur.editParapheur.pleaseWait")}
                        </p>
                    </div>
                ) : (
                    <TabView>
                        <TabPanel header={t("parapheur.editParapheur.certificateData")}>
                            <Card>
                                <CertificateDataSection
                                    parapheurId={parapheur.id}
                                    certificateData={certificateData}
                                    isLoading={isCertificateDataLoading}
                                />
                            </Card>
                        </TabPanel>
                        <TabPanel header={t("parapheur.editParapheur.signersData")}>
                            <SignersDataSection
                                parapheur={parapheur}
                                signersData={signersData}
                                isLoading={isSignersDataLoading}
                            />
                        </TabPanel>
                    </TabView>
                )}
            </Dialog>
            <ConfirmDialog />
        </>
    );
};

export default EditFicheParapheur;