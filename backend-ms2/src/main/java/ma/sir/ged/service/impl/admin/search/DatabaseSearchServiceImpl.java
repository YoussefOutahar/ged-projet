package ma.sir.ged.service.impl.admin.search;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentIndexElementDao;
import ma.sir.ged.service.facade.admin.search.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DatabaseSearchServiceImpl implements SearchService {

    @Autowired
    private DocumentDao documentDao;
    @Autowired
    private DocumentIndexElementDao documentIndexElementDao;
    @Override
    public List<Document> findPaginatedByKeyWord(String keyword, DocumentCriteria criteria) {
        return documentDao.findByContentContaining(keyword);
    }

    @Override
    public List<Document> findPaginatedByKeyWordIndex(String keyword, DocumentCriteria criteria) {
        return documentIndexElementDao.findByIndexValueContaining(keyword);
    }

    @Override
    public void createDocumentInElastic(Document t) {

    }

    @Override
    public void updateElasticSearch(Document savedDocument) {

    }
}
