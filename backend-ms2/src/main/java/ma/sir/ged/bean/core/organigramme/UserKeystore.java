package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_keystore")
public class UserKeystore {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String alias;
    private String referenceId;

    private String password;
    private String passwordHash;

    @Column(name = "create_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createDate;

    @Column(name = "expire_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expireDate;

    @OneToMany(mappedBy = "certificate", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Utilisateur> utilisateurs;

    private  String keystoreFileName;

}
