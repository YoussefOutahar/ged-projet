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

import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';

type DocumentCategorieViewAgentType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: DocumentCategorieDto,
    t: TFunction
}

const View: React.FC<DocumentCategorieViewAgentType> = ({ visible, onClose, selectedItem, t }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<DocumentCategorieDto>({ selectedItem, onClose, t })


    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorie.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorie.tabPan")}>
                    <div className="formgrid grid">

                        <div className="field col-6">
                            <label htmlFor="code">{t("documentCategorie.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={selectedItem?.code} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="libelle">{t("documentCategorie.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={selectedItem?.libelle} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="description">{t("documentCategorie.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={selectedItem?.description} disabled rows={5} cols={30} />
                            </span>
                        </div>

                    </div>
                </TabPanel>
                <TabPanel header={t("documentCategorie.documentCategorieIndexs")}>
                    <div className="card">
                        <DataTable value={selectedItem?.documentCategorieIndexs} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                            <Column field="indexElement.libelle" header={t("documentCategorieIndex.indexElement")}></Column>
                            <Column field="documentCategorieIndexRule.libelle" header={t("documentCategorieIndex.documentCategorieIndexRule")}></Column>
                        </DataTable>
                    </div>
                </TabPanel>
                <TabPanel header={t("documentCategorie.documentCategorieModels")}>
                    <div className="card">
                        <DataTable value={selectedItem?.documentCategorieModels} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                            <Column field="code" header={t("documentCategorieModel.code")}   ></Column>
                            <Column field="libelle" header={t("documentCategorieModel.libelle")}   ></Column>
                            <Column field="referenceGed" header={t("documentCategorieModel.referenceGed")}   ></Column>
                            <Column field="description" header={t("documentCategorieModel.description")}   ></Column>
                        </DataTable>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
