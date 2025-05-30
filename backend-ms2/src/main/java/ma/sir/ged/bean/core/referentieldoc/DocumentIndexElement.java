package ma.sir.ged.bean.core.referentieldoc;

import java.util.Objects;






import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_index_element")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_index_element_seq",sequenceName="document_index_element_seq",allocationSize=1, initialValue = 1)
public class DocumentIndexElement   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 80000)
    private String value;
    @Column(length = 500)
    private String description;

    private IndexElement indexElement ;
    
    private Document document ;
    


    public DocumentIndexElement(){
        super();
    }





    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_index_element_seq")
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
    @ManyToOne(fetch = FetchType.LAZY)
    public Document getDocument(){
        return this.document;
    }
    public void setDocument(Document document){
        this.document = document;
    }
    public String getValue(){
        return this.value;
    }
    public void setValue(String value){
        this.value = value;
    }
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DocumentIndexElement documentIndexElement = (DocumentIndexElement) o;
        return id != null && id.equals(documentIndexElement.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

