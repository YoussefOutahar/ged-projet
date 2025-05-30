import React, { useEffect, useState } from "react";

import useEditHook from "app/component/zyhook/useEdit.hook";
import { DocumentCriteria } from "app/controller/criteria/DocumentCriteria.model";
import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { TFunction } from "i18next";
import { Button } from "primereact/button";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { PlanClassementDto } from "app/controller/model/PlanClassement.model";
import axiosInstance from "app/axiosInterceptor";
import { MessageService } from "app/zynerator/service/MessageService";
import usePlanClassementStore from "Stores/PlanClassementStore";

type DocumentEditAdminType = {
    list: DocumentDto[];
    onClose: () => void;
    selectedItem: DocumentDto;
    selectedItems: DocumentDto[];
    service: DocumentAdminService;
    showToast: React.Ref<Toast>;
    t: TFunction;
    update: (item: DocumentDto) => void;
    visible: boolean;
};
const MoveDocs: React.FC<DocumentEditAdminType> = ({
    list,
    onClose,
    selectedItem,
    selectedItems,
    service,
    showToast,
    t,
    update,
    visible,
}) => {
    const isFormValid = () => {
        const errorMessages = new Array<string>();
        if (item.reference == "") errorMessages.push("reference Obligatoire");
        return errorMessages.length == 0;
    };
    const emptyItem = new DocumentDto();

    const {
        activeIndex,
        activeTab,
        adaptDate,
        editItem,
        formateDate,
        hideDialog,
        item,
        onBooleanInputChange,
        onDropdownChange,
        onInputDateChange,
        onInputNumerChange,
        onInputTextChange,
        onMultiSelectChange,
        onTabChange,
        parseToIsoFormat,
        setActiveIndex,
        setActiveTab,
        setItem,
        setSubmitted,
        submitted,
    } = useEditHook<DocumentDto, DocumentCriteria>({
        list,
        selectedItem,
        onClose,
        update,
        showToast,
        service,
        t,
        isFormValid,
    });

    const { planClassementsNoArchive: planClassements } = usePlanClassementStore();

    const handleEdit = () => {
        selectedItems.forEach((selectedItem) => {
            selectedItem.planClassement = item.planClassement;
            service.update(selectedItem).then(({ data }) => {
                update(data);
                MessageService.showSuccess(showToast, "Mise à jour!", "Opération faite avec Success.");
            }).catch(({ response }) => {
                if (response.status === 422) {
                    MessageService.showError(showToast, "Error!", "Erreur lors de deplacement des documents.");
                }
            })
        });
        onClose();   
    }
    const itemDialogFooter = (
        <>
            <Button raised
                label={t("cancel")}
                icon="pi pi-times"
                text
                onClick={hideDialog}
            />
            <Button raised label={t("save")} icon="pi pi-check" onClick={handleEdit} />{" "}
        </>
    );

    return (
        <Dialog
            visible={visible}
            maximizable
            style={{ width: "70vw" }}
            header={t("document.tabPan")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={hideDialog}
        >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("document.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="planClassement">
                                Plan de classement
                            </label>
                            <Dropdown
                                showClear
                                id="planClassementDropdown"
                                value={item.planClassement}
                                options={planClassements}
                                onChange={(e) => onDropdownChange(e, "planClassement")}
                                placeholder={item.planClassement.libelle}
                                filter
                                filterPlaceholder="planClassementPlaceHolderFilter"
                                optionLabel="libelle"
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default MoveDocs;
