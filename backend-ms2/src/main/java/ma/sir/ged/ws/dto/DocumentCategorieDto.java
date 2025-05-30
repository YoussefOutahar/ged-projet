package  ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentCategorieDto  extends AuditBaseDto {

    private String code  ;
    private String libelle  ;
    private String description  ;


    private List<DocumentCategorieIndexDto> documentCategorieIndexs ;
    private List<DocumentCategorieModelDto> documentCategorieModels ;


    public DocumentCategorieDto(){
        super();
    }



    @Log
    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
    }

    @Log
    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }

    @Log
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }





    public List<DocumentCategorieIndexDto> getDocumentCategorieIndexs(){
        return this.documentCategorieIndexs;
    }

    public void setDocumentCategorieIndexs(List<DocumentCategorieIndexDto> documentCategorieIndexs){
        this.documentCategorieIndexs = documentCategorieIndexs;
    }
    public List<DocumentCategorieModelDto> getDocumentCategorieModels(){
        return this.documentCategorieModels;
    }

    public void setDocumentCategorieModels(List<DocumentCategorieModelDto> documentCategorieModels){
        this.documentCategorieModels = documentCategorieModels;
    }



}
