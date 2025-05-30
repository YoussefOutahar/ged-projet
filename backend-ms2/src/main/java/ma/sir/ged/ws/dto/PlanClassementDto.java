package ma.sir.ged.ws.dto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ma.sir.ged.bean.core.organigramme.enums.ArchivageType;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlanClassementDto extends AuditBaseDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private Long parentId;
    @JsonBackReference
    private PlanClassementDto parent;
    @JsonManagedReference
    private List<PlanClassementDto> children = new ArrayList<>();
    private Boolean archive;
    private Integer archiveIntermidiaireDuree;
    private Integer archiveFinalDuree;
    private ArchivageType archivageType;
    private PlanClassementModelDto planClassementModelDto;
    private Long planClassementModelId;
    private List<PlanClassementIndexElementDto> planClassementIndexElements;
    private List<String> plansHierarchie;
}
