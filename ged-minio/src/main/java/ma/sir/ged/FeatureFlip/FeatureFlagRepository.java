package ma.sir.ged.FeatureFlip;

import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureFlagRepository extends AbstractRepository<FeatureFlag, Long>{
    FeatureFlag findByName(String name);
}
