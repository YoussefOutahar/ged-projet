package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.bean.core.referentieldoc.DocumentType;
import ma.sir.ged.bean.history.DocumentTypeHistory;
import ma.sir.ged.dao.criteria.core.DocumentTypeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentTypeHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentTypeAdminService;
import ma.sir.ged.ws.converter.DocumentTypeConverter;
import ma.sir.ged.ws.dto.DocumentTypeDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.dto.FileTempDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/documentType/")
public class DocumentTypeRestAdmin extends AbstractController<DocumentType, DocumentTypeDto, DocumentTypeHistory, DocumentTypeCriteria, DocumentTypeHistoryCriteria, DocumentTypeAdminService, DocumentTypeConverter> {


    @Operation(summary = "upload one documentType")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }

    @Operation(summary = "upload multiple documentTypes")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentTypes")
    @GetMapping("")
    @Cacheable(value = "documentType")
    public ResponseEntity<List<DocumentTypeDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all documentTypes")
    @GetMapping("optimized")
    @Cacheable(value = "documentTypeOptimized")
    public ResponseEntity<List<DocumentTypeDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a documentType by id")
    @GetMapping("id/{id}")
    @Cacheable(value = "documentType")
    public ResponseEntity<DocumentTypeDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }

    @Operation(summary = "Saves the specified  documentType")
    @PostMapping("")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<DocumentTypeDto> save(@RequestBody DocumentTypeDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentType")
    @PutMapping("")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<DocumentTypeDto> update(@RequestBody DocumentTypeDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentType")
    @PostMapping("multiple")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<List<DocumentTypeDto>> delete(@RequestBody List<DocumentTypeDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }

    @Operation(summary = "Delete the specified documentType")
    @DeleteMapping("")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<DocumentTypeDto> delete(@RequestBody DocumentTypeDto dto) throws Exception {
        return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentType")
    @DeleteMapping("id/{id}")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }

    @Operation(summary = "Delete multiple documentTypes by ids")
    @DeleteMapping("multiple/id")
    @CacheEvict(value = "documentType", allEntries = true)
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
        return super.deleteByIdIn(ids);
    }


    @Operation(summary = "Finds documentTypes by criteria")
    @PostMapping("find-by-criteria")
    @Cacheable(value = "documentType")
    public ResponseEntity<List<DocumentTypeDto>> findByCriteria(@RequestBody DocumentTypeCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentTypes by criteria")
    @PostMapping("find-paginated-by-criteria")
    @Cacheable(value = "documentType")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentTypeCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentTypes by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentTypeCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentType data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentTypeCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentType history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentType paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentTypeHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentType history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentTypeHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentType history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentTypeHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentTypeRestAdmin(DocumentTypeAdminService service, DocumentTypeConverter converter) {
        super(service, converter);
    }


}
