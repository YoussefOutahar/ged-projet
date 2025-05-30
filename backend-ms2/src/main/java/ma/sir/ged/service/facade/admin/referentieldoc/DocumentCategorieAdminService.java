package ma.sir.ged.service.facade.admin.referentieldoc;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.dao.criteria.core.DocumentCategorieCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieHistoryCriteria;
import ma.sir.ged.ws.dto.DocumentCategorieDto;
import ma.sir.ged.zynerator.service.IService;


public interface DocumentCategorieAdminService extends  IService<DocumentCategorie,DocumentCategorieCriteria, DocumentCategorieHistoryCriteria>  {

    DocumentCategorieDto findByLibelle(String libelle);


}
