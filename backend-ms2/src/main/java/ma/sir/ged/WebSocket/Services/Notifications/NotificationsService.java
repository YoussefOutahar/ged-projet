package ma.sir.ged.WebSocket.Services.Notifications;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.UserNotification;
import ma.sir.ged.WebSocket.Repository.UserNotificationRepository;
import ma.sir.ged.WebSocket.Repository.WsRepository;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.security.common.SecurityUtil;

import java.util.*;

import javax.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationsService {
    private final WsRepository<Notification> wsRepository;
    private final UserNotificationRepository userNotificationRepository;

    public List<Notification> getAllNotifications() {
        return wsRepository.findAll();
    }

    public Set<Notification> getNotificationsForUser(Utilisateur user) {

        if (user == null) return new HashSet<>();
        return wsRepository.getNotificationsForUser(user.getId());
    }

    public Optional<Notification> getNotificationById(Long id) {
        return wsRepository.findById(id);
    }

    public Notification createNotification(Notification notification) {
        Set<Utilisateur> users = notification.getReceivers();
        if (users != null) {

//            users.removeIf(user -> notification.getSender() != null && user.getId().equals(notification.getSender().getId()));

            List<UserNotification> userNotifications = new ArrayList<>();
            for (Utilisateur user : users) {
                UserNotification userNotification = new UserNotification();
                userNotification.setUser(user);
                userNotification.setNotification(notification);
                userNotifications.add(userNotification);
            }
            userNotificationRepository.saveAll(userNotifications);
        }
        return wsRepository.save(notification);
    }

    public Notification updateNotification(Notification notification) {
        return wsRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        wsRepository.deleteById(id);
    }

    public void markAsRead(Notification notification) {
        UserNotification userNotification = getUserNotification(notification);

        if (userNotification == null) return;

        userNotification.setRead(true);

        userNotificationRepository.save(userNotification);
        wsRepository.save(notification);
    }

    public void markAsUnread(Notification notification) {
        UserNotification userNotification = getUserNotification(notification);

        if (userNotification == null) return;

        userNotification.setRead(false);

        userNotificationRepository.save(userNotification);
        wsRepository.save(notification);
    }

    public void dismiss(Notification notification) {
        UserNotification userNotification = getUserNotification(notification);

        if (userNotification == null) return;

        userNotification.setDismissed(true);

        userNotificationRepository.save(userNotification);
        wsRepository.save(notification);
    }

    public void dismissAll() {
        Utilisateur user = (Utilisateur) SecurityUtil.getCurrentUser();

        List<UserNotification> userNotifications = new ArrayList<>();
        if (user != null) {
            Optional<List<UserNotification>> optionalUserNotifications = userNotificationRepository.findByUserId(user.getId());
            userNotifications = optionalUserNotifications.orElse(new ArrayList<>());
        }

        userNotifications.forEach(userNotification -> userNotification.setDismissed(true));
        userNotificationRepository.saveAll(userNotifications);
    }

    public void undismiss(Notification notification) {
        UserNotification userNotification = getUserNotification(notification);

        if (userNotification == null) return;

        userNotification.setDismissed(false);

        userNotificationRepository.save(userNotification);
        wsRepository.save(notification);
    }

    private @Nullable UserNotification getUserNotification(Notification notification) {
        Utilisateur user = (Utilisateur) SecurityUtil.getCurrentUser();

        UserNotification userNotification = null;
        if (notification != null && user != null) {
            Optional<UserNotification> optionalUserNotification = userNotificationRepository.getNotificationForUser(notification.getId(), user.getId());
            if (optionalUserNotification.isPresent()) {
                userNotification = optionalUserNotification.get();
            }
        }
        return userNotification;
    }
}
