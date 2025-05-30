import axiosInstance from 'app/axiosInterceptor';
import View from 'app/component/admin/view/doc/document/view/document-view-admin.component';
import useListHook from 'app/component/zyhook/useListhook';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { DocumentDto } from 'app/controller/model/Document.model';
import { ArchiveDto } from 'app/controller/model/DocumentArchive.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import axios from 'axios';
import { set } from 'date-fns';
import { tr } from 'date-fns/locale';
import jsPDF from 'jspdf';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { SplitButton } from 'primereact/splitbutton';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree'
import TreeNode from 'primereact/treenode';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
interface Node {

    key: string;
    label: string;
    children?: Node[];
    archive?: boolean;
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const index = () => {
    const emptyItem = new DocumentDto();
    const emptyCriteria = new DocumentCriteria();
    const service = new DocumentAdminService();

    const { t } = useTranslation();

    const {
        items,
        showSearch,
        deleteItemDialog,
        item,
        selectedItems,
        setSelectedItems,
        hideDeleteItemDialog,
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
        confirmDesrchiveSelected,
        desarchiveItemsDialogFooter,
        desarchiveItemsDialog,
        setDesarchiveItemsDialog,
        hideArchiveItemsDialog,
        hidedesarchiveItemsDialog,
        totalRecords,
        criteria,
        setCriteria,
        first,
        fetchItems,
        toast,
        dt,
        confirmDeleteSelected,
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
        deleteItemsDialog,
        deleteItemsDialogFooter,
        hideDeleteItemsDialog,
        fetchItemsFromElastic,
    } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t });
    const [plans, setPlans] = useState<Node[]>([]);
    const [clickedNode, setClickedNode] = useState<Node | null>(null);
    const [dataSize, SetDataSize] = useState<Number>(0);
    const [idPlanArchive, setIdPlanArchive] = useState<Number>();
    const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
    const [nodeToArchiver, setNodeToArchiver] = useState<TreeNode | null>(null);
    const [confirmationVisibleArchive, setConfirmationVisibleArchive] = useState(false);
    const toastRef = useRef<Toast>(null);
    const [displaybutton, setDisplayButton] = useState<boolean>(true);
    const [idN, setIdN] = useState<number>(0);


    const showToast = (severity: SeverityType, summary: string) => {
        if (toastRef.current) {
            toastRef.current.show({ severity, summary, life: 4000 });
        }
    };

    useEffect(() => {
        refreshPlans();
    }, []);
    const [start, setStart] = useState(0);
    const [onRows, setOnRows] = useState(5);
    const actionBodyTemplate = (rowData: DocumentDto) => {
        return (
            <div style={{ width: "150px" }}>
                <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                    onClick={() => showViewModal(rowData)} />
            </div>
        );
    };

    const fetchDataForNode = async (id: Number) => {
        try {
            const requestBody = {
                planClassement: { id }, maxResults: onRows
            };
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-archive-criteria`, requestBody);

            setSelectedNodeData(response.data.list);
            SetDataSize(response.data.dataSize);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshPlans = () => {
        axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list`)
            .then(response => {
                const processedNodes = new Set<string>();
                const filteredPlans = response.data.map((child: any) => convertToTreeNode(child, processedNodes)).filter((node): node is Node => node !== null);
                // const filteredPlans = response.data.map(convertToTreeNodeArchive).filter((node): node is Node => node !== null);
                setPlans(filteredPlans);
            }
            )
            .catch(error => console.error('Erreur lors du chargement des plans', error));
    };

    const convertToTreeNodeChild = (data: any, processedNodes: Set<string>): Node | null => {
        const key = data.id.toString();

        // Check if the node has already been processed
        if (processedNodes.has(key)) {
            return null;
        }
        const treeNode: Node = {
            key: data.id.toString(),
            label: data.libelle,
            archive: data.archive,
        };
        processedNodes.add(key);
        if (data.children && data.children.length > 0) {
            treeNode.children = data.children.map((child: any) => convertToTreeNodeChild(child, processedNodes)).filter((node: any): node is Node => node !== null);
        }

        return treeNode;
    }
    const convertToTreeNode = (data: any, processedNodes: Set<string>): Node | null => {
        // if (data.archive === false) {
        //     return null;
        // }
        const key = data.id.toString();

        // Check if the node has already been processed
        if (processedNodes.has(key)) {
            return null;
        }
        const treeNode: Node = {
            key: data.id.toString(),
            label: data.libelle,
            archive: data.archive,
        };
        processedNodes.add(key);

        if (data.children && data.children.length > 0) {
            treeNode.children = data.children.map((child: any) => convertToTreeNodeChild(child, processedNodes)).filter((node: any): node is Node => node !== null);
        }

        return treeNode;
    };
    
    const handleNodeClick = (node: TreeNode) => {
        setClickedNode((prevClickedNode) => {
            if (prevClickedNode && prevClickedNode.key === node.key) {
                return null;
            } else {
                return node as Node;
            }
        });

        const fetchData = async () => {
            const id = Number(node.key);
            setIdPlanArchive(id);
            await fetchDataForNode(id);
        };
        setIdN(node.key as number);

        fetchData();
    };
    const [archiveItemsDialog, setArchiveItemsDialog] = useState(false);

    const archiveSelectedItems = async () => {
        service.archiveList(selectedItems).then(data => {
            if (data.status == 200) {
                fetchDataForNode(idN);
                setArchiveItemsDialog(false);
                showToast('success', t('Archivage Finale  \' Opération faite avec success'));

            }
        }).catch(() => {
            showToast('error', t('Une erreur s \'est produite, veuillez réessayer ultérieurement'))
        });
    };

    const confirmArchiveSelected = () => {
        setArchiveItemsDialog(true);
    };

    const handleArchiveAction =() => {
            confirmArchiveSelected();

       
    };
    const nextPage = async (event: PaginatorPageChangeEvent) => {
        try {
            const requestBody = {
                planClassement: { idPlanArchive },
                maxResults: event.rows,
                page: event.page
            };
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody);

            // Utilisation des fonctions de mise à jour d'état
            setSelectedNodeData(response.data.list);
            SetDataSize(response.data.dataSize);

            setStart(event.first);
            setOnRows(event.rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleReload = (node: TreeNode) => {
        setNodeToArchiver(node);
        setConfirmationVisibleArchive(true);
    };
    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        const isClickedNode = clickedNode && clickedNode.key === node.key;

        return (
            <div className='cursor-pointer'>
                <i
                    className="pi pi-bookmark-fill"
                    style={{ marginRight: '0.5rem', color: '#49509f', fontSize: '18px' }} />
                <span style={{ color: '#49509f', fontWeight: 'normal', marginRight: '0.8rem', fontSize: '16px' }} >{node.label}</span>
                {isClickedNode && clickedNode.archive && (
                    <div style={{ float: 'right' }}>
                        <Button icon="pi pi-replay" onClick={() => handleReload(node)} className="p-button-warning" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
                    </div>
                )}
            </div>
        );
    };
    const cancelArchive = () => {
        setNodeToArchiver(null);
        setConfirmationVisibleArchive(false);
    };
    const confirmArchive = () => {
        if (nodeToArchiver) {
            const id = Number(nodeToArchiver.key);
            axiosInstance.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/restaurer/${id}`)
                .then(response => {
                    refreshPlans();
                    setConfirmationVisibleArchive(false);
                    showToast('success', t('success.documentsRestoreArchiveSuccess'));
                })
                .catch(error => {
                    console.error('Error archive item', error);
                    setConfirmationVisibleArchive(false);
                    showToast('error', 'Impossible d\'archiver le plan de classement car il contient des documents.');
                });
        }
        setNodeToArchiver(null);
        setConfirmationVisibleArchive(false);
    };
    const desarchiver = () => {
        service.desarchiveList(selectedItems).then(data => {
            if (data.status == 200) {
                fetchDataForNode(idN);
                setDesarchiveItemsDialog(false);
                showToast('success', t(' documents desarchive avec Success'));
            }
        }).catch(() => {
            showToast('error', t('Une erreur s \'est produite, veuillez réessayer ultérieurement'))
            
        });
        
    }


    const generateDocToArchiveFinale  = async () => {
       
        const documents = (await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/toArchiveFinale`)).data;
    
        const doc = new jsPDF();
        const title = 'Les documents à archiver définitivement';
    
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
        doc.text(title, 50, 30);
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

    const generateDoctoDestruction  = async () => {
       
        const documents = (await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/toDestruction`)).data;
    
        const doc = new jsPDF();
        const title = 'Les documents à détruire';
    
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

    
    const generateDocArchivesFinale = async () => {
       
        const archive = (await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/ArchiveFinale`)).data;
    
        const doc = new jsPDF();
        const title = 'Les documents à détruire';
    
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
    
        const headers = [["ID", "reference", "Date d'archivage", "colonne", "ligne"]];
    
        const data = archive.map((archive: ArchiveDto) => {

            if (Array.isArray(archive.createdOn) && archive.createdOn.length >= 6) {
                const [year, month, day, hour, minute, second] = archive.createdOn;
                const date = new Date(year, month - 1, day, hour, minute, second);
            
                if (!isNaN(date.valueOf())) {
                    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                    return [archive.id, archive.reference, formattedDate, archive.colonne, archive.ligne];
                } else {
                    console.error("La date créée est invalide.");
                    return [archive.id, archive.reference, "Date invalide", archive.colonne, archive.ligne];
                }
            } else {
                console.error("archive.createdOn n'est pas un tableau valide ou ne contient pas assez d'éléments.");
                return [archive.id, archive.reference, "", archive.colonne, archive.ligne];
            }
            

        });
    
        let content = {
            startY: 50,
            head: headers,
            body: data
        };
    
        doc.autoTable(content);
        doc.save('Documents_Archives_Finale.pdf');
    }

    const archiveItemsDialogFooter = (<>
        <Button raised label={t("no")} icon="pi pi-times" text onClick={hideArchiveItemsDialog} />
        <Button raised label={t("yes")} icon="pi pi-check" onClick={archiveSelectedItems } />
    </>
    );


    const archiveFinalButtonitems = [
  
        {
            label: "Documents a archiver definitivement", 
            icon: 'pi pi-file-export',
            command: () => {
                generateDocToArchiveFinale();
            },
            disabled: false // Active cette option

        },
        {
            label: "Documents à détruire",
            icon: 'pi pi-file-export',
            command: () => {
                generateDoctoDestruction();
            },
            disabled: false // Active cette option

        },

        {
            label: "Documents archivés définitivement ",
            icon: 'pi pi-file-export',
            command: () => {
                generateDocArchivesFinale();
            },
            disabled: false // Active cette option

        },
    ]

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    {displaybutton === true ? (
                        <>
                                <SplitButton 
                                            label={t("archive")} 
                                            icon="pi pi-folder-open" 
                                            onClick={() => {
                                                if (selectedItems && selectedItems.length > 0) {
                                                  
                                                    handleArchiveAction();
                                                }
                                            }} 
                                            model={archiveFinalButtonitems} 
                                            severity='warning' 
                                            className={`mr-2 ${selectedItems && selectedItems.length > 0 ? '' : 'bg-gray-300 hover:bg-gray-400 cursor-not-allowed'}`} 
                                            raised 
                                        />


                            {/* <Button raised label={t("archive")} icon="pi pi-folder-open" className=" mr-2 bg-orange-600 hover:bg-orange-500 text-white py-2.5 px-4 rounded border border-transparent"
                               onClick={handleArchiveAction} 
                                disabled={!selectedItems || !selectedItems.length} /> */}
                        </>
                    ) : null

                    }

                    {displaybutton === true ? (
                        <Button raised label={t("Désarchiver")} icon="pi pi-folder-open" className="mr-2 bg-green-600 hover:bg-green-500 text-white py-2.5 px-4 rounded border border-transparent"
                        onClick={() => {
                            desarchiver();
                        }} disabled={!selectedItems || !selectedItems.length} />
                    ) : null

                    }

                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t("document.header", { totalRecords: dataSize })}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder={t("search")} />
            </span>
        </div>
    );
    return (
        <div>
            <div className='flex flex-row'>
                <h2 className='mr-8'>{t("document.gestionArchive")}</h2>
            </div>
            <div className='flex flex-row'>
                <Tree
                    value={plans} nodeTemplate={nodeTemplate}
                    className='tree-container '
                    onNodeClick={(e) => handleNodeClick(e.node)}
                    filter filterMode="strict" filterPlaceholder="Recherche par libellé" 

                />
                <div className="grid crud-demo">
                    <div className="col-12">
                        <div className="card">
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                            <DataTable ref={dt} emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>} value={selectedNodeData} selection={selectedItems}
                                onSelectionChange={(e) => setSelectedItems(e.value as DocumentDto[])} dataKey="id"
                                header={header} globalFilter={globalFilter}
                                className="datatable-responsive"
                                responsiveLayout="scroll" style={{ maxWidth: 1400 }}>
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                                <Column field="reference" header={t("document.reference")} sortable></Column>
                                <Column field="uploadDate" header={t("document.uploadDate")} sortable
                                    body={formateDate("uploadDate")}></Column>
                                <Column field="documentType.libelle" header={t("document.documentType")} sortable hidden></Column>
                                <Column field="ligne" header={t("document.line")} sortable></Column>
                                <Column field="colonne" header={t("document.colonne")} sortable></Column>
                                <Column field="numBoite" header={t("document.boite")} sortable></Column>


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
                                    body={(rowData) => statusBodyTemplate(rowData.documentState?.libelle, rowData.documentState?.style)}></Column>
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
                                <Paginator onPageChange={nextPage} first={start} rows={onRows} totalRecords={dataSize as number} />
                            </div>
                            {showViewDialog && <View visible={showViewDialog} onClose={() => {
                                setShowViewDialog(false);
                                setSelectedItem(emptyItem);
                            }} selectedItem={selectedItem} t={t} showToast={toast} />}
                            <Dialog visible={archiveItemsDialog} style={{ width: '450px' }} header={t("confirm")} modal
                                footer={archiveItemsDialogFooter} onHide={hideArchiveItemsDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {item && (<span>{t("Voulez vous vraiment Archiver définitivement le document selectionné ?")}</span>)}
                                </div>
                            </Dialog>
                            <Dialog visible={desarchiveItemsDialog} style={{ width: '450px' }} header={t("confirm")} modal
                                footer={desarchiveItemsDialogFooter} onHide={hidedesarchiveItemsDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {item && (<span>{t("Voulez vous vraiment desarchiver le document selectionné ?")}</span>)}
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toastRef} />
            <ConfirmDialog
                visible={confirmationVisibleArchive}
                onHide={cancelArchive}
                message={t('document.archiveConfirmationMessage')}
                header={t('document.archiveConfirmation')}
                icon="pi pi-exclamation-triangle"
                acceptLabel={t('yes')}
                rejectLabel={t('no')}
                acceptClassName="p-button-danger"
                rejectClassName="p-button-secondary"
                accept={confirmArchive}
                reject={cancelArchive}
            />
        </div>
    )
}

export default index