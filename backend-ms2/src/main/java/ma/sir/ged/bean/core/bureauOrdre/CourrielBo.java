package ma.sir.ged.bean.core.bureauOrdre;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import ma.sir.ged.bean.core.bureauOrdre.enums.*;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import org.hibernate.proxy.HibernateProxy;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@EqualsAndHashCode(callSuper = true)
 public class CourrielBo extends AuditBusinessObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String sujet;
    private LocalDateTime dateReception;
    private LocalDateTime dateEcheance;
    private LocalDateTime dateCreation;
    private String numeroRegistre;
    private String numeroCourrier;
    private String numeroCourrielExterne;
    private boolean deleted;

    @Enumerated(EnumType.STRING)
    private VoieEnvoi voieEnvoi;

    @Enumerated(EnumType.STRING)
    private CourrielBoPriorite priorite;

    @Enumerated(EnumType.STRING)
    private CourrielBoEtatAvancement etatAvancement;

    @Enumerated(EnumType.STRING)
    private TypeCourriel type;

    @Enumerated(EnumType.STRING)
    private ConfidentialiteBO confidentialite;

    @ManyToOne
    @JoinColumn(name = "entiteExterneId")
    private EtablissementBo entiteExterne;

    @ManyToOne
    @JoinColumn(name = "entiteInterneId")
    private EntiteAdministrative entiteInterne;

    @JsonManagedReference
    @OneToMany(mappedBy = "courrielBo", cascade = CascadeType.ALL)
    private List<IntervenantsCourriel> intervenants;

    @JsonManagedReference
    @Nullable
    @OneToOne(cascade = CascadeType.ALL)
    private CourrielBo pere;

    @JsonBackReference
    @OneToOne(cascade = CascadeType.ALL)
    private CourrielBo reponse;

    @OneToOne(cascade = CascadeType.ALL)
    private CourrielBo complement;

    @JsonManagedReference(value = "courriel-documents")
    @OneToMany(mappedBy = "courriel", cascade = CascadeType.MERGE)
    private List<Document> documents;

    @JsonBackReference(value = "courriel-planClassement")
    @ManyToOne(fetch = FetchType.LAZY)
    private PlanClassementBO planClassement;

    @ManyToOne
    @JoinColumn(name = "workflow_id")
    private Workflow workflow;

   @Override
   public Long getId() {
      return id;
   }

   @Override
   public void setId(Long id) {
      this.id = id;
   }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        CourrielBo that = (CourrielBo) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
