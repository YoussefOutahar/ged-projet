package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.history.PlanClassementIndexHistory;
import ma.sir.ged.ws.dto.PlanClassementIndexDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.StringUtil;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class PlanClassementIndexConverter extends AbstractConverter<PlanClassementIndex, PlanClassementIndexDto, PlanClassementIndexHistory> {
    protected PlanClassementIndexConverter(){
        super(PlanClassementIndex.class, PlanClassementIndexDto.class, PlanClassementIndexHistory.class);
    }

    @Override
    public PlanClassementIndex toItem(PlanClassementIndexDto dto) {
        if(Objects.nonNull(dto)){
            PlanClassementIndex item = new PlanClassementIndex();
            if(StringUtil.isNotEmpty(dto.getId())) item.setId(dto.getId());
            item.setCode(dto.getCode());
            item.setLibelle(dto.getLibelle());
            item.setDescription(dto.getDescription());
            return item;
        }else{
            return null;
        }
    }

    @Override
    public PlanClassementIndexDto toDto(PlanClassementIndex item) {
        if(Objects.nonNull(item)){
            PlanClassementIndexDto dto = new PlanClassementIndexDto();
            if(StringUtil.isNotEmpty(item.getId())) dto.setId(item.getId());
            dto.setCode(item.getCode());
            dto.setLibelle(item.getLibelle());
            dto.setDescription(item.getDescription());
            return dto;
        }
        return null;
    }
}
