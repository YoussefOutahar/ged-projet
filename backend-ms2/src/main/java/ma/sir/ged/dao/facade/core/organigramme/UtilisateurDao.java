package ma.sir.ged.dao.facade.core.organigramme;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UtilisateurDao extends AbstractRepository<Utilisateur,Long>  {
    Utilisateur findByEmail(String email);
    int deleteByEmail(String email);

    List<Utilisateur> findByGenderId(Long id);
    int deleteByGenderId(Long id);
    int countByGenderId(Long id);
    List<Utilisateur> findByEntiteAdministrativeId(Long id);
    int deleteByEntiteAdministrativeId(Long id);
    int countByEntiteAdministrativeId(Long id);
    Utilisateur findByUsername(String username);

    @Query("SELECT NEW Utilisateur(item.id,item.nom,item.prenom,item.email,item.username) FROM Utilisateur item")
    List<Utilisateur> findAllOptimized();

    @Query("SELECT COUNT(item) FROM Utilisateur item")
    int countAllUsers();
}
