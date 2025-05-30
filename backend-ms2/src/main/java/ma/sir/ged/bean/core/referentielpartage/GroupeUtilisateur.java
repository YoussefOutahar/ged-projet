package ma.sir.ged.bean.core.referentielpartage;

import java.util.Objects;

import java.time.LocalDateTime;


import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "groupe_utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="groupe_utilisateur_seq",sequenceName="groupe_utilisateur_seq",allocationSize=1, initialValue = 1)
public class GroupeUtilisateur   extends AuditBusinessObject     {

    private Long id;

    private LocalDateTime dateAjout ;

    private Groupe groupe ;
    
    private Utilisateur utilisateur ;
    
    private EtatUtilisateur etatUtilisateur ;
    
    private RoleUtilisateur roleUtilisateur ;
    


    public GroupeUtilisateur(){
        super();
    }





    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="groupe_utilisateur_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Groupe getGroupe(){
        return this.groupe;
    }
    public void setGroupe(Groupe groupe){
        this.groupe = groupe;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Utilisateur getUtilisateur(){
        return this.utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur){
        this.utilisateur = utilisateur;
    }
    public LocalDateTime getDateAjout(){
        return this.dateAjout;
    }
    public void setDateAjout(LocalDateTime dateAjout){
        this.dateAjout = dateAjout;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public EtatUtilisateur getEtatUtilisateur(){
        return this.etatUtilisateur;
    }
    public void setEtatUtilisateur(EtatUtilisateur etatUtilisateur){
        this.etatUtilisateur = etatUtilisateur;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public RoleUtilisateur getRoleUtilisateur(){
        return this.roleUtilisateur;
    }
    public void setRoleUtilisateur(RoleUtilisateur roleUtilisateur){
        this.roleUtilisateur = roleUtilisateur;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupeUtilisateur groupeUtilisateur = (GroupeUtilisateur) o;
        return id != null && id.equals(groupeUtilisateur.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

