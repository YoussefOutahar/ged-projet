package ma.sir.ged.WebSocket.Beans;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.DiscriminatorType; // Add this import statement

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payload")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="payload_type", discriminatorType = DiscriminatorType.STRING)
public class Payload {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;    

    private String content;

    private Timestamp creationDate = Timestamp.valueOf(LocalDateTime.now());

    @ManyToOne
    private Utilisateur sender;

    @ManyToMany
    private Set<Utilisateur> receivers;
}
