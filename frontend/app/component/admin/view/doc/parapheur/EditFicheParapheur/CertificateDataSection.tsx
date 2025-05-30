import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { addCertificateData, deleteCertificateData, updateCertificateData } from "./api";
import { parapheurService } from "app/controller/service/parapheur/parapheurService.service";
import { DocumentDto } from 'app/controller/model/Document.model';
import { useTranslation } from 'react-i18next';

type EditableField = Extract<keyof ParapheurCertificateDataDTO, string>;

const EDITABLE_FIELDS: EditableField[] = [
    // 'designation',
    // 'numeroDeReference',
    'numeroDenregistrement',
    'nomDeMarque',
];

interface CertificateDataSectionProps {
    parapheurId: number;
    certificateData: ParapheurCertificateDataDTO[] | undefined;
    isLoading: boolean;
}

const CertificateDataSection: React.FC<CertificateDataSectionProps> = ({ parapheurId, certificateData, isLoading }) => {
    const { t } = useTranslation();
    
    const [editingCertificateData, setEditingCertificateData] = useState<ParapheurCertificateDataDTO | null>(null);
    const [newCertificateData, setNewCertificateData] = useState<Partial<ParapheurCertificateDataDTO>>({});
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [parapheurDocuments, setParapheurDocuments] = useState<DocumentDto[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const queryClient = useQueryClient();

    const certificateDataQueryKey = ['certificateData', parapheurId];

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoadingDocuments(true);
            try {
                const response = await parapheurService.fetchDocumentsForParapheur(parapheurId.toString());
                setParapheurDocuments(response.data);
            } catch (error) {
                console.error('Error fetching parapheur documents:', error);
            } finally {
                setLoadingDocuments(false);
            }
        };

        fetchDocuments();
    }, [parapheurId]);

    const addCertificateDataMutation = useMutation({
        mutationFn: addCertificateData,
        onSuccess: (data) => {
            queryClient.setQueryData(certificateDataQueryKey, (oldData: ParapheurCertificateDataDTO[] | undefined) =>
                oldData ? [...oldData, data] : [data]
            );
            setShowAddDialog(false);
            setNewCertificateData({});
        },
        onError: (error) => {
            console.error('Erreur lors de l\'ajout des données du certificat:', error);
            queryClient.invalidateQueries({ queryKey: certificateDataQueryKey });
        }
    });

    const updateCertificateDataMutation = useMutation({
        mutationFn: updateCertificateData,
        onSuccess: (data) => {
            queryClient.setQueryData(certificateDataQueryKey, (oldData: ParapheurCertificateDataDTO[] | undefined) =>
                oldData ? oldData.map(item => item.id === data.id ? data : item) : []
            );
            setShowEditDialog(false);
        },
        onError: (error) => {
            console.error('Erreur lors de la mise à jour des données du certificat:', error);
            queryClient.invalidateQueries({ queryKey: certificateDataQueryKey });
        }
    });

    const deleteCertificateDataMutation = useMutation({
        mutationFn: deleteCertificateData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: certificateDataQueryKey });
        },
        onError: (error) => {
            console.error('Erreur lors de la suppression des données du certificat:', error);
        }
    });

    const onCertificateDataEdit = (data: ParapheurCertificateDataDTO) => {
        setEditingCertificateData(data);
        setShowEditDialog(true);
    };

    const onCertificateDataSave = () => {
        if (editingCertificateData) {
            updateCertificateDataMutation.mutate({
                parapheurId,
                certificateData: editingCertificateData
            });
        }
    };

    const handleAddCertificateData = () => {
        addCertificateDataMutation.mutate({
            parapheurId,
            certificateData: newCertificateData
        });
    };

    const getAvailableDocuments = () => {
        const usedDocumentReferences = certificateData?.map(cd => cd.documentReference) || [];
        return parapheurDocuments.filter(doc => !usedDocumentReferences.includes(doc.reference));
    };

    const availableDocuments = getAvailableDocuments();

    const renderDialogContent = (data: Partial<ParapheurCertificateDataDTO>, setData: React.Dispatch<React.SetStateAction<Partial<ParapheurCertificateDataDTO>>>) => (
        <>
            <div className="field grid">
                <label htmlFor="documentReference" className="col-fixed" style={{ width: '200px' }}>
                    Document Reference
                </label>
                <div className="col">
                    <Dropdown
                        id="documentReference"
                        value={data.documentReference}
                        options={availableDocuments}
                        onChange={(e) => setData(prev => ({ ...prev, documentReference: e.value }))}
                        optionLabel="reference"
                        optionValue="reference"
                        placeholder="Select a document reference"
                        disabled={loadingDocuments}
                    />
                </div>
            </div>
            {EDITABLE_FIELDS.map((key) => (
                <div key={key} className="field grid">
                    <label htmlFor={key} className="col-fixed" style={{ width: '200px' }}>
                        {key}
                    </label>
                    <div className="col">
                        <InputText
                            id={key}
                            value={String(data[key] || '')}
                            onChange={(e) => setData(prev => ({ ...prev, [key]: e.target.value }))}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            ))}
        </>
    );

    if (isLoading || loadingDocuments) return <ProgressSpinner />;
    if (!certificateData) return <p>Aucune donnée de certificat disponible.</p>;

    return (
        <>
            <DataTable value={certificateData} responsiveLayout="scroll">
                <Column field="documentReference" header={t("parapheur.certificateDataSection.documentReference")} />
                {EDITABLE_FIELDS.map(field => (
                    <Column key={field} field={field} header={t(`parapheur.certificateDataSection.${field}`)} />
                ))}
                <Column 
                    body={(rowData) => (
                        <>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onCertificateDataEdit(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteCertificateDataMutation.mutate({ parapheurId, certificateDataId: rowData.id })} />
                        </>
                    )}
                />
            </DataTable>
            <Button 
                label={t("parapheur.certificateDataSection.addNewData")} 
                icon="pi pi-plus" 
                onClick={() => setShowAddDialog(true)} 
                className="mt-3" 
                disabled={availableDocuments.length === 0}
            />

            <Dialog
                header={t("parapheur.certificateDataSection.editCertificateData")}
                visible={showEditDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowEditDialog(false)}
            >
                {editingCertificateData && renderDialogContent(editingCertificateData, setEditingCertificateData as React.Dispatch<React.SetStateAction<Partial<ParapheurCertificateDataDTO>>>)}
                <div className="flex justify-content-end">
                    <Button label={t("parapheur.certificateDataSection.save")} icon="pi pi-check" onClick={onCertificateDataSave} className="p-button-success" />
                    <Button label={t("parapheur.certificateDataSection.cancel")} icon="pi pi-times" onClick={() => setShowEditDialog(false)} className="p-button-secondary ml-2" />
                </div>
            </Dialog>

            <Dialog
                header={t("parapheur.certificateDataSection.addNewCertificateData")}
                visible={showAddDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowAddDialog(false)}
            >
                {renderDialogContent(newCertificateData, setNewCertificateData)}
                <div className="flex justify-content-end">
                    <Button label={t("parapheur.certificateDataSection.save")} icon="pi pi-check" onClick={handleAddCertificateData} className="p-button-success" />
                    <Button label={t("parapheur.certificateDataSection.cancel")} icon="pi pi-times" onClick={() => setShowAddDialog(false)} className="p-button-secondary ml-2" />
                </div>
            </Dialog>
        </>
    );
};

export default CertificateDataSection;