package ma.sir.ged.dao.facade.core.referentielpartage;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentielpartage.AccessShare;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AccessShareDao extends AbstractRepository<AccessShare,Long>  {
    AccessShare findByCode(String code);
    AccessShare findByLibelle(String libelle);
    int deleteByCode(String code);


    @Query("SELECT NEW AccessShare(item.id,item.libelle) FROM AccessShare item")
    List<AccessShare> findAllOptimized();

}
