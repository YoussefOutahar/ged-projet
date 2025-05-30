package ma.sir.ged.service.impl.admin;

import ma.sir.ged.dto.FichierDTO;
import ma.sir.ged.exceptions.FichierNotFoundException;
import ma.sir.ged.model.Fichier;
import ma.sir.ged.model.FichierShare;
import ma.sir.ged.repositories.FichierShareRepository;
import ma.sir.ged.service.facade.admin.FileCompressorService;
import ma.sir.ged.service.facade.admin.MinIOService;
import ma.sir.ged.ws.facade.admin.DefaultBucketController;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static java.util.Objects.nonNull;

@Service("fichierServiceImpl")
public class FileSystemStorageServiceImpl implements MinIOService {

    @Value("${minio.config.protocol}")
    private String protocol;

    @Value("${minio.config.domain}")
    private String domain;

    @Value("${file.storage.location}")
    private String defaultLocation;

    @Autowired
    private FichierService fichierService;

    @Autowired
    private FichierShareRepository fichierShareRepository;

    @Autowired
    private FileCompressorService fileCompressorService;

    private boolean compressionEnabled = false;

    public void setCompressionEnabled(boolean compressionEnabled) {
        this.compressionEnabled = compressionEnabled;
    }

    private static final Logger log = LoggerFactory.getLogger(FileSystemStorageServiceImpl.class);

