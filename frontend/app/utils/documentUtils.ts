import { DocumentTypeDto } from "app/controller/model/DocumentType.model";
import exp from "constants";

const wordTypes = ['word','doc', 'docx', 'dot', 'dotx', 'docm', 'dotm', 'odt', 'ott', 'rtf', 'txt','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword','application/rtf','application/vnd.oasis.opendocument.text','text/plain'];
const excelTypes = ['excel','xls', 'xlsx', 'xlsm', 'xlsb','csv','xlt','xltx','xltm','xlam','xla','ods','ots','xlw','xlr','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel','application/vnd.oasis.opendocument.spreadsheet'];
const pdfTypes = ['pdf','pdf-ref','application/pdf'];
const imageTypes = ['image','image-ref','picture','photos','jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico','image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml', 'image/tiff', 'image/x-icon'];
const tiffTypes = ['tiff', 'tif', 'image/tiff', 'image/tif'];
const jpegTypes = ['jpg', 'jpeg', 'image/jpeg'];
const svgTypes = ['svg', 'image/svg+xml'];
const pngTypes = ['png', 'image/png'];
export const typeIsValide = (type: string) => {
    return wordTypes.includes(type.toLowerCase()) || excelTypes.includes(type.toLowerCase()) || pdfTypes.includes(type.toLowerCase()) || imageTypes.includes(type.toLowerCase());
}

export const isWord = (type: string) => {
    return wordTypes.includes(type.toLowerCase());
}
export const isExcel = (type: string) => {
    return excelTypes.includes(type.toLowerCase());
}
export const isPdf = (type: string) => {
    return pdfTypes.includes(type.toLowerCase());
}
export const isImage = (type: string) => {
    return imageTypes.includes(type.toLowerCase());
}
export const isTiff = (type: string) => {
    return tiffTypes.includes(type.toLowerCase());
}
export const isJpeg = (type: string) => {
    return jpegTypes.includes(type.toLowerCase());
}
export const isSvg = (type: string) => {
    return svgTypes.includes(type.toLowerCase());
}
export const isPng = (type: string) => {
    return pngTypes.includes(type.toLowerCase());
}

export const getMediaType = (type: string) => {
    if(isPdf(type)) return 'application/pdf';
    if(isWord(type)) return 'application/msword';
    if(isExcel(type)) return 'application/vnd.ms-excel';
    if(isImage(type)){
        if(isTiff(type)) return 'image/tiff';
        if(isJpeg(type)) return 'image/jpeg';
        if(isPng(type)) return 'image/png';
        if(isSvg(type))return 'image/svg+xml';
        return 'image';
    } 
    console.error('Unsupported media type:', type);
    return 'unsupported';
}

export const getDocumentTypeFromFileUrl = async (fileUrl : string) => {
    const response = await fetch(fileUrl);
    const contentType = response.headers.get('content-type');
    return contentType?.toLowerCase() ?? "";
}

export const getTypeAliases = (type: string) => {
    if(isPdf(type)) return pdfTypes;
    if(isWord(type)) return wordTypes;
    if(isExcel(type)) return excelTypes;
    if(isImage(type)) {
        if(isTiff(type)) return tiffTypes;
        // if(isJpeg(type)) return jpegTypes;
        // if(isPng(type)) return pngTypes;
        // if(isSvg(type)) return svgTypes;
        return imageTypes;
    }
    console.error('Unsupported media type:', type);
    return [];
}
export const  associateDocumentType = async (file: any, documentTypes: DocumentTypeDto[])=> {
    const localFileUrl = URL.createObjectURL(file);

    const fileType = await getDocumentTypeFromFileUrl(localFileUrl);
    if (typeIsValide(fileType)) {
        let documentType = documentTypes.find(type => getTypeAliases(fileType).includes(type.libelle.toLowerCase()));
        if (!documentType) {
            documentType = documentTypes.find(type => getTypeAliases(fileType).includes(type.code.toLowerCase()));
        }
        return documentType;
    }
}