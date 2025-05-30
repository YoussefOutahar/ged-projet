package ma.sir.ged.bean.core.client;

import lombok.Data;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class Client extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    String nom;
    String prenom;
    String cin;
    String ville;
}
