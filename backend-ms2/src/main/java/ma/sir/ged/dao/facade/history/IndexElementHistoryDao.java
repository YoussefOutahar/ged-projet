package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.IndexElementHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface IndexElementHistoryDao extends AbstractHistoryRepository<IndexElementHistory,Long> {

}
