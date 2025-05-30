package ma.sir.ged.dao.criteria.core;

import ma.sir.ged.bean.core.organigramme.enums.ArchivageType;
import ma.sir.ged.zynerator.criteria.BaseCriteria;

import java.util.List;

public class PlanClassementCriteria extends BaseCriteria {
    private String code;
    private String codeLike;
    private String description;
    private String descriptionLike;
    private String libelle;
    private String libelleLike;
    private Boolean archive;

    private Integer archiveIntermidiaireDuree;
    private Integer archiveFinalDuree;
    private ArchivageType archivageType;


    private PlanClassementCriteria planClassementCriteriaParent ;
    private List<PlanClassementCriteria> planClassementCriteriaParents ;
    private List<PlanClassementModelCriteria> planClassementModelCriteria;

    private List<PlanClassementIndexElementCriteria> planClassementIndexElementCriteria;



    public PlanClassementCriteria() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeLike() {
        return codeLike;
    }

    public void setCodeLike(String codeLike) {
        this.codeLike = codeLike;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionLike() {
        return descriptionLike;
    }

    public void setDescriptionLike(String descriptionLike) {
        this.descriptionLike = descriptionLike;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelleLike() {
        return libelleLike;
    }

    public void setLibelleLike(String libelleLike) {
        this.libelleLike = libelleLike;
    }

    public PlanClassementCriteria getPlanClassementCriteriaParent() {
        return planClassementCriteriaParent;
    }

    public void setPlanClassementCriteriaParent(PlanClassementCriteria planClassementCriteriaParent) {
        this.planClassementCriteriaParent = planClassementCriteriaParent;
    }

    public List<PlanClassementCriteria> getPlanClassementCriteriaParents() {
        return planClassementCriteriaParents;
    }

    public void setPlanClassementCriteriaParents(List<PlanClassementCriteria> planClassementCriteriaParents) {
        this.planClassementCriteriaParents = planClassementCriteriaParents;
    }

    public Boolean getArchive() {
        return archive;
    }

    public void setArchive(Boolean archive) {
        this.archive = archive;
    }

    public List<PlanClassementIndexElementCriteria> getPlanClassementIndexElementCriteria() {
        return planClassementIndexElementCriteria;
    }

    public void setPlanClassementIndexElementCriteria(List<PlanClassementIndexElementCriteria> planClassementIndexElementCriteria) {
        this.planClassementIndexElementCriteria = planClassementIndexElementCriteria;
    }

    public List<PlanClassementModelCriteria> getPlanClassementModelCriteria() {
        return planClassementModelCriteria;
    }

    public void setPlanClassementModelCriteria(List<PlanClassementModelCriteria> planClassementModelCriteria) {
        this.planClassementModelCriteria = planClassementModelCriteria;
    }

    public Integer getArchiveIntermidiaireDuree() {
        return archiveIntermidiaireDuree;
    }

    public void setArchiveIntermidiaireDuree(Integer archiveIntermidiaireDuree) {
        this.archiveIntermidiaireDuree = archiveIntermidiaireDuree;
    }

    public Integer getArchiveFinalDuree() {
        return archiveFinalDuree;
    }

    public void setArchiveFinalDuree(Integer archiveFinalDuree) {
        this.archiveFinalDuree = archiveFinalDuree;
    }

    public ArchivageType getArchivageType() {
        return archivageType;
    }

    public void setArchivageType(ArchivageType archivageType) {
        this.archivageType = archivageType;
    }
}
