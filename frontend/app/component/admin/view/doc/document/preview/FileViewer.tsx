import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react'
import PdfViewer from './PdfViewer';
import { DocumentDto } from 'app/controller/model/Document.model';
import axiosInstance from 'app/axiosInterceptor';
import ExcelViewer from './ExcelViewer';
import ImageViewer from './ImageViewer';
import WordViewer from './WordViewer';
import { isExcel, isImage, isPdf, isWord, typeIsValide } from 'app/utils/documentUtils';
import { SelectButton } from 'primereact/selectbutton';
import { AxiosRequestConfig } from 'axios';
import { ProgressBar } from 'primereact/progressbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// pdfjs.GlobalWorkerOptions.workerSrc = `public/pdf-ressources/pdfWorker.js`;


type Props = {
    file?: string;
    progress?: number;
    documentId?: number;
    className?: string;
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


const FileViewer = ({ file,progress, documentId, className, showToolBar = true, showPageNumber = true, twoPages = false, showZoomControls = true, showEditControls = true, height = 750, setNumPages: setNumberPagesExternal,pageNumber: pageNumberExternal, setPage: setPageExternal }: Props) => {
    
    // Bring document by its id from the server
    const [loadingDocument, setLoadingDocument] = useState(false);
    const [error, setError] = useState(false);
    const [document, setDocument] = useState<DocumentDto>(new DocumentDto());
    const [documentType, setDocumentType] = useState<string>("")
    const documentService = new DocumentAdminService();
    const [documentBytes, setDocumentBytes] = useState<Blob>();

    const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
    let config: AxiosRequestConfig = {
        onDownloadProgress(progressEvent) {
            let percentCompleted = progressEvent.total ? Math.floor((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setLoadingPercentage(percentCompleted);
        },
    };

    const fetchDocumentDto = async () => {
        setError(false);
        setLoadingDocument(true);
        await axiosInstance.get(`${API_URL}/admin/document/id/${documentId}`).then((res) => {
            setDocument(res.data);
        }).catch((err) => {
            console.error('Error fetching document:', err);
            setLoadingDocument(false);
            setError(true);
        })
    }

    const downloadFile = ()=>{
        setError(false);
        setLoadingDocument(true);
        documentService.downloadFile(document.referenceGed, config).then((res ) => {
            
            if(document.documentType && document.documentType.code) {
                setDocumentType(document.documentType.code);
            }else {
                let filename = res.headers['content-disposition'].split('filename=')[1];
                let fileExtension = filename.split('.').pop().replace(/"/g, '');
                if(typeIsValide(fileExtension)){
                    setDocumentType(fileExtension);
                }
            }
            
            setDocumentBytes(new Blob([res.data]));
        }).catch((err) => {
            console.error('Error downloading file :', err);
        }).finally(() => {
            setLoadingDocument(false);
        });
    }
        
          
    
    useEffect(() => {
        if(documentId){
            // Reset the document
            setDocumentBytes(undefined);
            setLoadingDocument(true);
            setError(false);
            setDocument(new DocumentDto());
            setDocumentType('');

            fetchDocumentDto();
        }
    }, [documentId]);

    useEffect(() => {
        if(documentId && document.referenceGed != ''){
            downloadFile();
        }
    }, [document]);


    const getDocumentTypeFromFileUrl = async (fileUrl : string) => {
        const response = await fetch(fileUrl);
        const contentType = response.headers.get('content-type');
        return contentType?.toLowerCase() ?? "";
        }

        useEffect(() => {
            if(file){
            getDocumentTypeFromFileUrl(file).then((type) => {
                setDocumentType(type);
            });
        }
    }, [document,file]);

   
    return (
        <div className={className ? className : ""} style={{ height: "100%" }}  >
            {
                !file && loadingDocument ?
                <div className="flex justify-content-center items-center w-full">
                    <ProgressBar
                        style={{ width: '800px', height: '20px' }} 
                        value={loadingPercentage}    
                    />
                </div>
                :
                file && progress  && progress<1 &&
                <div className="flex justify-content-center items-center w-full">
                    <ProgressBar
                        style={{ width: '800px', height: '20px' }} 
                        value={progress*100}    
                    />
                </div>             

            }

            {
                !file && error &&
                <div className="flex justify-content-center items-center h-full">
                    <p>Error fetching document</p>
                    <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                </div>
            }
            {
                !file && !error && !loadingDocument && !documentBytes &&
                <div className="flex justify-content-center items-center h-full">
                    <p>No document found</p>
                </div>
            }
            {
                (file || documentBytes ) && !error && !loadingDocument &&
                <>
                {
                    isPdf(documentType.toLowerCase()) 
                    ?
                    <PdfViewer file={file??undefined} documentBlob={documentBytes} showToolBar={showToolBar} showPageNumber={showPageNumber} showZoomControls={showZoomControls} showEditControls={showEditControls} twoPages={twoPages} height={height} setNumPages={setNumberPagesExternal} pageNumber={pageNumberExternal} setPage={setPageExternal} />
                    :
                    isExcel(documentType.toLowerCase())
                    ?
                    <ExcelViewer fileUrl={file} documentBlob={documentBytes} />
                    :
                    isWord(documentType.toLowerCase())
                    ?
                    <WordViewer documentBlob={documentBytes} fileUrl={file} />
                    :
                    isImage(documentType.toLowerCase())
                    ?
                    <ImageViewer fileUrl={file} documentBlob={documentBytes} imageType={documentType}/>
                    :
                    <div className="flex flex-column  items-center h-full">
                        <p>On a rencontrer des difficultés pour détecter le type de document.</p>
                        <p>Veuillez specifier le type de ce document</p>
                        <SelectButton options={[{label: "PDF", value: "pdf"}, {label: "Excel", value: "excel"}, {label: "Word", value: "word"}, {label: "Image", value: "image/svg+xml"},{label:"tiff",value:"Tiff"}]} onChange={(e) => setDocumentType(e.value)} />

                    </div>

                }

                </>
            }

            
        </div>
    )
}

export default FileViewer