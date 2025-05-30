package ma.sir.ged.FeatureFlip;

import lombok.Data;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


@Entity
@Data
public class FeatureFlag extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    private String name;

    private boolean value;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isValue() {
        return value;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setValue(boolean value) {
        this.value = value;
    }
}

