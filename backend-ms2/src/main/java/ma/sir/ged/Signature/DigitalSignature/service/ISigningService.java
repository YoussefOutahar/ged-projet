package ma.sir.ged.Signature.DigitalSignature.service;

import ma.sir.ged.Signature.DigitalSignature.entity.SignatureInfo;

import java.security.cert.X509Certificate;

/**
 * Interface for Signing Service.
 *
 * @param <T> the type of data to be signed and validated
 * @since 9+
 */
public interface ISigningService<T> {

    /**
     * Generates a certificate for a user.
     *
     * @param username the username for which the certificate is generated
     * @param password the password for the user's key pair
     * @return the generated X509Certificate
     */
    X509Certificate generateCertificateForUser(String username, String password);

    /**
     * Signs the given data using the specified key alias and password.
     *
     * @param keyAlias the alias of the key to be used for signing
     * @param keyPassword the password for the key
     * @param data the data to be signed
     * @return the signed data as a byte array
     * @throws Exception if an error occurs during signing
     */
    T signData(String keyAlias, String keyPassword, T data) throws Exception;


    /**
     * Validates the signed data using the specified key alias.
     *
     * @param signedData the signed data to be validated
     * @return true if the signed data is valid, false otherwise
     * @throws Exception if an error occurs during validation
     */
    boolean validateSignedDataWithKeystore(T signedData) throws Exception;

    /**
     * Retrieves signature information from the signed data.
     *
     * @param signedData the signed data from which to extract signature information
     * @return the extracted SignatureInfo
     * @throws Exception if an error occurs during extraction
     */
    SignatureInfo getSignatureInfo(T signedData) throws Exception;

    /**
     * Checks if the specified alias exists in the keystore.
     *
     * @param alias the alias to check
     * @return true if the alias exists, false otherwise
     */
    boolean aliasExists(String alias) throws Exception;
}
