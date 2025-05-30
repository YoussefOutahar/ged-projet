package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.TagHistory;
import ma.sir.ged.bean.core.referentieldoc.Tag;
import ma.sir.ged.ws.dto.TagDto;

@Component
public class TagConverter extends AbstractConverter<Tag, TagDto, TagHistory> {


    public  TagConverter(){
        super(Tag.class, TagDto.class, TagHistory.class);
    }

    @Override
    public Tag toItem(TagDto dto) {
        if (dto == null) {
            return null;
        } else {
        Tag item = new Tag();
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
    public TagDto toDto(Tag item) {
        if (item == null) {
            return null;
        } else {
            TagDto dto = new TagDto();
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
