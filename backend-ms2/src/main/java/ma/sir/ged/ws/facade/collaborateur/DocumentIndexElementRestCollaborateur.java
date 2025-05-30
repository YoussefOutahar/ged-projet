package  ma.sir.ged.ws.facade.collaborateur;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.bean.history.DocumentIndexElementHistory;
import ma.sir.ged.dao.criteria.core.DocumentIndexElementCriteria;
import ma.sir.ged.dao.criteria.history.DocumentIndexElementHistoryCriteria;
import ma.sir.ged.service.facade.collaborateur.DocumentIndexElementCollaborateurService;
import ma.sir.ged.ws.converter.DocumentIndexElementConverter;
import ma.sir.ged.ws.dto.DocumentIndexElementDto;
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
@RequestMapping("/api/collaborateur/documentIndexElement/")
public class DocumentIndexElementRestCollaborateur  extends AbstractController<DocumentIndexElement, DocumentIndexElementDto, DocumentIndexElementHistory, DocumentIndexElementCriteria, DocumentIndexElementHistoryCriteria, DocumentIndexElementCollaborateurService, DocumentIndexElementConverter> {



    @Operation(summary = "upload one documentIndexElement")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentIndexElements")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentIndexElements")
    @GetMapping("")
    public ResponseEntity<List<DocumentIndexElementDto>> findAll() throws Exception {
        return super.findAll();
    }


    @Operation(summary = "Finds a documentIndexElement by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentIndexElementDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentIndexElement")
    @PostMapping("")
    public ResponseEntity<DocumentIndexElementDto> save(@RequestBody DocumentIndexElementDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentIndexElement")
    @PutMapping("")
    public ResponseEntity<DocumentIndexElementDto> update(@RequestBody DocumentIndexElementDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentIndexElement")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentIndexElementDto>> delete(@RequestBody List<DocumentIndexElementDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentIndexElement")
    @DeleteMapping("")
    public ResponseEntity<DocumentIndexElementDto> delete(@RequestBody DocumentIndexElementDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentIndexElement")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentIndexElements by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by indexElement id")
    @GetMapping("indexElement/id/{id}")
    public List<DocumentIndexElement> findByIndexElementId(@PathVariable Long id){
        return service.findByIndexElementId(id);
    }
    @Operation(summary = "delete by indexElement id")
    @DeleteMapping("indexElement/id/{id}")
    public int deleteByIndexElementId(@PathVariable Long id){
        return service.deleteByIndexElementId(id);
    }
    @Operation(summary = "find by document id")
    @GetMapping("document/id/{id}")
    public List<DocumentIndexElement> findByDocumentId(@PathVariable Long id){
        return service.findByDocumentId(id);
    }
    @Operation(summary = "delete by document id")
    @DeleteMapping("document/id/{id}")
    public int deleteByDocumentId(@PathVariable Long id){
        return service.deleteByDocumentId(id);
    }
    @Operation(summary = "Finds documentIndexElements by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentIndexElementDto>> findByCriteria(@RequestBody DocumentIndexElementCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentIndexElements by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentIndexElementCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentIndexElements by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentIndexElementCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentIndexElement data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentIndexElementCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentIndexElement history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentIndexElement paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentIndexElementHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentIndexElement history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentIndexElementHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentIndexElement history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentIndexElementHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentIndexElementRestCollaborateur (DocumentIndexElementCollaborateurService service, DocumentIndexElementConverter converter) {
        super(service, converter);
    }


}
