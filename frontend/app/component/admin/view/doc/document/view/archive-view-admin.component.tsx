import useViewHook from "app/component/zyhook/useViewhook";
import { TFunction } from "i18next";

import { Dialog } from 'primereact/dialog';

import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';

import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { Button } from "primereact/button";
import 'jspdf-autotable';
import { Toast } from "primereact/toast";
import { Document, Page, pdfjs} from "react-pdf";
import { ProgressSpinner } from "primereact/progressspinner";
import { ArchiveDto } from "app/controller/model/DocumentArchive.model";
import { ArchiveAdminService } from "app/controller/service/admin/ArchiveAdminService.service";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import FileViewer from "../preview/FileViewer";
import { MessageService } from "app/zynerator/service/MessageService";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}
type DocumentViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: ArchiveDto,
    t: TFunction,
    showToast: React.Ref<Toast>
}

const ViewArchive: React.FC<DocumentViewAdminType> = ({ visible, onClose, selectedItem, t, showToast}) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<ArchiveDto>({ selectedItem, onClose, t })

    // const service = new ArchiveAdminService();

    const [documentBase64, setDocumentBase64] = useState("");
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     try{
    //         setLoading(true);
    //         service.getArchiveBase64(selectedItem.id).then(({ data }) => {
    //             setDocumentBase64(data);
    //         })
    //         .finally(()=>{
    //             setLoading(false);
    //         });
    //     }catch (error){
    //         console.error('Error fetching document:', error);
    //     }

    // }, []);  

    const service = new DocumentAdminService();
    const [fileUrl, setFileUrl] = useState("");
    const [error, setError] = useState(false);




    useEffect(() => {
        setLoading(true);
        service.downloadFile(selectedItem.referenceGed)
            .then(({ data }) => {
                // calculateDocumentHeight(data).then((height) => {
                //     setDocHeight(height);
                // });
                const url = window.URL.createObjectURL(new Blob([data]));
                setFileUrl(url);
            })
            .catch((error) => {
                setError(true);
                MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de la récupération du document");
                return "";
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const onPageChange = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };
    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '70vw' }} header={t("document.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("document.viewDocument")}>
                    {/* {documentBase64 && <iframe
                        title={t("document.viewDocument")}
                        width="100%"
                        height="600"
                        src={`data:application/pdf;base64,${documentBase64}`}>
                    </iframe>} 
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <ProgressSpinner />
                        </div>
                    )}
                    {!loading && documentBase64 && <div>
                            {numPages > 1 && (
                                <div className="mb-3">
                                    <p>Page {pageNumber} of {numPages}</p>
                                    <Button
                                        raised
                                        label="Previous"
                                        className="mr-5 w-2"
                                        onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                                        disabled={pageNumber === 1}
                                    />
                                    <Button
                                        raised
                                        label="Next"
                                        className="mr-2 w-2"
                                        onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
                                        disabled={pageNumber === numPages}
                                    />
                                </div>
                            )}
                            <div style={{width:"70%", height:920, padding:"50px"}}>
                                <Document
                                    file={`data:application/pdf;base64,${documentBase64}`}
                                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                    >
                                    <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                                </Document>
                            </div>
                        </div>
                    }
                        */}
                          <FileViewer
                                // key={docHeight}
                                // height={docHeight}
                                twoPages={false}
                                className="mx-auto w-min"
                                setNumPages={setNumPages}
                                file={fileUrl}
                            />
                </TabPanel>
                <TabPanel header={t("document.informations")}>
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="reference">{t("document.reference")}</label>
                            <InputText id="reference" value={selectedItem.reference || ""} disabled />
                        </div>
                        
                        <div className="field col-4">
                            <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                            <Calendar id="uploadDate" value={adaptDate(selectedItem?.uploadDate) || ""} disabled dateFormat="dd/mm/yy" showIcon={true} />
                        </div>
                       
                        <div className="field col-2">
                            <label htmlFor="archivagePhysique">Archivage Physique</label>
                            <span className="p-float-label">
                                <InputSwitch
                                    checked={selectedItem?.ligne !== null && selectedItem?.colonne != null}
                                //onChange={handleArchivagePhysiqueSwitchChange}
                                />
                            </span>
                        </div>
                        {selectedItem.ligne && selectedItem.colonne && (
                            <>
                                <div className="field col-3">
                                    <label htmlFor="ligne">Row</label>
                                    <InputNumber
                                        id="ligne"
                                        name="ligne"
                                        showButtons
                                        min={0}
                                        value={selectedItem.ligne ? selectedItem.ligne : 0}
                                        disabled
                                    //onChange={(e) => setLigne(e.value ?? null)}
                                    />
                                </div>
                                <div className="field col-3">
                                    <label htmlFor="colonne">Colonne</label>
                                    <InputNumber
                                        id="colonne"
                                        name="colonne"
                                        showButtons
                                        min={0}
                                        value={selectedItem.colonne ? selectedItem.colonne : 0}
                                        disabled
                                    //onChange={(e) => setColonne(e.value ?? null)}
                                    />
                                </div>
                                <div className="field col-3">
                                    <label htmlFor="numBoite">N° Boite</label>
                                    <InputNumber
                                        id="numBoite"
                                        name="numBoite"
                                        showButtons
                                        min={0}
                                        value={selectedItem.numBoite ? selectedItem.numBoite : 0}
                                        disabled
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default ViewArchive;
