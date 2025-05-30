package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.EntiteAdministrativeHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteAdministrativeHistoryDao extends AbstractHistoryRepository<EntiteAdministrativeHistory,Long> {

}
