import axiosInstance from "app/axiosInterceptor";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import { t } from "i18next";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface EditPlanBODialogProps {
    visible: boolean;
    onClose: () => void;
    refreshPlans: () => void;
    parentPlanKey: number;
    showToast: (severity: SeverityType, summary: string) => void;
}

const EditPlanClassementBO = (props: EditPlanBODialogProps) => {
    const [plans, setPlans] = useState<PlanClassementBO[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<PlanClassementBO>();

    const [editedPlanClassement, setEditedPlanClassement] = useState<PlanClassementBO>(new PlanClassementBO());

    useEffect(() => {
        axiosInstance.get<PlanClassementBO[]>(`${API_URL}/plan-classement-bo`)
            .then(response => setPlans(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, []);
    useEffect(() => {
        if (selectedPlan) {
            setEditedPlanClassement({
                id: selectedPlan.id,
                code: selectedPlan.code,
                libelle: selectedPlan.libelle,
                description: selectedPlan.description,
                parentId: selectedPlan.parentId || null,
                children: selectedPlan.children,
            });
        }
    }, [selectedPlan]);
    useEffect(() => {
        const defaultPlan = plans.find((plan) => plan.id === Number(props.parentPlanKey));
        if (defaultPlan) {
            setSelectedPlan(defaultPlan);
        }
    }, [props.parentPlanKey, plans]);

    const saveItem = () => {
        axiosInstance.put(`${API_URL}/plan-classement-bo`, editedPlanClassement)
            .then(response => {
                props.showToast('success', t('success.classificationPlanUpdated'));
                props.refreshPlans();
                props.onClose();
            }).catch(error => {
                console.error('Error updating plan', error);
                props.showToast('error', t("error.canNotUpdateClassementPlan"));
            });
    };

    const itemDialogFooter = (
        <>
            <Button raised label={t("cancel")} icon="pi pi-times" text onClick={props.onClose} />
            <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} />
        </>
    );
    return (
        <Dialog
            visible={props.visible}
            closeOnEscape
            style={{ width: '50vw' }}
            header={t("document.planClassementDetails")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={props.onClose}
        >
            <TabView activeIndex={0} onTabChange={() => { }}>
                <TabPanel header={t("document.planClassementDetails")} >
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("document.libelle")}</label>
                            <InputText
                                id="libelle"
                                value={editedPlanClassement.libelle || ''}
                                onChange={(e) => setEditedPlanClassement({ ...editedPlanClassement, libelle: e.target.value })}
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="selectedPlan">code</label>
                            <InputText
                                id="code"
                                value={selectedPlan?.code || ''}
                                disabled
                            />
                        </div>
                        <div className="field col">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                rows={5}
                                cols={30}
                                value={editedPlanClassement.description || ''}
                                onChange={(e) => setEditedPlanClassement({ ...editedPlanClassement, description: e.target.value })}
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default EditPlanClassementBO;

type SeverityType = 'success' | 'info' | 'warn' | 'error';