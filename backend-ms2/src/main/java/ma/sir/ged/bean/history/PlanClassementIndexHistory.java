package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ma.sir.ged.zynerator.history.HistBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement_index")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_index_seq",sequenceName="plan_classement_index_seq")
@Getter
public class PlanClassementIndexHistory extends HistBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="plan_classement_index_seq")
    private Long id;

    public PlanClassementIndexHistory() {
        super();
    }
    public PlanClassementIndexHistory (Long id) {
        super(id);
    }
}
