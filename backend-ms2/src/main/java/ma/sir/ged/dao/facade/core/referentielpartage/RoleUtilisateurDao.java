package ma.sir.ged.dao.facade.core.referentielpartage;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentielpartage.RoleUtilisateur;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RoleUtilisateurDao extends AbstractRepository<RoleUtilisateur,Long>  {
    RoleUtilisateur findByCode(String code);
    int deleteByCode(String code);


    @Query("SELECT NEW RoleUtilisateur(item.id,item.libelle) FROM RoleUtilisateur item")
    List<RoleUtilisateur> findAllOptimized();

    RoleUtilisateur findByLibelle(String libelle);
}
