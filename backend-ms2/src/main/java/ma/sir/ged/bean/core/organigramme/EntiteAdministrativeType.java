package ma.sir.ged.bean.core.organigramme;

import java.util.Objects;






import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "entite_administrative_type")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="entite_administrative_type_seq",sequenceName="entite_administrative_type_seq",allocationSize=1, initialValue = 1)
public class EntiteAdministrativeType   extends AuditBusinessObject     {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;
    @Column(length = 500)
    private String description;

    private Integer rang;

    public Integer getRang() {
        return rang;
    }

    public void setRang(Integer rang) {
        this.rang = rang;
    }

    public EntiteAdministrativeType(){
        super();
    }

    public EntiteAdministrativeType(Long id,String libelle){
        this.id = id;
        this.libelle = libelle ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="entite_administrative_type_seq")
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
        EntiteAdministrativeType entiteAdministrativeType = (EntiteAdministrativeType) o;
        return id != null && id.equals(entiteAdministrativeType.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

