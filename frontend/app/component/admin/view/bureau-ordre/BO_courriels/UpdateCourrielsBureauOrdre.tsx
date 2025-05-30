import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { CourrielBureauOrdre, EtatAvancementCourrielOptions, PrioriteCourrielOptions, VoieEnvoiOptions } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import axiosInstance from "app/axiosInterceptor";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { EtablissementBureauOrdre } from "app/controller/model/BureauOrdre/EtablissementBureauOrdre";
import { TFunction } from "i18next";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { EntiteAdministrativeDto } from "app/controller/model/EntiteAdministrative.model";
import { EntiteAdministrativeAdminService } from "app/controller/service/admin/EntiteAdministrativeAdminService.service";
import { UtilisateurAdminService } from "app/controller/service/admin/UtilisateurAdminService.service";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { MessageService } from "app/zynerator/service/MessageService";
import { Toast } from "primereact/toast";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";


const COURRIELS_URL = process.env.NEXT_PUBLIC_COURRIEL_URL as string;

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    disabled: boolean;
    t: TFunction;
    selectedCourriel: CourrielBureauOrdre;
    listEtablissementBO: EtablissementBureauOrdre[];
    planClassementId: number;
    refetchCourriels: (planClassementId: number) => void;
    showToast: React.Ref<Toast>,
    isResponsable?: boolean;

}

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const UpdateCourrielsBureauOrdre = ({ disabled, t, listEtablissementBO, selectedCourriel, planClassementId, refetchCourriels, showToast, isResponsable = false }: Props) => {

    const [showDialog, setShowDialog] = useState(false);
    const [entiteAdministratives, setEntiteAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    const [planClassement, setPlanClassement] = useState<PlanClassementBO[]>([]);

    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();

    const formik = useFormik({
        initialValues: new CourrielBureauOrdre(),
        onSubmit: async (values) => {
            return await axiosInstance.put(`${COURRIELS_URL}${values.id}`, values).then((res) => {
                MessageService.showSuccess(showToast, t('success.success'), t("success.operation"));
                refetchCourriels(planClassementId);
                formik.resetForm();
                setShowDialog(false);
            }).catch((err) => {
                console.log('courriel not updated err:', err);
                MessageService.showError(showToast, t('error.error'), t("error.operation"));
            });

        },
    })

    useEffect(() => {
        if (selectedCourriel) {
            formik.setValues(selectedCourriel);
        }
    }, [selectedCourriel]);

    useEffect(() => {
        entiteAdministrativeAdminService.getList()
            .then(({ data }) => {
                setEntiteAdministratives(data)
            })
            .catch(error => console.log(error));

        axiosInstance.get<PlanClassementBO[]>(`${API_URL}/plan-classement-bo`).then((res) => {
            setPlanClassement(res.data);
        }).catch((err) => {
            console.log(err)
        });
    }, []);

    // Form validation

    const isFormValid = () => {
        return formik.values.entiteExterne && formik.values.entiteInterne && formik.values.sujet && formik.values.planClassement && formik.values.dateReception && formik.values.dateEcheance;
    }

    return (
        <>
            <Button className='mr-2 hover:bg-blue-700' disabled={disabled} icon="pi pi-pencil" label={t("update")} onClick={() => setShowDialog(true)} />
            <Dialog
                header={t("update") + " " + t("bo.courriel")}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                modal
                closeOnEscape
                style={{ width: '70vw' }}
                className="p-fluid"
                footer={
                    <div className="flex flex-row justify-content-end">
                        <Button className="hover:bg-red-700" label={t("cancel")} onClick={() => setShowDialog(false)} />
                        <Button className="hover:bg-blue-700" type="submit" disabled={!isFormValid()} label={t("save")} onClick={() => {
                            formik.handleSubmit();
                        }} />
                    </div>
                }
            >
                <div className="flex flex-column gap-3 mr-3">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="entiteExterne">{selectedCourriel?.type === "ENTRANT" ? t('bo.data.expediteur') : t('bo.data.destinataire')}</label>
                            <Dropdown
                                id="entiteExterne"
                                value={formik.values.entiteExterne}
                                options={listEtablissementBO.map((etab) => ({ label: etab.nom, value: etab }))}
                                onChange={(e) => formik.setFieldValue('entiteExterne', e.value)}
                                filter
                            />
                            {!isFormValid() && !formik.values.entiteExterne && <small className="text-red-500">{t('requiredField')}</small>}
                        </div>
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="entiteAdministrativeDropdown">{selectedCourriel?.type === "ENTRANT" ? t('bo.data.destinataire') : t('bo.data.expediteur')}</label>
                            <Dropdown showClear id="entiteAdministrativeDropdown"
                                value={formik.values.entiteInterne}
                                options={entiteAdministratives.map((entite) => ({ label: entite.libelle, value: entite }))}
                                onChange={(e) => {
                                    formik.setFieldValue('entiteInterne', e.value)
                                }}
                                filter
                            />
                            {!isFormValid() && !formik.values.entiteInterne && <small className="text-red-500">*{t('requiredField')}</small>}

                        </div>
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="voieEnvoi">{t("bo.data.voiEnvoi")}</label>
                            <Dropdown
                                id="voieEnvoi"
                                value={formik.values.voieEnvoi}
                                options={VoieEnvoiOptions}
                                onChange={(e) => formik.setFieldValue('voieEnvoi', e.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="sujet">{t("bo.data.sujet")}</label>
                            <InputText
                                id="sujet"
                                name="sujet"
                                value={formik.values.sujet}
                                onChange={formik.handleChange}
                            />
                            {!isFormValid() && !formik.values.sujet && <small className="text-red-500">*{t('requiredField')}</small>}
                        </div>

                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="priorite">{t("bo.data.priorite")}</label>
                            <Dropdown
                                id="priorite"
                                value={formik.values.priorite}
                                options={PrioriteCourrielOptions}
                                placeholder={t("Priorite")}
                                onChange={(e) => formik.setFieldValue('priorite', e.value)}
                                filter
                            />
                        </div>
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="planClassement">{t("bo.planClassement")}</label>
                            <Dropdown
                                id="planClassement"
                                value={formik.values.planClassement}
                                options={planClassement.map((plan) => ({ label: plan.libelle, value: plan }))}
                                onChange={(e) => formik.setFieldValue('planClassement', e.value)}
                                filter
                            />
                            {!isFormValid() && !formik.values.planClassement && <small className="text-red-500">*{t('requiredField')}</small>}
                        </div>

                    </div>

                    <div className="flex flex-row gap-3">
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="dateReception">{t("bo.data.dateReception")}</label>

                            <Calendar
                                id="dateReception"
                                value={new Date(formik.values.dateReception)}
                                onChange={(e) => { formik.setFieldValue('dateReception', e.value as string) }}

                                dateFormat="yy/mm/dd"
                                showIcon={true}
                            />
                            {!isFormValid() && !formik.values.dateReception && <small className="text-red-500">*{t('requiredField')}</small>}
                        </div>
                        <div className="flex flex-column gap-1 col-4">
                            <label htmlFor="dateEcheance">{t("bo.data.dateEcheance")}</label>
                            <Calendar
                                id="dateEcheance"
                                value={new Date(formik.values.dateEcheance)}

                                dateFormat="yy/mm/dd"
                                onChange={(e) => {
                                    formik.setFieldValue('dateEcheance', e.value as string)
                                }}
                                showIcon={true}
                            />
                            {!isFormValid() && !formik.values.dateEcheance && <small className="text-red-500">*{t('requiredField')}</small>}
                        </div>
                    </div>

                    <div className="flex flex-row gap-3">


                    </div>

                </div>
            </Dialog>
        </>
    );
}

export default UpdateCourrielsBureauOrdre;