package ma.sir.ged.dao.facade.core.referentieldoc;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndexRule;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DocumentCategorieIndexRuleDao extends AbstractRepository<DocumentCategorieIndexRule,Long>  {
    DocumentCategorieIndexRule findByCode(String code);
    int deleteByCode(String code);


    @Query("SELECT NEW DocumentCategorieIndexRule(item.id,item.libelle) FROM DocumentCategorieIndexRule item")
    List<DocumentCategorieIndexRule> findAllOptimized();

    DocumentCategorieIndexRule findByLibelle(String libelle);
}
