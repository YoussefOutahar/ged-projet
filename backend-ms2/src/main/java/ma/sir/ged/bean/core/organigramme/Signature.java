package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Signature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String signature;

    @JsonBackReference
    @OneToOne(mappedBy = "signature")
    private Utilisateur utilisateur;

    private Date date = new Date();
}
