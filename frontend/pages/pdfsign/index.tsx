import React, { useState, useLayoutEffect, useEffect } from 'react';


import { MenuBar } from 'app/component/signature/components/MenuBar';
import { DrawingModal } from 'app/component/signature/modals/DrawingModal';
import { AttachmentTypes } from 'app/component/signature/entities';
import { Pdf, usePdf } from 'app/component/signature/hooks/usePdf';
import { UploadTypes, useUploader } from 'app/component/signature/hooks/useUploader';
import { Empty } from 'app/component/signature/components/Empty';
import { Page } from 'app/component/signature/components/Page';
import { Attachments } from 'app/component/signature/components/Attachments';
import { ggID } from 'app/component/signature/utils/helpers';
import { useAttachments } from 'app/component/signature/hooks/useAttachments';

import { Button } from 'primereact/button';
import { prepareAssets } from 'app/component/signature/utils/prepareAssets';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';

import { PDFDocument } from 'pdf-lib';





const Sign: React.FC = () => {
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [drawingModalOpen, setDrawingModalOpen] = useState(false);
    const { file, initialize, pageIndex, isMultiPage, isFirstPage, isLastPage, currentPage, isSaving, savePdf, previousPage, nextPage, setDimensions, name, dimensions } = usePdf();
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

    const addText = () => {
        const newTextAttachment: TextAttachment = {
            id: ggID(),
            type: AttachmentTypes.TEXT,
            x: 0,
            y: 0,
            width: 120,
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
    useEffect(() => {
        prepareAssets();
    });
    const service = new DocumentAdminService();


    const loadDocument = (id: number) => {
        try {
            service.getDocumentBase64(id).then(({ data }) => {
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
                console.error('Error fetching document:', err);
            });
        } catch (error) {
            console.error('Error fetching document error:', error);
        }
    }
    useEffect(() => {
        loadDocument(226);
    }, []);

    // useEffect(() => {
    //     console.log('---------pageIndex', pageIndex);
    // }, [pageIndex, currentPage]);

    useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);



    const handleSavePdf = () => savePdf(allPageAttachments);

    return (
        <div className="p-grid p-justify-center">
            <MenuBar
                savePdf={handleSavePdf}
                addImage={handleImageClick}
                addDrawing={() => setDrawingModalOpen(true)}
                addSignature={() => { }}
                savingPdfStatus={isSaving}
                isPdfLoaded={!!file}
                addText={() => { }} />

            {(
                <div className="p-grid">
                    <div className="p-col-3" style={{ textAlign: 'left' }}>
                        {isMultiPage && !isFirstPage && (
                            <Button icon="pi pi-angle-left" onClick={previousPage} />
                        )}

                        {isMultiPage && !isLastPage && (
                            <Button icon="pi pi-angle-right" onClick={nextPage} />
                        )}</div>
                    <div className="p-col-6">
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
            )}
            <DrawingModal
                open={drawingModalOpen}
                dismiss={() => setDrawingModalOpen(false)}
                confirm={addDrawing}
            />


        </div>
    );
}

export default Sign;