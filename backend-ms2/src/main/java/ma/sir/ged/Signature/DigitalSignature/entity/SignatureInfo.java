package ma.sir.ged.Signature.DigitalSignature.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.bouncycastle.asn1.cms.AttributeTable;

import java.util.Date;
import java.util.List;

@Data
public class SignatureInfo {

    @JsonProperty("gedReference")
    private String gedReference;

    @JsonProperty("documentId")
    private Long documentId;

    @JsonProperty("signatureAlgorithm")
    private String signatureAlgorithm;

    @JsonProperty("signature")
    private byte[] signature;

    @JsonProperty("signedAttributes")
    private AttributeTable signedAttributes;

    @JsonProperty("unsignedAttributes")
    private AttributeTable unsignedAttributes;

    @JsonProperty("signingTime")
    private Date signingTime;

    @JsonProperty("issuer")
    private String issuer;

    @JsonProperty("subject")
    private String subject;

    @JsonProperty("serialNumber")
    private String serialNumber;

    @JsonProperty("validFrom")
    private Date validFrom;

    @JsonProperty("validTo")
    private Date validTo;
}
