package ma.sir.ged.service.impl.admin;

import io.minio.*;
import io.minio.messages.*;
import ma.sir.ged.Utils.TimeLogger;
import ma.sir.ged.config.MinioConfig;
import ma.sir.ged.dto.FichierDTO;
import ma.sir.ged.exceptions.BucketNotFoundException;
import ma.sir.ged.exceptions.FichierNotFoundException;
import ma.sir.ged.exceptions.MinioException;
import ma.sir.ged.model.Fichier;
import ma.sir.ged.model.FichierShare;
import ma.sir.ged.repositories.FichierShareRepository;
import ma.sir.ged.service.facade.admin.MinIOService;
import ma.sir.ged.ws.facade.admin.DefaultBucketController;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static java.util.Objects.nonNull;

@Service("minioServiceImpl")
public class MinIOServiceImpl implements MinIOService {

    @Value("${minio.config.protocol}")
    private String protocol;
    @Value("${minio.config.domain}")
    private String domain;

    @Autowired
    private TimeLogger timeLogger;

    @Autowired
    private MinioClient minioClient;
    @Autowired
    private FichierService fichierService;
    @Autowired
    private FichierShareRepository fichierShareRepository;

    @Override
    public Boolean bucketExists(String name) {
        try {
            return minioClient.bucketExists(BucketExistsArgs.builder().bucket(name).build());
        } catch (Exception e) {
            throw new MinioException("Error while checking if the bucket "+name+" exists, error : "+e.getMessage());
        }
    }

    @Override
    public int saveBucket(String bucket) {
        if (bucketExists(bucket))
            return 0;
        try {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            VersioningConfiguration config = new VersioningConfiguration(VersioningConfiguration.Status.ENABLED, false);
            minioClient.setBucketVersioning(SetBucketVersioningArgs.builder().bucket(bucket).config(config).build());
            return 1;
        } catch (Exception e) {
            throw new MinioException("Error while creating the bucket "+bucket+" , error : "+e.getMessage());
        }

    }

    @Override
    public String createDirectory(String bucket, String path) {
        if (Boolean.FALSE.equals(bucketExists(bucket))){
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        }
        try {

            ObjectWriteResponse objectWriteResponse = minioClient.putObject(
                    PutObjectArgs.builder().bucket(bucket).object(path+"/created").stream(
                            new ByteArrayInputStream(new byte[]{}), 0, -1).build()
            );
            return fichierService.extractFilePath(objectWriteResponse.object());
        } catch (Exception e) {
            throw new MinioException("Error while creating a new directory in the bucket : "+bucket+", for the path : "+ path+" , error : "+e.getMessage());
        }
    }


    @Override
    public FichierDTO upload(MultipartFile file) {
        return this.upload(file, MinioConfig.getBucketName(), null);
    }
    @Override
    public FichierDTO upload(MultipartFile file, String bucket){
        return this.uploadToPath(file, bucket, null, null);
    }
    public FichierDTO upload(MultipartFile file, String bucket, String path){
        return this.uploadToPath(file, bucket, path, null);
    }
    //--------------------------------------
    @Override
    public FichierDTO upload(MultipartFile file, String bucket, String superior, String entity) {
        Calendar now = Calendar.getInstance();
        String path= superior+"/"+entity+"/"+now.get(Calendar.YEAR)+"/"+now.get(Calendar.MONTH)+"/"+now.get(Calendar.DAY_OF_MONTH);
        return this.upload(file, bucket, path);
    }

    @Override
    public FichierDTO upload(MultipartFile file, String bucket, String superior, String entity, String fileName) {
        Calendar now = Calendar.getInstance();
        String filename = nonNull(fileName) ? fileName : file.getOriginalFilename();
        String path= superior+"/"+entity+"/"+now.get(Calendar.YEAR)+"/"+(now.get(Calendar.MONTH)+1)+"/"+now.get(Calendar.DAY_OF_MONTH);
        return this.uploadWithPath(file, bucket, path, fileName);
    }

    @Override
    public FichierDTO uploadWithPath(MultipartFile file, String bucket, String path, String fileName) {
        return this.uploadToPath(file, bucket, path, fileName);
    }


