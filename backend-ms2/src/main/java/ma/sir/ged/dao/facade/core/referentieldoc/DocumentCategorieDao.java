package ma.sir.ged.dao.facade.core.referentieldoc;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DocumentCategorieDao extends AbstractRepository<DocumentCategorie,Long>  {
    DocumentCategorie findByCode(String code);
    int deleteByCode(String code);


    @Query("SELECT NEW DocumentCategorie(item.id,item.libelle) FROM DocumentCategorie item")
    List<DocumentCategorie> findAllOptimized();

    DocumentCategorie findByLibelle(String libelle);
}
