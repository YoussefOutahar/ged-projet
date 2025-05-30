package  ma.sir.ged.dao.criteria.core;


import ma.sir.ged.zynerator.criteria.BaseCriteria;
import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;

public class DocumentCriteria extends  BaseCriteria  {

    private String reference;
    private String elasticId;
    private String referenceLike;
    private String referenceGed;
    private String referenceGedLike;
    private LocalDateTime uploadDate;
    private LocalDateTime uploadDateFrom;
    private LocalDateTime uploadDateTo;
    private Boolean isSigned ;

    private String annee;
    private String anneeMin;
    private String anneeMax;
    private String semstre;
    private String semstreMin;
    private String semstreMax;
    private String mois;
    private String moisMin;
    private String moisMax;
    private String jour;
    private String ligne;
    private String colonne;
    private String numBoite;
    private String jourMin;
    private String jourMax;
    private Boolean ocr;
    private String content;
    private String contentLike;
    private String size;
    private String sizeMin;
    private String sizeMax;
    private String description;
    private String descriptionLike;
    private Boolean archive;
    private Boolean versionne;
    private Boolean deleted;
    private Boolean locked;
    private Boolean qualityFlag;
    private Boolean qualityStatus;

    private DocumentTypeCriteria documentType ;
    private List<DocumentTypeCriteria> documentTypes ;
    private DocumentStateCriteria documentState ;
    private List<DocumentStateCriteria> documentStates ;
    private DocumentCategorieCriteria documentCategorie ;
    private List<DocumentCategorieCriteria> documentCategories ;
    private UtilisateurCriteria utilisateur ;
    private List<UtilisateurCriteria> utilisateurs ;
    private EntiteAdministrativeCriteria entiteAdministrative ;
    private List<EntiteAdministrativeCriteria> entiteAdministratives ;

    private PlanClassementCriteria planClassement ;
    private List<PlanClassementCriteria> planClassements ;
    private DocumentCategorieModelCriteria documentCategorieModel ;
    private List<DocumentCategorieModelCriteria> documentCategorieModels ;
    private List<EchantillonCriteria> echantillons ;

    private Boolean archivable;



    public DocumentCriteria(){}

