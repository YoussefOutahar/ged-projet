package ma.sir.ged.ws.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParapheurKpiDto {
    private int nombreTotal;
    private int nombreParaphSigne;
    private int nombreParaphNonSigne;
    private int nombreParaphRejete;
    private int nombreParapheurHasWorkflow;
    private int nombreParapheurSansWorkflow;
    private int nombreInitiateurDistinct;
}
