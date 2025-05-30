package ma.sir.ged.bean.core.bureauOrdre.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActionCourriel {
    URGENT,
    AVIS,
    REPONSE_REQUISE,
    CONFIDENTIEL,
    INFORMATION,
    SUIVI,
    A_LIRE_PLUS_TARD,
    ACTION_REQUISE,
    NORMAL,
    PAYE,
    APPROUVE;

    @JsonCreator
    public static CourrielBoEtatAvancement forValue(String value) {
        return CourrielBoEtatAvancement.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
