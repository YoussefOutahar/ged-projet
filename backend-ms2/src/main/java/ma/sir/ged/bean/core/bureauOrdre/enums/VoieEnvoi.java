package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VoieEnvoi {
    POSTE,
    COURRIER,
    MAIN_PROPRE,
    FAX,
    EMAIL,
    AUTRE;

    @JsonCreator
    public static VoieEnvoi forValue(String value) {
        return VoieEnvoi.valueOf(value.toUpperCase());
    }
    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
