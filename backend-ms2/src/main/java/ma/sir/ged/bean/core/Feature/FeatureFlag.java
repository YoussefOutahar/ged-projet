package ma.sir.ged.bean.core.Feature;

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
}
