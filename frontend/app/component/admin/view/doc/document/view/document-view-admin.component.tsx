import useViewHook from "app/component/zyhook/useViewhook";
import { TFunction } from "i18next";
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';

import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Button } from "primereact/button";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { format } from "date-fns";
import { Toast } from "primereact/toast";
import { MessageService } from "app/zynerator/service/MessageService";
import { pdfjs } from "react-pdf";
import { ProgressSpinner } from "primereact/progressspinner";
import { Chips, ChipsChangeEvent } from 'primereact/chips';

import axiosInstance from "app/axiosInterceptor";
import { PDFDocument } from "pdf-lib";

// import { ViewPDFContrastTab } from 'app/component/admin/view/doc/document/view/ViewPDFContrastTab.tsx'; 

import FileViewer from "../preview/FileViewer";
import { Card } from "primereact/card";
import { ListBox } from "primereact/listbox";
import { Checkbox } from "primereact/checkbox";
import { DocumentCommentaireDto } from "app/controller/model/DocumentCommentaireModel.model";
import CreateCommentaire from "app/component/admin/view/doc/document/commentaire/commentaire-create";
import Sticker from "app/component/admin/view/doc/document/commentaire/commentaire-sticker";
import useFeatureFlags from "app/component/admin/view/featureFlag/list/FeatureFlagsComponent";
import { uploadFileInChunks } from "app/controller/service/admin/uploadFileInChunks";
import { getMediaType } from "app/utils/documentUtils";
import { AxiosRequestConfig } from "axios";
import { ProgressBar } from "primereact/progressbar";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}
type DocumentViewAdminType = {
    visible: boolean,
    onClose: () => void,
    selectedItem: DocumentDto,
    t: TFunction,
    showToast: React.Ref<Toast>
}

