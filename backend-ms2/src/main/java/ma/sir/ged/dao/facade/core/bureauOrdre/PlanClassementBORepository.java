package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.PlanClassementBO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanClassementBORepository extends JpaRepository<PlanClassementBO, Long>{
    Optional<PlanClassementBO> findByCode(String code);
}
