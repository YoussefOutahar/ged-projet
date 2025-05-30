package ma.sir.ged.bean.core.parapheur.FicheParapheur;

import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

import javax.persistence.*;

@Data
@Entity
public class ParapheurSignersData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @OneToOne
    private Utilisateur user;
}

