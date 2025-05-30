package ma.sir.ged.ws.facade.admin.referentielpartage;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.bean.history.GroupeUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.GroupeUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.GroupeUtilisateurHistoryCriteria;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.ws.converter.GroupeUtilisateurConverter;
import ma.sir.ged.ws.dto.GroupeUtilisateurDto;
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
@RequestMapping("/api/admin/groupeUtilisateur/")
public class GroupeUtilisateurRestAdmin  extends AbstractController<GroupeUtilisateur, GroupeUtilisateurDto, GroupeUtilisateurHistory, GroupeUtilisateurCriteria, GroupeUtilisateurHistoryCriteria, GroupeUtilisateurAdminService, GroupeUtilisateurConverter> {



    @Operation(summary = "upload one groupeUtilisateur")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple groupeUtilisateurs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all groupeUtilisateurs")
    @GetMapping("")
    public ResponseEntity<List<GroupeUtilisateurDto>> findAll() throws Exception {
        return super.findAll();
    }


    @Operation(summary = "Finds a groupeUtilisateur by id")
    @GetMapping("id/{id}")
    public ResponseEntity<GroupeUtilisateurDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  groupeUtilisateur")
    @PostMapping("")
    public ResponseEntity<GroupeUtilisateurDto> save(@RequestBody GroupeUtilisateurDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  groupeUtilisateur")
    @PutMapping("")
    public ResponseEntity<GroupeUtilisateurDto> update(@RequestBody GroupeUtilisateurDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of groupeUtilisateur")
    @PostMapping("multiple")
    public ResponseEntity<List<GroupeUtilisateurDto>> delete(@RequestBody List<GroupeUtilisateurDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified groupeUtilisateur")
    @DeleteMapping("")
    public ResponseEntity<GroupeUtilisateurDto> delete(@RequestBody GroupeUtilisateurDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified groupeUtilisateur")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple groupeUtilisateurs by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by groupe id")
    @GetMapping("groupe/id/{id}")
    public List<GroupeUtilisateur> findByGroupeId(@PathVariable Long id){
        return service.findByGroupeId(id);
    }
    @Operation(summary = "delete by groupe id")
    @DeleteMapping("groupe/id/{id}")
    public int deleteByGroupeId(@PathVariable Long id){
        return service.deleteByGroupeId(id);
    }
    @Operation(summary = "find by utilisateur id")
    @GetMapping("utilisateur/id/{id}")
    public List<GroupeUtilisateur> findByUtilisateurId(@PathVariable Long id){
        return service.findByUtilisateurId(id);
    }
    @Operation(summary = "delete by utilisateur id")
    @DeleteMapping("utilisateur/id/{id}")
    public int deleteByUtilisateurId(@PathVariable Long id){
        return service.deleteByUtilisateurId(id);
    }
    @Operation(summary = "find by etatUtilisateur id")
    @GetMapping("etatUtilisateur/id/{id}")
    public List<GroupeUtilisateur> findByEtatUtilisateurId(@PathVariable Long id){
        return service.findByEtatUtilisateurId(id);
    }
    @Operation(summary = "delete by etatUtilisateur id")
    @DeleteMapping("etatUtilisateur/id/{id}")
    public int deleteByEtatUtilisateurId(@PathVariable Long id){
        return service.deleteByEtatUtilisateurId(id);
    }
    @Operation(summary = "find by roleUtilisateur id")
    @GetMapping("roleUtilisateur/id/{id}")
    public List<GroupeUtilisateur> findByRoleUtilisateurId(@PathVariable Long id){
        return service.findByRoleUtilisateurId(id);
    }
    @Operation(summary = "delete by roleUtilisateur id")
    @DeleteMapping("roleUtilisateur/id/{id}")
    public int deleteByRoleUtilisateurId(@PathVariable Long id){
        return service.deleteByRoleUtilisateurId(id);
    }
    @Operation(summary = "Finds groupeUtilisateurs by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<GroupeUtilisateurDto>> findByCriteria(@RequestBody GroupeUtilisateurCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated groupeUtilisateurs by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody GroupeUtilisateurCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports groupeUtilisateurs by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody GroupeUtilisateurCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets groupeUtilisateur data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody GroupeUtilisateurCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets groupeUtilisateur history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets groupeUtilisateur paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody GroupeUtilisateurHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports groupeUtilisateur history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody GroupeUtilisateurHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets groupeUtilisateur history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody GroupeUtilisateurHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public GroupeUtilisateurRestAdmin (GroupeUtilisateurAdminService service, GroupeUtilisateurConverter converter) {
        super(service, converter);
    }


}
