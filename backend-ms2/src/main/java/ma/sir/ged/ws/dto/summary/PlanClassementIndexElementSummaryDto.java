package ma.sir.ged.ws.dto.summary;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PlanClassementIndexElementSummaryDto {
    private Long id;
    private String value  ;
    private String description  ;

    private Long indexElementId ;
    private Long planClassementId ;
}
