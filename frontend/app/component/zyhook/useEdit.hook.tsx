import React, { useState } from "react";
import { CalendarChangeEvent } from "primereact/calendar";
import { InputNumberChangeEvent } from "primereact/inputnumber";
import { MultiSelectChangeEvent } from "primereact/multiselect";
import { DropdownChangeEvent } from "primereact/dropdown";
import { format, parse } from "date-fns";
import { BaseDto } from "app/zynerator/dto/BaseDto.model";
import { Toast } from "primereact/toast";
import AbstractService from "app/zynerator/service/AbstractService";
import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";
import { MessageService } from "app/zynerator/service/MessageService";
import { TFunction } from "i18next";

type EditHookType<T extends BaseDto, C extends BaseCriteria> = {
    list: T[],
    selectedItem: T,
    onClose: () => void,
    update: (item: T) => void,
    showToast: React.Ref<Toast>,
    service: AbstractService<T, C>,
    t: TFunction,
    isFormValid: () => boolean
}
const useEditHook = <T extends BaseDto, C extends BaseCriteria>({
    list,
    selectedItem,
    onClose,
    update,
    showToast,
    service,
    t,
    isFormValid
}: EditHookType<T, C>) => {

    const [items, setItems] = useState<T[]>(list);
    const [item, setItem] = useState<T>(selectedItem);
    const [submitted, setSubmitted] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeTab, setActiveTab] = useState(0);

    const editItem = async () => {
        setSubmitted(true);
        if (isFormValid()) {
            service.update(item).then(({ data }) => {
                update(data);
                MessageService.showSuccess(showToast, "Mise à jour!", "Opération faite avec Success.");
                onClose();
                setSubmitted(false);
            }).catch(({ response }) => {
                if (response.status === 422) {
                    MessageService.showError(showToast, "Error!", "C'est pas possible d'avoir une entité parente de niveau inférieur.");
                }
            });;
        }
    };
    const onInputTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const value = (e.target && e.target.value) || '';
        setItem({ ...item, [name]: value });
    };

    const onInputDateChange = (e: CalendarChangeEvent, name: string) => {
        const value = (e.value) || '';
        setItem({ ...item, [name]: new Date(value as Date) });
    };

    const onInputNumerChange = (e: InputNumberChangeEvent, name: string) => {
        const val = e.value === null ? null : +e.value;
        setItem((prevItem) => ({ ...prevItem, [name]: val, }));
    };

    const onMultiSelectChange = (e: DropdownChangeEvent, field: string) => {
        if (e && e.value) {
            setItem(prevState => ({ ...prevState, [field]: [e.value], }));
        }
    };

    const onBooleanInputChange = (e: any, name: string) => {
        const val = e.value;
        setItem((prevItem) => ({ ...prevItem, [name]: val, }));
    };
    const onDropdownChange = (e: DropdownChangeEvent, field: string) => {
        setItem((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onTabChange = (e: { index: number }) => {
        setActiveIndex(e.index);
    };

    const hideDialog = () => {
        setSubmitted(false);
        onClose();
    };

    const formateDate = (field: string) => {
        return (rowData: any) => {
            if (rowData[field]) {
                return format(new Date(rowData[field]), "dd/MM/yyyy");
            }
        };
    };

    const parseToIsoFormat = (date: Date) => {
        return parse(date.toISOString(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date())
    };

    const adaptDate = (field: null | Date) => {
        return field == null ? null : new Date(field)
    };

    return {
        item,
        setItem,
        submitted,
        setSubmitted,
        activeIndex,
        setActiveIndex,
        activeTab,
        setActiveTab,
        onInputTextChange,
        onInputDateChange,
        onInputNumerChange,
        onMultiSelectChange,
        onBooleanInputChange,
        onDropdownChange,
        onTabChange,
        hideDialog,
        editItem,
        formateDate,
        parseToIsoFormat,
        adaptDate
    }
};

export default useEditHook;