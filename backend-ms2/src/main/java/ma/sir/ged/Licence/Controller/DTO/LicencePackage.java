package ma.sir.ged.Licence.Controller.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LicencePackage {
    private String filename;
    private byte[] content;
    private String contentType;
}
