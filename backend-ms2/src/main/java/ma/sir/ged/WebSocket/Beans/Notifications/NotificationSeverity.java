package ma.sir.ged.WebSocket.Beans.Notifications;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NotificationSeverity {
    INFO,
    WARN,
    ERROR,
    SUCCESS;

    @JsonCreator
    public static NotificationSeverity forValue(String value) {
        return NotificationSeverity.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
