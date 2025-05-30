package ma.sir.ged.ws.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

@Getter
@Setter
@NoArgsConstructor
public class PlanClassementModelIndexDto extends AuditBaseDto {
    private Long id;
    private PlanClassementIndexDto planClassementIndex;
    private PlanClassementModelDto planClassementModel;
}
