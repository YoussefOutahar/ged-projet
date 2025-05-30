package ma.sir.ged.Signature.DigitalSignature.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.security.*;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.Signature.DigitalSignature.SigningUtils;
import ma.sir.ged.Signature.DigitalSignature.entity.SignatureInfo;
import ma.sir.ged.Signature.PdfStampingServices.SvgToImageConverter;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.config.ImplementMultipartFile.ByteArrayMultipartFile;
import ma.sir.ged.dao.facade.core.organigramme.SignatureDao;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import org.apache.commons.compress.utils.IOUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.*;
import java.security.cert.Certificate;

@Service
@RequiredArgsConstructor
public class SigningService implements ISigningService<MultipartFile> {

    private final KeyStoreService keyStoreService;
    private final SigningUtils signingUtils;
    private final UtilisateurAdminService utilisateurService;

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(SigningService.class);

    @Override
    public X509Certificate generateCertificateForUser(String username, String password) {
        return signingUtils.generateX509CertificateWithPassword(username, password, keyStoreService);
    }

    @Override
    public MultipartFile signData(String keyAlias, String keyPassword, MultipartFile data) throws Exception {
        try {
            KeyPair keyPair = keyStoreService.getKeyPair(keyAlias, keyPassword);
            X509Certificate certificate = (X509Certificate) keyStoreService.getCertificate(keyAlias);

            byte[] signedData = signingUtils.signDataWithX509Certificate(data.getBytes(), certificate, keyPair.getPrivate());
            return new ByteArrayMultipartFile(data.getName(), data.getOriginalFilename(), data.getContentType(), signedData);
        } catch (Exception e) {
            logger.error("Error while signing data", e);
            throw e;
        }
    }

    public byte[] signPAdES(byte[] pdfToSign, String keyAlias, String keyPassword) throws Exception {
        BouncyCastleProvider provider = new BouncyCastleProvider();
        Security.addProvider(provider);

        KeyStore ks = keyStoreService.loadOrCreateKeystore(keyAlias, keyPassword);
        PrivateKey pk = (PrivateKey) ks.getKey(keyAlias, keyPassword.toCharArray());
        Certificate[] chain = ks.getCertificateChain(keyAlias);

        PdfReader reader = new PdfReader(pdfToSign);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfStamper stamper = PdfStamper.createSignature(reader, baos, '\0', null, true);

        PdfSignatureAppearance appearance = stamper.getSignatureAppearance();
        appearance.setCertificationLevel(PdfSignatureAppearance.NOT_CERTIFIED);
        appearance.setReason("Digital Signature");
        appearance.setLocation("Document Signing Service");

        ExternalDigest digest = new BouncyCastleDigest();
        ExternalSignature signature = new PrivateKeySignature(pk, DigestAlgorithms.SHA256, provider.getName());
        MakeSignature.signDetached(appearance, digest, signature, chain, null, null, null, 0, MakeSignature.CryptoStandard.CMS);

        stamper.close();
        reader.close();

        return baos.toByteArray();
    }

    @Override
    public boolean validateSignedDataWithKeystore(MultipartFile signedData) throws Exception {
        return signingUtils.validateSignedData(signedData.getBytes());
    }


    @Override
    public SignatureInfo getSignatureInfo(MultipartFile signedData) throws Exception {
        return signingUtils.getSignatureInfo(signedData.getBytes());
    }

    public SignatureInfo getSignatureInfo(byte[] file) {
        return signingUtils.getSignatureInfo(file);
    }

    @Override
    public boolean aliasExists(String alias) throws Exception {
        return keyStoreService.aliasExists(alias);
    }

    public byte[] generateUserCertificatePdf(X509Certificate cert, Utilisateur user) throws Exception {
        String username = user.getGender().getLibelle() + " " + user.getNom() + " " + user.getPrenom();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A5.rotate(), 30, 30, 30, 30);
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();

        BaseColor mainColor = new BaseColor(0, 0, 255);
        BaseColor accentColor = new BaseColor(255, 255, 0);

        // Add background grid
        PdfContentByte canvas = writer.getDirectContentUnder();
        canvas.saveState();
        canvas.setColorStroke(accentColor);
        canvas.setLineWidth(0.5f);
        for (float x = 0; x < PageSize.A5.getHeight(); x += 10) {
            canvas.moveTo(x, 0);
            canvas.lineTo(x, PageSize.A5.getWidth());
        }
        for (float y = 0; y < PageSize.A5.getWidth(); y += 10) {
            canvas.moveTo(0, y);
            canvas.lineTo(PageSize.A5.getHeight(), y);
        }
        canvas.stroke();
        canvas.restoreState();

        // Add logo
        ClassPathResource resource = new ClassPathResource("images/logo-yandoc.png");
        InputStream inputStream = resource.getInputStream();
        Image logo = Image.getInstance(IOUtils.toByteArray(inputStream));
        logo.scaleToFit(50, 50);
        logo.setAbsolutePosition(30, PageSize.A5.getWidth() - 80);
        document.add(logo);

