import axiosInstance from 'app/axiosInterceptor';
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import useFeatureFlagStore from 'Stores/FeatureFlagStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const MINUTES_TIMEOUT = 5;
const SECONDS_TIMEOUT = 0;
const RESEND_DISABLE_TIME = 30;

export enum OtpType {
    ViewDocEnregistrement = "generate-otp-view-doc-enregistrement",
    Signature = "generate-otp-signature",
    SignatureMasse = "generate-otp-signature-masse",
    SignatureCreation = "generate-otp-signature-creation",
    General = "generate-otp"
}

export interface OtpProcessHandles {
    startOtpProcess: (params?: any) => void;
}

type OtpProps = {
    otpType: OtpType;
    onSuccess?: () => void;
};

const OtpProcess = forwardRef<OtpProcessHandles, OtpProps>(
    ({ otpType, onSuccess }: OtpProps, ref) => {
        const toastRef = useRef<Toast>(null);

        const [OtpDialogVisible, setOtpDialogVisible] = useState<boolean>(false);
        const [{ otp, numInputs, separator, minLength, maxLength, placeholder, inputType }, setConfig] = useState({
            otp: '',
            numInputs: 6,
            separator: ' - ',
            minLength: 0,
            maxLength: 40,
            placeholder: '',
            inputType: 'text' as const,
        });

        const [params, setParams] = useState<any>(null);
        const [resendDisabled, setResendDisabled] = useState<boolean>(false);
        const [resendTimer, setResendTimer] = useState<number>(0);

        const [shouldTriggerSuccess, setShouldTriggerSuccess] = useState(false);
        
        useImperativeHandle(ref, () => ({
            startOtpProcess: (params?: any) => {
                if (!isOtpActive) {
                    setShouldTriggerSuccess(true);
                    clearOtp();
                } else {
                    setParams(params);
                    setOtpDialogVisible(true);
                }
            },
            triggerSuccess: () => {
                onSuccess && onSuccess();
            }
        }));

        useEffect(() => {
            if (shouldTriggerSuccess) {
                setShouldTriggerSuccess(false);
                setTimeout(() => {
                    onSuccess && onSuccess();
                }, 0);
            }
        }, [shouldTriggerSuccess, onSuccess]);

        const handleOTPChange = (otp: string) => {
            setConfig((prevConfig) => ({ ...prevConfig, otp }));
        };

        const clearOtp = () => {
            setConfig((prevConfig) => ({ ...prevConfig, otp: '' }));
        };

        const generatetOtp = () => {
            axiosInstance.get(`${API_URL}/otp/${otpType}`, params)
                .then((response) => {
                    if (response.status !== 200) {
                        MessageService.showError(toastRef, 'Erreur', 'Une erreur s\'est produite lors de la génération de l\'OTP');
                    } else {
                        setResendDisabled(true);
                        setResendTimer(RESEND_DISABLE_TIME);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        useEffect(() => {
            if (OtpDialogVisible) {
                generatetOtp();
            }
        }, [OtpDialogVisible]);


        const [loading, setLoading] = useState<boolean>(false);
        const handleSubmit = () => {
            setLoading(true);
            axiosInstance.post(`${API_URL}/otp/validate-otp`, null, {
                params: { otp }
            }).then((response) => {
                if (response.data) {
                    MessageService.showSuccess(toastRef, 'Success', 'OTP is valid');

                    onSuccess && onSuccess();

                    setOtpDialogVisible(false);
                    clearOtp();
                } else {
                    MessageService.showError(toastRef, 'Error', 'OTP is invalid');
                }
            }).catch((_) => {
                MessageService.showError(toastRef, 'Error', 'There was an error validating the OTP');
            }).finally(() => {
                setLoading(false);
            });
        };

        useEffect(() => {
            let interval: NodeJS.Timeout;
            if (resendDisabled) {
                interval = setInterval(() => {
                    setResendTimer((prevTimer) => {
                        if (prevTimer <= 1) {
                            clearInterval(interval);
                            setResendDisabled(false);
                            return 0;
                        }
                        return prevTimer - 1;
                    });
                }, 1000);
            }
            return () => clearInterval(interval);
        }, [resendDisabled]);


        // ================== Timer ==================
        const [minutes, setMinutes] = useState(MINUTES_TIMEOUT);
        const [seconds, setSeconds] = useState(SECONDS_TIMEOUT);

        useEffect(() => {
            let interval: string | number | NodeJS.Timeout | undefined;
            if (OtpDialogVisible) {
                interval = setInterval(() => {
                    if (seconds > 0) {
                        setSeconds(seconds - 1);
                    }
                    if (seconds === 0) {
                        if (minutes === 0) {
                            clearInterval(interval);
                            setOtpDialogVisible(false);
                        } else {
                            setMinutes(minutes - 1);
                            setSeconds(59);
                        }
                    }
                }, 1000);
            } else {
                setMinutes(MINUTES_TIMEOUT);
                setSeconds(SECONDS_TIMEOUT);
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }, [minutes, seconds, OtpDialogVisible]);

        // ================== Otp active ==================
        const { isOtpActive } = useFeatureFlagStore();

        return (
            <>
                <Dialog
                    visible={OtpDialogVisible}
                    style={{ width: '600px', height: '450px' }}
                    resizable={false}
                    modal
                    onHide={() => {
                        setOtpDialogVisible(false);
                    }}
                    footer={
                        <>
                            <div>
                                <Button
                                    label={"Annuler l'opération"}
                                    severity="danger"
                                    size='small'
                                    onClick={(e) => {
                                        setOtpDialogVisible(false);
                                        clearOtp();
                                    }} />
                                <Button
                                    label={resendDisabled ? `Renvoyer le code OTP (${resendTimer}s)` : "Renvoyer le code OTP"}
                                    size='small'
                                    onClick={(e) => {
                                        generatetOtp();
                                    }}
                                    disabled={resendDisabled}
                                />
                                <Button
                                    label={"Valider le code"}
                                    className="hover:bg-green-700"
                                    loading={loading}
                                    severity="success"
                                    size='small'
                                    onClick={async () => {
                                        handleSubmit();
                                    }}
                                /> : <></>
                            </div>
                        </>
                    }
                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div className="flex flex-column">
                            <div style={{ textAlign: 'center', marginBottom: '0px' }}>
                                <h2>Saisir le code OTP reçu</h2>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                                {minutes === 0 && seconds === 0
                                    ? <span>Le code OTP a expiré !</span>
                                    : <span>Temps disponible: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                                }
                            </div>
                            <div style={{ marginBottom: "50px" }}>
                                <OtpInput
                                    inputStyle={{ width: '100%', height: '50px', fontSize: '20px' }}
                                    numInputs={numInputs}
                                    onChange={handleOTPChange}
                                    renderSeparator={<span style={{ margin: '0 8px' }}>{separator}</span>}
                                    value={otp}
                                    placeholder={placeholder}
                                    inputType={inputType}
                                    renderInput={(props) => <input {...props} style={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '20px',
                                        textAlign: 'center',
                                        lineHeight: '50px',
                                        border: '2px solid #ccc'
                                    }} />}
                                    shouldAutoFocus
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Toast ref={toastRef} />
            </>
        );
    });

export default OtpProcess;