import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { ChangeEvent, useEffect, useState } from 'react';


import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { TFunction } from "i18next";
import { Toast } from "primereact/toast";

import useEditHook from "app/component/zyhook/useEdit.hook";
import { DocumentCriteria } from "app/controller/criteria/DocumentCriteria.model";
import { AccessShareDto } from 'app/controller/model/AccessShare.model';
import { DocumentPartageGroupeDto } from 'app/controller/model/DocumentPartageGroupe.model';
import { DocumentPartageUtilisateurDto } from 'app/controller/model/DocumentPartageUtilisateur.model';
import { GroupeDto } from 'app/controller/model/Groupe.model';
import { AccessShareAdminService } from 'app/controller/service/admin/AccessShareAdminService.service';
import { GroupeAdminService } from 'app/controller/service/admin/GroupeAdminService.service';
import axiosInstance from 'app/axiosInterceptor';
import useUtilisateurStore from 'Stores/Users/UtilsateursStore';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';



type DocumentShareAdminType = {
    visible: boolean,
    onClose: () => void,
    showToast: React.Ref<Toast>,
    selectedItem: DocumentDto
    update: (item: DocumentDto) => void,
    list: DocumentDto[],
    service: DocumentAdminService,
    t: TFunction
}
const Share: React.FC<DocumentShareAdminType> = ({
    visible,
    onClose,
    showToast,
    selectedItem,
    update,
    list,
    service,
    t
}) => {

    const isFormValid = () => {
        let errorMessages = new Array<string>();
        if (item.reference == '')
            errorMessages.push("reference Obligatoire")
        return errorMessages.length == 0;
    }

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
    } = useEditHook<DocumentDto, DocumentCriteria>({
        list,
        selectedItem,
        onClose,
        update,
        showToast,
        service,
        t,
        isFormValid
    })

    const utilisateurs = useUtilisateurStore(state => state.utilisateurs);
    const [groupes, setGroupes] = useState<GroupeDto[]>([]);
    const [accessShares, setAccessShares] = useState<AccessShareDto[]>([]);
    const [documentPartageGroupes, setDocumentPartageGroupes] = useState<DocumentPartageGroupeDto>(new DocumentPartageGroupeDto());
    const [documentPartageUtilisateurs, setDocumentPartageUtilisateurs] = useState<DocumentPartageUtilisateurDto>(new DocumentPartageUtilisateurDto());

    const [daysInput, setDaysInput] = useState(7);
    const [hoursInput, setHoursInput] = useState(0);
    const [minutesInput, setMinutesInput] = useState(0);
    const [linkValue, setLinkValue] = useState<string>("");

    // console.log({ daysInput, hoursInput, minutesInput })
    const accessShareAdminService = new AccessShareAdminService();
    const groupeAdminService = new GroupeAdminService();

    useEffect(() => {
        groupeAdminService.getList().then(({ data }) => setGroupes(data)).catch(error => console.log(error));
        accessShareAdminService.getList().then(({ data }) => setAccessShares(data)).catch(error => console.log(error));
    }, []);


    const addDocumentPartageGroupes = () => {
        setSubmitted(true);
        if (item.documentPartageGroupes == null)
            item.documentPartageGroupes = new Array<DocumentPartageGroupeDto>();
        let _item = documentPartageGroupes;
        if (!_item.id) {
            item.documentPartageGroupes.push(_item);
            setItem((prevState: any) => ({ ...prevState, documentPartageGroupes: item.documentPartageGroupes }));
        } else {
            const updatedItems = item.documentPartageGroupes.map((item) => item.id === documentPartageGroupes.id ? { ...documentPartageGroupes } : item);
            setItem((prevState: any) => ({ ...prevState, documentPartageGroupes: updatedItems }));
        }
        setDocumentPartageGroupes(new DocumentPartageGroupeDto());
    };

    const deleteDocumentPartageGroupes = (rowData: any) => {
        const updatedItems = item.documentPartageGroupes.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentPartageGroupes: updatedItems }));
        setDocumentPartageGroupes(new DocumentPartageGroupeDto());
    };

    const onDropdownChangeDocumentPartageGroupes = (e: any, field: string) => {
        setDocumentPartageGroupes((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onInputDateChangeDocumentPartageGroupes = (e: CalendarChangeEvent, name: string) => {
        const val = e.value || '';
        setDocumentPartageGroupes({ ...documentPartageGroupes, [name]: val })
    };

    const onInputTextChangeDocumentPartageGroupes = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDocumentPartageGroupes({ ...documentPartageGroupes, [name]: val })
    };

    const addDocumentPartageUtilisateurs = () => {
        setSubmitted(true);
        if (item.documentPartageUtilisateurs == null)
            item.documentPartageUtilisateurs = new Array<DocumentPartageUtilisateurDto>();
        let _item = documentPartageUtilisateurs;
        if (!_item.id) {
            item.documentPartageUtilisateurs.push(_item);
            setItem((prevState: any) => ({
                ...prevState,
                documentPartageUtilisateurs: item.documentPartageUtilisateurs
            }));
        } else {
            const updatedItems = item.documentPartageUtilisateurs.map((item) => item.id === documentPartageUtilisateurs.id ? { ...documentPartageUtilisateurs } : item);
            setItem((prevState: any) => ({ ...prevState, documentPartageUtilisateurs: updatedItems }));
        }
        setDocumentPartageUtilisateurs(new DocumentPartageUtilisateurDto());
    };

    const deleteDocumentPartageUtilisateurs = (rowData: any) => {
        const updatedItems = item.documentPartageUtilisateurs.filter((val) => val !== rowData);
        setItem((prevState) => ({ ...prevState, documentPartageUtilisateurs: updatedItems }));
        setDocumentPartageUtilisateurs(new DocumentPartageUtilisateurDto());
    };

    const editDocumentPartageUtilisateurs = (rowData: any) => {
        setActiveTab(0);
        setDocumentPartageUtilisateurs(rowData);
    };

    const onDropdownChangeDocumentPartageUtilisateurs = (e: any, field: string) => {
        setDocumentPartageUtilisateurs((prevState) => ({ ...prevState, [field]: e.value }));
    };

    const onInputDateChangeDocumentPartageUtilisateurs = (e: CalendarChangeEvent, name: string) => {
        const val = e.value || '';
        setDocumentPartageUtilisateurs({ ...documentPartageUtilisateurs, [name]: val })
    };

    const onInputTextChangeDocumentPartageUtilisateurs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDocumentPartageUtilisateurs({ ...documentPartageUtilisateurs, [name]: val })
    };
    const connectedUser = useConnectedUserStore(state => state.connectedUser);
    const addAudit= ()=>{
        editItem();

        // const connectedUserName = authService.getUsername();
        // utilisateurCriteria.username = connectedUserName;
        // utilisateurAdminService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
        //     const user = data?.list[0];
        
        //     const newAudit = {
        //         utilisateurId: user.id,
        //         documentId: selectedItem.id,
        //         action: "PARTAGER_DOC",
        //     };
        //     axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}audit`, newAudit)
        //     .then(response => {
        //         console.log('audit saved successfully');
        //     })
        //     .catch(error => {
        //         console.error('Error saving item', error);
        //     });
        // });

        const newAudit = {
                utilisateurId: connectedUser!.id,
                documentId: selectedItem.id,
                action: "PARTAGER_DOC",
            };
            axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}audit`, newAudit)
            .then(response => {
                console.log('audit saved successfully');
            })
            .catch(error => {
                console.error('Error saving item', error);
            });
    }

        // Form validation
        const formValid = () => {
            if(activeIndex === 0){
                return linkValue !== "";
            }else if(activeIndex === 1){
                return item.documentPartageGroupes?.length > 0 ;
            }else if(activeIndex === 2){
                return item.documentPartageUtilisateurs?.length > 0 ;
            }
            return true;
        }

        const allowAddUtilisateur = () => {
            return documentPartageUtilisateurs?.utilisateur?.username !== '' && documentPartageUtilisateurs?.accessShare?.code !== '' ;
        }
        const allowAddGroupe = () => {
            return (documentPartageGroupes?.groupe !== null && documentPartageGroupes?.groupe?.code != ""  )&& (documentPartageGroupes?.accessShare !== null && documentPartageGroupes?.accessShare?.code !=='') ;
        }

    const itemDialogFooter = (
        <>
            <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideDialog} />
            <Button disabled={!formValid()} raised label={t("save")} icon="pi pi-check" onClick={addAudit} />
        </>
    );

    const generateSharedLink = () => {
        const referenceGedNumber = parseInt(selectedItem.referenceGed, 10);
        service.getDocumentShareLink(referenceGedNumber, daysInput, hoursInput, minutesInput).then(response => setLinkValue(response.data))
    }

    return (
        <Dialog visible={visible} closeOnEscape maximizable style={{ width: '70vw' }} header={t("document.tabPan")} modal className="p-fluid"
            footer={itemDialogFooter} onHide={hideDialog}>
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("document.tabPan")}>
                    <div className="flex flex-column gap-2 px-3">
                        <p className="mt-3">
                        {t("document.shareDocuemntCondition")}

                        </p>
                        <p>{t("document.shareDocumenttiming")}</p>
                        <h6>{t("document.durationValidity")}:</h6>
                        <div className="flex align-items-center">
                            <div className="mr-8">
                                <InputTime
                                    text={t("days")}
                                    value={daysInput.toString()}
                                    onChangeValue={(e: ChangeEvent<HTMLInputElement>) => {
                                        setDaysInput(+e.target.value);
                                    }}
                                />
                            </div>
                            <div className="mr-8">
                                <InputTime
                                    text={t("hours")}
                                    value={hoursInput.toString()}
                                    onChangeValue={(e: ChangeEvent<HTMLInputElement>) => {
                                        setHoursInput(+e.target.value);
                                    }}
                                />
                            </div>
                            <div className="mr-8">
                                <InputTime
                                    text={t("minutes")}
                                    value={minutesInput.toString()}
                                    onChangeValue={(e: ChangeEvent<HTMLInputElement>) => {
                                        setMinutesInput(+e.target.value);
                                    }}
                                />
                            </div>
                            <Button raised
                                label={t("document.generateLink")}
                                className="w-2"
                                onClick={generateSharedLink}
                            />
                        </div>
                        <div className="flex gap-1 mt-3">
                            <InputText placeholder={t("document.noGeneratedLink")} value={linkValue} disabled />
                            <Button raised
                                className="w-1"
                                icon="pi pi-copy"
                                onClick={(event) => {
                                    navigator.clipboard.writeText(linkValue);
                                }}
                            />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header={t("document.documentPartageGroupes")}>
                    <div>
                        <div className="grid">
                            <div className="field col-4">
                                <label htmlFor="groupe">{t("documentPartageGroupe.groupe")}</label>
                                <Dropdown id="groupeDropdown" value={documentPartageGroupes.groupe}
                                    options={groupes}
                                    autoFocus required
                                    onChange={(e) => onDropdownChangeDocumentPartageGroupes(e, 'groupe')}
                                    placeholder="Sélectionnez un groupe" filter
                                    filterPlaceholder="Rechercher un groupe" optionLabel="libelle" />
                                    {!allowAddGroupe()&&(documentPartageGroupes.groupe === null || documentPartageGroupes.groupe?.code ==='')&& <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>
                            <div className="field col-4">
                                <label htmlFor="accessShare">{t("documentPartageGroupe.accessShare")}</label>
                                <Dropdown id="accessShareDropdown" value={documentPartageGroupes.accessShare}
                                    options={accessShares}
                                    onChange={(e) => onDropdownChangeDocumentPartageGroupes(e, 'accessShare')}
                                    placeholder="Sélectionnez un accessShare" filter
                                    filterPlaceholder="Rechercher un accessShare" optionLabel="libelle" />
                                    {!allowAddGroupe() && (documentPartageGroupes.accessShare===null || documentPartageGroupes.accessShare?.code ==='') && <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>
                            <div className="field col-4">
                                <label htmlFor="dateShare">{t("documentPartageGroupe.dateShare")}</label>
                                <Calendar id="dateShare" value={adaptDate(documentPartageGroupes?.dateShare)}
                                    onChange={(e) => onInputDateChangeDocumentPartageGroupes(e, 'dateShare')}
                                    dateFormat="dd/mm/yy" showIcon={true} disabled />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="description">{t("documentPartageGroupe.description")}</label>
                                <InputTextarea id="description" value={documentPartageGroupes.description}
                                    onChange={(e) => onInputTextChangeDocumentPartageGroupes(e, 'description')}
                                    className={classNames({ 'p-invalid': submitted && !item.documentPartageGroupes })} />
                            </div>
                            <div className="field col-2">
                                <Button disabled={!allowAddGroupe()} raised icon="pi pi-plus" label={t("add")} onClick={addDocumentPartageGroupes} />
                            </div>
                        </div>
                        <DataTable value={item.documentPartageGroupes} tableStyle={{ minWidth: '50rem' }}
                            dataKey="id">
                            <Column field="groupe.libelle" header={t("documentPartageGroupe.groupe")}></Column>
                            <Column field="dateShare" header={t("documentPartageGroupe.dateShare")}
                                body={formateDate("dateShare")}></Column>
                            <Column field="accessShare.libelle"
                                header={t("documentPartageGroupe.accessShare")}></Column>
                            <Column field="description"
                                header={t("documentPartageGroupe.description")}></Column>
                            <Column header="Actions" body={(rowData) => (
                                <div>
                                    <Button raised icon="pi pi-times" severity="warning"
                                        className="mr-2 p-button-danger"
                                        onClick={() => deleteDocumentPartageGroupes(rowData)} />
                                    {/* <Button raised  icon="pi pi-pencil" rounded severity="success" className="mr-2"
                                            onClick={() => editDocumentPartageGroupes(rowData)} /> */}
                                </div>
                            )}></Column>
                        </DataTable>

                    </div>
                    {/* <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                        <TabPanel header="Creation">
                        </TabPanel>
                        <TabPanel header="Liste">
                        </TabPanel>
                    </TabView> */}
                </TabPanel>
                <TabPanel header={t("document.documentPartageUtilisateurs")}>
                    <div>
                        <div className="grid">
                            <div className="field col-4">
                                <label htmlFor="utilisateur">{t("documentPartageUtilisateur.utilisateur")}</label>
                                <Dropdown id="utilisateurDropdown" value={documentPartageUtilisateurs.utilisateur}
                                    options={utilisateurs}
                                    autoFocus
                                    onChange={(e) => onDropdownChangeDocumentPartageUtilisateurs(e, 'utilisateur')}
                                    placeholder="Sélectionnez un utilisateur" filter
                                    filterPlaceholder="Rechercher un utilisateur" optionLabel="nom" />
                                {!allowAddUtilisateur() && documentPartageUtilisateurs.utilisateur?.username === '' && <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>
                            <div className="field col-4">
                                <label htmlFor="accessShare">{t("documentPartageUtilisateur.accessShare")}</label>
                                <Dropdown id="accessShareDropdown" value={documentPartageUtilisateurs.accessShare}
                                    options={accessShares}
                                    onChange={(e) => onDropdownChangeDocumentPartageUtilisateurs(e, 'accessShare')}
                                    placeholder="Sélectionnez un accessShare" filter
                                    filterPlaceholder="Rechercher un accessShare" optionLabel="libelle" />
                                {!allowAddUtilisateur() && documentPartageUtilisateurs.accessShare?.code === '' && <small className="text-red-500">*{t('requiredField')}</small>}
                            </div>
                            <div className="field col-4">
                                <label htmlFor="dateShare">{t("documentPartageUtilisateur.dateShare")}</label>
                                <Calendar id="dateShare" value={adaptDate(documentPartageUtilisateurs?.dateShare)}
                                    onChange={(e) => onInputDateChangeDocumentPartageUtilisateurs(e, 'dateShare')}
                                    dateFormat="dd/mm/yy" showIcon={true} disabled />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="description">{t("documentPartageUtilisateur.description")}</label>
                                <InputTextarea id="description" value={documentPartageUtilisateurs.description}
                                    onChange={(e) => onInputTextChangeDocumentPartageUtilisateurs(e, 'description')}
                                    className={classNames({ 'p-invalid': submitted && !item.documentPartageUtilisateurs })} />
                            </div>
                            <div className="field col-2">
                                <Button disabled={!allowAddUtilisateur()} raised icon="pi pi-plus" label={t("add")} onClick={addDocumentPartageUtilisateurs} />
                            </div>
                        </div>
                        <div className="card">
                            <DataTable value={item.documentPartageUtilisateurs} tableStyle={{ minWidth: '50rem' }}
                                dataKey="id">
                                <Column field="utilisateur.nom"
                                    header={t("documentPartageUtilisateur.utilisateur")}></Column>
                                <Column field="dateShare" header={t("documentPartageUtilisateur.dateShare")}
                                    body={formateDate("dateShare")}></Column>
                                <Column field="accessShare.libelle"
                                    header={t("documentPartageUtilisateur.accessShare")}></Column>
                                <Column field="description"
                                    header={t("documentPartageUtilisateur.description")}></Column>
                                <Column header="Actions" body={(rowData) => (
                                    <div>
                                        <Button raised icon="pi pi-times" severity="warning"
                                            className="mr-2 p-button-danger"
                                            onClick={() => deleteDocumentPartageUtilisateurs(rowData)} />
                                        {/* <Button raised  icon="pi pi-pencil" rounded severity="success" className="mr-2"
                                            onClick={() => editDocumentPartageUtilisateurs(rowData)} /> */}
                                    </div>
                                )}></Column>
                            </DataTable>
                        </div>
                    </div>
                    {/* <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                        <TabPanel header="Creation">
                        </TabPanel>
                        <TabPanel header="Liste">
                        </TabPanel>
                    </TabView> */}
                </TabPanel>
            </TabView>
        </Dialog >
    );
};
export default Share;


const InputTime = ({ value, text, onChangeValue }: InputType) => (
    <div className="flex align-items-center justify-content-center gap-2">
        <InputText
            keyfilter="int"
            style={{ width: "35px" }}
            value={value}
            defaultValue={0}
            onChange={onChangeValue}
        />
        <p>{text}</p>
    </div>
);

interface InputType {
    value?: string;
    text: string;
    onChangeValue?: (e: ChangeEvent<HTMLInputElement>) => void;
}


