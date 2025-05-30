import axiosInstance from "app/axiosInterceptor";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface AddPlanBODialogProps {
    visible: boolean;
    onClose: () => void;
    refreshPlans: () => void;
    parentPlanKey: number;
    showToast: (severity: SeverityType, summary: string) => void;
}

const AddPlanBODialog = (props: AddPlanBODialogProps) => {
    const { t } = useTranslation();

    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [newPlanClassement, setNewPlanClassement] = useState({
        code: '',
        libelle: '',
        description: '',
        parentId: null,
    });

    useEffect(() => {
        axiosInstance.get<PlanClassementBO[]>(`${API_URL}/plan-classement-bo`)
            .then(response => setPlans(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, []);

    useEffect(() => {
        const defaultPlan = plans.find((plan) => plan.id === Number(props.parentPlanKey));
        if (defaultPlan) {
            setSelectedPlan(defaultPlan);
        }
    }, [props.parentPlanKey, plans]);

    const saveItem = () => {
        let newItemToSave: PlanClassementBO = {
            id: null,
            code: newPlanClassement.code,
            libelle: newPlanClassement.libelle,
            description: newPlanClassement.description,
            parentId: null,
            children: [],
        };
        if (selectedPlan) {
            newItemToSave.parentId = selectedPlan.id;
        }

        axiosInstance.post(`${API_URL}/plan-classement-bo`, newItemToSave)
            .then(response => {
                props.showToast('success', t('success.classificationPlanAdded'));
                props.refreshPlans();
                props.onClose();
            })
            .catch(error => {
                console.error('Error adding plan', error);
                props.showToast('error', t("error.canNotAddClassementPlan"));
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
            header={t("document.addNewClassementPlan")}
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
                                value={newPlanClassement.libelle}
                                onChange={(e) => setNewPlanClassement({ ...newPlanClassement, libelle: e.target.value })}
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="selectedPlan">{t("document.superiorClassementPlan")}</label>
                            <Dropdown
                                id="selectedPlanDropdown"
                                value={selectedPlan}
                                options={plans.map(plan => ({ label: plan.libelle, value: plan }))}
                                onChange={(e) => setSelectedPlan(e.value)}
                                placeholder={t("document.superiorClassementPlan")}
                                optionLabel="label"
                                showClear
                            />
                        </div>
                        <div className="field col">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                rows={5}
                                cols={30}
                                value={newPlanClassement.description}
                                onChange={(e) => setNewPlanClassement({ ...newPlanClassement, description: e.target.value })}
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default AddPlanBODialog;

type SeverityType = 'success' | 'info' | 'warn' | 'error';