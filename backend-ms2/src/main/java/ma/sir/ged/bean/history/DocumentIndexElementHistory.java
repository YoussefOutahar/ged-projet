package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_index_element")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_index_element_seq",sequenceName="document_index_element_seq",allocationSize=1, initialValue = 1)
public class DocumentIndexElementHistory extends HistBusinessObject  {


    public DocumentIndexElementHistory() {
    super();
    }

    public DocumentIndexElementHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_index_element_seq")
    public Long getId() {
    return id;
    }
}

