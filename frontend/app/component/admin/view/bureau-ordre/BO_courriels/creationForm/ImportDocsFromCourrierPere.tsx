import { CourrielBureauOrdre } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import { set } from 'date-fns';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react'

type Props = {
    courrielPere: CourrielBureauOrdre;
    selectedDocumentsFromPere: DocumentDto[];
    setSelectedDocumentsFromPere: (documents: DocumentDto[]) => void;
    setDocumentToPreview?: (document: DocumentDto) => void;

}

const ImportDocsFromCourrierPere = ({ courrielPere, selectedDocumentsFromPere, setSelectedDocumentsFromPere ,setDocumentToPreview}: Props) => {

    const documentService = new DocumentAdminService();

    const handleViewDocument = (document: DocumentDto) => {
        if(setDocumentToPreview){
            setDocumentToPreview(document);
        }
    }


    return (
        <>
            <DataTable
                value={courrielPere?.documents}
                className="p-datatable-sm mt-4"
                paginator
                rows={5}
                selectionMode="single"
                selection={selectedDocumentsFromPere}
                onSelectionChange={(e) => setSelectedDocumentsFromPere(e.value as DocumentDto[])}
            >
                <Column selectionMode="multiple" style={{ width: '3em' }} />
                <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }} />
                <Column field="planClassement.libelle" header="Plan Classement" sortable />
                <Column field="documentCategorie.libelle" header="Categorie" sortable style={{ minWidth: '8rem' }} />
                {
                    setDocumentToPreview && (
                        <Column header="Actions" body={(rowData: DocumentDto) => {
                            return (
                                <Button
                                    icon="pi pi-eye"
                                    onClick={() => {handleViewDocument(rowData)}} />
                            );
                        }} />                    
                    )
                }
            </DataTable>
            
        </>
    )
}

export default ImportDocsFromCourrierPere