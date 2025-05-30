package  ma.sir.ged.ws.facade.collaborateur;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.Groupe;
import ma.sir.ged.bean.history.GroupeHistory;
import ma.sir.ged.dao.criteria.core.GroupeCriteria;
import ma.sir.ged.dao.criteria.history.GroupeHistoryCriteria;
import ma.sir.ged.service.facade.collaborateur.GroupeCollaborateurService;
import ma.sir.ged.ws.converter.GroupeConverter;
import ma.sir.ged.ws.dto.GroupeDto;
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
@RequestMapping("/api/collaborateur/groupe/")
public class GroupeRestCollaborateur  extends AbstractController<Groupe, GroupeDto, GroupeHistory, GroupeCriteria, GroupeHistoryCriteria, GroupeCollaborateurService, GroupeConverter> {



    @Operation(summary = "upload one groupe")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple groupes")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all groupes")
    @GetMapping("")
    public ResponseEntity<List<GroupeDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all groupes")
    @GetMapping("optimized")
    public ResponseEntity<List<GroupeDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a groupe by id")
    @GetMapping("id/{id}")
    public ResponseEntity<GroupeDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  groupe")
    @PostMapping("")
    public ResponseEntity<GroupeDto> save(@RequestBody GroupeDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  groupe")
    @PutMapping("")
    public ResponseEntity<GroupeDto> update(@RequestBody GroupeDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of groupe")
    @PostMapping("multiple")
    public ResponseEntity<List<GroupeDto>> delete(@RequestBody List<GroupeDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified groupe")
    @DeleteMapping("")
    public ResponseEntity<GroupeDto> delete(@RequestBody GroupeDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified groupe")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple groupes by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by utilisateur id")
    @GetMapping("utilisateur/id/{id}")
    public List<Groupe> findByUtilisateurId(@PathVariable Long id){
        return service.findByUtilisateurId(id);
    }
    @Operation(summary = "delete by utilisateur id")
    @DeleteMapping("utilisateur/id/{id}")
    public int deleteByUtilisateurId(@PathVariable Long id){
        return service.deleteByUtilisateurId(id);
    }
    @Operation(summary = "Finds a groupe and associated list by id")
    @GetMapping("detail/id/{id}")
    public ResponseEntity<GroupeDto> findWithAssociatedLists(@PathVariable Long id) {
        return super.findWithAssociatedLists(id);
    }

    @Operation(summary = "Finds groupes by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<GroupeDto>> findByCriteria(@RequestBody GroupeCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated groupes by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody GroupeCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports groupes by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody GroupeCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets groupe data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody GroupeCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets groupe history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets groupe paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody GroupeHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports groupe history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody GroupeHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets groupe history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody GroupeHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public GroupeRestCollaborateur (GroupeCollaborateurService service, GroupeConverter converter) {
        super(service, converter);
    }


}
