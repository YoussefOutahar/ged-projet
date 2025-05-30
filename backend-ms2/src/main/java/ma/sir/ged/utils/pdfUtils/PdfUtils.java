package ma.sir.ged.utils.pdfUtils;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.bureauOrdre.enums.TypeCourriel;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.utils.pdfUtils.templates.PdfSimpleTemplateEvent;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.fit.pdfdom.PDFDomTree;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static ma.sir.ged.utils.TextUtils.convertToTitleCase;

public class PdfUtils {

    public static ByteArrayOutputStream generateCourrielHistoryPdf(CourrielBo courrielBo, List<CourrielHistory> courrielHistories) {
        Document document = new Document(PageSize.A4, 20, 20, 120, 72);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            PdfSimpleTemplateEvent event = new PdfSimpleTemplateEvent("Courriel History");
            writer.setPageEvent(event);

            document.open();

            generateCourrielHeader(courrielBo, document);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("\n"));

            generateCourrielSummary(courrielBo, document);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("\n"));

            // Add each CourrielHistory entry
            for (CourrielHistory history : courrielHistories) {
                PdfPTable historyTable = createHistoryTable(history);
                document.add(historyTable);
                generateSmallLineSeperator(document); // Add a line to separate each history entry
            }

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        document.close();
        return out;
    }

    public static ByteArrayOutputStream generateIntervenantsCourrielsPdf(CourrielBo courrielBo, List<IntervenantsCourriel> intervenantsCourriels) {
        Document document = new Document(PageSize.A4, 20, 20, 120, 72);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            PdfSimpleTemplateEvent event = new PdfSimpleTemplateEvent("Fiche de liaison");
            writer.setPageEvent(event);
            document.open();

            generateCourrielHeader(courrielBo, document);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("\n"));

            generateCourrielSummary(courrielBo, document);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("\n"));

            generateMiniHeader(document,"Information de destination");
            document.add(new Paragraph("\n"));
            generateCourrielDestinationInfo(document, courrielBo);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("\n"));

            generateMiniHeader(document,"List de interventions");
            document.add(new Paragraph("\n"));
            for (IntervenantsCourriel intervenantsCourriel : intervenantsCourriels) {
                PdfPTable intervenantsCourrielTable = createIntervenantsCourrielTable(intervenantsCourriel);
                document.add(intervenantsCourrielTable);

                if (intervenantsCourriel != null && intervenantsCourriel.getResponsables() != null) {
                    StringBuilder responsables = new StringBuilder();
                    for (Utilisateur responsable : intervenantsCourriel.getResponsables()) {
                        responsables.append(responsable.getUsername()).append(" - ");
                    }
                    // Remove the last " - "
                    if (responsables.length() > 0) {
                        responsables.setLength(responsables.length() - 3);
                    }
                    Paragraph responsablesParagraph = new Paragraph(responsables.toString(), new Font(Font.FontFamily.HELVETICA, 10)); // Smaller font size
                    responsablesParagraph.setAlignment(Element.ALIGN_CENTER); // Center alignment
                    document.add(responsablesParagraph);
                } else {
                    Paragraph responsablesParagraph = new Paragraph("N/A", new Font(Font.FontFamily.HELVETICA, 10)); // Smaller font size
                    responsablesParagraph.setAlignment(Element.ALIGN_CENTER); // Center alignment
                    document.add(responsablesParagraph);
                }

                generateSmallLineSeperator(document);
            }

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        document.close();
        return out;
    }

    private static void generateCourrielSummary(CourrielBo courrielBo, Document document) throws DocumentException {
        PdfPTable table = new PdfPTable(2);

        Font boldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 10);

        PdfPCell leftCell = new PdfPCell();
        leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        leftCell.setBorder(Rectangle.NO_BORDER);

        Phrase numberPhrase = new Phrase();
        numberPhrase.add(new Chunk("Courriel number:  ", boldFont));
        numberPhrase.add(new Chunk(courrielBo.getNumeroCourrier(), normalFont));
        leftCell.addElement(numberPhrase);

        Phrase subjectPhrase = new Phrase();
        subjectPhrase.add(new Chunk("Courriel Subject:  ", boldFont));
        subjectPhrase.add(new Chunk(courrielBo.getSujet(), normalFont));
        leftCell.addElement(subjectPhrase);

        table.addCell(leftCell);

