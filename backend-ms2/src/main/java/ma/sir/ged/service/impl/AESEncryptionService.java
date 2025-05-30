package ma.sir.ged.service.impl;

import ma.sir.ged.service.facade.EncryptionService;
import org.bouncycastle.openssl.EncryptionException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class AESEncryptionService implements EncryptionService {
    @Value("${encryption.secret.key}")
    private String secretKey;

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int TAG_LENGTH_BIT = 128;
    private static final int IV_LENGTH_BYTE = 12;


    @Override
    public String encrypt(String data) throws EncryptionException {
        try {
            if (data == null || data.trim().isEmpty()) {
                throw new IllegalArgumentException("Data to encrypt cannot be null or empty");
            }

            byte[] iv = generateIv();
            SecretKey key = generateKey();
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, spec);

            byte[] cipherText = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            byte[] encrypted = ByteBuffer.allocate(iv.length + cipherText.length)
                    .put(iv)
                    .put(cipherText)
                    .array();
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (IllegalArgumentException e) {
            throw new EncryptionException("Invalid input for encryption: " + e.getMessage(), e);
        } catch (GeneralSecurityException e) {
            throw new EncryptionException("Failed to encrypt data", e);
        }
    }

    @Override
    public String decrypt(String encryptedData) throws EncryptionException {
        try {
            if (encryptedData == null || encryptedData.trim().isEmpty()) {
                throw new IllegalArgumentException("Encrypted data cannot be null or empty");
            }

            byte[] decoded = Base64.getDecoder().decode(encryptedData);
            if (decoded.length < IV_LENGTH_BYTE) {
                throw new IllegalArgumentException("Invalid encrypted data format");
            }

            ByteBuffer bb = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[IV_LENGTH_BYTE];
            bb.get(iv);
            byte[] cipherText = new byte[bb.remaining()];
            bb.get(cipherText);

            SecretKey key = generateKey();
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, spec);

            byte[] plainText = cipher.doFinal(cipherText);
            return new String(plainText, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            throw new EncryptionException("Invalid input for decryption: " + e.getMessage(), e);
        } catch (GeneralSecurityException e) {
            throw new EncryptionException("Failed to decrypt data", e);
        }
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(secretKey);
        return new SecretKeySpec(decodedKey, "AES");
    }

    private byte[] generateIv() {
        byte[] iv = new byte[IV_LENGTH_BYTE];
        new SecureRandom().nextBytes(iv);
        return iv;
    }
}
