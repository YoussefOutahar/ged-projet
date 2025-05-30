package ma.sir.ged.ws.dto.BureauOrdre;

import lombok.Data;

import java.util.List;

@Data
public class PlanClassementBODto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private Long parentId;
    private List<PlanClassementBODto> children;
}
