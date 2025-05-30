package ma.sir.ged.ws.facade.admin.referentielpartage;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.RoleUtilisateur;
import ma.sir.ged.bean.history.RoleUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.RoleUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.RoleUtilisateurHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentielpartage.RoleUtilisateurAdminService;
import ma.sir.ged.ws.converter.RoleUtilisateurConverter;
import ma.sir.ged.ws.dto.RoleUtilisateurDto;
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
@RequestMapping("/api/admin/roleUtilisateur/")
public class RoleUtilisateurRestAdmin  extends AbstractController<RoleUtilisateur, RoleUtilisateurDto, RoleUtilisateurHistory, RoleUtilisateurCriteria, RoleUtilisateurHistoryCriteria, RoleUtilisateurAdminService, RoleUtilisateurConverter> {



    @Operation(summary = "upload one roleUtilisateur")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple roleUtilisateurs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all roleUtilisateurs")
    @GetMapping("")
    public ResponseEntity<List<RoleUtilisateurDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all roleUtilisateurs")
    @GetMapping("optimized")
    public ResponseEntity<List<RoleUtilisateurDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a roleUtilisateur by id")
    @GetMapping("id/{id}")
    public ResponseEntity<RoleUtilisateurDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  roleUtilisateur")
    @PostMapping("")
    public ResponseEntity<RoleUtilisateurDto> save(@RequestBody RoleUtilisateurDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  roleUtilisateur")
    @PutMapping("")
    public ResponseEntity<RoleUtilisateurDto> update(@RequestBody RoleUtilisateurDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of roleUtilisateur")
    @PostMapping("multiple")
    public ResponseEntity<List<RoleUtilisateurDto>> delete(@RequestBody List<RoleUtilisateurDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified roleUtilisateur")
    @DeleteMapping("")
    public ResponseEntity<RoleUtilisateurDto> delete(@RequestBody RoleUtilisateurDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified roleUtilisateur")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple roleUtilisateurs by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds roleUtilisateurs by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<RoleUtilisateurDto>> findByCriteria(@RequestBody RoleUtilisateurCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated roleUtilisateurs by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody RoleUtilisateurCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports roleUtilisateurs by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody RoleUtilisateurCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets roleUtilisateur data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody RoleUtilisateurCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets roleUtilisateur history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets roleUtilisateur paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody RoleUtilisateurHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports roleUtilisateur history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody RoleUtilisateurHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets roleUtilisateur history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody RoleUtilisateurHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public RoleUtilisateurRestAdmin (RoleUtilisateurAdminService service, RoleUtilisateurConverter converter) {
        super(service, converter);
    }


}
