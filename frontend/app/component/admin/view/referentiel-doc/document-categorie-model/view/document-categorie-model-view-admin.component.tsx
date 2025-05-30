import React from "react";

import useViewHook from "app/component/zyhook/useViewhook";
import { DocumentCategorieModelDto } from "app/controller/model/DocumentCategorieModel.model";
import { TFunction } from "i18next";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";

type DocumentCategorieModelViewAdminType = {
    onClose: () => void;
    selectedItem: DocumentCategorieModelDto;
    t: TFunction;
    visible: boolean;
};

const View: React.FC<DocumentCategorieModelViewAdminType> = ({
    onClose,
    selectedItem,
    t,
    visible,
}) => {
    const {
        activeIndex,
        adaptDate,
        formateDate,
        hideDialog,
        itemDialogFooter,
        onTabChange,
        parse,
        parseToIsoFormat,
    } = useViewHook<DocumentCategorieModelDto>({ selectedItem, onClose, t });

    return (
        <Dialog
            visible={visible}
            style={{ width: "70vw" }}
            header={t("documentCategorieModel.tabPan")}
            modal
            className="p-fluid"
            footer={itemDialogFooter}
            onHide={hideDialog}
        >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorieModel.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("documentCategorieModel.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={selectedItem?.code} disabled />
                        </div>

                        <div className="field col-6">
                            <label htmlFor="libelle">
                                {t("documentCategorieModel.libelle")}
                            </label>
                            <InputText id="libelle" value={selectedItem?.libelle} disabled />
                        </div>

                        {/* <div className="field col-6">
                    <label htmlFor="referenceGed">{t("documentCategorieModel.referenceGed")}</label>
                    <InputNumber id="referenceGed" value={selectedItem.referenceGed} disabled/>
                </div> */}

                        <div className="field col-6">
                            <label htmlFor="description">
                                {t("documentCategorieModel.description")}
                            </label>
                            <span className="p-float-label">
                                <InputTextarea
                                    id="description"
                                    value={selectedItem?.description}
                                    disabled
                                    rows={5}
                                    cols={30}
                                />
                            </span>
                        </div>

                        <div className="field col-6">
                            <label htmlFor="documentCategorie">
                                {t("documentCategorieModel.documentCategorie")}
                            </label>
                            <InputText
                                id="documentCategorieDropdown"
                                value={selectedItem?.documentCategorie?.libelle}
                                disabled
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default View;
