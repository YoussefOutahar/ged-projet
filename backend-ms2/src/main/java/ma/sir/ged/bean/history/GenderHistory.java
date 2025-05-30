package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "gender")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="gender_seq",sequenceName="gender_seq",allocationSize=1, initialValue = 1)
public class GenderHistory extends HistBusinessObject  {


    public GenderHistory() {
    super();
    }

    public GenderHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="gender_seq")
    public Long getId() {
    return id;
    }
}

