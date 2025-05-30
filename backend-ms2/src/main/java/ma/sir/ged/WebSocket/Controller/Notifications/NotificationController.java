package ma.sir.ged.WebSocket.Controller.Notifications;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationsService;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.security.common.SecurityUtil;


@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationsService notificationService;

    @Autowired
    private NotificationConverter notificationConverter;

    @GetMapping("/all")
    public ResponseEntity<List<NotificationDTO>> getNotifications(){
        List<Notification> notifications = notificationService.getAllNotifications();
        List<NotificationDTO> notificationDTOs = new ArrayList<>();
        for (Notification notification : notifications) {
            notificationDTOs.add(notificationConverter.convertToDto(notification));
        }
        return ResponseEntity.ok(notificationDTOs);
    }

    @GetMapping("/specific")
    public ResponseEntity<List<NotificationDTO>> getSpecificNotifications() {

        Set<Notification> notifications = notificationService.getNotificationsForUser( (Utilisateur) SecurityUtil.getCurrentUser());
        
        List<NotificationDTO> notificationDTOs = new ArrayList<>();
        
        for (Notification notification : notifications) {
            notificationDTOs.add(notificationConverter.convertToDto(notification));
        }
        
        return ResponseEntity.ok(notificationDTOs);
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(notificationService.getNotificationById(id).get());
        return ResponseEntity.ok(notificationConverter.convertToDto(notificationService.getNotificationById(id).get()));
    }

    @PutMapping("/unread/{id}")
    public ResponseEntity<NotificationDTO> markAsUnread(@PathVariable Long id) {
        notificationService.markAsUnread(notificationService.getNotificationById(id).get());
        return ResponseEntity.ok(notificationConverter.convertToDto(notificationService.getNotificationById(id).get()));
    }

    @PutMapping("/dismiss/{id}")
    public ResponseEntity<NotificationDTO> dismiss(@PathVariable Long id) {
        notificationService.dismiss(notificationService.getNotificationById(id).get());
        return ResponseEntity.ok(notificationConverter.convertToDto(notificationService.getNotificationById(id).get()));
    }

    @PutMapping("/dismiss/all")
    public ResponseEntity<NotificationDTO> dismissAll() {
        notificationService.dismissAll();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/undismiss/{id}")
    public ResponseEntity<NotificationDTO> undismiss(@PathVariable Long id) {
        notificationService.undismiss(notificationService.getNotificationById(id).get());
        return ResponseEntity.ok(notificationConverter.convertToDto(notificationService.getNotificationById(id).get()));
    }
}
