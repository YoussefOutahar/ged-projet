package ma.sir.ged.service.impl.admin;

import ma.sir.ged.service.facade.admin.FileCompressorService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@Service
public class FileCompressorServiceImpl implements FileCompressorService {
    @Async
    @Override
    public Future<Boolean> compressFile(InputStream sourceStream, String destinationPath) {
        try {
            GZIPOutputStream gzipOutputStream = new GZIPOutputStream(Files.newOutputStream(Paths.get(destinationPath))) {
//                {
//                    def.setLevel(Deflater.BEST_COMPRESSION);
//                }
            };
            byte[] buffer = new byte[1024];
            int len;
            while ((len = sourceStream.read(buffer)) != -1) {
                gzipOutputStream.write(buffer, 0, len);
            }
            return CompletableFuture.completedFuture(true);
        } catch (IOException e) {
            System.err.println("Error compressing file: " + e.getMessage());
            return CompletableFuture.completedFuture(false);
        }
    }

    @Async
    @Override
    public Future<Boolean> decompressFile(InputStream sourceStream, OutputStream destinationStream) {
        try {
            GZIPInputStream gzipInputStream = new GZIPInputStream(sourceStream) {};
            byte[] buffer = new byte[1024];
            int len;
            while ((len = gzipInputStream.read(buffer)) != -1) {
                destinationStream.write(buffer, 0, len);
            }
            return CompletableFuture.completedFuture(true);
        } catch (IOException e) {
            e.printStackTrace();
            return CompletableFuture.completedFuture(false);
        }
    }

    // For compressing and decompressing directories, you can use the same logic as above,
    // but you would need to recursively go through all the files in the directory.
    // This is a bit more complex and is left as an exercise.
    //    Chat gpt nadi galik leave it as an exercice HHHHHHHHHH
    @Async
    @Override
    public Future<Boolean> compressDirectory(String sourcePath, String destinationPath) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Async
    @Override
    public Future<Boolean> decompressDirectory(String sourcePath, String destinationPath) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
