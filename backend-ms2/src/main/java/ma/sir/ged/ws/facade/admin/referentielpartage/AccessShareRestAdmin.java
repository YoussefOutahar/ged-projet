package ma.sir.ged.ws.facade.admin.referentielpartage;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.AccessShare;
import ma.sir.ged.bean.history.AccessShareHistory;
import ma.sir.ged.dao.criteria.core.AccessShareCriteria;
import ma.sir.ged.dao.criteria.history.AccessShareHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentielpartage.AccessShareAdminService;
import ma.sir.ged.ws.converter.AccessShareConverter;
import ma.sir.ged.ws.dto.AccessShareDto;
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
@RequestMapping("/api/admin/accessShare/")
public class AccessShareRestAdmin  extends AbstractController<AccessShare, AccessShareDto, AccessShareHistory, AccessShareCriteria, AccessShareHistoryCriteria, AccessShareAdminService, AccessShareConverter> {



    @Operation(summary = "upload one accessShare")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple accessShares")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all accessShares")
    @GetMapping("")
    public ResponseEntity<List<AccessShareDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all accessShares")
    @GetMapping("optimized")
    public ResponseEntity<List<AccessShareDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a accessShare by id")
    @GetMapping("id/{id}")
    public ResponseEntity<AccessShareDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  accessShare")
    @PostMapping("")
    public ResponseEntity<AccessShareDto> save(@RequestBody AccessShareDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  accessShare")
    @PutMapping("")
    public ResponseEntity<AccessShareDto> update(@RequestBody AccessShareDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of accessShare")
    @PostMapping("multiple")
    public ResponseEntity<List<AccessShareDto>> delete(@RequestBody List<AccessShareDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified accessShare")
    @DeleteMapping("")
    public ResponseEntity<AccessShareDto> delete(@RequestBody AccessShareDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified accessShare")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple accessShares by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds accessShares by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<AccessShareDto>> findByCriteria(@RequestBody AccessShareCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated accessShares by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody AccessShareCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports accessShares by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody AccessShareCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets accessShare data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody AccessShareCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets accessShare history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets accessShare paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody AccessShareHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports accessShare history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody AccessShareHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets accessShare history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody AccessShareHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public AccessShareRestAdmin (AccessShareAdminService service, AccessShareConverter converter) {
        super(service, converter);
    }


}
