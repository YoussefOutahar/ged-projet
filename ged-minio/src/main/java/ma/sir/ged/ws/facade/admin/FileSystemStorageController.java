package ma.sir.ged.ws.facade.admin;

import ma.sir.ged.dto.FichierDTO;
import ma.sir.ged.service.facade.admin.FileSystemStorageService;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/file-system-storage")
public class FileSystemStorageController {

//    @Autowired
//    private FileSystemStorageService fileSystemStorageService;
//
//    @PostMapping("/directory")
//    public String createDirectory(@RequestParam("path") String path) {
//        return fileSystemStorageService.createDirectory(path);
//    }
//
//    @GetMapping("/directory-exists")
//    public Boolean directoryExists(@RequestParam("path") String path) {
//        return fileSystemStorageService.directoryExists(path);
//    }
//
//    //    ==============================================================================================================
//
//    @PostMapping("/upload")
//    public FichierDTO upload(@RequestParam("file") MultipartFile file) {
//        return fileSystemStorageService.upload(file);
//    }
//
//    @PostMapping("/uploadWithPath")
//    public FichierDTO uploadWithPath(@RequestParam("file") MultipartFile file, @RequestParam("path") String path) {
//        return fileSystemStorageService.upload(file, path);
//    }
//
//    //    ==============================================================================================================
//
//    @GetMapping("/findAllDocuments")
//    public List<String> findAllDocuments() {
//        return fileSystemStorageService.findAllDocuments();
//    }
//
//    @GetMapping("/findAllDocumentsByPath")
//    public List<String> findAllDocuments(@RequestParam String path) {
//        return fileSystemStorageService.findAllDocuments(path);
//    }
//
//    @GetMapping("/findAllDocumentsDto")
//    public List<FichierDTO> findAllDocumentsDto(@RequestParam String path) {
//        return fileSystemStorageService.findAllDocumentsDTO(path);
//    }
//
//    //    ==============================================================================================================
//
//    @GetMapping("/download/{fichierId}/{versionId}")
//    public byte[] downloadFileById(@PathVariable Long fichierId, @PathVariable String versionId) {
//        return fileSystemStorageService.downloadFileById(fichierId, versionId);
//    }
//
//    public FileSystemStorageController(FileSystemStorageService fileSystemStorageService) {
//        this.fileSystemStorageService = fileSystemStorageService;
//    }
//
//    @GetMapping("/preview/{fichierId}/{versionId}")
//    public String previewFileById(@PathVariable Long fichierId, @PathVariable String versionId) {
//        String preview = fileSystemStorageService.previewFileById(fichierId, versionId);
//        return preview;
//    }
//
//    @GetMapping("/download/zip")
//    public byte[] downloadAllDocumentsAsZip() {
//        byte[] zip = fileSystemStorageService.downloadAllDocumentsAsZip();
//        return zip;
//    }
//
//    @GetMapping("/download/zip/{path}")
//    public byte[] downloadAllDocumentsAsZip(@PathVariable String path) {
//        byte[] zip = fileSystemStorageService.downloadAllDocumentsAsZip(path);
//        return zip;
//    }
//
//    @GetMapping("/download/share/{id}")
//    public Pair<byte[], String> downloadFileByShareId(@PathVariable String id) {
//        Pair<byte[], String> file = fileSystemStorageService.downloadFileBySahreId(id);
//        return file;
//    }
//
//    @PostMapping("/share/{fichierId}")
//    public String generateShareLink(@PathVariable Long fichierId, @RequestParam Integer days, @RequestParam Integer hours, @RequestParam Integer minutes, @RequestParam Integer seconds) {
//        String link = fileSystemStorageService.generateShareLink(fichierId, days, hours, minutes, seconds);
//        return link;
//    }
//
//    @PostMapping("/restore/{fichierId}/{versionId}")
//    public FichierDTO restoreToSpecificVersion(@PathVariable Long fichierId, @PathVariable String versionId) {
//        FichierDTO fichierDTO = fileSystemStorageService.restoreToSpecificVersion(fichierId, versionId);
//        return fichierDTO;
//    }
//
//    @PostMapping("/move/{objectid}")
//    public FichierDTO moveFile(@PathVariable Long objectid, @RequestParam String sourcePath, @RequestParam String destinationPath) {
//        FichierDTO fichierDTO = fileSystemStorageService.moveFile(objectid, sourcePath, destinationPath);
//        return fichierDTO;
//    }

}
