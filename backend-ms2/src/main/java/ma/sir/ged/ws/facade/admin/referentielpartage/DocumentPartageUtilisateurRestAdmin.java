package ma.sir.ged.ws.facade.admin.referentielpartage;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.bean.history.DocumentPartageUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.DocumentPartageUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageUtilisateurHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageUtilisateurAdminService;
import ma.sir.ged.ws.converter.DocumentPartageUtilisateurConverter;
import ma.sir.ged.ws.dto.DocumentPartageUtilisateurDto;
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
@RequestMapping("/api/admin/documentPartageUtilisateur/")
public class DocumentPartageUtilisateurRestAdmin  extends AbstractController<DocumentPartageUtilisateur, DocumentPartageUtilisateurDto, DocumentPartageUtilisateurHistory, DocumentPartageUtilisateurCriteria, DocumentPartageUtilisateurHistoryCriteria, DocumentPartageUtilisateurAdminService, DocumentPartageUtilisateurConverter> {



    @Operation(summary = "upload one documentPartageUtilisateur")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple documentPartageUtilisateurs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all documentPartageUtilisateurs")
    @GetMapping("")
    public ResponseEntity<List<DocumentPartageUtilisateurDto>> findAll() throws Exception {
        return super.findAll();
    }


    @Operation(summary = "Finds a documentPartageUtilisateur by id")
    @GetMapping("id/{id}")
    public ResponseEntity<DocumentPartageUtilisateurDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  documentPartageUtilisateur")
    @PostMapping("")
    public ResponseEntity<DocumentPartageUtilisateurDto> save(@RequestBody DocumentPartageUtilisateurDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  documentPartageUtilisateur")
    @PutMapping("")
    public ResponseEntity<DocumentPartageUtilisateurDto> update(@RequestBody DocumentPartageUtilisateurDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of documentPartageUtilisateur")
    @PostMapping("multiple")
    public ResponseEntity<List<DocumentPartageUtilisateurDto>> delete(@RequestBody List<DocumentPartageUtilisateurDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified documentPartageUtilisateur")
    @DeleteMapping("")
    public ResponseEntity<DocumentPartageUtilisateurDto> delete(@RequestBody DocumentPartageUtilisateurDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified documentPartageUtilisateur")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple documentPartageUtilisateurs by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by document id")
    @GetMapping("document/id/{id}")
    public List<DocumentPartageUtilisateur> findByDocumentId(@PathVariable Long id){
        return service.findByDocumentId(id);
    }
    @Operation(summary = "delete by document id")
    @DeleteMapping("document/id/{id}")
    public int deleteByDocumentId(@PathVariable Long id){
        return service.deleteByDocumentId(id);
    }
    @Operation(summary = "find by utilisateur id")
    @GetMapping("utilisateur/id/{id}")
    public List<DocumentPartageUtilisateur> findByUtilisateurId(@PathVariable Long id){
        return service.findByUtilisateurId(id);
    }
    @Operation(summary = "delete by utilisateur id")
    @DeleteMapping("utilisateur/id/{id}")
    public int deleteByUtilisateurId(@PathVariable Long id){
        return service.deleteByUtilisateurId(id);
    }
    @Operation(summary = "find by accessShare id")
    @GetMapping("accessShare/id/{id}")
    public List<DocumentPartageUtilisateur> findByAccessShareId(@PathVariable Long id){
        return service.findByAccessShareId(id);
    }
    @Operation(summary = "delete by accessShare id")
    @DeleteMapping("accessShare/id/{id}")
    public int deleteByAccessShareId(@PathVariable Long id){
        return service.deleteByAccessShareId(id);
    }
    @Operation(summary = "Finds documentPartageUtilisateurs by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<DocumentPartageUtilisateurDto>> findByCriteria(@RequestBody DocumentPartageUtilisateurCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated documentPartageUtilisateurs by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody DocumentPartageUtilisateurCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentPartageUtilisateurs by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody DocumentPartageUtilisateurCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets documentPartageUtilisateur data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody DocumentPartageUtilisateurCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets documentPartageUtilisateur history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets documentPartageUtilisateur paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody DocumentPartageUtilisateurHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports documentPartageUtilisateur history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody DocumentPartageUtilisateurHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets documentPartageUtilisateur history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody DocumentPartageUtilisateurHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public DocumentPartageUtilisateurRestAdmin (DocumentPartageUtilisateurAdminService service, DocumentPartageUtilisateurConverter converter) {
        super(service, converter);
    }


}
