package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import ma.sir.ged.bean.core.organigramme.enums.ArchivageType;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "plan_classement")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_seq",sequenceName="plan_classement_seq")
public class PlanClassement extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "plan_classement_seq")
    private Long id;

    @Column(unique = true)
    private String code;
    private String libelle;
    private String description;
    private Boolean archive;

    private Integer archiveIntermidiaireDuree;

    private Integer archiveFinalDuree;

    private ArchivageType archivageType;




    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<PlanClassement> children;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference
    private PlanClassement parent;

    @ManyToOne(fetch = FetchType.LAZY)
    private PlanClassementModel planClassementModel;

    @OneToMany(mappedBy = "planClassement")
    @JsonManagedReference
    private List<PlanClassementIndexElement> planClassementIndexElements;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<PlanClassement> getChildren() {
        return children;
    }

    public void setChildren(List<PlanClassement> children) {
        this.children = children;
    }

    public PlanClassement getParent() {
        return parent;
    }

    public void setParent(PlanClassement parent) {
        this.parent = parent;
    }

    public Boolean getArchive() {
        return archive;
    }

    public void setArchive(Boolean archive) {
        this.archive = archive;
    }

    public PlanClassementModel getPlanClassementModel() {
        return planClassementModel;
    }

    public void setPlanClassementModel(PlanClassementModel planClassementModel) {
        this.planClassementModel = planClassementModel;
    }

    public List<PlanClassementIndexElement> getPlanClassementIndexElements() {
        return planClassementIndexElements;
    }

    public void setPlanClassementIndexElements(List<PlanClassementIndexElement> planClassementIndexElements) {
        this.planClassementIndexElements = planClassementIndexElements;
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
