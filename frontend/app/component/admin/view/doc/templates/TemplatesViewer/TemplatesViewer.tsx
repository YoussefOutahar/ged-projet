import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Page, Document, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
type Props = {
    file: File | null
    showPageNumber?: boolean
    enableForms?: boolean
    pageRef?: any
    templateBuilder? : boolean
}

type viewMode = 'single' | 'double'


const TemplatesViewer = forwardRef((props: Props, ref) => {

    const { file, showPageNumber = true, enableForms = true, templateBuilder = false , pageRef } = props;

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [viewMode, setViewMode] = useState<viewMode>('single');
    const [zoom, setZoom] = useState(900);
    const [rotation, setRotation] = useState(0);

    const rotate = (value = 90) => {
        setRotation(prev => (prev + value) % 360)
    }

    const isSinglePagePerView = () => {
        return viewMode === 'single'
    }
    const isDoublePagePerView = () => {
        return viewMode === 'double'
    }
    const toggleViewMode = () => {
        if(isSinglePagePerView()) {
            zoomOut(200)
            setViewMode('double')
        }else{
            zoomIn(200)
            setViewMode('single')
        }
    }

    useEffect(() => {
        if (file) {
            setPageNumber(1);
        }
    }, [file])

    const zoomIn = (value = 150) => {
        setZoom(prev => Math.min(3000 ,prev + value))
    }
    const zoomOut = (value = 150) => {
        setZoom((prev) => Math.max(150, prev - value))
    }

    const handleDownload = () => {
        if(!file) return
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name || 'documents.pdf';
        a.click();
    }

    const handleNextPage = () => {
        if(isDoublePagePerView()){
            if (pageNumber + 1 !== numPages) setPageNumber(Math.min(numPages, pageNumber + 2))
        }else{
            setPageNumber(Math.min(numPages, pageNumber + 1))
        }
    }
    const handlePreviousPage = () => {
        isDoublePagePerView() ? setPageNumber(Math.max(1, pageNumber - 2)) : setPageNumber(Math.max(1, pageNumber - 1))
    }

    const [showPageNumberDropdown, setShowPageNumberDropdown] = useState(false);
    const togglePageNumberDropdown = () => {
        setShowPageNumberDropdown(prev => !prev);
    }
    const customPageNumberDropdownTemplate = () => {
        return (
            <div className='relative ml-auto overflow-visible '>
                <Button label={pageNumber.toString()} icon={(showPageNumberDropdown ? "pi pi-angle-up" : "pi pi-angle-down") + " text-xl text-color-secondary"} iconPos='right' className='hover:surface-300 border-solid surface-border border-y-none border-noround text-color' text onClick={() => togglePageNumberDropdown()} />

                <div className='absolute flex flex-column  '>
                    <div className={`surface-100 max-h-10rem overflow-y-scroll border-solid surface-border border-x-none border-round z-5 ${showPageNumberDropdown ? "" : "hidden"}`} >
                        {Array.from({ length: numPages }, (_, i) => (
                            <Button key={i} label={(i + 1).toString()} className='hover:surface-300 border-solid surface-border border-y-none border-r-none border-noround w-full' text onClick={() => {
                                setPageNumber(i + 1)
                                setShowPageNumberDropdown(false)
                            }} />
                        ))}
                    </div>
                </div>

            </div>
        );
    }

    const TopMenuBar = () => {
        return (

            <div className='flex flex-row align-items-center  surface-100 border-solid surface-border '>
                {isSinglePagePerView() && <Button icon="pi pi-chevron-left text-xl" className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='' onClick={handlePreviousPage} />}
                <Button icon="pi pi-save" className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Télécharger le document' onClick={handleDownload} />
                {/* {<Button icon="pi pi-align-justify" className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Vue double page' onClick={() => setViewMode('double')} />} */}
                {
                    !templateBuilder && <>
                        <Button disabled={numPages < 2} className='flex flex-row hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Vue double page' onClick={toggleViewMode} >
                            <i className={`pi pi-align-justify ${isDoublePagePerView() && "hidden"} `} style={{ marginRight: "1px" }} ></i>
                            <i className="pi pi-align-justify "></i>
                        </Button>
                        <Button icon="pi pi-undo" className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Rotation' onClick={() => rotate()} />
                        <Button icon="pi pi-search-plus " className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Zoome avant' onClick={() => zoomIn()} />
                        <Button icon="pi pi-search-minus " className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Zoome arrière' onClick={() => zoomOut()} />
                    </>
                }
                <span className='mx-auto text-xl font-medium vertical-align-middle'>{file && file.name}</span>
                {customPageNumberDropdownTemplate()}
                {isSinglePagePerView() && <Button icon="pi pi-chevron-right text-xl" className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='' onClick={handleNextPage} />}

            </div>

        )
    }

    const SideMenuBar = () => {
        return (<></>
            // <div className='flex flex-column justify-content-between surface-100  h-full border-solid surface-border'>
            //     <div></div>
            //     <div className='flex flex-column gap-1 p-1 border-500 border-top-3 '>
            //         <Button icon="pi pi-link" className='bg-green-600 border-white font-bold text-lg' rounded tooltip='Partager le document' />
            //         <Button icon="pi pi-file" className='bg-primary-500 border-white font-bold text-lg' rounded tooltip='Revoir la fiche du parpheur' onClick={handleRevoirFicheParapheur} />
            //     </div>
            // </div>
        )
    }

    // useEffect(() => {
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if (event.key === 'ArrowRight') {
    //             handleNextPage();
    //         } else if (event.key === 'ArrowLeft') {
    //             handlePreviousPage();
    //         } else if (event.key === 'ArrowUp') {
    //             zoomIn()
    //         } else if (event.key === 'ArrowDown') {
    //             zoomOut()
    //         }

    //     };

    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [pageNumber, numPages, viewMode, zoom]);

    useImperativeHandle(ref, () => ({
        goToPage: (page: number) => {
          if (page >= 1 && page <= numPages) {
            setPageNumber(page);
          }
        },
        zoomIn: () => zoomIn(),
        zoomOut: () => zoomOut(),
        rotate: () => rotate(),
        getCurrentState: () => ({
          pageNumber,
          zoom,
          rotation,
          viewMode,
        }),
      }));

    return (
        <div className=''>
            {
                (
                    <div className='flex flex-row  ' >
                        <div className='w-full ' style={{minHeight:"500px"}}>
                            <TopMenuBar />
                            {!file && <div className='flex flex-row justify-content-center align-items-center bg-white' style={{height:"500px"}}><span className='text-2xl text-color-secondary'>Aucun document à afficher</span></div>}
                            {file && (
                            <Document
                                className="flex flex-row justify-content-center "                    
                                file={file }
                                rotate={rotation}
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}  
                                error={<div className='flex flex-row justify-content-center align-items-center bg-white' style={{height:"500px"}}><span className='text-2xl text-color-secondary'>Erreur lors du chargement du document</span></div>}
                                loading={<div className='flex flex-row justify-content-center align-items-center bg-white' style={{height:"500px"}}><span className='text-2xl text-color-secondary'>Chargement du document...</span></div>}
                                noData={<div className='flex flex-row justify-content-center align-items-center bg-white' style={{height:"500px"}}><span className='text-2xl text-color-secondary'>Aucun document à afficher</span></div>}

                            >

                                <div className='flex flex-row border-solid border-200 overflow-auto shadow-4 m-2 my-4' >
                                    <div className="relative flex-1 justify-content-center ">
                                        <Page 
                                        className=""  
                                        canvasRef={pageRef}
                                        onRenderAnnotationLayerSuccess={() => {}}
                                        onRenderAnnotationLayerError={(error : any) => {console.log("Error rendering annotation layer : ",error)}}
                                         height={templateBuilder ? undefined : zoom} 
                                         pageNumber={pageNumber} 
                                         renderForms={enableForms}
                                         
                                         />
                                        {numPages > 1 && showPageNumber && <p className="text-center">{pageNumber} / {numPages}</p>}
                                    </div>
                                    {
                                        isDoublePagePerView() && numPages > 2 &&
                                        <Divider layout="vertical" align='center' className='p-0 m-0 ' >
                                            <div className='flex flex-column m-0 p-0 '>
                                                <Button className="" size='small' text rounded icon="pi pi-angle-left text-xl" onClick={handlePreviousPage} />
                                                <Button className="" size='small' text rounded icon="pi pi-angle-right text-xl" onClick={handleNextPage} />
                                            </div>
                                        </Divider>
                                    }
                                    {isDoublePagePerView() && numPages === 2 && <Divider layout='vertical' />}
                                    <div className="relative flex-1 justify-content-center  ">
                                        {isDoublePagePerView() && pageNumber < numPages && (
                                            <>
                                                <Page className="" renderForms={true} height={zoom} pageNumber={pageNumber + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                                                {showPageNumber && <p className="text-center">{pageNumber + 1} / {numPages}</p>}
                                            </>
                                        )}
                                    </div>
                                    {numPages > 2 && numPages % 2 === 1 && pageNumber === numPages && <div className='' style={{ minWidth: "30rem" }}></div>}
                                </div>
                            </Document>
                            )}
                        </div>
                        <div className=''>
                            <SideMenuBar />
                        </div>
                    </div>

                )}
        </div>
    );
})

export default TemplatesViewer;
