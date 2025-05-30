package ma.sir.ged.Signature;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.Signature.DigitalSignature.entity.SignatureInfo;
import ma.sir.ged.Signature.DigitalSignature.service.SigningService;
import ma.sir.ged.Signature.PdfStampingServices.SignatureStamperService;
import ma.sir.ged.Signature.QrCode.service.QRCodeService;
import ma.sir.ged.Signature.Remote.*;
import ma.sir.ged.Signature.Remote.Models.SignatureInfoRemote;
import ma.sir.ged.Signature.Remote.Models.SignatureUserDto;
import ma.sir.ged.Signature.Remote.Models.SignedDocumentResponse;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.UserKeystore;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.config.ImplementMultipartFile.ByteArrayMultipartFile;
import ma.sir.ged.dao.facade.core.organigramme.UserKeystoreDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.service.facade.EncryptionService;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UserKeystoreSevice;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentCategorieDto;
import ma.sir.ged.ws.dto.DocumentDto;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SignatureService {
    private final SigningService signingService;
    private final QRCodeService qrCodeService;
    private final SignatureStamperService signatureStamperService;

    private final DocumentAdminService documentService;
    private final DocumentConverter documentConverter;
    private final UtilisateurAdminService utilisateurService;

    private final SignatureUserMapper signatureUserMapper;
    private final UserKeystoreSevice userKeystoreSevice;
    private final FeatureFlagService featureFlagService;
    private final SignatureClient signatureClient;
    private final UserKeystoreDao userKeystoreDao;

    private final EncryptionService encryptionService;
    private final UtilisateurDao utilisateurDao;

    @Value("${front.pages.url}")
    private String frontURL;

    @Value("${app.signature.validity-days}")
    private int signatureValidityDays;

    private final static String verificationAndDownloadUrl = "/verify-signature";

    private static final String CERTIFICATE_CATEGORY = "Certificat Authorisation";

    public boolean isRemoteSignatureActive() {
        return featureFlagService.isActive("useRemoteSignature");
    }

    public void generateCertificate(String username, String password) {
        X509Certificate cert = signingService.generateCertificateForUser(username, password);
        cert.getSubjectDN().getName();
    }

   public boolean userHasCertificate(Utilisateur user) {
        if (user == null) {
            return false;
        }

       SignatureUserDto userData = signatureClient.getCertifByUser(user.getId().toString());
       return userData.getKeystoreFileName() != null;
   }

    public boolean userHasSignAccount(Utilisateur user) {
        if (user == null) {
            return false;
        }

        SignatureUserDto userData = signatureClient.getCertifByUser(user.getId().toString());
        return userData != null;
    }

    public boolean checkAndCreateUserCertificate(Utilisateur user) throws Exception {
        boolean isRemoteSignatureEnabled = featureFlagService.isActive("useRemoteSignature");
        if (isRemoteSignatureEnabled) {

            boolean hascertificate = userHasCertificate(user);
            UserKeystore userKeystore = userKeystoreSevice.findLastUserKeystore();

            if(!hascertificate && userKeystore != null){

                if (!userHasSignAccount(user)) {
                    SignatureUserDto userDto = signatureClient.createUser(signatureUserMapper.toDto(user));
                    userDto.setCertificateId(userKeystore.getReferenceId());

                    byte[] signImageBytes;
                    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                        ImageIO.write(signatureStamperService.getUserSignatureImage(user), "png", baos);
                        signImageBytes = baos.toByteArray();
                    }
                    userDto.setSignImageBase64(Base64.getEncoder().encodeToString(signImageBytes));
                    signatureClient.updateUser(userDto);
                    user.setCertificate(userKeystore);
                    utilisateurService.update(user);
                } else {
                    if(!userHasCertificate(user) ){
                        SignatureUserDto userDto = signatureClient.getCertifByUser(user.getId().toString());
                        userDto.setCertificateId(userKeystore.getReferenceId());

                        byte[] signImageBytes;
                        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                            ImageIO.write(signatureStamperService.getUserSignatureImage(user), "png", baos);
                            signImageBytes = baos.toByteArray();
                        }
                        userDto.setSignImageBase64(Base64.getEncoder().encodeToString(signImageBytes));
                        signatureClient.updateUser(userDto);
                        user.setCertificate(userKeystore);
                        utilisateurService.update(user);
                    }
                }
            }

            return true;
        } else {
            return signingService.aliasExists(user.getUsername());
        }
    }

    public byte[] signDocument(
            MultipartFile file,
            DocumentDto document,
            Utilisateur user,
            String password
    ) throws Exception {
        boolean isRemoteSignatureEnabled = featureFlagService.isActive("useRemoteSignature");

        LocalDate validityDate = LocalDate.now().plusDays(signatureValidityDays);
        String certificateValidityDate = validityDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        String validationCode = String.valueOf(SecureRandom.getInstanceStrong().nextInt(1000000000));
        document.setDocumentSignatureCode(validationCode);
        documentService.update(documentConverter.toItem(document));

        String qrCodeUrl = frontURL+ verificationAndDownloadUrl + "?validationcode=" + validationCode;

        if (isRemoteSignatureEnabled) {
            byte[] updatedFile = signatureStamperService.addTextInFrontOfOtherText(file.getBytes(), "valable jusqu’au", certificateValidityDate);
            MultipartFile multipartFile = new ByteArrayMultipartFile(file.getName(), file.getOriginalFilename(), file.getContentType(), updatedFile);

            UserKeystore keystore = userKeystoreDao.findTopByOrderByIdDesc();
            SignedDocumentResponse signatureResponse = signatureClient.signDocument(
                    multipartFile,
                    user.getId().toString(),
                    encryptionService.decrypt(keystore.getPassword()),
                    "Code de verification: " + validationCode,
                    qrCodeUrl
            );

            byte[] signedDocument = signatureClient.downloadDocument(signatureResponse.getDocument().getId().toString());
            documentService.updateDocumentFile(new ByteArrayMultipartFile(file.getName(), file.getOriginalFilename(), file.getContentType(), signedDocument), document);
            return signedDocument;
        } else {
            String username = (user != null ?
                    (user.getGender() != null ? user.getGender().getLibelle() : "") + " " +
                            (user.getNom() != null ? user.getNom() : "---------") + " " +
                            (user.getPrenom() != null ? user.getPrenom() : "---------")
                    : "");

            byte[] qrCodeImage = qrCodeService.generateQRCode(qrCodeUrl, 100, 100);

            LocalDateTime now = LocalDateTime.now();

            byte[] fileWithQRCode = qrCodeService.addQrCodeAndSignatureInfo(file.getBytes() , qrCodeImage, null, now, username,validationCode, 30, 30, 80, 63);

            if (isCertificateDocument(Objects.requireNonNull(document))) {
                fileWithQRCode = signatureStamperService.addTextInFrontOfOtherText(fileWithQRCode, "valable jusqu’au", certificateValidityDate);
            }

            MultipartFile fileWithQRCodePdf = new ByteArrayMultipartFile(file.getName(), file.getOriginalFilename(), "application/pdf", fileWithQRCode);
            MultipartFile signedDoc = signingService.signData(Objects.requireNonNull(user).getUsername(), password, fileWithQRCodePdf);
            documentService.updateDocumentFile(signedDoc, document);

            return signedDoc.getBytes();
        }
    }

    public SignatureInfo validateSignedDocument(String validationCode) throws Exception {
        Document document = documentService.findBySignatureValidationCode(validationCode);
        byte[] file = documentService.downloadFileFromService(document.getId(), null);

        SignatureInfo signatureInfo = signingService.getSignatureInfo(file);
        signatureInfo.setGedReference(document.getReferenceGed());
        signatureInfo.setDocumentId(document.getId());
        return signatureInfo;
    }

    public List<SignatureInfoRemote> validateSignedDocumentRemote(String validationCode) throws Exception {
        Document document = documentService.findBySignatureValidationCode(validationCode);
        byte[] file = documentService.downloadFileFromService(document.getId(), null);

        List<SignatureInfoRemote> signatureInfoRemote = signatureClient.getSignatureInfoRemote(file);
        for (SignatureInfoRemote info : signatureInfoRemote) {
            if (info != null) {
                info.setGedReference(document.getReferenceGed());
                info.setDocumentId(document.getId());
            }
        }
        return signatureInfoRemote;
    }

    public boolean validateSignedDocument(MultipartFile file) throws Exception {
        return signingService.validateSignedDataWithKeystore(file);
    }

    public SignatureInfo getSignatureInfo(MultipartFile file) throws Exception {
        return signingService.getSignatureInfo(file);
    }

    private boolean isCertificateDocument(DocumentDto document) {
        DocumentCategorieDto category = document.getDocumentCategorie();
        return category != null &&
                (CERTIFICATE_CATEGORY.equalsIgnoreCase(category.getCode()) ||
                        CERTIFICATE_CATEGORY.equalsIgnoreCase(category.getLibelle()));
    }

    public Page<Utilisateur> getUtilisateursByKeystoreId(Long keystoreId, int page, int size) {
        Page<SignatureUserDto> keystoreUsers = signatureClient.getUsersByKeystoreId(page, size, keystoreId);
        List<Utilisateur> users = keystoreUsers.getContent().stream()
                .map(signatureUserDto -> {
                    return utilisateurService.findById(Long.parseLong(signatureUserDto.getGedIdentifier()));
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return new PageImpl<>(users, PageRequest.of(page, size), keystoreUsers.getTotalElements());
    }

    public void checkOrCreateUserSigningAccount(Long userId) throws BadRequestException {
        SignatureUserDto signatureUserDto = signatureClient.getUserByGedIdentifier(userId.toString());
        if (signatureUserDto == null) {
            Utilisateur user = utilisateurService.findById(userId);
            if (user == null) {
                throw new BadRequestException("User not found");
            }
            signatureClient.createUser(signatureUserMapper.toDto(user));
        }

    }

    @Transactional
    public void updateUserCertificat(Long userId, Long certificateId) throws BadRequestException {
        checkOrCreateUserSigningAccount(userId);
        String certificateIdStr = "";
        if (certificateId != null) {
            certificateIdStr = certificateId.toString();
        }
        signatureClient.updateUserCertificat(userId.toString(), certificateIdStr);

    }
}
