import { Attachments } from "app/component/signature/components/Attachments";
import { MenuBar } from "app/component/signature/components/MenuBar";
import { Page } from "app/component/signature/components/Page";
import { AttachmentTypes } from "app/component/signature/entities";
import { Pdf, usePdf } from "app/component/signature/hooks/usePdf";
import { UploadTypes, useUploader } from "app/component/signature/hooks/useUploader";
import { DrawingModal } from "app/component/signature/modals/DrawingModal";
import { ggID } from "app/component/signature/utils/helpers";
import { prepareAssets } from "app/component/signature/utils/prepareAssets";
import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Canvg } from 'canvg';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAttachments } from "app/component/signature/hooks/useAttachments";
import axiosInstance from "app/axiosInterceptor";

import { pdfjs } from "react-pdf";
import 'jspdf-autotable';
import { confirmPopup } from "primereact/confirmpopup";
import { AuthService } from "app/zynerator/security/Auth.service";
import { UtilisateurAdminService } from "app/controller/service/admin/UtilisateurAdminService.service";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { Toast } from "primereact/toast";
import OtpProcess, { OtpProcessHandles, OtpType } from "app/component/otp/otp_process";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface SignDocumentProps {
    document: DocumentDto;
    parapheurId?: number;
    onDocumentSigned?: (iDSignedDocument: string) => void;
}

