package ma.sir.ged.zynerator.security.bean;

import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "connexion")
public class Connexion extends AuditBusinessObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String username;
    @Column(name = "token", length = 1000)
    private String token;
    @Column(name = "time_expiration")
    private Long timeExpiration;
    private String status;

    public Connexion() {
        super();
    }
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getTimeExpiration() {
        return timeExpiration;
    }

    public void setTimeExpiration(Long timeExpiration) {
        this.timeExpiration = timeExpiration;
    }
}
