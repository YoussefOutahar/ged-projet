package ma.sir.ged.service.facade.admin.referentieldoc;

import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.dao.criteria.core.DocumentStateCriteria;
import ma.sir.ged.dao.criteria.history.DocumentStateHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;


public interface DocumentStateAdminService extends  IService<DocumentState,DocumentStateCriteria, DocumentStateHistoryCriteria>  {


    DocumentState findByLibelle(String libelle);


}
