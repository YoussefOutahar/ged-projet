package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_seq",sequenceName="document_seq",allocationSize=1, initialValue = 1)
public class DocumentHistory extends HistBusinessObject  {


    public DocumentHistory() {
    super();
    }

    public DocumentHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_seq")
    public Long getId() {
    return id;
    }
}

