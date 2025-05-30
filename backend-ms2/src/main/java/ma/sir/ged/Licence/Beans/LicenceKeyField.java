package ma.sir.ged.Licence.Beans;

import lombok.Getter;

@Getter
public enum LicenceKeyField {
    CLIENT_NAME("clientName"),
    EXPIRATION_DATE("expirationDate"),
    NUMBER_OF_USERS("numberOfUsers"),
    MAX_SESSIONS_PER_USER("maxSessionsPerUser");

    private final String key;

    LicenceKeyField(String key) {
        this.key = key;
    }

}
