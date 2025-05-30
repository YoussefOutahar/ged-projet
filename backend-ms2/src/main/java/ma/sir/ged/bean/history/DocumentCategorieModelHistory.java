package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_categorie_model")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_categorie_model_seq",sequenceName="document_categorie_model_seq",allocationSize=1, initialValue = 1)
public class DocumentCategorieModelHistory extends HistBusinessObject  {


    public DocumentCategorieModelHistory() {
    super();
    }

    public DocumentCategorieModelHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_categorie_model_seq")
    public Long getId() {
    return id;
    }
}

