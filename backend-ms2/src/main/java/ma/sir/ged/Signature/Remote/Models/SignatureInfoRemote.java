package ma.sir.ged.Signature.Remote.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;

import java.util.Calendar;

@Data
public class SignatureInfoRemote {
    @JsonProperty("gedReference")
    private String gedReference;

    @JsonProperty("documentId")
    private Long documentId;

    private String filter;
    private String subFilter;
    private String name;
    private String location;
    private String reason;
    private String contactInfo;
    private Calendar signDate;
    private byte[] contents;
    private int[] byteRange;

    public static SignatureInfoRemote fromPDSignature(PDSignature pdSignature, String gedReference, Long documentId) {
        SignatureInfoRemote remote = new SignatureInfoRemote();
        remote.setGedReference(gedReference);
        remote.setDocumentId(documentId);
        remote.setFilter(pdSignature.getFilter());
        remote.setSubFilter(pdSignature.getSubFilter());
        remote.setName(pdSignature.getName());
        remote.setLocation(pdSignature.getLocation());
        remote.setReason(pdSignature.getReason());
        remote.setContactInfo(pdSignature.getContactInfo());
        remote.setSignDate(pdSignature.getSignDate());
        remote.setContents(pdSignature.getContents());
        remote.setByteRange(pdSignature.getByteRange());
        return remote;
    }
}
