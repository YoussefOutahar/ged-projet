package ma.sir.ged.WebSocket.UseCases;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationDispatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationLicence {
    @Autowired
    private NotificationDispatcher notificationDispatcher;

    public void notifyLicenceAboutToExpire(String timeRemaining) {
        Notification notification = new Notification();
        notification.setSummary("Licence sur le point d'expirer");
        notification.setDetail("La licence de l'application va expirer dans " + timeRemaining);

        notification.setSeverity(NotificationSeverity.WARN);

        notificationDispatcher.broadcast(notification,true);
    }

    public void notifyLicenceAboutToExpireBanner(String timeRemaining) {
        Notification notification = new Notification();
        notification.setSummary("LICENCE-EXPIRATION-BANNER");
        notification.setDetail("La licence de l'application va expirer dans " + timeRemaining);

        notification.setSeverity(NotificationSeverity.ERROR);

        notificationDispatcher.broadcast(notification,false);
    }
}
