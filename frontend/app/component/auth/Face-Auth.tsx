import axiosInstance from "app/axiosInterceptor";
import { AuthService } from "app/zynerator/security/Auth.service";
import { MessageService } from "app/zynerator/service/MessageService";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { LegacyRef, useRef, useState } from "react";
import Webcam from "react-webcam";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const FaceAuth = () => {

    const [visible, setVisible] = useState(false);
    const webCamRef: LegacyRef<Webcam> = useRef(null);

    
    const [userService, setUserService] = useState(new AuthService());
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const AuthenticateFace = async () => {
        const imageSrc = webCamRef.current?.getScreenshot();

        if (imageSrc) {
            const fetchResponse = await fetch(imageSrc);
            const blob = await fetchResponse.blob();
            const file = new File([blob], "filename.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);


            axiosInstance.post(`${API_URL}/face-authentication/identify-face`, formData)
                .then(response => {
                    const jwt = response.headers['authorization'];
                    if (jwt) {
                        userService.saveToken(jwt)
                        router.push("/dashboard");
                    } else {
                        MessageService.showError(toast, 'Error !', 'Probléme de connexion');
                    }
                })
                .catch(error => {
                    MessageService.showError(toast, 'Error !', 'Vos identifiants sont incorrects');
                    console.log(error);
                });
        }
    };


    return (
        <>
            <Button
                label="Face Auth"
                raised
                style={{ backgroundColor: '#4a5196', border: 'none' }}
                className="w-full mt-3 p-3 text-large hover:bg-green-600"
                onClick={() => setVisible(true)}
            />
            <Dialog
                header="Face Auth"
                visible={visible}
                // style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Webcam
                        ref={webCamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        style={{ transform: 'scaleX(-1)' }}
                    />
                    <Button
                        label="Login with Face"
                        raised
                        style={{ backgroundColor: '#4a5196', border: 'none' }}
                        className="w-full mt-3 p-3 text-large hover:bg-green-600"
                        onClick={AuthenticateFace}
                    />
                </div>
            </Dialog>
            <Toast ref={toast} />
        </>
    );
};

export default FaceAuth;