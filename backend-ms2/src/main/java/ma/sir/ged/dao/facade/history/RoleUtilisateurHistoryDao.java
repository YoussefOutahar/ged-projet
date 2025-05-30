package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.RoleUtilisateurHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleUtilisateurHistoryDao extends AbstractHistoryRepository<RoleUtilisateurHistory,Long> {

}
