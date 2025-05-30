package ma.sir.ged.bean.core.bureauOrdre;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "plan_classement_bo")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="plan_classement_bo_seq",sequenceName="plan_classement_bo_seq")
public class PlanClassementBO {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "plan_classement_bo_seq")
    private Long id;

    @Column(unique = true)
    private String code;
    private String libelle;
    private String description;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<PlanClassementBO> children;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference
    private PlanClassementBO parent;

    @JsonManagedReference(value = "courriel-planClassement")
    @OneToMany(mappedBy = "planClassement", fetch = FetchType.LAZY)
    private List<CourrielBo> courriels;

    @Override
    public String toString() {
        return "PlanClassementBO{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", libelle='" + libelle + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
