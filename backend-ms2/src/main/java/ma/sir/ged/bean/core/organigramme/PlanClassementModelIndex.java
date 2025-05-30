package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement_model_index")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_model_index_seq",sequenceName="plan_classement_model_index_seq")
public class PlanClassementModelIndex extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    private  PlanClassementIndex planClassementIndex ;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private PlanClassementModel planClassementModel ;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public PlanClassementIndex getPlanClassementIndex() {
        return planClassementIndex;
    }

    public void setPlanClassementIndex(PlanClassementIndex planClassementIndex) {
        this.planClassementIndex = planClassementIndex;
    }

    public PlanClassementModel getPlanClassementModel() {
        return planClassementModel;
    }

    public void setPlanClassementModel(PlanClassementModel planClassementModel) {
        this.planClassementModel = planClassementModel;
    }
}
