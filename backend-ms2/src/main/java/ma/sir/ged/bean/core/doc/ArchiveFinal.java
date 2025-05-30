package ma.sir.ged.bean.core.doc;

import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "archiveFinal")
public class ArchiveFinal extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 500)
    private String reference;
    @Lob
    @Column(columnDefinition="TEXT")
    private String referenceGed;
    private LocalDateTime uploadDate ;

    @Column(length = 1500000)
    private String SnapShots;
    private Long ligne ;
    private Long colonne ;
    private Long numBoite ;

    public ArchiveFinal() {super();}

    public ArchiveFinal(Long id,String reference){
        this.id = id;
        this.reference = reference ;
    }
    @Override
    public Long getId() {
        return id;
    }
    public String getReference() {
        return reference;
    }
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public String getSnapShots() {
        return SnapShots;
    }

    public String getReferenceGed() {
        return referenceGed;
    }

    public void setReferenceGed(String referenceGed) {
        this.referenceGed = referenceGed;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
    public void setReference(String reference) {
        this.reference = reference;
    }
    public void setUploadDate(LocalDateTime dateContenue) {
        this.uploadDate = dateContenue;
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
