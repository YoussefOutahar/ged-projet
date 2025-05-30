package ma.sir.ged.ws.facade.admin.organigramme;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.organigramme.Gender;
import ma.sir.ged.bean.history.GenderHistory;
import ma.sir.ged.dao.criteria.core.GenderCriteria;
import ma.sir.ged.dao.criteria.history.GenderHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.GenderAdminService;
import ma.sir.ged.ws.converter.GenderConverter;
import ma.sir.ged.ws.dto.GenderDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import org.springframework.web.multipart.MultipartFile;
import ma.sir.ged.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/admin/gender/")
public class GenderRestAdmin  extends AbstractController<Gender, GenderDto, GenderHistory, GenderCriteria, GenderHistoryCriteria, GenderAdminService, GenderConverter> {



    @Operation(summary = "upload one gender")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }

    @Operation(summary = "upload multiple genders")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all genders")
    @GetMapping("")
    public ResponseEntity<List<GenderDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all genders")
    @GetMapping("optimized")
    public ResponseEntity<List<GenderDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a gender by id")
    @GetMapping("id/{id}")
    public ResponseEntity<GenderDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }

    @Operation(summary = "Saves the specified  gender")
    @PostMapping("")
    public ResponseEntity<GenderDto> save(@RequestBody GenderDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  gender")
    @PutMapping("")
    public ResponseEntity<GenderDto> update(@RequestBody GenderDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of gender")
    @PostMapping("multiple")
    public ResponseEntity<List<GenderDto>> delete(@RequestBody List<GenderDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified gender")
    @DeleteMapping("")
    public ResponseEntity<GenderDto> delete(@RequestBody GenderDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified gender")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple genders by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds genders by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<GenderDto>> findByCriteria(@RequestBody GenderCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated genders by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody GenderCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports genders by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody GenderCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets gender data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody GenderCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets gender history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets gender paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody GenderHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports gender history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody GenderHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets gender history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody GenderHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public GenderRestAdmin (GenderAdminService service, GenderConverter converter) {
        super(service, converter);
    }


}
