package ma.sir.ged.bean.core.doc;

import java.util.ArrayList;
import java.util.Objects;
import java.util.List;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.*;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentieldoc.*;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.dao.facade.core.doc.listener.DocumentListener;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


import java.math.BigDecimal;


@Entity
@Table(name = "document")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_seq",sequenceName="document_seq",allocationSize=1, initialValue = 1)
@EntityListeners(DocumentListener.class)
public class Document extends AuditBusinessObject     {

    private Long id;
    private String elasticId;
    @Column(length = 500)
    private String reference;
    @Lob
    @Column(columnDefinition="TEXT")
    private String referenceGed;
    private LocalDateTime uploadDate ;
    private Long annee ;
    private Long ligne ;
    private Long colonne ;
    private Long numBoite ;
    private Long semstre ;
    private Long mois ;
    private Long jour ;
    @Column(columnDefinition = "boolean default false")
    private Boolean ocr = false;
    private Boolean isSigned = false;
    private Boolean paraphed = false;

    @Column(length = 500)
    private String content;
    private BigDecimal size = BigDecimal.ZERO;
    @Column(length = 500)
    private String description;
    @Column(columnDefinition = "boolean default false")
    private Boolean archive = false;
    @Column(columnDefinition = "boolean default false")
    private Boolean versionne = false;
    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;
    @Column(columnDefinition = "boolean default false")
    private Boolean locked = false;
    @Column(columnDefinition = "boolean default false")

    private Boolean qualityFlag = false;
    @Column(columnDefinition = "boolean default false")
    private Boolean qualityStatus = false;

    private CourrielBo courriel;

    private DocumentType documentType ;
    
    private DocumentState documentState ;
    
    private DocumentCategorie documentCategorie ;
    
    private Utilisateur utilisateur ;
    
    private EntiteAdministrative entiteAdministrative ;

    private PlanClassement planClassement ;
    
    private DocumentCategorieModel documentCategorieModel ;
    

    private List<DocumentIndexElement> documentIndexElements ;
    private List<DocumentPartageGroupe> documentPartageGroupes ;
    private List<DocumentPartageUtilisateur> documentPartageUtilisateurs ;
    private List<DocumentTag> documentTags ;
    private List<Echantillon> echantillons = new ArrayList<>();
    private List<Workflow> workflows;
    private List<DocumentCommentaire> commentaires = new ArrayList<>();

    @Column(columnDefinition = "boolean default false")
    private Boolean archivable = false;


    private LocalDateTime dateArchivageIntermediaire ;

    private LocalDateTime dateArchivageFinale;

    private String documentSignatureCode;




    public Document(){
        super();
    }

