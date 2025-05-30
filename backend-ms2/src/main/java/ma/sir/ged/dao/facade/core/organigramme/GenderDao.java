package ma.sir.ged.dao.facade.core.organigramme;

import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.organigramme.Gender;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface GenderDao extends AbstractRepository<Gender,Long>  {
    Gender findByCode(String code);
    int deleteByCode(String code);


    @Query("SELECT NEW Gender(item.id,item.libelle) FROM Gender item")
    List<Gender> findAllOptimized();

    Gender findByLibelle(String libelle);
}
