package ma.sir.ged.bean.core.bureauOrdre;

import lombok.Getter;
import lombok.Setter;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;


@Entity
@Getter
@Setter
public class ActionsBo extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 500)
    private String libelle;

//    @OneToMany(mappedBy = "action")
//    private List<IntervenantsCourriel> intervenantsCourriel;

}
