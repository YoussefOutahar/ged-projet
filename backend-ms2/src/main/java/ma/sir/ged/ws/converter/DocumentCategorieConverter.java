package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ma.sir.ged.zynerator.util.ListUtil;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentCategorieHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.ws.dto.DocumentCategorieDto;

@Component
public class DocumentCategorieConverter extends AbstractConverter<DocumentCategorie, DocumentCategorieDto, DocumentCategorieHistory> {

    @Autowired
    private DocumentCategorieIndexConverter documentCategorieIndexConverter ;
    @Autowired
    private IndexElementConverter indexElementConverter ;
    @Autowired
    private DocumentCategorieIndexRuleConverter documentCategorieIndexRuleConverter ;
    @Autowired
    private DocumentCategorieModelConverter documentCategorieModelConverter ;
    private boolean documentCategorieIndexs;
    private boolean documentCategorieModels;

    public  DocumentCategorieConverter(){
        super(DocumentCategorie.class, DocumentCategorieDto.class, DocumentCategorieHistory.class);
        init(true);
    }

    @Override
    public DocumentCategorie toItem(DocumentCategorieDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentCategorie item = new DocumentCategorie();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());

            if(this.documentCategorieIndexs && ListUtil.isNotEmpty(dto.getDocumentCategorieIndexs()))
                item.setDocumentCategorieIndexs(documentCategorieIndexConverter.toItem(dto.getDocumentCategorieIndexs()));
            if(this.documentCategorieModels && ListUtil.isNotEmpty(dto.getDocumentCategorieModels()))
                item.setDocumentCategorieModels(documentCategorieModelConverter.toItem(dto.getDocumentCategorieModels()));


        return item;
        }
    }

    @Override
    public DocumentCategorieDto toDto(DocumentCategorie item) {
        if (item == null) {
            return null;
        } else {
            DocumentCategorieDto dto = new DocumentCategorieDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
        if(this.documentCategorieIndexs && ListUtil.isNotEmpty(item.getDocumentCategorieIndexs())){
            documentCategorieIndexConverter.init(true);
            documentCategorieIndexConverter.setDocumentCategorie(false);
            dto.setDocumentCategorieIndexs(documentCategorieIndexConverter.toDto(item.getDocumentCategorieIndexs()));
            documentCategorieIndexConverter.setDocumentCategorie(true);

        }
        if(this.documentCategorieModels && ListUtil.isNotEmpty(item.getDocumentCategorieModels())){
            documentCategorieModelConverter.init(true);
            documentCategorieModelConverter.setDocumentCategorie(false);
            dto.setDocumentCategorieModels(documentCategorieModelConverter.toDto(item.getDocumentCategorieModels()));
            documentCategorieModelConverter.setDocumentCategorie(true);

        }


        return dto;
        }
    }

    public void initList(boolean value) {
        this.documentCategorieIndexs = value;
        this.documentCategorieModels = value;
    }

    public void initObject(boolean value) {
    }


    public DocumentCategorieIndexConverter getDocumentCategorieIndexConverter(){
        return this.documentCategorieIndexConverter;
    }
    public void setDocumentCategorieIndexConverter(DocumentCategorieIndexConverter documentCategorieIndexConverter ){
        this.documentCategorieIndexConverter = documentCategorieIndexConverter;
    }
    public IndexElementConverter getIndexElementConverter(){
        return this.indexElementConverter;
    }
    public void setIndexElementConverter(IndexElementConverter indexElementConverter ){
        this.indexElementConverter = indexElementConverter;
    }
    public DocumentCategorieIndexRuleConverter getDocumentCategorieIndexRuleConverter(){
        return this.documentCategorieIndexRuleConverter;
    }
    public void setDocumentCategorieIndexRuleConverter(DocumentCategorieIndexRuleConverter documentCategorieIndexRuleConverter ){
        this.documentCategorieIndexRuleConverter = documentCategorieIndexRuleConverter;
    }
    public DocumentCategorieModelConverter getDocumentCategorieModelConverter(){
        return this.documentCategorieModelConverter;
    }
    public void setDocumentCategorieModelConverter(DocumentCategorieModelConverter documentCategorieModelConverter ){
        this.documentCategorieModelConverter = documentCategorieModelConverter;
    }
    public boolean  isDocumentCategorieIndexs(){
        return this.documentCategorieIndexs ;
    }
    public void  setDocumentCategorieIndexs(boolean documentCategorieIndexs ){
        this.documentCategorieIndexs  = documentCategorieIndexs ;
    }
    public boolean  isDocumentCategorieModels(){
        return this.documentCategorieModels ;
    }
    public void  setDocumentCategorieModels(boolean documentCategorieModels ){
        this.documentCategorieModels  = documentCategorieModels ;
    }
}
