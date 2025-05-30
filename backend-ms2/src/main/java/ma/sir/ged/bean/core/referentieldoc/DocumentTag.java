package ma.sir.ged.bean.core.referentieldoc;

import java.util.Objects;






import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_tag")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_tag_seq",sequenceName="document_tag_seq",allocationSize=1, initialValue = 1)
public class DocumentTag   extends AuditBusinessObject     {

    private Long id;


    private Document document ;
    
    private Tag tag ;
    


    public DocumentTag(){
        super();
    }





    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_tag_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Document getDocument(){
        return this.document;
    }
    public void setDocument(Document document){
        this.document = document;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Tag getTag(){
        return this.tag;
    }
    public void setTag(Tag tag){
        this.tag = tag;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DocumentTag documentTag = (DocumentTag) o;
        return id != null && id.equals(documentTag.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

