package ma.sir.ged.ws.converter;


import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import ma.sir.ged.bean.history.PlanClassementIndexElementHistory;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementIndexDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementRepository;
import ma.sir.ged.ws.dto.PlanClassementIndexElementDto;
import ma.sir.ged.ws.dto.summary.PlanClassementIndexElementSummaryDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class PlanClassementIndexElementConverter extends AbstractConverter<PlanClassementIndexElement, PlanClassementIndexElementDto, PlanClassementIndexElementHistory>{

    @Autowired
    private final PlanClassementIndexConverter planClassementIndexConverter;
    @Autowired
    private final PlanClassementConverter planClassementConverter;
    @Autowired
    private PlanClassementRepository planClassementDao;
    @Autowired
    private PlanClassementIndexDao planClassementIndexDao;

    protected PlanClassementIndexElementConverter(PlanClassementIndexConverter planClassementIndexConverter, PlanClassementConverter planClassementConverter) {
        super(PlanClassementIndexElement.class, PlanClassementIndexElementDto.class, PlanClassementIndexElementHistory.class);
        this.planClassementIndexConverter = planClassementIndexConverter;
        this.planClassementConverter = planClassementConverter;
    }

    @Override
    public PlanClassementIndexElement toItem(PlanClassementIndexElementDto dto) {
        if(dto != null){
            PlanClassementIndexElement item = new PlanClassementIndexElement();
            if(StringUtil.isNotEmpty(dto.getId())) item.setId(dto.getId());
            item.setValue(dto.getValue());
            item.setDescription(dto.getDescription());
            if(Objects.nonNull(dto.getIndexElement())) item.setIndexElement(planClassementIndexConverter.toItem(dto.getIndexElement()));
            if(Objects.nonNull(dto.getPlanClassement())) item.setPlanClassement(planClassementConverter.toItem(dto.getPlanClassement()));
            return item;
        }
        return null;
    }
    public PlanClassementIndexElement toItem(PlanClassementIndexElementSummaryDto dto) {
        if(dto != null){
            PlanClassementIndexElement item = new PlanClassementIndexElement();
            if(StringUtil.isNotEmpty(dto.getId())) item.setId(dto.getId());
            item.setValue(dto.getValue());
            item.setDescription(dto.getDescription());
            if(Objects.nonNull(dto.getIndexElementId()))
                item.setIndexElement(planClassementIndexDao.findById(dto.getIndexElementId()).orElse(null));
            if(Objects.nonNull(dto.getPlanClassementId()))
                item.setPlanClassement(planClassementDao.findById(dto.getPlanClassementId()).orElse(null));
            return item;
        }
        return null;
    }

    @Override
    public PlanClassementIndexElementDto toDto(PlanClassementIndexElement item) {
        if(item != null){
            PlanClassementIndexElementDto dto = new PlanClassementIndexElementDto();
            dto.setId(item.getId());
            dto.setValue(item.getValue());
            dto.setDescription(item.getDescription());
            if(Objects.nonNull(item.getIndexElement())) dto.setIndexElement(planClassementIndexConverter.toDto(item.getIndexElement()));
            if(Objects.nonNull(item.getPlanClassement())) dto.setPlanClassement(planClassementConverter.toDto(item.getPlanClassement()));
            return dto;
        }
        return null;
    }
}
