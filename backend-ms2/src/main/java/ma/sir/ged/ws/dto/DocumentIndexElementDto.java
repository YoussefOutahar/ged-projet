package  ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;



@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentIndexElementDto  extends AuditBaseDto {

    private String value  ;
    private String description  ;

    private IndexElementDto indexElement ;
    private DocumentDto document ;



    public DocumentIndexElementDto(){
        super();
    }



    @Log
    public String getValue(){
        return this.value;
    }
    public void setValue(String value){
        this.value = value;
    }

    @Log
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }


    public IndexElementDto getIndexElement(){
        return this.indexElement;
    }

    public void setIndexElement(IndexElementDto indexElement){
        this.indexElement = indexElement;
    }
    public DocumentDto getDocument(){
        return this.document;
    }

    public void setDocument(DocumentDto document){
        this.document = document;
    }






}
