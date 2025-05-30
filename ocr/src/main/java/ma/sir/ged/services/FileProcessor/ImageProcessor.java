package ma.sir.ged.services.FileProcessor;

import java.io.IOException;

import ma.sir.ged.services.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageProcessor implements FileProcessor {

    @Autowired
    private OcrService ocrService;

    @Override
    public String processFile(MultipartFile file, String language) throws IOException {
        return ocrService.performOCR(file, language);
    }
    
}
