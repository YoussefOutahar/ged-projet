package ma.sir.ged.dao.facade.history;

import ma.sir.ged.bean.history.PlanClassementModelIndexHistory;
import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanClassementModelIndexHistoryDao extends AbstractHistoryRepository<PlanClassementModelIndexHistory,Long> {
}
