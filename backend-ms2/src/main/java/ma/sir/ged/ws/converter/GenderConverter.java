package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.GenderHistory;
import ma.sir.ged.bean.core.organigramme.Gender;
import ma.sir.ged.ws.dto.GenderDto;

@Component
public class GenderConverter extends AbstractConverter<Gender, GenderDto, GenderHistory> {


    public  GenderConverter(){
        super(Gender.class, GenderDto.class, GenderHistory.class);
    }

    @Override
    public Gender toItem(GenderDto dto) {
        if (dto == null) {
            return null;
        } else {
        Gender item = new Gender();
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
    public GenderDto toDto(Gender item) {
        if (item == null) {
            return null;
        } else {
            GenderDto dto = new GenderDto();
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
