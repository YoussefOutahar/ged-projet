package ma.sir.ged.ws.facade.open;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
//Step 0
// a-dowload OCR from https://github.com/UB-Mannheim/tesseract/wiki
// b-download trained data from https://github.com/tesseract-ocr/tessdata ::: download only fra eng and ara
//Step 1:
// create path variable (var en haut)::: TESSDATA_PREFIX with value C:\Program Files\Tesseract-OCR\tessdata
// add to Path var (var en haut)::: value C:\Program Files\Tesseract-OCR
// copy downloaded data ::: eng.traineddata and fra.traineddata to C:\Program Files\Tesseract-OCR\tessdata
@RestController
@RequestMapping("/api/open/ocr")
public class OcrWs {

    String PATH = "C:\\Program Files\\Tesseract-OCR\\tessdata";

    // POST: http://localhost:8037/api/admin/ocr/
    // in form-data :
    // key==> destinationLanguage ;; value ==> fra
    // key==> image ;; value ==> browse your image from :: resources\ocr
    @PostMapping("/")
    public String doOcr(@RequestParam MultipartFile file) throws IOException {
/*
        OcrModel request = new OcrModel();
        String destinationLanguage = "fra";
        request.setDestinationLanguage(destinationLanguage);
        request.setImage(file);

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
        }*/
        return "Adil";
    }

    public static File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

    class OcrModel {

        private String destinationLanguage;

        private MultipartFile image;

        public OcrModel() {
        }

        public OcrModel(String destinationLanguage, MultipartFile image) {
            this.destinationLanguage = destinationLanguage;
            this.image = image;

        }

        public String getDestinationLanguage() {
            return destinationLanguage;
        }

        public void setDestinationLanguage(String destinationLanguage) {
            this.destinationLanguage = destinationLanguage;
        }

        public MultipartFile getImage() {
            return image;
        }

        public void setImage(MultipartFile image) {
            this.image = image;
        }
    }

}
