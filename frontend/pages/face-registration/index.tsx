import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import axiosInstance from "app/axiosInterceptor";
import { Button } from "primereact/button";
import { RefObject, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { ProgressSpinner } from "primereact/progressspinner";
import ParticleComponent from "./ParticleComponent";


const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const width = 700;
const height = 700;

const FaceRegistrationPage = () => {
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

    const startRegistrationProcess = () => {
        startScreenshotCapture();
    };


    // Screenshots per interval
    const [isCapturing, setIsCapturing] = useState(false);
    const screenshotCountRef = useRef(0);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const detectedRef = useRef(detected);
    const facesDetectedRef = useRef(facesDetected);

    useEffect(() => {
        detectedRef.current = detected;
        facesDetectedRef.current = facesDetected;
    }, [screenshotCountRef.current, detected, facesDetected]);

    const startScreenshotCapture = () => {
        if (isCapturing) return;
        setIsCapturing(true);
        screenshotCountRef.current = 0;

        captureIntervalRef.current = setInterval(() => {

            if (!detectedRef.current || facesDetectedRef.current > 1) {
                console.log("Pausing capture due to face detection conditions.");
                return;
            }

            if (screenshotCountRef.current >= 15) {
                console.log("Finished capturing screenshots.");
                stopScreenshotCapture();
                return;
            }

            const imageSrc = (webcamRef as RefObject<Webcam>).current?.getScreenshot();
            if (imageSrc) {
                sendScreenShot(imageSrc);
                screenshotCountRef.current += 1;
            }
        }, 500);
    };

    const stopScreenshotCapture = () => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
            setIsCapturing(false);
        }
    };

    const sendScreenShot = async (imageSrc: string | null | undefined) => {
        // console.log("Sending screenshot to server number: ", screenshotCountRef.current + 1, "...");
        // const imageSrc = (webcamRef as RefObject<Webcam>).current?.getScreenshot();
        if (imageSrc) {
            const fetchResponse = await fetch(imageSrc);
            const blob = await fetchResponse.blob();
            const file = new File([blob], "filename.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);
            formData.append("name", connectedUser?.username || '');

            axiosInstance.post(`${API_URL}/face-authentication/add-face`, formData)
                .then(response => {
                    // console.log(response);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };



    // Video recording
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
        if (webcamRef && (webcamRef as RefObject<Webcam>).current && (webcamRef as RefObject<Webcam>).current?.stream) {
            const stream: MediaStream | null | undefined = (webcamRef as RefObject<Webcam>).current?.stream;

            if (stream) {
                const recorder = new MediaRecorder(stream);
                const chunks: BlobPart[] = [];

                recorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
                recorder.onstop = () => {
                    const completeBlob = new Blob(chunks, { type: "video/webm" });
                    sendVideo(completeBlob);
                    saveVideo(completeBlob);
                };

                recorder.start();
                setMediaRecorder(recorder);
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        } else {
            console.log("MediaRecorder is either not initialized or already inactive.");
        }

    };

    return (
        <>
            
            <div
                className="card overflow-x-auto mt-2"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}
            >
                <h2 style={{alignSelf: 'start'}}>Identification Faciale</h2>
                {isLoading &&
                    <div className="flex justify-content-center items-center h-full">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>}
                <div hidden={isLoading} style={{ width, height, position: 'relative' }}>
                    {boundingBox.map((box, index) => (
                        <div
                            key={`${index + 1}`}
                            style={{
                                border: '4px solid ' + (facesDetected > 1 ? 'red' : 'green'),
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
                        }}
                        style={{
                            height,
                            width,
                            position: 'absolute',
                        }}
                    />
                    {isCapturing && <ParticleComponent
                        size="150"
                        speed="4"
                        color={(facesDetected > 1 || !detected) ? 'red' : 'green'}
                        style={{ position: 'absolute', top: '40%', left: '40%'}}
                            //  top: height / 2, left: width / 2, transform: `translate(-${height / 2}, -${width / 2})` }}
                    />}
                </div>
                <div
                    style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'end', alignItems: 'end', width: '100%' }}
                >
                    <Button
                        label="Register Face"
                        raised
                        style={{ backgroundColor: '#4a5196', border: 'none' }}
                        className="ml-3 p-3 text-large hover:bg-green-600"
                        onClick={startRegistrationProcess}
                    />
                    {/* <Button
                        label="Start recording"
                        raised
                        style={{ backgroundColor: '#4a5196', border: 'none' }}
                        className="ml-3 p-3 text-large hover:bg-green-600"
                        onClick={startRecording}
                    /> */}
                    {/* <Button
                        label="Stop recording"
                        raised
                        style={{ backgroundColor: '#4a5196', border: 'none' }}
                        className=" p-3 text-large hover:bg-green-600"
                        onClick={stopRecording}
                    /> */}
                </div>
            </div>
        </>
    );
};

export default FaceRegistrationPage;