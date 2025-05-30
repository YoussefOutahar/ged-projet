package ma.sir.ged.dao.facade.core.referentieldoc;

import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DocumentCategorieIndexDao extends AbstractRepository<DocumentCategorieIndex,Long>  {

    List<DocumentCategorieIndex> findByIndexElementId(Long id);
    int deleteByIndexElementId(Long id);
    List<DocumentCategorieIndex> findByDocumentCategorieId(Long id);
    int deleteByDocumentCategorieId(Long id);
    List<DocumentCategorieIndex> findByDocumentCategorieIndexRuleId(Long id);
    int deleteByDocumentCategorieIndexRuleId(Long id);
    long countByIndexElementId(Long id);
    long countByDocumentCategorieIndexRuleId(Long id);

}
