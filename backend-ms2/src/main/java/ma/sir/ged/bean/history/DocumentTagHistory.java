package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_tag")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_tag_seq",sequenceName="document_tag_seq",allocationSize=1, initialValue = 1)
public class DocumentTagHistory extends HistBusinessObject  {


    public DocumentTagHistory() {
    super();
    }

    public DocumentTagHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_tag_seq")
    public Long getId() {
    return id;
    }
}

