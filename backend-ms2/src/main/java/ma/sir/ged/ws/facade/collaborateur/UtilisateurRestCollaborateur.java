package  ma.sir.ged.ws.facade.collaborateur;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.history.UtilisateurHistory;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.service.facade.collaborateur.UtilisateurCollaborateurService;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.UtilisateurDto;
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
@RequestMapping("/api/collaborateur/utilisateur/")
public class UtilisateurRestCollaborateur  extends AbstractController<Utilisateur, UtilisateurDto, UtilisateurHistory, UtilisateurCriteria, UtilisateurHistoryCriteria, UtilisateurCollaborateurService, UtilisateurConverter> {



    @Operation(summary = "upload one utilisateur")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple utilisateurs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all utilisateurs")
    @GetMapping("")
    public ResponseEntity<List<UtilisateurDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all utilisateurs")
    @GetMapping("optimized")
    public ResponseEntity<List<UtilisateurDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a utilisateur by id")
    @GetMapping("id/{id}")
    public ResponseEntity<UtilisateurDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  utilisateur")
    @PostMapping("")
    public ResponseEntity<UtilisateurDto> save(@RequestBody UtilisateurDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  utilisateur")
    @PutMapping("")
    public ResponseEntity<UtilisateurDto> update(@RequestBody UtilisateurDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of utilisateur")
    @PostMapping("multiple")
    public ResponseEntity<List<UtilisateurDto>> delete(@RequestBody List<UtilisateurDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified utilisateur")
    @DeleteMapping("")
    public ResponseEntity<UtilisateurDto> delete(@RequestBody UtilisateurDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified utilisateur")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple utilisateurs by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by gender id")
    @GetMapping("gender/id/{id}")
    public List<Utilisateur> findByGenderId(@PathVariable Long id){
        return service.findByGenderId(id);
    }
    @Operation(summary = "delete by gender id")
    @DeleteMapping("gender/id/{id}")
    public int deleteByGenderId(@PathVariable Long id){
        return service.deleteByGenderId(id);
    }
    @Operation(summary = "find by entiteAdministrative id")
    @GetMapping("entiteAdministrative/id/{id}")
    public List<Utilisateur> findByEntiteAdministrativeId(@PathVariable Long id){
        return service.findByEntiteAdministrativeId(id);
    }
    @Operation(summary = "delete by entiteAdministrative id")
    @DeleteMapping("entiteAdministrative/id/{id}")
    public int deleteByEntiteAdministrativeId(@PathVariable Long id){
        return service.deleteByEntiteAdministrativeId(id);
    }
    @Operation(summary = "Finds utilisateurs by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<UtilisateurDto>> findByCriteria(@RequestBody UtilisateurCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated utilisateurs by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody UtilisateurCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports utilisateurs by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody UtilisateurCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets utilisateur data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody UtilisateurCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets utilisateur history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets utilisateur paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody UtilisateurHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports utilisateur history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody UtilisateurHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets utilisateur history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody UtilisateurHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    @Operation(summary = "Change password to the specified  utilisateur")
    @PutMapping("changePassword")
    public boolean changePassword(@RequestBody UtilisateurDto dto) throws Exception {
        return service.changePassword(dto.getUsername(),dto.getPassword());
    }
    public UtilisateurRestCollaborateur (UtilisateurCollaborateurService service, UtilisateurConverter converter) {
        super(service, converter);
    }


}
