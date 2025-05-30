import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import useListHook from "app/component/zyhook/useListhook";
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { useTranslation } from 'react-i18next';
import Edit from 'app/component/admin/view/doc/document/edit/document-edit-admin.component';
import Create from 'app/component/admin/view/doc/document/create/document-create-admin.component';
import History from 'app/component/admin/view/doc/document/history/document-history-admin.component';
import View from 'app/component/admin/view/doc/document/view/document-view-admin.component';
import Share from "app/component/admin/view/doc/document/share/document-share-admin.component";
import { useDebounce } from 'react-use';
import axios from 'app/axiosInterceptor';
import axiosConfig from "axios";
import { useDispatch } from 'react-redux';
import Move from 'app/component/admin/view/doc/document/move/document-move-admin.component';
import MoveDocs from 'app/component/admin/view/doc/document/move/documents-move-admin.component';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { Tag } from 'primereact/tag';
import Scan from 'app/component/admin/view/doc/document/scan_masse/document-scan-admin.component';
import Add from 'app/component/admin/view/doc/document/add/document-add-masse-admin.component';
import Ai from 'app/component/admin/view/doc/document/create/document-ai-admin.component';
import SaveParapheur from 'app/component/admin/view/doc/parapheur/document-parapheur-admin.component';
import { SplitButton } from 'primereact/splitbutton';
import EditFile from '../edit/document-edit-file-admin.component';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { MultiSelect } from 'primereact/multiselect';
import useDocCategorieStore from 'Stores/DocumentCategorieStore';
import useDocTypeStore from 'Stores/DocumentTypeStore';
import useDocumentStateStore from 'Stores/DocumentStateStore';
import useEntiteAdministrativesStore from 'Stores/EntiteAdministrativesStore';
import jsPDF from 'jspdf';
import { set } from 'date-fns';
import { get } from 'http';
import StatusDocDropdown from './StatusDocDropdown';
import { ref } from 'yup';


import CompareDocument from 'app/component/admin/view/doc/document/compare/document-compare-admin.component';
import { PdfHashSHA256 } from 'app/component/admin/view/doc/HashSHA256Comparaison/document-calcul-hash';
import FindByNumeroEnregistrementButton from './find-by-numero-enregistrement';
import AddMasse from '../add/document-add-admin-component';
import AddSummary from '../add/document-add-summary-component';

