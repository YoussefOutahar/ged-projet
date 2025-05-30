package ma.sir.ged.dao.facade.core.parapheur;

import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurSignersData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParapheurSignersDataRepository extends JpaRepository<ParapheurSignersData, Long> {
}
