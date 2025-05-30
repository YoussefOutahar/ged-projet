package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.referentielpartage.Groupe;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.DateUtil;
import ma.sir.ged.bean.history.DocumentPartageGroupeHistory;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.ws.dto.DocumentPartageGroupeDto;

@Component
public class DocumentPartageGroupeConverter extends AbstractConverter<DocumentPartageGroupe, DocumentPartageGroupeDto, DocumentPartageGroupeHistory> {

    @Autowired
    private GroupeConverter groupeConverter ;
    @Autowired
    private DocumentConverter documentConverter ;
    @Autowired
    private AccessShareConverter accessShareConverter ;
    private boolean document;
    private boolean groupe;
    private boolean accessShare;

    public  DocumentPartageGroupeConverter(){
        super(DocumentPartageGroupe.class, DocumentPartageGroupeDto.class, DocumentPartageGroupeHistory.class);
    }

    @Override
    public DocumentPartageGroupe toItem(DocumentPartageGroupeDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentPartageGroupe item = new DocumentPartageGroupe();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getDateShare()))
                item.setDateShare(DateUtil.stringEnToDate(dto.getDateShare()));
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());
            if(dto.getDocument() != null && dto.getDocument().getId() != null){
                item.setDocument(new Document());
                item.getDocument().setId(dto.getDocument().getId());
                item.getDocument().setReference(dto.getDocument().getReference());
            }

            if(dto.getGroupe() != null && dto.getGroupe().getId() != null){
                item.setGroupe(new Groupe());
                item.getGroupe().setId(dto.getGroupe().getId());
                item.getGroupe().setLibelle(dto.getGroupe().getLibelle());
            }

            if(this.accessShare && dto.getAccessShare()!=null &&  dto.getAccessShare().getId() != null)
                item.setAccessShare(accessShareConverter.toItem(dto.getAccessShare())) ;




        return item;
        }
    }

    @Override
    public DocumentPartageGroupeDto toDto(DocumentPartageGroupe item) {
        if (item == null) {
            return null;
        } else {
            DocumentPartageGroupeDto dto = new DocumentPartageGroupeDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(item.getDateShare()!=null)
                dto.setDateShare(DateUtil.dateTimeToString(item.getDateShare()));
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
        if(this.document && item.getDocument()!=null) {
            dto.setDocument(documentConverter.toDto(item.getDocument())) ;
        }
        if(this.groupe && item.getGroupe()!=null) {
            dto.setGroupe(groupeConverter.toDto(item.getGroupe())) ;
        }
        if(this.accessShare && item.getAccessShare()!=null) {
            dto.setAccessShare(accessShareConverter.toDto(item.getAccessShare())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.document = value;
        this.groupe = value;
        this.accessShare = value;
    }


    public GroupeConverter getGroupeConverter(){
        return this.groupeConverter;
    }
    public void setGroupeConverter(GroupeConverter groupeConverter ){
        this.groupeConverter = groupeConverter;
    }
    public DocumentConverter getDocumentConverter(){
        return this.documentConverter;
    }
    public void setDocumentConverter(DocumentConverter documentConverter ){
        this.documentConverter = documentConverter;
    }
    public AccessShareConverter getAccessShareConverter(){
        return this.accessShareConverter;
    }
    public void setAccessShareConverter(AccessShareConverter accessShareConverter ){
        this.accessShareConverter = accessShareConverter;
    }
    public boolean  isDocument(){
        return this.document;
    }
    public void  setDocument(boolean document){
        this.document = document;
    }
    public boolean  isGroupe(){
        return this.groupe;
    }
    public void  setGroupe(boolean groupe){
        this.groupe = groupe;
    }
    public boolean  isAccessShare(){
        return this.accessShare;
    }
    public void  setAccessShare(boolean accessShare){
        this.accessShare = accessShare;
    }
}
