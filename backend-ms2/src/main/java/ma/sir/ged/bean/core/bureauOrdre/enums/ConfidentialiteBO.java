package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ConfidentialiteBO {
    NORMAL, CONFIDENTIEL, TOP_CONFIDENTIEL;

    @JsonCreator
    public static ConfidentialiteBO forValue(String value) {
        return ConfidentialiteBO.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
