package ma.sir.ged.bean.core.parapheur;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ParapheurEtat {
    EN_ATTENTE,
    EN_COURS,
    REJETE,
    TERMINE,
    DRAFT;

    @JsonCreator
    public static ParapheurEtat forValue(String value) {
        return ParapheurEtat.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}