import axiosInstance from "app/axiosInterceptor";
import { DocumentDto } from "app/controller/model/Document.model";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import { useCourrielsContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsProvider";
import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { Dialog } from "primereact/dialog";
import FileViewer from "../../../doc/document/preview/FileViewer";
import FileChip from "./FileChip";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface Props {
    courrier: CourrielBureauOrdre;
    setAddedDocuments: (documents: DocumentDto[]) => void;
    addedDocuments: DocumentDto[];
}

const InterventionAddFilesButton = ({ courrier, addedDocuments, setAddedDocuments }: Props) => {
    const overlayPanelDocuments = useRef(null);


    const [documentId, setDocumentId] = useState<number>(0);
    const [showPreviewDocument, setShowPreviewDocument] = useState(false);
    const onFilePreview = (documentId: number) => {
        setDocumentId(documentId);
        setShowPreviewDocument(true);
    }
    const onHidePreviewDocument = () => {
        setShowPreviewDocument(false);
        setDocumentId(0);
    }

    return <>
        <div className="flex flex-column">
            <label className="ml-2 mb-2">Documents</label>

            <div className="flex flex-column ml-2 gap-2">
                {
                    addedDocuments.map((doc) => (
                        <FileChip document={doc} />
                    ))
                }
                <Button
                    icon="pi pi-plus"
                    className="my-auto"
                    rounded
                    tooltip="Ajouter des documents"
                    onClick={(e) => {
                        (overlayPanelDocuments.current as any)?.toggle(e)
                    }}
                />

            </div>
        </div>

        <OverlayPanel ref={overlayPanelDocuments} showCloseIcon dismissable={false}>
            <DataTable
                value={courrier.documents}
                selectionMode="multiple"
                emptyMessage="No documents found"
                selection={addedDocuments}
                onSelectionChange={
                    (e) => {
                        setAddedDocuments(e.value as DocumentDto[]);
                    }
                }
            >
                <Column selectionMode="multiple" style={{ width: '3em' }} />
                <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                <Column field="planClassement.libelle" header="Plan Classement" sortable />
                <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                <Column header="Actions" style={{ width: '6rem' }}
                    body={(rowData: DocumentDto) => (
                        <Button
                            icon="pi pi-eye"
                            rounded
                            onClick={(e) => {
                                (overlayPanelDocuments.current as any)?.hide();
                                onFilePreview(rowData.id);
                            }}
                        />
                    )}
                />
            </DataTable>
        </OverlayPanel>

        {/* -------------File preview dialog------------ */}
        <Dialog
            header="File preview"
            visible={showPreviewDocument}
            style={{ width: '50vw' }}
            modal
            onHide={onHidePreviewDocument}
        >
            <FileViewer documentId={documentId} twoPages={false} />
        </Dialog>
    </>
};

export default InterventionAddFilesButton;