package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import ma.sir.ged.workflow.entity.Step;

import java.time.Duration;
@Data
@AllArgsConstructor
public class StepDurationDTO {
    private Step step;
    private Duration dureeReelle;
    private Duration dureePrevue;
}
