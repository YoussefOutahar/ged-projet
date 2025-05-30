import axiosInstance from 'app/axiosInterceptor'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import React, { useRef, useState } from 'react'
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore'

type Props = {
    refetchCertificate: () => void;
    toast : React.MutableRefObject<Toast | null>;
    withoutLabel?: boolean;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const AddKeystore = ({refetchCertificate, toast, withoutLabel = false}: Props) => {

    const { connectedUser } = useConnectedUserStore();  

    const [uploadDialogVisible, setUploadDialogVisible] = useState<boolean>(false);
    const [passwordDialogVisible, setPasswordDialogVisible] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');
    const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
    const [keystoreAlias, setKeystoreAlias] = useState<string>('');

    const [loadingKeystore, setLoadingKeystore] = useState<boolean>(false);

    const fileUploadRef = useRef<FileUpload>(null);

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
        formData.append('alias', keystoreAlias);

        await axiosInstance.post(`${API_URL}/certificates/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(() => {
            toast.current?.show({ severity: 'success', summary: t('success.success'), detail: t('keystore.uploadSuccess') });
            refetchCertificate();
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
        setKeystoreAlias('');
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
    <>
        <Button
            icon="pi pi-upload"
            onClick={() => setUploadDialogVisible(true)}
            label={withoutLabel?"":t('keystore.uploadKeystore')}
        />
        <Dialog
                visible={uploadDialogVisible}
                onHide={onCloseKeystoreDialog}
                header={t('keystore.uploadKeystore')}
                footer={uploadDialogFooter}
                style={{ width: '900px' }}
                modal
            >
                <div className="flex flex-column gap-3">
                    <span className="font-bold">{t('keystore.Label')}</span>
                    <InputText value={keystoreAlias} onChange={(e) => setKeystoreAlias(e.target.value)} className="p-inputtext p-component w-4 " />
                    <FileUpload
                        ref={fileUploadRef}
                        accept=".p12"
                        customUpload
                        name="certificate"
                        uploadHandler={handleUpload}
                        maxFileSize={5000000}
                        chooseLabel={t('choose')}
                        uploadLabel={t('upload')}
                        cancelLabel={t('cancel')}
                        emptyTemplate={<p className="m-0">{t('document.dragDrop')}</p>}
                    />
                    <Dialog
                        visible={passwordDialogVisible}
                        onHide={onClosePasswordDialog}
                        header={t('keystore.passwordTitle')}
                        modal
                    >
                        {
                            loadingKeystore &&
                            <div className={`absolute top-0 left-0 z-5 bg-white-alpha-60 w-full h-full flex justify-content-center align-items-center`} >
                                <ProgressSpinner ></ProgressSpinner>
                            </div>
                        }
                        <div className="flex flex-column gap-3">
                            <small>
                                {t('keystore.enterPasswordMessage')}
                            </small>
                            <InputText type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-inputtext p-component w-full" />
                            <Button label={t("save")} type="submit" onClick={uploadKeystore} />
                        </div>

                    </Dialog>
                </div>
            </Dialog>
    </>
)
}

export default AddKeystore