    @Override
    public Boolean bucketExists(String bucket) {
        try {
            Path dirPath = Paths.get(bucket);
            return Files.exists(dirPath);
        } catch (Exception e) {
            log.error("Error checking bucket: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public int saveBucket(String bucket) {
        try {
            Path dirPath = Paths.get(bucket);
            return Files.createDirectories(dirPath) != null ? 1 : 0;
        } catch (Exception e) {
            log.error("Error creating bucket: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public String createDirectory(String bucket, String path) {
        try {
            Path dirPath = Paths.get(bucket, path);
            Files.createDirectories(dirPath);
            return dirPath.toString();
        } catch (Exception e) {
            log.error("Error creating directory: {}", e.getMessage());
            return null;
        }
    }

    // ================================================================================================================
    // ================================================================================================================
    // ================================================================================================================

    @Override
    public FichierDTO upload(MultipartFile file) {
        try {
            return uploadWithPath(file, defaultLocation, "", file.getOriginalFilename());
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public FichierDTO upload(MultipartFile file, String path) {
        try {
            return uploadWithPath(file, defaultLocation, path, file.getOriginalFilename());
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public FichierDTO upload(MultipartFile file, String bucket, String path) {
        try {
            bucket = getBucketPath(bucket);
            Path dirPath = Paths.get(path);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filePath = dirPath.resolve(file.getOriginalFilename()).toString();

            if (compressionEnabled) {
                filePath += ".gz";
                fileCompressorService.compressFile(file.getInputStream(), filePath);
            } else {
                Files.copy(file.getInputStream(), Paths.get(filePath));
            }

            return fichierService.saveFichier(bucket, filePath, null);
        } catch (Exception e) {
            System.err.println("Error uploading file: " + e.getMessage());
            return null;
        }
    }

    @Override
    public FichierDTO upload(MultipartFile file, String bucket, String superior, String entity) {
        try {
            LocalDate currentDate = LocalDate.now();
            int month = currentDate.getMonthValue();
            int day = currentDate.getDayOfMonth();
            int year = currentDate.getYear();

            bucket = getBucketPath(bucket);
            Path dirPath = Paths.get(bucket, superior, entity, String.valueOf(year), String.valueOf(month), String.valueOf(day));

            return uploadWithPath(file, bucket, dirPath.toString(), file.getOriginalFilename());
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public FichierDTO upload(MultipartFile file, String bucket, String superior, String entity, String fileName) {
        try {
            LocalDate currentDate = LocalDate.now();
            int month = currentDate.getMonthValue();
            int day = currentDate.getDayOfMonth();
            int year = currentDate.getYear();

            bucket = getBucketPath(bucket);
            Path dirPath = Paths.get(bucket, superior, entity, String.valueOf(year), String.valueOf(month), String.valueOf(day));

            return uploadWithPath(file, bucket, dirPath.toString(), fileName);
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public FichierDTO uploadWithPath(MultipartFile file, String bucket, String path, String fileName) {
        try {
            Path dirPath = Paths.get(path);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filePath = dirPath.resolve(fileName).toString();

            if (Files.exists(Paths.get(filePath))) {
                int lastIndexOfDot = fileName.lastIndexOf('.');
                if (lastIndexOfDot != -1) {
                    String nameWithoutExtension = fileName.substring(0, lastIndexOfDot);
                    String extension = fileName.substring(lastIndexOfDot);
                    fileName = nameWithoutExtension + "-" + UUID.randomUUID() + extension;
                } else {
                    fileName = fileName + "-" + UUID.randomUUID();
                }
                filePath = dirPath.resolve(fileName).toString();
            }

            if (compressionEnabled) {
                filePath += ".gz";
                fileCompressorService.compressFile(file.getInputStream(), filePath);
            } else {
                Files.copy(file.getInputStream(), Paths.get(filePath));
            }
            return fichierService.saveFichier(bucket, filePath, null);
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            return null;
        }
    }

    // ================================================================================================================
    // ================================================================================================================
    // ================================================================================================================

    @Override
    public List<String> findAllDocuments(String path) {
        try {
            Path dirPath = Paths.get(defaultLocation, path);
            if (!Files.exists(dirPath)) {
                System.err.println("Directory does not exist: " + dirPath);
                return new ArrayList<>();
            }

            List<String> filePaths;
            try (Stream<Path> paths = Files.walk(dirPath)) {
                filePaths = paths
                        .filter(Files::isRegularFile)
                        .map(Path::toString)
                        .collect(Collectors.toList());
            }
            return filePaths;
        } catch (IOException e) {
            log.error("Error finding documents: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<String> findAllDocuments(String bucket, String path) {
        try {
            bucket = getBucketPath(bucket);
            List<String> filePaths;
            try (Stream<Path> paths = Files.walk(Paths.get(bucket))) {
                filePaths = paths
                        .filter(Files::isRegularFile)
                        .map(Path::toString)
                        .collect(Collectors.toList());
            }
            return filePaths;
        } catch (IOException e) {
            log.error("Error finding documents: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<FichierDTO> findAllDocumentsDTO(String bucket, String path) {
        try {
            bucket = getBucketPath(bucket);
            Path dirPath = Paths.get(bucket, path);
            if (!Files.exists(dirPath)) {
                log.error("Directory does not exist: {}", dirPath);
                return new ArrayList<>();
            }

            List<FichierDTO> fileDtos;
            try (Stream<Path> paths = Files.walk(dirPath)) {
                String finalBucket = bucket;
                fileDtos = paths
                        .filter(Files::isRegularFile)
                        .map(filePath -> {
                            FichierDTO dto = new FichierDTO();
                            dto.setBucket(finalBucket);
                            dto.setName(filePath.getFileName().toString());
                            dto.setPath(filePath.toString());
                            dto.setVersions(new ArrayList<>());
                            return dto;
                        })
                        .collect(Collectors.toList());
            }
            return fileDtos;
        } catch (IOException e) {
            log.error("Error finding documents: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // ================================================================================================================
    // ================================================================================================================
    // ================================================================================================================

    @Override
    public byte[] downloadFileById(Long fichierId, String versionId) {
        try {
            Fichier fichier = fichierService.findFichierById(fichierId).orElse(null);
            if (fichier == null) {
                log.error("File not found: {}", fichierId);
                return null;
            }

            String compressedFilePath = fichier.getFullPath();

            Path filePath = Paths.get(compressedFilePath);
            if (!Files.exists(filePath)) {
                log.error("File does not exist: {}", compressedFilePath);
                return null;
            }

            if (compressionEnabled) {
                ByteArrayOutputStream destinationStream = new ByteArrayOutputStream();
                fileCompressorService.decompressFile(Files.newInputStream(filePath), destinationStream);
                return destinationStream.toByteArray();
            } else {
                return Files.readAllBytes(filePath);
            }
        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String previewFileById(Long fichierId, String versionId) {
        try {
            Fichier fichier = fichierService.findFichierById(fichierId).orElse(null);
            if (fichier == null) {
                log.error("File not found: {}", fichierId);
                return null;
            }

            Path filePath = Paths.get(fichier.getFullPath());
            if (!Files.exists(filePath)) {
                log.error("File does not exist: {}", filePath);
                return null;
            }

            byte[] fileBytes = Files.readAllBytes(filePath);
            return Base64.getEncoder().encodeToString(fileBytes);
        } catch (Exception e) {
            log.error("Error previewing file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public byte[] downloadAllDocumentsAsZip(String path) {
        try {
            Path dirPath = Paths.get(defaultLocation, path);
            return createZipFromDirectory(dirPath);
        } catch (Exception e) {
            log.error("Error creating zip: {}", e.getMessage());
            return new byte[0];
        }
    }

    @Override
    public byte[] downloadAllDocumentsAsZip(String bucket, String path) {
        try {
            bucket = getBucketPath(bucket);
            Path dirPath = Paths.get(bucket, path);
            return createZipFromDirectory(dirPath);
        } catch (Exception e) {
            log.error("Error creating zip: {}", e.getMessage());
            return new byte[0];
        }
    }

    @Override
    public Pair<byte[], String> downloadFileBySahreId(String id) {
        FichierShare fichierShare = fichierShareRepository.findById(id).orElseThrow(
                () -> new FichierNotFoundException("No File has been shared with this token " + id));
        if (fichierShare.getExpiration().after(new Date()) && nonNull(fichierShare.getFichier())) {
            try {
                byte[] fileData = Files.readAllBytes(Paths.get(fichierShare.getFichier().getFullPath()));
                return Pair.of(fileData, fichierShare.getFichier().getObjectName());
            } catch (IOException e) {
                return Pair.of(new byte[0], "fileNotFound");
            }
        }
        return Pair.of(new byte[0], "fileNotFound");
    }

    @Override
    public String generateShareLink(Long fichierId, Integer days, Integer hours, Integer minutes, Integer seconds) {
        Fichier fichier = fichierService.findFichierById(fichierId)
                .orElseThrow(() -> new FichierNotFoundException("No file found having the id "+ fichierId));
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
            log.error("Error generating share link: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public FichierDTO restoreToSpecificVersion(Long fichierId, String versionId) {
        return null;
    }

    @Override
    public FichierDTO moveFile(Long objectid, String sourcePath, String destinationPath) {
        try {
            Fichier fichier = fichierService.findFichierById(objectid).orElseThrow(() -> new RuntimeException("No file found with this id " + objectid));
            Path source = Paths.get(sourcePath);
            Path destination = Paths.get(defaultLocation, destinationPath);

            if (!Files.exists(source)) {
                System.err.println("Source file does not exist: " + source);
                return null;
            }

            if (!Files.exists(destination.getParent())) {
                Files.createDirectories(destination.getParent());
            }

            Files.move(source, destination, StandardCopyOption.REPLACE_EXISTING);

            fichier.setFullPath(destination.toString());
            fichier = fichierService.save(fichier);

            return fichierService.toDTO(fichier);
        } catch (IOException e) {
            log.error("Error moving file: {}", e.getMessage());
            return null;
        }
    }

    // ================================================================================================================
    // ================================================================================================================
    // ================================================================================================================

    public String getBucketPath(String bucket) {
        Path bucketPath = Paths.get(bucket);
        if (Files.exists(bucketPath)) {
            return bucket;
        } else {
            return defaultLocation;
        }
    }

    private String buildShareUrl(FichierShare share){
        return protocol+"://"+domain+ DefaultBucketController.SHARED_LINK_EP+"?token="+share.getId();
    }

    private byte[] createZipFromDirectory(Path dirPath) throws IOException {
        if (!Files.exists(dirPath)) {
            log.error("Directory does not exist: {}", dirPath);
            return new byte[0];
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            try (Stream<Path> paths = Files.walk(dirPath)) {
                paths.filter(path -> !Files.isDirectory(path))
                        .forEach(path -> {
                            ZipEntry zipEntry = new ZipEntry(dirPath.relativize(path).toString());
                            try {
                                zos.putNextEntry(zipEntry);
                                Files.copy(path, zos);
                                zos.closeEntry();
                            } catch (IOException e) {
                                log.error("Error creating zip entry: {}", e.getMessage());
                            }
                        });
            }
        } catch (IOException e) {
            log.error("Error walking the file tree: {}", e.getMessage());
        }

        return baos.toByteArray();
    }

    @Override
    public FichierDTO updateFile(Long fichierId, MultipartFile file) {
        try {
            Fichier fichier = fichierService.findFichierById(fichierId).orElseThrow(() -> new RuntimeException("No file found with this id " + fichierId));

            Path oldFilePath = Paths.get(fichier.getFullPath());
            Files.deleteIfExists(oldFilePath);

            String newFilePath = oldFilePath.getParent().resolve(Objects.requireNonNull(fichier.getObjectName())).toString();

            Files.copy(file.getInputStream(), Paths.get(newFilePath), StandardCopyOption.REPLACE_EXISTING);

            fichier.setFullPath(newFilePath);
            fichier.setObjectName(file.getOriginalFilename());
            fichierService.update(fichier);

            return fichierService.toDTO(fichier);
        } catch (IOException e) {
            log.error("Error updating file: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public boolean deleteFile(Long fichierId) {
        try {
            Fichier fichier = fichierService.findFichierById(fichierId).orElseThrow(() -> new RuntimeException("No file found with this id " + fichierId));
            Files.delete(Paths.get(fichier.getFullPath()));
            fichierService.delete(fichierId);
            return true;
        } catch (IOException e) {
            log.error("Error deleting file: {}", e.getMessage());
            return false;
        }
    }
}
