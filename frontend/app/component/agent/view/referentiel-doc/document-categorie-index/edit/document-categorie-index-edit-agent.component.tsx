import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { InputSwitch } from 'primereact/inputswitch';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

import { MessageService } from 'app/zynerator/service/MessageService';

import { DocumentCategorieIndexAgentService } from 'app/controller/service/agent/DocumentCategorieIndexAgentService.service';
import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { IndexElementAgentService } from 'app/controller/service/agent/IndexElementAgentService.service';
import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { DocumentCategorieIndexRuleAgentService } from 'app/controller/service/agent/DocumentCategorieIndexRuleAgentService.service';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentCategorieAgentService } from 'app/controller/service/agent/DocumentCategorieAgentService.service';
import { DocumentCategorieIndexCriteria } from "app/controller/criteria/DocumentCategorieIndexCriteria.model";
import useEditHook from "app/component/zyhook/useEdit.hook";


type DocumentCategorieIndexEditAgentType = {
    visible: boolean,
    onClose: () => void,
    showToast: React.Ref<Toast>,
    selectedItem: DocumentCategorieIndexDto
    update: (item: DocumentCategorieIndexDto) => void,
    list: DocumentCategorieIndexDto[],
    service: DocumentCategorieIndexAgentService,
    t: TFunction
}
const Edit: React.FC<DocumentCategorieIndexEditAgentType> = ({ visible, onClose, showToast, selectedItem, update, list, service, t }) => {


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
        onDropdownChange,
        onTabChange,
        hideDialog,
        editItem,
        formateDate,
        parseToIsoFormat,
        adaptDate
    } = useEditHook<DocumentCategorieIndexDto, DocumentCategorieIndexCriteria>({ list, selectedItem, onClose, update, showToast, service, t, isFormValid })


    const [indexElements, setIndexElements] = useState<IndexElementDto[]>([]);
    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);
    const [documentCategorieIndexRules, setDocumentCategorieIndexRules] = useState<DocumentCategorieIndexRuleDto[]>([]);


    const indexElementAgentService = new IndexElementAgentService();
    const documentCategorieIndexRuleAgentService = new DocumentCategorieIndexRuleAgentService();
    const documentCategorieAgentService = new DocumentCategorieAgentService();

    useEffect(() => {
        indexElementAgentService.getList().then(({ data }) => setIndexElements(data)).catch(error => console.log(error));
        documentCategorieAgentService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
        documentCategorieIndexRuleAgentService.getList().then(({ data }) => setDocumentCategorieIndexRules(data)).catch(error => console.log(error));

    }, []);







    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={editItem} /> </>
    );



    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorieIndex.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorieIndex.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="indexElement">{t("documentCategorieIndex.indexElement")}</label>
                            <Dropdown id="indexElementDropdown" value={item ? item.indexElement : ''} options={indexElements} onChange={(e) => onDropdownChange(e, 'indexElement')} placeholder="Sélectionnez un indexElement" filter filterPlaceholder="Rechercher un indexElement" optionLabel="libelle" />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="documentCategorie">{t("documentCategorieIndex.documentCategorie")}</label>
                            <Dropdown id="documentCategorieDropdown" value={item ? item.documentCategorie : ''} options={documentCategories} onChange={(e) => onDropdownChange(e, 'documentCategorie')} placeholder="Sélectionnez un documentCategorie" filter filterPlaceholder="Rechercher un documentCategorie" optionLabel="libelle" />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="documentCategorieIndexRule">{t("documentCategorieIndex.documentCategorieIndexRule")}</label>
                            <Dropdown id="documentCategorieIndexRuleDropdown" value={item ? item.documentCategorieIndexRule : ''} options={documentCategorieIndexRules} onChange={(e) => onDropdownChange(e, 'documentCategorieIndexRule')} placeholder="Sélectionnez un documentCategorieIndexRule" filter filterPlaceholder="Rechercher un documentCategorieIndexRule" optionLabel="libelle" />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Edit;


