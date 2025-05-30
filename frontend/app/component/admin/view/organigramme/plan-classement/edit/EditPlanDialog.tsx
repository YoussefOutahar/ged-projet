import axiosInstance from 'app/axiosInterceptor';
import { PlanClassementIndexElementDto } from 'app/controller/model/PlanClassementIndexElement.model';
import { PlanClassementModelDto } from 'app/controller/model/PlanClassementModel.model';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { TabPanel, TabView } from 'primereact/tabview';
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddPlanDialogProps {
    visible: boolean;
    onClose: () => void;
    refreshPlans: (idParent: number) => void;
    selectedPlanKey: string;
    parentPlanKey: string;
    showToast: (severity: SeverityType, summary: string) => void;
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const EditPlanDialog: React.FC<AddPlanDialogProps> = ({
    visible,
    onClose,
    refreshPlans,
    selectedPlanKey,
    parentPlanKey,
    showToast,
  }) => {
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [planClassementModels, setPlanClassementModels] = useState<PlanClassementModelDto[]>([]);
    const [indexElements, setIndexElements] = useState<[]>([]);
    const [planClassementIndexElement, setPlanClassementIndexElement] = useState<PlanClassementIndexElementDto>(new PlanClassementIndexElementDto());
    const [planClassementIndexs, setPlanClassementIndexs] = useState<[]>([]);
    const [newItem, setNewItem] = useState({
        code: '',
        libelle: '',
        description: '',
        parentId: null,
        archive: false,
        archiveIntermidiaireDuree: null,
        archiveFinalDuree: null,
        archivageType: 'FINALE',
        planClassementModel: new PlanClassementModelDto()
    });
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);

    // useEffect(() => {
    //   console.log('selectedPlanKey', selectedPlanKey);
    //   console.log('parentPlanKey', parentPlanKey);
    // }, [selectedPlanKey, parentPlanKey]);

    useEffect(() => {
        axiosInstance
          .get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list`)
          .then((response) => setPlans(response.data))
          .catch((error) => console.error('Error loading plans', error));
    }, []);

    const refreshIndexs = (id: number) => {
      axiosInstance
              .get(`${process.env.NEXT_PUBLIC_ADMIN_URL}planClassementModelIndex/model/${id}`)
              .then((response) => setPlanClassementIndexs(response.data))
              .catch((error) => console.error('Error loading plans', error));
    }

    const getPlanClassementModel = (id: number) => {
        axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}planClassementModel/id/${id}`)
        .then((response) => {
            setNewItem(prevItem => ({
                ...prevItem,
                planClassementModel: response.data
            }));
        })
        .catch((error) => console.error('Error loading plans', error));
    }

    useEffect(() => {
        const defaultPlan = plans.find((plan) => plan.id === Number(selectedPlanKey));
        if (defaultPlan) {
          setSelectedPlan(defaultPlan);
          setIndexElements(defaultPlan?.planClassementIndexElements);
          if(defaultPlan.planClassementModel){
            refreshIndexs(defaultPlan?.planClassementModel?.id);
          }
        }
    }, [selectedPlanKey, plans]);

    useEffect(() => {
      axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}planClassementModel/`)	
        .then((response) => setPlanClassementModels(response.data))
        .catch((error) => console.error('Error loading plans', error));
    },[])

    const refereshIndexElemenets = () => {
      axiosInstance
          .get(`${process.env.NEXT_PUBLIC_ADMIN_URL}planClassementIndexElement/index/${selectedPlanKey}`)
          .then((response) => setIndexElements(response.data))
          .catch((error) => console.error('Error loading plans', error));
    }

    useEffect(() => {
        if (selectedPlan) {
          setNewItem({
            code: selectedPlan.code,
            libelle: selectedPlan.libelle,
            description: selectedPlan.description,
            parentId: selectedPlan.parentId || null,
            archive: selectedPlan.archive,
            archiveIntermidiaireDuree: selectedPlan.archiveIntermidiaireDuree || null,
            archiveFinalDuree: selectedPlan.archiveFinalDuree || null,
            archivageType: selectedPlan.archivageType || 'FINALE',
            planClassementModel: new PlanClassementModelDto()
          });
          getPlanClassementModel(selectedPlan?.planClassementModel?.id);
        }
    }, [selectedPlan]);

    const EditItem = () => {
        let newItemToSave = {
          libelle: newItem.libelle,
          description: newItem.description,
          archive: newItem.archive,
          archiveIntermidiaireDuree: newItem.archiveIntermidiaireDuree,
          archiveFinalDuree: newItem.archiveFinalDuree,
          archivageType: newItem.archivageType,
          planClassementModelId: newItem.planClassementModel?.id
        };
        axiosInstance.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/${selectedPlanKey}`, newItemToSave)
          .then((response) => {
            showToast('success', t("success.classificationPlanupdated"));
            refreshPlans(Number(parentPlanKey));
            onClose();
          })
          .catch((error) => {
            console.error('Error saving item', error);
            showToast('error', t("error.classificationPlanupdateError"));
          });
    };

    const itemDialogFooter = (
        <>
          <Button raised label={t("cancel")} icon="pi pi-times" text onClick={onClose} />
          <Button raised label={t("save")} icon="pi pi-check" onClick={EditItem} />
        </>
    );

    const onDropdownChangePlanIndexElements = (e: any, field: string) => {
      setPlanClassementIndexElement((prevState) => ({
          ...prevState,
          [field]: e.value,
      }));
    };

    const onInputTextChangePlanIndexElements = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      name: string,
    ) => {
      const val = (e.target && e.target.value) || "";
      setPlanClassementIndexElement({ ...planClassementIndexElement, [name]: val });
    };

    const deletePlanIndexElements = (rowData: any) => {
      axiosInstance.delete(`${process.env.NEXT_PUBLIC_ADMIN_URL}planClassementIndexElement/id/${rowData.id}`)
        .then((response) => refereshIndexElemenets())
        .catch((error) => console.error("error lors de la suppression d'index"));
  };

    const addPlanIndexElements=()=>{
      const indexs = {...planClassementIndexElement}
      const item = {
        value : indexs.value,
        description: indexs.description,
        indexElementId: indexs.indexElement.id,
        planClassementId: Number(selectedPlanKey)
      }
      setPlanClassementIndexElement(indexs);
      axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}planClassementIndexElement/summary`,item)
      .then((response) => refereshIndexElemenets())
      .catch((error) => console.error("error lors d'ajout d'index"))
    }

  return (
    <Dialog
            visible={visible}
            closeOnEscape
            style={{ width: '60vw' }}
            header={t("document.updatePlan")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={onClose}
        >
            <TabView activeIndex={activeIndex} onTabChange={(e) => {setActiveIndex(e.index)}}>
                <TabPanel header={t("document.planClassementDetails")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("document.code")}</label>
                            <InputText 
                                id="code" 
                                value={newItem.code} 
                                onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                                disabled
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("document.libelle")}</label>
                            <InputText 
                                id="libelle" 
                                value={newItem.libelle} 
                                onChange={(e) => setNewItem({ ...newItem, libelle: e.target.value })}
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="archiveIntermidiaireDuree">{t("Duree archive intermidiaire")}</label>
                            <InputNumber
                                id="archiveIntermidiaireDuree"
                                value={newItem.archiveIntermidiaireDuree || 0}
                                onChange={(e) => setNewItem({ ...newItem, archiveIntermidiaireDuree: e.value as  null })}
                            />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="archiveFinalDuree">{t("Duree archive finale")}</label>
                            <InputNumber
                                id="archiveFinalDuree"
                                value={newItem.archiveFinalDuree || 0}
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
                                        checked={newItem.archivageType === 'FINALE'}
                                    />
                                    <label htmlFor="archiveTypeFinale">{t("archive Finale")}</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton
                                        inputId="archiveTypeDestruction"
                                        name="archiveType"
                                        value="DESTRUCTION"
                                        onChange={(e) => setNewItem({ ...newItem, archivageType: e.value })}
                                        checked={newItem.archivageType === 'DESTRUCTION'}
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
                <TabPanel header={"Indexation des Plans"} >
                  <div className="grid">
                    <div className="field col-4">
                        <label htmlFor="indexElement">Plan Classement Model</label>
                        <Dropdown
                            id="indexElementDropdown"
                            value={newItem.planClassementModel}
                            options={planClassementModels}
                            onChange={(e) => {setNewItem({ ...newItem, planClassementModel: e.value });refreshIndexs(e.value.id)}}
                            placeholder={t("documentIndexElement.indexElementPlaceHolder")}
                            filter
                            filterPlaceholder={t("documentIndexElement.indexElementPlaceHolderFilter")}
                            optionLabel="libelle"
                            disabled ={selectedPlan?.planClassementModel}
                            autoFocus
                        />
                      </div>
                      <div className="field col-4">
                        <label htmlFor="indexElement">
                            {t("documentIndexElement.indexElement")}
                        </label>
                        <Dropdown
                            id="indexElementDropdown"
                            value={planClassementIndexElement.indexElement}
                            options={planClassementIndexs}
                            onChange={(e) => onDropdownChangePlanIndexElements(e, "indexElement")}
                            placeholder={t("documentIndexElement.indexElementPlaceHolder")}
                            filter
                            filterPlaceholder={t("documentIndexElement.indexElementPlaceHolderFilter")}
                            optionLabel="libelle"
                            autoFocus
                        />
                      </div>
                      <div className="field col-4">
                        <label htmlFor="description">{t("documentIndexElement.description")}</label>
                        <InputText id="description" value={planClassementIndexElement.description} onChange={(e) => onInputTextChangePlanIndexElements(e, 'description')} required className={classNames({ 'p-invalid': !planClassementIndexElement.description })} />
                      </div>
                    <div className="field col-12">
                      <label htmlFor="value">{t("documentIndexElement.value")}</label>
                      <InputTextarea
                          id="value"
                          value={planClassementIndexElement.value}
                          onChange={(e) =>
                            onInputTextChangePlanIndexElements(e, "value")
                          }
                          required
                          className={classNames({
                              "p-invalid": !planClassementIndexElement.value,
                          })}
                          rows={4}
                      />
                    </div>
                    <div className="field col-3">
                      <Button raised
                          icon="pi pi-plus"
                          severity='success'
                          label={t("add")}
                          onClick={addPlanIndexElements}
                      />
                    </div>
                  </div>
                  <DataTable value={indexElements} tableStyle={{ minWidth: '50rem' }} dataKey="id" emptyMessage="Aucun resultats trouvés">
                      <Column field="indexElement.libelle" header={t("documentIndexElement.indexElement")}></Column>
                      <Column field="value" header={t("documentIndexElement.value")}   ></Column>
                      <Column field="description" header={t("documentIndexElement.description")}   ></Column>
                      <Column header={t("actions")}
                        body={(rowData) => (
                          <div>
                            <Button raised
                              icon="pi pi-times"
                              severity="warning"
                              className="mr-2 p-button-danger"
                              onClick={() => deletePlanIndexElements(rowData)}
                            />
                            {/* <Button raised
                              icon="pi pi-times"
                              severity="info"
                              className="mr-2"
                              onClick={() => refereshIndexElemenets()}
                            /> */}
                          </div>
                        )}
                      ></Column>
                    </DataTable>
                </TabPanel>
            </TabView>
    </Dialog>
  )                                                                                                
}

export default EditPlanDialog;
