package  ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;



@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentCategorieIndexDto  extends AuditBaseDto {


    private IndexElementDto indexElement ;
    private DocumentCategorieDto documentCategorie ;
    private DocumentCategorieIndexRuleDto documentCategorieIndexRule ;



    public DocumentCategorieIndexDto(){
        super();
    }




    public IndexElementDto getIndexElement(){
        return this.indexElement;
    }

    public void setIndexElement(IndexElementDto indexElement){
        this.indexElement = indexElement;
    }
    public DocumentCategorieDto getDocumentCategorie(){
        return this.documentCategorie;
    }

    public void setDocumentCategorie(DocumentCategorieDto documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    public DocumentCategorieIndexRuleDto getDocumentCategorieIndexRule(){
        return this.documentCategorieIndexRule;
    }

    public void setDocumentCategorieIndexRule(DocumentCategorieIndexRuleDto documentCategorieIndexRule){
        this.documentCategorieIndexRule = documentCategorieIndexRule;
    }






}
