package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.bean.history.DocumentCategorieHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieAdminService;
import ma.sir.ged.ws.converter.DocumentCategorieConverter;
import ma.sir.ged.ws.dto.DocumentCategorieDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import org.springframework.web.multipart.MultipartFile;
import ma.sir.ged.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/admin/documentCategorie/")
public class DocumentCategorieRestAdmin  extends AbstractController<DocumentCategorie, DocumentCategorieDto, DocumentCategorieHistory, DocumentCategorieCriteria, DocumentCategorieHistoryCriteria, DocumentCategorieAdminService, DocumentCategorieConverter> {

    @Autowired
    DocumentCategorieAdminService service;

    @Operation(summary = "upload one documentCategorie")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentCategories")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentCategories")
    @GetMapping("")
    @Cacheable(value = "documentCategorie")
    public ResponseEntity<List<DocumentCategorieDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all documentCategories")
    @GetMapping("optimized")
    @Cacheable(value = "documentCategorieOptimized")
    public ResponseEntity<List<DocumentCategorieDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a documentCategorie by id")
    @GetMapping("id/{id}")
    @Cacheable(value = "documentCategorie", key = "#id")
    public ResponseEntity<DocumentCategorieDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Finds a documentCategorie by libelle")
    @GetMapping("libelle/{libelle}")
    @Cacheable(value = "documentCategorie", key = "#libelle")
    public ResponseEntity<DocumentCategorieDto> findByLibelle(@PathVariable String libelle) throws Exception {
        return new ResponseEntity<>(service.findByLibelle(libelle), HttpStatus.OK);
    }
    @Operation(summary = "Saves the specified  documentCategorie")
    @PostMapping("")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<DocumentCategorieDto> save(@RequestBody DocumentCategorieDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentCategorie")
    @PutMapping("")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<DocumentCategorieDto> update(@RequestBody DocumentCategorieDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentCategorie")
    @PostMapping("multiple")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<List<DocumentCategorieDto>> delete(@RequestBody List<DocumentCategorieDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentCategorie")
    @DeleteMapping("")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<DocumentCategorieDto> delete(@RequestBody DocumentCategorieDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentCategorie")
    @DeleteMapping("id/{id}")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentCategories by ids")
    @DeleteMapping("multiple/id")
    @CacheEvict(value = "documentCategorie", allEntries = true)
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds a documentCategorie and associated list by id")
    @GetMapping("detail/id/{id}")
    public ResponseEntity<DocumentCategorieDto> findWithAssociatedLists(@PathVariable Long id) {
        return super.findWithAssociatedLists(id);
    }

    @Operation(summary = "Finds documentCategories by criteria")
    @PostMapping("find-by-criteria")
    @Cacheable(value = "documentCategorie")
    public ResponseEntity<List<DocumentCategorieDto>> findByCriteria(@RequestBody DocumentCategorieCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentCategories by criteria")
    @PostMapping("find-paginated-by-criteria")
    @Cacheable(value = "documentCategorie")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentCategorieCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategories by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentCategorieCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentCategorie data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentCategorieCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentCategorie history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentCategorie paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentCategorieHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorie history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentCategorieHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentCategorie history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentCategorieHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentCategorieRestAdmin (DocumentCategorieAdminService service, DocumentCategorieConverter converter) {
        super(service, converter);
    }


}
