package ma.sir.ged.WebSocket.Beans.Notifications;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class UserNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Utilisateur user;

    @ManyToOne
    private Notification notification;

    private boolean isRead = false;

    private boolean isDismissed = false;

    @Override
    public String toString() {
    return "UserNotification{" +
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
        UserNotification that = (UserNotification) obj;
        return Objects.equals(id, that.id);
    }
}
