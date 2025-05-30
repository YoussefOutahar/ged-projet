package ma.sir.ged.WebSocket.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ma.sir.ged.WebSocket.Beans.Notifications.UserNotification;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification,Long > {

    @Query("SELECT n FROM UserNotification n WHERE n.user.id = :userId")
    Optional<UserNotification> getNotificationForUser(Long userId);

    @Query("SELECT n FROM UserNotification n WHERE n.notification.id = :notificationId AND n.user.id = :userId")
    Optional<UserNotification> getNotificationForUser(Long notificationId, Long userId);

    Optional<List<UserNotification>> findByUserId(Long userId);
}
