package ma.sir.ged.bean.core.referentielpartage;

import java.util.Objects;
import java.util.List;






import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "groupe")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="groupe_seq",sequenceName="groupe_seq",allocationSize=1, initialValue = 1)
public class Groupe   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;

    private Utilisateur utilisateur ;
    

    private List<GroupeUtilisateur> groupeUtilisateurs ;

    public Groupe(){
        super();
    }

    public Groupe(Long id,String libelle){
        this.id = id;
        this.libelle = libelle ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="groupe_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
    }
    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Utilisateur getUtilisateur(){
        return this.utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur){
        this.utilisateur = utilisateur;
    }
    @OneToMany(mappedBy = "groupe")
    public List<GroupeUtilisateur> getGroupeUtilisateurs(){
        return this.groupeUtilisateurs;
    }
    public void setGroupeUtilisateurs(List<GroupeUtilisateur> groupeUtilisateurs){
        this.groupeUtilisateurs = groupeUtilisateurs;
    }

    @Transient
    public String getLabel() {
        label = libelle;
        return label;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Groupe groupe = (Groupe) o;
        return id != null && id.equals(groupe.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

