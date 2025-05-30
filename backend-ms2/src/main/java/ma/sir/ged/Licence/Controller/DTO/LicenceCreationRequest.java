package ma.sir.ged.Licence.Controller.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class LicenceCreationRequest {
    private String clientName;
    private LocalDate expirationDate;
    private int numberOfUsers;
    private int maxSessionsPerUser;
    private List<String> heavyUsers;
    private List<Long> heavyUserIds;
}
