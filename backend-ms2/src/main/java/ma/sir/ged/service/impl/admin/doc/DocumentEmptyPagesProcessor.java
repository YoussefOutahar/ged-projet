package ma.sir.ged.service.impl.admin.doc;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DocumentEmptyPagesProcessor {

    final static double THRESHOLD = 100;


    public Map<Integer, Double> findEmptyPages(MultipartFile file) throws IOException {
        PDDocument document = PDDocument.load(file.getInputStream());
        PDFRenderer pdfRenderer = new PDFRenderer(document);

        Map<Integer, Double> emptyPagesPercentages = new HashMap<>();

        for (int page = 0; page < document.getNumberOfPages(); ++page) {
            BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300);

            double emptyPercentage = emptyPercentage(bim);
            emptyPagesPercentages.put(page + 1, emptyPercentage);
        }

        document.close();

        emptyPagesPercentages = emptyPagesPercentages.entrySet().stream()
                .filter(entry -> entry.getValue() >= THRESHOLD)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        return emptyPagesPercentages;
    }

    private double emptyPercentage(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int totalPixels = width * height;
        int emptyPixels = 0;

        int whiteRGB = Color.WHITE.getRGB();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int pixel = image.getRGB(x, y);
                if (pixel == whiteRGB) {
                    emptyPixels++;
                }
            }
        }

        return (double) emptyPixels / totalPixels * 100;
    }
}
