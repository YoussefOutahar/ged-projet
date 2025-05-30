import Signature, { SignatureRef } from "@uiw/react-signature";
import axiosInstance from "app/axiosInterceptor";
import saveAs from "file-saver";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import * as saveAsPng from "save-svg-as-png";

import OtpProcess, { OtpProcessHandles, OtpType } from "../otp/otp_process";
import { ProgressSpinner } from "primereact/progressspinner";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import { Toast } from "primereact/toast";


const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const SIGNATURE_WIDTH = "600px";
const SIGNATURE_HEIGHT = "500px";

interface SignatureCanvasProps {
    onSignatureUpdate: () => void;
}

const SignatureCanvas = ({ onSignatureUpdate }: SignatureCanvasProps) => {
    const { connectedUser } = useConnectedUserStore();
    const [loading, setLoading] = useState(false);
    const [svgContent, setSvgContent] = useState<string>('');

    const otpRefSignCreation = useRef<OtpProcessHandles>(null);
    const otpRefSignUpload = useRef<OtpProcessHandles>(null);
    const $displaySvg = useRef<SignatureRef>(null);
    const $editSvg = useRef<SignatureRef>(null);
    const toast = useRef<Toast>(null);

    const fetchSignature = async (userId: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/admin/utilisateur/${userId}/signature`);
            const svgData = response.data.svgData as string;
            setSvgContent(svgData);
        } catch (error) {
            console.error('Error fetching signature:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!connectedUser) {
            return;
        }
        fetchSignature(connectedUser.id);
    }, [connectedUser]);

    useEffect(() => {
        if ($displaySvg.current?.svg && svgContent) {
            $displaySvg.current.svg.innerHTML = svgContent;
            $displaySvg.current.svg.setAttribute('width', SIGNATURE_WIDTH);
            $displaySvg.current.svg.setAttribute('height', SIGNATURE_HEIGHT);
        }
    }, [svgContent]);

    const handleClear = () => {
        $editSvg.current?.clear();
    };

    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    }

    const downloadSvg = (svg: SVGSVGElement, filename: string) => {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svg)], { type: 'image/svg+xml' });
        saveAs(svgBlob, filename);
    }

    const downloadPng = (svg: SVGSVGElement, filename: string) => {
        saveAsPng.saveSvgAsPng(svg, filename);
    }

    const handleDelete = async () => {
        if (!connectedUser) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une error est survenue' });
            return;
        }
        await axiosInstance.delete(`${API_URL}/admin/utilisateur/${connectedUser.id}/delete-signature`)
            .then(response => {
                fetchSignature(connectedUser.id);
                onSignatureUpdate(); 
            })
            .catch(error => console.error('Error Supression signature:', error))
            .finally(() => setLoading(false));
    };

    const handleSave = async () => {
        if (!connectedUser) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Une error est survenue' });
            return;
        }
        setLoading(true);

        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString($editSvg.current?.svg as SVGSVGElement);
        
        await axiosInstance.put(`${API_URL}/admin/utilisateur/${connectedUser.id}/update-signature`, { svgData: svgStr })
            .then(response => {
                fetchSignature(connectedUser.id);
                onSignatureUpdate(); 
            })
            .catch(error => console.error('Error sauvegarde signature:', error))
            .finally(() => setLoading(false));

        setVisible(false);
    }

    // ================== Signature Upload ==================
    const uploadSignature = async () => {
        if (!connectedUser) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                await handleImageUpload(file);
                await fetchSignature(connectedUser.id);
            }
        };
        input.click();
    };

    const handleImageUpload = async (file: File) => {
        if (!connectedUser) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Convert image to SVG using our Next.js API route
            const response = await axiosInstance.post('/api/convert-to-svg', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const { svg } = response.data;

            await axiosInstance.put(`${API_URL}/admin/utilisateur/${connectedUser.id}/update-signature`, { svgData: svg })
                .then(response => {
                    fetchSignature(connectedUser.id);
                    onSignatureUpdate(); 
                })
                .catch(error => console.error('Error sauvegarde signature:', error))
                .finally(() => {
                    setLoading(false)
                });
        } catch (error) {
            console.error('Error Televersement de la signature:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-column">
                {loading && <div className="flex justify-content-center align-items-center min-w-full min-h-full" style={{ width: '600px', height: '500px' }}>
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>}
                {!loading && (
                    <div className="flex justify-content-center min-w-full min-h-full">
                        <Signature
                            ref={$displaySvg}
                            options={{}}
                            readonly
                            style={{
                                "--w-signature-background": "#ffffff",
                                width: SIGNATURE_WIDTH,
                                height: SIGNATURE_HEIGHT,
                                border: '1px solid black'
                            } as React.CSSProperties}
                        />
                    </div>
                )}

                <div className="flex justify-content-center mt-3">
                    <Button
                        tooltip="Téléverser Signature"
                        tooltipOptions={{ position: 'top' }}
                        icon="pi pi-upload"
                        onClick={() => {
                            otpRefSignUpload.current?.startOtpProcess();
                        }}
                        className="p-button-sm p-button-info mr-2"
                    />
                    <Button
                        tooltip="Télécharger SVG"
                        tooltipOptions={{ position: 'top' }}
                        icon="pi pi-download"
                        onClick={() => downloadSvg($displaySvg.current?.svg as SVGSVGElement, 'signature.svg')}
                        className="p-button-sm p-button-info mr-2"
                    />
                    <Button
                        tooltip="Télécharger PNG"
                        tooltipOptions={{ position: 'top' }}
                        icon="pi pi-image"
                        onClick={() => downloadPng($displaySvg.current?.svg as SVGSVGElement, 'signature.png')}
                        className="p-button-sm p-button-success mr-2"
                    />
                    <Button
                        tooltip="Editer Signature"
                        tooltipOptions={{ position: 'top' }}
                        icon="pi pi-pencil"
                        onClick={showDialog}
                        className="p-button-sm p-button-primary mr-2"
                    />
                    <ConfirmPopup />
                    <Button
                        tooltip="Supprimer Signature"
                        tooltipOptions={{ position: 'top' }}
                        icon="pi pi-trash"
                        onClick={(e) => confirmPopup({
                            target: e.currentTarget,
                            message: 'Are you sure you want to delete your signature?',
                            icon: 'pi pi-exclamation-triangle',
                            accept: () => handleDelete(),
                            acceptClassName: 'p-button-danger',
                            rejectClassName: 'p-button-secondary'
                        })}
                        className="p-button-sm p-button-danger"
                    />
                </div>

            </div>

            <Dialog
                visible={visible}
                closeOnEscape
                style={{ width: 'fit-content' }}
                onHide={() => {
                    setVisible(false);
                }}
                header="Edit Signature"
                footer={
                    <div>
                        <Button
                            label="Effacer"
                            onClick={() => handleClear()}
                            className="w-fit"
                        />
                        <Button
                            label="Sauvegarder"
                            loading={loading}
                            onClick={() => {
                                otpRefSignCreation.current?.startOtpProcess();
                            }}
                            className="w-fit"
                        />
                    </div>
                }
            >
                <Signature
                    ref={$editSvg}
                    style={{
                        "--w-signature-background": "#ffffff",
                        width: SIGNATURE_WIDTH,
                        height: SIGNATURE_HEIGHT,
                        border: '1px solid black'
                    } as React.CSSProperties}
                />
            </Dialog>

            <Toast ref={toast} />
            <OtpProcess
                otpType={OtpType.SignatureCreation}
                onSuccess={() => handleSave()}
                ref={otpRefSignCreation}
            />

            <OtpProcess
                otpType={OtpType.SignatureCreation}
                onSuccess={() => uploadSignature()}
                ref={otpRefSignUpload}
            />
        </>
    );
};

export default SignatureCanvas;