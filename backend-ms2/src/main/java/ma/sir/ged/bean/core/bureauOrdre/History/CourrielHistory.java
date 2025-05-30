package ma.sir.ged.bean.core.bureauOrdre.History;

import lombok.Data;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Data
public class CourrielHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String message;

    private HistoryEntryType type;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime dateAction;

    @ManyToOne
    private Utilisateur initiator;

    @ManyToOne
    private CourrielBo courriel;

    @OneToOne
    private IntervenantsCourriel intervenant;
}
