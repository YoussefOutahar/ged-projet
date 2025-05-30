package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "tag")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="tag_seq",sequenceName="tag_seq",allocationSize=1, initialValue = 1)
public class TagHistory extends HistBusinessObject  {


    public TagHistory() {
    super();
    }

    public TagHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="tag_seq")
    public Long getId() {
    return id;
    }
}

