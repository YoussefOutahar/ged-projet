package ma.sir.ged.dao.facade.history;

import ma.sir.ged.bean.history.PlanClassementIndexElementHistory;
import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanClassementIndexElementHistoryDao extends AbstractHistoryRepository<PlanClassementIndexElementHistory,Long>{
}
