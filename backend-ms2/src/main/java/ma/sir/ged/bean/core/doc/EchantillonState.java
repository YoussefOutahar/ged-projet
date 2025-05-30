package ma.sir.ged.bean.core.doc;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EchantillonState {
    EN_COURS,
    REJECT,
    VALID;

    @JsonCreator
    public static EchantillonState forValue(String value) {
        return EchantillonState.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
