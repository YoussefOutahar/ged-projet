package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "index_element")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="index_element_seq",sequenceName="index_element_seq",allocationSize=1, initialValue = 1)
public class IndexElementHistory extends HistBusinessObject  {


    public IndexElementHistory() {
    super();
    }

    public IndexElementHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="index_element_seq")
    public Long getId() {
    return id;
    }
}

