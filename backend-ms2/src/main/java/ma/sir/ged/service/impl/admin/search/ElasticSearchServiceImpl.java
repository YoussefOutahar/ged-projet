package ma.sir.ged.service.impl.admin.search;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.service.facade.admin.search.SearchService;
import ma.sir.ged.service.impl.admin.doc.DocumentAdminServiceImpl;
import ma.sir.ged.service.impl.admin.doc.IndexationService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.zynerator.util.ElasticSearchUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@Primary
public class ElasticSearchServiceImpl implements SearchService {
    @Autowired
    private IndexationService indexationService;
    @Autowired
    private DocumentAdminServiceImpl documentAdminService;
    @Autowired
    private DocumentConverter documentConverter;
    @Override
    @Primary
    public List<Document> findPaginatedByKeyWord(String keyword, DocumentCriteria criteria) {
        List<Long> documentIds = indexationService.findDocumentIdsByKeyWord(keyword);
        Page<Document> documentsPage = documentAdminService.findAllByIds(documentIds, criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField(),criteria.getDeleted());
        return documentsPage.getContent();
    }

    @Override
    public List<Document> findPaginatedByKeyWordIndex(String keyword, DocumentCriteria criteria) {
        List<Long> documentIds = indexationService.findDocumentIdsByKeyWordIndex(keyword);
        Page<Document> documentsPage = documentAdminService.findAllByIds(documentIds, criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField(),criteria.getDeleted());
        return documentsPage.getContent();
                //.stream().filter(this::userCanSee).collect(Collectors.toList());
    }

    @Override
    public void createDocumentInElastic(Document t) {
        try {
            if(Objects.nonNull(t)){
                System.out.println("Contacting ElasticSearch MS");
                t.setElasticId(indexationService.createIndexAndGetElasticId(documentConverter.toDto(t)));
                documentAdminService.update(t);
                System.out.println("elastic search id : "+t.getElasticId());
            }
        } catch (HttpClientErrorException exception) {
            System.out.println("Exception has been throw while calling elastic Search"+ Arrays.toString(exception.getStackTrace()));
        }
    }

    @Override
    public void updateElasticSearch(Document savedDocument) {
        try {
            savedDocument = ElasticSearchUtils.updateElasticSearch(savedDocument, indexationService, documentConverter);
            documentAdminService.update(savedDocument);
        } catch (Exception e) {

            throw new RuntimeException("Failed to update Elasticsearch! ", e);
        }
    }

}
