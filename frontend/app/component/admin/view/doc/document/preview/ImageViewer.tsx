import React, { useEffect, useState } from 'react';
import { Image } from 'primereact/image';
import { decode } from 'tiff';
import { set } from 'lodash';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { is } from 'date-fns/locale';

type Props = {
    fileUrl: string | undefined;
    documentBlob: Blob | undefined;
    imageType: string;
};

const isTiff = (imageType: string) => {
    let tiffTypes = ['tiff', 'tif', 'image/tiff', 'image/tif'];
    return tiffTypes.includes(imageType.toLowerCase());
};
const isSvg = (imageType: string) => {
    let svgTypes = ['svg', 'image/svg+xml'];
    return svgTypes.includes(imageType.toLowerCase());
}

const ImageViewer = ({ fileUrl, documentBlob, imageType }: Props) => {
    const [constructedFileUrl, setConstructedFileUrl] = useState<string>("");
    const [isTiffMultiPage, setIsTiffMultiPage] = useState<boolean>(false);
    const [currentTiffPage, setCurrentTiffPage] = useState<number>(0);
    const [loadingTiffImages, setLoadingTiffImages] = useState<boolean>(false);

    const handleTiffImages = async (blob: Blob) => {
        setLoadingTiffImages(true);
        const arrayBuffer = await blob.arrayBuffer();
        const tiffImages = decode(arrayBuffer);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        setIsTiffMultiPage(tiffImages.length > 1);
        if (ctx && tiffImages.length > 0) {
            const { width, height, data } = tiffImages[currentTiffPage % tiffImages.length];
            canvas.width = width;
            canvas.height = height;
            const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
            ctx.putImageData(imageData, 0, 0);
            const url = canvas.toDataURL('image/png');
            setConstructedFileUrl(url);

        }
        setLoadingTiffImages(false);
    };

    useEffect(() => {
        if (documentBlob) {
            if (isTiff(imageType)) {
                handleTiffImages(documentBlob);
            }else if(isSvg(imageType)){
                const blobWithType = new Blob([documentBlob], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blobWithType);
                setConstructedFileUrl(url);
            } 
            else {
                const url = window.URL.createObjectURL(documentBlob);
                setConstructedFileUrl(url);
            }
        }
    }, [documentBlob, imageType,currentTiffPage]);

    useEffect(() => {
        if (fileUrl && fileUrl !== '') {
            if(isTiff(imageType)){
                convertURLToBlob(fileUrl).then((blob) => {
                    handleTiffImages(blob);
                }).catch((err) => {
                    console.error('Error converting URL to Blob:', err)
                    });
            }else{
                setConstructedFileUrl(fileUrl);
            }
        }
    }, [fileUrl]);

    const convertURLToBlob = async (url: string) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return blob;
      };

    return (
        <div className='flex flex-column mx-auto my-auto my-0 w-fit max-h-fit ' >
            {
                loadingTiffImages ?
                <div className="flex justify-content-center items-center h-full">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
                :
                <Image src={constructedFileUrl} alt="Image"  preview width='400' />

            }
            
            {
                isTiffMultiPage && (
                    <div className=' flex flex-row gap-2 mx-auto w-fit'>
                        <Button rounded icon="pi pi-angle-left" text 
                        onClick={() => setCurrentTiffPage((currentTiffPage - 1) < 0 ? currentTiffPage : currentTiffPage - 1)} 
                        />
                        {/* <span className='my-auto text-center text-lg font-semibold text-gray-700'>{currentTiffPage + 1}</span> */}
                        <Button onClick={() => setCurrentTiffPage(currentTiffPage + 1)} rounded icon="pi pi-angle-right" text  />
                    </div>
                )
            }
        </div>
    );
};

export default ImageViewer;
