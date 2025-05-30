package ma.sir.ged.service.facade.admin;

import ma.sir.ged.dto.FichierDTO;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileSystemStorageService {
    String createDirectory(String path);
    Boolean directoryExists(String path);

    FichierDTO upload(MultipartFile file);
    FichierDTO upload(MultipartFile file, String path);

    List<String> findAllDocuments();
    List<String> findAllDocuments(String path);
    List<FichierDTO> findAllDocumentsDTO(String path);


    byte[] downloadFileById(Long fichierId, String versionId);
    String previewFileById(Long fichierId, String versionId);
    byte[] downloadAllDocumentsAsZip();
    byte[] downloadAllDocumentsAsZip(String path);
    Pair<byte[], String> downloadFileBySahreId(String id);


    String generateShareLink(Long fichierId, Integer days, Integer hours, Integer minutes, Integer seconds);
    FichierDTO restoreToSpecificVersion(Long fichierId, String versionId);
    FichierDTO  moveFile(Long objectid,String sourcePath, String destinationPath);
}
