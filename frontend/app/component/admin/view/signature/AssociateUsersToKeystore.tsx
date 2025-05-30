import axiosInstance from 'app/axiosInterceptor'
import useListHook from 'app/component/zyhook/useListhook'
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model'
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model'
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model'
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service'
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service'
import { MessageService } from 'app/zynerator/service/MessageService'
import { t } from 'i18next'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator'
import { Toast } from 'primereact/toast'
import React, { use, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    usersList: UtilisateurDto[];
    entiteAdministratives: EntiteAdministrativeDto[];
    keystoreId: number ;
}

const AssociateUsersToKeystore = ({ usersList, entiteAdministratives, keystoreId }: Props) => {

    const toastRef = useRef<Toast>(null);
    const [visible, setVisible] = React.useState<boolean>(false);
    const [associatedUsers, setAssociatedUsers] = React.useState<UtilisateurDto[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(5);
    const onClose = () => {
        setVisible(false);
    }
    
    const fetchKeystoreUsers = async (keystoreId : number, page: number, size: number) => {
        return await axiosInstance.get(`${API_URL}/certificates/getKeystoreUsers`,
            {
                params: {
                    keystoreId: keystoreId,
                    page: page,
                    size: size
                }
            }
        ).then((res) => {
            setAssociatedUsers(res.data.content);
        }).catch((err) => {
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
            console.log('err:', err);
        });
    }
    useEffect(() => {
        if(keystoreId && visible){
            fetchKeystoreUsers(keystoreId, page, size);
        }else{
            setAssociatedUsers([]);
        }

    }, [keystoreId, visible, page, size]);

    const associateUsersToKeystore = async (userId: number) => {
        await axiosInstance.post(`${API_URL}/certificates/updateUserCertificat`,null,
            {
                params: {
                    userId: userId,
                    keystoreId: keystoreId
                }
            }
        ).then((res) => {
            fetchKeystoreUsers(keystoreId, page, size);
            MessageService.showSuccess(toastRef, t('success.success'), t("success.operation"));
        }).catch((err) => {
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
            console.log('err:', err);
        });
    }
    const dissociateUsersFromKeystore = async (userId: number) => {
        await axiosInstance.post(`${API_URL}/certificates/updateUserCertificat`,null,
            {
                params: {
                    userId: userId,
                    keystoreId: null
                }
            }
        ).then((res) => {
            fetchKeystoreUsers(keystoreId, page, size);
            MessageService.showSuccess(toastRef, t('success.success'), t("success.operation"));
        }).catch((err) => {
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
            console.log('err:', err);
        });
    }

    const confirmDissociateUserFromKeystore = (event: any, userId: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Voulez-vous dissocier cet utilisateur du keystore ?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => dissociateUsersFromKeystore(userId)
        });
    }
    const confirmAssociateUserToKeystore = (event: any, userId: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Voulez-vous associer cet utilisateur au keystore ?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => associateUsersToKeystore(userId)
        });
    }

    const [filtreDepartement, setFiltreDepartement] = useState<EntiteAdministrativeDto | null>(null);
    const [filtredList, setFiltredList] = useState<UtilisateurDto[]>([]);
    useEffect(() => {
        if (filtreDepartement) {
            const filteredUsers = usersList.filter(user => user?.entiteAdministrative?.id === filtreDepartement?.id).slice(page * size, (page + 1) * size);
            setFiltredList(filteredUsers);
        } else {
            const filteredUsers = usersList.slice(page * size, (page + 1) * size);
            setFiltredList(filteredUsers);
            if(keystoreId){
                fetchKeystoreUsers(keystoreId, page, size);
            }
        }
        setAssociatedUsers([]);
    }, [filtreDepartement, usersList, page, size]);


    const [globalFilter, setGlobalFilter] = useState<string>('');
    const tableHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0"> ({t('totalRecords', { totalRecords: usersList?.length.toString() })}) </h5>
                <div className='flex flex-row gap-2'>
                    <Dropdown
                        showClear
                        value={filtreDepartement}
                        options={entiteAdministratives}
                        onChange={(e) => setFiltreDepartement(e.value)}
                        optionLabel="libelle"
                        placeholder={t("departement")}
                    />

                    <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                        <InputText id='searchCertificat' type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder={t("search")} />
                    </span>
                </div>

            </div>
        );
    }

    const dialogFooter = (
        <div className="flex justify-content-end">
            <Button label={t('cancel')} icon="pi pi-times" onClick={onClose} className="p-button-text" />
        </div>
    );
    return (
        <div>
            <Toast ref={toastRef} />
            <Button icon="pi pi-users text-xl" tooltip='Associer des utilisateurs' rounded raised onClick={() => setVisible(true)} />
            <Dialog
                header="Associer des utilisateurs"
                visible={visible}
                className=''
                style={{ minWidth: '70vw' }}
                onHide={onClose}
                footer={dialogFooter}
            >
                <div className="flex flex-column justify-content-center py-3">
                    <DataTable
                        value={filtredList}
                        dataKey='id'
                        className='w-full'
                        globalFilter={globalFilter}
                        header={tableHeader}
                        rows={size}                    
                    >
                        <Column header="Etat" body={
                            (row) => associatedUsers.find(user => user.id === row.id) ? <Badge value="Associé" severity="success" /> : <Badge value="Non associé" severity="danger" />
                        } />
                        <Column field="nom" header="Nom" />
                        <Column field="prenom" header="Prénom" />
                        <Column field="entiteAdministrative.libelle" header="Departement" />
                        <Column header="Action" 
                            body={(row) => {
                                if(associatedUsers.find(user => user.id === row.id)){
                                    return <Button text rounded raised severity="danger" icon="pi pi-user-minus text-xl" onClick={(e) => confirmDissociateUserFromKeystore(e, row.id)}  tooltip='Dissocier'/>
                                }else{
                                    return <Button text rounded raised severity="success" icon="pi pi-user-plus text-xl" onClick={(e) => confirmAssociateUserToKeystore(e, row.id)} tooltip='Associer'/>
                                }
                            }}
                        />
                    </DataTable>
                    <Paginator
                        first={page * size}
                        rows={size}
                        totalRecords={usersList.length}
                        onPageChange={(e) => setPage(e.first / size)}                        
                    />
                </div>
            </Dialog>
            <ConfirmPopup />
        </div>
    )
}

export default AssociateUsersToKeystore