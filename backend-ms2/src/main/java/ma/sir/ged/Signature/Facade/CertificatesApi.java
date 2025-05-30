package ma.sir.ged.Signature.Facade;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Signature.DigitalSignature.service.KeyStoreService;
import ma.sir.ged.Signature.DigitalSignature.service.SigningService;
import ma.sir.ged.Signature.SignatureService;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.Base64;

@RestController
@RequestMapping("/api/certificate")
@RequiredArgsConstructor
public class CertificatesApi {

    private final SignatureService signatureService;
    private final SigningService signingService;
    private final KeyStoreService keyStoreService;
    private final UtilisateurAdminService utilisateurService;

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(CertificatesApi.class);

    @PostMapping("/generate-certificate")
    public String generateCertificate(
            @RequestPart String username,
            @RequestPart String password
    ) {
        try {
            signingService.generateCertificateForUser(username, password);
            return "Certificate generated successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while generating certificate";
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<String> getUserCertificatePdfs(@PathVariable Long userId) {
        try {
            Utilisateur user = utilisateurService.findById(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            KeyStore keystore = keyStoreService.loadOrCreateKeystore(keyStoreService.getKeyStorePath(), keyStoreService.getKeystorePassword());
            String alias = user.getUsername();

            if (keystore.containsAlias(alias)) {
                X509Certificate cert = (X509Certificate) keystore.getCertificate(alias);
                byte[] pdfBytes = signingService.generateUserCertificatePdf(cert, user);
                String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-Total-Count", "1");

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(base64Pdf);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error generating certificate PDFs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/has-certificate")
    public Boolean userHasCertificate(@RequestParam String username) {
        try {
            Utilisateur user = utilisateurService.findByUsername(username);
            return signatureService.checkAndCreateUserCertificate(user);
        } catch (Exception e) {
            logger.error("Error checking if user has certificate", e);
            return false;
        }
    }

    @DeleteMapping("/{userId}")
    public void deleteCertificate(@PathVariable Long userId) throws Exception {
        signingService.deleteCertificate(userId);
    }

    @PostMapping("/{userId}")
    public String uploadCertificate(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            signingService.uploadCertificate(userId, file);
            return "Certificate uploaded successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while uploading certificate";
        }
    }
}
