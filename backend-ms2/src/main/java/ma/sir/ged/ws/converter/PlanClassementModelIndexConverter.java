package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.bean.history.PlanClassementModelIndexHistory;
import ma.sir.ged.ws.dto.PlanClassementModelIndexDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class PlanClassementModelIndexConverter extends AbstractConverter<PlanClassementModelIndex, PlanClassementModelIndexDto, PlanClassementModelIndexHistory> {

        @Autowired
        private final PlanClassementModelConverter planClassementModelConverter;
        @Autowired
        private final PlanClassementIndexConverter planClassementIndexConverter;

        private PlanClassementModelIndexConverter(PlanClassementModelConverter planClassementModelConverter, PlanClassementIndexConverter planClassementIndexConverter) {
            super(PlanClassementModelIndex.class, PlanClassementModelIndexDto.class, PlanClassementModelIndexHistory.class);
            this.planClassementModelConverter = planClassementModelConverter;
            this.planClassementIndexConverter = planClassementIndexConverter;
        }


    @Override
    public PlanClassementModelIndex toItem(PlanClassementModelIndexDto dto) {
        if(dto != null){
            PlanClassementModelIndex item = new PlanClassementModelIndex();
            if(dto.getId() != null) item.setId(dto.getId());
            if(Objects.nonNull(dto.getPlanClassementModel())) item.setPlanClassementModel(planClassementModelConverter.toItem(dto.getPlanClassementModel()));
            if(Objects.nonNull(dto.getPlanClassementIndex())) item.setPlanClassementIndex(planClassementIndexConverter.toItem(dto.getPlanClassementIndex()));
            return item;
        }
        return null;
    }

    @Override
    public PlanClassementModelIndexDto toDto(PlanClassementModelIndex item) {
        if(item != null){
            PlanClassementModelIndexDto dto = new PlanClassementModelIndexDto();
            dto.setId(item.getId());
//            if(Objects.nonNull(item.getPlanClassementModel())) dto.setPlanClassementModel(planClassementModelConverter.toDto(item.getPlanClassementModel()));
            if(Objects.nonNull(item.getPlanClassementIndex())) dto.setPlanClassementIndex(planClassementIndexConverter.toDto(item.getPlanClassementIndex()));
            return dto;
        }
        return null;
    }
}
