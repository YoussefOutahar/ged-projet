package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.EtablissementBo;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface  EtablissementRepository extends AbstractRepository<EtablissementBo, Long> {

    List<EtablissementBo> findAllByDeleted(boolean deleted);

    EtablissementBo findByNom(String nom);
    EtablissementBo findByNomAndDeleted(String nom , boolean deleted);

    EtablissementBo findEtablissementBoByDeletedAndNom(boolean deleted, String nom);
}
