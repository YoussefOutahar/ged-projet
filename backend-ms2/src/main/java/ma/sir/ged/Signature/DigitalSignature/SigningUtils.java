package ma.sir.ged.Signature.DigitalSignature;

import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfSignatureAppearance;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.security.*;
import ma.sir.ged.Signature.DigitalSignature.entity.SignatureInfo;
import ma.sir.ged.Signature.DigitalSignature.service.KeyStoreService;
import ma.sir.ged.Signature.DigitalSignature.service.SigningService;
import org.bouncycastle.asn1.ASN1Primitive;
import org.bouncycastle.asn1.ASN1UTCTime;
import org.bouncycastle.asn1.cms.Attribute;
import org.bouncycastle.asn1.cms.AttributeTable;
import org.bouncycastle.asn1.cms.CMSAttributes;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cms.*;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.cms.jcajce.JcaSignerInfoVerifierBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.util.Store;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Component
public class SigningUtils {

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(SigningUtils.class);

    public X509Certificate generateX509CertificateWithPassword(String username, String password, KeyStoreService keyStoreService) {
        try {
            KeyPair keyPair = keyStoreService.generateKeyPair();
            X509Certificate certificate = keyStoreService.generateSelfSignedCertificate(keyPair, "Yandoc",username);

            keyStoreService.saveKeyPair(username, password, keyPair, certificate);
            return certificate;
        } catch (Exception e) {
            System.out.println("Error while generating certificate for user: " + e.getMessage());
            return null;
        }
    }

    public byte[] signDataWithX509Certificate(byte[] data, X509Certificate signingCertificate, PrivateKey signingKey) throws Exception {
        List<X509Certificate> certList = new ArrayList<>();
        CMSTypedData cmsData = new CMSProcessableByteArray(data);
        certList.add(signingCertificate);
        Store certs = new JcaCertStore(certList);

        CMSSignedDataGenerator cmsGenerator = new CMSSignedDataGenerator();
        cmsGenerator.setDefiniteLengthEncoding(true);
        ContentSigner contentSigner = new JcaContentSignerBuilder("SHA256withRSA").build(signingKey);

        cmsGenerator.addSignerInfoGenerator(new JcaSignerInfoGeneratorBuilder(
                new JcaDigestCalculatorProviderBuilder().setProvider("BC").build()).build(contentSigner, signingCertificate));

        cmsGenerator.addCertificates(certs);

        CMSSignedData cms = cmsGenerator.generate(cmsData, true);

        return cms.getEncoded();
    }

    public byte[] signPAdES(byte[] pdfToSign, String keyAlias, String keyPassword, KeyStore ks) throws Exception {
        BouncyCastleProvider provider = new BouncyCastleProvider();
        Security.addProvider(provider);

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

    public boolean validateSignedData(byte[] signedData) throws Exception {
        try {
            CMSSignedData cmsSignedData = new CMSSignedData(signedData);
            Store<X509CertificateHolder> certStore = cmsSignedData.getCertificates();
            SignerInformationStore signers = cmsSignedData.getSignerInfos();
            SignerInformation signer = signers.getSigners().iterator().next();
            Collection<X509CertificateHolder> certCollection = certStore.getMatches(signer.getSID());
            X509CertificateHolder certHolder = certCollection.iterator().next();

            JcaSignerInfoVerifierBuilder verifierBuilder = new JcaSignerInfoVerifierBuilder(
                    new JcaDigestCalculatorProviderBuilder().setProvider("BC").build());
            return signer.verify(verifierBuilder.build(certHolder));
        } catch (CMSException e) {
            logger.error("IOException while validating signed data", e);
        }
        return false;
    }

    public SignatureInfo getSignatureInfo(byte[] signedData) {
        try {
            CMSSignedData cmsSignedData = new CMSSignedData(signedData);
            SignerInformationStore signers = cmsSignedData.getSignerInfos();
            if (signers.getSigners().isEmpty()) {
                return null;
            }
            SignerInformation signer = signers.getSigners().iterator().next();
            X509CertificateHolder certHolder = getCertificateHolder(cmsSignedData, signer);
            // X509Certificate cert = new JcaX509CertificateConverter().getCertificate(certHolder);

            SignatureInfo signatureInfo = new SignatureInfo();
            setSignatureAttributes(signatureInfo, signer);
            setCertificateAttributes(signatureInfo, certHolder);
            setSigningTime(signatureInfo, signer);

            return signatureInfo;
        } catch (CMSException e) {
            logger.error("CMSException processing signed data");
            return null;
        } catch (ParseException e) {
            logger.error("ParseException parsing signing time", e);
            return null;
        }
    }

    private X509CertificateHolder getCertificateHolder(CMSSignedData cmsSignedData, SignerInformation signer) throws CMSException {
        Store<X509CertificateHolder> certStore = cmsSignedData.getCertificates();
        Collection<X509CertificateHolder> certCollection = certStore.getMatches(signer.getSID());
        return certCollection.iterator().next();
    }

    private void setSignatureAttributes(SignatureInfo signatureInfo, SignerInformation signer) {
        signatureInfo.setSignatureAlgorithm(signer.getEncryptionAlgOID());
        signatureInfo.setSignature(signer.getSignature());
        signatureInfo.setSignedAttributes(signer.getSignedAttributes());
        signatureInfo.setUnsignedAttributes(signer.getUnsignedAttributes());
    }

    private void setCertificateAttributes(SignatureInfo signatureInfo, X509CertificateHolder certHolder) {
        signatureInfo.setIssuer(certHolder.getIssuer().toString());
        signatureInfo.setSubject(certHolder.getSubject().toString());
        signatureInfo.setSerialNumber(certHolder.getSerialNumber().toString());
        signatureInfo.setValidFrom(certHolder.getNotBefore());
        signatureInfo.setValidTo(certHolder.getNotAfter());
    }

    private void setSigningTime(SignatureInfo signatureInfo, SignerInformation signer) throws ParseException {
        AttributeTable signedAttributes = signer.getSignedAttributes();
        if (signedAttributes != null) {
            Attribute signingTimeAttr = signedAttributes.get(CMSAttributes.signingTime);
            if (signingTimeAttr != null) {
                ASN1Primitive signingTimeAsn1 = signingTimeAttr.getAttrValues().getObjectAt(0).toASN1Primitive();
                Date signingTime = new Date(((ASN1UTCTime) signingTimeAsn1).getDate().getTime());
                signatureInfo.setSigningTime(signingTime);
            }
        }
    }
}
