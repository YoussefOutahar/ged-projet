package  ma.sir.ged.ws.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import com.fasterxml.jackson.annotation.JsonFormat;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentPartageGroupeDto  extends AuditBaseDto {

    private String dateShare ;
    private String description  ;

    private DocumentDto document ;
    private GroupeDto groupe ;
    private AccessShareDto accessShare ;



    public DocumentPartageGroupeDto(){
        super();
    }



    @Log
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    public String getDateShare(){
        return this.dateShare;
    }
    public void setDateShare(String dateShare){
        this.dateShare = dateShare;
    }

    @Log
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }


    public DocumentDto getDocument(){
        return this.document;
    }

    public void setDocument(DocumentDto document){
        this.document = document;
    }
    public GroupeDto getGroupe(){
        return this.groupe;
    }

    public void setGroupe(GroupeDto groupe){
        this.groupe = groupe;
    }
    public AccessShareDto getAccessShare(){
        return this.accessShare;
    }

    public void setAccessShare(AccessShareDto accessShare){
        this.accessShare = accessShare;
    }






}
