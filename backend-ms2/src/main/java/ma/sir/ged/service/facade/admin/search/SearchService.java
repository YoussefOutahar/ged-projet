package ma.sir.ged.service.facade.admin.search;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;

import java.util.List;

public interface SearchService {
    List<Document> findPaginatedByKeyWord(String keyword, DocumentCriteria criteria);
    List<Document> findPaginatedByKeyWordIndex(String keyword, DocumentCriteria criteria);
    void createDocumentInElastic(Document t);
    void updateElasticSearch(Document savedDocument);
}
