package ma.sir.ged.ws.facade.admin.referentielpartage;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.history.DocumentPartageGroupeHistory;
import ma.sir.ged.dao.criteria.core.DocumentPartageGroupeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageGroupeHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageGroupeAdminService;
import ma.sir.ged.ws.converter.DocumentPartageGroupeConverter;
import ma.sir.ged.ws.dto.DocumentPartageGroupeDto;
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
@RequestMapping("/api/admin/documentPartageGroupe/")
public class DocumentPartageGroupeRestAdmin  extends AbstractController<DocumentPartageGroupe, DocumentPartageGroupeDto, DocumentPartageGroupeHistory, DocumentPartageGroupeCriteria, DocumentPartageGroupeHistoryCriteria, DocumentPartageGroupeAdminService, DocumentPartageGroupeConverter> {



    @Operation(summary = "upload one documentPartageGroupe")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentPartageGroupes")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentPartageGroupes")
    @GetMapping("")
    public ResponseEntity<List<DocumentPartageGroupeDto>> findAll() throws Exception {
        return super.findAll();
    }


    @Operation(summary = "Finds a documentPartageGroupe by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentPartageGroupeDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentPartageGroupe")
    @PostMapping("")
    public ResponseEntity<DocumentPartageGroupeDto> save(@RequestBody DocumentPartageGroupeDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentPartageGroupe")
    @PutMapping("")
    public ResponseEntity<DocumentPartageGroupeDto> update(@RequestBody DocumentPartageGroupeDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentPartageGroupe")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentPartageGroupeDto>> delete(@RequestBody List<DocumentPartageGroupeDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentPartageGroupe")
    @DeleteMapping("")
    public ResponseEntity<DocumentPartageGroupeDto> delete(@RequestBody DocumentPartageGroupeDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentPartageGroupe")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentPartageGroupes by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by document id")
    @GetMapping("document/id/{id}")
    public List<DocumentPartageGroupe> findByDocumentId(@PathVariable Long id){
        return service.findByDocumentId(id);
    }
    @Operation(summary = "delete by document id")
    @DeleteMapping("document/id/{id}")
    public int deleteByDocumentId(@PathVariable Long id){
        return service.deleteByDocumentId(id);
    }
    @Operation(summary = "find by groupe id")
    @GetMapping("groupe/id/{id}")
    public List<DocumentPartageGroupe> findByGroupeId(@PathVariable Long id){
        return service.findByGroupeId(id);
    }
    @Operation(summary = "delete by groupe id")
    @DeleteMapping("groupe/id/{id}")
    public int deleteByGroupeId(@PathVariable Long id){
        return service.deleteByGroupeId(id);
    }
    @Operation(summary = "find by accessShare id")
    @GetMapping("accessShare/id/{id}")
    public List<DocumentPartageGroupe> findByAccessShareId(@PathVariable Long id){
        return service.findByAccessShareId(id);
    }
    @Operation(summary = "delete by accessShare id")
    @DeleteMapping("accessShare/id/{id}")
    public int deleteByAccessShareId(@PathVariable Long id){
        return service.deleteByAccessShareId(id);
    }
    @Operation(summary = "Finds documentPartageGroupes by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentPartageGroupeDto>> findByCriteria(@RequestBody DocumentPartageGroupeCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentPartageGroupes by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentPartageGroupeCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentPartageGroupes by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentPartageGroupeCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentPartageGroupe data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentPartageGroupeCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentPartageGroupe history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentPartageGroupe paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentPartageGroupeHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentPartageGroupe history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentPartageGroupeHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentPartageGroupe history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentPartageGroupeHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentPartageGroupeRestAdmin (DocumentPartageGroupeAdminService service, DocumentPartageGroupeConverter converter) {
        super(service, converter);
    }


}
