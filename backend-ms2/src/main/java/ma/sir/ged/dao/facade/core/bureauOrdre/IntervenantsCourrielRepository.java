package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface IntervenantsCourrielRepository extends JpaRepository<IntervenantsCourriel, Long> {
    IntervenantsCourriel findByCourrielBoId(Long id);
    int deleteByCourrielBoId(Long id);

    @Query("SELECT i FROM IntervenantsCourriel i WHERE i.courrielBo.id = ?1")
    List<IntervenantsCourriel> findAllByCourrielBoId(Long courrielId);

}
