package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_seq",sequenceName="plan_classement_seq",allocationSize=1, initialValue = 1)

public class PlanClassementHistory extends HistBusinessObject {

    public PlanClassementHistory() {
        super();
    }

    public PlanClassementHistory (Long id) {
        super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="plan_classement_seq")
    public Long getId() {
        return id;
    }

}
