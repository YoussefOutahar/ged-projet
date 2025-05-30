import axiosInstance from 'app/axiosInterceptor';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import { OrderList } from 'primereact/orderlist';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { useTranslation } from 'react-i18next';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import useListHook from 'app/component/zyhook/useListhook';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import View from 'app/component/admin/view/doc/document/view/document-view-admin.component';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Toolbar } from 'primereact/toolbar';

import { EchantillonDto } from 'app/controller/model/DocumentEchantillon.model';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const Echantillonnage = () => {
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
        fetchItemsFromElastic
    } = useListHook<DocumentDto, DocumentCriteria>({ emptyItem, emptyCriteria, service, t});

  const [valideEchantillonDialog, setvalideEchantillonDialog] = useState(false);
  const [valideEchantillonNoteDialog, setvalideEchantillonNoteDialog] = useState(false);
  const [deleteEchantillonDialog, setdeleteEchantillonDialog] = useState(false);
  
  const [echantillon, setEchantillon] = useState<EchantillonDto[]>([]);  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [dataSize,SetDataSize] = useState<Number>(0);
  const toastRef = useRef<Toast>(null);
  const [start, setStart] = useState(0);
  const [onRows, setOnRows] = useState(8);
  const [selectedEchantillon, setSelectedEchantillon] = useState<EchantillonDto>();
  const [notes, setNotes] = useState<string>('');
  const confirmEchantillon = () => {
    setvalideEchantillonDialog(true);
  };
  const hideEchantillonItemsDialog = () => {
    setvalideEchantillonDialog(false);
  };
  const confirmEchantillonNote = (item:any) => {
    setNotes(item.note)
    setvalideEchantillonNoteDialog(true);
  };
  const hideEchantillonNoteDialog = () => {
    setvalideEchantillonNoteDialog(false);
  };
  const confirmEchantillonDelete= () => {
    setdeleteEchantillonDialog(true);
  };
  const hideEchantillonDeleteDialog = () => {
    setdeleteEchantillonDialog(false);
  };
  const handleEyeClick = async (selectedEchantillon: any) => {
    const documentIds = selectedEchantillon.documents.map((doc: any) => doc.id);
    await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, {
      idsIn: documentIds,
      maxResults:onRows,
    })
    .then((response) => {
      setSelectedDocuments(response.data.list);
      SetDataSize(response.data.dataSize);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
    setSelectedEchantillon(selectedEchantillon);
  };
  const showToast = (severity: SeverityType, summary: string) => {
    if (toastRef.current) {
        toastRef.current.show({ severity, summary, life: 4000 });
    }
  };

  const refresh = () =>{
    axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/List/echantillons`)
      .then((response)=> {
        setEchantillon(response.data);
        //showToast("success", "Echantillon recuperé avec succès");
      })
      .catch(error => {
        console.error('Erreur lors de la recuperation de la liste de l\'échantillon:', error);
        showToast("error", "Erreur lors de la recuperation de l'échantillon");
      });
  };
  useEffect(()=>{
    refresh();
  },[])
  const actionBodyTemplate = (rowData: DocumentDto) => {
    return (
        <div style={{ width: "150px" }}>
            <Button raised icon="pi pi-eye" severity="secondary" className="mr-1"
                onClick={() => showViewModal(rowData)} />
        </div>
    );
  };
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">{t("document.header", { totalRecords: dataSize})}</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                placeholder={t("search")} /> 
        </span>
    </div>
  );
  const nextPage = async (event: PaginatorPageChangeEvent) => {
    try {
      const documentIds = selectedEchantillon?.documents.map((doc: any) => doc.id);
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, {
        idsIn: documentIds,
        maxResults:event.rows,
        page: event.page
      });

      setSelectedDocuments(response.data.list);
      SetDataSize(response.data.dataSize);

      setStart(event.first);
      setOnRows(event.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Calculer le nombre de documents de qualité true pour chaque échantillon
  const calculateQualityTrueCount = (echantillon: any[]): number[] => {
    return echantillon.map((item) => {
      const qualityTrueCount = item.documents.reduce((count: number, doc: any) => {
        if (doc.qualityStatus === true) {
          count++;
        }
        return count;
      }, 0);
      return qualityTrueCount;
    });
  };
  const echantillonCount = (echantillon: any[]): number[] => {
    return echantillon.map((item) => {
      const qualityCount = item.documents.reduce((count: number, doc: any) => {

        count++;
        return count;
      }, 0);
      return qualityCount;
    });
  };

  const confirmEchantillonSelected = () => {
    axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/quality/multiple`, selectedItems)
      .then(response => {
        showToast('success', 'status modifié avec succcess');
        handleEyeClick(selectedEchantillon);
        refresh();
      })
      .catch(error => console.error('Error loading echnatillon', error));
  }
  const validateLotSelected = async () => {
    try {
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/quality-validator/${selectedEchantillon?.id}`);
      if (response.data.echantillonState === 'REJECT') {
        showToast('error', 'L\'échantillon est rejeté');
        hideEchantillonItemsDialog();
        confirmEchantillonNote(response.data);
      } else {
        showToast('success', 'Echantillon validé avec succès');
        hideEchantillonItemsDialog();
        refresh();
      }
    } catch (error) {
      console.error('Error loading echantillon', error);
      showToast('error', 'Erreur lors de la validation de l\'échantillon');
    }
  };
  const sendNote = async () => {
    try {
      await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/quality-note/${selectedEchantillon?.id}/?note=${notes}`,).then(response => {
        showToast('success', 'Note est ajouté avec succès');
        hideEchantillonNoteDialog();
        refresh();

      });
      //handleEyeClick(selectedEchantillon);
    } catch (error) {
      console.error('Error loading echantillon', error);
      showToast('error', 'Erreur lors de la validation de l\'échantillon');
    }
  };
  const rejectEchantillonSelected = () => {
    axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/reject/multiple`, selectedItems)
      .then(response => {
        showToast('success', 'status modifié avec succcess');
        handleEyeClick(selectedEchantillon);
        refresh();
      })
      .catch(error => console.error('Error loading echnatillon', error));
  }
  const deleteEchantillon = async () => {
    try {
      await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/quality-delete/${selectedEchantillon?.id}`,).then(response => {
        
        showToast( `success`,  `L\'échantillon ${selectedEchantillon?.nomEchantillon}  a été supprimé avec succès `);
        hideEchantillonDeleteDialog();
        setSelectedDocuments([]);

        refresh();

      });
      //handleEyeClick(selectedEchantillon);
    } catch (error) {
      console.error('Error Deleting echantillon', error);
      showToast( `error`,  `Erreur lors de la suppression de l\'échantillon ${selectedEchantillon?.nomEchantillon}`);

    }
  };

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                    <>
                        <Button raised label="Valider" icon="pi pi-check-circle" severity="success" className=" mr-2"
                            onClick={confirmEchantillonSelected} disabled={!selectedItems || !selectedItems.length} />
                        <Button raised label="Reject" icon="pi pi-check-circle" severity="danger" className=" mr-2"
                            onClick={rejectEchantillonSelected} disabled={!selectedItems || !selectedItems.length} />
                    </>
            </div>
        </React.Fragment>
    );
  };
  let qualityCounts = echantillonCount(echantillon);

  // Appeler la fonction pour obtenir le nombre de documents de qualité true pour chaque échantillon
  let qualityTrueCounts = calculateQualityTrueCount(echantillon);
  const handleReloadButtonClick = ()=> {
    refresh();
    qualityTrueCounts = calculateQualityTrueCount(echantillon);
    let qualityCounts = echantillonCount(echantillon);

  }
  const valideEchantillonDialogFooter = (<>
    <Button raised label={t("no")} icon="pi pi-times" text onClick={hideEchantillonItemsDialog} />
    <Button raised label={t("yes")} icon="pi pi-check" onClick={validateLotSelected} />
  </>
  );
  const valideEchantillonNoteDialogFooter = (<>
    <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideEchantillonNoteDialog} />
    <Button raised label={t("save")} icon="pi pi-check" onClick={sendNote} />
  </>
  );
  const deleteEchantillonDialogFooter = (<>
    <Button raised label={t("cancel")} icon="pi pi-times" text onClick={hideEchantillonDeleteDialog} />
    <Button raised label={t("delete")} icon="pi pi-check" onClick={deleteEchantillon} />
  </>
  );
  
  return (
    <div>
      <div className="p-d-flex p-ai-center">
        <div className='flex flex-row gap-4'>
          <div className="p-col-4" >
            <OrderList
              value={echantillon}
              itemTemplate={(item) => {
                const index = echantillon.indexOf(item);
                return (  
                <div className="flex p-2 align-items-center gap-3"
                  onClick={() => handleEyeClick(item)}
                  style={{
                    backgroundColor:
                      selectedEchantillon && selectedEchantillon === item
                        ? item.echantillonState === 'valid'
                          ? '#C5DFB9'
                          : item.echantillonState === 'reject'
                            ? '#EEADAD'
                            : item.echantillonState === 'en_cours'
                              ? '#F9CB9C'
                              : 'inherit'
                        : item.echantillonState === 'valid'
                          ? '#DAEAD2'
                          : item.echantillonState === 'reject'
                            ? '#f8d7da'
                            : item.echantillonState === 'en_cours'
                              ? '#FBDDC0'
                              : 'inherit',
                  }}
                >
                {/* <img className="w-4rem shadow-2 flex-shrink-0 border-round" src="/echantillon.png" /> */}
                  <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span style={{ marginRight: '10px' }} className='text-base'>{item.nomEchantillon}</span>  
                  </div>
                  <span className="font-bold text-900">{qualityTrueCounts[index]}/{qualityCounts[index]}</span>
                  <Button raised icon="pi pi-eye" severity="help" className="mr-1"
                    onClick={() => handleEyeClick(item)} />
                  <Button raised icon="pi pi-check-square" severity="success" className="mr-1"
                    onClick={() => confirmEchantillon()} />
                  {item.echantillonState === 'reject' && (
                    <Button raised icon="pi pi-comment" severity="info" className="mr-1"
                      onClick={() => confirmEchantillonNote(item)} />
                  )}
                  {item.echantillonState === 'en_cours' && (
                    <Button raised icon="pi pi-trash" severity="danger" className="mr-1"
                      onClick={() => confirmEchantillonDelete()} />
                  )} 

                </div>
              )}}
              filter filterBy="nomEchantillon"
              header={
                <div className="flex flex-wrap p-2 align-items-center gap-8 ml-2">
                    <span>Ordered Echantillons</span>
                    <Button icon="pi pi-refresh" onClick={handleReloadButtonClick} />
                </div>
              }
              style={{width:'550px'}}
            />
          </div>
          <div className="p-col-6">
            {selectedEchantillon && 
            <div  className='card mb-4'>
             <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
              <DataTable ref={dt} emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>} value={selectedDocuments}
                onSelectionChange={(e) => setSelectedItems(e.value as DocumentDto[])} dataKey="id" globalFilter={globalFilter} header={header}
                className="datatable-responsive" selection={selectedItems}
                responsiveLayout="scroll" style={{minWidth:1000}}>
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                <Column field="reference" header={t("document.reference")} sortable className="font-bold"></Column>
                 <Column field="uploadDate" header={t("document.uploadDate")} sortable
                    body={formateDate("uploadDate")}></Column> 
                <Column field="planClassement.libelle" header={t("document.classificationPlan")}
                  sortable></Column>
                <Column field="documentCategorie.libelle" header={t("document.documentCategorie")}
                  sortable></Column>
                <Column field="qualityStatus" header={t("echantillon.quality")} body={(rowData)=>{
                  if(rowData.qualityStatus === true){
                    return (
                      <Tag value="Valide" severity="success" />
                    ) 
                  }else{
                    return (
                      <Tag value="Reject" severity="danger" />
                    )
                  }
                  }}
                  sortable></Column>
                <Column header={t("actions")} body={actionBodyTemplate} style={{width:80}}></Column> 
              </DataTable>
              <div className="p-d-flex p-ai-center p-jc-between">
                <Paginator onPageChange={nextPage} first={start} rows={onRows} totalRecords={dataSize as number} />
              </div>
              </div>
            }
          </div>
          {showViewDialog && <View visible={showViewDialog} onClose={() => {
            setShowViewDialog(false);
            setSelectedItem(emptyItem);
          }} selectedItem={selectedItem} t={t} showToast={toast}/>}
        </div>
      </div>
      <Dialog visible={valideEchantillonDialog} style={{ width: '450px' }} header={t("confirm")} modal
        footer={valideEchantillonDialogFooter} onHide={hideEchantillonItemsDialog}>
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {item && (<span>{t("echantillon.validationconfirmation")}</span>)}
        </div>
      </Dialog>
      <Dialog
        visible={valideEchantillonNoteDialog}
        style={{ width: '750px' }}
        header={t("Note")}
        modal
        footer={valideEchantillonNoteDialogFooter}
        onHide={hideEchantillonNoteDialog}
      >
        <div className="flex items-center mb-4">
          {item && (<span><strong>{t("echantillon.motifRefus")}</strong></span>)}
          <InputTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            cols={30}
            autoResize
            className="ml-4 flex-1"
          />
        </div>
      </Dialog>
      <Dialog visible={deleteEchantillonDialog} style={{ width: '450px' }} header={t("confirm")} modal
        footer={deleteEchantillonDialogFooter} onHide={hideEchantillonDeleteDialog}>
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {item && (<span>{t("echantillon.suppressionConfirmation")}</span>)}
        </div>
      
      </Dialog>
        
      <Toast ref={toastRef} />
    </div>
  )
}

export default Echantillonnage