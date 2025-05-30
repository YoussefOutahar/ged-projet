package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentTag;
import ma.sir.ged.bean.history.DocumentTagHistory;
import ma.sir.ged.dao.criteria.core.DocumentTagCriteria;
import ma.sir.ged.dao.criteria.history.DocumentTagHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentTagAdminService;
import ma.sir.ged.ws.converter.DocumentTagConverter;
import ma.sir.ged.ws.dto.DocumentTagDto;
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
@RequestMapping("/api/admin/documentTag/")
public class DocumentTagRestAdmin  extends AbstractController<DocumentTag, DocumentTagDto, DocumentTagHistory, DocumentTagCriteria, DocumentTagHistoryCriteria, DocumentTagAdminService, DocumentTagConverter> {



    @Operation(summary = "upload one documentTag")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentTags")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentTags")
    @GetMapping("")
    public ResponseEntity<List<DocumentTagDto>> findAll() throws Exception {
        return super.findAll();
    }


    @Operation(summary = "Finds a documentTag by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentTagDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentTag")
    @PostMapping("")
    public ResponseEntity<DocumentTagDto> save(@RequestBody DocumentTagDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentTag")
    @PutMapping("")
    public ResponseEntity<DocumentTagDto> update(@RequestBody DocumentTagDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentTag")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentTagDto>> delete(@RequestBody List<DocumentTagDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentTag")
    @DeleteMapping("")
    public ResponseEntity<DocumentTagDto> delete(@RequestBody DocumentTagDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentTag")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentTags by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by document id")
    @GetMapping("document/id/{id}")
    public List<DocumentTag> findByDocumentId(@PathVariable Long id){
        return service.findByDocumentId(id);
    }
    @Operation(summary = "delete by document id")
    @DeleteMapping("document/id/{id}")
    public int deleteByDocumentId(@PathVariable Long id){
        return service.deleteByDocumentId(id);
    }
    @Operation(summary = "find by tag id")
    @GetMapping("tag/id/{id}")
    public List<DocumentTag> findByTagId(@PathVariable Long id){
        return service.findByTagId(id);
    }
    @Operation(summary = "delete by tag id")
    @DeleteMapping("tag/id/{id}")
    public int deleteByTagId(@PathVariable Long id){
        return service.deleteByTagId(id);
    }
    @Operation(summary = "Finds documentTags by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentTagDto>> findByCriteria(@RequestBody DocumentTagCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentTags by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentTagCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentTags by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentTagCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentTag data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentTagCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentTag history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentTag paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentTagHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentTag history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentTagHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentTag history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentTagHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentTagRestAdmin (DocumentTagAdminService service, DocumentTagConverter converter) {
        super(service, converter);
    }


}
