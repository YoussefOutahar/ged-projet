package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentCategorieIndexRuleHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentCategorieIndexRuleHistoryDao extends AbstractHistoryRepository<DocumentCategorieIndexRuleHistory,Long> {

}
