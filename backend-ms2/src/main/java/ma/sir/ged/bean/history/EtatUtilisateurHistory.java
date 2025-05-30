package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "etat_utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="etat_utilisateur_seq",sequenceName="etat_utilisateur_seq",allocationSize=1, initialValue = 1)
public class EtatUtilisateurHistory extends HistBusinessObject  {


    public EtatUtilisateurHistory() {
    super();
    }

    public EtatUtilisateurHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="etat_utilisateur_seq")
    public Long getId() {
    return id;
    }
}

