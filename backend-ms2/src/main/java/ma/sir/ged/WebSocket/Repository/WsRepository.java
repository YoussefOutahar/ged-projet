package ma.sir.ged.WebSocket.Repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ma.sir.ged.WebSocket.Beans.Payload;
import ma.sir.ged.WebSocket.Beans.Notifications.Notification;

@Repository
public interface WsRepository<T extends Payload> extends JpaRepository<T, Long > {

    @Query("SELECT n FROM Notification n JOIN n.userNotifications u WHERE u.user.id = :userId")
    public Set<Notification> getNotificationsForUser(Long userId);
}
