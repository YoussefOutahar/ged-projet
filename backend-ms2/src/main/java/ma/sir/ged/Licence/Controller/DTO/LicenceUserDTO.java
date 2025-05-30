package ma.sir.ged.Licence.Controller.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LicenceUserDTO {
    private long id;
    private String username;
    private String email;
}
