package ma.sir.ged.ws.converter.BureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.PlanClassementBO;
import ma.sir.ged.service.facade.bo.PlanClassementBoService;
import ma.sir.ged.ws.dto.BureauOrdre.PlanClassementBODto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Objects;

@Component
public class PlanClassemementBOConverter {

    @Autowired
    private PlanClassementBoService planClassementBoService;


    public PlanClassementBO toEntity(PlanClassementBODto dto) {

        if (dto == null) {
            return new PlanClassementBO();
        }

        PlanClassementBO planClassementBO = new PlanClassementBO();
        planClassementBO.setId(dto.getId());
        planClassementBO.setCode(dto.getCode());
        planClassementBO.setLibelle(dto.getLibelle());
        planClassementBO.setDescription(dto.getDescription());

        if (Objects.nonNull(dto.getParentId())) {
            planClassementBO.setParent(planClassementBoService.findById(dto.getParentId()));
        }

        if(Objects.nonNull(dto.getChildren()) && !dto.getChildren().isEmpty()){
            planClassementBO.setChildren(new ArrayList<PlanClassementBO>());
            dto.getChildren().forEach(child -> {
                planClassementBO.getChildren().add(toEntity(child));
            });
        }

        return planClassementBO;
    }

    public PlanClassementBODto toDto(PlanClassementBO planClassementBO) {

        if (planClassementBO == null) {
            return new PlanClassementBODto();
        }

        PlanClassementBODto dto = new PlanClassementBODto();
        dto.setId(planClassementBO.getId());
        dto.setCode(planClassementBO.getCode());
        dto.setLibelle(planClassementBO.getLibelle());
        dto.setDescription(planClassementBO.getDescription());

        if (Objects.nonNull(planClassementBO.getParent())) {
            dto.setParentId(planClassementBO.getParent().getId());
        }

        if(Objects.nonNull(planClassementBO.getChildren()) && !planClassementBO.getChildren().isEmpty()){
            dto.setChildren(new ArrayList<PlanClassementBODto>());
            planClassementBO.getChildren().forEach(child -> {
                dto.getChildren().add(toDto(child));
            });
        }

        return dto;
    }

}
