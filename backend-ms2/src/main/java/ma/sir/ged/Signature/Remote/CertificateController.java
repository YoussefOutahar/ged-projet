package ma.sir.ged.Signature.Remote;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.Signature.SignatureService;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.service.facade.EncryptionService;
import ma.sir.ged.service.facade.admin.organigramme.UserKeystoreSevice;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.workflow.DTO.UserKeystoreDto;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final SignatureClient signatureClient;
    private final UserKeystoreSevice userKeystoreSevice;
    private final UtilisateurAdminService utilisateurService;
    private final SignatureService signatureService;

    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private SecurityUtil securityUtil;

    @PostMapping("/upload")
    @Operation(summary = "Upload a new certificate",
            description = "Upload a new certificate with specified roles and password")
    public ResponseEntity<UserKeystoreDto> uploadCertificate(@Parameter(description = "Certificate keystore file", required = true)
                                                   @RequestParam("keystore") MultipartFile keystore,
                                                @Parameter(description = "Certificat alias if provided", required = false)
                                                    @RequestParam("alias") String alias,

                                                @Parameter(description = "Set of role names to assign", required = true)
                                                    @RequestParam("roleNames") Set<String> roleNames,

                                                @Parameter(description = "Certificate password", required = true)
                                                    @RequestParam("password") String password
    ) throws IOException {
        try {
            UserKeystoreDto result = signatureClient.addCertificate(keystore, roleNames, password);
            long userId = securityUtil.getCurrentUser().getId();
            signatureService.updateUserCertificat(userId , Long.valueOf(result.getId()));
            String encreptedPassword = encryptionService.encrypt(password);
            result.setPasswordHash(encreptedPassword);
            result.setAlias(alias);
            userKeystoreSevice.createCertificate(result);
            log.info("Certificate uploaded successfully for roles: {}", roleNames);
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            log.error("Error processing keystore file", e);
            throw new IOException("Error processing keystore file: " + e.getMessage());
        }
    }

    @GetMapping("/check-certificate/{id}")
    public ResponseEntity<Boolean> checkIfUserHasCertificate(@PathVariable Long id) throws Exception {
        Utilisateur user = utilisateurService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build(); // Return 404 if user is not found
        }
        Boolean hasCertificate = signatureService.userHasSignAccount(user) && signatureService.userHasCertificate(user);
        return ResponseEntity.ok(hasCertificate);
    }

    @GetMapping
    public ResponseEntity<List<UserKeystoreDto>> getAllCertificates() {
        List<UserKeystoreDto> certificates = userKeystoreSevice.getAllUserKeystore();
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/getKeystoreUsers")
    public ResponseEntity<Page<Utilisateur>> getKeystoreUsers(
            @RequestParam Long keystoreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Page<Utilisateur> users = signatureService.getUtilisateursByKeystoreId(keystoreId, page, size);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/updateUserCertificat")
    public ResponseEntity updateCertificate(
            @RequestParam Long userId,
            @RequestParam(required = false, name = "keystoreId") Long keystoreId
    ) throws BadRequestException {
        signatureService.updateUserCertificat(userId, keystoreId);
        return ResponseEntity.ok().build();
    }
}
