package ma.sir.ged.service.facade.admin;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.concurrent.Future;

public interface FileCompressorService {
    Future<Boolean> compressFile(InputStream sourceStream, String destinationPath);
    Future<Boolean> compressDirectory(String sourcePath, String destinationPath);

    Future<Boolean> decompressFile(InputStream sourceStream, OutputStream destinationStream);
    Future<Boolean> decompressDirectory(String sourcePath, String destinationPath);
}
