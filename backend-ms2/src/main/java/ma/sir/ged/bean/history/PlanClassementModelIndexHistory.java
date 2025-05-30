package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.zynerator.history.HistBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement_model_index")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_model_index_seq",sequenceName="plan_classement_model_index_seq")
@Getter
public class PlanClassementModelIndexHistory  extends HistBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="plan_classement_model_index_seq")
    private Long id;

    public PlanClassementModelIndexHistory() {
        super();
    }
    public PlanClassementModelIndexHistory (Long id) {
        super(id);
    }
}
