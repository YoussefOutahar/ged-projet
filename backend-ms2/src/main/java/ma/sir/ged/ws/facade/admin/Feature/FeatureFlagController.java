package ma.sir.ged.ws.facade.admin.Feature;

import ma.sir.ged.bean.core.Feature.FeatureFlag;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feature-flags")
public class FeatureFlagController {
    @Autowired
    private FeatureFlagService featureFlagService;

    @GetMapping
    public List<FeatureFlag> getAllFeatureFlags() {
        return featureFlagService.getAllFeatureFlags();
    }
    @GetMapping("/{name}")
    public ResponseEntity<Boolean> isActive(@PathVariable String name) {
        boolean isActive = featureFlagService.isActive(name);
        return ResponseEntity.ok(isActive);
    }
    @PutMapping("/{name}")
    public ResponseEntity<Boolean> updateValue(@PathVariable String name) {
        FeatureFlag updatedFlag = featureFlagService.updateValue(name);
        return ResponseEntity.ok(updatedFlag.isValue());
    }
}
