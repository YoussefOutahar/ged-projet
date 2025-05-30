import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import axiosInstance from "app/axiosInterceptor";
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import { InputText } from 'primereact/inputtext';
import { t } from 'i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AuthService } from 'app/zynerator/security/Auth.service';
import useFeatureFlagStore from 'Stores/FeatureFlagStore';
import AddKeystore from '../admin/view/signature/AddKeystore';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
export interface UserCertificationsRef {
    refetchCertificate: () => void;
}

const UserCertifications = forwardRef<UserCertificationsRef>((props, ref) => {
    useImperativeHandle(ref, () => ({
        refetchCertificate: fetchCertificate
    }));

    const { isRemoteSignatureActive } = useFeatureFlagStore();

    const authService = new AuthService();
    const { connectedUser } = useConnectedUserStore();

    const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
    const [userHasCertificate, setUserHasCertificate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [uploadDialogVisible, setUploadDialogVisible] = useState<boolean>(false);
    const [passwordDialogVisible, setPasswordDialogVisible] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');
    const [keystoreFile, setKeystoreFile] = useState<File | null>(null);

    const [loadingKeystore, setLoadingKeystore] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    const fetchCertificate = async () => {
        if (!connectedUser) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
            return;
        }

        setLoading(true);
        setError(null);

        if (isRemoteSignatureActive) {
            try {
                const response = await axiosInstance.get(`${API_URL}/certificates/check-certificate/${connectedUser.id}`);
                if (response.data && response.data === true) {
                    setUserHasCertificate(true);
                } else {
                    setUserHasCertificate(false);
                }
            } catch (error: any) {
                console.error('Error fetching certificate:', error);
                setError('Failed to load certificate.');
                setUserHasCertificate(false);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await axiosInstance.get(`${API_URL}/certificate/${connectedUser.id}`);
                if (response.data) {
                    const base64Pdf = response.data;
                    const binaryString = window.atob(base64Pdf);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: 'application/pdf' });
                    setCertificateUrl(URL.createObjectURL(blob));
                } else {
                    setCertificateUrl(null);
                }
            } catch (error: any) {
                console.error('Error fetching certificate:', error);
                if (error.response?.status == 404) {
                    setCertificateUrl(null);
                } else {
                    setError('Failed to load certificate.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (connectedUser) {
            fetchCertificate();
        }
    }, [connectedUser, isRemoteSignatureActive]);

    const uploadKeystore = async () => {
        setLoadingKeystore(true);
        if (!connectedUser) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'User not connected' });
            return;
        }
        if (!keystoreFile) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No keystore file selected' });
            return;
        }

        const formData = new FormData();
        formData.append('keystore', keystoreFile);
        formData.append('password', password);
        formData.append('roleNames', "ADMIN");

        await axiosInstance.post(`${API_URL}/certificates/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(() => {
            toast.current?.show({ severity: 'success', summary: t('success.success'), detail: t('keystore.uploadSuccess') });
            fetchCertificate();
            onCloseKeystoreDialog();
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        }).catch((error: any) => {
            console.error('Error uploading certificate:', error);
            toast.current?.show({ severity: 'error', summary: t('error.error'), detail: t('keystore.uploadError') });
        }).finally(() => {
            setLoadingKeystore(false);
        });

    }
    const onCloseKeystoreDialog = () => {
        setUploadDialogVisible(false);
        setPasswordDialogVisible(false);
        setKeystoreFile(null);
        setPassword('');
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    }
    const onClosePasswordDialog = () => {
        setPasswordDialogVisible(false);
        setPassword('');
    }

    const handleUpload = async (event: any) => {
        if (!event.files || event.files.length === 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No file selected' });
            return;
        }

        const file = event.files[0];
        if (!file) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No file selected' });
            return;
        }

        setKeystoreFile(file);
        setPasswordDialogVisible(true);

    };

    const handleDownloadCertificate = async () => {
        if (!connectedUser || !certificateUrl) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No certificate available' });
            return;
        }

        try {
            const response = await axiosInstance.get(`${API_URL}/certificate/${connectedUser.id}/download`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/x-pkcs12' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${connectedUser.prenom}_${connectedUser.nom}_certificate.p12`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading certificate:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to download certificate' });
        }
    };

    const handleDeleteCertificate = () => {
        if (!connectedUser || !certificateUrl) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No certificate to delete' });
            return;
        }
        confirmDialog({
            message: 'Are you sure you want to delete this certificate?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axiosInstance.delete(`${API_URL}/certificate/${connectedUser.id}`);
                    setCertificateUrl(null);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Certificate deleted successfully' });
                } catch (error) {
                    console.error('Error deleting certificate:', error);
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete certificate' });
                }
            }
        });
    };

    const uploadDialogFooter = (
        <div>
            <Button
                label={t('cancel')}
                icon="pi pi-times"
                onClick={() => {
                    setUploadDialogVisible(false);
                    if (fileUploadRef.current) {
                        fileUploadRef.current.clear();
                    }
                }}
                className="p-button-text"
            />
        </div>
    );

    return (
        <div
            className="flex flex-column"
            style={{ height: '540px' }}
        >
            <div className="flex-grow-1 relative" style={{ display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <div className="flex flex-column justify-content-center align-items-center flex-grow-1">
                        <ProgressSpinner />
                        <p className='font-semibold'>Checking for certificate...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-column justify-content-center align-items-center h-full">
                        <i className="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : isRemoteSignatureActive ? (
                    userHasCertificate ? (
                        <div className="flex flex-column justify-content-center align-items-center flex-grow-1 gap-4">
                            <i className="pi pi-verified text-green-500 text-light" style={{ fontSize: "7rem" }}></i>
                            <span className='font-semibold' >Signature certifié</span>
                        </div>
                    ) : (
                        <div className="flex flex-column justify-content-center align-items-center flex-grow-1 gap-4">
                            <i className="pi pi-ban text-orange-500 " style={{ fontSize: "5rem" }}></i>
                            <p className='font-semibold'>Signature non certifié</p>
                        </div>
                    )
                ) : certificateUrl ? (
                    <embed
                        src={`${certificateUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        style={{
                            width: '100%',
                            flexGrow: 1,
                            border: 'none',
                            outline: 'none'
                        }}
                    />
                ) : (
                    <div className="flex justify-content-center align-items-center flex-grow-1">
                        <p>No certificate available</p>
                    </div>
                )}
            </div>
            <div className="flex justify-content-center gap-2 mt-2">
                {authService.isAdmin() && isRemoteSignatureActive && (
                    <AddKeystore refetchCertificate={fetchCertificate} toast={toast} withoutLabel/>
                )}
                {!isRemoteSignatureActive && (
                    <Button
                        icon="pi pi-download"
                        onClick={handleDownloadCertificate}
                        className="p-button-sm p-button-info"
                        disabled={!certificateUrl}
                        tooltip="Download"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                {!isRemoteSignatureActive && (
                    <Button
                        icon="pi pi-trash"
                        onClick={handleDeleteCertificate}
                        className="p-button-sm p-button-danger"
                        disabled={!certificateUrl}
                        tooltip="Delete"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
            </div>
            <Toast ref={toast} />
            <ConfirmDialog />
        </div>
    );
});

export default UserCertifications;