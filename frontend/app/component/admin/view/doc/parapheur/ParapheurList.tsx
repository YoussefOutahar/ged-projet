import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import React, { } from "react";
import { useState } from "react";
import { TFunction } from "i18next";
import { ProgressSpinner } from "primereact/progressspinner";
import PreviewParapheurFilesButton from "app/component/admin/view/doc/parapheur/PreviewParapheurlFilesButton";
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";
import { Button } from "primereact/button";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import OtpProcess, { OtpProcessHandles, OtpType } from "app/component/otp/otp_process";
import ParapheurViewer from "app/component/admin/view/doc/document/preview/ParapheurViewer";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import ParapheurComments from "./ParapheurComments";
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { Dialog } from "primereact/dialog";

type MyStateType = {
    [key: string]: boolean;
};
type Props = {
    selectedParapheur: ParapheurDto[];
    setSelectedParapheur: (parapheurs: ParapheurDto[]) => void;
    showToast: React.Ref<Toast>;
    t: TFunction;
    loadingParapheurs: boolean;
    errorParapheur: boolean;
    filteredParapheurs: Page<ParapheurDto> | undefined;
    refetchFiltredParapheurs: () => Promise<void>;
    page: number;
    setPage: (page: number) => void;
    size: number,
    setSearchKeyword: (value: string) => void;
    selectedSignStatus: string,
    setSelectedSignStatus: (value: string) => void;

};

