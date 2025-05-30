package ma.sir.ged.ws.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import javax.persistence.Column;
import javax.persistence.Lob;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class ArchiveFinalDto extends AuditBaseDto {
    private String reference;
    private String referenceGed;
    private String uploadDate ;
    private String SnapShots;
    private Long ligne ;
    private Long colonne ;
    private Long numBoite ;

    public ArchiveFinalDto(){
        super();
    }

    public String getReference() {
        return reference;
    }

    public String getReferenceGed() {
        return referenceGed;
    }

    public String getUploadDate() {
        return uploadDate;
    }

    public String getSnapShots() {
        return SnapShots;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public void setReferenceGed(String referenceGed) {
        this.referenceGed = referenceGed;
    }

    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }

    public void setSnapShots(String snapShots) {
        SnapShots = snapShots;
    }

    public Long getLigne() {
        return ligne;
    }

    public void setLigne(Long ligne) {
        this.ligne = ligne;
    }

    public Long getColonne() {
        return colonne;
    }

    public void setColonne(Long colonne) {
        this.colonne = colonne;
    }

    public Long getNumBoite() {
        return numBoite;
    }

    public void setNumBoite(Long numBoite) {
        this.numBoite = numBoite;
    }
}
