package ma.sir.ged.service.facade.admin.parapheur;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
import com.itextpdf.text.pdf.PdfReader;
import ma.sir.ged.Signature.QrCode.service.QRCodeService;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class FicheParapheurGenerator {

    private final QRCodeService qrCodeService;

    @Autowired
    public FicheParapheurGenerator(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    private static final String[] FRENCH_MONTHS = {
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    };

    private static final int SIGNATURES_PER_PAGE = 4;

    public byte[] signParapheur(byte[] parapheurBytes, List<BufferedImage> signatureImages) {

        Collections.reverse(signatureImages);

        try {
            PdfReader pdfReader = new PdfReader(parapheurBytes);
            int totalSignatures = signatureImages.size();
            int signaturesPerPage = 4;
            int totalPages = pdfReader.getNumberOfPages();

            int pagesNeededForSignatures = (int) Math.ceil((double) totalSignatures / signaturesPerPage);

            int startingPage = totalPages - pagesNeededForSignatures + 1;

            byte[] currentPdf = parapheurBytes;

            for (int i = 0; i < totalSignatures; i++) {
                BufferedImage signatureImage = signatureImages.get(i);

                int pageIndex = totalSignatures - i - 1;
                int pageNumber = startingPage + (pageIndex / signaturesPerPage);

                int positionOnPage = pageIndex % signaturesPerPage;
                int row = positionOnPage / 2;
                int column = positionOnPage % 2;

                float xFactor = (column == 0) ? 0.20f : 0.80f;
                float yFactor = (row == 0) ? 0.80f : 0.20f;

                currentPdf = qrCodeService.addImageToPdf(currentPdf, signatureImage, pageNumber, xFactor, yFactor);
            }

            return currentPdf;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to sign Parapheur", e);
        }
    }

    public byte[] createFicheParapheurPdf(List<ParapheurCertificateData> dataEntries, List<String> signatureData) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);

        pdf.addEventHandler(PdfDocumentEvent.END_PAGE, new PageNumberEventHandler());

        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        document.setFont(font);
        document.setFontSize(10);

        float pageWidth = PageSize.A4.getWidth();
        float pageHeight = PageSize.A4.getHeight();
        float margin = 30f;

        document.setMargins(margin, margin, margin, margin);

        addHeader(document, pageWidth);
        addTitle(document);

        float availableHeight = pageHeight - document.getTopMargin() - document.getBottomMargin() - 130; // Subtracting space for header and title
        addMainTable(document, dataEntries, availableHeight);

        addSignatureTables(document, signatureData);

        document.close();
        return baos.toByteArray();
    }

    private void addMainTable(Document document, List<ParapheurCertificateData> dataEntries, float availableHeight) {
        if (dataEntries == null || dataEntries.isEmpty()) {
            document.add(new Paragraph("Aucune donnée disponible pour le tableau principal.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(12)
                    .setBold()
                    .setMarginTop(20));

            document.add(new AreaBreak());
            return;
        }

        int totalEntries = dataEntries.size();
        int maxRowsPerPage = 5;

        float pageWidth = document.getPdfDocument().getDefaultPageSize().getWidth();
        float margin = 30f;
        float tableWidth = pageWidth - 2 * margin;

        Table table = new Table(UnitValue.createPercentArray(new float[]{30, 30, 40}));
        table.setWidth(tableWidth);
        table.setFixedLayout();

        // Add header row
        String[] headers = {"N° / DATE\nENREGISTREMENT", "SOCIETE", "DESTINATAIRE"};
        for (String header : headers) {
            table.addCell(new Cell().add(new Paragraph(header))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
        }

        float headerHeight = 25f;
        float rowHeight = Math.max((availableHeight - headerHeight) / maxRowsPerPage, 50f); // Minimum row height of 50

        // Add data rows
        for (int i = 0; i < totalEntries; i++) {
            ParapheurCertificateData entry = dataEntries.get(i);

            Cell dateCell = new Cell().add(new Paragraph(entry.getNumeroDenregistrement() != null && !entry.getNumeroDenregistrement().isEmpty() ? entry.getNumeroDenregistrement() : "------"))
                    .setHeight(rowHeight)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setBorderTop(Border.NO_BORDER)
                    .setBorderBottom(new SolidBorder(1));

            Cell societeCell = new Cell().add(new Paragraph(entry.getNomDeMarque() != null && !entry.getNomDeMarque().isEmpty() ? entry.getNomDeMarque() : "------"))
                    .setHeight(rowHeight)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setBorderTop(Border.NO_BORDER)
                    .setBorderBottom(new SolidBorder(1));

            table.addCell(dateCell);
            table.addCell(societeCell);

            if (i == 0) {
                Cell destinataireCell = new Cell(totalEntries, 1)
                        .add(new Paragraph("MONSIEUR LE MINISTRE DE LA SANTE\nET DE LA PROTECTION SOCIALE\n\nS/C DE LA VOIE HIERARCHIQUE"))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setBorderBottom(new SolidBorder(1));
                table.addCell(destinataireCell);
            }
        }

        // Add total row
        table.addFooterCell(new Cell(1, 4)
                .add(new Paragraph("Nombre total des CE / Parapheur : " + totalEntries))
                .setTextAlignment(TextAlignment.LEFT)
                .setPaddingTop(10)
                .setBorderTop(new SolidBorder(1)));

        document.add(table);
    }



    private void addHeader(Document document, float pageWidth) {
        Table header = new Table(UnitValue.createPercentArray(new float[]{70, 30}));
        header.setWidth(pageWidth - 60);
        header.addCell(new Cell().add(new Paragraph("15-1-2024/DM/DPS/DMP/18"))
                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT));
        header.addCell(new Cell().add(new Paragraph("Rabat le : " + getFrenchDate()))
                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));
        document.add(header);
    }

    private void addTitle(Document document) {
        document.add(new Paragraph("FICHE PARAPHEUR")
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setMarginBottom(20));
    }

    private void addSignatureTables(Document document, List<String> signatureData) {
        int signaturePages = (int) Math.ceil(signatureData.size() / (double) SIGNATURES_PER_PAGE);

        for (int page = 0; page < signaturePages; page++) {
            document.add(new AreaBreak());

            float pageWidth = document.getPdfDocument().getDefaultPageSize().getWidth();
            float pageHeight = document.getPdfDocument().getDefaultPageSize().getHeight();
            float margin = 30f;
            float tableWidth = pageWidth - 2 * margin;
            float tableHeight = pageHeight - 2 * margin;

            Table signatureTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}));
            signatureTable.setWidth(tableWidth);
            signatureTable.setHeight(tableHeight);
            signatureTable.setHorizontalAlignment(HorizontalAlignment.CENTER);

            int startIndex = page * SIGNATURES_PER_PAGE;
            int endIndex = Math.min((page + 1) * SIGNATURES_PER_PAGE, signatureData.size());

            for (int i = startIndex; i < endIndex; i++) {
                signatureTable.addCell(new Cell()
                        .add(new Paragraph(signatureData.get(i)))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.TOP)
                        .setHeight(tableHeight / 2) // Half of table height
                        .setBorder(Border.NO_BORDER)
                        .setBorderTop(new SolidBorder(1))
                        .setBorderLeft(new SolidBorder(1))
                        .setBorderRight(new SolidBorder(1))
                        .setBorderBottom(new SolidBorder(1)));
            }

            // Add empty cells if needed to complete the 2x2 grid
            for (int i = endIndex - startIndex; i < SIGNATURES_PER_PAGE; i++) {
                signatureTable.addCell(new Cell()
                        .setHeight(tableHeight / 2) // Half of table height
                        .setBorder(Border.NO_BORDER)
                        .setBorderTop(new SolidBorder(1))
                        .setBorderLeft(new SolidBorder(1))
                        .setBorderRight(new SolidBorder(1))
                        .setBorderBottom(new SolidBorder(1)));
            }

            document.add(signatureTable);
        }
    }

    private class PageNumberEventHandler implements IEventHandler {
        @Override
        public void handleEvent(Event event) {
            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfDocument pdfDoc = docEvent.getDocument();
            PdfPage page = docEvent.getPage();
            int pageNumber = pdfDoc.getPageNumber(page);
            int totalPages = pdfDoc.getNumberOfPages();

            PdfCanvas canvas = new PdfCanvas(page);
            canvas.beginText();
            try {
                canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 12);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            canvas.moveText(559, 20);
            canvas.showText(String.format("%d / %d", pageNumber, totalPages));
            canvas.endText();
            canvas.release();
        }
    }

    private String getFrenchDate() {
        LocalDate now = LocalDate.now();
        return now.getDayOfMonth() + " " + FRENCH_MONTHS[now.getMonthValue() - 1] + " " + now.getYear();
    }
}
