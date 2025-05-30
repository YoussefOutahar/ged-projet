import { Column } from 'primereact/column';
import { TabPanel, TabView } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { TFunction } from "i18next";
import useViewHook from "app/component/zyhook/useViewhook";

import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';

type DocumentCategorieIndexViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: DocumentCategorieIndexDto,
    t: TFunction
}

const View: React.FC<DocumentCategorieIndexViewAdminType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<DocumentCategorieIndexDto>({ selectedItem, onClose, t })


    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorieIndex.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorieIndex.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-6">
                            <label htmlFor="indexElement">{t("documentCategorieIndex.indexElement")}</label>
                            <InputText id="indexElementDropdown" value={selectedItem?.indexElement?.libelle} disabled />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="documentCategorie">{t("documentCategorieIndex.documentCategorie")}</label>
                            <InputText id="documentCategorieDropdown" value={selectedItem?.documentCategorie?.libelle} disabled />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="documentCategorieIndexRule">{t("documentCategorieIndex.documentCategorieIndexRule")}</label>
                            <InputText id="documentCategorieIndexRuleDropdown" value={selectedItem?.documentCategorieIndexRule?.libelle} disabled />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
