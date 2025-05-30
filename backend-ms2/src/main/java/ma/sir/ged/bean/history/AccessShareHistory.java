package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "access_share")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="access_share_seq",sequenceName="access_share_seq",allocationSize=1, initialValue = 1)
public class AccessShareHistory extends HistBusinessObject  {


    public AccessShareHistory() {
    super();
    }

    public AccessShareHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="access_share_seq")
    public Long getId() {
    return id;
    }
}

