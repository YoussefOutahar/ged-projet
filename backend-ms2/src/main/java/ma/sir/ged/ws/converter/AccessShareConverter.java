package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.AccessShareHistory;
import ma.sir.ged.bean.core.referentielpartage.AccessShare;
import ma.sir.ged.ws.dto.AccessShareDto;

@Component
public class AccessShareConverter extends AbstractConverter<AccessShare, AccessShareDto, AccessShareHistory> {


    public  AccessShareConverter(){
        super(AccessShare.class, AccessShareDto.class, AccessShareHistory.class);
    }

    @Override
    public AccessShare toItem(AccessShareDto dto) {
        if (dto == null) {
            return null;
        } else {
        AccessShare item = new AccessShare();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());



        return item;
        }
    }

    @Override
    public AccessShareDto toDto(AccessShare item) {
        if (item == null) {
            return null;
        } else {
            AccessShareDto dto = new AccessShareDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());


        return dto;
        }
    }


    public void initObject(boolean value) {
    }


}
