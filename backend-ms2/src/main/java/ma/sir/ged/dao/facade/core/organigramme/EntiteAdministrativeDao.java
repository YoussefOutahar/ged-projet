package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface EntiteAdministrativeDao extends AbstractRepository<EntiteAdministrative, Long> {
    EntiteAdministrative findByCode(String code);

    int deleteByCode(String code);

    List<EntiteAdministrative> findByEntiteAdministrativeParentId(Long id);

    int deleteByEntiteAdministrativeParentId(Long id);

    List<EntiteAdministrative> findByChefId(Long id);

    int deleteByChefId(Long id);

    long countByChefId(long id);

    List<EntiteAdministrative> findByEntiteAdministrativeTypeId(Long id);

    int deleteByEntiteAdministrativeTypeId(Long id);

    long countByEntiteAdministrativeTypeId(Long id);

    @Query("SELECT NEW EntiteAdministrative(item.id,item.libelle) FROM EntiteAdministrative item")
    List<EntiteAdministrative> findAllOptimized();

    EntiteAdministrative findByLibelle(String libelle);

}
