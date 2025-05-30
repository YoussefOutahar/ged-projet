package  ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import ma.sir.ged.zynerator.validator.DocumentValidator;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@DocumentValidator
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentDto  extends AuditBaseDto {

    @NotBlank(message = "reference est obligatoire")
    private String reference  ;

    private String referenceGed  ;
    private String elasticId;
    private String uploadDate ;
    private Long annee  ;
    private Long semstre  ;
    private Long mois  ;
    private Long jour  ;
    private Long ligne;
    private Long colonne;
    private Long numBoite;
    private Boolean ocr  ;

    public Boolean getSigned() {
        return isSigned;
    }

    public void setSigned(Boolean signed) {
        isSigned = signed;
    }

    private Boolean isSigned ;

    private String content  ;
    private BigDecimal size  ;

    @Size(max = 1500, message = "description doit avoir au maximum 1500 caractères")
    private String description  ;
    private Boolean archive  ;
    private Boolean paraphed;
    private Boolean versionne  ;
    private Boolean qualityFlag;
    private Boolean qualityStatus;
    private Boolean locked;
    private DocumentTypeDto documentType ;
    private DocumentStateDto documentState ;

    @NotNull(message = "documentCategorie est obligatoire")
    private DocumentCategorieDto documentCategorie ;

    @NotNull(message = "utilisateur est obligatoire")
    private UtilisateurDto utilisateur ;

    @NotNull(message = "entiteAdministrative est obligatoire")
    private EntiteAdministrativeDto entiteAdministrative ;
    @NotNull(message = "planClassement est obligatoire")
    private PlanClassementDto planClassement ;
    private DocumentCategorieModelDto documentCategorieModel ;
    private List<DocumentIndexElementDto> documentIndexElements ;
    private List<DocumentPartageGroupeDto> documentPartageGroupes ;
    private List<DocumentPartageUtilisateurDto> documentPartageUtilisateurs ;
    private List<DocumentTagDto> documentTags ;
    private List<EchantillonDto> echantillons ;

    private boolean courrielRelated;

    private Boolean archivable;

    private String documentSignatureCode;



    public DocumentDto(){
        super();
    }



    @Log
    public String getReference(){
        return this.reference;
    }
    public void setReference(String reference){
        this.reference = reference;
    }

    @Log
    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }

    @Log
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    public String getUploadDate(){
        return this.uploadDate;
    }
    public void setUploadDate(String uploadDate){
        this.uploadDate = uploadDate;
    }

    @Log
    public Long getAnnee(){
        return this.annee;
    }
    public void setAnnee(Long annee){
        this.annee = annee;
    }

    @Log
    public Long getSemstre(){
        return this.semstre;
    }
    public void setSemstre(Long semstre){
        this.semstre = semstre;
    }

    @Log
    public Long getMois(){
        return this.mois;
    }
    public void setMois(Long mois){
        this.mois = mois;
    }

    @Log
    public Long getJour(){
        return this.jour;
    }
    public void setJour(Long jour){
        this.jour = jour;
    }

    @Log
    public Boolean getOcr(){
        return this.ocr;
    }
    public void setOcr(Boolean ocr){
        this.ocr = ocr;
    }

    @Log
    public String getContent(){
        return this.content;
    }
    public void setContent(String content){
        this.content = content;
    }

    @Log
    public BigDecimal getSize(){
        return this.size;
    }
    public void setSize(BigDecimal size){
        this.size = size;
    }

    @Log
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }

    @Log
    public Boolean getArchive(){
        return this.archive;
    }
    public void setArchive(Boolean archive){
        this.archive = archive;
    }

    @Log
    public Boolean getVersionne(){
        return this.versionne;
    }
    public void setVersionne(Boolean versionne){
        this.versionne = versionne;
    }
    public Boolean getQualityFlag() {
        return qualityFlag;
    }

    public void setQualityFlag(Boolean qualityFlag) {
        this.qualityFlag = qualityFlag;
    }

    public Boolean getQualityStatus() {
        return qualityStatus;
    }

    public void setQualityStatus(Boolean qualityStatus) {
        this.qualityStatus = qualityStatus;
    }

    public DocumentTypeDto getDocumentType(){
        return this.documentType;
    }

    public void setDocumentType(DocumentTypeDto documentType){
        this.documentType = documentType;
    }
    public DocumentStateDto getDocumentState(){
        return this.documentState;
    }

    public void setDocumentState(DocumentStateDto documentState){
        this.documentState = documentState;
    }
    public DocumentCategorieDto getDocumentCategorie(){
        return this.documentCategorie;
    }

    public void setDocumentCategorie(DocumentCategorieDto documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    public UtilisateurDto getUtilisateur(){
        return this.utilisateur;
    }

    public void setUtilisateur(UtilisateurDto utilisateur){
        this.utilisateur = utilisateur;
    }
    public EntiteAdministrativeDto getEntiteAdministrative(){
        return this.entiteAdministrative;
    }

    public void setEntiteAdministrative(EntiteAdministrativeDto entiteAdministrative){
        this.entiteAdministrative = entiteAdministrative;
    }

    public PlanClassementDto getPlanClassement() {
        return this.planClassement;
    }

    public void setPlanClassement(PlanClassementDto planClassement) {
        this.planClassement = planClassement;
    }

    public DocumentCategorieModelDto getDocumentCategorieModel(){
        return this.documentCategorieModel;
    }

    public void setDocumentCategorieModel(DocumentCategorieModelDto documentCategorieModel){
        this.documentCategorieModel = documentCategorieModel;
    }



    public List<DocumentIndexElementDto> getDocumentIndexElements(){
        return this.documentIndexElements;
    }

    public void setDocumentIndexElements(List<DocumentIndexElementDto> documentIndexElements){
        this.documentIndexElements = documentIndexElements;
    }
    public List<DocumentPartageGroupeDto> getDocumentPartageGroupes(){
        return this.documentPartageGroupes;
    }

    public void setDocumentPartageGroupes(List<DocumentPartageGroupeDto> documentPartageGroupes){
        this.documentPartageGroupes = documentPartageGroupes;
    }
    public List<DocumentPartageUtilisateurDto> getDocumentPartageUtilisateurs(){
        return this.documentPartageUtilisateurs;
    }

    public void setDocumentPartageUtilisateurs(List<DocumentPartageUtilisateurDto> documentPartageUtilisateurs){
        this.documentPartageUtilisateurs = documentPartageUtilisateurs;
    }
    public List<DocumentTagDto> getDocumentTags(){
        return this.documentTags;
    }

    public void setDocumentTags(List<DocumentTagDto> documentTags){
        this.documentTags = documentTags;
    }

    public Long getLigne() {
        return this.ligne;
    }

    public void setLigne(Long ligne) {
        this.ligne = ligne;
    }

    public Long getColonne() {
        return this.colonne;
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
    public List<EchantillonDto> getEchantillons() {
        return echantillons;
    }

    public void setEchantillons(List<EchantillonDto> echantillons) {
        this.echantillons = echantillons;
    }

    public boolean isCourrielRelated() {
        return courrielRelated;
    }

    public void setCourrielRelated(boolean isCourrierRelated) {
        this.courrielRelated = isCourrierRelated;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }
    public String getElasticId() {
        return elasticId;
    }

    public void setElasticId(String elasticId) {
        this.elasticId = elasticId;
    }

    public Boolean getArchivable() {
        return archivable;
    }

    public void setArchivable(Boolean archivable) {
        this.archivable = archivable;
    }

    public String getDocumentSignatureCode() {
        return documentSignatureCode;
    }

    public void setDocumentSignatureCode(String documentSignatureCode) {
        this.documentSignatureCode = documentSignatureCode;
    }

    public Boolean getParaphed() {
        return paraphed;
    }

    public void setParaphed(Boolean paraphed) {
        this.paraphed = paraphed;
    }
}
