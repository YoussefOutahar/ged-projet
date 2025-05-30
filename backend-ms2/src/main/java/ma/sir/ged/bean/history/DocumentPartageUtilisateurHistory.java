package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_partage_utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_partage_utilisateur_seq",sequenceName="document_partage_utilisateur_seq",allocationSize=1, initialValue = 1)
public class DocumentPartageUtilisateurHistory extends HistBusinessObject  {


    public DocumentPartageUtilisateurHistory() {
    super();
    }

    public DocumentPartageUtilisateurHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_partage_utilisateur_seq")
    public Long getId() {
    return id;
    }
}

