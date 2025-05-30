package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.IndexElementHistory;
import ma.sir.ged.bean.core.referentieldoc.IndexElement;
import ma.sir.ged.ws.dto.IndexElementDto;

@Component
public class IndexElementConverter extends AbstractConverter<IndexElement, IndexElementDto, IndexElementHistory> {


    public  IndexElementConverter(){
        super(IndexElement.class, IndexElementDto.class, IndexElementHistory.class);
    }

    @Override
    public IndexElement toItem(IndexElementDto dto) {
        if (dto == null) {
            return null;
        } else {
        IndexElement item = new IndexElement();
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
    public IndexElementDto toDto(IndexElement item) {
        if (item == null) {
            return null;
        } else {
            IndexElementDto dto = new IndexElementDto();
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
