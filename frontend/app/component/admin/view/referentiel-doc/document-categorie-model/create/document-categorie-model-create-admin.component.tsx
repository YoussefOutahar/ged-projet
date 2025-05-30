import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';

import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

import { DocumentCategorieModelCriteria } from "app/controller/criteria/DocumentCategorieModelCriteria.model";
import { DocumentCategorieModelDto } from 'app/controller/model/DocumentCategorieModel.model';
import { DocumentCategorieModelAdminService } from 'app/controller/service/admin/DocumentCategorieModelAdminService.service';

import useCreateHook from "app/component/zyhook/useCreate.hook";
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";



type DocumentCategorieModelCreateAdminType = {
    visible: boolean,
    onClose: () => void,
    add: () => void,
    showToast: React.Ref<Toast>,
    list: DocumentCategorieModelDto[],
    service: DocumentCategorieModelAdminService,
    t: TFunction
}
const Create: React.FC<DocumentCategorieModelCreateAdminType> = ({ visible, onClose, add, showToast, list, service, t }) => {


    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.code == '')
            errorMessages.push("code Obligatoire")
        if (item.libelle == '')
            errorMessages.push("libelle Obligatoire")
        return errorMessages.length == 0;
    }
    const emptyItem = new DocumentCategorieModelDto();
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
    } = useCreateHook<DocumentCategorieModelDto, DocumentCategorieModelCriteria>({ list, emptyItem, onClose, add, showToast, service, isFormValid })

    const [documentCategories, setDocumentCategories] = useState<DocumentCategorieDto[]>([]);


    const documentCategorieAdminService = new DocumentCategorieAdminService();

    useEffect(() => {
        documentCategorieAdminService.getList().then(({ data }) => setDocumentCategories(data)).catch(error => console.log(error));
    }, []);

    const onUpload = (event: any) => { }

    const itemDialogFooter = (<>
        <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
        <Button raised label={t("save")} icon="pi pi-check" onClick={saveItem} /> </>
    );

    return (
        <Dialog visible={visible}  closeOnEscape style={{ width: '70vw' }} header={t("documentCategorieModel.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("documentCategorieModel.tabPan")}>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="code">{t("documentCategorieModel.code")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="code" value={item.code} onChange={(e) => onInputTextChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.code })} />
                            {submitted && !item.code && <small className="p-invalid p-error font-bold">({t("document.requiredField")}).</small>}
                        </div>
                        <div className="field col-6">
                            <label htmlFor="libelle">{t("documentCategorieModel.libelle")} <b className="font-italic"> ({t("document.uniqueFields")})</b> </label>
                            <InputText id="libelle" value={item.libelle} onChange={(e) => onInputTextChange(e, 'libelle')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.libelle })} />
                            {submitted && !item.libelle && <small className="p-invalid p-error font-bold">({t("document.requiredField")})</small>}
                        </div>
                        <div className="field col-6">
                            <FileUpload accept=".pdf,.jpg,.png" chooseLabel="Choose File" uploadLabel="Upload" customUpload uploadHandler={onUpload} />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="description">{t("documentCategorieModel.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={item.description} onChange={(e) => onInputTextChange(e, 'description')} rows={5} cols={30} />
                            </span>
                        </div>
                        <div className="field col-5">
                            <label htmlFor="documentCategorie">{t("documentCategorieModel.documentCategorie")}</label>
                            <Dropdown id="documentCategorieDropdown" value={item.documentCategorie} options={documentCategories} onChange={(e) => onDropdownChange(e, 'documentCategorie')} placeholder={t("documentCategorieModel.documentCategoriePlaceHolder")} filter filterPlaceholder={t("documentCategorieModel.documentCategoriePlaceHolderFilter")} optionLabel="libelle" />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default Create;
