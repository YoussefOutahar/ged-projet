package ma.sir.ged.Licence.Controller;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Licence.Beans.Licence;
import ma.sir.ged.Licence.Controller.DTO.LicenceCreationRequest;
import ma.sir.ged.Licence.Controller.DTO.LicencePackage;
import ma.sir.ged.Licence.Controller.DTO.LicenceUserDTO;
import ma.sir.ged.Licence.Service.LicenceEncryptionService;
import ma.sir.ged.Licence.Service.LicenceService;
import ma.sir.ged.Licence.Service.LicenceValidator;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import ma.sir.ged.zynerator.security.service.facade.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/licences")
@RequiredArgsConstructor
public class LicenceController {

    private static final Logger logger = LoggerFactory.getLogger(LicenceController.class);

    private final LicenceService licenceService;
    private final LicenceValidator licenceValidator;
    private final LicenceEncryptionService licenceEncryptionService;
    private final UserService userService;

    @PostMapping
    public Licence createLicence(@RequestParam String licenceKey) {
        return licenceService.createLicence(licenceKey);
    }

    @DeleteMapping("/{id}")
    public boolean deleteLicence(@PathVariable Long id) {
        return licenceService.deleteLicence(id);
    }

    @PostMapping("/validateCurrentLicence")
    public ResponseEntity<String> validateCurrentLicence() {
        Utilisateur user = (Utilisateur) SecurityUtil.getCurrentUser();

        if (licenceValidator.validateLicence(user)) {
            return ResponseEntity.ok("Licence is valid");
        } else {
            return ResponseEntity.status(418).body("Licence is not valid");
        }
    }

    @PostMapping("/validateLicence")
    public ResponseEntity<String> validateLicence(@RequestParam String licenceKey) {
        if (licenceValidator.validateLicence(licenceKey)) {
            return ResponseEntity.ok("Licence is valid");
        } else {
            return ResponseEntity.status(418).body("Licence is not valid");
        }
    }

    //    =============================================================================================================

    @PostMapping("/generate-package")
    public void generateLicencePackage(@RequestBody LicenceCreationRequest request, HttpServletResponse response) throws Exception {

        logger.info("Generating licence package for client: {}", request.getClientName());

        LicencePackage licencePackage = licenceService.generateLicencePackage(request);

        response.setContentType(licencePackage.getContentType());
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + licencePackage.getFilename());
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        response.setHeader(HttpHeaders.PRAGMA, "no-cache");
        response.setHeader(HttpHeaders.EXPIRES, "0");

        response.getOutputStream().write(licencePackage.getContent());
        response.getOutputStream().flush();
    }

    @GetMapping("/list-users")
    public List<LicenceUserDTO> listUsers() {
        return userService.findAll().stream()
                .map(user -> LicenceUserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    @PostMapping("/import-package")
    public void importLicencePackage(@RequestParam("file") MultipartFile file) throws Exception {

        logger.info("Importing licence package: {}", file.getOriginalFilename());

        licenceService.importLicencePackage(file);
    }
}
