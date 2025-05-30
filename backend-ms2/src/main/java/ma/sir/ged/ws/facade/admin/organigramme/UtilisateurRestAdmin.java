package ma.sir.ged.ws.facade.admin.organigramme;

import io.swagger.v3.oas.annotations.Operation;

import ma.sir.ged.Email.UseCases.UsersEmails;
import ma.sir.ged.Licence.Service.LicenceValidator;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.history.UtilisateurHistory;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import ma.sir.ged.zynerator.dto.AuditEntityDto;
import ma.sir.ged.zynerator.exception.EntityAlreadyExistsException;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.web.multipart.MultipartFile;
import ma.sir.ged.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/admin/utilisateur/")
public class UtilisateurRestAdmin  extends AbstractController<Utilisateur, UtilisateurDto, UtilisateurHistory, UtilisateurCriteria, UtilisateurHistoryCriteria, UtilisateurAdminService, UtilisateurConverter> {

    @Autowired
    private UtilisateurAdminService utilisateurAdminService;

    @Autowired
    private LicenceValidator licenceValidator;

    @Operation(summary = "upload one utilisateur")
    @PostMapping(value = "upload", consumes = "multipart/form-data")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<FileTempDto> uploadFileAndGetChecksum(@RequestBody MultipartFile file) throws Exception {
        return super.uploadFileAndGetChecksum(file);
    }

    @Operation(summary = "upload multiple utilisateurs")
    @PostMapping(value = "upload-multiple", consumes = "multipart/form-data")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<List<FileTempDto>> uploadMultipleFileAndGetChecksum(@RequestBody MultipartFile[] files) throws Exception {
        return super.uploadMultipleFileAndGetChecksum(files);
    }

    @Operation(summary = "Finds a list of all utilisateurs")
    @GetMapping("")
    @Cacheable(value = "utilisateur")
    public ResponseEntity<List<UtilisateurDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds an optimized list of all utilisateurs")
    @GetMapping("optimized")
    @Cacheable(value = "utilisateur")
    public ResponseEntity<List<UtilisateurDto>> findAllOptimized() throws Exception {
        return super.findAllOptimized();
    }

