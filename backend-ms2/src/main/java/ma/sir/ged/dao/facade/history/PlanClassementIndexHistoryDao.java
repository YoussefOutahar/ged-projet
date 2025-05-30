package ma.sir.ged.dao.facade.history;

import ma.sir.ged.bean.history.PlanClassementIndexHistory;
import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanClassementIndexHistoryDao extends AbstractHistoryRepository<PlanClassementIndexHistory,Long> {
}
