package ma.sir.ged.bean.core.bureauOrdre;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import ma.sir.ged.bean.core.bureauOrdre.enums.ActionCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.StatutIntervention;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class IntervenantsCourriel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private boolean isDone;
    private String commentaire;
    private LocalDateTime dateCreation;
    private LocalDateTime dateIntervention;

    @Enumerated(EnumType.STRING)
    private StatutIntervention statut;

    @JsonBackReference(value = "action")
    @ManyToOne
    private ActionsBo action;

    @JsonBackReference
    @ManyToOne
    private CourrielBo courrielBo;

    @ManyToMany
    private List<Utilisateur> responsables;

    @ManyToOne
    private Utilisateur intervenant;

    @ManyToMany(fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

    private long createdBy;
}
