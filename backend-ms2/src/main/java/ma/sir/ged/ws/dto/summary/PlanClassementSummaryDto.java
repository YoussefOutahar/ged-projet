package ma.sir.ged.ws.dto.summary;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import ma.sir.ged.ws.dto.PlanClassementDto;
import ma.sir.ged.ws.dto.PlanClassementIndexElementDto;
import ma.sir.ged.ws.dto.PlanClassementModelDto;

import java.util.List;

@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlanClassementSummaryDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;

    private Boolean archive;
}
