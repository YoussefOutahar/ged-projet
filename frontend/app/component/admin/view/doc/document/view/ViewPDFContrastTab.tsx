import { useEffect, useState } from 'react';
import { Slider } from 'primereact/slider';
import { Button } from "primereact/button";
import { pdfjs } from 'react-pdf';
import jsPDF from 'jspdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ViewPDFContrastTabProps {
    documentBase64: string;
numPages: number;
    pageNumber: number;
    setPageNumber: (pageNumber: number) => void;
}

const ViewPDFContrastTab: React.FC<ViewPDFContrastTabProps> = ({
    documentBase64,
    numPages,
    pageNumber,
    setPageNumber
}) => {
    const [contrast, setContrast] = useState(0);
    const [canvasUrl, setCanvasUrl] = useState('');
    const [brightness, setBrightness] = useState(100); 
    const [saturation, setSaturation] = useState(100);
    const [modifiedImages, setModifiedImages] = useState<string[]>([]);
    

    const adjustImage = (imageData: ImageData, contrast: number, brightness: number, saturation: number) => {
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        brightness = brightness / 100; 
        saturation = saturation / 100; 
    
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = factor * (imageData.data[i] - 128) + 128;
            imageData.data[i + 1] = factor * (imageData.data[i + 1] - 128) + 128;
            imageData.data[i + 2] = factor * (imageData.data[i + 2] - 128) + 128;
    
            imageData.data[i] *= brightness;
            imageData.data[i + 1] *= brightness;
            imageData.data[i + 2] *= brightness;
    
            let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] += (avg - imageData.data[i]) * (1 - saturation);
            imageData.data[i + 1] += (avg - imageData.data[i + 1]) * (1 - saturation);
            imageData.data[i + 2] += (avg - imageData.data[i + 2]) * (1 - saturation);
        }
        return imageData;
    };

    const renderPageAsImage = async () => {
        const loadingTask = pdfjs.getDocument({ data: atob(documentBase64) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;
        const imageData = context?.getImageData(0, 0, viewport.width, viewport.height);
        context?.putImageData(adjustImage(imageData as ImageData, contrast, brightness, saturation), 0, 0);
        const url = canvas.toDataURL();
        setCanvasUrl(url);
        const newImages = [...modifiedImages];
        newImages[pageNumber - 1] = url;
        setModifiedImages(newImages);
    };

    useEffect(() => {
        renderPageAsImage();
    }, [pageNumber, contrast, brightness, saturation]);

    const downloadPDF = () => {
        const pdf = new jsPDF();
        modifiedImages.forEach((image, index) => {
            if (index > 0) {
                pdf.addPage();
            }
            pdf.addImage(image, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        });
        pdf.save('modified_document.pdf');
    };

    return (
        <div>
            <div className='flex flex-column align-items-center mt-4'>
                <h5>Contraste</h5>
                <Slider className='mb-2' value={contrast} onChange={(e) => setContrast(e.value as number)} min={-100} max={100} style={{ width: '50%' }} />
                <h5>Luminosité</h5>
                <Slider className='mb-2' value={brightness} onChange={(e) => setBrightness(e.value as number)} min={0} max={200} style={{ width: '50%' }} />
                <h5>Saturation</h5>
                <Slider className='mb-2' value={saturation} onChange={(e) => setSaturation(e.value as number)} min={0} max={200} style={{ width: '50%' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
                <img src={canvasUrl} alt={`Page ${pageNumber}`} className='w-9' />
            </div>

            <div className='flex justify-content-center mt-2'>
                <Button className='mr-5 w-2' label="Previous" onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} disabled={pageNumber === 1} />
                <Button className='mr-5 w-2' label="Next" onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))} disabled={pageNumber === numPages} />
                <Button className='mr-5 w-2' label="Download" onClick={downloadPDF} />
            </div>
        </div>
    );
};

export default ViewPDFContrastTab;
