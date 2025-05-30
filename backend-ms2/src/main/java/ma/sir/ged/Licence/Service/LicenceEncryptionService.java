package ma.sir.ged.Licence.Service;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Licence.Beans.Licence;
import ma.sir.ged.Licence.Beans.LicenceKeyField;
import ma.sir.ged.Licence.Config.LicenceSecurityConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LicenceEncryptionService {

    private static final Logger logger = LoggerFactory.getLogger(LicenceEncryptionService.class);

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    private final LicenceSecurityConfig securityConfig;

    public String encrypt(String data) throws Exception {
        byte[] iv = new byte[GCM_IV_LENGTH];
        SecureRandom random = SecureRandom.getInstanceStrong();
        random.nextBytes(iv);

        SecretKey key = new SecretKeySpec(securityConfig.getEncryptionKey(), "AES");
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        byte[] encryptedData = cipher.doFinal(data.getBytes());
        ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encryptedData.length);
        byteBuffer.put(iv);
        byteBuffer.put(encryptedData);

        return Base64.getEncoder().encodeToString(byteBuffer.array());
    }

    public String decrypt(String encryptedData) throws Exception {
        byte[] decoded = Base64.getDecoder().decode(encryptedData);

        ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
        byte[] iv = new byte[GCM_IV_LENGTH];
        byteBuffer.get(iv);
        byte[] cipherText = new byte[byteBuffer.remaining()];
        byteBuffer.get(cipherText);

        // Use the extracted encryption key instead of raw master key
        SecretKey key = new SecretKeySpec(securityConfig.getEncryptionKey(), "AES");
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        return new String(cipher.doFinal(cipherText));
    }

    public Map<LicenceKeyField, String> getLicenceKeyParts(String licenceKey) {
        try {
            String decryptedKey = decrypt(licenceKey);
            Map<LicenceKeyField, String> keyParts = new EnumMap<>(LicenceKeyField.class);
            String[] parts = decryptedKey.split("-");

            if (parts.length >= 4) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
                LocalDate licenceExpirationDate = LocalDate.parse(parts[1], formatter);

                keyParts.put(LicenceKeyField.CLIENT_NAME, parts[0]);
                keyParts.put(LicenceKeyField.EXPIRATION_DATE, licenceExpirationDate.toString());
                keyParts.put(LicenceKeyField.NUMBER_OF_USERS, parts[2]);
                keyParts.put(LicenceKeyField.MAX_SESSIONS_PER_USER, parts[3]);
            }

            return keyParts;
        } catch (Exception e) {
            logger.error("Error while decrypting licence key", e);
        }
        return Collections.emptyMap();
    }

    /**
     * Creates a licence key string from the given parameters
     * @param clientName The name of the client
     * @param expirationDate The expiration date in yyyy/MM/dd format
     * @param numberOfUsers The maximum number of users allowed
     * @param maxSessionsPerUser The maximum number of concurrent sessions per user
     * @return The encrypted licence key
     * @throws Exception If encryption fails
     */
    public String createLicenceKey(String clientName, LocalDate expirationDate,
                                   int numberOfUsers, int maxSessionsPerUser) throws Exception {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String licenceString = String.format("%s-%s-%d-%d",
                clientName,
                expirationDate.format(formatter),
                numberOfUsers,
                maxSessionsPerUser
        );
        return encrypt(licenceString);
    }
}
