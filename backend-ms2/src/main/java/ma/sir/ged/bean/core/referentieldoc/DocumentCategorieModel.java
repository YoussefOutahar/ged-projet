package ma.sir.ged.bean.core.referentieldoc;

import java.util.Objects;






import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_categorie_model")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_categorie_model_seq",sequenceName="document_categorie_model_seq",allocationSize=1, initialValue = 1)
public class DocumentCategorieModel   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;
    @Lob
    @Column(columnDefinition="TEXT")
    private String referenceGed;
    @Column(length = 500)
    private String description;

    private DocumentCategorie documentCategorie ;
    


    public DocumentCategorieModel(){
        super();
    }

    public DocumentCategorieModel(Long id,String libelle){
        this.id = id;
        this.libelle = libelle ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_categorie_model_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
    }
    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }
    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentCategorie getDocumentCategorie(){
        return this.documentCategorie;
    }
    public void setDocumentCategorie(DocumentCategorie documentCategorie){
        this.documentCategorie = documentCategorie;
    }

    @Transient
    public String getLabel() {
        label = libelle;
        return label;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DocumentCategorieModel documentCategorieModel = (DocumentCategorieModel) o;
        return id != null && id.equals(documentCategorieModel.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

