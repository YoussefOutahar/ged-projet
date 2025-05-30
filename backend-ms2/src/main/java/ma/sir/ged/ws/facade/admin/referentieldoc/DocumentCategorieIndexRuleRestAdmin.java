package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndexRule;
import ma.sir.ged.bean.history.DocumentCategorieIndexRuleHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieIndexRuleCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexRuleHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexRuleAdminService;
import ma.sir.ged.ws.converter.DocumentCategorieIndexRuleConverter;
import ma.sir.ged.ws.dto.DocumentCategorieIndexRuleDto;
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
@RequestMapping("/api/admin/documentCategorieIndexRule/")
public class DocumentCategorieIndexRuleRestAdmin  extends AbstractController<DocumentCategorieIndexRule, DocumentCategorieIndexRuleDto, DocumentCategorieIndexRuleHistory, DocumentCategorieIndexRuleCriteria, DocumentCategorieIndexRuleHistoryCriteria, DocumentCategorieIndexRuleAdminService, DocumentCategorieIndexRuleConverter> {



    @Operation(summary = "upload one documentCategorieIndexRule")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentCategorieIndexRules")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentCategorieIndexRules")
    @GetMapping("")
    public ResponseEntity<List<DocumentCategorieIndexRuleDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all documentCategorieIndexRules")
    @GetMapping("optimized")
    public ResponseEntity<List<DocumentCategorieIndexRuleDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a documentCategorieIndexRule by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentCategorieIndexRuleDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentCategorieIndexRule")
    @PostMapping("")
    public ResponseEntity<DocumentCategorieIndexRuleDto> save(@RequestBody DocumentCategorieIndexRuleDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentCategorieIndexRule")
    @PutMapping("")
    public ResponseEntity<DocumentCategorieIndexRuleDto> update(@RequestBody DocumentCategorieIndexRuleDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentCategorieIndexRule")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentCategorieIndexRuleDto>> delete(@RequestBody List<DocumentCategorieIndexRuleDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentCategorieIndexRule")
    @DeleteMapping("")
    public ResponseEntity<DocumentCategorieIndexRuleDto> delete(@RequestBody DocumentCategorieIndexRuleDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentCategorieIndexRule")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentCategorieIndexRules by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds documentCategorieIndexRules by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentCategorieIndexRuleDto>> findByCriteria(@RequestBody DocumentCategorieIndexRuleCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentCategorieIndexRules by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentCategorieIndexRuleCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorieIndexRules by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentCategorieIndexRuleCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentCategorieIndexRule data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentCategorieIndexRuleCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentCategorieIndexRule history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentCategorieIndexRule paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentCategorieIndexRuleHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorieIndexRule history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentCategorieIndexRuleHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentCategorieIndexRule history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentCategorieIndexRuleHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentCategorieIndexRuleRestAdmin (DocumentCategorieIndexRuleAdminService service, DocumentCategorieIndexRuleConverter converter) {
        super(service, converter);
    }


}
