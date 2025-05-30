import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Tag } from 'primereact/tag';

const EtablissementBureauOrdreCreateForm = React.lazy(() => import('app/component/admin/view/bureau-ordre/BO_etablissements/CreateEtablissementBureauOrdre'));
const DeleteEtablissementBureauOrdre = React.lazy(() => import('app/component/admin/view/bureau-ordre/BO_etablissements/DeleteEtablissementBureauOrdre'));
const UpdateEtablissementBureauOrdre = React.lazy(() => import('app/component/admin/view/bureau-ordre/BO_etablissements/UpdateEtablissementBureauOrdre'));
import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre';

import { allCountries } from 'country-region-data';
import "/node_modules/flag-icons/css/flag-icons.min.css";

const ETABLISSEMENT_URL = process.env.NEXT_PUBLIC_ETABLISSEMENT_URL as string;

const EtablissementsBureauOrdre = () => {

    const { t } = useTranslation();
    const toast = useRef<Toast>(null);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [etablissements, setEtablissements] = useState<EtablissementBureauOrdre[]>([]);
    const [selectedEtablissements, setSelectedEtablissements] = useState<EtablissementBureauOrdre[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const fetchEtablissements = async () => {
        setLoading(true);
        await axios.get(ETABLISSEMENT_URL).then((res) => {
            setEtablissements(res.data);
        }).catch((err) => {
            console.log('err:', err);
            setError(false);
        });
        setLoading(false);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Etablissements (Total: {etablissements.length}) </h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"><i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={t("search")} /> </span>
        </div>
    );

    useEffect(() => {
        fetchEtablissements();
    }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4"
                        start={() => {
                            return <React.Fragment>
                                <EtablissementBureauOrdreCreateForm refetchEtablissements={fetchEtablissements} showToast={toast} t={t} etablissements={etablissements} />
                                <UpdateEtablissementBureauOrdre showToast={toast} disabled={selectedEtablissements.length !== 1} selectedEtablissement={selectedEtablissements[0]} refetchEtablissements={fetchEtablissements} t={t} etablissements={etablissements} />
                                <DeleteEtablissementBureauOrdre t={t} showToast={toast} selectedEtablissements={selectedEtablissements} setSelectedEtablissements={setSelectedEtablissements} refetchEtablissements={fetchEtablissements} />
                            </React.Fragment>
                        }}>
                    </Toolbar>

                    {loading && <div className="flex justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>}
                    {error && <div className="flex justify-content-center">
                        <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
                    </div>}


                    {!loading && !error && <DataTable
                        emptyMessage={<div className='flex justify-content-center'><p>{t('bo.ettablissemnt.tableEmpty')}</p></div>}
                        value={etablissements}
                        selection={selectedEtablissements} onSelectionChange={(e) => setSelectedEtablissements(e.value as EtablissementBureauOrdre[])}
                        dataKey="id"
                        className="datatable-responsive"
                        globalFilter={globalFilter}
                        header={header}
                        paginator rows={10}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                        <Column field='nom' header='nom' sortable />
                        <Column field='secteur' header='secteur' sortable />
                        <Column field='adresse' header='adresse' sortable />
                        <Column field='ville' header='ville' sortable />
                        <Column field='pays' header='pays' body={
                            (rowData: EtablissementBureauOrdre) => {
                                const countryData = allCountries.find((countryData) => countryData[0] === rowData.pays);
                                const countrySlug = countryData ? countryData[1].toLowerCase() : '';
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <span className={`fi fi-${countrySlug} mb-2`}></span>
                                        <span>{rowData.pays}</span>
                                    </div>
                                );
                            }
                        } sortable />
                        <Column field='telephone' header='telephone' />
                        {/* <Column field='gsm' header='gsm' /> */}
                        <Column field='fax' header='fax' />
                        <Column field='email' header="E-mail" />
                        <Column field='statut' header='statut' body={
                            (rowData: EtablissementBureauOrdre) => {
                                return <Tag
                                    className={`p-tag-rounded ${rowData.statut?.toString() === 'PRIVE' ? 'p-tag-success' : rowData.statut?.toString() === 'PUBLIC' ? 'p-tag-info' : 'p-tag-warning'}`}
                                >{rowData.statut}</Tag>
                            }
                        } />

                    </DataTable>}


                    <div className="p-d-flex p-ai-center p-jc-between">
                        {/* <Paginator onPageChange={onPage} first={first} rows={rows} totalRecords={totalRecords} /> */}
                    </div>
                </div>
            </div>
        </div >
    );
};
export default EtablissementsBureauOrdre;

