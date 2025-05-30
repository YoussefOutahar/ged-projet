package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="utilisateur_seq",sequenceName="utilisateur_seq",allocationSize=1, initialValue = 1)
public class UtilisateurHistory extends HistBusinessObject  {


    public UtilisateurHistory() {
    super();
    }

    public UtilisateurHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="utilisateur_seq")
    public Long getId() {
    return id;
    }
}

