package ma.sir.ged.ws.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentCommentaireDto extends AuditBaseDto {
    private Long id;
    private Long documentId;
    private Document document;
    private String contenu;
    private Boolean valide;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
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
