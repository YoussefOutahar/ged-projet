package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentStateHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.ws.dto.DocumentStateDto;

@Component
public class DocumentStateConverter extends AbstractConverter<DocumentState, DocumentStateDto, DocumentStateHistory> {


    public  DocumentStateConverter(){
        super(DocumentState.class, DocumentStateDto.class, DocumentStateHistory.class);
    }

    @Override
    public DocumentState toItem(DocumentStateDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentState item = new DocumentState();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getStyle()))
                item.setStyle(dto.getStyle());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());



        return item;
        }
    }

    @Override
    public DocumentStateDto toDto(DocumentState item) {
        if (item == null) {
            return null;
        } else {
            DocumentStateDto dto = new DocumentStateDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getStyle()))
                dto.setStyle(item.getStyle());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());


        return dto;
        }
    }


    public void initObject(boolean value) {
    }


}