    public Document(Long id,String reference){
        this.id = id;
        this.reference = reference ;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public String getReference(){
        return this.reference;
    }
    public void setReference(String reference){
        this.reference = reference;
    }
    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }
    public LocalDateTime getUploadDate(){
        return this.uploadDate;
    }
    public void setUploadDate(LocalDateTime uploadDate){
        this.uploadDate = uploadDate;
    }
    public Long getAnnee(){
        return this.annee;
    }
    public void setAnnee(Long annee){
        this.annee = annee;
    }
    public Long getSemstre(){
        return this.semstre;
    }
    public void setSemstre(Long semstre){
        this.semstre = semstre;
    }
    public Long getMois(){
        return this.mois;
    }
    public void setMois(Long mois){
        this.mois = mois;
    }
    public Long getJour(){
        return this.jour;
    }
    public void setJour(Long jour){
        this.jour = jour;
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
        return this.numBoite;
    }
    public void setNumBoite(Long numBoite) {
        this.numBoite = numBoite;
    }
    public Boolean  getOcr(){
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
    public BigDecimal getSize(){
        return this.size;
    }
    public void setSize(BigDecimal size){
        this.size = size;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentType getDocumentType(){
        return this.documentType;
    }
    public void setDocumentType(DocumentType documentType){
        this.documentType = documentType;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentState getDocumentState(){
        return this.documentState;
    }
    public void setDocumentState(DocumentState documentState){
        this.documentState = documentState;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentCategorie getDocumentCategorie(){
        return this.documentCategorie;
    }
    public void setDocumentCategorie(DocumentCategorie documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    @OneToMany(mappedBy = "document")
    public List<DocumentIndexElement> getDocumentIndexElements(){
        return this.documentIndexElements;
    }
    public void setDocumentIndexElements(List<DocumentIndexElement> documentIndexElements){
        this.documentIndexElements = documentIndexElements;
    }
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Utilisateur getUtilisateur(){
        return this.utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur){
        this.utilisateur = utilisateur;
    }
    public Boolean  getArchive(){
        return this.archive;
    }
    public void setArchive(Boolean archive){
        this.archive = archive;
    }
    public Boolean  getVersionne(){
        return this.versionne;
    }
    public void setVersionne(Boolean versionne){
        this.versionne = versionne;
    }
    @ManyToOne(fetch = FetchType.EAGER)
    public EntiteAdministrative getEntiteAdministrative(){
        return this.entiteAdministrative;
    }
    public void setEntiteAdministrative(EntiteAdministrative entiteAdministrative){
        this.entiteAdministrative = entiteAdministrative;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public PlanClassement getPlanClassement() {
        return this.planClassement;
    }

    public void setPlanClassement(PlanClassement planClassement) {
        this.planClassement = planClassement;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public DocumentCategorieModel getDocumentCategorieModel(){
        return this.documentCategorieModel;
    }
    public void setDocumentCategorieModel(DocumentCategorieModel documentCategorieModel){
        this.documentCategorieModel = documentCategorieModel;
    }
    @OneToMany(mappedBy = "document")
    public List<DocumentPartageGroupe> getDocumentPartageGroupes(){
        return this.documentPartageGroupes;
    }
    public void setDocumentPartageGroupes(List<DocumentPartageGroupe> documentPartageGroupes){
        this.documentPartageGroupes = documentPartageGroupes;
    }
    @OneToMany(mappedBy = "document")
    public List<DocumentPartageUtilisateur> getDocumentPartageUtilisateurs(){
        return this.documentPartageUtilisateurs;
    }
    public void setDocumentPartageUtilisateurs(List<DocumentPartageUtilisateur> documentPartageUtilisateurs){
        this.documentPartageUtilisateurs = documentPartageUtilisateurs;
    }
    @OneToMany(mappedBy = "document")
    public List<DocumentTag> getDocumentTags(){
        return this.documentTags;
    }
    public void setDocumentTags(List<DocumentTag> documentTags){
        this.documentTags = documentTags;
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
    public Boolean getLocked() {
        return locked;
    }
    public void setLocked(Boolean locked) {
        this.locked = locked;
    }
    @ManyToMany(mappedBy = "documents")
    @JsonIgnore
    public List<Echantillon> getEchantillons() {
        return echantillons;
    }
    public void setEchantillons(List<Echantillon> echantillons) {
        this.echantillons = echantillons;
    }
    @ManyToMany(mappedBy = "documents", fetch = FetchType.LAZY)
    @JsonIgnore
    public List<Workflow> getWorkflows() {
        return workflows;
    }
    public void setWorkflows(List<Workflow> workflows) {
        this.workflows = workflows;
    }
    @OneToMany(mappedBy = "document")
    @JsonManagedReference
    public List<DocumentCommentaire> getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(List<DocumentCommentaire> commentaires) {
        this.commentaires = commentaires;
    }

    @Transient
    public String getLabel() {
        label = reference;
        return label;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Document document = (Document) o;
        return id != null && id.equals(document.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public String getElasticId() {
        return elasticId;
    }

    public void setElasticId(String elasticId) {
        this.elasticId = elasticId;
    }


    @JsonBackReference(value = "courriel-documents")
    @ManyToOne(fetch = FetchType.LAZY)
    public CourrielBo getCourriel() {
        return courriel;
    }

    public void setCourriel(CourrielBo courriel) {
        this.courriel = courriel;
    }


    public Boolean getSigned() {
        return isSigned;
    }

    public void setSigned(Boolean signed) {
        isSigned = signed;
    }

    public Boolean getArchivable() {
        return archivable;
    }

    public void setArchivable(Boolean archivable) {
        this.archivable = archivable;
    }

    public LocalDateTime getDateArchivageIntermediaire() {
        return dateArchivageIntermediaire;
    }

    public void setDateArchivageIntermediaire(LocalDateTime dateArchivageIntermediaire) {
        this.dateArchivageIntermediaire = dateArchivageIntermediaire;
    }

    public LocalDateTime getDateArchivageFinale() {
        return dateArchivageFinale;
    }

    public void setDateArchivageFinale(LocalDateTime dateArchivageFinale) {
        this.dateArchivageFinale = dateArchivageFinale;
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

