package ma.sir.ged.workflow.DTO;

import lombok.Data;
import ma.sir.ged.workflow.entity.enums.ACTION;

import java.util.List;

@Data
public class StepPresetDTO {
    private Long id;
    private String title;
    private int level;
    private Long duration;
    private String description;
    private Long workflowPresetId;

    private List<UserDestinataireDTO> destinataires;
    private List<ACTION> actions;

    private boolean addPV = false;
}
