import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { TFunction } from 'i18next';
import { Toast } from 'primereact/toast';

import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre';
import { useFormik } from 'formik';
import axios from 'axios';
import { etablissementValidationSchema } from './validationShemas';
import { MessageService } from 'app/zynerator/service/MessageService';
import { CountryData, allCountries } from 'country-region-data';
import "/node_modules/flag-icons/css/flag-icons.min.css";

const ETABLISSEMENT_URL = process.env.NEXT_PUBLIC_ETABLISSEMENT_URL as string;

type EtablissementCreateFormProps = {
    t: TFunction;
    refetchEtablissements: () => void;
    etablissements: EtablissementBureauOrdre[];
    showToast: React.Ref<Toast>;
};

const EtablissementCreateForm: React.FC<EtablissementCreateFormProps> = ({ refetchEtablissements, showToast, t, etablissements }) => {

    let etablissement = new EtablissementBureauOrdre();
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const [selectedPays, setSelectedPays] = useState<CountryData | null>(null);

    const formik = useFormik({
        initialValues: etablissement,
        validationSchema: () => etablissementValidationSchema(etablissements),
        onSubmit: async (values) => {
            return await axios.post(ETABLISSEMENT_URL, values)
                .then((res) => {
                    refetchEtablissements();
                    MessageService.showSuccess(showToast, t('success.success'), t("success.operation"));
                    formik.resetForm();
                    setShowCreateDialog(false);
                }).catch((err) => {
                    MessageService.showError(showToast, t('error.error'), t("error.operation"));
                });

        },
    });


    return (
        <>
            <Button raised label={t("new")} icon="pi pi-plus" severity="info" className=" mr-2" onClick={() => setShowCreateDialog(true)} />
            <Dialog
                visible={showCreateDialog}
                closeOnEscape
                style={{ width: '50vw' }}
                header='Etablissement'
                modal
                className="p-fluid"
                onHide={() => setShowCreateDialog(false)}
                footer={
                    <div className="p-dialog-footer">
                        <Button label={t('cancel')} icon="pi pi-times" onClick={() => setShowCreateDialog(false)} />
                        <Button type='submit' label={t('save')} icon="pi pi-check" onClick={() => formik.handleSubmit()} />
                    </div>
                }
            >

                <div className="flex flex-column mr-4">
                    <div className='flex gap-3'>
                        <div className="field col-4 ">
                            <label htmlFor="nom">{t('nom')}</label>
                            <InputText id="nom" value={formik.values.nom} onChange={formik.handleChange} />
                            {formik.errors.nom && <small id="nom-help" className="p-error p-d-block">{formik.errors.nom}</small>}
                        </div>
                        <div className="field col-4 ">
                            <label htmlFor="statut">{t('statut')}</label>
                            <Dropdown
                                id="statutDropdown"
                                value={formik.values.statut}
                                options={[{ label: 'Prive', value: 'PRIVE' }, { label: 'Public', value: 'PUBLIC' }, { label: 'Semi Public', value: 'SEMI_PUBLIC' }]}
                                onChange={(e) => formik.setFieldValue('statut', e.value)}
                                placeholder='Select a Statut'
                                showClear
                            />
                            {formik.errors.statut && <small id="statut-help" className="p-error p-d-block">{formik.errors.statut}</small>}
                        </div>
                        <div className="field col-4 ">
                            <label htmlFor="secteur">{t('secteur')}</label>
                            <InputText id="secteur" value={formik.values.secteur} onChange={formik.handleChange} />
                            {formik.errors.secteur && <small id="secteur-help" className="p-error p-d-block">{formik.errors.secteur}</small>}
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className="field col-4 ">
                            <label htmlFor="adresse">{t('adresse')}</label>
                            <InputText id="adresse" value={formik.values.adresse} onChange={formik.handleChange} />
                            {formik.errors.adresse && <small id="adresse-help" className="p-error p-d-block">{formik.errors.adresse}</small>}
                        </div>
                        <div className="field col-4 ">
                            <label htmlFor="pays">{t('pays')}</label>
                            <Dropdown id="pays"
                                value={formik.values.pays}
                                options={allCountries.map((countryData) => ({ label: countryData[0], value: countryData[0], slug: countryData[1].toLowerCase() }))}
                                onChange={(e) => {
                                    formik.setFieldValue('pays', e.value);
                                    setSelectedPays(allCountries.find((countryData) => countryData[0] === e.value) || null);
                                }}
                                itemTemplate={(option) => (
                                    <>
                                        <span className={`fi fi-${option.slug} mr-3`}></span>
                                        {option.label}
                                    </>
                                )}
                                filter
                            />
                            {formik.errors.pays && <small id="pays-help" className="p-error p-d-block">{formik.errors.pays}</small>}
                        </div>
                        <div className="field col-4 ">
                            <label htmlFor="ville">{t('ville')}</label>
                            <Dropdown id='ville'
                                value={formik.values.ville}
                                options={selectedPays ? selectedPays[2].map((region) => ({ label: region[0], value: region[0] })) : []}
                                onChange={formik.handleChange}
                                disabled={!selectedPays}
                            />
                            {formik.errors.ville && <small id="ville-help" className="p-error p-d-block">{formik.errors.ville}</small>}
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className="field col-4 ">
                            <label htmlFor="telephone">{t('telephone')}</label>
                            <InputText id="telephone" value={formik.values.telephone} onChange={formik.handleChange} />
                            {formik.errors.telephone && <small id="telephone-help" className="p-error p-d-block">{formik.errors.telephone}</small>}
                        </div>
                        {/* <div className="field col-4 ">
                            <label htmlFor="gsm">{t('gsm')}</label>
                            <InputText id="gsm" value={formik.values.gsm} onChange={formik.handleChange} />
                            {formik.errors.gsm && <small id="gsm-help" className="p-error p-d-block">{formik.errors.gsm}</small>}
                        </div> */}
                        <div className="field col-4 ">
                            <label htmlFor="email">{t('email')}</label>
                            <InputText id="email" value={formik.values.email} onChange={formik.handleChange} />
                            {formik.errors.email && <small id="email-help" className="p-error p-d-block">{formik.errors.email}</small>}
                        </div>
                        <div className="field col-4 ">
                            <label htmlFor="fax">{t('fax')}</label>
                            <InputText id="fax" value={formik.values.fax} onChange={formik.handleChange} />
                            {formik.errors.fax && <small id="fax-help" className="p-error p-d-block">{formik.errors.fax}</small>}
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EtablissementCreateForm;
