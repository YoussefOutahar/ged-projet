package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentStateHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentStateHistoryDao extends AbstractHistoryRepository<DocumentStateHistory,Long> {

}
