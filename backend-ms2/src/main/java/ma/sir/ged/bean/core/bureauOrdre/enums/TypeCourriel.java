package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TypeCourriel {
    ENTRANT, SORTANT;

    @JsonCreator
    public static TypeCourriel forValue(String value) {
        return TypeCourriel.valueOf(value.toUpperCase());
    }
    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
