package ma.sir.ged.bean.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.history.HistBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "role_utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="role_utilisateur_seq",sequenceName="role_utilisateur_seq",allocationSize=1, initialValue = 1)
public class RoleUtilisateurHistory extends HistBusinessObject  {


    public RoleUtilisateurHistory() {
    super();
    }

    public RoleUtilisateurHistory (Long id) {
    super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="role_utilisateur_seq")
    public Long getId() {
    return id;
    }
}

