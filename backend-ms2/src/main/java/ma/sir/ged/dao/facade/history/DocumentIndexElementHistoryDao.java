package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentIndexElementHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentIndexElementHistoryDao extends AbstractHistoryRepository<DocumentIndexElementHistory,Long> {

}
