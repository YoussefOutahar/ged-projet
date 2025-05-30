package ma.sir.ged.dao.facade.core.referentieldoc;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieModel;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DocumentCategorieModelDao extends AbstractRepository<DocumentCategorieModel,Long>  {
    DocumentCategorieModel findByCode(String code);
    int deleteByCode(String code);

    List<DocumentCategorieModel> findByDocumentCategorieId(Long id);
    int deleteByDocumentCategorieId(Long id);

    @Query("SELECT NEW DocumentCategorieModel(item.id,item.libelle) FROM DocumentCategorieModel item")
    List<DocumentCategorieModel> findAllOptimized();

    DocumentCategorieModel findByLibelle(String libelle);
}
