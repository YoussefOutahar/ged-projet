package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.Registre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistreRepository extends JpaRepository<Registre, Long> {
    Registre findByNumero(String numero);
}