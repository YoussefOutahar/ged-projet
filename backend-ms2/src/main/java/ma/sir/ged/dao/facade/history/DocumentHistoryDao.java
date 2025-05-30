package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentHistoryDao extends AbstractHistoryRepository<DocumentHistory,Long> {

}
