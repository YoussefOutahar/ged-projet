package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
    public class EvaluateurCertifCountDTO {
        private String evaluateur;
        private long nombreCertif;
}
