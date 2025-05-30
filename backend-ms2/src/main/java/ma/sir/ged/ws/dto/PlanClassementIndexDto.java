package ma.sir.ged.ws.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import javax.persistence.Column;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlanClassementIndexDto extends AuditBaseDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
}
