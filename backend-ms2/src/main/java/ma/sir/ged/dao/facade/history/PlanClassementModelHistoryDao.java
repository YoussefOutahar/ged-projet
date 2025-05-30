package ma.sir.ged.dao.facade.history;

import ma.sir.ged.bean.history.PlanClassementModelHistory;
import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanClassementModelHistoryDao extends AbstractHistoryRepository<PlanClassementModelHistory,Long> {
}
