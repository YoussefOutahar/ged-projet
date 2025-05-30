package  ma.sir.ged.ws.converter;

import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.referentieldoc.IndexElementDao;
import ma.sir.ged.ws.dto.summary.DocumentIndexElementSummaryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.doc.Document;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.DocumentIndexElementHistory;
import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.ws.dto.DocumentIndexElementDto;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentIndexElementConverter extends AbstractConverter<DocumentIndexElement, DocumentIndexElementDto, DocumentIndexElementHistory> {

    @Autowired
    private IndexElementConverter indexElementConverter ;
    @Autowired
    private DocumentConverter documentConverter ;
    @Autowired
    private IndexElementDao indexElementDao ;
    @Autowired
    private DocumentDao documentDao ;
    private boolean indexElement;
    private boolean document;

    public  DocumentIndexElementConverter(){
        super(DocumentIndexElement.class, DocumentIndexElementDto.class, DocumentIndexElementHistory.class);
    }

    @Override
    public DocumentIndexElement toItem(DocumentIndexElementDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentIndexElement item = new DocumentIndexElement();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getValue()))
                item.setValue(dto.getValue());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());
            if(this.indexElement && dto.getIndexElement()!=null &&  dto.getIndexElement().getId() != null)
                item.setIndexElement(indexElementConverter.toItem(dto.getIndexElement())) ;

            if(dto.getDocument() != null && dto.getDocument().getId() != null){
                item.setDocument(new Document());
                item.getDocument().setId(dto.getDocument().getId());
                item.getDocument().setReference(dto.getDocument().getReference());
            }




        return item;
        }
    }

    public List<DocumentIndexElement> SummarytoItem(List<DocumentIndexElementSummaryDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        } else {
            return dtos.stream()
                    .map(dto -> {
                        DocumentIndexElement item = new DocumentIndexElement();
                        if(StringUtil.isNotEmpty(dto.getValue()))
                            item.setValue(dto.getValue());
                        if(StringUtil.isNotEmpty(dto.getDescription()))
                            item.setDescription(dto.getDescription());
                        if(this.indexElement && dto.getIndexElementId()!=null)
                            item.setIndexElement(indexElementDao.findById(dto.getIndexElementId()).orElse(null));

                        if(dto.getDocumentId() != null){
                            item.setDocument(documentDao.findById(dto.getDocumentId()).orElse(null));
                        }


                        return item;
                    })
                    .collect(Collectors.toList());
        }
    }

    @Override
    public DocumentIndexElementDto toDto(DocumentIndexElement item) {
        if (item == null) {
            return null;
        } else {
            DocumentIndexElementDto dto = new DocumentIndexElementDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getValue()))
                dto.setValue(item.getValue());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
        if(this.indexElement && item.getIndexElement()!=null) {
            dto.setIndexElement(indexElementConverter.toDto(item.getIndexElement())) ;
        }
        if(this.document && item.getDocument()!=null) {
            dto.setDocument(documentConverter.toDto(item.getDocument())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.indexElement = value;
        this.document = value;
    }


    public IndexElementConverter getIndexElementConverter(){
        return this.indexElementConverter;
    }
    public void setIndexElementConverter(IndexElementConverter indexElementConverter ){
        this.indexElementConverter = indexElementConverter;
    }
    public DocumentConverter getDocumentConverter(){
        return this.documentConverter;
    }
    public void setDocumentConverter(DocumentConverter documentConverter ){
        this.documentConverter = documentConverter;
    }
    public boolean  isIndexElement(){
        return this.indexElement;
    }
    public void  setIndexElement(boolean indexElement){
        this.indexElement = indexElement;
    }
    public boolean  isDocument(){
        return this.document;
    }
    public void  setDocument(boolean document){
        this.document = document;
    }
}
