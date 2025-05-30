package ma.sir.ged.Signature.DigitalSignature.service;

import lombok.Getter;
import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Enumeration;

@Getter
@Service
public class KeyStoreService {
    @Value("${server.ssl.key-store-password}")
    private String keystorePassword;

    @Value("${server.ssl.key-store}")
    private String keyStorePath;

    @Value("${server.ssl.key-store-type}")
    private String keystoreType;

    @Value("${app.signature.validity-days}")
    private int signatureValidityDays;

    static {
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    }

    public KeyStore loadOrCreateKeystore(String keyStorePath, String keystorePassword) throws Exception {
        KeyStore keystore = KeyStore.getInstance(keystoreType);
        File keystoreFile = new File(keyStorePath);
        if (keystoreFile.exists()) {
            try (FileInputStream fis = new FileInputStream(keystoreFile)) {
                keystore.load(fis, keystorePassword.toCharArray());
            }
        } else {
            keystore.load(null, keystorePassword.toCharArray());
        }
        return keystore;
    }

    // Saving to the keystore
    // =======================================================
    public void saveSymetricKey(String keyAlias, String keyPassword, byte[] key) throws Exception {
        KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
        keystore.setKeyEntry(keyAlias, new SecretKeySpec(key, "AES"), keyPassword.toCharArray(), null);
        keystore.store(Files.newOutputStream(Paths.get(keyStorePath)), keystorePassword.toCharArray());
    }

    public void saveKeyPair(String keyAlias, String keyPassword, KeyPair keyPair, Certificate certificate) throws Exception {
        KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
        keystore.setKeyEntry(keyAlias, keyPair.getPrivate(), keyPassword.toCharArray(), new Certificate[]{certificate});
        keystore.store(Files.newOutputStream(Paths.get(keyStorePath)), keystorePassword.toCharArray());
    }

    public void saveTrustedCertificate(String keyAlias, Certificate certificate) throws Exception {
        KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
        keystore.setCertificateEntry(keyAlias, certificate);
        keystore.store(Files.newOutputStream(Paths.get(keyStorePath)), keystorePassword.toCharArray());
    }

    // Loading from the keystore
    // =======================================================
    public SecretKeySpec getSymmetricKey(String keyAlias, String keyPassword) throws Exception {
        try {
            KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
            KeyStore.ProtectionParameter protParam = new KeyStore.PasswordProtection(keyPassword.toCharArray());
            KeyStore.SecretKeyEntry skEntry = (KeyStore.SecretKeyEntry) keystore.getEntry(keyAlias, protParam);
            return (SecretKeySpec) skEntry.getSecretKey();
        } catch (KeyStoreException | UnrecoverableKeyException e) {
            throw new Exception("Invalid key alias or password for symmetric key.");
        }
    }

    public KeyPair getKeyPair(String keyAlias, String keyPassword) throws Exception {
        try {
            KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
            KeyStore.ProtectionParameter protParam = new KeyStore.PasswordProtection(keyPassword.toCharArray());

            KeyStore.PrivateKeyEntry pkEntry = (KeyStore.PrivateKeyEntry) keystore.getEntry(keyAlias, protParam);

            if (pkEntry == null) {
                throw new Exception("Key pair not found in keystore.");
            }

            PrivateKey privateKey = pkEntry.getPrivateKey();
            Certificate cert = pkEntry.getCertificate();
            PublicKey publicKey = cert.getPublicKey();

            return new KeyPair(publicKey, privateKey);
        } catch (KeyStoreException | UnrecoverableKeyException e) {
            throw new Exception("Invalid key alias or password for key pair.");
        }
    }

    public Certificate getCertificate(String keyAlias) throws Exception {
        try {
            KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
            return keystore.getCertificate(keyAlias);
        } catch (KeyStoreException e) {
            throw new Exception("Invalid key alias or password for key pair.");
        }
    }

    // Generating keys
    // =======================================================
    public KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG", "SUN");
        keyPairGenerator.initialize(2048, random);
        return keyPairGenerator.generateKeyPair();
    }

    public X509Certificate generateSelfSignedCertificate(KeyPair keyPair, String issuer, String subject) throws Exception {
        // Create an X.509 certificate
        byte[] encodedPublicKey = keyPair.getPublic().getEncoded();
        SubjectPublicKeyInfo subjectPublicKeyInfo = SubjectPublicKeyInfo.getInstance(
                ASN1Sequence.getInstance(encodedPublicKey));

        X509v3CertificateBuilder certBuilder = new X509v3CertificateBuilder(
                new X500Name("CN=" + issuer),
                BigInteger.valueOf(System.currentTimeMillis()),
                Date.from(Instant.now().minus(1, ChronoUnit.DAYS)),
                Date.from(Instant.now().plus(signatureValidityDays, ChronoUnit.DAYS)),
                new X500Name("CN=" + subject),
                subjectPublicKeyInfo
        );

        // Self-sign the certificate
        ContentSigner contentSigner = new JcaContentSignerBuilder("SHA256WithRSA").build(keyPair.getPrivate());
        return new JcaX509CertificateConverter().getCertificate(certBuilder.build(contentSigner));
    }

    public boolean aliasExists(String alias) throws Exception {
        KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
        return keystore.containsAlias(alias);
    }

    public boolean aliasStartWithExists(String alias) throws Exception {
        KeyStore keystore = loadOrCreateKeystore(keyStorePath, keystorePassword);
        Enumeration<String> aliases = keystore.aliases();
        while (aliases.hasMoreElements()) {
            String aliasName = aliases.nextElement();
            if (aliasName.startsWith(alias)) {
                return true;
            }
        }
        return false;
    }

    public void saveKeystore(KeyStore keystore) throws Exception {
        try (FileOutputStream fos = new FileOutputStream(keyStorePath)) {
            keystore.store(fos, keystorePassword.toCharArray());
        }
    }

    public X509Certificate loadCertificateFromFile(InputStream inputStream) throws Exception {
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        return (X509Certificate) cf.generateCertificate(inputStream);
    }
}
