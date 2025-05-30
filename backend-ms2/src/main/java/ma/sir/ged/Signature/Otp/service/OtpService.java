package ma.sir.ged.Signature.Otp.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.PlainTextMailRequest;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.Signature.Otp.entities.Otp;
import ma.sir.ged.dao.facade.core.otp.otpDao;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import ma.sir.ged.service.facade.admin.doc.AuditAdminService;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OtpService {

    private final otpDao otpDao;
    private final EmailService emailService;
    private final AuditAdminService auditAdminService;

    private final FeatureFlagService featureFlagService;

    @Value("${app.otp.expiry.minutes}")
    private int otpExpiryMinutes;

    @Value("${app.otp.message}")
    private String otpMessageTemplate;

    @Value("${app.otp.subject}")
    private String otpSubject;

    @Value("${app.otp.senderId}")
    private Long otpSender;

    public OtpService(otpDao otpDao,EmailService emailService,AuditAdminService auditAdminService,FeatureFlagService featureFlagService) {
        this.emailService = emailService;
        this.otpDao=otpDao;
        this.auditAdminService=auditAdminService;
        this.featureFlagService=featureFlagService;
    }
    private static GoogleAuthenticator gAuth = new GoogleAuthenticator();

    public boolean isOtpActive() {
        return featureFlagService.isActive("otp");
    }

    public static String generateOTP() {
        GoogleAuthenticatorKey credentials = gAuth.createCredentials();
        int otp = credentials.getVerificationCode();
        return String.format("%06d", otp);
    }

    public Otp generateAndSendOTP() {
        Result result = getResult();

        otpDao.save(result.otp);
        emailService.sendPlainTextEmail(result.request);
        return result.otp;
    }

    private @NotNull Result getResult() {
        Utilisateur currentUser = (Utilisateur) SecurityUtil.getCurrentUser();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);

        // OTP Code
        String otpCode = generateOTP();

        // OTP Message
        PlainTextMailRequest request = new PlainTextMailRequest();
        request.setMessage(otpMessageTemplate.replace("{0}", otpCode).replace("{1}", String.valueOf(otpExpiryMinutes)));
        request.setToEmail(currentUser.getEmail());
        request.setSubject(otpSubject);
        request.setHTML(true);
        request.setSenderId(otpSender);

        // Save OTP
        Otp otp = new Otp();
        otp.setOtp(otpCode);
        otp.setUsername(currentUser.getUsername());
        otp.setExpirationTime(expirationTime);
        Result result = new Result(request, otp);
        return result;
    }

    private static class Result {
        public final PlainTextMailRequest request;
        public final Otp otp;

        public Result(PlainTextMailRequest request, Otp otp) {
            this.request = request;
            this.otp = otp;
        }
    }

    public Otp generateViewDocByNumeroEnregistrementOtp(long documentId) {

        Result result = getResult();

        Map<String, String> metadata = result.otp.getMetadata();
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put("documentId", String.valueOf(documentId));
        metadata.put("otpType", "viewDocByNumeroEnregistrement");
        result.otp.setMetadata(metadata);

        otpDao.save(result.otp);
        emailService.sendPlainTextEmail(result.request);

//        auditAdminService.saveAudit(documentId,"");
        return result.otp;
    }

    public Otp generateSignatureOtp(long documentId) {

        Result result = getResult();

        Map<String, String> metadata = result.otp.getMetadata();
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put("documentId", String.valueOf(documentId));
        metadata.put("otpType", "signatureDoc");
        result.otp.setMetadata(metadata);

        otpDao.save(result.otp);
        emailService.sendPlainTextEmail(result.request);

//        auditAdminService.saveAudit(documentId,"");
        return result.otp;
    }

    public Otp generateSignatureOtpMasse(long parapheurId) {

        Result result = getResult();

        Map<String, String> metadata = result.otp.getMetadata();
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put("parapheurId", String.valueOf(parapheurId));
        metadata.put("otpType", "signatureDocMasse");
        result.otp.setMetadata(metadata);

        otpDao.save(result.otp);
        emailService.sendPlainTextEmail(result.request);

//        auditAdminService.saveAudit(documentId,"");
        return result.otp;
    }

    public Otp generateSignatureCreationOtp() {

        Result result = getResult();

        Map<String, String> metadata = result.otp.getMetadata();
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put("otpType", "signatureCreation");
        result.otp.setMetadata(metadata);

        otpDao.save(result.otp);
        emailService.sendPlainTextEmail(result.request);

//        auditAdminService.saveAudit(documentId,"");
        return result.otp;
    }

    public boolean validateOTP(String otp) {
        Utilisateur currentUser = (Utilisateur) SecurityUtil.getCurrentUser();
        List<Otp> otpBoList = otpDao.findByOtpAndUsername(otp, currentUser != null ? currentUser.getUsername() : null);

        return CollectionUtils.emptyIfNull(otpBoList)
                .stream().max(Comparator.comparing(Otp::getCreatedOn))
                .map(otpBo -> {
                    boolean isValid = LocalDateTime.now().isBefore(otpBo.getExpirationTime());
                    if (isValid && !otpBo.isUsed()) {
                        otpBo.setUsed(true);
                        otpDao.save(otpBo);

                        if (otpBo.getMetadata() != null) {
                            String otpType = otpBo.getMetadata().get("otpType");
                            if (otpType != null) {
                                long documentId;
                                switch (otpType) {
                                    case "signatureDoc":
                                        documentId = Long.parseLong(otpBo.getMetadata().get("documentId"));
//                                        auditAdminService.saveAudit(documentId,"Signature");
                                        break;
                                    case "viewDocByNumeroEnregistrement":
                                        documentId = Long.parseLong(otpBo.getMetadata().get("documentId"));
                                        auditAdminService.saveAudit(documentId,"Consulter avec Otp");
                                        break;

                                    case "signatureCreation":
//                                        auditAdminService.saveAudit(documentId,"Consulter avec Otp");
                                        break;
                                }
                            }
                        }

                    }
                    return isValid;
                })
                .orElse(false);
    }

}