    @Operation(summary = "Finds a utilisateur by id")
    @GetMapping("id/{id}")
    @Cacheable(value = "utilisateur")
    public ResponseEntity<UtilisateurDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }

    @Operation(summary = "Saves the specified  utilisateur")
    @PostMapping("")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<UtilisateurDto> save(@RequestBody UtilisateurDto dto) throws Exception {

        int maxUsers = licenceValidator.getNumberOfUsers();
        int nbrOfUsers = utilisateurAdminService.countNumberOfUsers();
        if (nbrOfUsers >= maxUsers) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }

        if(Objects.nonNull(dto.getUsername())){
            Utilisateur userByUsername = utilisateurAdminService.findByUsername(dto.getUsername());
            if(Objects.nonNull(userByUsername)){
                throw new EntityAlreadyExistsException("Utilisateur ayant username = "+dto.getUsername()+" exist déjà");
            }
        }

        UtilisateurDto CreatedUser = super.save(dto).getBody();

        if (CreatedUser != null) {
            UsersEmails.sendUserCreationMail(CreatedUser, dto.getPassword(), dto.getEmail());
        } else {
            throw new RuntimeException("User could not be created");
        }

        return new ResponseEntity<>(CreatedUser, HttpStatus.CREATED);
    }

    @Operation(summary = "Updates the specified  utilisateur")
    @PutMapping("")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<UtilisateurDto> update(@RequestBody UtilisateurDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete list of utilisateur")
    @PostMapping("multiple")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<List<UtilisateurDto>> delete(@RequestBody List<UtilisateurDto> listToDelete) throws Exception {
        return super.delete(listToDelete);
    }
    @Operation(summary = "Delete the specifie d utilisateur")
    @DeleteMapping("")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<UtilisateurDto> delete(@RequestBody UtilisateurDto dto) throws Exception {
            return super.delete(dto);
    }

    @Operation(summary = "Delete the specified utilisateur")
    @DeleteMapping("id/{id}")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }

    @Operation(summary = "Delete multiple utilisateurs by ids")
    @DeleteMapping("multiple/id")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public ResponseEntity<List<Long>> deleteByIdIn(@RequestBody List<Long> ids) throws Exception {
            return super.deleteByIdIn(ids);
     }


    @Operation(summary = "find by gender id")
    @GetMapping("gender/id/{id}")
    @Cacheable(value = "utilisateur")
    public List<Utilisateur> findByGenderId(@PathVariable Long id){
        return service.findByGenderId(id);
    }

    @Operation(summary = "delete by gender id")
    @DeleteMapping("gender/id/{id}")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public int deleteByGenderId(@PathVariable Long id){
        return service.deleteByGenderId(id);
    }

    @Operation(summary = "find by entiteAdministrative id")
    @GetMapping("entiteAdministrative/id/{id}")
    @Cacheable(value = "utilisateur")
    public List<Utilisateur> findByEntiteAdministrativeId(@PathVariable Long id){
        return service.findByEntiteAdministrativeId(id);
    }

    @Operation(summary = "delete by entiteAdministrative id")
    @DeleteMapping("entiteAdministrative/id/{id}")
    @CacheEvict(value = "utilisateur", allEntries = true)
    public int deleteByEntiteAdministrativeId(@PathVariable Long id){
        return service.deleteByEntiteAdministrativeId(id);
    }
    
    @Operation(summary = "find by username")
    @GetMapping("findByUsername/{username}")
    @Cacheable(value = "utilisateur")
    public Utilisateur findByUsername(@PathVariable String username){
        return service.findByUsername(username);
    }

    @Operation(summary = "Finds utilisateurs by criteria")
    @PostMapping("find-by-criteria")
    @Cacheable(value = "utilisateur")
    public ResponseEntity<List<UtilisateurDto>> findByCriteria(@RequestBody UtilisateurCriteria criteria) throws Exception {
        return super.findByCriteria(criteria);
    }

    @Operation(summary = "Finds paginated utilisateurs by criteria")
    @PostMapping("find-paginated-by-criteria")
    @Cacheable(value = "utilisateur")
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
    public UtilisateurRestAdmin (UtilisateurAdminService service, UtilisateurConverter converter) {
        super(service, converter);
    }

    @GetMapping("{id}/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable Long id) {
        Utilisateur user = service.findById(id);
        if (user != null && user.getProfilePicture() != null) {
            byte[] imageBytes = user.getProfilePicture().getImageBytes();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("{userId}/update-profile-picture")
    public ResponseEntity<?> updateProfilePicture(@PathVariable Long userId, @RequestBody MultipartFile file) {
        try {
            utilisateurAdminService.updateProfilePicture(userId, file);
            return ResponseEntity.ok().build();
        } catch (IOException | SQLException e) {
            return ResponseEntity.badRequest().body("Error updating profile picture: " + e.getMessage());
        }
    }

    @DeleteMapping("{userId}/delete-profile-picture")
    public ResponseEntity<?> deleteProfilePicture(@PathVariable Long userId) {
        utilisateurAdminService.deleteProfilePicture(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("{id}/signature")
    public ResponseEntity<String> getSignature(@PathVariable Long id) {
        Utilisateur user = service.findById(id);
        if (user != null) {
            if (user.getSignature() != null) {
                String svgData = user.getSignature().getSignature();
                return new ResponseEntity<>(svgData, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("", HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("{userId}/update-signature")
    public ResponseEntity<?> updateSignature(@PathVariable Long userId, @RequestBody String svgData) {
        utilisateurAdminService.updateSignature(userId, svgData);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{userId}/delete-signature")
    public ResponseEntity<?> deleteSignature(@PathVariable Long userId) {
        utilisateurAdminService.deleteSignature(userId);
        return ResponseEntity.ok().build();
    }
}
