package ma.sir.ged.ws.facade.admin;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.bean.core.OcrModel;
import ma.sir.ged.services.CacheControlService;
import ma.sir.ged.services.FileProcessingService;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

//Step 1:
// create path variable (var en haut)::: TESSDATA_PREFIX with value C:\Program Files\Tesseract-OCR\tessdata
// add to Path var (var en haut)::: value C:\Program Files\Tesseract-OCR
// copy eng.traineddata and fra.traineddata from resources\ocr\tessdata\ to C:\Program Files\Tesseract-OCR\tessdata
@RestController
@RequestMapping("/api/admin/ocr")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class OcrRestAdmin {

    @Value("${ocr.var.path}")
    String PATH;

    private final FileProcessingService fileProcessingService;
    private final CacheControlService cacheControlService;

    // POST: http://localhost:8037/api/admin/ocr/
    // in form-data :
    // key==> destinationLanguage ;; value ==> fr (or ar or both)
    // key==> image ;; value ==> browse your image from :: resources\ocr
    @PostMapping("/")
    public String performOcr(@RequestPart("file") MultipartFile file, @RequestPart("language") String language) {
        try {
           return fileProcessingService.processFile(file, language);
        } catch (IOException e) {
            e.printStackTrace();
            return "Error processing file";
        }
    }



    // POST: http://localhost:8037/api/admin/ocr/
    // in form-data :
    // key==> destinationLanguage ;; value ==> fra
    // key==> image ;; value ==> browse your image from :: resources\ocr
    @Deprecated
    @PostMapping("/deprecated")
    public String doOCR(@RequestParam("language") String destinationLanguage,
                        @RequestParam("file") MultipartFile file,
                        @RequestParam(value = "fileName", required = false, defaultValue = "file.pdf") String fileName) throws IOException {
        OcrModel request = new OcrModel();
        request.setDestinationLanguage(destinationLanguage);
        request.setFile(file);

        if (fileName.endsWith(".pdf")) {
            try (PDDocument document = PDDocument.load(convert(file))) {
                StringBuilder pdfTextBuilder = new StringBuilder();
                ITesseract instance = new Tesseract();
                instance.setLanguage(request.getDestinationLanguage());
                instance.setDatapath(PATH);

                PDFRenderer pdfRenderer = new PDFRenderer(document);

                for (int i = 0; i < document.getNumberOfPages(); i++) {
                    PDPage page = document.getPage(i);
                    boolean containsText = containsText(document, i);
                    if (containsText) {
                        PDFTextStripper stripper = new PDFTextStripper();
                        stripper.setStartPage(i + 1);
                        stripper.setEndPage(i + 1);
                        String pageText = stripper.getText(document);
                        pdfTextBuilder.append(pageText);
                    } else {
                        BufferedImage pageImage = pdfRenderer.renderImageWithDPI(i, 300);
                        try {
                            String result = instance.doOCR(pageImage);
                            pdfTextBuilder.append(result);
                        } catch (TesseractException e) {
                            System.err.println(e.getMessage());
                            pdfTextBuilder.append("Error while performing OCR on the image");
                        }
                    }
                }

                return new String(pdfTextBuilder.toString().getBytes(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                System.err.println(e.getMessage());
                return "Error while reading PDF";
            }
        } else {
            ITesseract instance = new Tesseract();
            try {
                BufferedImage in = ImageIO.read(convert(file));
                BufferedImage newImage = new BufferedImage(in.getWidth(), in.getHeight(), BufferedImage.TYPE_INT_ARGB);
                Graphics2D g = newImage.createGraphics();
                g.drawImage(in, 0, 0, null);
                g.dispose();
                instance.setLanguage(request.getDestinationLanguage());
                instance.setDatapath(PATH);
                String result = instance.doOCR(newImage);
                return result;
            } catch (TesseractException | IOException e) {
                System.err.println(e.getMessage());
                return "Error while reading image";
            }
        }
    }

    private boolean containsText(PDDocument document, int pageIndex) throws IOException {
        PDFTextStripper stripper = new PDFTextStripper();
        stripper.setStartPage(pageIndex + 1);
        stripper.setEndPage(pageIndex + 1);
        String pageText = stripper.getText(document);
        return !pageText.trim().isEmpty();
    }


    public static File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

    @PostMapping("/cache/clear/{cacheName}")
    public ResponseEntity<?> clearCache(@PathVariable String cacheName) {
        cacheControlService.clearCache(cacheName);
        return ResponseEntity.ok()
                .body("Cache '" + cacheName + "' cleared successfully");
    }

    @PostMapping("/cache/clear-all")
    public ResponseEntity<?> clearAllCaches() {
        cacheControlService.clearAllCaches();
        return ResponseEntity.ok()
                .body("All caches cleared successfully");
    }

}
