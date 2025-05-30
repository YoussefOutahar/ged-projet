package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum HistoryEntryType {

    INFORMATION,
    CREATION,
    ETAT_CHANGE,
    INTERVENTION,
    MODIFICATION,
    DELETION;

    @JsonCreator
    public static CourrielBoEtatAvancement forValue(String value) {
        return CourrielBoEtatAvancement.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
