package ma.sir.ged.bean.core.doc;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "model")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class Model extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 500)
    private String libelle;
    @Column(length = 1000)
    private String content;
    @Column(length = 60000)
    private String image;
}
