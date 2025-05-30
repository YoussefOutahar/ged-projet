package ma.sir.ged.workflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

import javax.persistence.*;

@Entity
@Data
public class Commentaire {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id")
    private Step step;

    @Column(length = 1000)
    private String message;
}
