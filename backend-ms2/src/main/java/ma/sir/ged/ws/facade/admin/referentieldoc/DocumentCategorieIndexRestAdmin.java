package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import ma.sir.ged.bean.history.DocumentCategorieIndexHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieIndexCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexAdminService;
import ma.sir.ged.ws.converter.DocumentCategorieIndexConverter;
import ma.sir.ged.ws.dto.DocumentCategorieIndexDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.web.multipart.MultipartFile;
import ma.sir.ged.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/admin/documentCategorieIndex/")
public class DocumentCategorieIndexRestAdmin  extends AbstractController<DocumentCategorieIndex, DocumentCategorieIndexDto, DocumentCategorieIndexHistory, DocumentCategorieIndexCriteria, DocumentCategorieIndexHistoryCriteria, DocumentCategorieIndexAdminService, DocumentCategorieIndexConverter> {



    @Operation(summary = "upload one documentCategorieIndex")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentCategorieIndexs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentCategorieIndexs")
    @GetMapping("")
    public ResponseEntity<List<DocumentCategorieIndexDto>> findAll() throws Exception {
        return super.findAll();
    }


    @Operation(summary = "Finds a documentCategorieIndex by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentCategorieIndexDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentCategorieIndex")
    @PostMapping("")
    public ResponseEntity<DocumentCategorieIndexDto> save(@RequestBody DocumentCategorieIndexDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentCategorieIndex")
    @PutMapping("")
    public ResponseEntity<DocumentCategorieIndexDto> update(@RequestBody DocumentCategorieIndexDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentCategorieIndex")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentCategorieIndexDto>> delete(@RequestBody List<DocumentCategorieIndexDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentCategorieIndex")
    @DeleteMapping("")
    public ResponseEntity<DocumentCategorieIndexDto> delete(@RequestBody DocumentCategorieIndexDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentCategorieIndex")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentCategorieIndexs by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by indexElement id")
    @GetMapping("indexElement/id/{id}")
    public List<DocumentCategorieIndex> findByIndexElementId(@PathVariable Long id){
        return service.findByIndexElementId(id);
    }
    @Operation(summary = "delete by indexElement id")
    @DeleteMapping("indexElement/id/{id}")
    public int deleteByIndexElementId(@PathVariable Long id){
        return service.deleteByIndexElementId(id);
    }
    @Operation(summary = "find by documentCategorie id")
    @GetMapping("documentCategorieOptimized/id/{id}")
    public List<DocumentCategorieIndexDto> findByDocumentCategorieOptimizedId(@PathVariable Long id){
        documentCategorieIndexConverter.setDocumentCategorie(false);
        documentCategorieIndexConverter.setDocumentCategorieIndexRule(false);
        List<DocumentCategorieIndexDto> dto = documentCategorieIndexConverter.toDto(service.findByDocumentCategorieId(id));
        documentCategorieIndexConverter.setDocumentCategorie(true);
        documentCategorieIndexConverter.setDocumentCategorieIndexRule(true);

        return dto;
    }
    @Operation(summary = "find by documentCategorie id")
    @GetMapping("documentCategorie/id/{id}")
    public List<DocumentCategorieIndex> findByDocumentCategorieId(@PathVariable Long id){
        return service.findByDocumentCategorieId(id);
    }
    @Operation(summary = "delete by documentCategorie id")
    @DeleteMapping("documentCategorie/id/{id}")
    public int deleteByDocumentCategorieId(@PathVariable Long id){
        return service.deleteByDocumentCategorieId(id);
    }
    @Operation(summary = "find by documentCategorieIndexRule id")
    @GetMapping("documentCategorieIndexRule/id/{id}")
    public List<DocumentCategorieIndex> findByDocumentCategorieIndexRuleId(@PathVariable Long id){
        return service.findByDocumentCategorieIndexRuleId(id);
    }
    @Operation(summary = "delete by documentCategorieIndexRule id")
    @DeleteMapping("documentCategorieIndexRule/id/{id}")
    public int deleteByDocumentCategorieIndexRuleId(@PathVariable Long id){
        return service.deleteByDocumentCategorieIndexRuleId(id);
    }
    @Operation(summary = "Finds documentCategorieIndexs by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentCategorieIndexDto>> findByCriteria(@RequestBody DocumentCategorieIndexCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentCategorieIndexs by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentCategorieIndexCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorieIndexs by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentCategorieIndexCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentCategorieIndex data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentCategorieIndexCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentCategorieIndex history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentCategorieIndex paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentCategorieIndexHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorieIndex history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentCategorieIndexHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentCategorieIndex history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentCategorieIndexHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    @Autowired
    DocumentCategorieIndexConverter documentCategorieIndexConverter;
    public DocumentCategorieIndexRestAdmin (DocumentCategorieIndexAdminService service, DocumentCategorieIndexConverter converter) {
        super(service, converter);
    }


}