        // Create a container for all content
        PdfPTable container = new PdfPTable(1);
        container.setWidthPercentage(100);
        container.setExtendLastRow(true);

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, mainColor);
        PdfPCell titleCell = new PdfPCell(new Phrase("Certificat de Signature Numérique", titleFont));
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setBorder(PdfPCell.NO_BORDER);
        titleCell.setPaddingBottom(15);
        container.addCell(titleCell);

        // Main content
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);

        PdfPCell contentCell = new PdfPCell();
        contentCell.setBorder(PdfPCell.NO_BORDER);

        Paragraph content = new Paragraph();
        content.add(new Chunk("Le présent document atteste que\n", bodyFont));
        content.add(new Chunk(username + "\n", boldFont));
        content.add(new Chunk("s'est vu délivrer un certificat de signature numérique avec les caractéristiques suivantes :", bodyFont));
        content.setAlignment(Element.ALIGN_CENTER);
        contentCell.addElement(content);
        container.addCell(contentCell);

        // Certificate details table
        PdfPTable detailsTable = new PdfPTable(2);
        detailsTable.setWidthPercentage(80);
        detailsTable.setHorizontalAlignment(Element.ALIGN_CENTER);
        detailsTable.setSpacingBefore(15);
        detailsTable.setSpacingAfter(15);

        addTableRow(detailsTable, "Signataire :", removeCNPrefix(cert.getSubjectX500Principal().getName()), bodyFont, mainColor);
        addTableRow(detailsTable, "Émetteur :", removeCNPrefix(cert.getIssuerX500Principal().getName()), bodyFont, mainColor);
        addTableRow(detailsTable, "Valide à partir du :", formatDate(cert.getNotBefore()), bodyFont, mainColor);
        addTableRow(detailsTable, "Valide jusqu'au :", formatDate(cert.getNotAfter()), bodyFont, mainColor);
        addTableRow(detailsTable, "Numéro de série :", cert.getSerialNumber().toString(), bodyFont, mainColor);

        PdfPCell tableCell = new PdfPCell(detailsTable);
        tableCell.setBorder(PdfPCell.NO_BORDER);
        container.addCell(tableCell);

        // Footer
        PdfPCell footerCell = new PdfPCell(new Phrase("Ce certificat est généré et validé électroniquement.",
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, BaseColor.GRAY)));
        footerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        footerCell.setBorder(PdfPCell.NO_BORDER);
        footerCell.setPaddingTop(15);
        container.addCell(footerCell);

        // Add the container to the document
        document.add(container);

        document.close();

        // Now stamp the signature onto the PDF
        return baos.toByteArray();
    }

    private void addTableRow(PdfPTable table, String key, String value, Font font, BaseColor color) {
        PdfPCell keyCell = new PdfPCell(new Phrase(key, FontFactory.getFont(font.getFamilyname(), font.getSize(), Font.BOLD, color)));
        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        keyCell.setBorder(PdfPCell.NO_BORDER);
        valueCell.setBorder(PdfPCell.NO_BORDER);
        keyCell.setPaddingBottom(5);
        valueCell.setPaddingBottom(5);
        keyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.addCell(keyCell);
        table.addCell(valueCell);
    }

    private String formatDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd MMMM yyyy", Locale.FRANCE);
        return sdf.format(date);
    }

    private String removeCNPrefix(String name) {
        return name.replaceFirst("CN=", "").trim();
    }

    private String svgToBase64Png(String svgContent) throws Exception {
        try {
            BufferedImage pngImage = SvgToImageConverter.convertSvgToPng(svgContent);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(pngImage, "png", baos);
            byte[] pngData = baos.toByteArray();

            return Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            logger.error("Error converting SVG to PNG", e);
            throw new Exception("Error converting SVG to PNG: " + e.getMessage(), e);
        }
    }

    public void deleteCertificate(Long userId) throws Exception {
        Utilisateur user = utilisateurService.findById(userId);
        if (user == null) {
            throw new Exception("User not found");
        }

        KeyStore keystore = keyStoreService.loadOrCreateKeystore(keyStoreService.getKeyStorePath(), keyStoreService.getKeystorePassword());
        keystore.deleteEntry(user.getUsername());
        keyStoreService.saveKeystore(keystore);
    }

    public void uploadCertificate(Long userId, MultipartFile certificateFile) throws Exception {
        Utilisateur user = utilisateurService.findById(userId);
        if (user == null) {
            throw new Exception("User not found");
        }

        X509Certificate cert = keyStoreService.loadCertificateFromFile(certificateFile.getInputStream());
        String alias = user.getUsername() + "-" + System.currentTimeMillis();

        KeyStore keystore = keyStoreService.loadOrCreateKeystore(keyStoreService.getKeyStorePath(), keyStoreService.getKeystorePassword());
        keystore.setCertificateEntry(alias, cert);
        keyStoreService.saveKeystore(keystore);
    }
}
