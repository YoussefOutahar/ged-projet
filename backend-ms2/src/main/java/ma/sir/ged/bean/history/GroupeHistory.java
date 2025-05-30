package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "groupe")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="groupe_seq",sequenceName="groupe_seq",allocationSize=1, initialValue = 1)
public class GroupeHistory extends HistBusinessObject  {


    public GroupeHistory() {
    super();
    }

    public GroupeHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="groupe_seq")
    public Long getId() {
    return id;
    }
}

