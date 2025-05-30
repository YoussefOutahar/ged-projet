package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentCategorieIndexRuleHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndexRule;
import ma.sir.ged.ws.dto.DocumentCategorieIndexRuleDto;

@Component
public class DocumentCategorieIndexRuleConverter extends AbstractConverter<DocumentCategorieIndexRule, DocumentCategorieIndexRuleDto, DocumentCategorieIndexRuleHistory> {


    public  DocumentCategorieIndexRuleConverter(){
        super(DocumentCategorieIndexRule.class, DocumentCategorieIndexRuleDto.class, DocumentCategorieIndexRuleHistory.class);
    }

    @Override
    public DocumentCategorieIndexRule toItem(DocumentCategorieIndexRuleDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentCategorieIndexRule item = new DocumentCategorieIndexRule();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getExpresion()))
                item.setExpresion(dto.getExpresion());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());



        return item;
        }
    }

    @Override
    public DocumentCategorieIndexRuleDto toDto(DocumentCategorieIndexRule item) {
        if (item == null) {
            return null;
        } else {
            DocumentCategorieIndexRuleDto dto = new DocumentCategorieIndexRuleDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getExpresion()))
                dto.setExpresion(item.getExpresion());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());


        return dto;
        }
    }


    public void initObject(boolean value) {
    }


}
