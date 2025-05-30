package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.EtatUtilisateurHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface EtatUtilisateurHistoryDao extends AbstractHistoryRepository<EtatUtilisateurHistory,Long> {

}