const View: React.FC<DocumentViewAdminType> = ({ visible, onClose, selectedItem, t, showToast }) => {

    const {
        onTabChange,
        hideDialog,
        itemDialogFooter,
        formateDate,
        parse,
        parseToIsoFormat,
        adaptDate,
        activeIndex
    } = useViewHook<DocumentDto>({ selectedItem, onClose, t })
    const [error, setError] = useState(false);
    const [comments, setComments] = useState<DocumentCommentaireDto[]>([]);

    useEffect(() => {
        setLoading(true);

        let config: AxiosRequestConfig = {
            onDownloadProgress(progressEvent) {
                let percentCompleted = progressEvent.total ? Math.floor((progressEvent.loaded * 100) / progressEvent.total) : 0;
                setLoadingPercentage(percentCompleted);
            },
        };
        service.downloadFile(selectedItem.referenceGed,config)
            .then(({ data }) => {
                // calculateDocumentHeight(data).then((height) => {
                //     setDocHeight(height);
                // });
                const url = window.URL.createObjectURL(new Blob([data],{ type: getMediaType(selectedItem?.documentType?.code) }
                ));
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
    const handleCommentAdded = (newComment: DocumentCommentaireDto) => {
        setComments([...comments, newComment]);
    };
    const refreshCommet = () => {
        axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/commentaire/document/${selectedItem.id}`)
            .then(response => {
              setComments(response.data);
            })
            .catch(error => {
              console.error('Error fetching comments:', error);
            });
    }
    useEffect(() => {
        if (selectedItem) {
          refreshCommet();
        }
    }, [selectedItem]);

    const service = new DocumentAdminService();

    const [fileUrl, setFileUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [splitRanges, setSplitRanges] = useState<string[]>([]);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isArchivagePhysiqueChecked, setIsArchivagePhysiqueChecked] = useState(false);

    const [pagesToDelete, setPagesToDelete] = useState('');

    const { featureFlags, isActiveBack, isActiveFront} = useFeatureFlags();
    const [chunkFile, setChunkFile] = useState<boolean>(false);
    useEffect(() => {
        const useFileChunking = isActiveFront('chunkFile');
        setChunkFile(useFileChunking);
    }, [featureFlags]);

    const onDeletePagesSuccess = () => {
        setLoading(false);
        setPagesToDelete('');
        window.location.reload();
    }
    const onDeletePagesError = (error: any) => {
        console.error('Error deleting pages:', error);
        setError(error);
        setLoading(false);
    }

    const handleDeletePages = async () => {
        setLoading(true);
        const newFile = await deletePDFPages(fileUrl, pagesToDelete);

        // Feature-flipping
        if(chunkFile){
            uploadFileInChunks({
                file: newFile,
                documentDto: selectedItem,
                onSuccess:()=>{
                    MessageService.showSuccess(showToast, t('success.success'), t("success.operation"));
                    onDeletePagesSuccess();
                } ,
                onError: (err) => {
                    MessageService.showError(showToast, t('error.error'), t("error.operation"));
                    onDeletePagesError(err)
                },
                withVersioning: true,
            });
        }else{
            try {
                await saveUpdatedDocument(newFile);
                onDeletePagesSuccess();
            } catch (error: any) {
                onDeletePagesError(error);
            }
        }
    };

    const deletePDFPages = async (inputFile: any, pagesToDelete: string) => {
        const response = await fetch(inputFile);
        const inputFileResult = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(inputFileResult);
        const pagesArray = pagesToDelete.split(',').map(page => parseInt(page.trim()) - 1).sort((a, b) => b - a);
        pagesArray.forEach(pageNumber => {
            pdfDoc.removePage(pageNumber);
        });

        const pageBytes = await pdfDoc.save();
        return new Blob([pageBytes], { type: 'application/pdf' });
    };


    const [potentiallyEmptyPages, setPotentiallyEmptyPages] = useState<Record<number, number>>({});
    const [selectedPotentiallyEmptyPages, setselectedPotentiallyEmptyPages] = useState<Record<number, number>>({});

    const [loadingPotentiallyEmptyPages, setLoadingPotentiallyEmptyPages] = useState(false);
    const [errorPotentiallyEmptyPages, setErrorPotentiallyEmptyPages] = useState(false);

    const handleDeletePotentiallyEmptyPages = async () => {
        setLoading(true);
        try {
            const newFile = await deletePotentialyEmptyPages(fileUrl, Object.values(selectedPotentiallyEmptyPages));
            await saveUpdatedDocument(newFile);
            setLoading(false);
            setselectedPotentiallyEmptyPages({});
            window.location.reload();
        } catch (error: any) {
            console.error('Error deleting pages:', error);
            setError(error);
            setLoading(false);
        }
    };

    const deletePotentialyEmptyPages = async (inputFile: any, pagesToDelete: number[]) => {
        const response = await fetch(inputFile);
        const inputFileResult = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(inputFileResult);
        const pagesArray = pagesToDelete.map(page => page - 1).sort((a, b) => b - a);
        pagesArray.forEach(pageNumber => {
            pdfDoc.removePage(pageNumber);
        });

        const pageBytes = await pdfDoc.save();
        return new Blob([pageBytes], { type: 'application/pdf' });
    };
    useEffect(() => {
        if (fileUrl) {
            fetch(fileUrl)
                .then(response => response.blob())
                .then(blob => {
                    setLoadingPotentiallyEmptyPages(true);
                    const formData = new FormData();
                    const file = new File([blob], 'filename');
                    formData.append('file', file);
                    axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/getEmptyPages`, formData)
                        .then(({ data }) => {
                            setPotentiallyEmptyPages(data);
                        }).catch((error) => {
                            setErrorPotentiallyEmptyPages(true);
                            console.error('Error fetching empty pages:', error);
                        }).finally(() => {
                            setLoadingPotentiallyEmptyPages(false);
                        });
                });
        }
    }, [fileUrl]);

    const saveUpdatedDocument = async (file: any) => {
        const form = new FormData();
        form.append('file', file);
        form.append('documentDTO', JSON.stringify(selectedItem));

        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/update/with-Index`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            MessageService.showSuccess(showToast, "Mise à jour!", "Document updated successfully.");
        } catch (error) {
            console.error('Error updating document:', error);
            MessageService.showError(showToast, "Error!", "Error while updating document in Axios");
        }
    };

    //XLS
    const handleExtraireIndexA = () => {
        try {
            const documentIndexElements = selectedItem.documentIndexElements;
            if (documentIndexElements && documentIndexElements.length > 0) {
                const data = documentIndexElements.map(item => ({
                    'Index Element': item.indexElement.libelle,
                    'Value': item.value,
                    'Description': item.description,
                }));

                const headers = ['Index Element', 'Value', 'Description'];
                const csvContent =
                    headers.join(',') +
                    '\n' +
                    data.map(row => headers.map(header => JSON.stringify((row as any)[header])).join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);

                // Create a download link
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedItem.reference}_data.csv`);
                document.body.appendChild(link);

                // Trigger the download
                link.click();
                // Remove the link
                document.body.removeChild(link);
            } else {
                MessageService.showError(showToast, "Error!", "Aucune donnée à exporter");
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'export :', error);
            MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de l'export");
        }
    }
    //PDF
    const handleExtraireIndex = () => {
        try {
            const documentIndexElements = selectedItem.documentIndexElements;

            if (documentIndexElements && documentIndexElements.length > 0) {
                const pdf = new jsPDF();
                pdf.setFontSize(12);
                //pdf.setFont('times' ,'normal')
                pdf.text('Nom Document : ' + selectedItem.reference, 20, 20);
                pdf.text('Reference : ' + selectedItem.referenceGed, 20, 30);
                pdf.text('Date chargé : ' + format(new Date(selectedItem.uploadDate), "dd/MM/yyyy"), 20, 40);
                pdf.text('Responsable : ' + selectedItem.utilisateur.nom + ' ' + selectedItem.utilisateur.prenom, 20, 50);
                pdf.text('Categorie : ' + selectedItem.documentCategorie.libelle, 20, 60);
                // Set up table headers for document data
                const documentHeaders = ['Document Type', 'Document State', 'Entité Administrative', 'Plan de Classement'];
                const documentRows = [
                    [selectedItem.documentType.libelle, selectedItem.documentState.libelle, selectedItem.entiteAdministrative.libelle, selectedItem.planClassement.libelle],
                ];

                pdf.setFontSize(16);
                pdf.text('Document Data', 20, 80);
                pdf.autoTable({ head: [documentHeaders], body: documentRows, startY: 90 });

                //pdf.text('Document Index', 20, pdf.autoTable.previous.finalY + 20); 
                pdf.setFontSize(16);
                pdf.text('Document Index', 20, 120);
                const indexHeaders = ['Index Element', 'Value', 'Description'];
                const indexRows = documentIndexElements.map(item => [
                    item.indexElement ? item.indexElement.libelle : '-',
                    item.value || '-',
                    item.description,
                ]);

                //pdf.autoTable({ head: [indexHeaders], body: indexRows, startY: pdf.autoTable.previous.finalY + 30 });
                pdf.autoTable({ head: [indexHeaders], body: indexRows, startY: 130 });
                pdf.save(`${selectedItem.reference}_data.pdf`);
                MessageService.showSuccess(showToast, "Mise à jour!", "Document exporté avec Success.");
            } else {
                MessageService.showError(showToast, "Error!", "Aucune donnée à exporter");
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'export :', error);
            MessageService.showError(showToast, "Error!", "Une erreur s'est produite lors de l'export");
        }
    };
    const handleChipChange = (event: ChipsChangeEvent) => {
        const newSplitRange = Array.isArray(event.value) ? event.value : []; // Ensure it's an array       
        const isValidSplitRange = newSplitRange.every((range) => validateSplitRange(range, numPages));
        if (!isValidSplitRange) {
            return; // Inform user about invalid format or values through alert or custom feedback
        }

        setSplitRanges(newSplitRange);

    };

    const [planClassementParent, setPlanClassementParent] = useState<any>(null);
    useEffect(() => {
        if (selectedItem?.planClassement) {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/idChildren/${selectedItem.planClassement.id}`)
                .then(({ data }) => {
                    setPlanClassementParent(data);
                })
                .catch((error) => {
                    console.error('Error fetching plan classement parent:', error);
                });
        }


    }, [selectedItem?.planClassement]);



    const handleArchivagePhysiqueSwitchChange = (e: InputSwitchChangeEvent) => {
        setIsArchivagePhysiqueChecked(e.value ?? false);
    };

    const validateSplitRange = (range: string, pageNumber: number): boolean => {
        const dashCount = range.split("-").map(Number).length - 1
        if (dashCount !== 1) {
            // Provide user-friendly message about incorrect hyphen count
            console.warn("The value must contain one and only one '-' character.");
            MessageService.showError(showToast, "Error!", "The value must contain one and only one '-' character.");
            return false;
        }

        const [int1, int2] = range.split("-").map((str) => parseInt(str.trim()));

        if (
            !Number.isInteger(int1) ||
            !Number.isInteger(int2) ||
            int2 > pageNumber ||
            int1 > int2
        ) {
            // Provide clear message about invalid integers or invalid range
            console.warn(
                "Invalid range. Both values must be integers, int2 <= pageNumber, and int1 <= int2."
            );
            MessageService.showError(showToast, "Error!", "Invalid range. Both values must be integers, int2 <= pageNumber, and int1 <= int2.");
            return false;
        }

        return true;
    };
    const getPDFDocByPages = async (inputFile: any, startPageNumber: number, endPageNumber: number) => {
        const inputFileResult = await fetch(inputFile).then((response) => response.arrayBuffer());
        const newDoc = await PDFDocument.create();
        const pdfDoc = await PDFDocument.load(inputFileResult);
        const copiedPages = await newDoc.copyPages(pdfDoc, Array.from({ length: endPageNumber - startPageNumber + 1 }, (_, i) => i + startPageNumber - 1));
        copiedPages.forEach(page => newDoc.addPage(page));
        const pageBytes = await newDoc.save();
        return new Blob([pageBytes], { type: 'application/pdf' });
    };


    const addSplitedDocuments = async (files: any[]) => {
        const form = new FormData();

        if (files && files.length > 0) {
            files.forEach((file) => {
                if (file instanceof Blob) {

                    form.append('files', file);
                }
            })
            form.append('documentDTO', JSON.stringify(selectedItem));

            try {
                const responses = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/split-files`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setLoading(false);

                MessageService.showSuccess(showToast, "Mise à jour!", "Document Splited With Success.");
                hideDialog();
                window.location.reload();
            } catch (error) {
                console.error('Erreur lors de la résolution des requêtes:', error);
                MessageService.showError(showToast, "Error!", "Error while spliting Document in Axios");
            }
        } else {
            MessageService.showError(showToast, "Error!", "Files state not yet updated");
        }
    };
    const handleSplitPDF = async () => {
        setLoading(true);
        const newFiles = await Promise.all(splitRanges.map(async (range) => {
            const [start, end] = range.split("-").map((str) => parseInt(str.trim()));
            return await getPDFDocByPages(fileUrl, start, end);
        }));


        await addSplitedDocuments(newFiles);
        setLoading(false);
        setSplitRanges([]);
    };

    // const [docHeight, setDocHeight] = useState(750);
    // const calculateDocumentHeight = async (fileUrl: string) => {
    //     try {

    //         const response = await fetch(fileUrl);
    //         const inputFileResult = await response.arrayBuffer();

    //         const loadingTask = pdfjs.
    //         const pdf = await loadingTask.promise;
    //         const page = await pdf.getPage(1);
    //         const viewport = page.getViewport({ scale: 1 });

    //         const windowHeight = window.innerHeight;
    //         if (viewport.height > windowHeight) {
    //             return 2000;
    //         } else {
    //             if (viewport.width > viewport.height) {
    //                 return viewport.height;
    //             } else {
    //                 return 2000;
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error calculating document height:', error);
    //         return 750;
    //     }
    // }
    // useEffect(() => {
    //     if (fileUrl) {
    //         calculateDocumentHeight(fileUrl).then((height) => {
    //             setDocHeight(height);
    //         });
    //     }
    // }, [fileUrl]);

    return (
        <Dialog visible={visible} closeOnEscape style={{ width: '85vw' }} header={t("document.tabPan")} modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog} >
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("document.informations")}>
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="reference">{t("document.reference")}</label>
                            <InputText id="reference" value={selectedItem.reference || ""} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentType">{t("document.documentType")}</label>
                            <InputText id="documentTypeDropdown" value={selectedItem?.documentType?.libelle || ""} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentState">{t("document.documentState")}</label>
                            <InputText id="documentStateDropdown" value={selectedItem?.documentState?.libelle || ""} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="documentCategorie">{t("document.documentCategorie")}</label>
                            <InputText id="documentCategorieDropdown" value={selectedItem?.documentCategorie?.libelle || ""} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="uploadDate">{t("document.uploadDate")}</label>
                            <Calendar id="uploadDate" value={adaptDate(selectedItem?.uploadDate) || ""} disabled dateFormat="dd/mm/yy" showIcon={true} />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="size">{t("document.size")}</label>
                            <InputNumber id="size" value={selectedItem?.size || -1} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="utilisateur">{t("document.utilisateur")}</label>
                            <InputText id="utilisateurDropdown" value={selectedItem?.utilisateur?.nom || ""} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">{t("document.entiteAdministrative")}</label>
                            <InputText id="entiteAdministrativeDropdown" value={selectedItem?.entiteAdministrative?.libelle || ""} disabled />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="entiteAdministrative">Plan de Classement</label>
                            <InputText
                                id="entiteAdministrativeDropdown"
                                value={`${planClassementParent || ""} / ${selectedItem?.planClassement?.libelle || ""}`}
                                disabled
                            />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="description">{t("document.description")}</label>
                            <span className="p-float-label">
                                <InputTextarea id="description" value={selectedItem?.description || ""} disabled rows={5} cols={30} />
                            </span>
                        </div>
                        <div className="field col-2">
                            <label htmlFor="archivagePhysique">Archivage Physique</label>
                            <span className="p-float-label">
                                <InputSwitch
                                    checked={isArchivagePhysiqueChecked ? true : false}
                                    onChange={handleArchivagePhysiqueSwitchChange}
                                />
                            </span>
                        </div>
                        {isArchivagePhysiqueChecked && (
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

                <TabPanel header={t("document.documentIndexElements")}>

                    <DataTable value={selectedItem?.documentIndexElements} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                        <Column field="indexElement.libelle" header={t("documentIndexElement.indexElement")}></Column>
                        <Column field="value" header={t("documentIndexElement.value")}   ></Column>
                        <Column field="description" header={t("documentIndexElement.description")}   ></Column>
                    </DataTable>
                    <Button icon="pi pi-download" label={t("document.exportDocument")} className="p-button-success w-3 mt-4" onClick={handleExtraireIndex} />
                </TabPanel>
                <TabPanel header={t("document.viewDocument")}>
                <div className="flex gap-2">
                    <div className="flex flex-column gap-1" style={{ flex: '1' }}>
                        <div>
                            <CreateCommentaire documentId={selectedItem.id} onCommentAdded={handleCommentAdded} refresh={refreshCommet} t={t}/>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}> 
                                {/* {comments.map(comment => ( */}
                                    <Sticker comments={comments} refresh={refreshCommet} t={t}/>
                                {/* ))} */}
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: '1' }}> 
                    {fileUrl &&
                        <div style={{ width: '100%', height: '100vh' }}>
                            <FileViewer
                                // key={docHeight}
                                // height={docHeight}
                                twoPages={false}
                                className="mx-auto w-min"
                                setNumPages={setNumPages}
                                file={fileUrl}
                            />
                        </div>
                    }
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <ProgressBar value={loadingPercentage} displayValueTemplate={(value) => `${value}%`} />
                        </div>
                    )}
                    {error && (
                        <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                    )}
                    </div>
                </div>       
                    {/* {!loading && !error && documentBase64 && <div>
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
                        <div style={{ width: "70%", height: 920, padding: "50px" }}>
                            <Document
                                file={`data:application/pdf;base64,${documentBase64}`}
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            >
                                <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                            </Document>
                        </div>
                    </div>
                    } */}
                </TabPanel>
                <TabPanel header={t("document.documentPartageGroupes")}>

                    <DataTable value={selectedItem?.documentPartageGroupes} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                        <Column field="groupe.libelle" header={t("documentPartageGroupe.groupe")}></Column>
                        <Column field="dateShare" header={t("documentPartageGroupe.dateShare")} body={formateDate("dateShare")} ></Column>
                        <Column field="accessShare.libelle" header={t("documentPartageGroupe.accessShare")}></Column>
                        <Column field="description" header={t("documentPartageGroupe.description")}   ></Column>
                    </DataTable>

                </TabPanel>
                <TabPanel header={t("document.documentPartageUtilisateurs")}>

                    <DataTable value={selectedItem?.documentPartageUtilisateurs} tableStyle={{ minWidth: '50rem' }} dataKey="id">
                        <Column field="utilisateur.nom" header={t("documentPartageUtilisateur.utilisateur")}></Column>
                        <Column field="dateShare" header={t("documentPartageUtilisateur.dateShare")} body={formateDate("dateShare")} ></Column>
                        <Column field="accessShare.libelle" header={t("documentPartageUtilisateur.accessShare")}></Column>
                        <Column field="description" header={t("documentPartageUtilisateur.description")}   ></Column>
                    </DataTable>

                </TabPanel>
                {numPages > 1 && (
                    <TabPanel header={t("document.split")}>
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <ProgressSpinner />
                            </div>
                        )}
                        {error && (
                            <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                        )}
                        {!loading && !error && fileUrl && (
                            <>
                                <div className="col-12">
                                    <div className="mb-1 items-center">
                                        {numPages > 1 && (
                                            <div className="card p-fluid">
                                                <h5>{t("document.SplitDocumentation")}</h5>
                                                <p> {t("document.MessageSplitExemple")}</p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Chips
                                                        value={splitRanges}
                                                        className="w-full"
                                                        onChange={handleChipChange}
                                                        placeholder={t("document.SplitTemplit")}
                                                    />
                                                    <Button
                                                        label={t("document.SplitValidation")}
                                                        icon="pi pi-check"
                                                        onClick={handleSplitPDF}
                                                        className="mb-2 mt-2 ml-6 w-2"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <FileViewer
                                    // key={docHeight}
                                    // height={docHeight}
                                    file={fileUrl}
                                    className="mx-auto w-min"
                                    twoPages={false}
                                    setNumPages={setNumPages}
                                />
                            </>
                        )}
                    </TabPanel>
                )}

                {/* <TabPanel header="Adjust Contrast">
                    <ViewPDFContrastTab
                        documentBase64={fileUrl??""}
                        numPages={numPages}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                    />
                </TabPanel> */}
                <TabPanel header={t("document.DeletePages")}>
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <ProgressSpinner />
                        </div>
                    )}
                    {error && (
                        <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                    )}
                    {!loading && !error && fileUrl && (
                        <>
                            <div className="flex-2 col-12">
                                <div className="mb-1 items-center ">
                                    <div className="card p-fluid ">
                                        <h5>{t("document.DeletTitle")}</h5>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <InputText
                                                type="text"
                                                value={pagesToDelete}
                                                placeholder={t("document.DeleteTemplet")}
                                                onChange={(e) => setPagesToDelete(e.target.value)}
                                            />
                                            <Button
                                                label={t("document.DeletePages")}
                                                icon="pi pi-trash"
                                                onClick={handleDeletePages}
                                                className="mb-2 mt-2 ml-6 w-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex-2 col-6">
                                    <FileViewer
                                        // key={docHeight}
                                        // height={docHeight}
                                        file={fileUrl}
                                        className="mx-auto w-min"
                                        twoPages={false}
                                        setNumPages={setNumPages}
                                        pageNumber={pageNumber}
                                        setPage={setPageNumber}
                                    />
                                </div>
                                <div className="flex-2 col-6">
                                    <Card title="Pages Vide">
                                        {loadingPotentiallyEmptyPages && (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                <ProgressSpinner />
                                            </div>
                                        )}
                                        {errorPotentiallyEmptyPages && (
                                            <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                                        )}
                                        {!loadingPotentiallyEmptyPages && !errorPotentiallyEmptyPages && (
                                            <>
                                                <ListBox
                                                    optionLabel="name"
                                                    style={{ border: 'none' }}
                                                    className="mb-4"
                                                    options={Object.entries(potentiallyEmptyPages)?.map(([page, percentage]) => ({ name: `Page ${page} - ${percentage.toFixed(2)}% empty`, id: page }))}
                                                    onChange={(e) => {
                                                        setPageNumber(Number(e.value.id));
                                                        setselectedPotentiallyEmptyPages(prevState => {
                                                            if (prevState.hasOwnProperty(e.value.id)) {
                                                                const { [e.value.id]: _, ...newSelectedPotentiallyEmptyPages } = prevState;
                                                                return newSelectedPotentiallyEmptyPages;
                                                            } else {
                                                                return { ...prevState, [e.value.id]: e.value.id };
                                                            }
                                                        });
                                                    }}
                                                    itemTemplate={(item) => (
                                                        <div className="flex justify-content-between align-items-center">
                                                            <h5>{item.name}</h5>
                                                            <Checkbox
                                                                checked={selectedPotentiallyEmptyPages.hasOwnProperty(item.id)}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                                <div className="flex justify-content-end">
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-danger"
                                                        style={{ width: 'auto', padding: '1rem' }}
                                                        disabled={Object.keys(selectedPotentiallyEmptyPages).length === 0}
                                                        onClick={handleDeletePotentiallyEmptyPages}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default View;