    @Override
    public List<String> findAllDocuments(String bucket) {
        List<String> documents = new ArrayList<>();
        if (Boolean.FALSE.equals(bucketExists(bucket))){
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        }
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder().bucket(bucket).recursive(true).build());
            for (Result<Item> result : results) {
                Item item = result.get();
                documents.add(item.objectName());
            }
        } catch (Exception e) {
            throw new MinioException("Error while fetching files form the bucket "+bucket+", error : "+e.getMessage());
        }
        return documents;
    }

    @Override
    public List<FichierDTO> findAllDocumentsDTO(String bucket, String path) {
        List<FichierDTO> documents = new ArrayList<>();
        if (Boolean.FALSE.equals( bucketExists(bucket)))
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder().bucket(bucket).recursive(true).build());
            for (Result<Item> result : results) {
                Item item = result.get();
                documents.add(buildFichierDTOFromItem(bucket, item));
            }
        } catch (Exception e) {
            throw new MinioException("Error while fetching files form the bucket "+bucket+", error : "+e.getMessage());
        }
        return documents;
    }

    @Override
    public List<String> findAllDocuments(String bucket, String path) {
        List<String> documents = new ArrayList<>();
        if (Boolean.FALSE.equals( bucketExists(bucket)))
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder().bucket(bucket).prefix(path).build());
            for (Result<Item> result : results) {
                Item item = result.get();
                documents.add(item.objectName());
            }
        } catch (Exception e) {
            throw new MinioException("Error while fetching files form the bucket "+bucket+", error : "+e.getMessage());
        }
        return documents;
    }


    @Override
    public byte[] downloadAllDocumentsAsZip(String bucket) {
        if (Boolean.FALSE.equals(bucketExists(bucket))){
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        }
        try {
            List<String> documentNames = findAllDocuments(bucket);
            // Create a byte array output stream to hold the zip data
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zipOut = new ZipOutputStream(baos);
            // Buffer for reading data
            byte[] buffer = new byte[8192];

            // Loop through each document and add it to the zip
            for (String documentName : documentNames) {
                // Get the document object from MinIO
                GetObjectResponse response = minioClient.getObject(
                        GetObjectArgs.builder()
                                .bucket(bucket)
                                .object(documentName)
                                .build()
                );
                // Get the input stream containing the document data
                InputStream documentStream = response;
                // Create a new entry in the zip for the document
                ZipEntry zipEntry = new ZipEntry(documentName);
                zipOut.putNextEntry(zipEntry);
                // Write the document data to the zip
                int bytesRead;
                while ((bytesRead = documentStream.read(buffer)) != -1) {
                    zipOut.write(buffer, 0, bytesRead);
                }
                // Close the entry for the document
                zipOut.closeEntry();
                // Close the input stream for the current document
                documentStream.close();
            }

            // Close the zip output stream
            zipOut.close();
            // Return the zip data as a byte array
            return baos.toByteArray();
            } catch (Exception e) {
                throw new MinioException("Error while preparing all files in the bucket "+bucket+" to be downloaded, error : "+e.getMessage());
            }

    }
    @Override
    public byte[] downloadAllDocumentsAsZip(String bucket, String path) {
        if (Boolean.FALSE.equals(bucketExists(bucket))){
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        }
        try {
            List<String> documentNames = findAllDocuments(bucket, path);
            // Create a byte array output stream to hold the zip data
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zipOut = new ZipOutputStream(baos);
            // Buffer for reading data
            byte[] buffer = new byte[8192];

            // Loop through each document and add it to the zip
            for (String documentName : documentNames) {
                // Get the document object from MinIO
                GetObjectResponse response = minioClient.getObject(
                        GetObjectArgs.builder()
                                .bucket(bucket)
                                .object(documentName)
                                .build()
                );
                // Get the input stream containing the document data
                InputStream documentStream = response;
                // Create a new entry in the zip for the document
                ZipEntry zipEntry = new ZipEntry(documentName);
                zipOut.putNextEntry(zipEntry);
                // Write the document data to the zip
                int bytesRead;
                while ((bytesRead = documentStream.read(buffer)) != -1) {
                    zipOut.write(buffer, 0, bytesRead);
                }
                // Close the entry for the document
                zipOut.closeEntry();
                // Close the input stream for the current document
                documentStream.close();
            }

            // Close the zip output stream
            zipOut.close();
            // Return the zip data as a byte array
            return baos.toByteArray();
            } catch (Exception e) {
                throw new MinioException("Error while preparing all files in the bucket "+bucket+" with the path "+path+" to be downloaded, error : "+e.getMessage());
            }

    }

    @Override
    public Pair<byte[], String> downloadFileBySahreId(String id) {
        System.out.println("look for id fichier share---------"+id);
        FichierShare fichierShare = fichierShareRepository.findById(id).orElseThrow(
                () -> new FichierNotFoundException("No File has been shared with this token " + id));
        if (fichierShare.getExpiration().after(new Date()) && nonNull(fichierShare.getFichier())) {
            System.out.println("look objet ---------"+fichierShare);
            return Pair.of(downloadFileById(fichierShare.getFichier().getId(), ""), fichierShare.getFichier().getObjectName());
        }
        return Pair.of(new byte[0], "fileNotFound");
    }


    @Override
    public String generateShareLink(Long fichierId, Integer days, Integer hours, Integer minutes, Integer seconds) {
        Fichier fichier = fichierService.findFichierById(fichierId)
                .orElseThrow(() -> new FichierNotFoundException("No fichier found having the id "+ fichierId));
        Long duration = (long) (seconds + minutes*60 + hours*3600 + days*3600*24);
        try {
            FichierShare fichierShare = new FichierShare();
            fichierShare.setId(UUID.randomUUID().toString());
            fichierShare.setFichier(fichier);
            fichierShare.setDuration(duration);

            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.SECOND, duration.intValue());
            Date expirationDate = calendar.getTime();
            fichierShare.setExpiration(expirationDate);

            fichierShareRepository.save(fichierShare);
            return buildShareUrl(fichierShare);
        } catch (Exception e) {
            throw new MinioException("Minio Error: Can not generate a share link to the file (id = " + fichierId + "), error: " + e.getMessage());
        }
    }

    private String buildShareUrl(FichierShare share){
        return protocol+"://"+domain+ DefaultBucketController.SHARED_LINK_EP+"?token="+share.getId();
    }
    @Override
    public FichierDTO restoreToSpecificVersion(Long fichierId, String versionId) {
        Fichier fichier = fichierService.findFichierById(fichierId)
                .orElseThrow(() -> new FichierNotFoundException("No fichier found having the id "+ fichierId));
        try{
            // Download the wanted version
            GetObjectResponse objectResponse = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(fichier.getBucket())
                    .object(fichier.getFullPath())
                    .versionId(versionId)
                    .build());
            InputStream inputStream = objectResponse;
            // upload the wanted version
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(fichier.getBucket())
                    .object(fichier.getFullPath())
                    .stream(inputStream, inputStream.available(), -1)
                    .build());
            List<String> allVersionsAbove = fichierService.getAllVersionsAbove(fichier, versionId);
            Fichier finalFichier = fichier;
            allVersionsAbove.forEach(vr -> deleteObjectByVersionId(finalFichier, vr));
            fichier = fichierService.deleteVersionsAbove(fichier, versionId );
            return fichierService.toDTO(fichierService.save(fichier));
        }catch (Exception e){
            throw new MinioException("Minio Error : while restoring the file ( id = "+ fichierId+" ) to the version :  "+ versionId+", error : "+ e.getMessage() ) ;
        }
    }

    public byte[] downloadFileById(Long fichierId, String versionId) {
        System.out.println("look for id---------"+fichierId);

        Fichier fichier = fichierService.findFichierById(fichierId).orElseThrow(() -> new RuntimeException("No file found with the id " + fichierId));
        try {
            GetObjectResponse response = minioClient.getObject(
                            GetObjectArgs.builder()
                            .bucket(fichier.getBucket())
                            .object(fichier.getFullPath())
                            //.versionId( (Objects.nonNull(versionId) && StringUtil.isNotEmpty(versionId)) ? versionId : fichier.getLatestVersion().getVersionId())
                            .build());
            InputStream inputStream = response;
            byte[] fileBytes = readAllBytes(inputStream);
            return fileBytes;
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file from MinIO: " + e.getMessage(), e);
        }
    }
    // -----------------this where we can view the document by refrence_ged_id and versionId service

    @Override
    public String previewFileById(Long fichierId, String versionId) {
        Fichier fichier = fichierService.findFichierById(fichierId).orElseThrow(() -> new RuntimeException("No file found with the id " + fichierId));
        try {
            GetObjectResponse response = minioClient.getObject(
                            GetObjectArgs.builder()
                            .bucket(fichier.getBucket())
                            .object(fichier.getFullPath())
                            //.versionId( (Objects.nonNull(versionId) && StringUtil.isNotEmpty(versionId)) ? versionId : fichier.getLatestVersion().getVersionId())
                            .build());
            InputStream inputStream = response;
            byte[] fileBytes = readAllBytes(inputStream);
            return Base64.getEncoder().encodeToString(fileBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file from MinIO: " + e.getMessage(), e);
        }
    }

    public byte[] readAllBytes(InputStream inputStream) throws IOException {
        try (ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            int nRead;
            byte[] data = new byte[16384]; // You can adjust the buffer size as needed

            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }

            return buffer.toByteArray();
        }
    }


    public void deleteObjectByVersionId(final Fichier fichier, String versionId){
        RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder()
                .bucket(fichier.getBucket())
                .object(fichier.getFullPath())
                .versionId(versionId)
                .build();
        try {
            minioClient.removeObject(removeObjectArgs);
        }catch (Exception e){
            throw new MinioException("Minio Error : whiling the deleting the file ( "+ fichier.getFullPath()+" ), error : "+e.getMessage());
        }
    }




    private FichierDTO uploadToPath(MultipartFile file, String bucket, String path, String fileName) {
        if(Boolean.FALSE.equals(bucketExists(bucket))){
            throw new BucketNotFoundException("the bucket "+bucket+" does not exist");
        }

        timeLogger.startLogging("Uploading file to MinIO bucket: " + bucket + ", path: " + path);

        String filename = nonNull(fileName) ? fileName : file.getOriginalFilename();
        try {
            ObjectWriteResponse response = minioClient.putObject(
                    PutObjectArgs.builder().bucket(bucket)
                            .object(path+"/"+filename)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());

            timeLogger.endLogging("File uploaded successfully to minio bucket");

            return fichierService.saveFichier(bucket ,response.object(), response.versionId());
        } catch (Exception e) {
            e.printStackTrace();
            throw new MinioException("Minio Error : while uploading the file to the bucket "+bucket+", into the path : "+path);
        }
    }

    private FichierDTO buildFichierDTOFromItem(String bucket, Item item){
        FichierDTO dto = new FichierDTO();
        dto.setBucket(bucket);
        dto.setName(fichierService.extractFileName(item.objectName()));
        dto.setPath(fichierService.extractFilePath(item.objectName()));
        return dto;
    }
    @Override
    public FichierDTO  moveFile(Long id, String sourceBucket, String destinationBucket)  {
        Fichier fichier = fichierService.findFichierById(id).orElseThrow(() -> new RuntimeException("No file found with this id " + id));

        try {
            // Copy the object from the source bucket to the destination bucket
            ObjectWriteResponse response= minioClient.copyObject(
                    CopyObjectArgs.builder()
                            .source(CopySource.builder().bucket(sourceBucket).object(fichier.getFullPath()).build())
                            .bucket(destinationBucket)
                            .object(fichier.getFullPath())
                            .build());
            // Remove the object from the source bucket
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(sourceBucket)
                            .object(fichier.getFullPath())
                            .build());
            FichierDTO fichierDTO =   fichierService.saveFichier(destinationBucket ,response.object(), response.versionId());

            return fichierDTO;

        } catch (Exception e) {
        e.printStackTrace();
            throw new MinioException("Error while moving the file from " + sourceBucket + " to " + destinationBucket + " : " + e.getMessage());
        }
    }

    @Override
    public FichierDTO updateFile(Long fichierId, MultipartFile file) {
        try {
            Fichier fichier = fichierService.findFichierById(fichierId)
                    .orElseThrow(() -> new RuntimeException("No file found with this id " + fichierId));

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(fichier.getBucket())
                            .object(fichier.getFullPath())
                            .build());

            String newFilePath = fichier.getPath() + "/" + file.getOriginalFilename();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(fichier.getBucket())
                            .object(newFilePath)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());

            fichier.setFullPath(newFilePath);
            fichier.setObjectName(file.getOriginalFilename());

            Fichier updatedFichier = fichierService.update(fichier);

            return fichierService.toDTO(updatedFichier);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean deleteFile(Long fichierId) {
        return false;
    }
}
