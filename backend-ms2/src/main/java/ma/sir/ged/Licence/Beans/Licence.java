package ma.sir.ged.Licence.Beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Licence extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;

    protected String licenceKey;

    @Override
    public String toString() {
        return "Licence{" +
                "id=" + id +
                ", licenceKey='" + licenceKey + '\'' +
                '}';
    }
}

