package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentPartageGroupeHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentPartageGroupeHistoryDao extends AbstractHistoryRepository<DocumentPartageGroupeHistory,Long> {

}
