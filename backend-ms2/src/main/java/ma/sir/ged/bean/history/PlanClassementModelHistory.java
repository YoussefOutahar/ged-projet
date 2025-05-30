package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ma.sir.ged.zynerator.history.HistBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement_model")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_model_seq",sequenceName="plan_classement_model_seq")
@Getter
public class PlanClassementModelHistory extends HistBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="plan_classement_model_seq")
    private Long id;

    public PlanClassementModelHistory() {
        super();
    }
    public PlanClassementModelHistory (Long id) {
        super(id);
    }
}
