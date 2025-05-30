package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.AccessShareHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessShareHistoryDao extends AbstractHistoryRepository<AccessShareHistory,Long> {

}
