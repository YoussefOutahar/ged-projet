package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.ActionsBo;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActionsRepository extends AbstractRepository<ActionsBo, Long> {
    
    ActionsBo findByLibelle(String libelle);

    @Query(value = "SELECT * FROM actions_bo WHERE LOWER(REGEXP_REPLACE(libelle, '[^a-zA-Z0-9]', '')) = LOWER(REGEXP_REPLACE(:libelle, '[^a-zA-Z0-9]', ''))", nativeQuery = true)
    Optional<ActionsBo> findByLibelleIgnoreCaseAndRemoveSpecialChars(@Param("libelle") String libelle);
}