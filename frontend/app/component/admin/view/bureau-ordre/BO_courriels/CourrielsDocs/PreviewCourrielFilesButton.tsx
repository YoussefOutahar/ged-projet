import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { DocumentDto } from "app/controller/model/Document.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectionChangeEvent } from "primereact/datatable";
import { useState } from "react";
import { pdfjs } from "react-pdf";

import 'jspdf-autotable';
import { Divider } from "primereact/divider";
import AddCourrielDoc from "./AddCourrielDoc";
import axiosInstance from "app/axiosInterceptor";
import { useCourrielsContext } from "app/component/admin/view/bureau-ordre/Providers/CourrielsProvider";
import FileViewer from "../../../doc/document/preview/FileViewer";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    courriel: CourrielBureauOrdre;
    showToast: (severity: SeverityType, summary: string) => void;
};

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const PreviewCourrielFilesButton = ({ courriel, showToast }: Props) => {

    const { fetchCourriels: refetchCourriels } = useCourrielsContext();

    const [selectedFile, setSelectedFile] = useState<DocumentDto>();
    const [metaKey, setMetaKey] = useState(true);

    const service = new DocumentAdminService();



    const handleDeleteDocument = async (doc: DocumentDto) => {
        courriel.dateEcheance = new Date(courriel.dateEcheance) as unknown as string;
        courriel.dateReception = new Date(courriel.dateReception) as unknown as string;

        await axiosInstance.put(`${API_URL}/courriels/${courriel.id}/delete-documents/${doc.id}`).then((res) => {
            setSelectedFile(undefined);

            const newDocuments = courriel.documents.filter((d) => d.id !== doc.id);
            courriel.documents = newDocuments;

            refetchCourriels(courriel.planClassement.id as number);
        }).catch((err) => {
            console.error('Error deleting document:', err);
        });
    }

    return (
        <>
            <DataTable
                value={courriel.documents}
                selectionMode="single"
                dataKey="id"
                selection={selectedFile}
                onSelectionChange={(e: DataTableSelectionChangeEvent<DocumentDto[]>) => {
                    setSelectedFile(e.value as DocumentDto);
                }}
                metaKeySelection={metaKey}
            >
                <Column field="reference" header="Reference" />
                <Column field="documentCategorie.libelle" header="Category Code" />
                <Column field="planClassement.libelle" header="Classification Plan Code" />
                <Column field="entiteAdministrative.libelle" header="Administrative Entity Code" />
                <Column field="utilisateur.nom" header="User Name" body={(rowData) => {
                    if (rowData?.utilisateur?.nom) {
                        return (
                            <div className="flex align-items-center gap-2">
                                <img alt="" src="/user-avatar.png" width="32" />
                                <span className='font-bold'>{rowData.utilisateur.nom}</span>
                            </div>
                        )
                    }
                }} />
                <Column field="uploadDate" header="Creation Date" />
                <Column field="" header="Actions" body={
                    (rowData: DocumentDto) => {
                        return <Button icon="pi pi-trash" className="p-button-rounded" severity="danger" onClick={async () => {
                            await handleDeleteDocument(rowData);
                        }} />
                    }

                } />
            </DataTable>
            <div className="m-4 " style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AddCourrielDoc courriel={courriel} refetchCourriels={refetchCourriels} showToast={showToast} />
            </div>
            <Divider />
            <div className="mx-auto max-w-min">
                {
                    selectedFile &&
                    <FileViewer documentId={selectedFile.id} twoPages={false} />
                }
                {/* <div style={{ width: "70%", height: 920, padding: "50px", border: '1px solid', marginInline: 'auto', position: 'relative' }}>
                    {
                        courriel.intervenants?.map((intervenant, index) => {
                            const actionsToStamp = ["signe", "visa", "approbation", "approve"];
                            return (
                                intervenant.statut === StatutIntervention.CLOTURE &&
                                actionsToStamp.includes(intervenant?.action?.toLowerCase()) &&
                                <span
                                    key={index}
                                    style={{
                                        zIndex: 1000,
                                        position: "absolute",
                                        top: `${index + 4}rem`,
                                        right: `0rem`,
                                        transform: "translate(-50%, -50%) rotate(30deg)",
                                        border: "1px solid red",
                                        padding: "10px",
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                        color: "red",
                                        fontWeight: "bold",
                                        fontSize: "20px"
                                    }}
                                >
                                    {intervenant.action}
                                </span>

                            )
                        })
                    }
                    
                </div> */}
            </div>
            
        </>
    );
}

export default PreviewCourrielFilesButton;