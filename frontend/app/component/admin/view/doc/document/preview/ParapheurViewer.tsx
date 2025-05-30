import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useMemo, useRef, useState } from 'react';
import { Document, Page } from "react-pdf";
import { PDFDocument } from 'pdf-lib';
import { DocumentDto } from 'app/controller/model/Document.model';
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import OtpProcess, { OtpProcessHandles, OtpType } from 'app/component/otp/otp_process';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import { ParapheurDto } from 'app/controller/model/parapheur/parapheurDto.model';
import ParapheurComments from 'app/component/admin/view/doc/parapheur/ParapheurComments';
import EditFicheParapheur from '../../parapheur/EditFicheParapheur/EditFicheParapheur';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { set } from 'js-cookie';
import { Dropdown } from 'primereact/dropdown';

type Props = {
    parapheur: ParapheurDto;
    signAll?: (parapheurId: number) => Promise<void>;
    signingInProgress?: boolean;
}

const ParapheurViewer = ({ parapheur, signAll, signingInProgress }: Props) => {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [documentsBytes, setDocumentsBytes] = useState<Blob>(new Blob());
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [zoom, setZoom] = useState(650);
    const [showPageNumber, setShowPageNumber] = useState(true);

    const connectedUser = useConnectedUserStore(state => state.connectedUser);

    const documentService = new DocumentAdminService();

    const getParapheurDocuments = async (id: number): Promise<DocumentDto[]> => {
        setLoading(true);
        setError(false);
        try {
            const res = await parapheurService.fetchDocumentsForParapheur(id.toString());
            return res.data;
        } catch (error) {
            console.error('Error loading parapheur documents', error);
            setError(true);
            return [];
        }
    }

    const mergePDFs = async (pdfBlob1: Blob, pdfBlob2: Blob): Promise<Blob> => {
        const arrayBuffer1 = await pdfBlob1.arrayBuffer();
        const arrayBuffer2 = await pdfBlob2.arrayBuffer();

        const pdfDoc1 = await PDFDocument.load(arrayBuffer1);
        const pdfDoc2 = await PDFDocument.load(arrayBuffer2);

        const mergedPdf = await PDFDocument.create();

        const copiedPagesFromFirstPdf = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
        copiedPagesFromFirstPdf.forEach((page) => mergedPdf.addPage(page));

        const copiedPagesFromSecondPdf = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
        copiedPagesFromSecondPdf.forEach((page) => mergedPdf.addPage(page));

        const mergedPdfBytes = await mergedPdf.save();
        return new Blob([mergedPdfBytes], { type: 'application/pdf' });
    };


    const downloadAndMergeDocuments = async (documents: DocumentDto[]) => {
        let mergedPdf: Blob | null = null;
        const ficheParaph = await parapheurService.getFicheParaph(parapheur.id);
        if (ficheParaph.data) {
            const ficheParaphData = await documentService.downloadFile(ficheParaph.data.referenceGed);
            mergedPdf = ficheParaphData.data;
        }

        for (const document of documents) {
            await documentService.downloadFile(document.referenceGed)
                .then(async (res) => {
                    if (mergedPdf === null) {
                        mergedPdf = res.data;
                    } else {
                        await mergePDFs(mergedPdf, res.data)
                            .then((res) => {
                                mergedPdf = res;
                            }).catch((error) => {
                                console.error('Error merging pdfs :', error);
                            });
                    }
                }).catch((error) => {
                    console.error('Error downloading document :', document, error);
                });

        }

        if (mergedPdf) {
            setDocumentsBytes(mergedPdf);
        }
    };

    const onDialogOpen = async () => {
        setShowDialog(true);
        if (documentsBytes.size === 0) {
            setLoading(true);
            await getParapheurDocuments(parapheur.id).then(async (res) => {
                await downloadAndMergeDocuments(res).then(() => {
                    setLoading(false);
                });
            });
        }
    }

    const onDialogClose = () => {
        setShowDialog(false);
    }

    const handleDownload = () => {
        const url = URL.createObjectURL(documentsBytes);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documents.pdf';
        a.click();
    }
    const handleRevoirFicheParapheur = () => {
        //back to first page
        setPageNumber(1);
    }

    const otpRef = React.useRef<OtpProcessHandles>(null);

    const SignerToutButton = () => {
        const allSigned = parapheur.parapheurEtat.toLowerCase() === "termine";
        const userExists = parapheur?.utilisateurDtos?.some((user: any) => user.username === connectedUser?.username);
        if (!allSigned) {
            return (
                <div className="flex flex-row gap-2">
                    {userExists ?
                        <Button
                            className=' bg-red-700 border-white font-bold p-0' raised rounded tooltip='Signer tout les documents du parapheur'
                            icon="pi pi-pencil"
                            onClick={(e) => confirmPopup({
                                target: e.currentTarget,
                                message: 'Voulez-vous vraiment signer tous les documents ?',
                                icon: 'pi pi-exclamation-triangle',
                                accept: async () => {
                                    otpRef.current?.startOtpProcess({ params: { parapheurId: parapheur.id } });
                                },
                                acceptClassName: 'p-button-danger',
                                rejectClassName: 'p-button-secondary'
                            })}
                        />
                        : <></>
                    }
                    <ConfirmPopup />
                    <OtpProcess
                        otpType={OtpType.SignatureMasse}
                        onSuccess={() => {
                            if (signAll) {
                                signAll(parapheur.id);
                            }
                        }}
                        ref={otpRef}
                    />
                </div>
            );
        } else {
            return <Button icon="pi pi-verified" className="" severity='success' raised text rounded tooltip='Parapheur signé' />;

        }

    }

    const handleNextPage = () => {
        if (pageNumber + 1 !== numPages) setPageNumber(Math.min(numPages, pageNumber + 2))
    }
    const handlePreviousPage = () => {
        setPageNumber(Math.max(1, pageNumber - 2))
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

            <div className='flex flex-row surface-100 border-solid surface-border'>
                <Button icon="pi pi-save" className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Télécharger le document' onClick={handleDownload} />
                <Button icon="pi pi-search-plus " className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Zoome avant' onClick={() => setZoom(zoom + 150)} />
                <Button icon="pi pi-search-minus " className='hover:surface-300 border-solid surface-border border-y-none border-noround' text tooltip='Zoome arrière' onClick={() => setZoom(zoom - 150)} />
                {customPageNumberDropdownTemplate()}                
            </div>

        )
    }

    const SideMenuBar = () => {
        return (
            <div className='flex flex-column justify-content-between surface-100  h-full border-solid surface-border'>
                <div></div>
                <div className='flex flex-column gap-1 p-1 border-500 border-top-3 '>
                    <ParapheurComments parapheur={parapheur} />
                    <Button icon="pi pi-link" className='bg-green-600 border-white font-bold text-lg' rounded tooltip='Partager le document' />
                    <EditFicheParapheur parapheur={parapheur} />
                    <Button icon="pi pi-file" className='bg-primary-500 border-white font-bold text-lg' rounded tooltip='Revoir la fiche du parpheur' onClick={handleRevoirFicheParapheur} />
                    {signAll && <SignerToutButton />}
                </div>
            </div>
        )
    }

    return (
        <div>
            <Button
                onClick={onDialogOpen}
                rounded
                raised
                text
                tooltip='Ouvrir le E-Parapheur'
                className='p-0 bg-white flex align-items-center justify-content-center w-fit '
                style={{ boxShadow: "0 0px 2px rgba(0, 24, 255, 0.8)" }}
            >
                <div className='m-2 '>
                    <img src={`/Icons/digital-signature (1).png`} alt="" style={{ 'width': '22px', 'height': '20px' }} />
                </div>
            </Button>
            {/* <Button
                icon='pi pi-eye'
                iconPos="right"
                onClick={onDialogOpen}
                severity='info'
                rounded
            /> */}
            <Dialog
                header={
                    <div style={{
                        display: "flex",
                        // justifyContent: "center",
                        alignItems: "center",
                        letterSpacing: "5px",
                        textTransform: "uppercase",
                        fontFamily: "'Roboto Mono', monospace",
                        padding: "10px"
                    }}>

                        <img src={`/Icons/digital-signature (1).png`} alt="" style={{ 'marginRight': '8px', 'width': '30px', 'height': '30px' }} />
                        <span className='text-blue-900 text-4xl'>E</span>
                        <span className='text-blue-800 text-4xl'>-</span>
                        <span className='text-blue-700 text-3xl'>P</span>
                        <span className='text-blue-600 text-3xl'>A</span>
                        <span className='text-blue-600 text-3xl'>R</span>
                        <span className='text-blue-600 text-3xl'>A</span>
                        <span className='text-blue-600 text-3xl'>P</span>
                        <span className='text-blue-600 text-3xl'>H</span>
                        <span className='text-blue-700 text-3xl'>E</span>
                        <span className='text-blue-800 text-3xl'>U</span>
                        <span className='text-blue-900 text-3xl'>R</span>
                    </div>


                }
                visible={showDialog}
                style={{position:"relative", maxWidth: '80vw', height: '90vh', boxShadow: "0 0px 10px rgba(0, 24, 255, 0.8)" }}
                onHide={onDialogClose}
                modal
            >
                {
                    loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <ProgressSpinner />
                        </div>
                    ) : error ? (
                        <div className="flex justify-content-center items-center h-full">
                            <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                        </div>
                    ) :
                        (
                            <div className='flex flex-row px-3' >
                                <div className=''>
                                    <TopMenuBar />
                                    <Document
                                        className="flex flex-column w-fit"
                                        file={documentsBytes}
                                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                    >

                                        <div className='flex flex-row border-solid border-500'>
                                            <div className="relative flex-1 justify-content-center ">
                                                {/* {pageNumber > 1 && (
                                                <Button className="absolute top-45 right-0 z-5 " text rounded icon="pi pi-angle-left text-4xl" onClick={() => onPageChange(Math.max(1, pageNumber - 2))} />
                                            )} */}
                                                <Page className="" height={zoom} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                                                {numPages > 1 && showPageNumber && <p className="text-center">{pageNumber} / {numPages}</p>}
                                            </div>
                                            {
                                                numPages > 2 &&
                                                <Divider layout="vertical" align='center' className='p-0 m-0 ' >
                                                    <div className='flex flex-column m-0 p-0 '>
                                                        <Button className="" size='small' text rounded icon="pi pi-angle-left text-xl" onClick={handlePreviousPage} />
                                                        <Button className="" size='small' text rounded icon="pi pi-angle-right text-xl" onClick={handleNextPage} />
                                                    </div>
                                                </Divider>
                                            }
                                            {numPages === 2 && <Divider layout='vertical' />}
                                            <div className="relative flex-1 justify-content-center  ">
                                                {pageNumber < numPages && (
                                                    <>
                                                        {/* <Button className="absolute top-55 left-0 z-5" text rounded icon="pi pi-angle-right text-4xl" onClick={() => onPageChange(Math.min(numPages, pageNumber + 2))} /> */}
                                                        <Page className="" height={zoom} pageNumber={pageNumber + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                                                        {showPageNumber && <p className="text-center">{pageNumber + 1} / {numPages}</p>}
                                                    </>
                                                )}
                                            </div>
                                            {numPages > 2 && numPages % 2 === 1 && pageNumber === numPages && <div className='' style={{ minWidth: "30rem" }}></div>}
                                        </div>
                                    </Document>
                                </div>
                                <div className=''>
                                    <SideMenuBar />
                                </div>
                            </div>

                        )}
                {signingInProgress &&
                    <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
                        <ProgressSpinner />
                    </div>
                }
            </Dialog>
        </div>
    );
}

export default ParapheurViewer;
