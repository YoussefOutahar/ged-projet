package ma.sir.ged.service.facade;

import org.bouncycastle.openssl.EncryptionException;

import java.security.GeneralSecurityException;

public interface EncryptionService {

    String encrypt(String plainText) throws EncryptionException;
    String decrypt(String cipherText) throws  EncryptionException;
}
