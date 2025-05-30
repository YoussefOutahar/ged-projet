package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.Tag;
import ma.sir.ged.bean.history.TagHistory;
import ma.sir.ged.dao.criteria.core.TagCriteria;
import ma.sir.ged.dao.criteria.history.TagHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.TagAdminService;
import ma.sir.ged.ws.converter.TagConverter;
import ma.sir.ged.ws.dto.TagDto;
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
@RequestMapping("/api/admin/tag/")
public class TagRestAdmin  extends AbstractController<Tag, TagDto, TagHistory, TagCriteria, TagHistoryCriteria, TagAdminService, TagConverter> {



    @Operation(summary = "upload one tag")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple tags")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all tags")
    @GetMapping("")
    public ResponseEntity<List<TagDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all tags")
    @GetMapping("optimized")
    public ResponseEntity<List<TagDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a tag by id")
    @GetMapping("id/{id}")
    public ResponseEntity<TagDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  tag")
    @PostMapping("")
    public ResponseEntity<TagDto> save(@RequestBody TagDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  tag")
    @PutMapping("")
    public ResponseEntity<TagDto> update(@RequestBody TagDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of tag")
    @PostMapping("multiple")
    public ResponseEntity<List<TagDto>> delete(@RequestBody List<TagDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified tag")
    @DeleteMapping("")
    public ResponseEntity<TagDto> delete(@RequestBody TagDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified tag")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple tags by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds tags by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<TagDto>> findByCriteria(@RequestBody TagCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated tags by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody TagCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports tags by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody TagCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets tag data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody TagCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets tag history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets tag paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody TagHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports tag history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody TagHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets tag history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody TagHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public TagRestAdmin (TagAdminService service, TagConverter converter) {
        super(service, converter);
    }


}
