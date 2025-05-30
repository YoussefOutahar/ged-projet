package ma.sir.ged.Signature.Otp.controller;

import ma.sir.ged.Signature.Otp.service.OtpService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService=otpService;
    }

    @GetMapping("/is-active")
    public boolean isOtpActive() {
        return otpService.isOtpActive();
    }

    @GetMapping("/generate-otp-view-doc-enregistrement")
    public void generateOTPViewDocEnregistrement(@RequestParam long docId) {
        otpService.generateViewDocByNumeroEnregistrementOtp(docId);
    }

    @GetMapping("/generate-otp-signature")
    public void generateOTPSignature(@RequestParam long docId) {
        otpService.generateSignatureOtp(docId);
    }

    @GetMapping("/generate-otp-signature-masse")
    public void generateOTPSignatureMasse(@RequestParam long parapheurId) {
        otpService.generateSignatureOtpMasse(parapheurId);
    }

    @GetMapping("/generate-otp-signature-creation")
    public void generateOTPSignatureCreation() {
        otpService.generateSignatureCreationOtp();
    }

    @GetMapping("/generate-otp")
    public void generateOTP() {
        otpService.generateAndSendOTP();
    }

    @PostMapping("/validate-otp")
    public boolean validateOTP(@RequestParam String otp) {
        return otpService.validateOTP(otp);
    }
}
