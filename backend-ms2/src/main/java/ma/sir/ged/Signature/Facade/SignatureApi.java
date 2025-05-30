package ma.sir.ged.Signature.Facade;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Signature.DigitalSignature.entity.SignatureInfo;
import ma.sir.ged.Signature.SignatureService;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/signature")
@RequiredArgsConstructor
public class SignatureApi {
    private final SignatureService signatureService;
    private final FeatureFlagService featureFlagService;

    @GetMapping("/is-remote-signature-active")
    public boolean isRemoteSignatureActive() {
        return signatureService.isRemoteSignatureActive();
    }

    @GetMapping("/validate-signed-document-by-code/{codeValidation}")
    public ResponseEntity<?> validateSignedDocumentByCode(@PathVariable String codeValidation) throws Exception {
        boolean isRemoteActive = featureFlagService.isActive("useRemoteSignature");

        if (isRemoteActive) {
            return ResponseEntity.ok(signatureService.validateSignedDocumentRemote(codeValidation));
        } else {
            return ResponseEntity.ok(signatureService.validateSignedDocument(codeValidation));
        }
    }

    @PostMapping("/validate-signed-document")
    public String validateSignedDocument(@RequestPart MultipartFile file) throws Exception {
        boolean isValid = signatureService.validateSignedDocument(file);
        return isValid ? "Document is valid" : "Document is not valid";
    }

    @PostMapping("/get-signature-info")
    public SignatureInfo getSignatureInfo(
            @RequestPart MultipartFile file
    ) throws Exception {
        return signatureService.getSignatureInfo(file);
    }
}
