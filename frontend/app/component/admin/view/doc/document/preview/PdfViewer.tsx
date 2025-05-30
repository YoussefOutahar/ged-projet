import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { Slider } from 'primereact/slider';
import { useDebounce } from "react-use";
import { MenuItem } from 'primereact/menuitem';
import jsPDF from 'jspdf';
import { t } from 'i18next';
import { ProgressBar } from 'primereact/progressbar';


// pdfjs.GlobalWorkerOptions.workerSrc = `public/pdf-ressources/pdfWorker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Props = {
    file?: string;
    documentBlob?: Blob;
    showToolBar?: boolean;
    showPageNumber?: boolean;
    showZoomControls?: boolean;
    showEditControls?: boolean;
    twoPages?: boolean;
    height?: number;
    setNumPages?: (numPages: number) => void;
    pageNumber?: number;
    setPage?: (numPages: number) => void;
}
const PdfViewer = ({ file, documentBlob, showToolBar = false, showPageNumber = true, twoPages = true, showZoomControls = true, showEditControls = true, height = 750, setNumPages: setNumberPagesExternal, pageNumber: pageNumberExternal, setPage: setPageExternal }: Props) => {

    const [pdfLoadedPercentage, setPdfLoadedPercentage] = useState<number>(0);

    const [numPages, setNumPagesInternal] = useState(0);
    const setNumPages = (numPages: number) => {
        setNumPagesInternal(numPages);
        setNumberPagesExternal ? setNumberPagesExternal(numPages) : null;
    }

    const [pageNumberInternal, setPageNumberInternal] = useState(pageNumberExternal ?? 1);
    const pageNumber = pageNumberExternal ?? pageNumberInternal;
    const setPageNumber = (pageNumber: number) => {
        setPageNumberInternal(pageNumber);
        setPageExternal ? setPageExternal(pageNumber) : null;
    }

    useEffect(() => {
        setPageNumberInternal(pageNumberExternal ?? 1);
    }, [pageNumberExternal]);


    const onPageChange = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };

    useEffect(() => {
        setPageNumber(1);
    }, [documentBlob, file])


    const [zoom, setZoom] = useState(height);

    // Editing the document
    const [originalImageUrl, setOriginalImageUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const convertPdfPageToImage = async (file: string | undefined, documentBlob: Blob | undefined, pageNumber: number) => {
        let loadingTask;
        if (file && !file.startsWith('data:application/pdf;base64,')) {
            loadingTask = pdfjs.getDocument(file);
        } else if (file && file.startsWith('data:application/pdf;base64,')) {
            const base64 = file.split(',')[1];
            loadingTask = pdfjs.getDocument({ data: Buffer.from(base64 || "", 'base64') });
        } else {
            loadingTask = pdfjs.getDocument({ data: await documentBlob?.arrayBuffer() });
        }

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(Number(pageNumber));
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;
        const url = canvas.toDataURL();
        return url;
    };

    const loadPdfPageAsImage = async () => {
        const url = await convertPdfPageToImage(file, documentBlob, pageNumber);
        setOriginalImageUrl(url);
    };
    useEffect(() => {
        if (file || documentBlob) {
            loadPdfPageAsImage();
        }
    }, [file, documentBlob, pageNumber, pageNumberExternal, pageNumberInternal]);

    const [contrast, setContrast] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const adjustContrast = (imageData: ImageData, contrast: number) => {
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = factor * (imageData.data[i] - 128) + 128;
            imageData.data[i + 1] = factor * (imageData.data[i + 1] - 128) + 128;
            imageData.data[i + 2] = factor * (imageData.data[i + 2] - 128) + 128;
        }

        return imageData;
    };

    const adjustBrightness = (imageData: ImageData, brightness: number) => {
        brightness = brightness / 100;

        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] *= brightness;
            imageData.data[i + 1] *= brightness;
            imageData.data[i + 2] *= brightness;
        }

        return imageData;
    };

    const adjustSaturation = (imageData: ImageData, saturation: number) => {
        saturation = saturation / 100;

        for (let i = 0; i < imageData.data.length; i += 4) {
            let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] += (avg - imageData.data[i]) * (1 - saturation);
            imageData.data[i + 1] += (avg - imageData.data[i + 1]) * (1 - saturation);
            imageData.data[i + 2] += (avg - imageData.data[i + 2]) * (1 - saturation);
        }

        return imageData;
    };

    const openEditDialog = async () => {
        const url = await convertPdfPageToImage(file, documentBlob, pageNumber);
        setImageUrl(url);
        setEditDialogVisible(true);
    };

    const handleEdit = async () => {
        const image = new Image();
        image.src = originalImageUrl;
        await image.decode();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Failed to get canvas context');
        }

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        imageData = adjustContrast(imageData, contrast);
        imageData = adjustBrightness(imageData, brightness);
        imageData = adjustSaturation(imageData, saturation);

        context.putImageData(imageData, 0, 0);
        setImageUrl(canvas.toDataURL());
    };

    useDebounce(() => {
        if (originalImageUrl !== '') {
            handleEdit();
        }
    }, 500, [contrast, brightness, saturation]);

    const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
    const downloadAllPagesAsPDF = async () => {
        let url;
        if (file && !file.startsWith('data:application/pdf;base64,')) {
            url = file;
        } else {
            url = window.URL.createObjectURL(documentBlob as Blob);
        }
        const doc = new jsPDF();
        for (let i = 0; i < pages.length; i++) {
            const img = new Image();
            img.src = await convertPdfPageToImage(url, undefined, i + 1);
            await new Promise((resolve) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
                    if (i < pages.length - 1) {
                        doc.addPage();
                    }
                    resolve(null);
                };
            });
        }
        doc.save("all-pages.pdf");
    };

    const downloadModifiedPageAsPDF = async () => {
        const doc = new jsPDF();
        const img = new Image();
        img.src = imageUrl; // Assuming imageUrl is the URL of the modified image
        await new Promise((resolve) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
                resolve(null);
            };
        });
        doc.save("modified-page.pdf");
    };



    return (
        <>
            <Document
                className="flex flex-row"
                file={file ? file : window.URL.createObjectURL(documentBlob as Blob)}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                // onLoadProgress={({ loaded, total }) => {
                //     setPdfLoadedPercentage(Math.round((loaded / total) * 100));
                // }}
                // loading={
                //     <div className="flex justify-content-center items-center w-full">
                //         <ProgressBar
                //             style={{ width: '800px', height: '20px' }} 
                //             value={pdfLoadedPercentage}    
                //         />
                //     </div>
                // }
            >
                {
                    !twoPages || numPages == 1 ?
                        <div className="relative flex-1 justify-content-center " >
                            {showToolBar ? <Menubar
                                start={
                                    <>
                                        <Button
                                            className="p-button-rounded"
                                            icon="pi pi-angle-left"
                                            onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                                        />
                                        <div></div>
                                    </>
                                }
                                end={
                                    <>
                                        <Button
                                            className="p-button-rounded"
                                            icon="pi pi-angle-right"
                                            onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
                                        />
                                    </>
                                }
                                model={[
                                    showZoomControls && {
                                        label: t("document.Zoom"),
                                        icon: 'pi pi-search-plus m-2',
                                        items: [
                                            { label: t("document.ZoomIn"), icon: 'pi pi-search-plus', command: () => setZoom(zoom + 150) },
                                            { label: t("document.ZoomOut"), icon: 'pi pi-search-minus', command: () => setZoom(zoom - 150) },
                                        ],
                                    },
                                    showEditControls && {
                                        label: t("document.Edit"),
                                        icon: 'pi pi-pencil m-2',
                                        command: () => openEditDialog(),
                                    },
                                    showPageNumber && {
                                        disabled: true,
                                        label: `${pageNumber} / ${numPages}`,
                                    }
                                ].filter(Boolean) as MenuItem[]}
                            /> : null}
                            <Page
                                className="border-solid border-300"
                                height={zoom}
                                pageNumber={pageNumber}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                loading={<div style={{ height: zoom, width: `528px` }}></div>}
                            />
                        </div>
                        :
                        <>
                            <div className="relative  flex-1 justify-content-center">
                                <Button className="absolute top-50 right-0 " text rounded icon="pi pi-angle-left text-4xl" onClick={() => onPageChange(Math.max(1, pageNumber - 2))} />
                                {showPageNumber && <p className="text-center">{pageNumber} / {numPages}</p>}
                                <Page className="border-solid border-500 " height={zoom} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                            </div>

                            {
                                showZoomControls &&
                                <div className='absolute bottom-0 flex justify-content-center w-full'>
                                    <Button className="" size='small' text rounded icon="pi pi-search-minus text-xl" onClick={() => setZoom(zoom - 150)} />
                                    <Button className="" size='small' text rounded icon="pi pi-search-plus text-xl" onClick={() => setZoom(zoom + 150)} />
                                </div>
                            }

                            <div className="relative flex-1 justify-content-center">
                                {
                                    pageNumber < numPages &&
                                    <>
                                        <Button className="absolute top-50 left-0 " text rounded icon="pi pi-angle-right text-4xl" onClick={() => onPageChange(Math.min(numPages, pageNumber + 2))} />
                                        {showPageNumber && <p className="text-center">{pageNumber + 1} / {numPages}</p>}
                                        <Page className="border-solid border-500" height={zoom} pageNumber={pageNumber + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                                    </>
                                }
                            </div>


                        </>
                }
            </Document>

            <Dialog
                header={"Edit"}
                style={{ width: '50vw' }}
                visible={editDialogVisible}
                onHide={() => {
                    setEditDialogVisible(false);
                    setImageUrl('')
                    setBrightness(100);
                    setContrast(0);
                    setSaturation(100);
                }}
            >
                <div className='m-4' style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={`/icons/contrast.png`} alt="Brightness Icon" style={{ 'marginRight': '8px', 'width': '20px', 'height': '20px' }} />
                    <label style={{ 'fontSize': '18px' }}>{t("document.Contrast")}</label>
                </div>
                <Slider className='m-2' value={contrast} min={-255} max={255} step={16} onChange={(event) => setContrast(event.value as number)} />
                <div className='m-4' style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={`/icons/black&white.png`} alt="Brightness Icon" style={{ 'marginRight': '8px', 'width': '20px', 'height': '20px' }} />
                    <label style={{ 'fontSize': '18px' }}>{t("document.Brightness")}</label>
                </div>
                <Slider className='m-2' value={brightness} min={0} max={200} step={20} onChange={(event) => setBrightness(event.value as number)} />
                <div className='m-4' style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={`/icons/saturation.png`} alt="Brightness Icon" style={{ 'marginRight': '8px', 'width': '20px', 'height': '20px' }} />
                    <label style={{ 'fontSize': '18px' }}>{t("document.Saturation")}</label>
                </div>
                <Slider className='m-2' value={saturation} min={0} max={200} step={20} onChange={(event) => setSaturation(event.value as number)} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    {imageUrl ? <img src={imageUrl} alt={`Page ${pageNumber}`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <p>Loading...</p>}
                </div>
                <div className='flex flex-row mt-3' style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <Button label="Download" className='m-2' onClick={downloadAllPagesAsPDF} /> */}
                    <Button label="Download" className='m-2' onClick={downloadModifiedPageAsPDF} />
                </div>
            </Dialog>
        </>
    )
}

export default PdfViewer