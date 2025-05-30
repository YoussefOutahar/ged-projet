package ma.sir.ged.FeatureFlip;

import java.util.List;

public interface FeatureFlagService {
    List<FeatureFlag> getAllFeatureFlags();
    boolean isActive(String name);
    FeatureFlag updateValue(String name);
}
