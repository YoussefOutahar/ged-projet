package ma.sir.ged.Signature.QrCode.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.text.Image;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.*;
import ma.sir.ged.Signature.DigitalSignature.entity.SignatureInfo;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class QRCodeService {
    public byte[] addImageToPdf(byte[] originalPdf, BufferedImage signatureImage, int pageNumber, float xFactor, float yFactor) {
        try {
            PdfReader pdfReader = new PdfReader(originalPdf);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfStamper pdfStamper = new PdfStamper(pdfReader, outputStream);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(signatureImage, "png", baos);
            Image signature = Image.getInstance(baos.toByteArray());

            signature.scaleToFit(200, 200);

            Rectangle pageSize = pdfReader.getPageSize(pageNumber);
            float pageWidth = pageSize.getWidth();
            float pageHeight = pageSize.getHeight();

            float x = (pageWidth - signature.getScaledWidth()) * xFactor;
            float y = (pageHeight - signature.getScaledHeight()) * yFactor;

            signature.setAbsolutePosition(x, y);
            pdfStamper.getOverContent(pageNumber).addImage(signature);

            pdfStamper.close();
            pdfReader.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add signature to PDF", e);
        }
    }

    public byte[] generateQRCode(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter barcodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = barcodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ImageIO.write(bufferedImage, "PNG", baos);
        return baos.toByteArray();
    }

    public byte[] addQrCodeAndSignatureInfo(byte[] originalPdf, byte[] qrCodeImage, SignatureInfo signatureInfo, LocalDateTime dateTime, String signerName,String validationCode, int qrX, int qrY, int textX, int textY) throws IOException {
        byte[] pdfWithQrCode = addQrCodeToPdf(originalPdf, qrCodeImage, signatureInfo, qrX, qrY);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String dateTimeString = "Signé par " + signerName + ",\nle: " + dateTime.format(formatter) + "\nCode de validation: " + validationCode;

        return addTextToPdf(pdfWithQrCode, dateTimeString, textX, textY);
    }

    public byte[] addQrCodeToPdf(byte[] originalPdf, byte[] qrCodeImage, SignatureInfo signatureInfo, int x, int y) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfReader pdfReader = new PdfReader(originalPdf);
            PdfStamper pdfStamper = new PdfStamper(pdfReader, outputStream);

            Image qrImage = Image.getInstance(qrCodeImage);
            qrImage.scaleAbsolute(50, 50);
            qrImage.setAbsolutePosition(x, y);
            pdfStamper.getOverContent(1).addImage(qrImage);

            if (signatureInfo != null) {
                String jsCode = String.format(
                        "var signInfo = {" +
                                "    algorithm: '%s'," +
                                "    signingTime: '%s'," +
                                "    issuer: '%s'," +
                                "    subject: '%s'," +
                                "    serialNumber: '%s'," +
                                "    validFrom: '%s'," +
                                "    validTo: '%s'" +
                                "};" +
                                "var message = 'Signature Algorithm: ' + signInfo.algorithm + '\\n' +" +
                                "    'Signing Time: ' + signInfo.signingTime + '\\n' +" +
                                "    'Issuer: ' + signInfo.issuer + '\\n' +" +
                                "    'Subject: ' + signInfo.subject + '\\n' +" +
                                "    'Serial Number: ' + signInfo.serialNumber + '\\n' +" +
                                "    'Valid From: ' + signInfo.validFrom + '\\n' +" +
                                "    'Valid To: ' + signInfo.validTo;" +
                                "app.alert({" +
                                "    cMsg: message," +
                                "    cTitle: 'Document Signature Information'," +
                                "    nIcon: 3," +
                                "    nType: 1" +
                                "});",
                        signatureInfo.getSignatureAlgorithm(),
                        signatureInfo.getSigningTime(),
                        signatureInfo.getIssuer(),
                        signatureInfo.getSubject(),
                        signatureInfo.getSerialNumber(),
                        signatureInfo.getValidFrom(),
                        signatureInfo.getValidTo()
                );

                PdfAction action = PdfAction.javaScript(jsCode, pdfStamper.getWriter());

                PdfAnnotation link = new PdfAnnotation(pdfStamper.getWriter(), new Rectangle(x, y, x + 50, y + 50));
                link.setAction(action);
                link.put(PdfName.SUBTYPE, PdfName.LINK);
                link.setBorder(new PdfBorderArray(0, 0, 0));
                link.setHighlighting(PdfAnnotation.HIGHLIGHT_INVERT);
                pdfStamper.addAnnotation(link, 1);
            }

            pdfStamper.close();
            pdfReader.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to add QR code to PDF", e);
        }
    }

    public byte[] addTextToPdf(byte[] pdfBytes, String text, float x, float y) {
        try {
            PdfReader pdfReader = new PdfReader(pdfBytes);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfStamper pdfStamper = new PdfStamper(pdfReader, outputStream);

            PdfContentByte canvas = pdfStamper.getOverContent(1); // Assuming we're adding text to the first page
            BaseFont bf = BaseFont.createFont(BaseFont.TIMES_ITALIC, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            canvas.beginText();
            canvas.setFontAndSize(bf, 8);
            canvas.setTextMatrix(x, y);
            String[] lines = text.split("\n");
            for (String line : lines) {
                canvas.showText(line);
                canvas.moveText(0, -10);
            }
            canvas.endText();

            pdfStamper.close();
            pdfReader.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add text to PDF", e);
        }
    }
}
