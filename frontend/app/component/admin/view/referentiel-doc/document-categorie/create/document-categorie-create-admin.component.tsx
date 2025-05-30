import { MessageService } from 'app/zynerator/service/MessageService';
import { Button } from 'primereact/button';
import { CalendarChangeEvent } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitchChangeEvent } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

import { DocumentCategorieCriteria } from "app/controller/criteria/DocumentCategorieCriteria.model";
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';
import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { DocumentCategorieModelDto } from 'app/controller/model/DocumentCategorieModel.model';
import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { DocumentCategorieIndexAdminService } from 'app/controller/service/admin/DocumentCategorieIndexAdminService.service';
import { DocumentCategorieIndexRuleAdminService } from 'app/controller/service/admin/DocumentCategorieIndexRuleAdminService.service';
import { DocumentCategorieModelAdminService } from 'app/controller/service/admin/DocumentCategorieModelAdminService.service';
import { IndexElementAdminService } from 'app/controller/service/admin/IndexElementAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";



type DocumentCategorieCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: DocumentCategorieDto[],
    service: DocumentCategorieAdminService,
    t: TFunction
}
const Create: React.FC<DocumentCategorieCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.code == '')
            errorMessages.push("code Obligatoire")
        if (item.libelle == '')
            errorMessages.push("libelle Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new DocumentCategorieDto();
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
    } = useCreateHook<DocumentCategorieDto, DocumentCategorieCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [indexElements, setIndexElements] = useState<IndexElementDto[]>([]);
    const [documentCategorieIndexRules, setDocumentCategorieIndexRules] = useState<DocumentCategorieIndexRuleDto[]>([]);

    const [documentCategorieIndexs, setDocumentCategorieIndexs] = useState<DocumentCategorieIndexDto>(new DocumentCategorieIndexDto());
    const [documentCategorieModels, setDocumentCategorieModels] = useState<DocumentCategorieModelDto>(new DocumentCategorieModelDto());

    const indexElementAdminService = new IndexElementAdminService();
    const documentCategorieIndexRuleAdminService = new DocumentCategorieIndexRuleAdminService();
    const documentCategorieModelAdminService = new DocumentCategorieModelAdminService();
    const documentCategorieIndexAdminService = new DocumentCategorieIndexAdminService();

    useEffect(() => {
        indexElementAdminService.getList().then(({ data }) => setIndexElements(data)).catch(error => console.log(error));
        documentCategorieIndexRuleAdminService.getList().then(({ data }) => setDocumentCategorieIndexRules(data)).catch(error => console.log(error));
    }, []);

    const addDocumentCategorieIndexs = () => {
        setSubmitted(true);
        if (item.documentCategorieIndexs == null)
            item.documentCategorieIndexs = new Array<DocumentCategorieIndexDto>();
        let _item = documentCategorieIndexs;
        if (!_item.id) {
            item.documentCategorieIndexs.push(_item);
            setItem((prevState: any) => ({ ...prevState, documentCategorieIndexs: item.documentCategorieIndexs }));
        } else {
            const updatedItems = item.documentCategorieIndexs.map((item) => item.id === documentCategorieIndexs.id ? { ...documentCategorieIndexs } : item);
            setItem((prevState: any) => ({ ...prevState, documentCategorieIndexs: updatedItems }));
        }
        setDocumentCategorieIndexs(new DocumentCategorieIndexDto());
    };

    const deleteDocumentCategorieIndexs = (rowData: any) => {
        const updatedItems = item.documentCategorieIndexs.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentCategorieIndexs: updatedItems }));
        setDocumentCategorieIndexs(new DocumentCategorieIndexDto());
    };

    const editDocumentCategorieIndexs = (rowData: any) => {
        setActiveTab(0);
        setDocumentCategorieIndexs(rowData);

    };

    const onInputNumerChangeDocumentCategorieIndexs = (e: any, name: string) => {
        const val = e.value || 0;
        setDocumentCategorieIndexs((prevDocumentCategorieIndexs) => ({ ...prevDocumentCategorieIndexs, [name]: val, }));
    };
    const onDropdownChangeDocumentCategorieIndexs = (e: any, field: string) => {
        setDocumentCategorieIndexs((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onBooleanInputChangeDocumentCategorieIndexs = (e: InputSwitchChangeEvent, name: string) => {
        const val = e.value;
        setDocumentCategorieIndexs((prevItem) => ({ ...prevItem, [name]: val, }));
    };

    const onInputDateChangeDocumentCategorieIndexs = (e: CalendarChangeEvent, name: string) => {
        const val = e.value || '';
        setDocumentCategorieIndexs({ ...documentCategorieIndexs, [name]: val })
    };

    const onInputTextChangeDocumentCategorieIndexs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDocumentCategorieIndexs({ ...documentCategorieIndexs, [name]: val })
    };
    const addDocumentCategorieModels = () => {
        setSubmitted(true);
        if (item.documentCategorieModels == null)
            item.documentCategorieModels = new Array<DocumentCategorieModelDto>();
        let _item = documentCategorieModels;
        if (!_item.id) {
            item.documentCategorieModels.push(_item);
            setItem((prevState: any) => ({ ...prevState, documentCategorieModels: item.documentCategorieModels }));
        } else {
            const updatedItems = item.documentCategorieModels.map((item) => item.id === documentCategorieModels.id ? { ...documentCategorieModels } : item);
            setItem((prevState: any) => ({ ...prevState, documentCategorieModels: updatedItems }));
        }
        setDocumentCategorieModels(new DocumentCategorieModelDto());
    };

    const deleteDocumentCategorieModels = (rowData: any) => {
        const updatedItems = item.documentCategorieModels.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentCategorieModels: updatedItems }));
        setDocumentCategorieModels(new DocumentCategorieModelDto());
    };

    const editDocumentCategorieModels = (rowData: any) => {
        setActiveTab(0);
        setDocumentCategorieModels(rowData);

    };

    const onInputNumerChangeDocumentCategorieModels = (e: any, name: string) => {
        const val = e.value || 0;
        setDocumentCategorieModels((prevDocumentCategorieModels) => ({ ...prevDocumentCategorieModels, [name]: val, }));
    };

    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );

    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorie.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorie.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("documentCategorie.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item.code} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")}).</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("documentCategorie.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item.libelle} onChange={(e) => onInputTextChange(e, 'libelle')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="description">{t("documentCategorie.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={item.description} onChange={(e) => onInputTextChange(e, 'description')} rows={5} cols={30} />
                            </span>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header={t("documentCategorie.documentCategorieIndexs")}>
                    <div className="grid">
                        <div className="field col-5">
                            <label htmlFor="indexElement">{t("documentCategorieIndex.indexElement")}</label>
                            <Dropdown id="indexElementDropdown" value={documentCategorieIndexs.indexElement} options={indexElements} onChange={(e) => onDropdownChangeDocumentCategorieIndexs(e, 'indexElement')} placeholder={t("documentCategorieIndex.indexElementPlaceHolder")} filter filterPlaceholder={t("documentCategorieIndex.indexElementPlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                        {/* <div className="field col-5">
                            <label htmlFor="documentCategorieIndexRule">{t("documentCategorieIndex.documentCategorieIndexRule")}</label>
                            <Dropdown id="documentCategorieIndexRuleDropdown" value={documentCategorieIndexs.documentCategorieIndexRule} options={documentCategorieIndexRules} onChange={(e) => onDropdownChangeDocumentCategorieIndexs(e, 'documentCategorieIndexRule')} placeholder={t("documentCategorieIndex.documentCategorieIndexRulePlaceHolder")} filter filterPlaceholder={t("documentCategorieIndex.documentCategorieIndexRulePlaceHolderFilter")} optionLabel="libelle" />
                        </div> */}
                        <div className="field col-2">
                            <Button raised icon="pi pi-plus" label={t("add")} className="mt-4" onClick={addDocumentCategorieIndexs} />
                        </div>
                    </div>
                    <div className="p-col">
                        <div className="card">
                            <DataTable value={item.documentCategorieIndexs} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                                <Column field="indexElement.libelle" header={t("documentCategorieIndex.indexElement")}></Column>
                                <Column field="indexElement.description" header={t("indexElement.description")}></Column>
                                <Column header={t("actions")} body={(rowData) => (<div>
                                    <Button raised icon="pi pi-times" severity="warning" className="mr-2 p-button-danger" onClick={() => deleteDocumentCategorieIndexs(rowData)} />
                                    {/* <Button raised  icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDocumentCategorieIndexs(rowData)} /> */}
                                </div>)}></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};
export default Create;
