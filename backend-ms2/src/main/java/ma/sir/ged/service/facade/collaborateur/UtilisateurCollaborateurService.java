package ma.sir.ged.service.facade.collaborateur;

import java.util.List;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.service.IService;


public interface UtilisateurCollaborateurService extends  IService<Utilisateur,UtilisateurCriteria, UtilisateurHistoryCriteria>  {
    Utilisateur findByUsername(String username);
    boolean changePassword(String username, String newPassword);

    List<Utilisateur> findByGenderId(Long id);
    int deleteByGenderId(Long id);
    List<Utilisateur> findByEntiteAdministrativeId(Long id);
    int deleteByEntiteAdministrativeId(Long id);
    Boolean isAdmin(User user);


}
