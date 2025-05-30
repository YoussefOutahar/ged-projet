package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentCategorieIndexHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import ma.sir.ged.ws.dto.DocumentCategorieIndexDto;

@Component
public class DocumentCategorieIndexConverter extends AbstractConverter<DocumentCategorieIndex, DocumentCategorieIndexDto, DocumentCategorieIndexHistory> {

    @Autowired
    private IndexElementConverter indexElementConverter ;
    @Autowired
    private DocumentCategorieConverter documentCategorieConverter ;
    @Autowired
    private DocumentCategorieIndexRuleConverter documentCategorieIndexRuleConverter ;
    private boolean indexElement;
    private boolean documentCategorie;
    private boolean documentCategorieIndexRule;

    public  DocumentCategorieIndexConverter(){
        super(DocumentCategorieIndex.class, DocumentCategorieIndexDto.class, DocumentCategorieIndexHistory.class);
    }

    @Override
    public DocumentCategorieIndex toItem(DocumentCategorieIndexDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentCategorieIndex item = new DocumentCategorieIndex();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(this.indexElement && dto.getIndexElement()!=null &&  dto.getIndexElement().getId() != null)
                item.setIndexElement(indexElementConverter.toItem(dto.getIndexElement())) ;

            if(dto.getDocumentCategorie() != null && dto.getDocumentCategorie().getId() != null){
                item.setDocumentCategorie(new DocumentCategorie());
                item.getDocumentCategorie().setId(dto.getDocumentCategorie().getId());
                item.getDocumentCategorie().setLibelle(dto.getDocumentCategorie().getLibelle());
            }

            if(this.documentCategorieIndexRule && dto.getDocumentCategorieIndexRule()!=null &&  dto.getDocumentCategorieIndexRule().getId() != null)
                item.setDocumentCategorieIndexRule(documentCategorieIndexRuleConverter.toItem(dto.getDocumentCategorieIndexRule())) ;




        return item;
        }
    }

    @Override
    public DocumentCategorieIndexDto toDto(DocumentCategorieIndex item) {
        if (item == null) {
            return null;
        } else {
            DocumentCategorieIndexDto dto = new DocumentCategorieIndexDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
        if(this.indexElement && item.getIndexElement()!=null) {
            dto.setIndexElement(indexElementConverter.toDto(item.getIndexElement())) ;
        }
        if(this.documentCategorie && item.getDocumentCategorie()!=null) {
            dto.setDocumentCategorie(documentCategorieConverter.toDto(item.getDocumentCategorie())) ;
        }
        if(this.documentCategorieIndexRule && item.getDocumentCategorieIndexRule()!=null) {
            dto.setDocumentCategorieIndexRule(documentCategorieIndexRuleConverter.toDto(item.getDocumentCategorieIndexRule())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.indexElement = value;
        this.documentCategorie = value;
        this.documentCategorieIndexRule = value;
    }


    public IndexElementConverter getIndexElementConverter(){
        return this.indexElementConverter;
    }
    public void setIndexElementConverter(IndexElementConverter indexElementConverter ){
        this.indexElementConverter = indexElementConverter;
    }
    public DocumentCategorieConverter getDocumentCategorieConverter(){
        return this.documentCategorieConverter;
    }
    public void setDocumentCategorieConverter(DocumentCategorieConverter documentCategorieConverter ){
        this.documentCategorieConverter = documentCategorieConverter;
    }
    public DocumentCategorieIndexRuleConverter getDocumentCategorieIndexRuleConverter(){
        return this.documentCategorieIndexRuleConverter;
    }
    public void setDocumentCategorieIndexRuleConverter(DocumentCategorieIndexRuleConverter documentCategorieIndexRuleConverter ){
        this.documentCategorieIndexRuleConverter = documentCategorieIndexRuleConverter;
    }
    public boolean  isIndexElement(){
        return this.indexElement;
    }
    public void  setIndexElement(boolean indexElement){
        this.indexElement = indexElement;
    }
    public boolean  isDocumentCategorie(){
        return this.documentCategorie;
    }
    public void  setDocumentCategorie(boolean documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    public boolean  isDocumentCategorieIndexRule(){
        return this.documentCategorieIndexRule;
    }
    public void  setDocumentCategorieIndexRule(boolean documentCategorieIndexRule){
        this.documentCategorieIndexRule = documentCategorieIndexRule;
    }
}
