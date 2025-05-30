package ma.sir.ged.service.facade.collaborateur;

import java.util.List;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;


public interface EntiteAdministrativeCollaborateurService extends  IService<EntiteAdministrative,EntiteAdministrativeCriteria, EntiteAdministrativeHistoryCriteria>  {

    List<EntiteAdministrative> findByEntiteAdministrativeParentId(Long id);
    int deleteByEntiteAdministrativeParentId(Long id);
    List<EntiteAdministrative> findByChefId(Long id);
    int deleteByChefId(Long id);
    List<EntiteAdministrative> findByEntiteAdministrativeTypeId(Long id);
    int deleteByEntiteAdministrativeTypeId(Long id);



}
