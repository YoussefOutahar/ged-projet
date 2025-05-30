package ma.sir.ged.service.facade.open;

import io.minio.errors.MinioException;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface MinIOService {

    int bucketExists(String bucket);

    int upload(MultipartFile file, String bucket);

    int saveBucket(String bucket);

    List<String> findAllDocuments(String bucket);

    byte[] downloadAllDocumentsAsZip(String bucket);

    byte[] downloadDocumentsAsZip(String bucket, List<String> filenames);

    void uploadDirectory(String directoryPath, String bucket) throws IOException, NoSuchAlgorithmException, InvalidKeyException, MinioException;

    int deleteFileFromBucket(String file, String bucket);

    // Create folder in bucket
    int createFolderInBucketAndCheckIfExist(String folderPath, String bucketName);

    // Create folder in bucket
    int createFolderInBucket(String folderName, String bucketName);

    boolean checkFolderExistsInBucket(String folderName, String bucketName);

    String getUrlAccess(String bucket, String path);

    String uploadFileInSpecificFolder(MultipartFile file, String folderPath,String bucketName );

    InputStream downloadFile(String objectName) throws IOException, NoSuchAlgorithmException, InvalidKeyException, MinioException;

    InputStream downloadFileInsideFolder(String objectName,String fileName) throws IOException, NoSuchAlgorithmException, InvalidKeyException, MinioException ;


        }
