package  ma.sir.ged.ws.facade.collaborateur;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;
import ma.sir.ged.bean.history.EtatUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.EtatUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.EtatUtilisateurHistoryCriteria;
import ma.sir.ged.service.facade.collaborateur.EtatUtilisateurCollaborateurService;
import ma.sir.ged.ws.converter.EtatUtilisateurConverter;
import ma.sir.ged.ws.dto.EtatUtilisateurDto;
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
@RequestMapping("/api/collaborateur/etatUtilisateur/")
public class EtatUtilisateurRestCollaborateur  extends AbstractController<EtatUtilisateur, EtatUtilisateurDto, EtatUtilisateurHistory, EtatUtilisateurCriteria, EtatUtilisateurHistoryCriteria, EtatUtilisateurCollaborateurService, EtatUtilisateurConverter> {



    @Operation(summary = "upload one etatUtilisateur")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }
    @Operation(summary = "upload multiple etatUtilisateurs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all etatUtilisateurs")
    @GetMapping("")
    public ResponseEntity<List<EtatUtilisateurDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all etatUtilisateurs")
    @GetMapping("optimized")
    public ResponseEntity<List<EtatUtilisateurDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a etatUtilisateur by id")
    @GetMapping("id/{id}")
    public ResponseEntity<EtatUtilisateurDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }
    @Operation(summary = "Saves the specified  etatUtilisateur")
    @PostMapping("")
    public ResponseEntity<EtatUtilisateurDto> save(@RequestBody EtatUtilisateurDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Updates the specified  etatUtilisateur")
    @PutMapping("")
    public ResponseEntity<EtatUtilisateurDto> update(@RequestBody EtatUtilisateurDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of etatUtilisateur")
    @PostMapping("multiple")
    public ResponseEntity<List<EtatUtilisateurDto>> delete(@RequestBody List<EtatUtilisateurDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specified etatUtilisateur")
    @DeleteMapping("")
    public ResponseEntity<EtatUtilisateurDto> delete(@RequestBody EtatUtilisateurDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified etatUtilisateur")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @Operation(summary = "Delete multiple etatUtilisateurs by ids")
    @DeleteMapping("multiple/id")
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "Finds etatUtilisateurs by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<EtatUtilisateurDto>> findByCriteria(@RequestBody EtatUtilisateurCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated etatUtilisateurs by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody EtatUtilisateurCriteria criteria) throws Exception {
        return super.findPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports etatUtilisateurs by criteria")
    @PostMapping("export")
    public ResponseEntity<InputStreamResource> export(@RequestBody EtatUtilisateurCriteria criteria) throws Exception {
        return super.export(criteria);
    }

    @Operation(summary = "Gets etatUtilisateur data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody EtatUtilisateurCriteria criteria) throws Exception {
        return super.getDataSize(criteria);
    }

    @Operation(summary = "Gets etatUtilisateur history by id")
    @GetMapping("history/id/{id}")
    public ResponseEntity<AuditEntityDto> findHistoryById(@PathVariable Long id) throws Exception {
        return super.findHistoryById(id);
    }

    @Operation(summary = "Gets etatUtilisateur paginated history by criteria")
    @PostMapping("history-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findHistoryPaginatedByCriteria(@RequestBody EtatUtilisateurHistoryCriteria criteria) throws Exception {
        return super.findHistoryPaginatedByCriteria(criteria);
    }

    @Operation(summary = "Exports etatUtilisateur history by criteria")
    @PostMapping("export-history")
    public ResponseEntity<InputStreamResource> exportHistory(@RequestBody EtatUtilisateurHistoryCriteria criteria) throws Exception {
        return super.exportHistory(criteria);
    }

    @Operation(summary = "Gets etatUtilisateur history data size by criteria")
    @PostMapping("history-data-size")
    public ResponseEntity<Integer> getHistoryDataSize(@RequestBody EtatUtilisateurHistoryCriteria criteria) throws Exception {
        return super.getHistoryDataSize(criteria);
    }

    public EtatUtilisateurRestCollaborateur (EtatUtilisateurCollaborateurService service, EtatUtilisateurConverter converter) {
        super(service, converter);
    }


}
