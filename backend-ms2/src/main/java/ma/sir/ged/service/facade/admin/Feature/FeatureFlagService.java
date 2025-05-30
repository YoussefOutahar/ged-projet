package ma.sir.ged.service.facade.admin.Feature;

import ma.sir.ged.bean.core.Feature.FeatureFlag;

import java.util.List;

public interface FeatureFlagService {
    List<FeatureFlag> getAllFeatureFlags();
    boolean isActive(String name);
    FeatureFlag updateValue(String name);
}
