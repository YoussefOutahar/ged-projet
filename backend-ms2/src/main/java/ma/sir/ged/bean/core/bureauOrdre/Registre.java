package ma.sir.ged.bean.core.bureauOrdre;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Registre {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Column(name = "numero", nullable = false)
    private String numero;

    @Column(name = "size")
    private int size;
}
