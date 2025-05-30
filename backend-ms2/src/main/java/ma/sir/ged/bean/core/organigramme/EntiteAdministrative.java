package ma.sir.ged.bean.core.organigramme;

import java.util.Objects;
import java.util.List;

import com.fasterxml.jackson.annotation.*;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "entite_administrative")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="entite_administrative_seq",sequenceName="entite_administrative_seq",allocationSize=1, initialValue = 1)
public class EntiteAdministrative   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String referenceGed;
    @Column(length = 500)
    private String description;
    @Column(length = 500)
    private String libelle;
    private Integer archiveLawDuration;

    private EntiteAdministrative entiteAdministrativeParent ;

    private Utilisateur chef ;

    private EntiteAdministrativeType entiteAdministrativeType ;


    private List<Utilisateur> utilisateurs ;

    public EntiteAdministrative(){
        super();
    }

    public EntiteAdministrative(Long id,String libelle){
        this.id = id;
        this.libelle = libelle ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="entite_administrative_seq")
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
    @ManyToOne(fetch = FetchType.LAZY)
    public EntiteAdministrative getEntiteAdministrativeParent(){
        return this.entiteAdministrativeParent;
    }
    public void setEntiteAdministrativeParent(EntiteAdministrative entiteAdministrativeParent){
        this.entiteAdministrativeParent = entiteAdministrativeParent;
    }
    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }
    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }

    @JsonBackReference(value = "chef")
    @ManyToOne(fetch = FetchType.LAZY)
    public Utilisateur getChef(){
        return this.chef;
    }
    public void setChef(Utilisateur chef){
        this.chef = chef;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public EntiteAdministrativeType getEntiteAdministrativeType(){
        return this.entiteAdministrativeType;
    }
    public void setEntiteAdministrativeType(EntiteAdministrativeType entiteAdministrativeType){
        this.entiteAdministrativeType = entiteAdministrativeType;
    }

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @OneToMany(mappedBy = "entiteAdministrative")
    public List<Utilisateur> getUtilisateurs(){
        return this.utilisateurs;
    }
    public void setUtilisateurs(List<Utilisateur> utilisateurs){
        this.utilisateurs = utilisateurs;
    }

    public Integer getArchiveLawDuration() {
        return archiveLawDuration;
    }

    public void setArchiveLawDuration(Integer archiveLawDuration) {
        this.archiveLawDuration = archiveLawDuration;
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
        EntiteAdministrative entiteAdministrative = (EntiteAdministrative) o;
        return id != null && id.equals(entiteAdministrative.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