const ParapheurList = ({ t, page, setPage, setSearchKeyword, selectedSignStatus, setSelectedSignStatus, filteredParapheurs, refetchFiltredParapheurs, selectedParapheur, setSelectedParapheur, showToast, loadingParapheurs, errorParapheur }: Props) => {

    const connectedUser = useConnectedUserStore(state => state.connectedUser);
    const otpRef = React.useRef<OtpProcessHandles>(null);
    const [paraphIdToSign, setParaphIdToSign] = useState<number>(0);

    const [expandedRows, setExpandedRows] = useState<MyStateType>({});
    const [documentsByRow, setDocumentsByRow] = useState<{ [key: string]: any[] }>({});
    const [parapheurId, setParapheurId] = useState(0);

    const [signingInProgress, setSigningInProgress] = useState(false);


    const [loadingDocument, setLoadingDocument] = useState<boolean>(false);
    const onRowToggleHandler = async (e: any) => {
        setExpandedRows(e.data);
        let parapheurId = '';
        const newlySelectedData = Object.keys(e.data).filter(key => !expandedRows.hasOwnProperty(key));
        parapheurId = newlySelectedData.toString();
        if (parapheurId) {
            setLoadingDocument(true);
            setParapheurId(parseInt(newlySelectedData.toString(), 10));
            try {
                await parapheurService.fetchDocumentsForParapheur(parapheurId).then(res => {
                    setDocumentsByRow(prevState => ({
                        ...prevState,
                        [parapheurId]: res.data
                    }));
                    setLoadingDocument(false);
                })
                    .catch(error => console.error('Error loading parapheurs', error));
            } catch (error) {
                console.error('Erreur lors de la récupération des documents associés au parapheur', error);
            }
        }
    }

    const rowExpansionTemplate = (data: any) => {
        const document = documentsByRow[data.id] || [];
        return (<>
            <PreviewParapheurFilesButton 
                documents={document} 
                loading={loadingDocument} 
                parapheurId={parapheurId} 
                refetchFiltredParapheurs={refetchFiltredParapheurs}
                setExpandedRows={setExpandedRows}
            />
        </>)


    }

    const parapheursSignStatus = [{ label: 'Signée', value: 'signed' }, { label: 'Non Signée', value: 'unsigned' }, { label: 'Tous', value: 'all' }];

    const handleStatusSelection = (value: string) => {
        setSelectedSignStatus(value);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Parapheurs (Total: {filteredParapheurs?.totalElements}) </h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <Dropdown
                    value={selectedSignStatus}
                    onChange={(e) => handleStatusSelection(e.value)}
                    options={parapheursSignStatus}
                    placeholder="Filtre"
                    className="mr-2"
                    valueTemplate={(option) => <span>{option?.label}</span>}
                    itemTemplate={(option) => <span>{option?.label}</span>}
                />
                <InputText type="search" onInput={(e: any) => setSearchKeyword(e.target.value)} placeholder={t("globalSearch")} />
            </span>
        </div>
    );

    const signButton_andCommentButton = (rowData: ParapheurDto) => {
        const [userExists, setUserExist] = useState<boolean>(false);
        parapheurService.userCanSignParapheur(rowData.id)
            .then((response) => {
                setUserExist(response.data as boolean);
            }).catch((error) => {
                console.error('Error fetching Workflow by parapheur id', error);
            });

        return (
            <div className="flex flex-row gap-2">
                {userExists ? <Button
                    rounded
                    tooltip="Signer tous les documents"
                    icon="pi pi-file-edit text-xl"
                    onClick={(e) => confirmPopup({
                        target: e.currentTarget,
                        message: 'Voulez-vous vraiment signer tous les documents ?',
                        icon: 'pi pi-exclamation-triangle',
                        accept: async () => {
                            // signAll(rowData.id);
                            setParaphIdToSign(rowData.id);

                            otpRef.current?.startOtpProcess({ params: { parapheurId: rowData.id } });
                        },
                        acceptClassName: 'p-button-danger',
                        rejectClassName: 'p-button-secondary'
                    })} /> : <Button icon="pi pi-file-excel text-2xl " className="text-orange-500 bg-white border-orange-500 " raised rounded tooltip="En attente de signature" />}
                <ParapheurComments parapheur={rowData} />
                <ConfirmPopup />

            </div>
        )
    }
    return (
        <>
            {(
                <><DataTable
                    emptyMessage={
                        loadingParapheurs ?
                            <div className="flex justify-content-center">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                            </div> :
                            errorParapheur ?
                                <div className="flex justify-content-center">
                                    <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                                </div> :
                                <div className="flex justify-content-center">Aucun Parapheur touvés</div>
                    }
                    value={filteredParapheurs?.content || []}
                    selection={selectedParapheur} onSelectionChange={(e) => setSelectedParapheur(e.value as any[])}
                    header={header}
                    dataKey="id"
                    expandedRows={expandedRows}
                    onRowToggle={onRowToggleHandler}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}> </Column>
                    <Column body={(rowData) => <ParapheurViewer parapheur={rowData} signingInProgress={signingInProgress} signAll={(idParaph: number) => parapheurService.signAll(idParaph, connectedUser, showToast, refetchFiltredParapheurs, setSigningInProgress)} />}></Column>
                    <Column expander style={{ width: '5rem' }} />
                    <Column field="title" header="Titre" sortable />
                    <Column field="utilisateur" header="Responsable" body={(rowData) => {
                        if (rowData?.utilisateur) {
                            return (
                                <div className="flex align-items-center gap-2">
                                    <img alt="" src="/user-avatar.png" width="32" />
                                    <span className='font-bold'>{rowData?.utilisateur.nom}{' '}{rowData?.utilisateur.prenom}</span>
                                </div>
                            );
                        }
                    }} />

                    <Column
                        header="Date d'action "
                        body={(rowData: any) => `${rowData.createdOn}`}
                        sortable />
                    <Column field="parapheurEtat" header="Etat Avancement" body={(rowData) => {
                        if (rowData.parapheurEtat === "en_attente") {
                            return (
                                <Tag value="En Attente" severity="info" />
                            );
                        } else if (rowData.parapheurEtat === "en_cours") {
                            return (
                                <Tag value="En Cours" severity="warning" />
                            );
                        } else if (rowData.parapheurEtat === "rejete") {
                            return (
                                <Tag value="Rejeté" severity="danger" />
                            );
                        } else if (rowData.parapheurEtat === "termine") {
                            return (
                                <Tag value="Terminé" severity="success" />
                            );
                        }
                    }} />
                    <Column
                        header="Actions"
                        field="_"
                        body={(rowData: ParapheurDto) => {
                            // const documents = documentsByRow[rowData.id] || [];
                            const allSigned = rowData.parapheurEtat.toLowerCase() === "termine";
                            if (!allSigned) {
                                return (<>
                                    {signButton_andCommentButton(rowData)}
                                </>
                                );
                            } else {
                                return <div className="flex flex-row gap-2 mx-auto ">
                                    <Button icon="pi pi-verified text-3xl" className="" severity='success' raised text rounded tooltip='Parapheur signé' />
                                    <ParapheurComments parapheur={rowData} />
                                </div>
                            }
                        }} />
                </DataTable>

                    <OtpProcess
                        otpType={OtpType.SignatureMasse}
                        onSuccess={async () => {
                            await parapheurService.signAll(paraphIdToSign, connectedUser, showToast, refetchFiltredParapheurs, setSigningInProgress);
                            setExpandedRows({});
                        }}
                        ref={otpRef} />
                    <Paginator
                        first={page * (filteredParapheurs?.size ?? 0)}
                        rows={filteredParapheurs?.size}
                        totalRecords={filteredParapheurs?.totalElements}
                        onPageChange={(e: any) => {
                            setPage(e.page);
                        }} />

                    <Dialog
                        visible={signingInProgress}
                        onHide={() => { }}
                        closable={false}
                        showHeader={false}
                        style={{ width: '200px', boxShadow: 'none' }}
                        contentStyle={{ padding: '2rem', textAlign: 'center' }}
                    >
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        <p>Signature en cours...</p>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default ParapheurList;