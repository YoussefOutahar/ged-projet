package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.doc.Document;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentTagHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentTag;
import ma.sir.ged.ws.dto.DocumentTagDto;

@Component
public class DocumentTagConverter extends AbstractConverter<DocumentTag, DocumentTagDto, DocumentTagHistory> {

    @Autowired
    private TagConverter tagConverter ;
    @Autowired
    private DocumentConverter documentConverter ;
    private boolean document;
    private boolean tag;

    public  DocumentTagConverter(){
        super(DocumentTag.class, DocumentTagDto.class, DocumentTagHistory.class);
    }

    @Override
    public DocumentTag toItem(DocumentTagDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentTag item = new DocumentTag();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(dto.getDocument() != null && dto.getDocument().getId() != null){
                item.setDocument(new Document());
                item.getDocument().setId(dto.getDocument().getId());
                item.getDocument().setReference(dto.getDocument().getReference());
            }

            if(this.tag && dto.getTag()!=null &&  dto.getTag().getId() != null)
                item.setTag(tagConverter.toItem(dto.getTag())) ;




        return item;
        }
    }

    @Override
    public DocumentTagDto toDto(DocumentTag item) {
        if (item == null) {
            return null;
        } else {
            DocumentTagDto dto = new DocumentTagDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
        if(this.document && item.getDocument()!=null) {
            dto.setDocument(documentConverter.toDto(item.getDocument())) ;
        }
        if(this.tag && item.getTag()!=null) {
            dto.setTag(tagConverter.toDto(item.getTag())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.document = value;
        this.tag = value;
    }


    public TagConverter getTagConverter(){
        return this.tagConverter;
    }
    public void setTagConverter(TagConverter tagConverter ){
        this.tagConverter = tagConverter;
    }
    public DocumentConverter getDocumentConverter(){
        return this.documentConverter;
    }
    public void setDocumentConverter(DocumentConverter documentConverter ){
        this.documentConverter = documentConverter;
    }
    public boolean  isDocument(){
        return this.document;
    }
    public void  setDocument(boolean document){
        this.document = document;
    }
    public boolean  isTag(){
        return this.tag;
    }
    public void  setTag(boolean tag){
        this.tag = tag;
    }
}