type SeverityType = 'success' | 'info' | 'warn' | 'error';
const ADMIN_MINIO_BACKEND_URL = process.env.NEXT_PUBLIC_MINIO_BACKEND_URL as string;
const NEXT_PUBLIC_DEFAULT_BUCKET = process.env.NEXT_PUBLIC_DEFAULT_BUCKET as string;
const List: React.FC<{
    selectedNodeData: any,
    size: Number,
    displaybutton?: boolean,
    spinner?: boolean,
    refreshTable?: () => void,
    nextPage?: (event: PaginatorPageChangeEvent) => void,
    start?: number,
    onRows?: number,
    plan?: any,
    disablTableArchiveG?: boolean,

}> = ({ selectedNodeData, plan, size, displaybutton, refreshTable, spinner, nextPage, start, onRows, disablTableArchiveG }) => {

    const { t } = useTranslation();

    const emptyItem = new DocumentDto();
    const emptyCriteria = new DocumentCriteria();
    const service = new DocumentAdminService();
    const refresh = () => {
        refreshTable && refreshTable()
    }

    const {
        items,
        showSearch,
        deleteItemDialog,
        archiveItemDialog,
        item,
        loading,
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
        confirmDeleteSelected,
        confirmArchiveSelected,
        confirmMergeSelected,
        mergeItemsDialogFooter,
        hideMergeItemsDialog,
        mergeItemsDialog,
        exportCSV,
        deleteItem,
        deleteItemDialogFooter,
        rightToolbarTemplate,
        CustomBooleanCell,
        handleValidateClick,
        onPage,
        showCreateModal,
        showEditModal,
        showViewModal,
        add,
        update,
        confirmDeleteItem,
        statusBodyTemplate,
        formateDate,
        deleteSelectedItems,
        archiveSelectedItems,
        deleteItemsDialog,
        deleteItemsDialogFooter,
        hideDeleteItemsDialog,
        archiveItemsDialog,
        archiveItemsDialogFooter,
        hideArchiveItemsDialog,
        archivePhysiqueItemsDialog,
        archivePhysiqueItemsDialogFooter,
        hideArchivePhysiqueItemsDialog,
        fetchItemsFromElastic,
        onInputNumerChange,
        archiveInfo,
        setArchiveInfo,
        archiveLine,
        archiveColumn,
        archiveBoite,
        setArchiveLine,
        setArchiveColumn,
        setArchiveBoite

    } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t, refresh });

    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [searchKeywordIndex, setSearchKeywordIndex] = React.useState('');
    const [reference, setReference] = React.useState('');
    const [dataTable, SetDataTable] = useState<any | null>(null);
    const [dataTableIndex, SetDataTableIndex] = useState<any | null>(null);
    const [indexSearchSize, setindexSearchSize] = useState();
    const [showMoveDialog, setShowMoveDialog] = useState<boolean>(false);
    const [showMoveDialogDocs, setShowMoveDialogDocs] = useState<boolean>(false);
    const [documentBase64, setDocumentBase64] = useState(""); 
    const [showSaveDialogQuality, setShowSaveDialogQuality] = useState(false);
    const [showDialogEditFile, setShowDialogEditFile] = useState(false);
    const [showComparisonInterface, setShowComparisonInterface] = useState(false);
    const [resultatComparaison, setResultatComparaison] = useState('');
    const pdfHashSHA256 = new PdfHashSHA256();

    useDebounce(() => {
        let c : DocumentCriteria= criteria;
        displaybutton?c.deleted = false:c.deleted = true;
        if (searchKeyword === "") {
            fetchItems(emptyCriteria);
        } else {
            fetchItemsFromElastic(searchKeyword,c);
        }
    }, 100, [searchKeyword]);
    const [dialogAddVisible, setDialogAddVisible] = useState(false);
    const [dialogScanVisible, setDialogScanVisible] = useState(false);
    const handleOpenDialog = () => {
        setDialogAddVisible(true);
    };
    const showSaveModal= ()=>{
        setShowSaveDialogQuality(true);
    }
    const renderComparisonView= async ()=>{
        if (selectedItems.length==2) {
        await setShowComparisonInterface(true);
        const documentAdminService = new DocumentAdminService();
        const { data: data1 } = await documentAdminService.downloadFile(selectedItems[0].referenceGed);
        const { data: data2 } = await documentAdminService.downloadFile(selectedItems[1].referenceGed);
        if (await pdfHashSHA256.comparerBlobsPDF(data1, data2)) {
            setResultatComparaison('les documents sont identiques');
        }
        else{
            setResultatComparaison('les documents ne sont pas identiques');
        }
        }
        else{
            showToast('error', 'il faut selectionner deux documents.');
        }
    }

    const showEditFileModal= ()=>{
        setShowDialogEditFile(true);
    }
    const handleCloseDialog = () => {
        setDialogAddVisible(false);
    };
    const showScanModal = () => {
        setDialogScanVisible(true);
    };

    const hideScanModal = () => {
        setDialogScanVisible(false);
    };
    const confirmMoveSelected = () => {
        setShowMoveDialogDocs(true);
    }
    const [deleteFinalItemsDialog, setDeleteFinalItemsDialog] = useState(false);
    const confirmDeleteFinalSelected = () => {
        setDeleteFinalItemsDialog(true);
    };
    const hideDeleteFinalItemDialog = () => {
        setSelectedDocument(null);
        setDeleteFinalItemsDialog(false);
    };
    const [showAIDialog, setShowAIDialog] = useState<boolean>(false);
    const [archiveInterItemsDialog, setArchiveInterItemsDialog] = useState(false);
    const [archiveCheckDialog, setArchiveCheckDialog] = useState(false);

    // const [archiveInterItemsDialog, setArchiveInterItemsDialog] = useState(false);
    const confirmArchiveInterSelected = () => {
        let allCloture = true;
        for (let i = 0; i < selectedItems.length; i++) {
            if (selectedItems[i].documentState?.libelle !== 'cloture') {
                allCloture = false;
                break;
            }
        }
        if (allCloture) {
            setArchiveInterItemsDialog(true);
        } else {
            setArchiveCheckDialog(true);
        }
    };
    const archiveInterSelectedItems = () => {
        axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/archive`,selectedItems)
        .then((response) => {
            setArchiveInterItemsDialog(false);
            refresh && refresh();
        })
        .catch((error) => {
            console.error('Error lors d\'Archivage item', error);
        })
        
    }
    const archiveInterItemsDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times"  onClick={() => setArchiveInterItemsDialog(false)} />
        <Button raised label={t("yes")} icon="pi pi-check" onClick={archiveInterSelectedItems} />
    </>
    );
    const archiveCheckDialogFooter = (<>
        <Button raised label={t("OK")}   onClick={() => setArchiveCheckDialog(false)} />
    </>
    );
    const showAIModal = (): void => {
        setShowAIDialog(true);
    };
    const isDisabled = !selectedItems || !selectedItems.length;
    const archiveButtonitems = [
  
        {
            label: "Documents a archiver",
            icon: 'pi pi-file-export',
            command: () => {
                generateDocToArchive();
            },
            disabled: false // Active cette option

        },
        {
            label: "Documents archivés",
            icon: 'pi pi-file-export',
            command: () => {
                generateDocArchives();
            },
            disabled: false // Active cette option

        },
    ]
    const saveButtonitems = [
        {
            label: "AI",
            icon: 'pi pi-slack',
            command: () => {
                showAIModal()
            }
        },
        {
            label: t("addMasse"),
            icon: 'pi pi-file-import',
            command: () => {
                handleOpenDialog()
            }
        },
        {
            label: t("scan"),
            icon: 'pi pi-print',
            command: () => {
                showScanModal()
            }
        },
    ]
    const editFileContent = (item: DocumentDto) => {
        const content = item.content;
    }
    const[documentsToArchive, setDocumentsToArchive] = useState<DocumentDto[]>([]);

    const [disablTableArchive, setDisablTableArchive] = useState<boolean>(disablTableArchiveG ||false);

   

    const afficheTableArchive = () => {
        if (disablTableArchive) {
            setDisablTableArchive(false);
        } else {
        setDisablTableArchive(true);}
    }

    const getDocumentToArchive = async () => {
        const response = await  axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/toArchive`);
        setDocumentsToArchive(response.data);
        return response.data;
    }
    
    const getDocumentArchives = async () => {
        const response = await  axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/Archivee`);
        setDocumentsToArchive(response.data);
        return response.data;
    }

    const generateDocToArchive  = async () => {
       
        const documents = await getDocumentToArchive();
    
        const doc = new jsPDF();
        const title = 'Les documents à archiver';
    
        // Load logo data
        const logo = await fetch(`/Images/logo-yandoc.png`); 
        const logoBlob = await logo.blob();
        const logoData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(logoBlob);
        });
    
        // Add logo to PDF
        doc.addImage(logoData as string, 'PNG', 5, 2, 20, 20);    
        doc.setFontSize(18);
        doc.text(title, 70, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
    
        const headers = [["ID", "reference", "Date", "Responsable", "Departement"]];
    
        const data = documents.map((doc: DocumentDto) => {
            const date = new Date(doc.uploadDate);
            const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            return [doc.id, doc.reference, formattedDate, doc.utilisateur.nom, doc.entiteAdministrative.libelle];
        });
    
        let content = {
            startY: 50,
            head: headers,
            body: data
        };
    
        doc.autoTable(content);
        doc.save('Documents_to_Archive.pdf');
    }

    const generateDocArchives  = async () => {
       
        const documents = await getDocumentArchives();
    
        const doc = new jsPDF();
        const title = 'Les documents archivés dérnierement';
    
        // Load logo data
        const logo = await fetch(`/Images/logo-yandoc.png`); 
        const logoBlob = await logo.blob();
        const logoData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(logoBlob);
        });
    
        // Add logo to PDF
        doc.addImage(logoData as string, 'PNG', 5, 2, 20, 20);    
        doc.setFontSize(18);
        doc.text(title, 70, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
    
        const headers = [["ID", "reference", "Date", "Responsable", "Departement"]];
    
        const data = documents.map((doc: DocumentDto) => {
            const date = new Date(doc.uploadDate);
            const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            return [doc.id, doc.reference, formattedDate, doc.utilisateur.nom, doc.entiteAdministrative.libelle];
        });
    
        let content = {
            startY: 50,
            head: headers,
            body: data
        };
    
        doc.autoTable(content);
        doc.save('Documents-Archives.pdf');
    }
    
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    {displaybutton === true ? (
                        <>
                            {findByCriteriaShow ? (
                                <Button raised icon="pi pi-filter-slash"
                                    className=" mr-2" severity="danger" onClick={() => {handleCancelCrtClick()}} />
                            ):(
                                <Button raised icon="pi pi-filter"
                                    className=" mr-2" severity="secondary" onClick={() => {setFindByCriteriaShow(!findByCriteriaShow)}} />
                            )}
                            <SplitButton label={t("new")} icon="pi pi-plus" onClick={showCreateModal} model={saveButtonitems} className="mr-2" severity='info' raised/>
                            <Button raised label={t("move")} icon="pi pi-arrow-right-arrow-left" severity="help" className=" mr-2"
                                onClick={confirmMoveSelected} disabled={!selectedItems || !selectedItems.length} />
                            <Button raised label={t("delete")} icon="pi pi-trash" severity="danger" className=" mr-2"
                                onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />

                    

                                        <SplitButton 
                                            label={t("archive")} 
                                            icon="pi pi-folder-open" 
                                            onClick={() => {
                                                if (selectedItems && selectedItems.length > 0) {
                                                    // confirmArchiveSelected();
                                                    confirmArchiveInterSelected();

                                                } else {
                                                    setDisablTableArchive(false);
                                                }
                                            }} 
                                            model={archiveButtonitems} 
                                            severity='warning' 
                                            className={`mr-2 ${selectedItems && selectedItems.length > 0 ? '' : 'bg-gray-300 hover:bg-gray-400 cursor-not-allowed'}`} 
                                            raised 
                                            // disabled={!selectedItems || !selectedItems.length} 
                                        />


                            {/* <Button raised label={t("archive")} icon="pi pi-folder-open" className=" mr-2 bg-orange-600 hover:bg-orange-500 text-white py-2.5 px-4 rounded border border-transparent"
                                onClick={confirmArchiveSelected} disabled={!selectedItems || !selectedItems.length} /> */}
                            <Button raised label={t("Fusionner")} icon="pi pi-paperclip" className=" mr-2 bg-green-800 hover:bg-green-700 text-white py-2.5 px-4 rounded border border-transparent"
                                onClick={confirmMergeSelected} disabled={!selectedItems || !selectedItems.length} />
                            <Button raised label={t("parapher")} icon="pi pi-folder" className=" mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded border border-transparent"
                               onClick={() => {
                                showSaveModal();
                            }} disabled={!selectedItems || !selectedItems.length} /> 
                            <Button raised label={"Editer"} icon="pi pi-file-edit" className=" mr-2 bg-yellow-700 hover:bg-yellow-600 text-white py-2.5 px-4 rounded border border-transparent"
                                onClick={() => {showEditFileModal()}} 
                                disabled={!selectedItems || selectedItems.length !== 1} />
                                 <Button raised label={t("comparer")} icon="pi pi-folder" className=" mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded border border-transparent"
                               onClick={() => {
                                renderComparisonView();
                            }} disabled={!selectedItems || !selectedItems.length}  />

                            {/* <FindByNumeroEnregistrementButton/> */}
                        </>
                    ) : (
                        <Button raised label={t("delete")} icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteFinalSelected} disabled={!selectedItems || !selectedItems.length} />
                    )}
                         <SaveParapheur visible={showSaveDialogQuality} onClose={() => {
                            setShowSaveDialogQuality(false);
                            setSelectedItem(emptyItem);
                        }} showToast={toast}  selectedItems={selectedItems} update={update} 
                            t={t} />
                             <CompareDocument visible={showComparisonInterface} onClose={() => {
                            setShowComparisonInterface(false);
                           setSelectedItem(emptyItem);
                           setResultatComparaison('');
                        }} showToast={toast}  selectedItems={selectedItems} 
                        message={resultatComparaison}  t={t} />

                </div>
            </React.Fragment>
        );
    };
    const [dataTableSize, setDataTableSize] = useState();
    const handleCancelClick = async () => {
        const URL = `${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria${displaybutton ? '' : '/deleted'}`;
        if (reference !== '') {
            const requestBody = {
                referenceLike: reference
            };
            
            const response  = await axios.post(URL, requestBody);

            SetDataTable(response.data.list);
            setDataTableSize(response.data.dataSize)
        } else {
            console.error('Error fetching data:');
        }
    };
    const [startRef, setStartRef] = useState(0);
    const [onRowsRef, setOnRowsRef] = useState(10);
    const nextPageReference = async (event: PaginatorPageChangeEvent) => {
        if (reference != '') {
            const updatedCriteria = {
                referenceLike: reference,
                maxResults: event.rows,
                page: event.page,
            };

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, updatedCriteria);
                SetDataTable(response.data.list);
                setDataTableSize(response.data.dataSize);

                setStartRef(event.first);
                setOnRowsRef(event.rows);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const { documentTypes } = useDocTypeStore(state => ({ documentTypes: state.types }));
    const {documentStates } = useDocumentStateStore(state => ({documentStates: state.states }));
    const documentCategories = useDocCategorieStore(state => state.categories);
    const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
    const auth = new AuthService();
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
    const [restoreItemDialog, setRestoreItemDialog] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentDto | null>(null);
    const [findByCriteriaShow, setFindByCriteriaShow] = useState(false);

    const [username, setUsername] = useState("");
    const [data, setData] = useState([]);
    const [isAdmin, setisAdmin] = useState<boolean>();
    const roleConnectedUser = auth.getRoleConnectedUser();
    const [fetchHistoryInterface, setFetchHistoryInterface] = useState<boolean>();
    const dispatch = useDispatch();
    useEffect(() => {
        setUsername(auth.getUsername());
        if (roleConnectedUser === 'ROLE_ADMIN_FUNC') {
            setisAdmin(true);
        } else {
            setisAdmin(false);
        }
    }, [dispatch]);
    const showShareModal = (item: DocumentDto) => {
        setSelectedItem(item);
        setShowShareDialog(true);
    };
    const toastRef = useRef<Toast>(null);
    const showToast = (severity: SeverityType, summary: string) => {
        if (toastRef.current) {
            toastRef.current.show({ severity, summary, life: 4000 });
        }
    };
    const showRestoreItemDialog = (item: DocumentDto) => {
        setSelectedDocument(item);
        setRestoreItemDialog(true);
    };

    const fetchModificationHistory = async (item:DocumentDto) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/document-history/${item.reference}`);
            console.log('Réponse de l\'API :', response.data);
            await setData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        setFetchHistoryInterface(true);
        setSelectedItem(item);
    };
    const hideRestoreItemDialog = () => {
        setSelectedDocument(null);
        setRestoreItemDialog(false);
    };
    const hideLockItemDialog = () => {
        setSelectedDocument(null);
        setLockItemDialog(false);
    };
    const hideUnLockItemDialog = () => {
        setSelectedDocument(null);
        setUnLockItemDialog(false);
    };
    const restoreItemDialogFooter = (
        <>
            <Button raised label={t("no")} icon="pi pi-times" text onClick={hideRestoreItemDialog} />
            <Button raised label={t("yes")} icon="pi pi-check" onClick={() => handleRestoreConfirmation(selectedDocument!)} />
        </>
    );
    const lockItemDialogFooter = (
        <>
            <Button raised label={t("no")} icon="pi pi-times" text onClick={hideLockItemDialog} />
            <Button raised label={t("yes")} icon="pi pi-check" onClick={() => handleLockConfirmation(selectedItem)} />
        </>
    );
    const unlockItemDialogFooter = (
        <>
            <Button raised label={t("no")} icon="pi pi-times" text onClick={hideUnLockItemDialog} />
            <Button raised label={t("yes")} icon="pi pi-check" onClick={() => handleUnLockConfirmation(selectedItem)} />
        </>
    );
    const deleteFinalItemDialogFooter = (
        <>
            <Button raised label={t("no")} icon="pi pi-times" text onClick={hideDeleteFinalItemDialog} />
            <Button raised label={t("yes")} icon="pi pi-check" onClick={() => handleDeleteFinalConfirmation(selectedItems)} />
        </>
    );
    const handleRestoreConfirmation = (item: DocumentDto) => {
        restoreDocument(item);
        hideRestoreItemDialog();
    };
    const handleLockConfirmation = (item: DocumentDto) => {
        lockedDocument(item);
        hideLockItemDialog();
    };
    const handleUnLockConfirmation = (item: DocumentDto) => {
        unlockedDocument(item);
        hideUnLockItemDialog();
    };
    const handleDeleteFinalConfirmation = (items: DocumentDto[]) => {
        deleteFinalItems(items);
        hideDeleteFinalItemDialog();
    }

    const deleteFinalItems = (items: DocumentDto[]) => {
        axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/delete`, items)
            .then((response) => {
                showToast('success', 'Oprération faite avec succès');
                refreshTable && refreshTable();
            })
            .catch((error) => {
                console.error('Error saving item', error);
                showToast('error', 'Erreur lors de la Suppression.');
            });
    };
    const restoreDocument = (item: DocumentDto) => {
        axios.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/restore/${item.id}`,)
            .then((response) => {
                showToast('success', 'document restauré avec succès');
                refreshTable && refreshTable();
            })
            .catch((error) => {
                console.error('Error saving item', error);
                showToast('error', '*Erreur lors de modification.');
            });
    };
    const lockedDocument = (item: DocumentDto) => {
        axios.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/lock/${item.id}`,)
            .then((response) => {
                showToast('success', 'document verouiller avec succès');
                refreshTable && refreshTable();
            })
            .catch((error) => {
                console.error('Error saving item', error);
                showToast('error', 'Erreur lors de verouillage.');
            });
    };
    const unlockedDocument = (item: DocumentDto) => {
        axios.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/unlock/${item.id}`,)
            .then((response) => {
                showToast('success', 'document deverouiller avec succès');
                refreshTable && refreshTable();
            })
            .catch((error) => {
                console.error('Error saving item', error);
                showToast('error', 'Erreur lors de deverouillage.');
            });
    };
    const showMoveModal = (item: DocumentDto) => {
        setSelectedItem(item);
        setShowMoveDialog(true);
    };
    const [lockItemDialog, setLockItemDialog] = useState(false);
    const confirmLockItem = (item: DocumentDto) => {
        setSelectedItem(item);
        setLockItemDialog(true);
    };
    const [unlockItemDialog, setUnLockItemDialog] = useState(false);
    const confirmUnLockItem = (item: DocumentDto) => {
        setSelectedItem(item);
        setUnLockItemDialog(true);
    };
        const downloadFileById = async (id: string, versionId?: string): Promise<void> => {
            try {
                setLoadingDownloadMap((prev) => ({ ...prev, [id]: true }));
                const response = await axiosConfig.get(`${ADMIN_MINIO_BACKEND_URL}${NEXT_PUBLIC_DEFAULT_BUCKET}/file/download/${id}`, {
                    params: { versionId },
                    responseType: 'blob',
                });
        
                // Extract file name from Content-Disposition header
                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition
                    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                    : `${selectedItem.reference}.pdf`;
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                setLoadingDownloadMap((prev) => ({ ...prev, [id]: false }));
                showToast('success', 'document telecharger avec succès')
            } catch (error) {
                console.error('Error downloading the file:', error);
                showToast('error', 'Failed to download file. Please try again later.')
            }
        };
    const [loadingDownloadMap, setLoadingDownloadMap] = useState<{ [key: number]: boolean }>({});
    const actionBodyTemplate = (rowData: DocumentDto) => {
        const isLoading = loadingDownloadMap[rowData.referenceGed as any] || false;
        return (
            <div style={displaybutton ? { width: "300px" } : { width: "200px" }}>
                {displaybutton === true ? (
                    !rowData.documentPartageUtilisateurs ||
                    rowData.documentPartageUtilisateurs.some(item => (
                        item.accessShare?.libelle === 'All' &&
                        item.utilisateur?.username === username
                    ) ||
                        rowData.utilisateur?.username === username || isAdmin)
                ) && (
                        !rowData.documentPartageGroupes ||
                        rowData.documentPartageGroupes.some(item => (
                            item.accessShare?.libelle === 'All' &&
                            (item.groupe.groupeUtilisateurs.some(item => item.utilisateur?.username === username) || item.groupe.utilisateur?.username === username)
                        ) ||
                            rowData.utilisateur?.username === username || isAdmin)
                    ) ? (
                    <>

                        {!rowData.courrielRelated && <Button raised icon="pi pi-pencil" severity="warning" className="mr-1"
                            onClick={() => showEditModal(rowData)} />}
                        <Button raised icon="pi pi-clone" severity="help" className="mr-1"
                            onClick={() => fetchModificationHistory(rowData)} />
                        <Button raised icon="pi pi-trash" severity="danger" className="mr-1"
                            onClick={() => confirmDeleteItem(rowData)} />
                        <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                            onClick={() => showViewModal(rowData)} />
                        <Button raised icon="pi pi-share-alt" severity="success" className="mr-1"
                            onClick={() => showShareModal(rowData)} />
                        <Button raised icon="pi pi-download" severity="info" className="mr-1"
                            onClick={() => downloadFileById(rowData.referenceGed)} loading={isLoading} />
                        {!rowData.locked && rowData.utilisateur?.username === username ? (
                            <>
                                <Button raised icon="pi pi-lock-open" severity="info" className="mr-1"
                                    onClick={() => confirmLockItem(rowData)} style={{ background: "#1e76dd", borderColor: '#1e76dd' }} />
                            </>
                        ) : (rowData.locked ? (
                            <>
                                <Button raised icon="pi pi-lock" severity="danger" className="mr-1"
                                    onClick={() => confirmUnLockItem(rowData)} style={{ background: '#dd511e', borderColor: '#dd511e' }} />
                            </>
                        ) : (null))}

                    </>
                ) : (
                    !rowData.documentPartageUtilisateurs ||
                    rowData.documentPartageUtilisateurs.some(item => (
                        item.accessShare?.libelle === 'Ecriture' &&
                        item.utilisateur?.username === username
                    ) ||
                        rowData.utilisateur?.username === username)
                ) && (
                        !rowData.documentPartageGroupes ||
                        rowData.documentPartageGroupes.some(item => (
                            item.accessShare?.libelle === 'Ecriture' &&
                            (item.groupe.groupeUtilisateurs.some(item => item.utilisateur?.username === username) || item.groupe.utilisateur?.username === username)
                        ) ||
                            rowData.utilisateur?.username === username || isAdmin)
                    ) ? (
                    <>
                        <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                            onClick={() => showViewModal(rowData)} />
                        {!rowData.courrielRelated && <Button raised icon="pi pi-pencil" severity="warning" className="mr-1"
                            onClick={() => showEditModal(rowData)} />}
                    </>
                ) : (
                    !rowData.documentPartageUtilisateurs ||
                    rowData.documentPartageUtilisateurs.some(item => (
                        item.accessShare?.libelle === 'Partage' &&
                        item.utilisateur?.username === username
                    ) ||
                        rowData.utilisateur?.username === username || isAdmin)
                ) && (
                        !rowData.documentPartageGroupes ||
                        rowData.documentPartageGroupes.some(item => (
                            item.accessShare?.libelle === 'Partage' &&
                            (item.groupe.groupeUtilisateurs.some(item => item.utilisateur?.username === username) || item.groupe.utilisateur?.username === username)
                        ) ||
                            rowData.utilisateur?.username === username || isAdmin)
                    ) ? (
                    <>
                        <Button raised icon="pi pi-share-alt" severity="success" className="mr-1"
                            onClick={() => showShareModal(rowData)} />
                        <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                            onClick={() => showViewModal(rowData)} />
                        {!rowData.courrielRelated && <Button raised icon="pi pi-pencil" severity="info" className="mr-1"
                            onClick={() => showEditModal(rowData)} />}
                        <Button raised icon="pi pi-arrows-alt" severity="help" className="mr-1"
                            onClick={() => showMoveModal(rowData)} />
                        <Button raised icon="pi pi-download" severity="info" className="mr-1"
                            onClick={() => downloadFileById(rowData.referenceGed)} />
                    </>
                ) : (
                    <>
                        <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                            onClick={() => showViewModal(rowData)} />
                    </>
                ) : (
                    <>
                        <Button raised icon="pi pi-replay" severity="help" className="mr-1"
                            onClick={() => showRestoreItemDialog(rowData)} />
                        <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                            onClick={() => showViewModal(rowData)} />
                    </>
                )}
            </div>
        );
    };

    const [startCrt, setStartCrt] = useState(0);
    const [onRowsCrt, setOnRowsCrt] = useState(10);
    const [filtrerSize, setFiltrerSize] = useState(0);
    const [dataCriteria, setDataCriteria] = useState<any | null>(null);

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: searchKeyword ? items.length : searchKeywordIndex ? indexSearchSize : reference ? dataTableSize : criteria && dataCriteria && dataCriteria.length !== 0 ? filtrerSize : size })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText id='search' type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );
    const headerArchiveTable = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: documentsToArchive.length })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText id='searchArchive' type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );
    const handleCancelCrtClick = () => {
        setCriteria(emptyCriteria); 
        setReferences([]);
        setFindByCriteriaShow(false);
        setFiltrerSize(0);
        setDataCriteria(null);
    }
    const [references, setReferences] = useState<String[]>([]);
    const filterByCriteria = async() => {
        const updatedCriteria = {
            entiteAdministrative: { id: criteria.entiteAdministrative?.id },
            documentCategorie: { id: criteria.documentCategorie?.id },
            referenceLike: criteria?.referenceLike,
            annee: criteria?.annee,
            documentType: { id: criteria.documentType?.id },
            documentState: { id: criteria.documentState?.id },
            uploadDate: criteria.uploadDate,
            uploadDateFrom: criteria.uploadDateFrom,
            uploadDateTo: criteria.uploadDateTo,
        };  

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, updatedCriteria);
            setDataCriteria(response.data.list);
            setFiltrerSize(response.data.dataSize);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const filterByCriteriaMultiple = async () => {
        try {
            const referencesList = references.length > 0 ? references : [''];
            const updatedCriteriaList = referencesList.map(reference => ({
                entiteAdministratives: criteria.entiteAdministratives?.map(entity => ({ id: entity.id })) || [],
                documentCategories: criteria.documentCategories?.map(category => ({ id: category.id })) || [],
                referenceLike: reference || undefined,
                annee: criteria?.annee,
                documentType: { id: criteria.documentType?.id },
                documentState: { id: criteria.documentState?.id },
                uploadDate: criteria.uploadDate,
                uploadDateFrom: criteria.uploadDateFrom,
                uploadDateTo: criteria.uploadDateTo,
            }));
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-list-criteria`, 
                updatedCriteriaList
            );
    
            if(response){
                setDataCriteria(response.data.list);
                setFiltrerSize(response.data.dataSize);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const nextPagefilterByCriteria = async (event: PaginatorPageChangeEvent) => {
        const updatedCriteria = {
            entiteAdministrative: { id: criteria.entiteAdministrative?.id },
            documentCategorie: { id: criteria.documentCategorie?.id },
            referenceLike: criteria?.referenceLike,
            annee: criteria?.annee,
            documentType: { id: criteria.documentType?.id },
            documentState: { id: criteria.documentState?.id },
            uploadDate: criteria.uploadDate,
            uploadDateFrom: criteria.uploadDateFrom,
            uploadDateTo: criteria.uploadDateTo,
            maxResults: event.rows,
            page: event.page,
        };  

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, updatedCriteria);
            setDataCriteria(response.data.list);
            setFiltrerSize(response.data.dataSize);
            setStartCrt(event.first);
            setOnRowsCrt(event.rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const nextPagefilterByCriteriaMultiple = async (event: PaginatorPageChangeEvent) => {
        try {
            const referencesList = references.length > 0 ? references : [''];
            const updatedCriteriaList = referencesList.map(reference => ({
                entiteAdministratives: criteria.entiteAdministratives?.map(entity => ({ id: entity.id })) || [],
                documentCategories: criteria.documentCategories?.map(category => ({ id: category.id })) || [],
                referenceLike: reference || undefined,
                annee: criteria?.annee,
                documentType: { id: criteria.documentType?.id },
                documentState: { id: criteria.documentState?.id },
                uploadDate: criteria.uploadDate,
                uploadDateFrom: criteria.uploadDateFrom,
                uploadDateTo: criteria.uploadDateTo,
                maxResults: event.rows,
                page: event.page,
            }));  
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-list-criteria`, updatedCriteriaList);
            if(response){
                setDataCriteria(response.data.list);
                setFiltrerSize(response.data.dataSize);
                setStartCrt(event.first);
                setOnRowsCrt(event.rows);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleSearchInputChange = (currentTarget: any) => {
        setSearchKeyword(currentTarget.value);
    }
    const handleSearchIndexInputChange = () => {
        let c : DocumentCriteria= criteria;
        displaybutton?c.deleted = false:c.deleted = true;
        axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-keyword-index?keyword=${searchKeywordIndex}`, c)
            .then(({ data }) => {
                SetDataTableIndex(data.list);
                setindexSearchSize(data.list.length);
            }).catch(error => console.log(error));
    }
    const onInputNumerChangeArchive = (e: InputNumberChangeEvent, field: string) => {
        const val = e.value === null ? undefined  : +e.value;

        //const value = e.target.value;
    
        switch (field) {
            case 'ligne':
                setArchiveLine(val);
                break;
            case 'colonne':
                setArchiveColumn(val);
                break;
            case 'numBoite':
                setArchiveBoite(val);
                break;
            default:
                break;
        }
    };
        const handleStatusChange = (isClotureSuccess: boolean) => {
          if (isClotureSuccess) {
            refreshTable && refreshTable()
          }
        }
      
        const statusDocBodyTemplate = (rowData: any) => {
          return (
            <StatusDocDropdown
              rowData={rowData}
              documentStates={documentStates}
              refresh={() => { refreshTable && refreshTable() }}
              onStatusChange={handleStatusChange}  
            />
          );
        };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    {findByCriteriaShow && (
                        <Card className="mb-5">
                            <div className="grid">
                                <div className="flex flex-column col-4 p-fluid">
                                    <label className="mb-1" htmlFor="ref-search">{t("document.reference")}{"(s)"}</label>
                                        <Chips inputId='ref-search' className='w-full' value={references} onChange={(e) => setReferences(e.value as String[])} separator=',' placeholder='Inserer des references avec separateur "," ' />
                                    {/* <InputText id="1" value={criteria.referenceLike} onChange={(e) => setCriteria({ ...criteria, referenceLike: e.target.value })} /> */}
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="annee-search">Année de document</label>
                                    <Calendar
                                        inputId='annee-search'
                                        id="44"
                                        value={criteria.annee ? new Date(criteria.annee, 0) : null}
                                        onChange={(e) => {
                                            if (e.value instanceof Date) {
                                                const year = e.value.getFullYear();
                                                setCriteria({ ...criteria, annee: year });
                                            }
                                        }}
                                        view="year"
                                        dateFormat="yy"
                                        showIcon={true}
                                        showButtonBar
                                    />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="docCat-search">{t("document.documentCategoriePlaceHolder")}</label>
                                    {/* <Dropdown id="6" value={criteria.documentCategorie} options={documentCategories} onChange={(e) => setCriteria({ ...criteria, documentCategorie: e.target.value })} optionLabel="libelle" filter showClear /> */}
                                    <MultiSelect inputId='docCat-search' id='66' value={criteria.documentCategories} onChange={(e) => setCriteria({ ...criteria, documentCategories: e.value })} options={documentCategories} optionLabel="libelle" display="chip" 
                                        filter placeholder="Select Categories" maxSelectedLabels={3} className="w-full" />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="docType-search">{t("document.documentTypePlaceHolder")}</label>
                                    <Dropdown inputId='docType-search' id="6" value={criteria.documentType} options={documentTypes} onChange={(e) => setCriteria({ ...criteria, documentType: e.target.value })} optionLabel="libelle" filter showClear />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="docState-search">{t("document.documentStatePlaceHolder")}</label>
                                    <Dropdown inputId='docState-search' id="69" value={criteria.documentState} options={documentStates} onChange={(e) => setCriteria({ ...criteria, documentState: e.target.value })} optionLabel="libelle" filter showClear />
                                </div>
                                <div className="flex flex-column col-4 p-fluid">
                                    <label className="mb-1" htmlFor="docEntity-search">{t("document.entiteAdministrativePlaceHolder")}</label>
                                    {/* <Dropdown id="7" value={criteria.entiteAdministrative} options={entiteAdministratives} onChange={(e) => setCriteria({ ...criteria, entiteAdministrative: e.target.value })} optionLabel="libelle" filter showClear /> */}
                                    <MultiSelect inputId='docEntity-search' value={criteria.entiteAdministratives} onChange={(e) => setCriteria({ ...criteria, entiteAdministratives: e.value })} options={entiteAdministratives} optionLabel="libelle" display="chip" 
                                        filter placeholder="Select Entities" maxSelectedLabels={3} className="w-full" />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="docUploadDate-search">Min {t("document.uploadDate")}</label>
                                    <Calendar
                                        inputId='docUploadDate-search'
                                        value={criteria.uploadDateFrom}
                                        onChange={(e) => {
                                            if (e.value instanceof Date) {
                                                setCriteria({ ...criteria, uploadDateFrom: e.value });
                                            }
                                        }}
                                        dateFormat="dd/mm/yy"
                                        showIcon={true}
                                        showButtonBar
                                    />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="docUploadDatee-search">{t("document.uploadDate")}</label>
                                    <Calendar
                                        inputId='docUploadDatee-search'
                                        value={criteria.uploadDate}
                                        onChange={(e) => {
                                            if (e.value instanceof Date) {
                                                setCriteria({ ...criteria, uploadDate: e.value });
                                            }
                                        }}
                                        dateFormat="dd/mm/yy"
                                        showIcon={true}
                                        showButtonBar
                                    />
                                </div>
                                <div className="flex flex-column col-4">
                                    <label className="mb-1" htmlFor="docUploadDateee-search">Max {t("document.uploadDate")}</label>
                                    <Calendar
                                        inputId='docUploadDateee-search'
                                        value={criteria.uploadDateTo}
                                        onChange={(e) => {
                                            if (e.value instanceof Date) {
                                                setCriteria({ ...criteria, uploadDateTo: e.value });
                                            }
                                        }}
                                        dateFormat="dd/mm/yy"
                                        showIcon={true}
                                        showButtonBar
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                                <Button raised label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={filterByCriteriaMultiple} />
                                <Button raised label={t("cancel")} className="p-button-secondary mr-2" icon="pi pi-times" onClick={handleCancelCrtClick} />
                            </div>
                        </Card>
                    )}
                    <div className="grid">
                        <div className='flex flex-col col-12'>
                            <div className="flex flex-column col-4 mb-5">
                                <InputText className="p-inputtext-lg" id="11" value={searchKeyword} placeholder={t("document.rechercheParMotsCles")}
                                    onChange={({ currentTarget }) => handleSearchInputChange(currentTarget)} />
                            </div>
                            <div className="flex flex-column col-4 mb-5">
                                <div className="p-inputgroup">
                                    <InputText className="p-inputtext-lg" id="1" value={searchKeywordIndex} placeholder={t("document.rechercheParIndex")}
                                        onChange={(e) => setSearchKeywordIndex(e.target.value)} />
                                    <Button
                                        className="p-button-warning"
                                        icon="pi pi-search"
                                        onClick={handleSearchIndexInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row col-4 mb-5">
                                <div className="p-inputgroup">
                                    <InputText
                                        className="p-inputtext-lg"
                                        id="133"
                                        value={reference}
                                        placeholder={t("document.rechercheParRéférence")}
                                        onChange={(e) => setReference(e.target.value)}
                                    />
                                    <Button
                                        className="p-button-help"
                                        icon="pi pi-search"
                                        onClick={handleCancelClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                   
                    <div>
                    <DataTable ref={dt} emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>}
                    value={dataTable && dataTable.length !== 0 && reference != '' ? dataTable : dataCriteria && dataCriteria.length !== 0 && criteria ? dataCriteria : searchKeyword ? items : dataTableIndex && dataTableIndex.length !== 0 && searchKeywordIndex != '' ? dataTableIndex : selectedNodeData} 
                    selection={selectedItems}
                    onSelectionChange={(e) => {
                        setSelectedItems(e.value as DocumentDto[])
                    }} dataKey="id"
                    className="datatable-responsive" globalFilter={globalFilter} header={header}
                  style={{ maxWidth: 1400 , minWidth: 1200}}>
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                    <Column field="reference" header={t("document.reference")} body={
                        (rowData) => {
                            return (
                                <div className="flex justify-content-between">
                                    {rowData.courrielRelated && <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="pi pi-inbox mr-3" style={{ fontSize: '1em', color: '#61346c' }} />
                                        <span>{rowData.reference}</span>
                                    </div>}
                                    {!rowData.courrielRelated && <span>{rowData.reference}</span>}
                                </div>
                            )
                        }
                    } sortable ></Column>
                    <Column field="uploadDate" header={t("document.uploadDate")} sortable
                        body={formateDate("uploadDate")}></Column>
                    <Column field="documentType.libelle" header={t("document.documentType")} sortable hidden></Column>
                    <Column field="utilisateur.nom" header={t("document.utilisateur")} sortable body={(rowData) => {
                        if (rowData?.utilisateur?.nom) {
                            return (
                                <div className="flex align-items-center gap-2">
                                    <img alt="" src="/user-avatar.png" width="32" />
                                    <span className='font-bold'>{rowData.utilisateur.nom}</span>
                                </div>
                            )
                        }
                    }}></Column>
                    <Column field="documentCategorie.libelle" header={t("document.documentCategorie")}
                        sortable hidden></Column>
                    <Column field="documentState.libelle" header={t("document.documentState")} sortable
                        body={statusDocBodyTemplate}></Column>
                    <Column field="versionne" header={t("document.versionne")} body={CustomBooleanCell("versionne")}
                        sortable hidden></Column>
                    <Column field="entiteAdministrative.libelle" header={t("document.entiteAdministrative")}
                        sortable></Column>
                    <Column field="planClassement.libelle" header={t("document.classificationPlan")}
                        sortable></Column>
                    <Column field="referenceGed" header={t("document.referenceGed")} sortable hidden></Column>
                    <Column field="size" header={t("document.size")} sortable hidden></Column>
                    <Column field="annee" header={t("document.annee")} sortable hidden></Column>
                    <Column field="semstre" header={t("document.semstre")} sortable hidden></Column>
                    <Column field="mois" header={t("document.mois")} sortable hidden></Column>
                    <Column field="jour" header={t("document.jour")} sortable hidden></Column>
                    <Column field="ocr" header={t("document.ocr")} body={CustomBooleanCell("ocr")} sortable
                        hidden></Column>
                    <Column field="archive" header={t("document.archive")} body={CustomBooleanCell("archive")}
                        sortable hidden></Column>
                    <Column field="documentCategorieModel.libelle" header={t("document.documentCategorieModel")}
                        sortable hidden></Column>
                    <Column field="documentIndexElements" header={t("document.indexation")} body={(rowData) => {
                        if (rowData.documentIndexElements && rowData.documentIndexElements.length > 0) {
                            return (
                                <Tag value="Indexé" severity="success" />
                            )
                        } else {
                            return (
                                <Tag value="En Cours" severity="warning" />
                            )
                        }
                    }}
                        sortable></Column>
                    <Column header={t("actions")} body={actionBodyTemplate}></Column>
                </DataTable>
                    
                   
                    <div className="p-d-flex p-ai-center p-jc-between">
                        <Paginator 
                            onPageChange={searchKeyword ? onPage : reference ? nextPageReference : dataCriteria && dataCriteria.length > 0 ? nextPagefilterByCriteriaMultiple : nextPage} 
                            first={searchKeyword ? first : reference ? startRef : dataCriteria && dataCriteria.length > 0 ? startCrt : start} 
                            rows={searchKeyword ? rows : reference ? onRowsRef : dataCriteria && dataCriteria.length > 0 ? onRowsCrt : onRows} 
                            totalRecords={searchKeyword ? items.length : searchKeywordIndex ? indexSearchSize : reference ? dataTableSize : dataCriteria && dataCriteria.length > 0 ? filtrerSize : Number(size)} />
                    </div>
                    </div> 
                    
                    {fetchHistoryInterface && <History visible={fetchHistoryInterface} onClose={() => {
                        setFetchHistoryInterface(false);
                        setSelectedItem(emptyItem); refreshTable && refreshTable();
                    }} showToast={toast} selectedItem={selectedItem}  service={service}
                        t={t}   data ={data}/>}

                    <Create visible={showCreateDialog} onClose={() => { setShowCreateDialog(false); refreshTable && refreshTable(); }} add={add}
                        showToast={toast} list={items} service={service} t={t}  plan={plan} />
                    <Ai visible={showAIDialog} onClose={() => { setShowAIDialog(false); refreshTable && refreshTable(); }} add={add}
                        showToast={toast} list={items} service={service} t={t} />
                    <AddSummary visible={dialogAddVisible} onClose={() => { handleCloseDialog(); refreshTable && refreshTable() }} showToast={showToast} plan={plan} />
                    {/* <Add visible={dialogAddVisible} onClose={() => { handleCloseDialog(); refreshTable && refreshTable() }} add={add}
                        showToast={toast} list={items} service={service} t={t} /> */}
                    {showEditDialog && <Edit visible={showEditDialog} onClose={() => {
                        setShowEditDialog(false);
                        setSelectedItem(emptyItem); refreshTable && refreshTable();
                    }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service}
                        t={t} />}
                    {showDialogEditFile && <EditFile visible={showDialogEditFile} onClose={() => {
                        setShowDialogEditFile(false);
                        setSelectedItems([]); refreshTable && refreshTable();
                    }} showToast={toast} selectedItem={selectedItems[0]} update={update} list={items} service={service}
                        t={t} />}
                    <Scan visible={dialogScanVisible} onClose={() => { hideScanModal(); refreshTable && refreshTable() }} add={add}
                        showToast={toast} list={items} service={service} t={t} />
                    {showEditDialog && <Edit visible={showEditDialog} onClose={() => {
                        setShowEditDialog(false);
                        setSelectedItem(emptyItem); refreshTable && refreshTable();
                    }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service}
                        t={t} />}
                    {showMoveDialog && <Move visible={showMoveDialog} onClose={() => {
                        setShowMoveDialog(false);
                        setSelectedItem(emptyItem); refreshTable && refreshTable();
                    }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service}
                        t={t} />}
                    {showMoveDialogDocs && <MoveDocs visible={showMoveDialogDocs} onClose={() => {
                        setShowMoveDialogDocs(false);
                        setSelectedItem(emptyItem);
                        refreshTable && refreshTable();
                    }} showToast={toast} selectedItem={selectedItem} selectedItems={selectedItems} update={update} list={items} service={service}
                        t={t} />}
                    {showShareDialog && <Share visible={showShareDialog} onClose={() => {
                        setShowShareDialog(false);
                        setSelectedItem(emptyItem);
                    }} showToast={toast} selectedItem={selectedItem} update={update} list={items} service={service}
                        t={t} />}

                    {showViewDialog && <View visible={showViewDialog} onClose={() => {
                        setShowViewDialog(false);
                        setSelectedItem(emptyItem);
                    }} selectedItem={selectedItem} t={t} showToast={toast} />}
                    <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("document.deleteDocumentConfirmationMessage")}</span>)}
                        </div>
                    </Dialog>
                    <Dialog visible={lockItemDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={lockItemDialogFooter} onHide={hideLockItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>Voulez vous vraiment verrouiller ce document ?</span>)}
                        </div>
                    </Dialog>
                    <Dialog visible={unlockItemDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={unlockItemDialogFooter} onHide={hideUnLockItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>Voulez vous vraiment déverrouiller ce document ?</span>)}
                        </div>
                    </Dialog>
                    <Dialog visible={restoreItemDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={restoreItemDialogFooter} onHide={hideRestoreItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedDocument && (<span>Voulez vous vraiment restaurer ce document ?</span>)}
                        </div>
                    </Dialog>
                    <Dialog visible={deleteFinalItemsDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={deleteFinalItemDialogFooter} onHide={hideDeleteFinalItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Voulez vous vraiment supprimer les documents selectionnés ?</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirmation" modal
                        footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && <span>{t("document.deleteDocumentsConfirmationMessage")}</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={mergeItemsDialog} style={{ width: '450px' }} header="Confirmation" modal
                        footer={mergeItemsDialogFooter} onHide={hideMergeItemsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && <span>{t("Are you sure you want to merge this document ?")}</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={archiveItemsDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={archiveItemsDialogFooter} onHide={hideArchiveItemsDialog}>
                        <div className="flex align-items-center justify-content" style={{ marginBottom: '4rem' }}>
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("Voulez vous vraiment Archiver définitivement les documents selectionnés ?")}</span>)}                           
                        </div>
                    </Dialog>
                    <Dialog visible={archiveCheckDialog} style={{ width: '450px' }} header={t("Archivage refusé")} modal
                        footer={archiveCheckDialogFooter} onHide={() => setArchiveCheckDialog(false)}>
                        <div className="flex align-items-center justify-content" style={{ marginBottom: '2rem' }}>
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("Assurez-vous que tous les documents sont clôturé")}</span>)}                           
                        </div>
                    </Dialog>
                    <Dialog visible={archiveInterItemsDialog} style={{ width: '450px' }} header={t("confirm")} modal
                        footer={archiveInterItemsDialogFooter} onHide={() => setArchiveInterItemsDialog(false)}>
                        <div className="flex align-items-center justify-content" style={{ marginBottom: '2rem' }}>
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("Voulez vous vraiment Archiver les documents selectionnés ?")}</span>)}                           
                        </div>
                    </Dialog>
                    <Dialog visible={archivePhysiqueItemsDialog} style={{ width: '790px' }} header={t("confirm")} modal
                        footer={archivePhysiqueItemsDialogFooter} onHide={hideArchivePhysiqueItemsDialog}>
                        <div className="flex align-items-center justify-content" style={{ marginBottom: '4rem' }}>
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {item && (<span>{t("Veuillez saisir les coordonnées de l'archive physique des documents sélectionnés.")}</span>)}
                            </div>
                            <div className="flex align-items-center justify-content-center" style={{ marginTop: '2rem' }}>
                                <div className="field mr-2">
                                <label htmlFor="ligne">{t("document.line")}</label>

                                    <InputNumber
                                        id="ligne"
                                        placeholder={t("document.line")}
                                        name="ligne"
                                        showButtons
                                        min={0}
                                        value={archiveLine}
                                        onChange={(e) => onInputNumerChangeArchive(e, 'ligne')}
                                    />
                                </div>
                                <div className="field mr-3">
                                <label htmlFor="ligne">{t("document.colonne")}</label>
                                    <InputNumber
                                        id="colonne"
                                        placeholder={t("document.colonne")}
                                        name="colonne"
                                        showButtons
                                        min={0}
                                        value={archiveColumn}
                                        onChange={(e) => onInputNumerChangeArchive(e, 'colonne')}
                                    />
                                </div>
                                <div className="field mr-3">
                                <label htmlFor="ligne">{t("document.boite")}</label>
                                    <InputNumber
                                        id="numBoite"
                                        placeholder={t("document.boite")}
                                        name="numBoite"
                                        showButtons
                                        min={0}
                                        value={archiveBoite}
                                        onChange={(e) => onInputNumerChangeArchive(e, 'numBoite')}
                                    />
                                </div>
                                
                        </div>
                    </Dialog>
                    <Toast ref={toastRef} />
                </div>
            </div>
        </div>
    );
};
export default List;

