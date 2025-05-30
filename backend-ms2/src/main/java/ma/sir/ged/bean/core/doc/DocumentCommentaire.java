package ma.sir.ged.bean.core.doc;

import com.fasterxml.jackson.annotation.JsonBackReference;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "documentCommentaire")
public class DocumentCommentaire extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;

    private String contenu;
    private Boolean valide = false;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public Boolean getValide() {
        return valide;
    }

    public void setValide(Boolean valide) {
        this.valide = valide;
    }
}
