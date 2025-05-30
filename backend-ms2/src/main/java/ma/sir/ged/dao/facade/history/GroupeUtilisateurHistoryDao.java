package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.GroupeUtilisateurHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeUtilisateurHistoryDao extends AbstractHistoryRepository<GroupeUtilisateurHistory,Long> {

}
