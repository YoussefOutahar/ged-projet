package ma.sir.ged.ws.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PlanClassementModelDto extends AuditBaseDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private List<PlanClassementModelIndexDto> planClassementModelIndexDtos;
}
