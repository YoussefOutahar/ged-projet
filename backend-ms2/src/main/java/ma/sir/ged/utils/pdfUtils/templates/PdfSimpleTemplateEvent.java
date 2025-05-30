package ma.sir.ged.utils.pdfUtils.templates;

import com.itextpdf.io.IOException;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.net.MalformedURLException;
import java.text.SimpleDateFormat;

public class PdfSimpleTemplateEvent extends PdfPageEventHelper {
    private PdfTemplate t;
    private Image total;

    private String title;

    public PdfSimpleTemplateEvent(String title) {
        this.title = title;
    }

    public void onOpenDocument(PdfWriter writer, Document document) {
        t = writer.getDirectContent().createTemplate(30, 16);
        try {
            total = Image.getInstance(t);
            total.setRole(PdfName.ARTIFACT);
        } catch (DocumentException de) {
            throw new ExceptionConverter(de);
        }
    }

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        addHeader(writer);
        addFooter(writer);
    }

    private void addHeader(PdfWriter writer){
        PdfPTable header = new PdfPTable(3);

        try {
            // set defaults
            header.setWidths(new int[]{9, 11, 3});
            header.setTotalWidth(527);
            header.setLockedWidth(true);
            header.getDefaultCell().setFixedHeight(20);
            header.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            header.getDefaultCell().setBorderColor(BaseColor.LIGHT_GRAY);

            // add logo
            Image logo = Image.getInstance(PdfSimpleTemplateEvent.class.getResource("/pdfResources/logo-yandoc.png"));
            logo.scaleToFit(100, 70);
            header.addCell(logo);

            // add text
            PdfPCell text = new PdfPCell();
            text.setBorder(Rectangle.NO_BORDER);
            text.setPaddingBottom(15);
            text.addElement(new Phrase(this.title, new Font(Font.FontFamily.HELVETICA, 14)));
            text.setHorizontalAlignment(Element.HEADER);
            header.addCell(text);

            // add current time
            PdfPCell time = new PdfPCell();
            time.setPaddingBottom(15);
            time.setPaddingLeft(10);
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
            String generationDate = formatter.format(new java.util.Date());
            time.addElement(new Phrase(generationDate, new Font(Font.FontFamily.HELVETICA, 8)));
            time.setBorder(Rectangle.NO_BORDER);
            time.setHorizontalAlignment(Element.ALIGN_RIGHT);
            header.addCell(time);

            // write content
            header.writeSelectedRows(0, -1, 34, 803, writer.getDirectContent());
        } catch (DocumentException | MalformedURLException | IOException e) {
            e.printStackTrace();
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void addFooter(PdfWriter writer) {
        PdfPTable footer = new PdfPTable(3);
        try {
            // set defaults
            footer.setWidths(new int[]{24, 1, 3});
            footer.setTotalWidth(527);
            footer.setLockedWidth(true);
            footer.getDefaultCell().setFixedHeight(40);
            footer.getDefaultCell().setBorder(Rectangle.TOP);
            footer.getDefaultCell().setBorderColor(BaseColor.LIGHT_GRAY);

            // add text
            PdfPCell text = new PdfPCell(new Phrase("All rights reserved", new Font(Font.FontFamily.HELVETICA, 8)));
            text.setBorder(Rectangle.TOP);
            text.setBorderColor(BaseColor.LIGHT_GRAY);
            footer.addCell(text);

            // add empty cell
            footer.addCell("");

            // add current page count
            footer.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);
            footer.addCell(new Phrase(String.format("Page %d", writer.getPageNumber()), new Font(Font.FontFamily.HELVETICA, 8)));

            // add placeholder for total page count
            PdfPCell totalPageCount = new PdfPCell(total);
            totalPageCount.setBorder(Rectangle.TOP);
            totalPageCount.setBorderColor(BaseColor.LIGHT_GRAY);
            footer.addCell(totalPageCount);

            // write page
            PdfContentByte canvas = writer.getDirectContent();
            canvas.beginMarkedContentSequence(PdfName.ARTIFACT);
            // Adjust the x-coordinate for the footer
            footer.writeSelectedRows(0, -1, 34, 36, canvas); // changed from 50 to 36
            canvas.endMarkedContentSequence();
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    public void onCloseDocument(PdfWriter writer, Document document) {
        int totalLength = String.valueOf(writer.getPageNumber()).length();
        int totalWidth = totalLength * 5;
        ColumnText.showTextAligned(t, Element.ALIGN_RIGHT,
                new Phrase(String.valueOf(writer.getPageNumber()), new Font(Font.FontFamily.HELVETICA, 8)),
                totalWidth, 6, 0);
    }
}
