package ma.sir.ged.bean.core.doc;

import lombok.Data;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Data
@Table(name = "destruction")
public class Destruction extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Column(length = 500)
    private String reference;

    private String planDeClassement;

    private String responsable;

    @Lob
    @Column(columnDefinition="TEXT")
    private String referenceGed;

}
