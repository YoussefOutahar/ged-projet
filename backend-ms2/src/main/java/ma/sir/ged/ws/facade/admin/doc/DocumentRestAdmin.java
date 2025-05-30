package ma.sir.ged.ws.facade.admin.doc;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.WebSocket.UseCases.NotificationDocument;
import ma.sir.ged.WebSocket.UseCases.NotificationDocumentPartage;
import ma.sir.ged.bean.core.doc.ArchiveFinal;
import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.doc.Echantillon;
import ma.sir.ged.bean.history.DocumentHistory;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.dao.specification.core.ProductionGlobal;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.dashbord.IDashboardService;
import ma.sir.ged.service.facade.admin.doc.AuditAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentIndexElementAdminService;
import ma.sir.ged.service.facade.admin.search.SearchService;
import ma.sir.ged.service.facade.bo.CourrielService;
import ma.sir.ged.service.impl.admin.doc.DocumentEmptyPagesProcessor;
import ma.sir.ged.service.impl.admin.doc.IndexationService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.DocumentIndexElementConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EchantillonDto;
import ma.sir.ged.ws.dto.EchantillonRequestDto;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.dto.FileTempDto;
import ma.sir.ged.zynerator.exception.CustomValidationException;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import ma.sir.ged.zynerator.util.PaginatedList;
import ma.sir.ged.zynerator.validator.CustomValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/document/")
public class DocumentRestAdmin extends AbstractController<Document, DocumentDto, DocumentHistory, DocumentCriteria, DocumentHistoryCriteria, DocumentAdminService, DocumentConverter> {

    @Autowired
    private CustomValidator<DocumentSummaryDto> documentSummaryDtoValidator;
    @Autowired
    private DocumentAdminService documentService;
    @Autowired
    private DocumentIndexElementAdminService indexElementAdminService;
    @Autowired
    private AuditAdminService auditService;
    @Autowired
    private CourrielService courrielService;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private DocumentConverter documentConverter;
    @Autowired
    private DocumentIndexElementConverter documentIndexElementConverter;
    @Autowired
    private IDashboardService dashboardService;
    @Autowired
    @Qualifier("databaseSearchServiceImpl")
    private SearchService searchService;

    @Value("${elasticUrl.api.url}")
    private String elasticUrl;

    @Autowired
    private IndexationService indexationService;

    @Autowired
    NotificationDocumentPartage notificationDocumentPartage;

    @Autowired
    NotificationDocument notificationDocument;

    @Autowired
    private DocumentEmptyPagesProcessor documentEmptyPagesProcessor;

    @Value("${app.qrcode.width}")
    private int qrcodeWidth;

    @Value("${app.qrcode.height}")
    private int qrcodeHeight;

