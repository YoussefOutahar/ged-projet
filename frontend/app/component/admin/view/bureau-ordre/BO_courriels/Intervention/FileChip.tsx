import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { set } from "date-fns";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FileViewer from "../../../doc/document/preview/FileViewer";
import SignDocument from "../../../doc/parapheur/SignDocument";

interface Props {
    document: DocumentDto;
    signDocument?: boolean;
}

const FileChip = ({ document, signDocument = false }: Props) => {

    const [showFile, setShowFile] = useState(false);
   

    const handleDocumentSigned = (signedDocument : string) => {
        if (signedDocument) {
            // console.log('Document signé reçu:', signedDocument);
            // Vous pouvez maintenant utiliser le document signé ici
        } else {
            console.error('Échec de la signature du document');
        }
    };



    return (
        <>
            <Chip
                label={document.reference}
                icon="pi pi-file"
                className="text-sm mr-2 mt-2 cursor-pointer hover:bg-primary"
                style={{ width: 'fit-content' }}
                onClick={(e) => setShowFile(true)}
            />

            <Dialog
                header={document.reference}
                visible={showFile}
                style={{ width: '50vw' }}
                onHide={() => setShowFile(false)}
                modal
            >
                {
                    signDocument
                        ?
                        <SignDocument document={document} onDocumentSigned={handleDocumentSigned} />
                        :
                        <FileViewer documentId={document.id} twoPages={false} />
                }

            </Dialog>
        </>
    );
};

export default FileChip;