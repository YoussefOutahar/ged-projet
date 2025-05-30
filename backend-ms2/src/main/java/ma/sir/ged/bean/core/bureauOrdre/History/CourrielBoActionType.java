package ma.sir.ged.bean.core.bureauOrdre.History;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import ma.sir.ged.bean.core.bureauOrdre.enums.CourrielBoEtatAvancement;

public enum CourrielBoActionType {

    CREATE("Create"),
    UPDATE("Update"),
    DELETE("Delete"),

    EN_ATTENTE("En attente"),
    EN_COURS("En cours"),
    REJETE("Rejeté"),
    TERMINE("Terminé");

    private String value;

    CourrielBoActionType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CourrielBoEtatAvancement forValue(String value) {
        return CourrielBoEtatAvancement.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
