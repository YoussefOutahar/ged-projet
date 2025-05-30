package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentPartageUtilisateurHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentPartageUtilisateurHistoryDao extends AbstractHistoryRepository<DocumentPartageUtilisateurHistory,Long> {

}
