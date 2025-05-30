package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement_index_element")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_index_element_seq",sequenceName="plan_classement_index_element_seq")
public class PlanClassementIndexElement extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Getter
    @Column(length = 80000)
    private String value;
    @Getter
    @Column(length = 500)
    private String description;

    @Getter
    @ManyToOne(fetch = FetchType.LAZY)
    private PlanClassementIndex indexElement ;

    @Getter
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private PlanClassement planClassement ;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIndexElement(PlanClassementIndex indexElement) {
        this.indexElement = indexElement;
    }

    public void setPlanClassement(PlanClassement planClassement) {
        this.planClassement = planClassement;
    }
}
