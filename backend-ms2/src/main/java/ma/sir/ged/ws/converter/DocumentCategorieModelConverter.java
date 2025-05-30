package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentCategorieModelHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieModel;
import ma.sir.ged.ws.dto.DocumentCategorieModelDto;

@Component
public class DocumentCategorieModelConverter extends AbstractConverter<DocumentCategorieModel, DocumentCategorieModelDto, DocumentCategorieModelHistory> {

    @Autowired
    private DocumentCategorieConverter documentCategorieConverter ;
    private boolean documentCategorie;

    public  DocumentCategorieModelConverter(){
        super(DocumentCategorieModel.class, DocumentCategorieModelDto.class, DocumentCategorieModelHistory.class);
    }

    @Override
    public DocumentCategorieModel toItem(DocumentCategorieModelDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentCategorieModel item = new DocumentCategorieModel();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getReferenceGed()))
                item.setReferenceGed(dto.getReferenceGed());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());
            if(dto.getDocumentCategorie() != null && dto.getDocumentCategorie().getId() != null){
                item.setDocumentCategorie(new DocumentCategorie());
                item.getDocumentCategorie().setId(dto.getDocumentCategorie().getId());
                item.getDocumentCategorie().setLibelle(dto.getDocumentCategorie().getLibelle());
            }




        return item;
        }
    }

    @Override
    public DocumentCategorieModelDto toDto(DocumentCategorieModel item) {
        if (item == null) {
            return null;
        } else {
            DocumentCategorieModelDto dto = new DocumentCategorieModelDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getReferenceGed()))
                dto.setReferenceGed(item.getReferenceGed());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
        if(this.documentCategorie && item.getDocumentCategorie()!=null) {
            dto.setDocumentCategorie(documentCategorieConverter.toDto(item.getDocumentCategorie())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.documentCategorie = value;
    }


    public DocumentCategorieConverter getDocumentCategorieConverter(){
        return this.documentCategorieConverter;
    }
    public void setDocumentCategorieConverter(DocumentCategorieConverter documentCategorieConverter ){
        this.documentCategorieConverter = documentCategorieConverter;
    }
    public boolean  isDocumentCategorie(){
        return this.documentCategorie;
    }
    public void  setDocumentCategorie(boolean documentCategorie){
        this.documentCategorie = documentCategorie;
    }
}
