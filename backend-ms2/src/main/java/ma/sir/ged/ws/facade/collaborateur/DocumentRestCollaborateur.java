package  ma.sir.ged.ws.facade.collaborateur;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.history.DocumentHistory;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.service.facade.collaborateur.DocumentCollaborateurService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import org.springframework.web.multipart.MultipartFile;
import ma.sir.ged.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/collaborateur/document/")
public class DocumentRestCollaborateur  extends AbstractController<Document, DocumentDto, DocumentHistory, DocumentCriteria, DocumentHistoryCriteria, DocumentCollaborateurService, DocumentConverter> {



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
    @Operation(summary = "Saves the specified  document")
    @PostMapping("")
    public ResponseEntity<DocumentDto> save(@RequestBody DocumentDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  document")
    @PutMapping("")
    public ResponseEntity<DocumentDto> update(@RequestBody DocumentDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of document")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentDto>> delete(@RequestBody List<DocumentDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified document")
    @DeleteMapping("")
    public ResponseEntity<DocumentDto> delete(@RequestBody DocumentDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified document")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documents by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by documentType id")
    @GetMapping("documentType/id/{id}")
    public List<Document> findByDocumentTypeId(@PathVariable Long id){
        return service.findByDocumentTypeId(id);
    }
    @Operation(summary = "delete by documentType id")
    @DeleteMapping("documentType/id/{id}")
    public int deleteByDocumentTypeId(@PathVariable Long id){
        return service.deleteByDocumentTypeId(id);
    }
    @Operation(summary = "find by documentState id")
    @GetMapping("documentState/id/{id}")
    public List<Document> findByDocumentStateId(@PathVariable Long id){
        return service.findByDocumentStateId(id);
    }
    @Operation(summary = "delete by documentState id")
    @DeleteMapping("documentState/id/{id}")
    public int deleteByDocumentStateId(@PathVariable Long id){
        return service.deleteByDocumentStateId(id);
    }
    @Operation(summary = "find by documentCategorie id")
    @GetMapping("documentCategorie/id/{id}")
    public List<Document> findByDocumentCategorieId(@PathVariable Long id){
        return service.findByDocumentCategorieId(id);
    }
    @Operation(summary = "delete by documentCategorie id")
    @DeleteMapping("documentCategorie/id/{id}")
    public int deleteByDocumentCategorieId(@PathVariable Long id){
        return service.deleteByDocumentCategorieId(id);
    }
    @Operation(summary = "find by utilisateur id")
    @GetMapping("utilisateur/id/{id}")
    public List<Document> findByUtilisateurId(@PathVariable Long id){
        return service.findByUtilisateurId(id);
    }
    @Operation(summary = "delete by utilisateur id")
    @DeleteMapping("utilisateur/id/{id}")
    public int deleteByUtilisateurId(@PathVariable Long id){
        return service.deleteByUtilisateurId(id);
    }
    @Operation(summary = "find by entiteAdministrative id")
    @GetMapping("entiteAdministrative/id/{id}")
    public List<Document> findByEntiteAdministrativeId(@PathVariable Long id){
        return service.findByEntiteAdministrativeId(id);
    }
    @Operation(summary = "delete by entiteAdministrative id")
    @DeleteMapping("entiteAdministrative/id/{id}")
    public int deleteByEntiteAdministrativeId(@PathVariable Long id){
        return service.deleteByEntiteAdministrativeId(id);
    }
    @Operation(summary = "find by documentCategorieModel id")
    @GetMapping("documentCategorieModel/id/{id}")
    public List<Document> findByDocumentCategorieModelId(@PathVariable Long id){
        return service.findByDocumentCategorieModelId(id);
    }
    @Operation(summary = "delete by documentCategorieModel id")
    @DeleteMapping("documentCategorieModel/id/{id}")
    public int deleteByDocumentCategorieModelId(@PathVariable Long id){
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
        return super.findPaginatedByCriteria(criteria);
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
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
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

    public DocumentRestCollaborateur (DocumentCollaborateurService service, DocumentConverter converter) {
        super(service, converter);
    }


}
