package ma.sir.ged.workflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

import javax.persistence.*;

@Entity
@Data
public class UserDestinataire {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    private Utilisateur utilisateur;
    private int poids;

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.ALL)
    private StepPreset stepPreset;

    private boolean shouldSign;

    @Override
    public String toString() {
        return "UserDestinataire{" +
                "id=" + id +
                ", utilisateur=" + utilisateur +
                ", poids=" + poids +
                '}';
    }
}
