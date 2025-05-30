package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.doc.Document;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.DateUtil;
import ma.sir.ged.bean.history.DocumentPartageUtilisateurHistory;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.ws.dto.DocumentPartageUtilisateurDto;

@Component
public class DocumentPartageUtilisateurConverter extends AbstractConverter<DocumentPartageUtilisateur, DocumentPartageUtilisateurDto, DocumentPartageUtilisateurHistory> {

    @Autowired
    private UtilisateurConverter utilisateurConverter ;
    @Autowired
    private DocumentConverter documentConverter ;
    @Autowired
    private AccessShareConverter accessShareConverter ;
    private boolean document;
    private boolean utilisateur;
    private boolean accessShare;

    public  DocumentPartageUtilisateurConverter(){
        super(DocumentPartageUtilisateur.class, DocumentPartageUtilisateurDto.class, DocumentPartageUtilisateurHistory.class);
    }

    @Override
    public DocumentPartageUtilisateur toItem(DocumentPartageUtilisateurDto dto) {
        if (dto == null) {
            return null;
        } else {
        DocumentPartageUtilisateur item = new DocumentPartageUtilisateur();
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

            if(this.utilisateur && dto.getUtilisateur()!=null &&  dto.getUtilisateur().getId() != null)
                item.setUtilisateur(utilisateurConverter.toItem(dto.getUtilisateur())) ;

            if(this.accessShare && dto.getAccessShare()!=null &&  dto.getAccessShare().getId() != null)
                item.setAccessShare(accessShareConverter.toItem(dto.getAccessShare())) ;




        return item;
        }
    }

    @Override
    public DocumentPartageUtilisateurDto toDto(DocumentPartageUtilisateur item) {
        if (item == null) {
            return null;
        } else {
            DocumentPartageUtilisateurDto dto = new DocumentPartageUtilisateurDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(item.getDateShare()!=null)
                dto.setDateShare(DateUtil.dateTimeToString(item.getDateShare()));
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
        if(this.document && item.getDocument()!=null) {
            dto.setDocument(documentConverter.toDto(item.getDocument())) ;
        }
        if(this.utilisateur && item.getUtilisateur()!=null) {
            dto.setUtilisateur(utilisateurConverter.toDto(item.getUtilisateur())) ;
        }
        if(this.accessShare && item.getAccessShare()!=null) {
            dto.setAccessShare(accessShareConverter.toDto(item.getAccessShare())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.document = value;
        this.utilisateur = value;
        this.accessShare = value;
    }


    public UtilisateurConverter getUtilisateurConverter(){
        return this.utilisateurConverter;
    }
    public void setUtilisateurConverter(UtilisateurConverter utilisateurConverter ){
        this.utilisateurConverter = utilisateurConverter;
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
    public boolean  isUtilisateur(){
        return this.utilisateur;
    }
    public void  setUtilisateur(boolean utilisateur){
        this.utilisateur = utilisateur;
    }
    public boolean  isAccessShare(){
        return this.accessShare;
    }
    public void  setAccessShare(boolean accessShare){
        this.accessShare = accessShare;
    }
}
