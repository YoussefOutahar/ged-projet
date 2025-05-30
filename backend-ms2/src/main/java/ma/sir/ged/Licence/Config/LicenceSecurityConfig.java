package ma.sir.ged.Licence.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.KeyGenerator;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class LicenceSecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(LicenceSecurityConfig.class);

    @Value("${app.security.keyfile:/app/data/security/master.key}")
    private String keyFilePath;

    private static final int KEY_SIZE = 256;
    private static final int KEY_LENGTH = 32;
    private static final int SALT_LENGTH = 32;
    private static final int ENTROPY_LENGTH = 32;
    private static final int TOTAL_KEY_LENGTH = SALT_LENGTH + KEY_LENGTH + ENTROPY_LENGTH;

    @PostConstruct
    public void init() {
        try {
            Path keyPath = Paths.get(keyFilePath);
            if (!Files.exists(keyPath)) {
                logger.info("Master key file not found at {}. Generating new key...", keyFilePath);
                generateAndSaveNewMasterKey();
            }
            validateKeyFile();
        } catch (Exception e) {
            logger.error("Error during initialization of LicenceSecurityConfig", e);
            throw new RuntimeException("Failed to initialize security configuration", e);
        }
    }

    private void validateKeyFile() throws IOException {
        Path keyPath = Paths.get(keyFilePath);
        if (!Files.isReadable(keyPath)) {
            throw new IOException("Master key file is not readable: " + keyFilePath);
        }

        byte[] keyContent = Files.readAllBytes(keyPath);
        if (keyContent.length == 0) {
            logger.warn("Master key file is empty. Generating new key...");
            try {
                generateAndSaveNewMasterKey();
            } catch (Exception e) {
                throw new IOException("Failed to generate new master key", e);
            }
        }
    }

    private boolean masterKeyExists() {
        Path keyPath = Paths.get(keyFilePath);
        return Files.exists(keyPath) && Files.isReadable(keyPath);
    }

    public void generateAndSaveNewMasterKey() throws Exception {
        logger.info("Generating new master key...");

        // Generate cryptographic components
        byte[] salt = generateSecureBytes(SALT_LENGTH);
        byte[] mainKey = generateAESKey();
        byte[] entropy = generateSecureBytes(ENTROPY_LENGTH);

        // Combine components
        byte[] combinedKey = new byte[TOTAL_KEY_LENGTH];
        System.arraycopy(salt, 0, combinedKey, 0, SALT_LENGTH);
        System.arraycopy(mainKey, 0, combinedKey, SALT_LENGTH, KEY_LENGTH);
        System.arraycopy(entropy, 0, combinedKey, SALT_LENGTH + KEY_LENGTH, ENTROPY_LENGTH);

        String encodedKey = Base64.getEncoder().encodeToString(combinedKey);
        saveMasterKey(encodedKey);
    }

    private byte[] generateSecureBytes(int length) throws Exception {
        byte[] bytes = new byte[length];
        SecureRandom.getInstanceStrong().nextBytes(bytes);
        return bytes;
    }

    private byte[] generateAESKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(KEY_SIZE, SecureRandom.getInstanceStrong());
        return keyGen.generateKey().getEncoded();
    }

    public byte[] getMasterKey() {
        try {
            if (!masterKeyExists()) {
                generateAndSaveNewMasterKey();
            }

            Path keyPath = Paths.get(keyFilePath);
            byte[] encoded = Files.readAllBytes(keyPath);
            String encodedKey = new String(encoded, StandardCharsets.UTF_8).trim();
            return Base64.getDecoder().decode(encodedKey);

        } catch (IOException e) {
            logger.error("Failed to read master key from: {}", keyFilePath, e);
            throw new IllegalStateException("Failed to read master key from file: " + keyFilePath, e);
        } catch (Exception e) {
            logger.error("Error processing master key", e);
            throw new RuntimeException("Error handling master key", e);
        }
    }

    public void saveMasterKey(String encodedKey) throws Exception {
        byte[] decodedKey = Base64.getDecoder().decode(encodedKey);
        if (decodedKey.length != TOTAL_KEY_LENGTH) {
            throw new IllegalArgumentException(
                    String.format("Invalid master key length. Expected: %d, Got: %d",
                            TOTAL_KEY_LENGTH, decodedKey.length));
        }

        Path keyPath = Paths.get(keyFilePath);

        Files.createDirectories(keyPath.getParent());

        try {
            Files.write(keyPath, encodedKey.getBytes(StandardCharsets.UTF_8));

            try {
                Files.setPosixFilePermissions(keyPath,
                        PosixFilePermissions.fromString("rw-------"));
            } catch (UnsupportedOperationException e) {
                keyPath.toFile().setReadable(false, false);
                keyPath.toFile().setReadable(true, true);
                keyPath.toFile().setWritable(false, false);
                keyPath.toFile().setWritable(true, true);
                keyPath.toFile().setExecutable(false, false);
            }

            logger.info("Successfully saved master key to: {}", keyFilePath);

        } catch (Exception e) {
            logger.error("Failed to save master key to: {}", keyFilePath, e);
            throw new IOException("Failed to save master key", e);
        }
    }

    public byte[] getEncryptionKey() {
        byte[] masterKey = getMasterKey();
        if (masterKey.length != TOTAL_KEY_LENGTH) {
            throw new IllegalStateException(
                    String.format("Invalid master key length: %d, expected: %d",
                            masterKey.length, TOTAL_KEY_LENGTH));
        }

        byte[] encryptionKey = new byte[KEY_LENGTH];
        System.arraycopy(masterKey, SALT_LENGTH, encryptionKey, 0, KEY_LENGTH);
        return encryptionKey;
    }
}