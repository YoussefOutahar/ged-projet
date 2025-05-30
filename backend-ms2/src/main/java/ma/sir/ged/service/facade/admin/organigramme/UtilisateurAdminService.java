package ma.sir.ged.service.facade.admin.organigramme;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.service.IService;
import org.springframework.web.multipart.MultipartFile;


public interface UtilisateurAdminService extends  IService<Utilisateur,UtilisateurCriteria, UtilisateurHistoryCriteria>  {
    Utilisateur findByUsername(String username);
    boolean changePassword(String username, String newPassword);

    List<Utilisateur> findByGenderId(Long id);
    long countByGenderId(Long id);
    int deleteByGenderId(Long id);
    List<Utilisateur> findByEntiteAdministrativeId(Long id);
    int deleteByEntiteAdministrativeId(Long id);
    int countByEntiteAdministrativeId(Long id);
    Boolean isAdmin(User user);
    Boolean isAgent(User user);
    void updateProfilePicture(Long userId, MultipartFile file) throws IOException, SQLException;
    void deleteProfilePicture(Long userId);
    void updateSignature(Long userId, String svgData);
    void deleteSignature(Long userId);

    int countNumberOfUsers();
}
