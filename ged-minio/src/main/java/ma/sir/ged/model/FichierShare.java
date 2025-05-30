package ma.sir.ged.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;

@Entity(name = "fichier_share")
public class FichierShare {
    @Id
    @Column(length = 100)
    private String id;
    @ManyToOne
    @JoinColumn(name = "fichier_id", nullable = false)
    private Fichier fichier;
    private Long duration;
    private Date expiration;

    public String getId(){
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Fichier getFichier() {
        return fichier;
    }

    public void setFichier(Fichier fichier) {
        this.fichier = fichier;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public Date getExpiration() {
        return expiration;
    }

    public void setExpiration(Date expiration) {
        this.expiration = expiration;
    }
}
