package ma.sir.ged.services;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.sir.ged.services.FileProcessor.ImageProcessor;
import ma.sir.ged.services.FileProcessor.PdfProcessor;

@Service
@RequiredArgsConstructor
public class FileProcessingService {
    private final ImageProcessor imageProcessor;
    private final PdfProcessor pdfProcessor;

    public String processFile(MultipartFile file, String language) throws IOException {
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();

            if (contentType.startsWith("image")) {
                return imageProcessor.processFile(file, language);
            } else if (contentType.startsWith("application/pdf")) {
                return pdfProcessor.processFile(file, language);
            } else if (contentType.equals("application/octet-stream")) {
                return pdfProcessor.processFile(file, language);
            }
        
        return "Unsupported file type";
    }

    
}