const SignDocument = ({ document: selectedDocument, onDocumentSigned, parapheurId }: SignDocumentProps) => {
    const otpRef = useRef<OtpProcessHandles>(null);

    const authService = new AuthService();
    const utilisateurAdminService = new UtilisateurAdminService();
    const utilisateurCriteria = new UtilisateurCriteria();
    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto())

    useEffect(() => {
        const connectedUserName = authService.getUsername();
        utilisateurCriteria.username = connectedUserName;
        utilisateurAdminService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
            const user = data?.list[0];
            setConnectedUser(user);
        });
    }, []);

    useEffect(() => {
        prepareAssets();
        loadDocument(selectedDocument);
    }, []);

    const [showSignDialogue, setShowSignDialogue] = useState(false);
    const [documentBase64, setDocumentBase64] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [drawingModalOpen, setDrawingModalOpen] = useState(false);
    const { file, initialize, pageIndex, isMultiPage, isFirstPage, isLastPage, pages, currentPage, isSaving, downloadPdf, savePdf, previousPage, nextPage, setDimensions, name, dimensions } = usePdf();
    const { add: addAttachment, allPageAttachments, pageAttachments, reset: resetAttachments, update, remove, setPageIndex } = useAttachments();

    const initializePageAndAttachments = (pdfDetails: Pdf) => {
        initialize(pdfDetails);
        const numberOfPages = pdfDetails.pages.length;
        resetAttachments(numberOfPages);
    };

    const { inputRef: pdfInput, handleClick: handlePdfClick, isUploading, onClick, upload: uploadPdf } = useUploader({
        use: UploadTypes.PDF,
        afterUploadPdf: initializePageAndAttachments,
    });
    const { inputRef: imageInput, handleClick: handleImageClick, onClick: onImageClick, upload: uploadImage } = useUploader({
        use: UploadTypes.IMAGE,
        afterUploadAttachment: addAttachment,
    });

    const { upload: uploadSignature } = useUploader({
        use: UploadTypes.IMAGE,
        afterUploadAttachment: addAttachment,
    });

    const [loadingSigned, setLoadingSigned] = useState(false);

    const signDocument = async (document: DocumentDto) => {
        setLoadingSigned(true);
        const pdfFile = await savePdf(allPageAttachments);

        // keep or remove the drag and drop signature

        if (parapheurId) {
            await parapheurService.signDocument(parapheurId, document.id).catch((err) => {
                console.error(err);
            });
        } else {
        }
        setLoadingSigned(true);
        if (onDocumentSigned) {
            onDocumentSigned(selectedDocument.reference as string);
        }
        window.location.reload();
    }

    useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);
    const addText = () => {
        const newTextAttachment: TextAttachment = {
            id: ggID(),
            type: AttachmentTypes.TEXT,
            x: 0,
            y: 0,
            width: 220,
            height: 25,
            size: 16,
            lineHeight: 1.4,
            fontFamily: 'Times-Roman',
            text: 'Enter Text Here',
        };
        addAttachment(newTextAttachment);
    };

    const addDrawing = (drawing?: { width: number, height: number, path: string }) => {
        if (!drawing) return;

        const newDrawingAttachment: DrawingAttachment = {
            id: ggID(),
            type: AttachmentTypes.DRAWING,
            ...drawing,
            x: 0,
            y: 0,
            scale: 1,
        }
        addAttachment(newDrawingAttachment);
    }

    useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);
    const handleSavePdf = () => downloadPdf(allPageAttachments);

    const service = new DocumentAdminService();

    const loadDocument = (document: DocumentDto) => {
        try {
            setLoading(true);
            service.getDocumentBase64(document.id).then(({ data }) => {
                setDocumentBase64(data);
                setError(false);
                const byteCharacters = atob(data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
                const pdfFile = new File([pdfBlob], "file.pdf", { type: 'application/pdf' });
                const pdfObject = {
                    name: "file.pdf",  // Assuming document name is available
                    file: pdfFile,
                    pages: [], // Empty for now, will be filled later
                };
                initializePageAndAttachments(pdfObject);
                uploadPdf(pdfFile, UploadTypes.PDF);
            }).catch((err) => {
                setError(true);
            }).finally(() => {
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }


    const [signature, setSignature] = useState<File | undefined>(undefined);
    const fetchSignature = async (userId: number) => {
        if (userId === undefined) return;

        const response = await axiosInstance.get(`${API_URL}/admin/utilisateur/${userId}/signature`);

        if (response.status === 200) {
            const svgData = response.data.svgData as string;

            const parser = new DOMParser();
            const doc = parser.parseFromString(svgData, "image/svg+xml");
            const svgElement = doc.documentElement as unknown as SVGSVGElement;

            const canvas = document.createElement('canvas');
            canvas.width = 1900;
            canvas.height = 900;

            const ctx = canvas.getContext('2d');

            if (ctx === null) {
                throw new Error('Unable to get 2D rendering context');
            }

            // ctx.scale(scaleFactor, scaleFactor);

            const v = Canvg.fromString(ctx, svgElement.outerHTML);
            v.start();

            const dataUrl = canvas.toDataURL('image/png');
            const byteString = atob(dataUrl.split(',')[1]);
            const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], "output.png");

            setSignature(file);
        } else {
            console.error('Failed to fetch signature');
        }
    };

    useEffect(() => {
        fetchSignature(connectedUser.id);
    }, [connectedUser.id]);

    const hiddenInputs = (
        <>
            <input
                data-testid="pdf-input"
                ref={pdfInput}
                type="file"
                name="pdf"
                id="pdf"
                accept="application/pdf"
                onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                        uploadPdf(event.target.files[0], UploadTypes.PDF);
                    }
                }}
                onClick={onClick}
                style={{ display: 'none' }}
            />
            <input
                ref={imageInput}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onClick={onImageClick}
                style={{ display: 'none' }}
                onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                        uploadImage(event.target.files[0], UploadTypes.IMAGE)
                    }
                }}
            />
        </>
    );

    return (
        <>
            {hiddenInputs}
            <Button label={"Signer"} icon="pi pi-pencil" iconPos="right"
                onClick={(e) => {
                    setShowSignDialogue(true);
                }} />

            <Dialog
                header="Signer le document"
                visible={showSignDialogue}
                style={{ width: '50vw' }}
                onHide={() => setShowSignDialogue(false)}
                footer={
                    <>
                        <div className="p-grid p-justify-between">
                            <Button label="Annuler" className="p-button-secondary" onClick={() => setShowSignDialogue(false)} />
                            <Button label="Signer" icon="pi pi-check" className="p-button-primary" loading={loadingSigned} onClick={(e) => {
                                // signDocument(selectedFile.id)
                                confirmPopup({
                                    target: e.currentTarget,
                                    message: 'Are you sure you want to sign the selected Document ?',
                                    icon: 'pi pi-exclamation-triangle',
                                    accept: () => {
                                        otpRef.current?.startOtpProcess({params: { docId: selectedDocument.id }});
                                    },
                                    acceptClassName: 'p-button-danger',
                                    rejectClassName: 'p-button-secondary'
                                })
                            }} />
                        </div>
                        <OtpProcess 
                            otpType={OtpType.Signature}
                            onSuccess={() => signDocument(selectedDocument)}
                            ref={otpRef}
                        />
                    </>
                }
                modal
            >
                {selectedDocument && loading && <div className="flex justify-content-center">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>}
                {selectedDocument && error && <div className="flex justify-content-center">
                    <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                </div>}
                {selectedDocument && !loading && documentBase64 &&
                    <div className="flex flex-column justify-content-center">
                        <MenuBar
                            savePdf={handleSavePdf}
                            addImage={handleImageClick}
                            addSignature={() => {
                                if (signature) uploadSignature(signature, UploadTypes.IMAGE);
                            }}
                            addText={addText}
                            addDrawing={() => setDrawingModalOpen(true)}
                            savingPdfStatus={isSaving}
                            isPdfLoaded={!!file}
                        />
                        {pages.length > 1 && (
                            <div className="mb-3 mt-3">
                                <p>Page {pageIndex + 1} of {pages.length}</p>
                                <Button
                                    raised
                                    label="Previous"
                                    className="mr-5 w-2"
                                    onClick={previousPage}
                                    disabled={pageIndex === 0 || loadingSigned}
                                />
                                <Button
                                    raised
                                    label="Next"
                                    className="mr-2 w-2"
                                    onClick={nextPage}
                                    disabled={pageIndex === pages.length - 1 || loadingSigned}
                                />
                            </div>
                        )}
                        <div className="flex flex-column align-items-center justify-content-center border-solid border-300">
                            <div style={{ height: 920 }}>
                                {currentPage && (
                                    <div
                                        style={{ position: 'relative' }}
                                    >
                                        <Page
                                            dimensions={dimensions}
                                            updateDimensions={setDimensions}
                                            page={currentPage}
                                        />
                                        {dimensions && (
                                            <Attachments
                                                pdfName={name}
                                                removeAttachment={remove}
                                                updateAttachment={update}
                                                pageDimensions={dimensions}
                                                attachments={pageAttachments}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DrawingModal
                            open={drawingModalOpen}
                            dismiss={() => setDrawingModalOpen(false)}
                            confirm={addDrawing}
                        />
                    </div>
                }
            </Dialog>
        </>
    );
};

export default SignDocument;