//        ======================================================================

        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Phrase naturePhrase = new Phrase();
        naturePhrase.add(new Chunk("Courriel Nature:  ", boldFont));
        naturePhrase.add(new Chunk(courrielBo.getType().toValue(), normalFont));
        rightCell.addElement(naturePhrase);

        Phrase datePhrase = new Phrase();
        datePhrase.add(new Chunk("Date Arrive:  ", boldFont));
        datePhrase.add(new Chunk(courrielBo.getDateReception().toString(), normalFont));
        rightCell.addElement(datePhrase);
        table.addCell(rightCell);

        document.add(table);
    }

    private static void generateMiniHeader(Document document,String text) throws DocumentException {
        PdfPTable miniHeader = new PdfPTable(1);
        PdfPCell miniHeaderCell = new PdfPCell();
        miniHeaderCell.setBorder(Rectangle.NO_BORDER);
        miniHeaderCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        Font miniHeaderFont = new Font(Font.FontFamily.HELVETICA, 12); // Smaller font size for mini header
        miniHeaderCell.setPhrase(new Phrase(text, miniHeaderFont));
        miniHeader.addCell(miniHeaderCell);
        document.add(miniHeader);
    }

    private static void generateCourrielHeader(CourrielBo courrielBo, Document document) throws DocumentException {
        PdfPTable header = new PdfPTable(1);
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOX);
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        cell.setPhrase(new Phrase("Courriel N°" + courrielBo.getNumeroCourrier(), headerFont));
        header.addCell(cell);
        document.add(header);
    }

    public static void generateCourrielDestinationInfo(Document document, CourrielBo courriel) throws DocumentException {
        PdfPTable mainTable = new PdfPTable(2);
        mainTable.setWidthPercentage(100);

        PdfPTable leftTable = new PdfPTable(1);
        PdfPCell leftTitleCell = new PdfPCell(new Phrase("Expediteur(e)"));
        leftTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        leftTable.addCell(leftTitleCell);
        PdfPCell leftCell;
        if (courriel.getType().equals(TypeCourriel.ENTRANT)) {
            leftCell = new PdfPCell(new Phrase(courriel.getEntiteExterne().getNom()));
        } else {
            leftCell = new PdfPCell(new Phrase(courriel.getEntiteInterne().getLibelle()));
        }
        leftCell.setPadding(10);
        leftTable.addCell(leftCell);

        PdfPTable rightTable = new PdfPTable(1);
        PdfPCell rightTitleCell = new PdfPCell(new Phrase("Destinataire(s)"));
        rightTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        rightTable.addCell(rightTitleCell);
        PdfPCell rightCell;
        if (courriel.getType().equals(TypeCourriel.ENTRANT)) {
            rightCell = new PdfPCell(new Phrase(courriel.getEntiteInterne().getLibelle()));
        } else {
            rightCell = new PdfPCell(new Phrase(courriel.getEntiteExterne().getNom()));
        }
        rightCell.setPadding(10);
        rightTable.addCell(rightCell);

        PdfPCell leftMainCell = new PdfPCell(leftTable);
        mainTable.addCell(leftMainCell);

        PdfPCell rightMainCell = new PdfPCell(rightTable);
        mainTable.addCell(rightMainCell);

        document.add(mainTable);
    }

    private static void generateSmallLineSeperator(Document document) throws DocumentException {
        LineSeparator separator = new LineSeparator();
        separator.setLineWidth(1f); // Set the line width
        separator.setPercentage(50); // Set the line to occupy 50% of page width
        separator.setAlignment(Element.ALIGN_CENTER); // Set the line alignment to center

        document.add(new Chunk(separator));
    }

    private static PdfPTable createIntervenantsCourrielTable(IntervenantsCourriel intervenantsCourriel) {
        PdfPTable table = new PdfPTable(2); // 2 columns

        float[] columnWidths = new float[] {30f, 70f};
        try {
            table.setWidths(columnWidths);
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        PdfPCell cell1 = new PdfPCell();
        PdfPCell cell2 = new PdfPCell();
        cell1.setBorderColor(BaseColor.BLACK);
        cell2.setBorderColor(BaseColor.BLACK);
        cell1.setPadding(5);
        cell2.setPadding(5);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

        if (intervenantsCourriel != null && intervenantsCourriel.getDateIntervention() != null) {
            cell1.setPhrase(new Phrase("Date:"));
            cell2.setPhrase(new Phrase(intervenantsCourriel.getDateIntervention().format(formatter)));
        } else {
            cell1.setPhrase(new Phrase("Date:"));
            cell2.setPhrase(new Phrase("N/A"));
        }

        table.addCell(cell1);
        table.addCell(cell2);

        if (intervenantsCourriel != null && intervenantsCourriel.getAction() != null) {
            cell1.setPhrase(new Phrase("Action:"));
            cell2.setPhrase(new Phrase(intervenantsCourriel.getAction().getLibelle()));
        } else {
            cell1.setPhrase(new Phrase("Action:"));
            cell2.setPhrase(new Phrase("N/A"));
        }

        table.addCell(cell1);
        table.addCell(cell2);

        if (intervenantsCourriel != null) {
            cell1.setPhrase(new Phrase("Is Done:"));
            cell2.setPhrase(new Phrase(String.valueOf(intervenantsCourriel.isDone())));
        } else {
            cell1.setPhrase(new Phrase("Is Done:"));
            cell2.setPhrase(new Phrase("N/A"));
        }

        table.addCell(cell1);
        table.addCell(cell2);

        if (intervenantsCourriel != null && (intervenantsCourriel.getCommentaire() != null || intervenantsCourriel.getCommentaire().isEmpty()) ) {
            cell1.setPhrase(new Phrase("Commentaire:"));
            cell2.setPhrase(new Phrase(intervenantsCourriel.getCommentaire()));
            cell2.setRowspan(4);
        } else {
            cell1.setPhrase(new Phrase("Commentaire:"));
            cell2.setPhrase(new Phrase("N/A"));
            cell2.setRowspan(4);
        }

        table.addCell(cell1);
        table.addCell(cell2);

        return table;
    }

    private static PdfPTable createHistoryTable(CourrielHistory history) {
        PdfPTable table = new PdfPTable(1); // 1 column

        PdfPCell cell = new PdfPCell();
        cell.setPadding(7);
        cell.setBorderColor(BaseColor.BLACK);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        if (history.getType() == null) {
            history.setType(HistoryEntryType.INFORMATION);
        }

        String initiator = history.getInitiator() != null ? history.getInitiator().getUsername() : "None";

        Phrase phrase = new Phrase();
        phrase.add(new Chunk("Message: " + history.getMessage() + "\n\n"));
        phrase.add(new Chunk("Date: " + history.getDateAction().format(formatter) + "\n\n"));
        phrase.add(new Chunk("Type: " + convertToTitleCase(history.getType().toValue()) + "\n\n"));
        phrase.add(new Chunk("User: " + initiator + "\n", new Font(Font.FontFamily.HELVETICA, 12)));
        cell.setPhrase(phrase);
        table.addCell(cell);

        return table;
    }

    public static String extractTextFromPDF(MultipartFile multipartFile) {
        try {
            byte[] fileBytes = multipartFile.getBytes();

            try (PDDocument document = PDDocument.load(new ByteArrayInputStream(fileBytes))) {
                PDFTextStripper pdfStripper = new PDFTextStripper();

                StringBuilder text = new StringBuilder();
                int numberOfPages = document.getNumberOfPages();

                for (int i = 1; i <= numberOfPages; i++) {
                    pdfStripper.setStartPage(i);
                    pdfStripper.setEndPage(i);

                    text.append(pdfStripper.getText(document)).append("\n");
                }

                return text.toString();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }


    // return html in string
    public static String generateHtmlFromPdf(InputStream inputStream) throws IOException {
        PDDocument pdf = PDDocument.load(inputStream);
        PDFDomTree parser = new PDFDomTree();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter output = new PrintWriter(new OutputStreamWriter(baos, "UTF-8"), true);
        parser.writeText(pdf, output);
        output.close();
        pdf.close();
        return new String(baos.toByteArray(), StandardCharsets.UTF_8);
    }

}
