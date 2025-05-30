package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.UtilisateurHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurHistoryDao extends AbstractHistoryRepository<UtilisateurHistory,Long> {

}
