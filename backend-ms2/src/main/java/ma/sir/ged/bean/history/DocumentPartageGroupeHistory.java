package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_partage_groupe")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_partage_groupe_seq",sequenceName="document_partage_groupe_seq",allocationSize=1, initialValue = 1)
public class DocumentPartageGroupeHistory extends HistBusinessObject  {


    public DocumentPartageGroupeHistory() {
    super();
    }

    public DocumentPartageGroupeHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_partage_groupe_seq")
    public Long getId() {
    return id;
    }
}

