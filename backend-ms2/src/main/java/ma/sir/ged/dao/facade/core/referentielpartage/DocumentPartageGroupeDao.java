package ma.sir.ged.dao.facade.core.referentielpartage;

import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DocumentPartageGroupeDao extends AbstractRepository<DocumentPartageGroupe,Long>  {

    List<DocumentPartageGroupe> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);
    List<DocumentPartageGroupe> findByGroupeId(Long id);
    int deleteByGroupeId(Long id);
    List<DocumentPartageGroupe> findByAccessShareId(Long id);
    int deleteByAccessShareId(Long id);
    long countByAccessShareId(Long id);
    long countByGroupeId(Long id);


}
