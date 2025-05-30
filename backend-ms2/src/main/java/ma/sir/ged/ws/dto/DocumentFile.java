package ma.sir.ged.ws.dto;

import java.math.BigDecimal;
import java.time.LocalDate;


public class DocumentFile {

    private String id;
    private String title;
    private String content;
    private String referenceGed;
    private String reference;
    private LocalDate uploadDate;
    private LocalDate dateLastUpdate;

    private Long annee  ;
    private Long semstre  ;
    private Long mois  ;
    private Long jour  ;
    private BigDecimal size  ;
    private Boolean ocr  ;

    private Boolean archive  ;
    private Boolean versionne  ;

    private String documentType ;
    private String documentState ;
    private String documentCategorie ;
    private String utilisateur ;
    private String entiteAdministrative ;
    private String documentCategorieModel ;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getReferenceGed() {
        return referenceGed;
    }

    public void setReferenceGed(String referenceGed) {
        this.referenceGed = referenceGed;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public LocalDate getDateLastUpdate() {
        return dateLastUpdate;
    }

    public void setDateLastUpdate(LocalDate dateLastUpdate) {
        this.dateLastUpdate = dateLastUpdate;
    }

    public Long getAnnee() {
        return annee;
    }

    public void setAnnee(Long annee) {
        this.annee = annee;
    }

    public Long getSemstre() {
        return semstre;
    }

    public void setSemstre(Long semstre) {
        this.semstre = semstre;
    }

    public Long getMois() {
        return mois;
    }

    public void setMois(Long mois) {
        this.mois = mois;
    }

    public Long getJour() {
        return jour;
    }

    public void setJour(Long jour) {
        this.jour = jour;
    }

    public Boolean getOcr() {
        return ocr;
    }

    public void setOcr(Boolean ocr) {
        this.ocr = ocr;
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

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentState() {
        return documentState;
    }

    public void setDocumentState(String documentState) {
        this.documentState = documentState;
    }

    public String getDocumentCategorie() {
        return documentCategorie;
    }

    public void setDocumentCategorie(String documentCategorie) {
        this.documentCategorie = documentCategorie;
    }

    public String getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(String utilisateur) {
        this.utilisateur = utilisateur;
    }

    public String getEntiteAdministrative() {
        return entiteAdministrative;
    }

    public void setEntiteAdministrative(String entiteAdministrative) {
        this.entiteAdministrative = entiteAdministrative;
    }

    public String getDocumentCategorieModel() {
        return documentCategorieModel;
    }

    public void setDocumentCategorieModel(String documentCategorieModel) {
        this.documentCategorieModel = documentCategorieModel;
    }

    public BigDecimal getSize() {
        return size;
    }

    public void setSize(BigDecimal size) {
        this.size = size;
    }
}
