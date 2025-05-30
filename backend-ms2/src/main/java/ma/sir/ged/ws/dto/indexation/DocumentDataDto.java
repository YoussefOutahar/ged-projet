package ma.sir.ged.ws.dto.indexation;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class DocumentDataDto {
    private String id;
    private Long originalId;
    private String reference;
    private String referenceGed;
    private Date uploadDate;
    private Integer annee;
    private Integer semestre;
    private Integer mois;
    private Integer jour;
    private Boolean ocr;
    private String content;
    private BigDecimal size;
    private String description;
    private Boolean archive;
    private Boolean versionne;

    private DocumentTypeIndex documentType;
    private DocumentStateIndex documentState;

    private DocumentCategorieIndex documentCategorie;

    private UtilisateurIndex utilisateur;

    private EntiteAdministrativeIndex entiteAdministrative;

    private List<DocumentIndexElementIndex> documentIndexElements;

    public boolean hasOriginalId(){
        return Objects.nonNull(this.originalId);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getOriginalId() {
        return originalId;
    }

    public void setOriginalId(Long originalId) {
        this.originalId = originalId;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getReferenceGed() {
        return referenceGed;
    }

    public void setReferenceGed(String referenceGed) {
        this.referenceGed = referenceGed;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(Date uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Integer getAnnee() {
        return annee;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    public Integer getSemestre() {
        return semestre;
    }

    public void setSemestre(Integer semestre) {
        this.semestre = semestre;
    }

    public Integer getMois() {
        return mois;
    }

    public void setMois(Integer mois) {
        this.mois = mois;
    }

    public Integer getJour() {
        return jour;
    }

    public void setJour(Integer jour) {
        this.jour = jour;
    }

    public Boolean getOcr() {
        return ocr;
    }

    public void setOcr(Boolean ocr) {
        this.ocr = ocr;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public BigDecimal getSize() {
        return size;
    }

    public void setSize(BigDecimal size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getArchive() {
        return archive;
    }

    public void setArchive(Boolean archive) {
        this.archive = archive;
    }

    public Boolean getVersionne() {
        return versionne;
    }

    public void setVersionne(Boolean versionne) {
        this.versionne = versionne;
    }

    public DocumentTypeIndex getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentTypeIndex documentType) {
        this.documentType = documentType;
    }

    public DocumentStateIndex getDocumentState() {
        return documentState;
    }

    public void setDocumentState(DocumentStateIndex documentState) {
        this.documentState = documentState;
    }

    public DocumentCategorieIndex getDocumentCategorie() {
        return documentCategorie;
    }

    public void setDocumentCategorie(DocumentCategorieIndex documentCategorie) {
        this.documentCategorie = documentCategorie;
    }

    public UtilisateurIndex getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(UtilisateurIndex utilisateur) {
        this.utilisateur = utilisateur;
    }

    public EntiteAdministrativeIndex getEntiteAdministrative() {
        return entiteAdministrative;
    }

    public void setEntiteAdministrative(EntiteAdministrativeIndex entiteAdministrative) {
        this.entiteAdministrative = entiteAdministrative;
    }

    public List<DocumentIndexElementIndex> getDocumentIndexElements() {
        return documentIndexElements;
    }

    public void setDocumentIndexElements(List<DocumentIndexElementIndex> documentIndexElements) {
        this.documentIndexElements = documentIndexElements;
    }
}
