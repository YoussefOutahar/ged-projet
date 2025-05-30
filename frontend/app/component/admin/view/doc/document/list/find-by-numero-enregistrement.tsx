import axiosInstance from "app/axiosInterceptor";
import { DocumentDto } from "app/controller/model/Document.model";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { useDebounce } from "react-use";

import FileViewer from "../preview/FileViewer";
import OtpProcess, { OtpProcessHandles, OtpType } from "app/component/otp/otp_process";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const FindByNumeroEnregistrementButton = () => {
    const otpProcessRef = useRef<OtpProcessHandles>(null);

    // ================== Search Dialog ==================
    const [searchDialogVisible, setSearchDialogVisible] = useState<boolean>(false);
    const [numero, setNumero] = useState<string>("");

    const [documents, setDocuments] = useState<DocumentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedDoc, setSelectedDoc] = useState<DocumentDto | null>(null);

    const handleSearch = () => {
        setLoading(true);
        axiosInstance.get(`${API_URL}/admin/document/find-by-numero-enregistrement?numero=${numero}`)
            .then((response) => {
                setDocuments(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useDebounce(() => {
        if (numero === "") {
            setDocuments([]);
            return;
        }

        handleSearch();
    }, 1000, [numero]);

    const [viewDialogVisible, setViewDialogVisible] = useState<boolean>(false);

    return (
        <>
            <Button
                raised
                label={"Numero"}
                icon="pi pi-folder"
                className=" mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded border border-transparent"
                onClick={() => { setSearchDialogVisible(true) }}
            />

            <Dialog
                header="Trouver par numero d'enregistrement"
                visible={searchDialogVisible}
                style={{ width: '80vw' }}
                modal
                onHide={() => {
                    setSearchDialogVisible(false);
                    setNumero("");
                    setDocuments([]);
                }}
            >
                <div className="p-inputgroup">
                    <InputText
                        className="p-inputtext-lg my-2"
                        id="133"
                        value={numero}
                        placeholder=""
                        onChange={(e) => setNumero(e.target.value)}
                    />
                    <Button
                        className="p-button-help my-2"
                        icon="pi pi-search"
                        onClick={() => { }}
                    />
                </div>
                <DataTable
                    emptyMessage={<div className="flex justify-content-center">Aucun documents touvés</div>}
                    className="w-full"
                    paginator
                    rows={5}
                    value={documents}
                    loading={loading}
                >
                    {/* <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column> */}
                    <Column
                        field="reference"
                        header={"reference"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        field="uploadDate"
                        header={"Upload Date"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        field="documentType.libelle"
                        header={"Document Type"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        field="documentCategorie.libelle"
                        header={"Document Categorie"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        field="documentState.libelle"
                        header={"Document State"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        field="entiteAdministrative.libelle"
                        header={"Entite Administrative"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        field="planClassement.libelle"
                        header={"Plan Classement"}
                        className="w-15rem "
                        sortable
                    />
                    <Column
                        header="Actions"
                        body={(rowData: DocumentDto) => (
                            <>
                                <ConfirmPopup />
                                <Button
                                    icon="pi pi-eye"
                                    onClick={(e) => confirmPopup({
                                        target: e.currentTarget,
                                        message: 'Are you sure you want to view this document?',
                                        icon: 'pi pi-exclamation-triangle',
                                        accept: async () => {
                                            setSelectedDoc(rowData);
                                            setSearchDialogVisible(false);

                                            otpProcessRef.current?.startOtpProcess({params: {docId: selectedDoc?.id}});
                                        },
                                        acceptClassName: 'p-button-danger',
                                        rejectClassName: 'p-button-secondary'
                                    })}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </Dialog>

            <OtpProcess
                otpType={OtpType.ViewDocEnregistrement}
                onSuccess={() => setViewDialogVisible(true)}
                ref={otpProcessRef}
            />

            <Dialog
                header="View Document"
                visible={viewDialogVisible}
                // style={{ width: '30vw', height: '50vh' }}
                modal
                onHide={() => {
                    setViewDialogVisible(false);
                    setSelectedDoc(null);
                }}
            >
                <FileViewer
                    documentId={selectedDoc?.id}
                    showEditControls={true}
                    showZoomControls={true}
                    twoPages={false}
                />
            </Dialog>
        </>
    );
};

export default FindByNumeroEnregistrementButton;
