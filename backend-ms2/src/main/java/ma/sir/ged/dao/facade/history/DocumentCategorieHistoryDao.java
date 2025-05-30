package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentCategorieHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentCategorieHistoryDao extends AbstractHistoryRepository<DocumentCategorieHistory,Long> {

}
