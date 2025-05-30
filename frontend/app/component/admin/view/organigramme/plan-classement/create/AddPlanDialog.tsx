import axiosInstance from 'app/axiosInterceptor';
import { PlanClassementType } from 'app/controller/model/PlanClassement.model';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddPlanDialogProps {
    visible: boolean;
    onClose: () => void;
    refreshPlans: (parentId: number) => void;
    selectedPlanKey: string;
    showToast: (severity: SeverityType, summary: string) => void;
}

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const AddPlanDialog: React.FC<AddPlanDialogProps> = ({ visible, onClose, refreshPlans, selectedPlanKey, showToast  }) => {
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [newItem, setNewItem] = useState({
        code: '',
        libelle: '',
        description: '',
        parentId: null,
        archive: false,
        archiveIntermidiaireDuree: null,
        archiveFinalDuree: null,
        archivageType: PlanClassementType.ArchivageType.FINALE,
    });
    const { t } = useTranslation();

    useEffect(() => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list`)
            .then(response => setPlans(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, []);

    useEffect(() => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/id/${selectedPlanKey}`)
            .then(response => setSelectedPlan(response.data))
            .catch(error => console.error('Error loading plans', error));
    }, [selectedPlanKey]);

    useEffect(() => {
        const defaultPlan = plans.find((plan) => plan.id === Number(selectedPlanKey));
        if (defaultPlan) {
            setSelectedPlan(defaultPlan);
        }
    }, [selectedPlanKey, plans]);

    const saveItem = () => {
        const newItemToSave = {
            code: newItem.code,
            libelle: newItem.libelle,
            description: newItem.description,
            parentId: selectedPlanKey,
            archiveIntermidiaireDuree: newItem.archiveIntermidiaireDuree,
            archiveFinalDuree: newItem.archiveFinalDuree,
            archivageType: newItem.archivageType
        };

        if (selectedPlan) {
            newItemToSave.parentId = selectedPlanKey;
        }

        axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement`, newItemToSave)
            .then(response => {
                showToast('success', t('success.classificationPlanAdded'));
                refreshPlans(Number(selectedPlanKey));
                onClose();
            })
            .catch(error => {
                showToast('error', t("error.canNotAddClassementPlan"));
            });
    };

    const itemDialogFooter = (
        <>
            <Button raised label={t("cancel")} icon="pi pi-times" text onClick={onClose} />
            <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            closeOnEscape
            style={{ width: '50vw' }}
            header={t("document.addNewClassementPlan")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={onClose}
        >
            <TabView activeIndex={0} onTabChange={() => { }}>
                <TabPanel header={t("document.planClassementDetails")} >
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("document.libelle")}</label>
                            <InputText
                                id="libelle"
                                value={newItem.libelle}
                                onChange={(e) => setNewItem({ ...newItem, libelle: e.target.value })}
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
                                disabled
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="archiveIntermidiaireDuree">{t("Duree archive intermidiaire")}</label>
                            <InputNumber
                                id="archiveIntermidiaireDuree"
                                value={newItem.archiveIntermidiaireDuree}
                                onChange={(e) => setNewItem({ ...newItem, archiveIntermidiaireDuree: e.value as null })}
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="archiveFinalDuree">{t("Duree archive finale")}</label>
                            <InputNumber
                                id="archiveFinalDuree"
                                value={newItem.archiveFinalDuree}
                                onChange={(e) => setNewItem({ ...newItem, archiveFinalDuree: e.value as  null })}
                            />
                        </div>
                        <div className="field col-12">
                            <label>{t("archive type")}</label>
                            <div className="formgroup-inline">
                                <div className="field-radiobutton">
                                    <RadioButton
                                        inputId="archiveTypeFinale"
                                        name="archiveType"
                                        value="FINALE"
                                        onChange={(e) => setNewItem({ ...newItem, archivageType: e.value })}
                                        checked={newItem.archivageType === PlanClassementType.ArchivageType.FINALE}
                                    />
                                    <label htmlFor="archiveTypeFinale">{t("archive Finale")}</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton
                                        inputId="archiveTypeDestruction"
                                        name="archiveType"
                                        value="DESTRUCTION"
                                        onChange={(e) => setNewItem({ ...newItem, archivageType: e.value })}
                                        checked={newItem.archivageType === PlanClassementType.ArchivageType.DESTRUCTION}
                                    />
                                    <label htmlFor="archiveTypeDestruction">{t("Destruction")}</label>
                                </div>
                            </div>
                        </div>
                        <div className="field col">
                            <label htmlFor="description">{t("document.description")}</label>
                            <InputTextarea
                                id="description"
                                rows={5}
                                cols={30}
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
}

export default AddPlanDialog;
