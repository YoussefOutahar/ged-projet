import dynamic from 'next/dynamic';
import axiosInstance from "app/axiosInterceptor";
import AppConfig from "layout/AppConfig";
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { ReactElement, useEffect, useState } from "react";

import SuccesAnimation from "public/lottie-animations/success.json"
import FailureAnimation from "public/lottie-animations/failure.json"
import FileViewer from 'app/component/admin/view/doc/document/preview/FileViewer';
import { Toast } from 'primereact/toast';
import { pdfjs } from 'react-pdf';
import { DocumentAdminService } from 'app/controller/service/admin/DocumentAdminService.service';
import useFeatureFlagStore from 'Stores/FeatureFlagStore';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { featureFlagQueries } from 'Queries/FeatureFlagQueries';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const useUrlParams = () => {
    const [params, setParams] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const updateParams = () => {
            const searchParams = new URLSearchParams(window.location.search);
            const newParams: { [key: string]: string } = {};
            searchParams.forEach((value, key) => {
                newParams[key] = value;
            });
            setParams(newParams);
        };

        updateParams();
        window.addEventListener('popstate', updateParams);
        return () => window.removeEventListener('popstate', updateParams);
    }, []);

    return params;
};

interface SignatureInfoRemote {
    byteRange: number[];
    contactInfo: string;
    contents: string;
    documentId: number;
    filter: string;
    gedReference: string;
    location: string | null;
    name: string;
    reason: string;
    signDate: number;
    subFilter: string;
}

