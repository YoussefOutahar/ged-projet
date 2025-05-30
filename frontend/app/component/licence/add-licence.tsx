import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { useState } from "react";
import axiosInstance from "app/axiosInterceptor";
import { t } from "i18next";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type AddLicenceDialogueProps = {
    toast: any;
};

const AddLicenceDialogue = (props: AddLicenceDialogueProps) => {
    const [visible, setVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

    const uploadLicenseFile = async (event: { files: File[] }) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', event.files[0]);

            await axiosInstance.post(`${API_URL}/licences/import-package`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            showSuccess();
            setVisible(false);
        } catch (error) {
            console.error('Error uploading license file:', error);
            showError();
        } finally {
            setUploading(false);
        }
    };

    const showSuccess = () => {
        props.toast.current.show({
            severity: 'success',
            summary: 'Licence Importée avec succès',
            detail: 'Le fichier de licence a été importé avec succès',
            life: 3000
        });
    };

    const showError = () => {
        props.toast.current.show({
            severity: 'error',
            summary: 'Erreur lors de l\'import',
            detail: 'Une erreur est survenue lors de l\'import du fichier de licence',
            life: 3000
        });
    };

    return (
        <>
            <Button
                raised
                icon="pi pi-plus"
                className="m-2"
                severity="success"
                onClick={() => setVisible(true)}
            />
            <Dialog
                header="Importer un fichier de licence"
                visible={visible}
                style={{ width: "50vw" }}
                modal
                onHide={() => setVisible(false)}
            >
                <div className="formgrid grid">
                    <div className="field col-12">
                        <FileUpload
                            mode="advanced"
                            name="license"
                            url={`${API_URL}/import-package`}
                            accept=".lic"
                            maxFileSize={10000000}
                            customUpload
                            chooseLabel={t('choose')}
                            uploadLabel={t('upload')}
                            cancelLabel={t('cancel')}
                            uploadHandler={uploadLicenseFile}
                            className="w-full"
                        />
                        <small className="text-gray-500 mt-2 block">
                            Formats acceptés: .lic (Max. 10MB)
                        </small>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default AddLicenceDialogue;