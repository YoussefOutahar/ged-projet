package ma.sir.ged.ws.facade.admin.referentieldoc;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieModel;
import ma.sir.ged.bean.history.DocumentCategorieModelHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieModelCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieModelHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieModelAdminService;
import ma.sir.ged.ws.converter.DocumentCategorieModelConverter;
import ma.sir.ged.ws.dto.DocumentCategorieModelDto;
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
@RequestMapping("/api/admin/documentCategorieModel/")
public class DocumentCategorieModelRestAdmin  extends AbstractController<DocumentCategorieModel, DocumentCategorieModelDto, DocumentCategorieModelHistory, DocumentCategorieModelCriteria, DocumentCategorieModelHistoryCriteria, DocumentCategorieModelAdminService, DocumentCategorieModelConverter> {



    @Operation(summary = "upload one documentCategorieModel")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentCategorieModels")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentCategorieModels")
    @GetMapping("")
    public ResponseEntity<List<DocumentCategorieModelDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all documentCategorieModels")
    @GetMapping("optimized")
    public ResponseEntity<List<DocumentCategorieModelDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a documentCategorieModel by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentCategorieModelDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentCategorieModel")
    @PostMapping("")
    public ResponseEntity<DocumentCategorieModelDto> save(@RequestBody DocumentCategorieModelDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentCategorieModel")
    @PutMapping("")
    public ResponseEntity<DocumentCategorieModelDto> update(@RequestBody DocumentCategorieModelDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentCategorieModel")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentCategorieModelDto>> delete(@RequestBody List<DocumentCategorieModelDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentCategorieModel")
    @DeleteMapping("")
    public ResponseEntity<DocumentCategorieModelDto> delete(@RequestBody DocumentCategorieModelDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentCategorieModel")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentCategorieModels by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by documentCategorie id")
    @GetMapping("documentCategorie/id/{id}")
    public List<DocumentCategorieModel> findByDocumentCategorieId(@PathVariable Long id){
        return service.findByDocumentCategorieId(id);
    }
    @Operation(summary = "delete by documentCategorie id")
    @DeleteMapping("documentCategorie/id/{id}")
    public int deleteByDocumentCategorieId(@PathVariable Long id){
        return service.deleteByDocumentCategorieId(id);
    }
    @Operation(summary = "Finds documentCategorieModels by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentCategorieModelDto>> findByCriteria(@RequestBody DocumentCategorieModelCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentCategorieModels by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentCategorieModelCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorieModels by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentCategorieModelCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentCategorieModel data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentCategorieModelCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentCategorieModel history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentCategorieModel paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentCategorieModelHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentCategorieModel history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentCategorieModelHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentCategorieModel history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentCategorieModelHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentCategorieModelRestAdmin (DocumentCategorieModelAdminService service, DocumentCategorieModelConverter converter) {
        super(service, converter);
    }


}
