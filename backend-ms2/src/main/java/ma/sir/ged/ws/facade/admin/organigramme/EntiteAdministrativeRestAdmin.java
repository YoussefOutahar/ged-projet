package ma.sir.ged.ws.facade.admin.organigramme;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.history.EntiteAdministrativeHistory;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.GraphBuilder;
import ma.sir.ged.ws.converter.EntiteAdministrativeConverter;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;
import ma.sir.ged.ws.dto.OrganigramElement;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


import org.springframework.web.multipart.MultipartFile;
import ma.sir.ged.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/admin/entiteAdministrative/")
public class EntiteAdministrativeRestAdmin  extends AbstractController<EntiteAdministrative, EntiteAdministrativeDto, EntiteAdministrativeHistory, EntiteAdministrativeCriteria, EntiteAdministrativeHistoryCriteria, EntiteAdministrativeAdminService, EntiteAdministrativeConverter> {


    @Autowired
    private GraphBuilder graphBuilder;

    @Operation(summary = "upload one entiteAdministrative")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple entiteAdministratives")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all entiteAdministratives")
    @GetMapping("")
    @Cacheable(value = "entiteAdministrative")
    public ResponseEntity<List<EntiteAdministrativeDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all entiteAdministratives")
    @GetMapping("optimized")
    @Cacheable(value = "entiteAdministrativeOptimized")
    public ResponseEntity<List<EntiteAdministrativeDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a entiteAdministrative by id")
    @GetMapping("id/{id}")
    @Cacheable(value = "entiteAdministrative")
    public ResponseEntity<EntiteAdministrativeDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  entiteAdministrative")
    @PostMapping("")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<EntiteAdministrativeDto> save(@RequestBody EntiteAdministrativeDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  entiteAdministrative")
    @PutMapping("")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<EntiteAdministrativeDto> update(@RequestBody EntiteAdministrativeDto dto) throws Exception {
        EntiteAdministrative updated = service.update(converter.toItem(dto));
        if(updated == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(converter.toDto(updated), HttpStatus.OK);
    }

    @Operation(summary = "Delete list of entiteAdministrative")
    @PostMapping("multiple")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<List<EntiteAdministrativeDto>> delete(@RequestBody List<EntiteAdministrativeDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified entiteAdministrative")
    @DeleteMapping("")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<EntiteAdministrativeDto> delete(@RequestBody EntiteAdministrativeDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified entiteAdministrative")
    @DeleteMapping("id/{id}")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple entiteAdministratives by ids")
    @DeleteMapping("multiple/id")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by entiteAdministrativeParent id")
    @GetMapping("entiteAdministrativeParent/id/{id}")
    @Cacheable(value = "entiteAdministrative")
    public List<EntiteAdministrative> findByEntiteAdministrativeParentId(@PathVariable Long id){
        return service.findByEntiteAdministrativeParentId(id);
    }
    @Operation(summary = "delete by entiteAdministrativeParent id")
    @DeleteMapping("entiteAdministrativeParent/id/{id}")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public int deleteByEntiteAdministrativeParentId(@PathVariable Long id){
        return service.deleteByEntiteAdministrativeParentId(id);
    }

    @Operation(summary = "find by chef id")
    @GetMapping("chef/id/{id}")
    public List<EntiteAdministrative> findByChefId(@PathVariable Long id){
        return service.findByChefId(id);
    }

    @Operation(summary = "delete by chef id")
    @DeleteMapping("chef/id/{id}")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public int deleteByChefId(@PathVariable Long id){
        return service.deleteByChefId(id);
    }

    @Operation(summary = "find by entiteAdministrativeType id")
    @GetMapping("entiteAdministrativeType/id/{id}")
    @Cacheable(value = "entiteAdministrative")
    public List<EntiteAdministrative> findByEntiteAdministrativeTypeId(@PathVariable Long id){
        return service.findByEntiteAdministrativeTypeId(id);
    }

    @Operation(summary = "delete by entiteAdministrativeType id")
    @DeleteMapping("entiteAdministrativeType/id/{id}")
    @CacheEvict(value = "entiteAdministrative", allEntries = true)
    public int deleteByEntiteAdministrativeTypeId(@PathVariable Long id){
        return service.deleteByEntiteAdministrativeTypeId(id);
    }

    @Operation(summary = "Finds a entiteAdministrative and associated list by id")
    @GetMapping("detail/id/{id}")
    @Cacheable(value = "entiteAdministrative")
    public ResponseEntity<EntiteAdministrativeDto> findWithAssociatedLists(@PathVariable Long id) {
        return super.findWithAssociatedLists(id);
    }

    @Operation(summary = "Finds entiteAdministratives by criteria")
    @PostMapping("find-by-criteria")
    @Cacheable(value = "entiteAdministrative")
    public ResponseEntity<List<EntiteAdministrativeDto>> findByCriteria(@RequestBody EntiteAdministrativeCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated entiteAdministratives by criteria")
    @PostMapping("find-paginated-by-criteria")
    @Cacheable(value = "entiteAdministrative")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody EntiteAdministrativeCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports entiteAdministratives by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody EntiteAdministrativeCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets entiteAdministrative data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody EntiteAdministrativeCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets entiteAdministrative history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets entiteAdministrative paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody EntiteAdministrativeHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports entiteAdministrative history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody EntiteAdministrativeHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets entiteAdministrative history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody EntiteAdministrativeHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    @Operation(summary = "Gets entiteAdministrative as a Graph")
    @GetMapping("organigram")
    public ResponseEntity<OrganigramElement> getOrganigram() throws Exception {
        OrganigramElement graph = graphBuilder.buildGraph();
        return new ResponseEntity<>(graph, HttpStatus.OK);
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importFromJson(@RequestParam("file") MultipartFile file) {
        try {
            service.importFromJson(file);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> exportToJson() {
        try {
            OrganigramElement organigramElement = graphBuilder.buildGraph();
            String json = service.exportToJson(organigramElement);
            ByteArrayResource resource = new ByteArrayResource(json.getBytes());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=entiteAdministratives.json")
                    .contentType(MediaType.parseMediaType("application/json"))
                    .contentLength(resource.contentLength())
                    .body(resource);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public EntiteAdministrativeRestAdmin (EntiteAdministrativeAdminService service, EntiteAdministrativeConverter converter) {
        super(service, converter);
    }


}
