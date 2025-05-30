package ma.sir.ged.dao.facade.history;

import ma.sir.ged.zynerator.repository.AbstractHistoryRepository;
import ma.sir.ged.bean.history.DocumentTypeHistory;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentTypeHistoryDao extends AbstractHistoryRepository<DocumentTypeHistory,Long> {

}
