import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import axiosInstance from "app/axiosInterceptor";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { RefObject, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;


const width = 500;
const height = 500;

const FaceRegister = () => {
    const [visible, setVisible] = useState(false);

    const webCamRef: RefObject<Webcam> = useRef(null);

    const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
        faceDetectionOptions: {
            model: 'short',
        },
        faceDetection: new FaceDetection.FaceDetection({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        }),
        camera: ({ mediaSrc, onFrame, }: CameraOptions) =>
            new Camera(mediaSrc, {
                onFrame,
                height,
                width,
            }),
    });

    const { connectedUser } = useConnectedUserStore();

    const registerFace = async () => {
        const imageSrc = webCamRef.current?.getScreenshot();

        if (imageSrc) {
            const fetchResponse = await fetch(imageSrc);
            const blob = await fetchResponse.blob();
            const file = new File([blob], "filename.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);
            formData.append("name", connectedUser?.username || '');

            axiosInstance.post(`${API_URL}/face-authentication/add-face`, formData)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    const sendVideo = (videoBlob: Blob) => {
        const formData = new FormData();
        formData.append("video", videoBlob);
        formData.append("name", connectedUser?.username || '');

        axiosInstance.post(`${API_URL}/face-authentication/add-face-stream`, formData)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const saveVideo = (videoBlob: Blob) => {
        console.log("Saving video");

        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recorded-video.webm"; // You can set a different filename here
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    };

    const startRecording = () => {
        console.log("Start recording");
        console.log(webCamRef.current?.stream);

        if (webCamRef.current && webCamRef.current.stream) {
            const stream: MediaStream = webCamRef.current.stream;
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
            recorder.onstop = () => {
                const completeBlob = new Blob(chunks, { type: "video/webm" });
                sendVideo(completeBlob);
                // saveVideo(completeBlob);
            };

            recorder.start();
            setMediaRecorder(recorder);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            console.log("Recording stopped");
        } else {
            console.log("MediaRecorder is either not initialized or already inactive.");
        }

        setVisible(false);
    };

    useEffect(() => {
        if (!visible) {
            console.log("Component hidden, stopping recording...");
            stopRecording();
        }
    }, [visible]);

    return (
        <>
            <Button
                label="Face Register"
                raised
                style={{ backgroundColor: '#4a5196', border: 'none' }}
                className="w-full mt-3 p-3 text-large hover:bg-green-600"
                onClick={() => setVisible(true)}
            />

            {visible && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {/* <Webcam
                        ref={webcamRef}
                        mirrored
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        onUserMedia={() => startRecording()}
                    /> */}
                    <p>{`Loading: ${isLoading}`}</p>
                    <p>{`Face Detected: ${detected}`}</p>
                    <p>{`Number of faces detected: ${facesDetected}`}</p>
                    <div style={{ width, height, position: 'relative' }}>
                        {boundingBox.map((box, index) => (
                            <div
                                key={`${index + 1}`}
                                style={{
                                    border: '4px solid red',
                                    position: 'absolute',
                                    top: `${box.yCenter * 100}%`,
                                    left: `${(1 - box.xCenter - box.width) * 100}%`,
                                    width: `${box.width * 100}%`,
                                    height: `${box.height * 100}%`,
                                    zIndex: 1,
                                }}
                            />
                        ))}
                        <Webcam
                            ref={webcamRef}
                            forceScreenshotSourceSize
                            mirrored
                            audio={false}
                            screenshotFormat="image/jpeg"
                            onUserMedia={() => {
                                // startRecording();
                            }}
                            style={{
                                height,
                                width,
                                position: 'absolute',
                            }}
                        />
                    </div>
                    <Button
                        label="Stop recording"
                        raised
                        style={{ backgroundColor: '#4a5196', border: 'none' }}
                        className="w-full mt-3 p-3 text-large hover:bg-green-600"
                        onClick={stopRecording}
                    />
                </div>

            )}
        </>
    );
};

export default FaceRegister;