import axiosInstance from 'app/axiosInterceptor'
import useFeatureFlags from 'app/component/admin/view/featureFlag/list/FeatureFlagsComponent'
import AddKeystore from 'app/component/admin/view/signature/AddKeystore'
import AssociateUsersToKeystore from 'app/component/admin/view/signature/AssociateUsersToKeystore'
import { UserKeystoreDto } from 'app/controller/model/Certificat/KeystoreDto'
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model'
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model'
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service'
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { use, useEffect, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {}

const CertificatList = (props: Props) => {

    const toast = useRef<Toast>(null);
    const [certificats, setCertificats] = useState<UserKeystoreDto[]>([]);
    const [selectedCertificats, setSelectedCertificats] = useState<UserKeystoreDto[]>([]);
    const [loadingCertificats, setLoadingCertificats] = useState<boolean>(true);
    const [errorCertificats, setErrorCertificats] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const { featureFlags, isActiveBack, isActiveFront} = useFeatureFlags();


    const fetchcertificats = async () => {
        setLoadingCertificats(true);
        return await axiosInstance.get(`${API_URL}/certificates`).then((res) => {
            setCertificats(res.data);
            setLoadingCertificats(false);
        }).catch((err) => {
            setErrorCertificats(true);
            console.log('err:', err);
        }).finally(() => {
            setLoadingCertificats(false);
        });
    };


    useEffect(() => {
        isActiveBack('useRemoteSignature').then((res) => {
            if(res){
                fetchcertificats();
            }
        });
    }, []);

    const utilisateursService = new UtilisateurAdminService();
    const [usersList, setUsersList] = useState<UtilisateurDto[]>([]);
    useEffect(() => {
        utilisateursService.getList().then((res) => {
            setUsersList(res.data);
        }).catch((err) => {
            console.log('err:', err);
        })
    }, [])

    
    const entiteAdministrativeService = new EntiteAdministrativeAdminService();
    const [entitesAdministratives, setEntitesAdministratives] = useState<EntiteAdministrativeDto[]>([]);
    useEffect(() => {
        entiteAdministrativeService.getList().then((res) => {
            setEntitesAdministratives(res.data);
        }).catch((err) => {
            console.log('err:', err);
        })
    }, [])

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t('keystore.certificatsList')} ({t('totalRecords',{ totalRecords:certificats?.length.toString()})}) </h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText id='searchCertificat' type="search"  value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={t("search")} />
            </span>

        </div>
    );

    return (
        <>
            <div className='flex flex-row gap-3 my-3'>
                <h1 className="text-3xl font-bold text-blue-800">{t('appBar.certificatList')}</h1>
            </div>

            <Toolbar className="mb-4"
                style={{ opacity: loadingCertificats || errorCertificats ? 0.5 : 1, pointerEvents: loadingCertificats || errorCertificats ? 'none' : 'auto' }}
                start={() => {
                    return (
                        <React.Fragment>
                                <AddKeystore refetchCertificate={fetchcertificats} toast={toast}  />
                        </React.Fragment>
                    )
                }}
                end={() => {
                    return (
                        <React.Fragment>
                        </React.Fragment>
                    )
                }}
            >
            </Toolbar>

            {loadingCertificats && <div className="flex justify-content-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>}
            {errorCertificats && <div className="flex justify-content-center">
                <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
            </div>}
            
            {
            !loadingCertificats && !errorCertificats && 
            <DataTable
                emptyMessage={<div className='flex justify-content-center'><p>{t('tableEmpty')}</p></div>}
                value={certificats}
                selection={selectedCertificats} onSelectionChange={(e) => setSelectedCertificats(e.value as UserKeystoreDto[])}
                dataKey="id"
                className="datatable-responsive"
                globalFilter={globalFilter}
                header={header}
                paginator rows={5}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="alias" header={t('keystore.Label')} sortable />
                <Column field="expireDate" header={t('DateEcheance')} body={
                    (rowData: UserKeystoreDto) => {
                        return (
                            <span>{new Date(rowData.expireDate).toLocaleDateString() ?? ""}</span>
                        )
                    }
                } sortable />
                <Column field='createDate' header={t('DateCreation')} body={
                    (rowData: UserKeystoreDto) => {
                        return (
                            <span>{new Date(rowData.createDate).toLocaleDateString() ?? ""}</span>
                        )
                    }} sortable />
                <Column header={t('actions')} body={
                    (rowData: UserKeystoreDto) => {
                        return (
                            <div className="flex justify-content-start gap-2">
                                {
                                    rowData.id && <AssociateUsersToKeystore keystoreId={rowData.id} usersList={usersList} entiteAdministratives={entitesAdministratives}/>
                                }
                            </div>
                        )
                    }
                } />

            </DataTable>
            }

            <Toast ref={toast} />
        </>
    )
}

export default CertificatList