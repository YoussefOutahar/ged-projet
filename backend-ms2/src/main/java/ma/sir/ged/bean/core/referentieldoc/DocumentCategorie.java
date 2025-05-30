package ma.sir.ged.bean.core.referentieldoc;

import java.util.Objects;
import java.util.List;






import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_categorie")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_categorie_seq",sequenceName="document_categorie_seq",allocationSize=1, initialValue = 1)
public class DocumentCategorie   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;
    @Column(length = 500)
    private String description;


    private List<DocumentCategorieIndex> documentCategorieIndexs ;
    private List<DocumentCategorieModel> documentCategorieModels ;

    public DocumentCategorie(){
        super();
    }

    public DocumentCategorie(Long id,String libelle){
        this.id = id;
        this.libelle = libelle ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_categorie_seq")
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
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }

    @JsonManagedReference
    @OneToMany(mappedBy = "documentCategorie")
    public List<DocumentCategorieIndex> getDocumentCategorieIndexs(){
        return this.documentCategorieIndexs;
    }
    public void setDocumentCategorieIndexs(List<DocumentCategorieIndex> documentCategorieIndexs){
        this.documentCategorieIndexs = documentCategorieIndexs;
    }
    @OneToMany(mappedBy = "documentCategorie")
    public List<DocumentCategorieModel> getDocumentCategorieModels(){
        return this.documentCategorieModels;
    }
    public void setDocumentCategorieModels(List<DocumentCategorieModel> documentCategorieModels){
        this.documentCategorieModels = documentCategorieModels;
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
        DocumentCategorie documentCategorie = (DocumentCategorie) o;
        return id != null && id.equals(documentCategorie.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

