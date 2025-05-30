package ma.sir.ged.Signature.DigitalSignature.entity;

import lombok.Data;

import java.util.Date;

@Data
public class CertificateInfo {
    private String alias;
    private String subject;
    private String issuer;
    private Date notBefore;
    private Date notAfter;
    private boolean isCurrentCertificate;
}
