package ma.sir.ged.bean.core.doc;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "echantillon")
public class Echantillon extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomechantillon")
    private String nomEchantillon;
    @Enumerated(EnumType.STRING)
    private EchantillonState echantillonState;
    @Column(name = "note")
    private String note;


    @ManyToMany()
    @JsonManagedReference
    @JsonIgnoreProperties({"utilisateur","entiteAdministrative","documentCategorie","documentState","documentType","documentCategorieModel","documentIndexElements","documentPartageGroupes","documentPartageUtilisateurs"})
    @JoinTable(name = "echantillon_document", joinColumns = { @JoinColumn(name = "echantillon_id") }, inverseJoinColumns = { @JoinColumn(name = "document_id") })
    private List<Document> documents = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomEchantillon() {
        return nomEchantillon;
    }

    public void setNomEchantillon(String nomEchantillon) {
        this.nomEchantillon = nomEchantillon;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
    public EchantillonState getEchantillonState() {
        return echantillonState;
    }

    public void setEchantillonState(EchantillonState echantillonState) {
        this.echantillonState = echantillonState;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
