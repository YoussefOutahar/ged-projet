package ma.sir.ged.WebSocket.Beans.Notifications;

import java.util.Objects;
import java.util.Set;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.sir.ged.WebSocket.Beans.Payload;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("notification")
public class Notification extends Payload{
    
    private String summary;

    private String detail;

    @Enumerated(EnumType.STRING)
    private NotificationSeverity severity;

    @OneToMany(mappedBy = "notification",fetch = FetchType.EAGER)
    private Set<UserNotification> userNotifications;

    @Override
    public String toString() {
        return "Notification{" +
            "id=" + id + '}';
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Notification that = (Notification) obj;
        return Objects.equals(id, that.id);
    }
}
