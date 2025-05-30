import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmDialog } from "primereact/confirmdialog";
import { useState, useRef, useMemo } from "react";
import { addSignersData, deleteSignersData, updateSignersData } from "./api";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { useTranslation } from "react-i18next";

interface SignersDataSectionProps {
    parapheur: ParapheurDto;
    signersData: ParapheurSignersDataDTO[] | undefined;
    isLoading: boolean;
}

const SignersDataSection = ({ parapheur, signersData, isLoading }: SignersDataSectionProps) => {
    const { t } = useTranslation();

    const queryClient = useQueryClient();
    const newSignerInputRef = useRef<HTMLInputElement>(null);

    const utilisateurs = useMemo(() => {
        const userMap = new Map<number, UtilisateurDto>();
        parapheur.utilisateurDtos.forEach(user => {
            if (!userMap.has(user.id)) {
                userMap.set(user.id, user);
            }
        });
        return Array.from(userMap.values());
    }, [parapheur.utilisateurDtos]);

    const [newSignerData, setNewSignerData] = useState<Partial<ParapheurSignersDataDTO>>({ name: '', id: undefined, userId: undefined });
    const [isAddingSignerData, setIsAddingSignerData] = useState(false);
    const [tableData, setTableData] = useState<ParapheurSignersDataDTO[]>(signersData || []);

    const signersDataQueryKey = ['signersData', parapheur.id];

    const getAvailableUsers = () => {
        const usedUserIds = tableData.map(sd => sd.userId);
        return utilisateurs.filter(user => !usedUserIds.includes(user.id));
    };

    const availableUsers = getAvailableUsers();

    const addSignersDataMutation = useMutation({
        mutationFn: addSignersData,
        onSuccess: (data) => {
            queryClient.setQueryData(signersDataQueryKey, (oldData: ParapheurSignersDataDTO[] | undefined) =>
                oldData ? [...oldData, data] : [data]
            );
            setIsAddingSignerData(false);
            setNewSignerData({ name: '', id: undefined, userId: undefined });
            setTableData(prev => [...prev, data]);
        },
        onError: (error) => {
            console.error(t("parapheur.signersDataSection.errorAddingSigner"), error);
            queryClient.invalidateQueries({ queryKey: signersDataQueryKey });
        }
    });

    const updateSignersDataMutation = useMutation({
        mutationFn: updateSignersData,
        onSuccess: (data) => {
            queryClient.setQueryData(signersDataQueryKey, (oldData: ParapheurSignersDataDTO[] | undefined) =>
                oldData ? oldData.map(item => item.id === data.id ? data : item) : []
            );
            setTableData(prev => prev.map(item => item.id === data.id ? data : item));
        },
        onError: (error) => {
            console.error(t("parapheur.signersDataSection.errorUpdatingSigner"), error);
            queryClient.invalidateQueries({ queryKey: signersDataQueryKey });
        }
    });

    const deleteSignersDataMutation = useMutation({
        mutationFn: deleteSignersData,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: signersDataQueryKey });
            setTableData(prev => prev.filter(item => item.id !== variables.signersDataId));
        },
        onError: (error) => {
            console.error(t("parapheur.signersDataSection.errorDeletingSigner"), error);
        }
    });

    const handleAddSignersData = () => {
        setIsAddingSignerData(true);
        setTimeout(() => {
            if (newSignerInputRef.current) {
                newSignerInputRef.current.focus();
            }
        }, 0);
    };

    const handleSaveNewSignerData = () => {
        if (newSignerData.userId) {
            addSignersDataMutation.mutate({
                parapheurId: parapheur.id,
                signersData: newSignerData
            });
        } else {
            console.error(t("parapheur.signersDataSection.userRequired"));
        }
    };

    const handleCancelNewSignerData = () => {
        setIsAddingSignerData(false);
        setNewSignerData({ name: '', id: undefined, userId: undefined });
    };

    const confirmDeleteSignersData = (signersDataId: number) => {
        confirmDialog({
            message: t("parapheur.signersDataSection.deleteConfirmation"),
            header: t("parapheur.signersDataSection.deleteConfirmationHeader"),
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteSignersDataMutation.mutate({ parapheurId: parapheur.id, signersDataId }),
        });
    };

    const formatUserName = (user: UtilisateurDto) => {
        const gender = user?.gender?.libelle || '';
        const firstName = user?.prenom || '';
        const lastName = user?.nom || '';
        const entityName = user?.entiteAdministrative?.libelle || '';
        return `${gender} ${firstName} ${lastName} - ${entityName}`.trim();
    };

    const handleUserSelect = (userId: number | null) => {
        if (userId) {
            const selectedUser = availableUsers.find(u => u.id === userId);
            if (selectedUser) {
                const formattedName = formatUserName(selectedUser);
                setNewSignerData(prev => ({ ...prev, userId, name: formattedName }));
            }
        } else {
            setNewSignerData(prev => ({ ...prev, userId: undefined, name: '' }));
        }
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        const { newData, index } = e;
        const updatedData = { ...newData } as ParapheurSignersDataDTO;
        updateSignersDataMutation.mutate({ parapheurId: parapheur.id, signersData: updatedData });
    };

    const canAddMoreSigners = availableUsers.length > 0;

    if (isLoading) return <ProgressSpinner />;

    const userOptions = availableUsers.map(user => ({
        label: formatUserName(user),
        value: user.id
    }));

    return (
        <>
            <DataTable
                value={tableData}
                editMode="row"
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column
                    field="name"
                    header={t("parapheur.signersDataSection.name")}
                    editor={(options: ColumnEditorOptions) => options && (
                        <InputText
                            value={options.value}
                            onChange={(e) => options.editorCallback && options.editorCallback(e.target.value)}
                            style={{ width: '100%' }}
                            disabled
                        />
                    )}
                    style={{ height: '3.5rem' }}
                />
                <Column
                    field="userId"
                    header={t("parapheur.signersDataSection.user")}
                    editor={(options: ColumnEditorOptions) => options && (
                        <Dropdown
                            value={options.value}
                            options={[
                                { label: formatUserName(utilisateurs.find(u => u.id === options.value)!), value: options.value },
                                ...userOptions
                            ]}
                            onChange={(e) => {
                                options.editorCallback && options.editorCallback(e.value);
                                const selectedUser = utilisateurs.find(u => u.id === e.value);
                                if (selectedUser) {
                                    const formattedName = formatUserName(selectedUser);
                                    options.rowData.name = formattedName;
                                    options.rowData.userId = e.value;
                                    setTableData([...tableData]);
                                }
                            }}
                            placeholder={t("parapheur.signersDataSection.selectUser")}
                            style={{ width: '100%' }}
                        />
                    )}
                    body={(rowData) => {
                        const user = utilisateurs.find(u => u.id === rowData.userId);
                        return user ? formatUserName(user) : '';
                    }}
                    style={{ height: '3.5rem' }}
                />
                <Column
                    rowEditor
                    headerStyle={{ width: '10%', minWidth: '8rem' }}
                    bodyStyle={{ textAlign: 'center' }}
                    style={{ height: '3.5rem' }}
                />
                <Column
                    body={(rowData) => (
                        <Button
                            icon="pi pi-trash"
                            onClick={() => confirmDeleteSignersData(rowData.id!)}
                            className="p-button-rounded p-button-danger p-button-text"
                        />
                    )}
                    headerStyle={{ width: '10%', minWidth: '8rem' }}
                    bodyStyle={{ textAlign: 'center' }}
                />
            </DataTable>
            {isAddingSignerData ? (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <InputText
                        ref={newSignerInputRef}
                        value={newSignerData.name}
                        onChange={(e) => setNewSignerData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t("parapheur.signersDataSection.enterNewSignerName")}
                        style={{ flexGrow: 1, marginRight: '1rem' }}
                        disabled
                    />
                    <Dropdown
                        value={newSignerData.userId}
                        options={userOptions}
                        onChange={(e) => handleUserSelect(e.value)}
                        placeholder={t("parapheur.signersDataSection.selectUser")}
                        style={{ flexGrow: 1, marginRight: '1rem' }}
                    />
                    <div>
                        <Button
                            label={t("parapheur.signersDataSection.save")}
                            icon="pi pi-check"
                            onClick={handleSaveNewSignerData}
                            className="p-button-success"
                        />
                        <Button
                            label={t("parapheur.signersDataSection.cancel")}
                            icon="pi pi-times"
                            onClick={handleCancelNewSignerData}
                            className="p-button-secondary ml-2"
                        />
                    </div>
                </div>
            ) : (
                canAddMoreSigners && (
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <Button
                            label={t("parapheur.signersDataSection.addNewSigner")}
                            icon="pi pi-plus"
                            onClick={handleAddSignersData}
                            className="p-button-success"
                        />
                    </div>
                )
            )}
        </>
    );
};

export default SignersDataSection;