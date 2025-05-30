package ma.sir.ged.ws.facade.open;

import io.minio.errors.MinioException;
import ma.sir.ged.service.facade.open.MinIOService;
import org.apache.poi.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;


import ma.sir.ged.service.facade.open.MinIOService;



//1- download minio from :::: https://min.io/docs/minio/windows/index.html
//2- run the command (on the exe file) : .\minio.exe server C:\minio --console-address :9090
//3- change minio.accessKey=Vh4IZZ6xwTg781Upj1qp and minio.secretKey=nScFlyHHJGdnosTi5FOsFOyDsVBGJp7TmxNmFp5B
// in app-dev.prop to new value defined in http://192.168.0.100:9090/access-keys

@RestController
@RequestMapping("/api/open/minio")
public class MinioWs {

    @Autowired
    private MinIOService minIOService;


    //--- Check if bucket exists or not ---
    //curl "http://localhost:8036/minio/bucket/my-bucket"
    @GetMapping("/bucket/{name}")
    public int bucketExists(@PathVariable String name) {
        return minIOService.bucketExists(name);
    }

    //--- Upload a file to the bucket ---
    //curl -X POST -F "file=@./file01.pdf" http://localhost:8036/minio/upload/file/my-bucket
    @PostMapping("/upload/file/{bucket}")
    public int upload(@RequestParam MultipartFile file, @PathVariable String bucket) {
        return minIOService.upload(file, bucket);
    }

    //--- Create a new bucket ---
    //curl -X POST -F "bucketName=my-new-bucket" http://localhost:8036/minio/bucket
    @PostMapping("/bucket")
    public int saveBucket(@RequestParam("bucketName") String bucket) {
        return minIOService.saveBucket(bucket);
    }

    //--- List all files of a bucket ---
    //curl -X GET http://localhost:8036/minio/findAll/bucket/my-bucket
    @GetMapping("/findAll/bucket/{bucket}")
    public List<String> findAllDocuments(@PathVariable String bucket) {
        return minIOService.findAllDocuments(bucket);
    }

    //--- Download all files from a bucket ---
    //curl -o D:/GED/all_documents.zip http://localhost:8036/minio/downloadAll/bucket/my-bucket
    @GetMapping("/downloadAll/bucket/{bucket}")
    public byte[] downloadAllDocumentsAsZip(@PathVariable String bucket) {
        return minIOService.downloadAllDocumentsAsZip(bucket);
    }

    //--- share a document from a bucket ---
    //GET:: http://localhost:8037/minio/bucket/url/ged/MicrosoftTeams-image (4).png
    @GetMapping("/bucket/url/{bucket}/{path}")
    public String getUrlAccess(@PathVariable String bucket,@PathVariable String path) {
        return minIOService.getUrlAccess(bucket, "ged/MicrosoftTeams-image (4).png");
    }

    @PostMapping("/uploadFileInSpecFolder/file/path/{bucket}")
    public String uploadFileInSpecificFolder(@RequestParam MultipartFile file,@RequestParam String folderPath, @PathVariable String bucket) {
        return minIOService.uploadFileInSpecificFolder(file,folderPath, bucket);
    }


    @GetMapping("/download/{objectName}")
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@PathVariable String objectName) {
        try {
            InputStream inputStream = minIOService.downloadFile(objectName);

            byte[] content = IOUtils.toByteArray(inputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            // Set the Content-Disposition header to indicate attachment
            // String contentDisposition = "attachment; filename=\"" + objectName + "\"";
            String contentDisposition = "attachment; filename=\"" + objectName + "\"";

            headers.set(HttpHeaders.CONTENT_DISPOSITION, contentDisposition);

            Resource resource = new ByteArrayResource(content);

            return ResponseEntity.ok()
            .headers(headers)
            .contentLength(content.length)
            .body(resource);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeyException | MinioException e) {
             e.printStackTrace();
             // You might want to send an error response here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download/{objectName}/{fileName}")
    @ResponseBody
    public ResponseEntity<Resource> downloadFileInsideFolder(@PathVariable String objectName ,@PathVariable String fileName) {
        try {
            InputStream inputStream = minIOService.downloadFileInsideFolder(objectName,fileName);

            byte[] content = IOUtils.toByteArray(inputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            // Set the Content-Disposition header to indicate attachment
            // String contentDisposition = "attachment; filename=\"" + objectName + "\"";
            String contentDisposition = "attachment; filename=\"" + fileName + "\"";

            headers.set(HttpHeaders.CONTENT_DISPOSITION, contentDisposition);

            Resource resource = new ByteArrayResource(content);

            return ResponseEntity.ok()
            .headers(headers)
            .contentLength(content.length)
            .body(resource);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeyException | MinioException e) {
            e.printStackTrace();
            // You might want to send an error response here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
