import { getAsset } from './prepareAssets';

export const readAsArrayBuffer = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const readAsImage = (src: Blob | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof Blob) {
      const url = window.URL.createObjectURL(src);
      img.src = url;
    } else {
      img.src = src;
    }
  });
};

export const readAsDataURL = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface PDF {
  numPages: number;
  getPage: (index: number) => Promise<any>;
}
export const readAsPDF = async (file: File): Promise<PDF> => {
  let pdfDocument: any;
  try {
    const pdfjsLib = await getAsset('pdfjsLib');
    if (!pdfjsLib) {
      throw new Error('pdfjsLib is not available.');
    }
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
      throw new Error('Invalid file type. Please select a PDF file.');
    }
    // Safari possibly get webkitblobresource error 1 when using origin file blob
    const blob = new Blob([file]);
    const url = window.URL.createObjectURL(blob);
    const documentPromise = await pdfjsLib.getDocument(url).promise;
    const pdfDocument = await documentPromise;
    return pdfDocument
  } catch (error) {
    return pdfDocument;
    // Handle the error appropriately (e.g., notify user)
  }
};
