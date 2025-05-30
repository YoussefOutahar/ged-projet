package ma.sir.ged.workflow.DTO;

import lombok.Data;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.List;

@Data
public class WorkflowPresetDTO extends AuditBaseDto {

    private Long id;
    private String title;
    private String description;

    private List<StepPresetDTO> stepPresets;

    private String dateC;

    private String dateUpdate;

    private Long createurId ;

    private String createurNom;

    private String createurPrenom;

    private String departement ;


}
