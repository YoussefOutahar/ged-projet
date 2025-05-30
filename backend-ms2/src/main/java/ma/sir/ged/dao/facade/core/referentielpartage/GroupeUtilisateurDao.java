package ma.sir.ged.dao.facade.core.referentielpartage;

import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface GroupeUtilisateurDao extends AbstractRepository<GroupeUtilisateur, Long> {

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
