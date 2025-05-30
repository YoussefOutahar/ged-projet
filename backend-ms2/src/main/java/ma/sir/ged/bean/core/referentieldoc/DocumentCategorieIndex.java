package ma.sir.ged.bean.core.referentieldoc;

import java.util.Objects;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_categorie_index")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_categorie_index_seq",sequenceName="document_categorie_index_seq",allocationSize=1, initialValue = 1)
public class DocumentCategorieIndex   extends AuditBusinessObject     {

    private Long id;


    private IndexElement indexElement ;
    
    private DocumentCategorie documentCategorie ;
    
    private DocumentCategorieIndexRule documentCategorieIndexRule ;
    


    public DocumentCategorieIndex(){
        super();
    }





    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_categorie_index_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public IndexElement getIndexElement(){
        return this.indexElement;
    }
    public void setIndexElement(IndexElement indexElement){
        this.indexElement = indexElement;
    }

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentCategorie getDocumentCategorie(){
        return this.documentCategorie;
    }
    public void setDocumentCategorie(DocumentCategorie documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentCategorieIndexRule getDocumentCategorieIndexRule(){
        return this.documentCategorieIndexRule;
    }
    public void setDocumentCategorieIndexRule(DocumentCategorieIndexRule documentCategorieIndexRule){
        this.documentCategorieIndexRule = documentCategorieIndexRule;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DocumentCategorieIndex documentCategorieIndex = (DocumentCategorieIndex) o;
        return id != null && id.equals(documentCategorieIndex.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

