package ma.sir.ged.ws.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

@Getter
@Setter
@NoArgsConstructor
public class PlanClassementIndexElementDto extends AuditBaseDto {

    private Long id;
    private String value  ;
    private String description  ;

    private PlanClassementIndexDto indexElement ;
    private PlanClassementDto planClassement ;
}
