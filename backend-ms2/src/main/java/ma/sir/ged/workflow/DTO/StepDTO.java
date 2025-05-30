package ma.sir.ged.workflow.DTO;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.STEP_STATUS;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.List;

@Data
public class StepDTO extends AuditBaseDto {
        private Long id;
        private StepPresetDTO stepPreset;
        private STEP_STATUS status;
        private List<DocumentDto> documents;
        private List<DocumentDto> documentsActions;
        private Long workflowId;
        private List<CommentaireDTO> discussions;
        private List<ACTION> actions;
        private String validateDate;
}
