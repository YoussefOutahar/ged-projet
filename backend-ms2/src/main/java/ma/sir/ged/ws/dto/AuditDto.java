package ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.time.LocalDateTime;

public class AuditDto  extends AuditBaseDto {
    private Long id;
    private Long utilisateurId;
    private Long documentId;
    private String action;
    private LocalDateTime uploadDate ;
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}
