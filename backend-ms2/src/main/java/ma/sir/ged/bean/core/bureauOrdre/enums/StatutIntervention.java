package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatutIntervention {
    EN_COURS,
    CLOTURE,

    EN_ATTENTE,
    ANNULE;

    @JsonCreator
    public static StatutIntervention forValue(String value) {
        return StatutIntervention.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
