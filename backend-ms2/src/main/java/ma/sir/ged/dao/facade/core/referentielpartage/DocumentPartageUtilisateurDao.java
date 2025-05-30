package ma.sir.ged.dao.facade.core.referentielpartage;

import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DocumentPartageUtilisateurDao extends AbstractRepository<DocumentPartageUtilisateur,Long>  {

    List<DocumentPartageUtilisateur> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);
    List<DocumentPartageUtilisateur> findByUtilisateurId(Long id);
    int deleteByUtilisateurId(Long id);
    List<DocumentPartageUtilisateur> findByAccessShareId(Long id);
    int deleteByAccessShareId(Long id);
    long countByAccessShareId(Long id);
    long countByUtilisateurId(Long id);


}
