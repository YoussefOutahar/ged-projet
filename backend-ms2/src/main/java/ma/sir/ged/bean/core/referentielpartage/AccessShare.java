package ma.sir.ged.bean.core.referentielpartage;

import java.util.Objects;


import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;


@Entity
@Table(name = "access_share")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name = "access_share_seq", sequenceName = "access_share_seq", allocationSize = 1, initialValue = 1)
public class AccessShare extends AuditBusinessObject {

    private Long id;

    @Column(length = 500)
    private String code;
    @Column(length = 500)
    private String libelle;
    @Column(columnDefinition = "TEXT")
    private String description;


    public AccessShare() {
        super();
    }

    public AccessShare(Long id, String libelle) {
        this.id = id;
        this.libelle = libelle;
    }


    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "access_share_seq")
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
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
        AccessShare accessShare = (AccessShare) o;
        return id != null && id.equals(accessShare.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

