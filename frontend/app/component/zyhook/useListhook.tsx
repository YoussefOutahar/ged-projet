import React, { useEffect, useRef, useState } from "react";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { Tag } from "primereact/tag";
import { BaseDto } from "app/zynerator/dto/BaseDto.model";
import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import AbstractService from "app/zynerator/service/AbstractService";
import { MessageService } from "app/zynerator/service/MessageService";
import { Button } from "primereact/button";
import { TFunction } from "i18next";
import { InputText } from "primereact/inputtext";
import { format } from "date-fns";
import { PDFDocument } from "pdf-lib";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { InputNumberChangeEvent } from "primereact/inputnumber";
import { ArchiveDto } from "app/controller/model/DocumentArchive.model";
import useFeatureFlags from "../admin/view/featureFlag/list/FeatureFlagsComponent";
import { uploadFileInChunks } from "app/controller/service/admin/uploadFileInChunks";
import { DocumentDto } from "app/controller/model/Document.model";

type ListHookType<T extends BaseDto, C extends BaseCriteria> = {
    emptyItem: T,
    emptyCriteria: C,
    service: AbstractService<T, C>,
    t: TFunction,
    refresh?: () => void,
}

const useListHook = <T extends BaseDto, C extends BaseCriteria>({
    emptyItem,
    emptyCriteria,
    service,
    t,
    refresh
}: ListHookType<T, C>) => {
    const [items, setItems] = useState<T[]>([]);
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);

    const [archiveItemDialog, setArchiveItemDialog] = useState(false);
    const [archiveItemsDialog, setArchiveItemsDialog] = useState(false);
    const [desarchiveItemsDialog, setDesarchiveItemsDialog] = useState(false);

    const [archivePhysiqueItemsDialog, setArchivePhysiqueItemsDialog] = useState(false);
    const [desarchivePhysiqueItemsDialog, setDesarchivePhysiqueItemsDialog] = useState(false);
    const [mergeItemsDialog, setMergeItemsDialog] = useState(false);
    const [archiveInfo, setArchiveInfo] = useState<ArchiveDto[]>([]);
    const [desarchiveInfo, setDesarchiveInfo] = useState<ArchiveDto[]>([]);
    const[archiveLine, setArchiveLine] = useState<number>();
    const[archiveColumn, setArchiveColumn] = useState<number>();
    const[archiveBoite, setArchiveBoite] = useState<number>();

    const [item, setItem] = useState<T>(emptyItem);
    const [itemMerged, setItemMerged] = useState<T>(emptyItem);
    const [uploadedBlob, setUploadedBlob] = useState<Blob>();
    const [documentBase64, setDocumentBase64] = useState('');
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const [showEditPasswordDialog, setShowEditPasswordDialog] = useState<boolean>(false);
    const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<T>(emptyItem);
    const [rows, setRows] = useState<number>(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [criteria, setCriteria] = useState(emptyCriteria);
    const [first, setFirst] = useState(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<T[]>>(null);
    const [findByCriteriaShow, setFindByCriteriaShow] = useState(false);
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);
    const [loading, setLoading] = useState(false);

    const { featureFlags, isActiveBack, isActiveFront} = useFeatureFlags();
    const [chunkFile, setChunkFile] = useState<boolean>(false);
    useEffect(() => {
        const useFileChunking = isActiveFront('chunkFile');
        setChunkFile(useFileChunking);
    }, [featureFlags]);
        




    const fetchItems = (criteria: C) => {
        service.findPaginatedByCriteria(criteria).then(({ data }) => {
            setTotalRecords(data.dataSize);
            setItems(data.list);
        }).catch(error => console.log(error));
    };
    const serviceAdmin = new DocumentAdminService();


    const fetchItemsFromElastic = (keyword: string, c = criteria) => {
        service.getListFromElastic(keyword, c).then(({ data }) => {
            setTotalRecords(data.dataSize);
            setItems(data.list);
        }).catch(error => console.log(error));
    }


    const handleCancelClick = () => {
        setCriteria(emptyCriteria);
        fetchItems(emptyCriteria);
        setIsSearchTriggered(false);
    };

    const showSearch = () => {
        setFindByCriteriaShow(!findByCriteriaShow);
    };

    const handleValidateClick = () => {
        fetchItems(criteria)
    };

    const onPage = (event: PaginatorPageChangeEvent) => {
        const updatedCriteria = { ...criteria, page: event.page, maxResults: event.rows };
        setCriteria(updatedCriteria);
        setFirst(event.first);
        fetchItems(updatedCriteria);
    };


    const deleteItem = async () => {
        service.delete(selectedItem?.id).then(response => {
            if (response.status == 200) {
                /** Actions on SUCCESS Delete */
                setDeleteItemDialog(false);
                setItem(emptyItem);
                fetchItems(criteria);
                refresh && refresh();
                MessageService.showSuccess(toast, "Suppression !", "Opération faite avec success.");
            } else {
                MessageService.showSuccess(toast, "Suppression !", "Opération faite avec success.");
            }
        }).catch(() => {
            MessageService.showError(toast, "Erreur !", "Une erreur s'est produite, veuillez réessayer ultérieurement.");
        });
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteItemsDialog(true);
    };
    const confirmArchiveSelected = () => {
        setArchiveItemsDialog(true);
    };
    const confirmDesrchiveSelected = () => {
        setDesarchiveItemsDialog(true);
    };
    const confirmArchivePhysiqueSelected = () => {
        setArchivePhysiqueItemsDialog(true);
    };

    const deleteSelectedItems = async () => {
        service.deleteList(selectedItems).then(response => {
            if (response.status == 200) {
                /** Actions on SUCCESS Delete */
                setDeleteItemsDialog(false);
                setSelectedItems([]);
                fetchItems(criteria);
                refresh && refresh();
                MessageService.showSuccess(toast, "Suppression!", "Opération faite avec success.");
            }
        }).catch(() => {
            MessageService.showError(toast, "Erreur !", "Une erreur s'est produite, veuillez réessayer ultérieurement.");
        });
    };
    const archiveSelectedItems = async () => {
        service.archiveList(selectedItems).then(data => {
            if (data.status == 200) {
                setArchiveInfo(data.data);

                setArchiveItemsDialog(false);
                setArchivePhysiqueItemsDialog(true);
                fetchItems(criteria);
                MessageService.showSuccess(toast, "Archivage Finale !", "Opération faite avec success.");
            }
        }).catch(() => {
            MessageService.showError(toast, "Erreur !", "Une erreur s'est produite, veuillez réessayer ultérieurement.");
        });
    };

    const desarchiveSelectedItems = async () => {
        service.desarchiveList(selectedItems).then(data => {
            if (data.status == 200) {
                setDesarchiveInfo(data.data);
                setDesarchiveItemsDialog(false);
                MessageService.showSuccess(toast, "Desarchivage  !", "Opération faite avec success.");
            }
        }).catch(() => {
            MessageService.showError(toast, "Erreur !", "Une erreur s'est produite, veuillez réessayer ultérieurement.");
        });
    };


    const archivePhysiqueSelectedItems = async () => {
        service.archivePhysiqueData(archiveInfo, archiveLine?? 0, archiveColumn?? 0,archiveBoite?? 0).then(response => {
            if (response.status == 200) {
                /** Actions on SUCCESS Delete */
                setArchivePhysiqueItemsDialog(false);
                setSelectedItems([]);
                setArchiveInfo([]);
                fetchItems(criteria);
                refresh && refresh();
                MessageService.showSuccess(toast, "Archivage Finale !", "Opération faite avec success.");
            }
        }).catch(() => {
            MessageService.showError(toast, "Erreur !", "Une erreur s'est produite, veuillez réessayer ultérieurement.");
        });
    };

    const getDocumentsBlob = async () => {
        try {
            const promises = selectedItems.map(async (item) => {
                const { data } = await serviceAdmin.getDocumentBase64(item.id);
                return data;
            });
            const data2 = await Promise.all(promises);
            return data2;
        } catch (error) {
            console.error(t('error.canNotGetDocument'), error);
            throw error;
        }
    };

    async function mergePDFDocs(documentBlobs: any) {
        try {
            const mergedPdfDoc = await PDFDocument.create();
            for (const documentBlob of documentBlobs) {
                const sourcePdfDoc = await PDFDocument.load(documentBlob);
                const copiedPages = await mergedPdfDoc.copyPages(sourcePdfDoc, sourcePdfDoc.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdfDoc.addPage(page);
                });

                //sourcePdfDoc.destroy(); // Free up memory
            }
            const mergedPdfBytes = await mergedPdfDoc.save();
            return new Blob([mergedPdfBytes], { type: 'application/pdf' });
        } catch (error) {
            console.error(t('error.canNotMergeDocuments'), error);
            MessageService.showError(toast, t('error.error'), t('error.canNotMergeDocuments'));

            
            throw error;
        }
    }

    const saveItemOverride = async () => {
        try {

            const documentBase64List = await getDocumentsBlob();
            const mergedPdfBlob = await mergePDFDocs(documentBase64List);
            return mergedPdfBlob;
        } catch (error) {
            console.error(t('error.canNotMergeDocuments'), error);
            MessageService.showError(toast, t('error.error'), t('error.canNotMergeDocuments'));
            throw error;
        }
    };

    const onMergeSuccess = () => {
        setLoading(false);
        setMergeItemsDialog(false);
        setSelectedItems([]);
        fetchItems(criteria);
        refresh && refresh();
        MessageService.showSuccess(toast, t('success.creation'), t('Merged with success'));
    }
    const onMergeError = (error: any)=>{
        setLoading(false);
            setMergeItemsDialog(false);
            setSelectedItems([]);
            fetchItems(criteria);
            refresh && refresh();
            MessageService.showError(toast, t('error.error'),t('error.canNotMergeDocuments'));
            console.log("Error with Merge document here : ", error);
    }

    const mergeAndSaveItemFinale = async () => {
        try {
            const blobUpload = await saveItemOverride();
            if (!blobUpload) {
                setLoading(false);
                MessageService.showError(toast, t('error.error'),t('error.canNotMergeDocuments'));
                return;
            } 
            //feature flip
            if(chunkFile){
                let mergedDto  = selectedItems[0] as unknown as DocumentDto
                // @ts-ignore
                mergedDto.id = null;
                // @ts-ignore
                mergedDto.reference = selectedItems.map((item) => item.reference).join(" - "); 
                uploadFileInChunks({
                    file: blobUpload,
                    documentDto: mergedDto,
                    onSuccess: onMergeSuccess,
                    onError: onMergeError                    
                });
            }else{
                const formData = new FormData();
                formData.append("file", blobUpload, "mergedFile.pdf");
                formData.append("documentDTOs", JSON.stringify(selectedItems));
                const response = await serviceAdmin.saveFormsData(formData);
                if (response.status >= 200 && response.status < 300) {
                    onMergeSuccess();
                }
                setLoading(false);
            }
            
        } catch (error : any) {
            onMergeError(error);
        }
    };
    const showCreateModal = (): void => {
        setShowCreateDialog(true);
    };
    const showEditModal = (item: T) => {
        setSelectedItem(item);
        setShowEditDialog(true);
    };

    const showEditPasswordModal = (item: T) => {
        setSelectedItem(item);
        setShowEditPasswordDialog(true);
    };

    const showViewModal = (item: T) => {
        setSelectedItem(item);
        setShowViewDialog(true);
    };

    const add = () => {
        fetchItems(criteria);
    };

    const update = (updatedItem: T) => {
        const updatedList = items.map((item) => {
            if (item.id === updatedItem.id) {
                return updatedItem;
            }
            return item;
        });
        setItems(updatedList);
    };

    const hideDeleteItemsDialog = () => {
        setDeleteItemsDialog(false);
    };
    const hideArchiveItemsDialog = () => {
        setArchiveItemsDialog(false);
    };
    const hidedesarchiveItemsDialog = () => {
        setDesarchiveItemsDialog(false);
    };
    const hideArchivePhysiqueItemsDialog = () => {
        setArchivePhysiqueItemsDialog(false);
    };
    const hideMergeItemsDialog = () => {
        setMergeItemsDialog(false);
    };
    const confirmMergeSelected = () => {
        if (selectedItems.length > 1) {
            setMergeItemsDialog(true);
        } else {
            MessageService.showWarning(toast, t('error.warning'), t('error.selectMoreThanOneDocument'));
            return;
        }
    };
    const handleMergeConfirmation = async () => {
        setLoading(true);
        await mergeAndSaveItemFinale();
        setLoading(false);

        hideMergeItemsDialog();

    }

    const confirmDeleteItem = (item: T) => {
        setSelectedItem(item);
        setDeleteItemDialog(true);
    };



    const statusBodyTemplate = (val: string, style: any) => {
        return <Tag value={val} severity={style} />;
    };

    const hideDeleteItemDialog = () => {
        setDeleteItemDialog(false);
    };
    const hideArchivedItemDialog = () => {
        setArchiveItemDialog(false);
    };


    const formateDate = (field: string) => {
        return (rowData: any) => {
            if (rowData[field]) {
                return format(new Date(rowData[field]), "dd/MM/yyyy");
            }
        };
    };

    const CustomBooleanCell = (field: string) => {
        return (rowData: any) => {
            return <div style={{ marginBlock: "2rem" }}>
                {rowData[field] === true ? <Tag value="Oui" severity="success"></Tag> : <Tag value="Non" severity="danger"></Tag>}
            </div>
        };
    };

    const deleteItemDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times" text onClick={hideDeleteItemDialog} />
        <Button raised label={t("yes")} icon="pi pi-check" onClick={deleteItem} />
    </>
    );
    const deleteItemsDialogFooter = (
        <>
            <Button raised label={t("no")} icon="pi pi-times" text onClick={hideDeleteItemsDialog} />
            <Button raised label={t("yes")} icon="pi pi-check" onClick={deleteSelectedItems} />
        </>
    ); 
    const archiveItemsDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times" text onClick={hideArchiveItemsDialog} />
        <Button raised label={t("yes")} icon="pi pi-check" onClick={archiveSelectedItems } />
    </>
    );
    const desarchiveItemsDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times" text onClick={hidedesarchiveItemsDialog} />
        <Button raised label={t("yes")} icon="pi pi-check" onClick={desarchiveSelectedItems} />
    </>
    );
    const archivePhysiqueItemsDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times" text onClick={hideArchivePhysiqueItemsDialog} />
        <Button raised label={t("yes")} icon="pi pi-check" onClick={archivePhysiqueSelectedItems} />
    </>
    );
    const mergeItemsDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times" text onClick={hideMergeItemsDialog} />
        <Button raised label={t("yes")} icon="pi pi-check" loading={loading} onClick={handleMergeConfirmation} />
    </>
    );
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button raised label={t("new")} icon="pi pi-plus" severity="info" className=" mr-2"
                        onClick={showCreateModal} />
                    <Button raised label={t("delete")} icon="pi pi-trash" severity="danger" className=" mr-2"
                        onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
                    <Button raised label={t("search")} icon={`pi pi-${findByCriteriaShow ? 'angle-down' : 'angle-right'}`}
                        className=" mr-2" severity="secondary" onClick={showSearch} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importer"
                    className="mr-2 inline-block" />
                <Button raised label={t("export")} icon="pi pi-upload" severity="secondary" onClick={exportCSV} /> */}
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: T) => {
        return (<div style={{ width: "140px" }}>
            <Button raised icon="pi pi-pencil" severity="info" className="mr-1"
                onClick={() => showEditModal(rowData)} />
            <Button raised icon="pi pi-trash" severity="danger" className="mr-1"
                onClick={() => confirmDeleteItem(rowData)} />
            <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                onClick={() => showViewModal(rowData)} />
        </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Représentation Tabulaires</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );
    const onInputNumerChange = (e: InputNumberChangeEvent, name: string) => {
        const val = e.value === null ? null : +e.value;
        setItem((prevItem) => ({ ...prevItem, [name]: val }));
      };

    return {
        items,
        showSearch,
        deleteItemDialog,
        archiveItemDialog,
        item,
        selectedItems,
        setSelectedItems,
        hideDeleteItemDialog,
        hideArchivedItemDialog,
        globalFilter,
        setGlobalFilter,
        showCreateDialog,
        setShowCreateDialog,
        showEditDialog,
        setShowEditDialog,
        showViewDialog,
        setShowViewDialog,
        selectedItem,
        setSelectedItem,
        rows,
        totalRecords,
        criteria,
        setCriteria,
        first,
        fetchItems,
        toast,
        dt,
        findByCriteriaShow,
        handleCancelClick,
        confirmDeleteSelected,
        confirmArchiveSelected,
        setDesarchiveItemsDialog,
        confirmDesrchiveSelected,
        exportCSV,
        deleteItem,
        deleteItemDialogFooter,
        leftToolbarTemplate,
        rightToolbarTemplate,
        actionBodyTemplate,
        header,
        CustomBooleanCell,
        handleValidateClick,
        onPage,
        showCreateModal,
        showEditModal,
        showViewModal,
        add,
        loading,
        update,
        confirmDeleteItem,
        statusBodyTemplate,
        formateDate,
        deleteSelectedItems,
        archiveSelectedItems,
        handleMergeConfirmation,
        confirmMergeSelected,
        mergeItemsDialogFooter,
        hideMergeItemsDialog,
        mergeItemsDialog,
        deleteItemsDialog,
        deleteItemsDialogFooter,
        hideDeleteItemsDialog,
        archiveItemsDialog,
        desarchiveItemsDialog,
        archiveItemsDialogFooter,
        desarchiveItemsDialogFooter,
        hideArchiveItemsDialog,
        hidedesarchiveItemsDialog,
        fetchItemsFromElastic,
        showEditPasswordDialog,
        showEditPasswordModal,
        setShowEditPasswordDialog,
        onInputNumerChange,
        archivePhysiqueItemsDialog,
        archivePhysiqueItemsDialogFooter,
        hideArchivePhysiqueItemsDialog,
        confirmArchivePhysiqueSelected,
        archiveInfo,
        setArchiveInfo,
        archiveLine,
        archiveColumn,
        archiveBoite,
        setArchiveLine,
        setArchiveColumn,
        setArchiveBoite

    } 
};

export default useListHook;
