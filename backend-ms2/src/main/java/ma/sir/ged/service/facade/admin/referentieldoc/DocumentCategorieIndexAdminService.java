package ma.sir.ged.service.facade.admin.referentieldoc;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import ma.sir.ged.dao.criteria.core.DocumentCategorieIndexCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;


public interface DocumentCategorieIndexAdminService extends IService<DocumentCategorieIndex, DocumentCategorieIndexCriteria, DocumentCategorieIndexHistoryCriteria> {

    List<DocumentCategorieIndex> findByIndexElementId(Long id);

    int deleteByIndexElementId(Long id);

    List<DocumentCategorieIndex> findByDocumentCategorieId(Long id);

    int deleteByDocumentCategorieId(Long id);

    List<DocumentCategorieIndex> findByDocumentCategorieIndexRuleId(Long id);

    int deleteByDocumentCategorieIndexRuleId(Long id);

    long countByIndexElementId(Long id);

    long countByDocumentCategorieIndexRuleId(Long id);


}
