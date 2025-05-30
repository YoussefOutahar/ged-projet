package ma.sir.ged.service.facade.admin.referentielpartage;

import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.dao.criteria.core.GroupeUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.GroupeUtilisateurHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;


public interface GroupeUtilisateurAdminService extends IService<GroupeUtilisateur, GroupeUtilisateurCriteria, GroupeUtilisateurHistoryCriteria> {

    List<GroupeUtilisateur> findByGroupeId(Long id);

    int deleteByGroupeId(Long id);

    List<GroupeUtilisateur> findByUtilisateurId(Long id);

    int deleteByUtilisateurId(Long id);

    List<GroupeUtilisateur> findByEtatUtilisateurId(Long id);

    int deleteByEtatUtilisateurId(Long id);

    List<GroupeUtilisateur> findByRoleUtilisateurId(Long id);

    int deleteByRoleUtilisateurId(Long id);

    long countByEtatUtilisateurId(Long id);

    long countByUtilisateurId(Long id);

    long countByRoleUtilisateurId(Long id);


}
