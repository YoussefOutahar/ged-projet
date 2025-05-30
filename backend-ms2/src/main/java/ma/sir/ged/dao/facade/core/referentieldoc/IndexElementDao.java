package ma.sir.ged.dao.facade.core.referentieldoc;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentieldoc.IndexElement;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IndexElementDao extends AbstractRepository<IndexElement,Long>  {
    IndexElement findByCode(String code);
    int deleteByCode(String code);


    @Query("SELECT NEW IndexElement(item.id,item.libelle) FROM IndexElement item")
    List<IndexElement> findAllOptimized();

    IndexElement findByLibelle(String libelle);
}
