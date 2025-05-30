package ma.sir.ged.Signature.PdfStampingServices;

import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.parser.*;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import org.apache.batik.transcoder.TranscoderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class SignatureStamperService {

    private static final Logger logger = LoggerFactory.getLogger(SignatureStamperService.class);

    public byte[] addTextInFrontOfOtherText(byte[] pdfBytes, String searchText, String textToAdd) {
        try {
            PdfReader reader = new PdfReader(pdfBytes);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfStamper stamper = new PdfStamper(reader, baos);

            List<float[]> positions = new ArrayList<>();

            for (int i = 1; i <= reader.getNumberOfPages(); i++) {
                positions.addAll(findTextPositions(reader, searchText, i));
            }

            logger.info("Number of occurrences found: {}", positions.size());

            for (int i = 0; i < positions.size(); i++) {
                float[] position = positions.get(i);
                int pageNum = (int) position[3];  // Page number is now stored in the 4th element
                logger.info("Occurrence {} found on page {}: x={}, y={}, width={}", i + 1, pageNum, position[0], position[1], position[2]);

                PdfContentByte canvas = stamper.getOverContent(pageNum);
                BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                canvas.beginText();
                canvas.setFontAndSize(bf, 10);
                float newX = position[0] + position[2] + 2;
                float newY = position[1];
                canvas.setTextMatrix(newX, newY);
                canvas.showText(textToAdd);
                canvas.endText();

                logger.info("text added at position: x={}, y={} on page {}", newX, newY, pageNum);
            }

            if (positions.isEmpty()) {
                logger.warn("Target text not found in any page of the document.");
            }

            stamper.close();
            reader.close();
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error("Failed to add text to PDF", e);
            throw new RuntimeException("Failed to add text to PDF", e);
        }
    }

    private java.util.List<float[]> findTextPositions(PdfReader reader, final String searchText, final int page) throws Exception {
        final List<float[]> positions = new ArrayList<>();
        PdfReaderContentParser parser = new PdfReaderContentParser(reader);

        RenderListener listener = new RenderListener() {
            @Override
            public void beginTextBlock() {}

            @Override
            public void renderText(TextRenderInfo renderInfo) {
                String text = renderInfo.getText();
                if (text != null && text.contains(searchText)) {
                    Vector start = renderInfo.getBaseline().getStartPoint();
                    Vector end = renderInfo.getBaseline().getEndPoint();
                    float[] position = new float[]{
                            start.get(Vector.I1),
                            start.get(Vector.I2),
                            end.get(Vector.I1) - start.get(Vector.I1),
                            page  // Store the page number
                    };
                    positions.add(position);
                }
            }

            @Override
            public void endTextBlock() {}

            @Override
            public void renderImage(ImageRenderInfo renderInfo) {}
        };

        parser.processContent(page, listener);
        return positions;
    }

    public BufferedImage getUserSignatureImage(Utilisateur user) throws IOException, TranscoderException {
        BufferedImage signatureImage = null;
        if (user != null) {
            if (user.getSignature() != null && user.getSignature().getSignature() != null) {
                String svgData = SvgToImageConverter.extractSvgData(user.getSignature().getSignature());
                signatureImage = SvgToImageConverter.convertSvgToPng(svgData);
            } else {
                signatureImage = new BufferedImage(200, 70, BufferedImage.TYPE_INT_ARGB);
                Graphics2D g2d = signatureImage.createGraphics();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(Color.BLACK);
                g2d.setFont(new Font("Arial", Font.BOLD, 14));
                FontMetrics fm = g2d.getFontMetrics();

                String signedByText = "signé par :";
                String userName = (user.getGender() != null ? user.getGender().getLibelle() : "") + " " +
                        (user.getNom() != null ? user.getNom() : "---------") + " " +
                        (user.getPrenom() != null ? user.getPrenom() : "---------");

                int signedByTextWidth = fm.stringWidth(signedByText);
                int userNameWidth = fm.stringWidth(userName);

                int xSignedBy = (signatureImage.getWidth() - signedByTextWidth) / 2;
                int xUserName = (signatureImage.getWidth() - userNameWidth) / 2;

                int ySignedBy = ((signatureImage.getHeight() / 2) - fm.getHeight()) / 2 + fm.getAscent();
                int yUserName = (signatureImage.getHeight() / 2) + ((signatureImage.getHeight() / 2) - fm.getHeight()) / 2 + fm.getAscent();

                g2d.drawString(signedByText, xSignedBy, ySignedBy);
                g2d.drawString(userName, xUserName, yUserName);

                g2d.dispose();
            }
        }

        return signatureImage;
    }
}
