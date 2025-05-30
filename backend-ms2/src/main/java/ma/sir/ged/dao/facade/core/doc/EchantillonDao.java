package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.Echantillon;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EchantillonDao extends AbstractRepository<Echantillon, Long> {
    List<Echantillon> findAll();
}
