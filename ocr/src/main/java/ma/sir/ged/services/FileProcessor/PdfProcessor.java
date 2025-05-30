package ma.sir.ged.services.FileProcessor;

import java.io.IOException;

import ma.sir.ged.Enums.PdfExtractionStrategy;
import ma.sir.ged.services.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfProcessor implements FileProcessor{

    @Autowired
    private PdfService pdfService;

    @Override
    public String processFile(MultipartFile file, String language) throws IOException {
        return pdfService.extractTextFromPdf(file.getInputStream(), PdfExtractionStrategy.ADAPTIVE, language);
    }
}
