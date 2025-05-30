package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.organigramme.PlanClassementModel;
import ma.sir.ged.bean.history.PlanClassementModelHistory;
import ma.sir.ged.ws.dto.PlanClassementModelDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PlanClassementModelConverter extends AbstractConverter<PlanClassementModel, PlanClassementModelDto, PlanClassementModelHistory> {

    @Autowired
    private PlanClassementModelIndexConverter planClassementModelIndexConverter;
    private PlanClassementModelConverter(){
        super(PlanClassementModel.class, PlanClassementModelDto.class, PlanClassementModelHistory.class);
    }
    private boolean planClassementModelIndexs;
    @Override
    public PlanClassementModel toItem(PlanClassementModelDto dto) {
        if(dto != null){
            PlanClassementModel item = new PlanClassementModel();
            if(dto.getId() != null) item.setId(dto.getId());
            item.setCode(dto.getCode());
            item.setLibelle(dto.getLibelle());
            item.setDescription(dto.getDescription());
            if(ListUtil.isNotEmpty(dto.getPlanClassementModelIndexDtos()))
                item.setPlanClassementIndexs(planClassementModelIndexConverter.toItem(dto.getPlanClassementModelIndexDtos()));

            return item;
        }
        return null;
    }

    @Override
    public PlanClassementModelDto toDto(PlanClassementModel item) {
        if(item != null){
            PlanClassementModelDto dto = new PlanClassementModelDto();
            dto.setId(item.getId());
            dto.setCode(item.getCode());
            dto.setLibelle(item.getLibelle());
            dto.setDescription(item.getDescription());
            if(ListUtil.isNotEmpty(item.getPlanClassementIndexs()))
                dto.setPlanClassementModelIndexDtos(planClassementModelIndexConverter.toDto(item.getPlanClassementIndexs()));

            return dto;
        }
        return null;
    }
    public void initList(boolean value) {
        this.planClassementModelIndexs = value;
    }

    public boolean isPlanClassementModelIndexs() {
        return planClassementModelIndexs;
    }

    public void setPlanClassementModelIndexs(boolean planClassementModelIndexs) {
        this.planClassementModelIndexs = planClassementModelIndexs;
    }
}
