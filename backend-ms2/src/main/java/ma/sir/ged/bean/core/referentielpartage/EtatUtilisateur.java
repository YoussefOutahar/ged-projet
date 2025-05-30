package ma.sir.ged.bean.core.referentielpartage;

import java.util.Objects;






import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "etat_utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="etat_utilisateur_seq",sequenceName="etat_utilisateur_seq",allocationSize=1, initialValue = 1)
public class EtatUtilisateur   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;
    @Column(length = 500)
    private String description;



    public EtatUtilisateur(){
        super();
    }

    public EtatUtilisateur(Long id,String libelle){
        this.id = id;
        this.libelle = libelle ;
    }

    public EtatUtilisateur(String code){
        this.code = code ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="etat_utilisateur_seq")
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
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
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
        EtatUtilisateur etatUtilisateur = (EtatUtilisateur) o;
        return id != null && id.equals(etatUtilisateur.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

