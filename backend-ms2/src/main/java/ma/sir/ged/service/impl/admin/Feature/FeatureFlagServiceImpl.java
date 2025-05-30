package ma.sir.ged.service.impl.admin.Feature;

import ma.sir.ged.bean.core.Feature.FeatureFlag;
import ma.sir.ged.dao.facade.core.Feature.FeatureFlagRepository;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.util.List;
@Service
public class FeatureFlagServiceImpl implements FeatureFlagService {

    @Autowired
    FeatureFlagRepository featureFlagRepository;

    @Override
    public List<FeatureFlag> getAllFeatureFlags() {
        return featureFlagRepository.findAll();
    }

    @Override
    public boolean isActive(String name) {
        FeatureFlag featureFlag = featureFlagRepository.findByName(name);
        if (featureFlag == null) {
            return false;
        }
        return featureFlag.isValue();
    }

    @Override
    public FeatureFlag updateValue(String name) {
        FeatureFlag featureFlag = featureFlagRepository.findByName(name);
        if (featureFlag != null) {
            featureFlag.setValue(!featureFlag.isValue());
            return featureFlagRepository.save(featureFlag);
        } else {
            throw new NotFoundException("Feature flag not found for name: " + name);
        }
    }
}
