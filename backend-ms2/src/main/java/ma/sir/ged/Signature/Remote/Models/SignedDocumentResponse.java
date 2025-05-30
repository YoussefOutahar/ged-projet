package ma.sir.ged.Signature.Remote.Models;

import lombok.Data;

@Data
public class SignedDocumentResponse {
    private DocumentInfo document;
    private String responseError;
}