    @PostMapping(value = "/docx-to-pdf", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<byte[]> convertDocxToPdf(@RequestParam(value = "file", required = false) MultipartFile file) {
        try {

            byte[] pdfBytes = documentService.convertWordToPdf(file.getInputStream());
            return ResponseEntity.ok().body(pdfBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @Operation(summary = "upload one document")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }

    @Operation(summary = "upload multiple documents")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documents")
    @GetMapping("")
    public ResponseEntity<List<DocumentDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all documents")
    @GetMapping("optimized")
    public ResponseEntity<List<DocumentDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a document by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
  @Operation(summary = "Finds a document by reference")
    @GetMapping("reference/{reference}")
    public ResponseEntity<DocumentSummaryDto> findByReference(@PathVariable String reference) throws Exception {
        return new ResponseEntity<>(service.findByReference(reference), HttpStatus.OK);
    }
    @GetMapping("plan-years")
    public ResponseEntity<List<Map<String, Object>>> getDistinctYear() throws Exception {
        List<Map<String, Object>> years = service.getDistinctYear();
        return ResponseEntity.ok(years);
    }

    @PostMapping("")
    public ResponseEntity<DocumentDto> save(@RequestBody DocumentDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "download a file by its gedReference")
    @GetMapping("/download/{referenceGed}")
    public ResponseEntity<byte[]> downloadByReferenceGed(@PathVariable String referenceGed){
        try {
            System.out.println("trying to download a file with the referenceged = "+referenceGed);
            Long id = Long.valueOf(referenceGed);
            byte[] data = documentService.downloadFileFromService(id, "");
            if(Objects.nonNull(data)){
                HttpHeaders headers = new HttpHeaders();
                headers.setContentDispositionFormData("attachment", "fileName.pdf");
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                return new ResponseEntity<>(data, headers, HttpStatus.OK);
            }
            return  new ResponseEntity<>(data, HttpStatus.OK );
        }catch (Exception e){
            System.out.println("exception : "+e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @Operation(summary = "perview a file as base64 by its gedReference")
    @GetMapping("/preview/{referenceGed}")
    public ResponseEntity<String> previewByReferenceGed(@PathVariable String referenceGed){
        try {
            System.out.println("trying to download a file with the referenceged = "+referenceGed);
            Long id = Long.valueOf(referenceGed);
            String data = documentService.previewFileFromService(id, "");
            Audit audit = auditService.saveAudit(id, "Consulter");
            if(Objects.nonNull(data)){
                HttpHeaders headers = new HttpHeaders();
                headers.setContentDispositionFormData("attachment", "fileName.pdf");
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                return new ResponseEntity<>(data, headers, HttpStatus.OK);
            }
            return  new ResponseEntity<>(data, HttpStatus.OK );
        }catch (Exception e){
            System.out.println("exception : "+e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @Operation(summary = "perview a file as base64 by its gedReference")
    @GetMapping("/viewarchive/{referenceGed}")
    public ResponseEntity<String> viewArchiveFileByid(@PathVariable String referenceGed){
        try {
            Long id = Long.valueOf(referenceGed);
            String data = documentService.viewArchiveFileFromMinio(id, "");
            //auditService.saveAudit(id, "Consulter");
            if(Objects.nonNull(data)){
                HttpHeaders headers = new HttpHeaders();
                headers.setContentDispositionFormData("attachment", "fileName.pdf");
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                return new ResponseEntity<>(data, headers, HttpStatus.OK);
            }
            return  new ResponseEntity<>(data, HttpStatus.OK );
        }catch (Exception e){
            System.out.println("exception : "+e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("upload-ai/")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String apiUrl = "http://20.98.217.109:8524/upload/";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);
        return response;
    }
    @PostMapping("classify-ai/")
    public ResponseEntity<String> classifyDocument(@RequestBody String content) {
        String apiUrl = "http://213.136.93.94:5001/classify";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String extractedText = content.substring(content.indexOf(":") + 2, content.lastIndexOf("\"}"));
        String requestBody = "{\"extracted_text\":\"" + extractedText + "\"}";
        System.out.println("---------------------body-----------"+requestBody);
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);

        return responseEntity;
    }

    @Operation(summary = "Saves the specified  document")
    @PostMapping(value = "/with-file", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<DocumentDto> save(@RequestParam(value = "file", required = false) MultipartFile file, @RequestParam("documentDTO") String dto) throws Exception {
        DocumentDto documentDto = documentService.saveDocument(file, dto);
        auditService.saveAudit(documentDto.getId(), "Ajouter");
        return new ResponseEntity<>(documentDto, HttpStatus.CREATED);
    }
    @Operation(summary = "Update the Splited document to Draft status and Save the Splited documents")
    @PostMapping(value = "/split-files", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<DocumentDto>> splitAndSavePDFs(@RequestParam("files") List<MultipartFile> files,
                                                                  @RequestParam("documentDTO") String dto) {
        List <DocumentDto> splitedDocuments = new ArrayList<>();
        try{
            splitedDocuments = documentService.saveSplitedDocument(files, dto);
            // documentsForNotify.add(commonDocumentDto);
            for(DocumentDto t: splitedDocuments ) {
                auditService.saveAudit(t.getId(), "Ajouter-Masse");
            }
            // notificationDocument.notifyDocumentCreationList(documentsForNotify);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(splitedDocuments, HttpStatus.CREATED);
    }
    @Operation(summary = "Update the merged document to Draft status and Save the merged document")
    @PostMapping(value = "/with-files", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<DocumentDto> saveMergedFiles(@RequestParam(value = "file", required = false) MultipartFile file, @RequestParam("documentDTOs") String dtos) throws Exception {
        if (dtos == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        DocumentDto mergedDocument = documentService.saveMergedFiles(file, dtos);
        auditService.saveAudit(mergedDocument.getId(), "Fusionner");
        if (mergedDocument == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(mergedDocument, HttpStatus.CREATED);
    }
    @Operation(summary = "Saves the specified  document V2")
    @PostMapping(value = "/v2/with-file", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Long> saveWithSummaryDto(@RequestParam(value = "file", required = false) MultipartFile file, @RequestParam("documentDTO") String dto) throws Exception {
        Long documentId = documentService.saveDocumentSummary(file, dto);
        auditService.saveAudit(documentId, "Ajouter");
        return new ResponseEntity<>(documentId, HttpStatus.CREATED);
    }
    @Operation(summary = "Updates the specified file of document")
    @PostMapping(value = "/update/with-Index", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<DocumentDto> updateFileWithIndex(@RequestParam(value = "file", required = false) MultipartFile file,
                                             @RequestParam("documentDTO") String dto) throws Exception {
        DocumentDto documentDto = new ObjectMapper().readValue(dto, DocumentDto.class);
        Document referencedDocument = service.findById(documentDto.getId());
        DocumentDto t = service.createDocumentWithFile(file, documentDto, referencedDocument, true);
        auditService.saveAudit(t.getId(), "Modifier_File");
        return new ResponseEntity<>(t, HttpStatus.CREATED);
    }

    @Operation(summary = "Updates the specified file of document")
    @PostMapping(value = "/update/with-file", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<DocumentDto> updateFile(@RequestParam(value = "file", required = false) MultipartFile file,
                                                    @RequestParam("documentDTO") String dto) throws Exception {
        DocumentDto documentDto = new ObjectMapper().readValue(dto, DocumentDto.class);
        Document referencedDocument = service.findById(documentDto.getId());
        DocumentDto t = service.createDocumentWithFile(file, documentDto, referencedDocument, false);
        auditService.saveAudit(t.getId(), "Modifier_File");
        return new ResponseEntity<>(t, HttpStatus.CREATED);
    }

    @Operation(summary = "Saves the specified documents V2")
    @PostMapping(value = "/v2/with-files", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<DocumentDto>> saveWithFiles(@RequestParam("files") List<MultipartFile> files,
                                                                  @RequestParam("documentDTO") String dto) {
        List<DocumentSummaryDto> results = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            DocumentSummaryDto commonDocumentDto = mapper.readValue(dto, DocumentSummaryDto.class);
            converter.init(true);
            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();


//                if (!fileName.toLowerCase().endsWith(".pdf")) {
//                    System.out.println("Skipping file " + fileName + ". Only PDF files are allowed.");
//                    continue;
//                }

                commonDocumentDto.setReference(fileName);
                commonDocumentDto.setDocumentStateCode("valide-ref");
                Document myT = documentConverter.toItem(commonDocumentDto);
                Document t = documentService.create(myT, file);


                if (t != null) {
                    results.add(documentConverter.toSummaryDto(t));
                    Audit audit = auditService.saveAudit(t.getId(), "Ajouter-Masse");
                    searchService.createDocumentInElastic(t);
                }
            }
            notificationDocument.notifyDocumentSummaryCreationList(results);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(documentConverter.toDto(documentConverter.toItems(results)), HttpStatus.CREATED);
    }

    @Operation(summary = "Finds paginated documents by quality criteria")
    @PostMapping("find-paginated-by-criteria/quality/{percent}")
    public ResponseEntity<PaginatedList> findPaginatedByCriteriaQuality( @PathVariable Long percent, @RequestBody DocumentCriteria criteria) throws Exception {
        PaginatedList paginatedList = new PaginatedList();
        try {
            List<Document> list = documentService.updateQualityFlag(criteria, criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField(), percent);
            List<DocumentDto> dtos = converter.toDto(list);
            paginatedList.setList(dtos);
            if (dtos != null && !dtos.isEmpty()) {
                int dateSize = list.size();
                paginatedList.setDataSize(dateSize);
            }
            return new ResponseEntity<>(paginatedList, HttpStatus.OK);
        }catch (RuntimeException e) {
            return new ResponseEntity<>(paginatedList , HttpStatus.BAD_REQUEST);
        }
    }
    @Operation(summary = "update list of document")
    @PostMapping("quality/multiple")
    public ResponseEntity<List<DocumentDto>> updateQualityStatus(@RequestBody List<DocumentDto> listToCheck) throws Exception {
        List<DocumentDto> updatedDocuments = new ArrayList<>();
        for (DocumentDto document : listToCheck) {
            DocumentDto updatedDocument = documentService.updateQualityStatusById(document.getId());
            updatedDocuments.add(updatedDocument);
        }
        return new ResponseEntity<>(updatedDocuments, HttpStatus.OK);
    }
    @Operation(summary = "update list of document")
    @PostMapping("reject/multiple")
    public ResponseEntity<List<DocumentDto>> rejectQualityFlagById(@RequestBody List<DocumentDto> listToCheck) throws Exception {
        List<DocumentDto> updatedDocuments = new ArrayList<>();
        for (DocumentDto document : listToCheck) {
            DocumentDto updatedDocument = documentService.rejectQualityStatusById(document.getId());
            updatedDocuments.add(updatedDocument);
        }
        return new ResponseEntity<>(updatedDocuments, HttpStatus.OK);
    }

    @Operation(summary = "lock a document")
    @PutMapping("lock/{id}")
    public ResponseEntity<DocumentDto> lockDocumentById(@PathVariable Long id) throws Exception {
        DocumentDto lockedDocument = documentService.lockDocumentById(id);
        return new ResponseEntity<>(lockedDocument, HttpStatus.OK);
    }
    @Operation(summary = "unlock a document")
    @PutMapping("unlock/{id}")
    public ResponseEntity<DocumentDto> unlockDocumentById(@PathVariable Long id) throws Exception {
        DocumentDto unlockedDocument = documentService.unlockDocumentById(id);
        return new ResponseEntity<>(unlockedDocument, HttpStatus.OK);
    }
    @PostMapping("create/Echantillon")
    public ResponseEntity<EchantillonDto> createEchantillon(@RequestBody EchantillonRequestDto requestDto) {
        EchantillonDto createdEchantillon = documentService.createEchantillon(requestDto.getDocuments(), requestDto.getNomEchantillon());
        return new ResponseEntity<>(createdEchantillon, HttpStatus.OK);
    }
    @PostMapping("quality-validator/{id}")
    public ResponseEntity<EchantillonDto> qualityLotValidation(@PathVariable Long id ) throws Exception  {
        EchantillonDto echantillon = documentService.validateLotEchantillon(id);
        return new ResponseEntity<>(echantillon, HttpStatus.OK);
    }
    @PostMapping("quality-note/{id}")
    public ResponseEntity<EchantillonDto> qualityAddNote(@PathVariable Long id, @RequestParam("note") String note ) throws Exception  {
        EchantillonDto echantillon = documentService.addEchantillonNote(id,note);
        return new ResponseEntity<>(echantillon, HttpStatus.OK);
    }
    @GetMapping("/List/echantillons")
    public ResponseEntity<List<Echantillon>> getAllEchantillons() {
        List<Echantillon> echantillons = documentService.getAllEchantillons();
        return new ResponseEntity<>(echantillons, HttpStatus.OK);
    }

    @Operation(summary = "Delete echantillon")
    @PostMapping("quality-delete/{id}")
    public ResponseEntity<Void> deleteEchantilon(@PathVariable Long id) throws Exception {
        service.deleteFinalEchantillon(id);
        return ResponseEntity.ok().build();
    }
    @Operation(summary = "Updates the specified  document")
    @PutMapping("")
    public ResponseEntity<DocumentDto> update(@Valid @RequestBody DocumentDto dto) throws Exception {
        if(dto.getDocumentState().getLibelle().equalsIgnoreCase("cloture")){
            dto.setArchive(true);
        }
        DocumentDto oldDocument = documentConverter.toDto(service.findById(dto.getId()));
        ResponseEntity<DocumentDto> response = super.update(dto);
        if (response.getStatusCode() == HttpStatus.OK) {
            Long documentId = dto.getId();
            Audit audit = auditService.saveAudit(documentId, "Modifier");
        }
        notificationDocumentPartage.notifyDocumentPartage(response.getBody(), oldDocument);
        return response;
    }

    @Operation(summary = "Delete list of document")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentDto>> delete(@RequestBody List<DocumentDto> listToDelete) throws Exception {
        notificationDocument.notifyDocumentDeleteList(listToDelete);
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete list of document")
    @PostMapping("delete")
    public ResponseEntity<List<DocumentDto>> deleteFinal(@RequestBody List<DocumentDto> listToDelete) throws Exception {
        List<DocumentDto> deletedDocs = service.deleteFinal(listToDelete);
        notificationDocument.notifyDocumentDeleteList(listToDelete);
        return ResponseEntity.ok(deletedDocs);
    }
    @Operation(summary = "Archiver list of document")
    @PostMapping("archive")
    public ResponseEntity<?> archiveDocuments(@RequestBody List<DocumentDto> listToArchive) {
        List<DocumentDto> archivedDocuments = service.archiveAssociatedDocument(listToArchive);
        if (archivedDocuments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Aucun document n'a été archivé. Assurez-vous que les documents sont dans un état 'clôturé'.");
        }
        return ResponseEntity.ok(archivedDocuments);
    }

    @Operation(summary = "desArchiver list of document")
    @PostMapping("desarchive")
    public ResponseEntity<List<DocumentDto>> desarchiveDocuments(@RequestBody List<DocumentDto> listToArchive) {
        List<DocumentDto> desarchivedDocuments = service.desarchiveAssociatedDocument(listToArchive);
        return ResponseEntity.ok(desarchivedDocuments);
    }

    @Operation(summary = " list of document to archive")
    @GetMapping("toArchive")
    public ResponseEntity<List<DocumentDto>> getDocumentsToArchive() {
        List<DocumentDto> DocumentsToArchive = documentConverter.toDto(service.getDocumentsToArchive()) ;
        return ResponseEntity.ok(DocumentsToArchive);
    }

    @Operation(summary = " list des documents archivés dernierement ")
    @GetMapping("Archivee")
    public ResponseEntity<List<DocumentDto>> getDocumentsArchivee() {
        List<DocumentDto> DocumentsArchivee = documentConverter.toDto(service.getDocumentsArchivee()) ;
        return ResponseEntity.ok(DocumentsArchivee);
    }

    @Operation(summary = " list of document to archive")
    @GetMapping("ArchiveFinale")
    public ResponseEntity<List<ArchiveFinal>> getDocumentsArchivesFinal() {
        List<ArchiveFinal> DocumentsArchiveFiale = service.getDocumentsArchivesFinalement() ;
        return ResponseEntity.ok(DocumentsArchiveFiale);
    }


    @Operation(summary = " list of document to archive final")
    @GetMapping("toArchiveFinale")
    public ResponseEntity<List<DocumentDto>> getDocumentsToArchiveFinale() {
        List<DocumentDto> DocumentsToArchive = documentConverter.toDto(service.getDocumentsToArchiveFinale()) ;
        return ResponseEntity.ok(DocumentsToArchive);
    }

    @Operation(summary = " list of document to archive")
    @GetMapping("toDestruction")
    public ResponseEntity<List<DocumentDto>> getDocumentsToDestruction() {
        List<DocumentDto> DocumentsToArchive = documentConverter.toDto(service.getDocumentsToDestruction()) ;
        return ResponseEntity.ok(DocumentsToArchive);
    }


    @Operation(summary = "Delete the specified document")
    @DeleteMapping("")
    public ResponseEntity<DocumentDto> delete(@RequestBody DocumentDto dto) throws Exception {
        notificationDocument.notifyDocumentDelete(dto);
        return super.delete(dto);
    }

    @Operation(summary = "Delete the specified document")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        notificationDocument.notifyDocumentDelete(service.findById(id));
        return super.deleteById(id);
    }
    @PutMapping("restore/{id}")
    public ResponseEntity<Long> restoreById(@PathVariable Long id) throws Exception {
        ResponseEntity<Long> res;
        HttpStatus status = HttpStatus.PRECONDITION_FAILED;
        if (id != null) {
            boolean resultDelete = service.restoreById(id);
            if (resultDelete) {
                status = HttpStatus.OK;
            }
        }
        res = new ResponseEntity<>(id, status);
        return res;
    }
    @Operation(summary = "Delete multiple documents by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
        return super.deleteByIdIn(ids);
    }
    @Operation(summary = "get file content")
    @PostMapping("ocr")
    public ResponseEntity<String> getContent(@RequestPart("file") MultipartFile file, @RequestPart("language") String language){
        String response = documentService.extractTextFromDocument(file,language);
        return ResponseEntity.ok(response);
    }
    @PostMapping("content")
    public ResponseEntity<String> getContentPdf(@RequestPart("file") MultipartFile file){
        String response = documentService.extractTextFromPDF(file);
        return ResponseEntity.ok(response);
    }
    @Operation(summary = "find by documentType id")
    @GetMapping("documentType/id/{id}")
    public List<Document> findByDocumentTypeId(@PathVariable Long id) {
        return service.findByDocumentTypeId(id);
    }

    @Operation(summary = "delete by documentType id")
    @DeleteMapping("documentType/id/{id}")
    public int deleteByDocumentTypeId(@PathVariable Long id) {
        return service.deleteByDocumentTypeId(id);
    }

    @Operation(summary = "find by documentState id")
    @GetMapping("documentState/id/{id}")
    public List<Document> findByDocumentStateId(@PathVariable Long id) {
        return service.findByDocumentStateId(id);
    }

    @Operation(summary = "delete by documentState id")
    @DeleteMapping("documentState/id/{id}")
    public int deleteByDocumentStateId(@PathVariable Long id) {
        return service.deleteByDocumentStateId(id);
    }

    @Operation(summary = "find by documentCategorie id")
    @GetMapping("documentCategorie/id/{id}")
    public List<Document> findByDocumentCategorieId(@PathVariable Long id) {
        return service.findByDocumentCategorieId(id);
    }

    @Operation(summary = "delete by documentCategorie id")
    @DeleteMapping("documentCategorie/id/{id}")
    public int deleteByDocumentCategorieId(@PathVariable Long id) {
        return service.deleteByDocumentCategorieId(id);
    }

    @Operation(summary = "find by utilisateur id")
    @GetMapping("utilisateur/id/{id}")
    public List<Document> findByUtilisateurId(@PathVariable Long id) {
        return service.findByUtilisateurId(id);
    }

    @Operation(summary = "delete by utilisateur id")
    @DeleteMapping("utilisateur/id/{id}")
    public int deleteByUtilisateurId(@PathVariable Long id) {
        return service.deleteByUtilisateurId(id);
    }

    @Operation(summary = "find by entiteAdministrative id")
    @GetMapping("entiteAdministrative/id/{id}")
    public List<Document> findByEntiteAdministrativeId(@PathVariable Long id) {
        return service.findByEntiteAdministrativeId(id);
    }

    @Operation(summary = "delete by entiteAdministrative id")
    @DeleteMapping("entiteAdministrative/id/{id}")
    public int deleteByEntiteAdministrativeId(@PathVariable Long id) {
        return service.deleteByEntiteAdministrativeId(id);
    }

    @Operation(summary = "find by documentCategorieModel id")
    @GetMapping("documentCategorieModel/id/{id}")
    public List<Document> findByDocumentCategorieModelId(@PathVariable Long id) {
        return service.findByDocumentCategorieModelId(id);
    }

    @Operation(summary = "delete by documentCategorieModel id")
    @DeleteMapping("documentCategorieModel/id/{id}")
    public int deleteByDocumentCategorieModelId(@PathVariable Long id) {
        return service.deleteByDocumentCategorieModelId(id);
    }

    @Operation(summary = "Finds a document and associated list by id")
    @GetMapping("detail/id/{id}")
    public ResponseEntity<DocumentDto> findWithAssociatedLists(@PathVariable Long id) {
        return super.findWithAssociatedLists(id);
    }

    @Operation(summary = "Finds documents by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentDto>> findByCriteria(@RequestBody DocumentCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documents by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentCriteria criteria) throws Exception {
        return  new ResponseEntity<>(service.findPaginatedListByCriteria(criteria,criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField()),HttpStatus.OK);
    }
    @Operation(summary = "Finds paginated documents by criteria")
    @PostMapping("find-paginated-by-archive-criteria")
    public ResponseEntity<PaginatedList> findPaginatedArchiveListByCriteria(@RequestBody DocumentCriteria criteria) throws Exception {
        return  new ResponseEntity<>(service.findPaginatedArchiveListByCriteria(criteria,criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField()),HttpStatus.OK);
    }
    @PostMapping("find-paginated-by-list-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByListCriteria(@RequestBody List<DocumentCriteria> criterias) throws Exception {
        return  new ResponseEntity<>(service.findPaginatedListByListCriteria(criterias, criterias.get(0).getPage(), criterias.get(0).getMaxResults(), criterias.get(0).getSortOrder(), criterias.get(0).getSortField()),HttpStatus.OK);
    }
    @Operation(summary = "Finds paginated documents by criteria")
    @PostMapping("find-paginated-by-criteria/deleted")
    public ResponseEntity<PaginatedList> findPaginatedByCriteriaDeleted(@RequestBody DocumentCriteria criteria) throws Exception {
        PaginatedList paginatedList = documentService.findPaginatedByCriteriaDeleted(criteria, criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField());;
        return new ResponseEntity<>(paginatedList, HttpStatus.OK);
    }
    @Operation(summary = "Finds all documents by keyword")
    @PostMapping("find-all-by-keyword")
    public ResponseEntity<List<DocumentDto>> findAllByKeyWord(@RequestParam("keyword") String keyword) throws Exception {
        return new ResponseEntity<>(service.findAllByKeyWord(keyword).stream().map(converter::toDto).collect(Collectors.toList()), HttpStatus.OK);
    }
    @Operation(summary = "Finds paginated documents by keyword")
    @PostMapping("find-paginated-by-keyword")
    public ResponseEntity<PaginatedList> findPaginatedByKeyWord(@RequestParam("keyword") String keyword, @RequestBody DocumentCriteria criteria) throws Exception {
        List<Document> list = documentService.findPaginatedByKeyWord(keyword, criteria);
        List<DocumentDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            int dateSize = service.getDataSize(criteria);
            paginatedList.setDataSize(dateSize);
        }
        return new ResponseEntity<>(paginatedList, HttpStatus.OK);
    }

    @GetMapping("find-by-numero-enregistrement")
    public List<DocumentDto> findByNumeroEnregistrement(@RequestParam String numero) {
        List<Document> documents = documentService.findByNumeroEnregistrement(numero);
        return converter.toDto(documents);
    }

    @Operation(summary = "Finds paginated documents by keyword")
    @PostMapping("find-paginated-by-keyword-index")
    public ResponseEntity<PaginatedList> findPaginatedByKeyWordIndex(@RequestParam("keyword") String keyword, @RequestBody DocumentCriteria criteria) throws Exception {
        List<Document> list = documentService.findPaginatedByKeyWordIndex(keyword, criteria);
        List<DocumentDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            int dateSize = service.getDataSize(criteria);
            paginatedList.setDataSize(dateSize);
        }
        return new ResponseEntity<>(paginatedList, HttpStatus.OK);
    }
    @Operation(summary = "Exports documents by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentCriteria criteria) throws Exception {
        return super.export(criteria);
    }



    @Operation(summary = "Gets document data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets document history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable("id") Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets document paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports document history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets document history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentRestAdmin(DocumentAdminService service, DocumentConverter converter) {
        super(service, converter);
    }

    @ExceptionHandler({RessourceNotFoundException.class, EntityNotFoundException.class })
    public ResponseEntity<String> handleEntityNotFoundException(Exception ex) {
        // Customize the response message and status code here
        String errorMessage = "Bad Request: " + ex.getMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
    @Operation(summary = "Get Global Production PDF of all documents")
    @GetMapping("production")
    public ResponseEntity<String>  DocumentsGroupByPlanClassement(@RequestParam(value="startDate",required = false) String startDateString, @RequestParam(value ="endDate",required = false) String endDateString) throws Exception {

        List<ProductionGlobal> productionGlobalList = dashboardService.countDocumentsGroupByPlanClassement(startDateString,endDateString);
        String base64PdfContent = dashboardService.convertPDFToBase62(productionGlobalList,  startDateString,  endDateString);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "production_report.pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .body(base64PdfContent);
    }
    @Operation(summary = "Get Global Production PDF of all documents")
    @GetMapping("years")
    public List<Integer> getListOfYears() {
        return documentService.findDistinctYears();
    }

    @Operation(summary = "endPoint pour modifier la status du document en cours de traitement")
    @PutMapping("editDocumentStatus/{id}/status")
    public ResponseEntity<Document> setStatusDocument(@PathVariable Long id, @RequestParam String status) {
        Document updatedDocument = documentService.setStatusDocument(id, status);
        return ResponseEntity.ok(updatedDocument);
    }

/*    @Operation(summary = "")
    @Scheduled(cron = "0 0 1 * * ?")
    @PutMapping("archivageIntermidiareAutomatique")
    public ResponseEntity<List<Document>> archivageIntermidiareAutomatique () {
        return  new ResponseEntity<>(documentService.archivageIntermidiareAutomatique(),HttpStatus.OK);
    }*/

    @Operation(summary = "")
    @Scheduled(cron = "0 0 1 * * ?")
    @PutMapping("archivageFinaleAutomatique")
    public ResponseEntity<List<ArchiveFinal>> archivageFinaleAutomatique() {
        return  new ResponseEntity<>(documentService.archivageFinaleAutomatique(),HttpStatus.OK);
    }

/*    @Operation(summary = "")
    @Scheduled(cron = "0 * * * * ?") // Exécute cette tâche tous les jours à 1h00
    @PutMapping("archivageInetrmidiareAproche")
    public ResponseEntity<List<Document>> checkDocumentsApproachingIntermidiaireArchivage() {
        return  new ResponseEntity<>(documentService.checkDocumentsApproachingIntermidiaireArchivage(),HttpStatus.OK);
    }*/
    @Operation(summary = "Finds paginated documents by year")
    @PostMapping("find-archive-by-year")
    public ResponseEntity<PaginatedList> findFinalArchiveByYear(@RequestParam("year") Integer year, @RequestBody DocumentCriteria criteria) throws Exception {
        PaginatedList paginatedList = documentService.findPaginatedByYear(year, criteria);
        return new ResponseEntity<>(paginatedList, HttpStatus.OK);
    }
    @Operation(summary = "Archive Documents Final")
    @PostMapping("move-to-archive")
    public ResponseEntity<List<ArchiveFinal>> archiveFinale(@RequestBody List<DocumentDto> documentDto) throws Exception {

        List<ArchiveFinal> dtos = documentService.moveToArchiveFinal(documentDto);
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
    @Operation(summary = "Archive Physique Documents Final")
    @PostMapping("archive-physique/{line}/{colonne}/{boite}")
    public ResponseEntity<Void>  archivePhysiqueFinaleInfo(@RequestBody List<ArchiveFinal> archiveFinalDto,@PathVariable("line") Long line, @PathVariable("colonne") Long colonne,@PathVariable("boite") Long boite) throws Exception {
        return documentService.addInfoArchivePhysiqueFinal(archiveFinalDto , line,  colonne,  boite);
    }

    @PostMapping("/getEmptyPages")
    public Map<Integer, Double> getEmptyPages(@RequestParam("file") MultipartFile file) throws IOException {
        return documentEmptyPagesProcessor.findEmptyPages(file);
    }

    @PostMapping("/create/upload-chunk")
    public ResponseEntity<Long> uploadChunk_create(
            @RequestParam("fileChunk") MultipartFile fileChunk,
            @RequestParam("chunkIndex") int chunkIndex,
            @RequestParam("totalChunks") int totalChunks,
            @RequestParam("documentDto") String dto) {
        Long documentId = documentService.handleChunkUpload(fileChunk, chunkIndex, totalChunks, dto, false);

        if(documentId == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (documentId == -1L){
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(documentId, HttpStatus.CREATED);
        }
    }

    @PostMapping("/update/upload-chunk")
    public ResponseEntity<Long> uploadChunk_update(
            @RequestParam("fileChunk") MultipartFile fileChunk,
            @RequestParam("chunkIndex") int chunkIndex,
            @RequestParam("totalChunks") int totalChunks,
            @RequestParam("documentDto") String dto) {
        Long documentId = documentService.handleChunkUpload(fileChunk, chunkIndex, totalChunks, dto, true);

        if(documentId == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (documentId == -1L){
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(documentId, HttpStatus.CREATED);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String,String>handleInvalidArgument(MethodArgumentNotValidException exception)
    {
        Map<String,String> errorMap=new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error->
        {
            errorMap.put(error.getField(),error.getDefaultMessage());
        });
        return errorMap;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(CustomValidationException.class)
    public Map<String, String> handleValidationException(CustomValidationException ex) {
        return ex.getErrors();
    }

    @GetMapping("document-history/{reference}")
    public ResponseEntity<List<DocumentDto>> findByReferencePattern(@PathVariable String reference) throws Exception {
        List<DocumentDto> documents = documentService.findByReferencePattern(reference);
        return new ResponseEntity<>(documents, HttpStatus.OK);
    }
}