    public String getReference(){
        return this.reference;
    }
    public void setReference(String reference){
        this.reference = reference;
    }
    public String getReferenceLike(){
        return this.referenceLike;
    }
    public void setReferenceLike(String referenceLike){
        this.referenceLike = referenceLike;
    }

    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }
    public String getReferenceGedLike(){
        return this.referenceGedLike;
    }
    public void setReferenceGedLike(String referenceGedLike){
        this.referenceGedLike = referenceGedLike;
    }

    public LocalDateTime getUploadDate(){
        return this.uploadDate;
    }
    public void setUploadDate(LocalDateTime uploadDate){
        this.uploadDate = uploadDate;
    }
    public LocalDateTime getUploadDateFrom(){
        return this.uploadDateFrom;
    }
    public void setUploadDateFrom(LocalDateTime uploadDateFrom){
        this.uploadDateFrom = uploadDateFrom;
    }
    public LocalDateTime getUploadDateTo(){
        return this.uploadDateTo;
    }
    public void setUploadDateTo(LocalDateTime uploadDateTo){
        this.uploadDateTo = uploadDateTo;
    }
    public String getAnnee(){
        return this.annee;
    }
    public void setAnnee(String annee){
        this.annee = annee;
    }   
    public String getAnneeMin(){
        return this.anneeMin;
    }
    public void setAnneeMin(String anneeMin){
        this.anneeMin = anneeMin;
    }
    public String getAnneeMax(){
        return this.anneeMax;
    }
    public void setAnneeMax(String anneeMax){
        this.anneeMax = anneeMax;
    }
      
    public String getSemstre(){
        return this.semstre;
    }
    public void setSemstre(String semstre){
        this.semstre = semstre;
    }   
    public String getSemstreMin(){
        return this.semstreMin;
    }
    public void setSemstreMin(String semstreMin){
        this.semstreMin = semstreMin;
    }
    public String getSemstreMax(){
        return this.semstreMax;
    }
    public void setSemstreMax(String semstreMax){
        this.semstreMax = semstreMax;
    }
      
    public String getMois(){
        return this.mois;
    }
    public void setMois(String mois){
        this.mois = mois;
    }   
    public String getMoisMin(){
        return this.moisMin;
    }
    public void setMoisMin(String moisMin){
        this.moisMin = moisMin;
    }
    public String getMoisMax(){
        return this.moisMax;
    }
    public void setMoisMax(String moisMax){
        this.moisMax = moisMax;
    }
      
    public String getJour(){
        return this.jour;
    }
    public void setJour(String jour){
        this.jour = jour;
    }   
    public String getJourMin(){
        return this.jourMin;
    }
    public void setJourMin(String jourMin){
        this.jourMin = jourMin;
    }
    public String getJourMax(){
        return this.jourMax;
    }
    public void setJourMax(String jourMax){
        this.jourMax = jourMax;
    }
    public String getLigne() {
        return ligne;
    }
    public void setLigne(String ligne) {
        this.ligne = ligne;
    }
    public String getColonne() {
        return colonne;
    }
    public void setColonne(String colonne) {
        this.colonne = colonne;
    }
    public String getNumBoite() {
        return this.numBoite;
    }
    public void setNumBoite(String numBoite) {
        this.numBoite = numBoite;
    }
    public Boolean getOcr(){
        return this.ocr;
    }
    public void setOcr(Boolean ocr){
        this.ocr = ocr;
    }
    public String getContent(){
        return this.content;
    }
    public void setContent(String content){
        this.content = content;
    }
    public String getContentLike(){
        return this.contentLike;
    }
    public void setContentLike(String contentLike){
        this.contentLike = contentLike;
    }

    public String getSize(){
        return this.size;
    }
    public void setSize(String size){
        this.size = size;
    }   
    public String getSizeMin(){
        return this.sizeMin;
    }
    public void setSizeMin(String sizeMin){
        this.sizeMin = sizeMin;
    }
    public String getSizeMax(){
        return this.sizeMax;
    }
    public void setSizeMax(String sizeMax){
        this.sizeMax = sizeMax;
    }
    public Boolean getLocked() {
        return locked;
    }
    public void setLocked(Boolean locked) {
        this.locked = locked;
    }
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }
    public String getDescriptionLike(){
        return this.descriptionLike;
    }
    public void setDescriptionLike(String descriptionLike){
        this.descriptionLike = descriptionLike;
    }

    public Boolean getArchive(){
        return this.archive;
    }
    public void setArchive(Boolean archive){
        this.archive = archive;
    }
    public Boolean getVersionne(){
        return this.versionne;
    }
    public void setVersionne(Boolean versionne){
        this.versionne = versionne;
    }

    public DocumentTypeCriteria getDocumentType(){
        return this.documentType;
    }

    public void setDocumentType(DocumentTypeCriteria documentType){
        this.documentType = documentType;
    }
    public List<DocumentTypeCriteria> getDocumentTypes(){
        return this.documentTypes;
    }

    public void setDocumentTypes(List<DocumentTypeCriteria> documentTypes){
        this.documentTypes = documentTypes;
    }
    public DocumentStateCriteria getDocumentState(){
        return this.documentState;
    }

    public void setDocumentState(DocumentStateCriteria documentState){
        this.documentState = documentState;
    }
    public List<DocumentStateCriteria> getDocumentStates(){
        return this.documentStates;
    }

    public void setDocumentStates(List<DocumentStateCriteria> documentStates){
        this.documentStates = documentStates;
    }
    public DocumentCategorieCriteria getDocumentCategorie(){
        return this.documentCategorie;
    }

    public void setDocumentCategorie(DocumentCategorieCriteria documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    public List<DocumentCategorieCriteria> getDocumentCategories(){
        return this.documentCategories;
    }

    public void setDocumentCategories(List<DocumentCategorieCriteria> documentCategories){
        this.documentCategories = documentCategories;
    }
    public UtilisateurCriteria getUtilisateur(){
        return this.utilisateur;
    }

    public void setUtilisateur(UtilisateurCriteria utilisateur){
        this.utilisateur = utilisateur;
    }
    public List<UtilisateurCriteria> getUtilisateurs(){
        return this.utilisateurs;
    }

    public void setUtilisateurs(List<UtilisateurCriteria> utilisateurs){
        this.utilisateurs = utilisateurs;
    }
    public EntiteAdministrativeCriteria getEntiteAdministrative(){
        return this.entiteAdministrative;
    }

    public void setEntiteAdministrative(EntiteAdministrativeCriteria entiteAdministrative){
        this.entiteAdministrative = entiteAdministrative;
    }
    public List<EntiteAdministrativeCriteria> getEntiteAdministratives(){
        return this.entiteAdministratives;
    }

    public void setEntiteAdministratives(List<EntiteAdministrativeCriteria> entiteAdministratives){
        this.entiteAdministratives = entiteAdministratives;
    }

    public PlanClassementCriteria getPlanClassement() {
        return planClassement;
    }

    public void setPlanClassement(PlanClassementCriteria planClassement) {
        this.planClassement = planClassement;
    }

    public List<PlanClassementCriteria> getPlanClassements() {
        return planClassements;
    }

    public void setPlanClassements(List<PlanClassementCriteria> planClassements) {
        this.planClassements = planClassements;
    }

    public DocumentCategorieModelCriteria getDocumentCategorieModel(){
        return this.documentCategorieModel;
    }

    public void setDocumentCategorieModel(DocumentCategorieModelCriteria documentCategorieModel){
        this.documentCategorieModel = documentCategorieModel;
    }
    public List<DocumentCategorieModelCriteria> getDocumentCategorieModels(){
        return this.documentCategorieModels;
    }

    public void setDocumentCategorieModels(List<DocumentCategorieModelCriteria> documentCategorieModels){
        this.documentCategorieModels = documentCategorieModels;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
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
    public List<EchantillonCriteria> getEchantillons() {
        return echantillons;
    }

    public void setEchantillons(List<EchantillonCriteria> echantillons) {
        this.echantillons = echantillons;
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


}
