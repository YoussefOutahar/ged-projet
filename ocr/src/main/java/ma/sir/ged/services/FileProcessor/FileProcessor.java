package ma.sir.ged.services.FileProcessor;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileProcessor {
    String processFile(MultipartFile file, String language) throws IOException;
}
