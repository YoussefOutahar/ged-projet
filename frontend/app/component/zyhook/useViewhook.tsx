import React, { useState } from "react";
import { BaseDto } from "app/zynerator/dto/BaseDto.model";
import { format, parse } from "date-fns";
import { Button } from "primereact/button";
import { TFunction } from "i18next";

type ViewHookType<T extends BaseDto> = {
    selectedItem: T,
    onClose: () => void,
    t: TFunction,
}
const useViewHook = <T extends BaseDto>({ selectedItem, onClose, t }: ViewHookType<T>) => {
    const [item, setItem] = useState<T>(selectedItem);
    const [submitted, setSubmitted] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const onTabChange = (e: { index: number }) => {
        setActiveIndex(e.index);
    };

    const hideDialog = () => {
        setSubmitted(false);
        onClose();
    };

    const itemDialogFooter = (<>
        <Button raised  label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} /></>
    );

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
        onTabChange, hideDialog, itemDialogFooter, formateDate, parse, parseToIsoFormat, adaptDate, activeIndex
    }
};

export default useViewHook;