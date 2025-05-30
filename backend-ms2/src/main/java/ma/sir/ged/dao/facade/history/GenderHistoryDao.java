package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.GenderHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface GenderHistoryDao extends AbstractHistoryRepository<GenderHistory,Long> {

}
