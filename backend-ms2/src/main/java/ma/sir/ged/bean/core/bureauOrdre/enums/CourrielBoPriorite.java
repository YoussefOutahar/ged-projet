package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CourrielBoPriorite {
    BASSE,
    MOYENNE,
    HAUTE;

    @JsonCreator
    public static CourrielBoPriorite forValue(String value) {
        return CourrielBoPriorite.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
