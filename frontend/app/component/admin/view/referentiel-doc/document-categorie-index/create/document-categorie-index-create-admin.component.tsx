import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';

import { DocumentCategorieIndexCriteria } from "app/controller/criteria/DocumentCategorieIndexCriteria.model";
import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';
import { DocumentCategorieIndexAdminService } from 'app/controller/service/admin/DocumentCategorieIndexAdminService.service';

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { DocumentCategorieIndexRuleAdminService } from 'app/controller/service/admin/DocumentCategorieIndexRuleAdminService.service';
import { IndexElementAdminService } from 'app/controller/service/admin/IndexElementAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

type DocumentCategorieIndexCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: DocumentCategorieIndexDto[],
    service: DocumentCategorieIndexAdminService,
    t: TFunction
}
const Create: React.FC<DocumentCategorieIndexCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        return errorMessages.length == 0;
    }
    const emptyItem = new DocumentCategorieIndexDto();
    const {
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
        onTabChange,
        onDropdownChange,
        hideDialog,
        saveItem,
        formateDate
    } = useCreateHook<DocumentCategorieIndexDto, DocumentCategorieIndexCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [indexElements, setIndexElements] = useState<IndexElementDto[]>([]);
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const [documentCategorieIndexRules, setDocumentCategorieIndexRules] = useState<DocumentCategorieIndexRuleDto[]>([]);


    const indexElementAdminService = new IndexElementAdminService();
    const documentCategorieIndexRuleAdminService = new DocumentCategorieIndexRuleAdminService();
    const documentCategorieAdminService = new DocumentCategorieAdminService();

    useEffect(() => {
        indexElementAdminService.getList().then(({ data }) => setIndexElements(data)).catch(error => console.log(error));
        documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
        documentCategorieIndexRuleAdminService.getList().then(({ data }) => setDocumentCategorieIndexRules(data)).catch(error => console.log(error));
    }, []);

    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );

    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorieIndex.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorieIndex.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-5">
                            <label htmlFor="indexElement">{t("documentCategorieIndex.indexElement")}</label>
                            <Dropdown id="indexElementDropdown" value={item.indexElement} options={indexElements} onChange={(e) => onDropdownChange(e, 'indexElement')} placeholder={t("documentCategorieIndex.indexElementPlaceHolder")} filter filterPlaceholder={t("documentCategorieIndex.indexElementPlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                        <div className="field col-5">
                            <label htmlFor="documentCategorie">{t("documentCategorieIndex.documentCategorie")}</label>
                            <Dropdown id="documentCategorieDropdown" value={item.documentCategorie} options={documentCategories} onChange={(e) => onDropdownChange(e, 'documentCategorie')} placeholder={t("documentCategorieIndex.documentCategoriePlaceHolder")} filter filterPlaceholder={t("documentCategorieIndex.documentCategoriePlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                        <div className="field col-5">
                            <label htmlFor="documentCategorieIndexRule">{t("documentCategorieIndex.documentCategorieIndexRule")}</label>
                            <Dropdown id="documentCategorieIndexRuleDropdown" value={item.documentCategorieIndexRule} options={documentCategorieIndexRules} onChange={(e) => onDropdownChange(e, 'documentCategorieIndexRule')} placeholder={t("documentCategorieIndex.documentCategorieIndexRulePlaceHolder")} filter filterPlaceholder={t("documentCategorieIndex.documentCategorieIndexRulePlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};


export default Create;
