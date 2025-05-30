package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.GroupeHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeHistoryDao extends AbstractHistoryRepository<GroupeHistory,Long> {

}
