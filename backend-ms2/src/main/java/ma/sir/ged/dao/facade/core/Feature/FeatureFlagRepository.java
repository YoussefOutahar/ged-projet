package ma.sir.ged.dao.facade.core.Feature;

import ma.sir.ged.bean.core.Feature.FeatureFlag;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureFlagRepository extends AbstractRepository<FeatureFlag, Long>{
    FeatureFlag findByName(String name);
}
