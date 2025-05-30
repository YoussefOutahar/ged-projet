package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.zynerator.history.HistBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "plan_classement_index_element")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_index_element_seq",sequenceName="plan_classement_index_element_seq")
@Getter
public class PlanClassementIndexElementHistory extends HistBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="plan_classement_index_element_seq")
    private Long id;

    public PlanClassementIndexElementHistory() {
        super();
    }
    public PlanClassementIndexElementHistory (Long id) {
        super(id);
    }

}
