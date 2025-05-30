package ma.sir.ged.service.facade.admin.referentieldoc;

import ma.sir.ged.bean.core.referentieldoc.DocumentTag;
import ma.sir.ged.dao.criteria.core.DocumentTagCriteria;
import ma.sir.ged.dao.criteria.history.DocumentTagHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;


public interface DocumentTagAdminService extends IService<DocumentTag, DocumentTagCriteria, DocumentTagHistoryCriteria> {

    List<DocumentTag> findByDocumentId(Long id);

    int deleteByDocumentId(Long id);

    List<DocumentTag> findByTagId(Long id);

    int deleteByTagId(Long id);

    int countByTagId(Long id);


}
