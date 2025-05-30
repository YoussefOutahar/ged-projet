package ma.sir.ged.dao.facade.core.referentielpartage;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentielpartage.Groupe;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface GroupeDao extends AbstractRepository<Groupe,Long>  {
    Groupe findByCode(String code);
    int deleteByCode(String code);

    List<Groupe> findByUtilisateurId(Long id);
    int deleteByUtilisateurId(Long id);
    long countByUtilisateurId(Long id);

    @Query("SELECT NEW Groupe(item.id,item.libelle) FROM Groupe item")
    List<Groupe> findAllOptimized();

    Groupe findByLibelle(String libelle);
}
