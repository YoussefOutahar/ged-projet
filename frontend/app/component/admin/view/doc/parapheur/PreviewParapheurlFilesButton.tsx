import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import FileViewer from "../document/preview/FileViewer";
import { t } from "i18next";
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";
import OtpProcess, { OtpProcessHandles, OtpType } from "app/component/otp/otp_process";
import { DocumentDto } from "app/controller/model/Document.model";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PreviewParapheurFilesButtonProps {
    documents: any;
    loading: boolean;
    parapheurId: number;
    refetchFiltredParapheurs?: () => Promise<void>;
    setExpandedRows?: (expandedRows: any) => void;
}

const PreviewParapheurFilesButton = ({ documents, loading, parapheurId, refetchFiltredParapheurs, setExpandedRows }: PreviewParapheurFilesButtonProps ) => {
    const [previewDocument, setPreviewDocument] = useState<boolean>(false);
    const [docToPreview, setDocToPreview] = useState<number>();
    const [docToSign, setDocToSign] = useState<DocumentDto>();
    const otpRef = useRef<OtpProcessHandles>(null);
    const [loadingSignStates, setLoadingSignStates] = useState<{ [key: number]: boolean }>({});

    const handlePreviewDoc = (documentId:number) => {
        setDocToPreview(documentId);
        setPreviewDocument(true);
    }
    const handleCancelPreviewDoc = () => {
        setPreviewDocument(false);
        setDocToPreview(undefined);
    }

    const [userCanSignParaph, setUserCanSignParaph] = useState<boolean>(false);
    const fetchUserCanSignParaph = async (paraphId: number) => {
        return await parapheurService.userCanSignParapheur(paraphId)
            .then((response) => {
                setUserCanSignParaph(response.data as boolean);
            }).catch((error) => {
                console.error('Error fetching Workflow by parapheur id', error);
            });
    };
    useEffect(() => {
        if (parapheurId) fetchUserCanSignParaph(parapheurId);
    }, [parapheurId]);

    const sign = async (document: DocumentDto) => {
        setLoadingSignStates(prev => ({ ...prev, [document.id]: true }));
        try {
            await parapheurService.signDocument(document.id, parapheurId, refetchFiltredParapheurs);
            setExpandedRows && setExpandedRows({});
        } catch (err) {
            console.error('Error signing document:', err);
        } finally {
            setLoadingSignStates(prev => ({ ...prev, [document.id]: false }));
        }
    }

    return (
        <div
            className="border-solid border-300"
        >
            {loading? (
                <div className="flex justify-content-center">
                    <ProgressSpinner style={{width:"5rem"}} />
                </div>
            ) : (
                <DataTable
                    value={documents}
                    selectionMode="single"
                    dataKey="id"
                    key={documents}
                    metaKeySelection={true}
                    header={<p
                        className="font-bold text-xl"
                        style={{ textAlign: "center" }}
                    >
                        Documents associés au parapheur
                    </p>}
                >
                    <Column header="Reference" field="reference" />
                    <Column header="Responsable" field="utilisateur.email" body={(rowData) => {
                        if (rowData?.utilisateur?.email) {
                            return (
                                <div className="flex align-items-center gap-2">
                                    <img alt="" src="/user-avatar.png" width="32" />
                                    <span className='font-bold'>{`${rowData.utilisateur.prenom} ${rowData.utilisateur.nom}`}</span>
                                </div>
                            )
                        }
                    }} />
                    <Column header="Categorie" field="documentCategorie.libelle" />
                    <Column header="Plan Classement" field="planClassement.libelle" />
                    <Column header="Action" body={(rowData) => <div className="flex flex-row gap-2">
                        {rowData.signed == false && userCanSignParaph &&(
                            // <SignDocument document={rowData} parapheurId={parapheurId}/>
                            <Button label={"Signer"} icon="pi pi-pencil" iconPos="right"
                                loading={loadingSignStates[rowData.id] || false}
                                onClick={(e) => confirmPopup({
                                    target: e.currentTarget,
                                    message: 'Voulez-vous vraiment signer ce document ?',
                                    icon: 'pi pi-exclamation-triangle',
                                    accept: async () => {
                                        setDocToSign(rowData);
                                        otpRef.current?.startOtpProcess({ params: { parapheurId: rowData.id } });
                                    },
                                    acceptClassName: 'p-button-danger',
                                    rejectClassName: 'p-button-secondary'
                                })}
                             />
                        )}
                        {rowData.signed == true && (<Button label="Signée" icon="pi pi pi-check" iconPos="right" className="p-button-success" />)}
                        <Button  icon="pi pi-eye" rounded onClick={()=>handlePreviewDoc(rowData.id)}  />
                    </div>} />

                </DataTable>
            )}
            <OtpProcess
                otpType={OtpType.SignatureMasse}
                onSuccess={async () => {
                    if (docToSign)
                        sign(docToSign);
                }}
                ref={otpRef} />
            <ConfirmPopup />
            <Dialog
                header="Document"
                visible={previewDocument}
                style={{ width: 'max-content', minWidth: '30vw', minHeight: '90vh', overflow: 'auto'}}
                onHide={handleCancelPreviewDoc}
                footer={<Button label={t("cancel")} icon="pi pi-times" onClick={handleCancelPreviewDoc} />}
            >
                <FileViewer documentId={docToPreview} twoPages={false} height={650} />
            </Dialog>
        </div>
    );
}

export default PreviewParapheurFilesButton;
