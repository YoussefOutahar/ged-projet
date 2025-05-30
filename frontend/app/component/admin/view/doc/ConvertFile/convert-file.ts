import { PDFDocument } from 'pdf-lib';
import ExcelJS from 'exceljs';
import axios from 'axios';

const convertDocxToPdfy = async (docxFile: any) => {
    const arrayBuffer = await docxFile.arrayBuffer();
    const pdfDoc = await PDFDocument.create();
    
    const docxBytes = Uint8Array.from(arrayBuffer);
    const docxDoc = await PDFDocument.load(docxBytes);
    const copiedPages = await pdfDoc.copyPages(docxDoc, docxDoc.getPageIndices());
    copiedPages.forEach((page) => pdfDoc.addPage(page));
    
    const file = await pdfDoc.save();
    return new Blob([file], { type: 'application/pdf' });
};
const convertDocxToPdf = async (docxFile: any) => {
    const formData = new FormData();
    formData.append('file', docxFile);

    const reponse = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/docx-to-pdf`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 'Accept-Charset': 'UTF-8',
        }
    });
    const fileBytes = reponse.data;
    const pdfBlob = new Blob([fileBytes], { type: 'application/pdf' });
    return pdfBlob;
};
const convertXlsxToPdf = async (xlsxFile: any) => {
    const arrayBuffer = await xlsxFile.arrayBuffer();
        const pdfDoc = await PDFDocument.create();
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    
    workbook.eachSheet((sheet) => {
        if (sheet) {
            const rows = sheet.getSheetValues();
            const text = rows.map((row) => {
                if (Array.isArray(row)) {
                    return row.join('\t');
                } else {
                    return row;
                }
            }).join('\n');
            const page = pdfDoc.addPage();
            if (page) {
                page.drawText(text, { x: 10, y: page.getHeight() - 10 , size: 10 });
            }
        }
    });
    const file = await pdfDoc.save();
    return new Blob([file], { type: 'application/pdf' });
};

export { convertDocxToPdf, convertXlsxToPdf };
