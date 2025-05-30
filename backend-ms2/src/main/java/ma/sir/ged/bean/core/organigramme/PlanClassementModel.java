package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import ma.sir.ged.ws.dto.PlanClassementModelDto;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "plan_classement_model")
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
@SequenceGenerator(name="plan_classement_model_seq",sequenceName="plan_classement_model_seq")
public class PlanClassementModel extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;
    @Column(length = 500)
    private String description;
    @JsonManagedReference
    @OneToMany(mappedBy = "planClassementModel")
    private List<PlanClassementModelIndex> planClassementIndexs ;

    @Override
    public Long getId() {
        return id;
    }

    @Override
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

    public List<PlanClassementModelIndex> getPlanClassementIndexs() {
        return planClassementIndexs;
    }

    public void setPlanClassementIndexs(List<PlanClassementModelIndex> planClassementIndexs) {
        this.planClassementIndexs = planClassementIndexs;
    }
}
