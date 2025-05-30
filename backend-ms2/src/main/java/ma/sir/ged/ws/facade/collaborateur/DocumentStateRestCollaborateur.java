package  ma.sir.ged.ws.facade.collaborateur;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.bean.history.DocumentStateHistory;
import ma.sir.ged.dao.criteria.core.DocumentStateCriteria;
import ma.sir.ged.dao.criteria.history.DocumentStateHistoryCriteria;
import ma.sir.ged.service.facade.collaborateur.DocumentStateCollaborateurService;
import ma.sir.ged.ws.converter.DocumentStateConverter;
import ma.sir.ged.ws.dto.DocumentStateDto;
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
@RequestMapping("/api/collaborateur/documentState/")
public class DocumentStateRestCollaborateur  extends AbstractController<DocumentState, DocumentStateDto, DocumentStateHistory, DocumentStateCriteria, DocumentStateHistoryCriteria, DocumentStateCollaborateurService, DocumentStateConverter> {



    @Operation(summary = "upload one documentState")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentStates")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentStates")
    @GetMapping("")
    public ResponseEntity<List<DocumentStateDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all documentStates")
    @GetMapping("optimized")
    public ResponseEntity<List<DocumentStateDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a documentState by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentStateDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentState")
    @PostMapping("")
    public ResponseEntity<DocumentStateDto> save(@RequestBody DocumentStateDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentState")
    @PutMapping("")
    public ResponseEntity<DocumentStateDto> update(@RequestBody DocumentStateDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentState")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentStateDto>> delete(@RequestBody List<DocumentStateDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentState")
    @DeleteMapping("")
    public ResponseEntity<DocumentStateDto> delete(@RequestBody DocumentStateDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentState")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentStates by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds documentStates by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentStateDto>> findByCriteria(@RequestBody DocumentStateCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentStates by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentStateCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentStates by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentStateCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentState data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentStateCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentState history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentState paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentStateHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentState history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentStateHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentState history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentStateHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentStateRestCollaborateur (DocumentStateCollaborateurService service, DocumentStateConverter converter) {
        super(service, converter);
    }


}