const Index = () => {
    const router = useRouter();
    const urlParams = useUrlParams();
    const toast = React.useRef<Toast>(null);

    featureFlagQueries();

    const { isRemoteSignatureActive } = useFeatureFlagStore();

    const [authButtonClicked, setAuthbuttonClicked] = React.useState(false);

    const [hoveredVerificationSignature, setHoveredVerificationSignature] = React.useState(false);

    const [codeValidation, setCodeValidation] = React.useState('');
    const [validationData, setValidationData] = React.useState<any>(null);

    const [docAuthenticReference, setDocAuthenticReference] = React.useState<number | undefined>();
    const [viewDocumentAuthentique, setViewDocumentAuthentique] = React.useState(false);

    const [verifiedDialog, setVerifiedDialog] = React.useState(false);
    const [nonVerifiedDialog, setNonVerifiedDialog] = React.useState(false);

    const voirDocumentSigne = (ref: number) => {
        setDocAuthenticReference(ref);
        setViewDocumentAuthentique(true);
    }

    const downloadDocument = async (gedReference: string) => {
        const documentAdminService = new DocumentAdminService();
        await documentAdminService.downloadFile(gedReference)
            .then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data]))
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'signed-document.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(() => {
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du téléchargement du document' });
            });
    };

    const validateDocument = (code: string) => {
        if (!code) return;
        axiosInstance.get(`${API_URL}/signature/validate-signed-document-by-code/${code}`)
            .then((response) => {
                if (response.data) {
                    setValidationData(response.data);
                    setVerifiedDialog(true);
                } else {
                    setNonVerifiedDialog(true);
                }
            })
            .catch(() => {
                setNonVerifiedDialog(true);
            });
    };

    useEffect(() => {
        const validationcode = urlParams.validationcode;
        if (validationcode) {
            setCodeValidation(validationcode);
            validateDocument(validationcode);
        }
    }, [urlParams]);

    const formatDate = (timestamp: number): string =>
        new Date(timestamp).toLocaleString();

    return (
        <>
            <div className="layout-topbar flex justify-content-between align-items-center p-3">
                <div className='flex align-items-center cursor-pointer' onClick={() => { router.push('/') }}>
                    <img src='/Images/logo-yan.png' alt="logo" className="mr-2" style={{ width: '40px', height: 'auto' }} />
                    <span className="text-3xl font-bold" style={{ color: '#98c34d' }}>YANDOC</span>
                    <p className='text-xs mt-2 ml-2 hidden md:block' style={{ color: '#49509f', fontSize: '1rem', fontWeight: 700 }}>Solution</p>
                </div>
                <div className="layout-topbar-menu">
                    <Button label="Se Connecter"
                        icon={authButtonClicked ? `pi pi-lock-open` : `pi pi-lock`}
                        className="p-button-rounded p-button-sm"
                        style={{ background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)', border: 'none' }}
                        onClick={() => { setAuthbuttonClicked(true); router.push('/auth') }} />
                </div>
            </div>

            <div className="flex flex-column align-items-center mt-6 px-3 py-6">
                <img src="/Images/terms_signature.svg" alt='Signature Verification' className="w-10rem md:w-15rem mb-4" />

                <div className='text-center mb-4'>
                    <h1 className='text-4xl md:text-5xl font-bold mb-2' style={{ color: '#4b21a9' }}>Système de Vérification de Signature</h1>
                    <span className='text-blue-800 text-xl md:text-2xl font-semibold block'>Sécurisez vos documents avec notre technologie de pointe</span>
                </div>

                <div className='text-lg text-justify px-3 md:px-6 lg:w-9 xl:w-7'>
                    <p className='mb-3'>
                        Notre système de vérification de signature offre une solution robuste pour authentifier et valider les signatures électroniques sur vos documents importants. En utilisant des algorithmes avancés et des technologies de pointe, nous garantissons l'intégrité et l'authenticité de chaque signature, renforçant ainsi la sécurité de vos processus documentaires.
                    </p>
                    <p>
                        Grâce à notre plateforme intuitive, les utilisateurs peuvent facilement télécharger des documents, vérifier les signatures en temps réel, et obtenir des rapports détaillés sur l'authenticité de chaque signature. Notre système s'intègre parfaitement aux Workflows existants, offrant une solution complète pour la gestion des signatures électroniques dans divers secteurs, de la finance au juridique en passant par la santé.
                    </p>
                </div>
            </div>

            <div className="flex flex-column md:flex-row justify-content-center align-items-center mt-4 px-3 pb-5">
                <InputText
                    value={codeValidation}
                    onChange={(e) => setCodeValidation(e.target.value)}
                    placeholder="Entrez le code de vérification"
                    className='w-full md:w-30rem mb-3 md:mb-0 md:mr-3'
                />
                <Button
                    label="Verifier"
                    severity="help"
                    rounded
                    onClick={() => validateDocument(codeValidation)}
                    className='w-full md:w-auto text-xl font-semibold'
                    style={{
                        background: !hoveredVerificationSignature
                            ? 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'
                            : 'linear-gradient(-235deg,#4801FF 0%,#0191ff 48%,#bbd151 100%)',
                        border: 'none'
                    }}
                    onMouseEnter={() => setHoveredVerificationSignature(true)}
                    onMouseLeave={() => setHoveredVerificationSignature(false)}
                />
            </div>

            <Dialog
                header="Signature Validée"
                visible={verifiedDialog}
                style={{ width: '90vw', maxWidth: '30rem' }}
                onHide={() => setVerifiedDialog(false)}
                footer={isRemoteSignatureActive ? (
                    <></>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                icon="pi pi-eye"
                                label="Voir le document"
                                className="p-button-text-icon-left md:p-button-icon-only"
                                onClick={() => voirDocumentSigne(validationData.documentId)}
                            />
                            <Button
                                icon="pi pi-download"
                                label="Télécharger"
                                className="p-button-text-icon-left md:p-button-icon-only"
                                onClick={() => downloadDocument(validationData.gedReference)}
                            />
                        </div>
                    </>
                )}
            >
                <div className="text-center mb-5">
                    <div className="w-10rem mx-auto">
                        <Lottie animationData={SuccesAnimation} loop={false} />
                    </div>
                    <h3>La signature a été validée avec succès.</h3>

                    {isRemoteSignatureActive ? (
                        <div className="text-left mt-4">
                            {validationData && (
                                <>
                                    {validationData.map((signature: SignatureInfoRemote, index: number) => (
                                        <div key={index} className="mb-3">
                                            <div className="flex justify-content-between align-items-center">
                                                <div className="flex-grow-1">
                                                    <div className="flex justify-content-between align-items-center bg-gray-100 p-3 rounded">
                                                        <span className="font-bold">{signature.name}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                icon="pi pi-eye"
                                                                size="small"
                                                                className="p-button-rounded p-button-text"
                                                                onClick={() => voirDocumentSigne(signature.documentId)}
                                                            />
                                                            <Button
                                                                icon="pi pi-download"
                                                                size="small"
                                                                className="p-button-rounded p-button-text"
                                                                onClick={() => downloadDocument(signature.gedReference)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Accordion multiple className="mt-2">
                                                        <AccordionTab
                                                            header={<span>Details</span>}
                                                        >
                                                            <div>
                                                                <p><strong>Filter:</strong> {signature.filter}</p>
                                                                <p><strong>Sub Filter:</strong> {signature.subFilter}</p>
                                                                <p><strong>Contact:</strong> {signature.contactInfo}</p>
                                                                <p><strong>Location:</strong> {signature.location || 'N/A'}</p>
                                                                <p><strong>Sign Date:</strong> {formatDate(signature.signDate)}</p>
                                                                <p><strong>Reason:</strong> {signature.reason}</p>
                                                                <p><strong>Byte Range:</strong> {signature.byteRange.join(', ')}</p>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {validationData && (
                                <div className="text-left mt-4">
                                    <p><strong>Algorithme de signature:</strong> {validationData.signatureAlgorithm}</p>
                                    <p><strong>Heure de signature:</strong> {new Date(validationData.signingTime).toLocaleString()}</p>
                                    <p><strong>Émetteur:</strong> {validationData.issuer}</p>
                                    <p><strong>Sujet:</strong> {validationData.subject}</p>
                                    <p><strong>Numéro de série:</strong> {validationData.serialNumber}</p>
                                    <p><strong>Valide à partir de:</strong> {new Date(validationData.validFrom).toLocaleString()}</p>
                                    <p><strong>Valide jusqu'à:</strong> {new Date(validationData.validTo).toLocaleString()}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Dialog>

            <Dialog
                header="Signature Non Validée"
                visible={nonVerifiedDialog}
                style={{ width: '90vw', maxWidth: '30rem' }}
                onHide={() => setNonVerifiedDialog(false)}
            >
                <div className="text-center mb-5">
                    <div className="w-10rem mx-auto">
                        <Lottie animationData={FailureAnimation} />
                    </div>
                    <h3>La signature n'a pas pu être validée.</h3>
                </div>
            </Dialog>

            <Dialog
                header="Document Authentique"
                visible={viewDocumentAuthentique}
                style={{ width: 'max-content', minWidth: '30vw', maxWidth: '90vw', height: '90vh', overflow: 'auto' }}
                onHide={() => setViewDocumentAuthentique(false)}
            >
                {viewDocumentAuthentique && (
                    <div className="flex justify-content-center align-items-center m-3">
                        <FileViewer
                            documentId={docAuthenticReference}
                            twoPages={false}
                            className="w-full"
                        />
                    </div>
                )}
            </Dialog>

            <Toast ref={toast} />
        </>
    );
};

Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default Index;