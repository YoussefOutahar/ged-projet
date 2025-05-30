package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_state")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_state_seq",sequenceName="document_state_seq",allocationSize=1, initialValue = 1)
public class DocumentStateHistory extends HistBusinessObject  {


    public DocumentStateHistory() {
    super();
    }

    public DocumentStateHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_state_seq")
    public Long getId() {
    return id;
    }
}

