package ma.sir.ged.ws.dto.summary;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DocumentSummaryDto {

    @Valid

    private Long id;


    @NotBlank(message = "reference ne doit pas être vide")
    @Size(min = 1, max = 255, message = "reference doit avoir entre 1 et 255 caractères")
    private String reference  ;
    private String referenceGed  ;
    @Size(max = 1500, message = "description doit avoir au maximum 1500 caractères")
    private String description  ;
    private Long ligne;
    private BigDecimal size  ;
    private Long colonne;
    private Long numBoite;
    @JsonProperty("dateDocument")
    private String uploadDate ;
    private Long documentStateId ;
    private Long documentCategorieId ;
    private String documentStateCode ;

    @NotBlank(message = "documentCategorieCode ne doit pas être vide")
    @Size(max = 255, message = "documentCategorieCode doit avoir au maximum 255 caractères")
    private String documentCategorieCode ;
    @JsonProperty("userName")
    private Long utilisateurId;
    private Long entiteAdministrativeId ;
    private String utilisateurEmail;
    private String entiteAdministrativeCode ;
    private Boolean isSigned;

    private Long planClassementId ;
    private String planClassementCode ;

    @Size(max = 255, message = "documentCategorieModelCode doit avoir au maximum 255 caractères")
    private String documentCategorieModelCode ;

    @Size(max = 255, message = "creationDate doit avoir au maximum 255 caractères")
    private String creationDate;

    @Size(max = 255, message = "lastUpdate doit avoir au maximum 255 caractères")
    private String lastUpdate;
    private String fileUrl;

    private Long documentTypeId;
    private String content;

    public List<DocumentIndexElementSummaryDto> getDocumentIndexElements() {
        return documentIndexElements;
    }

    public void setDocumentIndexElements(List<DocumentIndexElementSummaryDto> documentIndexElements) {
        this.documentIndexElements = documentIndexElements;
    }

    @Size(max = 255, message = "documentTypeCode doit avoir au maximum 255 caractères")
    private String documentTypeCode;
    private List<DocumentIndexElementSummaryDto> documentIndexElements ;

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }

    public String getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(String lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getDocumentTypeCode() {
        return documentTypeCode;
    }

    public void setDocumentTypeCode(String documentTypeCode) {
        this.documentTypeCode = documentTypeCode;
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

    public String getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getDocumentStateId() {
        return documentStateId;
    }

    public void setDocumentStateId(Long documentStateId) {
        this.documentStateId = documentStateId;
    }

    public Long getDocumentCategorieId() {
        return documentCategorieId;
    }

    public void setDocumentCategorieId(Long documentCategorieId) {
        this.documentCategorieId = documentCategorieId;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public Long getEntiteAdministrativeId() {
        return entiteAdministrativeId;
    }

    public void setEntiteAdministrativeId(Long entiteAdministrativeId) {
        this.entiteAdministrativeId = entiteAdministrativeId;
    }

    public Long getPlanClassementId() {
        return planClassementId;
    }

    public void setPlanClassementId(Long planClassementId) {
        this.planClassementId = planClassementId;
    }

    public Long getDocumentTypeId() {
        return documentTypeId;
    }

    public void setDocumentTypeId(Long documentTypeId) {
        this.documentTypeId = documentTypeId;
    }

    public String getDocumentStateCode() {
        return documentStateCode;
    }

    public void setDocumentStateCode(String documentStateCode) {
        this.documentStateCode = documentStateCode;
    }

    public String getDocumentCategorieCode() {
        return documentCategorieCode;
    }

    public void setDocumentCategorieCode(String documentCategorieCode) {
        this.documentCategorieCode = documentCategorieCode;
    }

    public String getUtilisateurEmail() {
        return utilisateurEmail;
    }

    public void setUtilisateurEmail(String utilisateurEmail) {
        this.utilisateurEmail = utilisateurEmail;
    }

    public String getEntiteAdministrativeCode() {
        return entiteAdministrativeCode;
    }

    public void setEntiteAdministrativeCode(String entiteAdministrativeCode) {
        this.entiteAdministrativeCode = entiteAdministrativeCode;
    }

    public String getPlanClassementCode() {
        return planClassementCode;
    }

    public void setPlanClassementCode(String planClassementCode) {
        this.planClassementCode = planClassementCode;
    }

    public String getDocumentCategorieModelCode() {
        return documentCategorieModelCode;
    }

    public void setDocumentCategorieModelCode(String documentCategorieModelCode) {
        this.documentCategorieModelCode = documentCategorieModelCode;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getSigned() {
        return isSigned;
    }

    public void setSigned(Boolean signed) {
        isSigned = signed;
    }

    public BigDecimal getSize() {
        return size;
    }

    public void setSize(BigDecimal size) {
        this.size = size;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
