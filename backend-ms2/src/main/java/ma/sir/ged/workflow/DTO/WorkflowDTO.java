package ma.sir.ged.workflow.DTO;


import lombok.Data;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.entity.enums.Flag;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.List;


@Data
public class WorkflowDTO extends AuditBaseDto {

    private Long id;

    private String title;

    private String description;

    private WorkflowStatus status;

    private Flag flag;

    private List<StepDTO> stepDTOList;

    private String dateC;

    private String dateUpdate;

    private  Long  initiateurId;

    private  String initiateurNom;

    private WorkflowPresetDTO workflowPresetDTO;

    private List<DocumentDto> documents;

    private List<DocumentDto> piecesJointes;

}
