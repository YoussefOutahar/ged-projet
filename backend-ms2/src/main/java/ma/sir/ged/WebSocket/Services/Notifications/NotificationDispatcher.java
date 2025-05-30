package ma.sir.ged.WebSocket.Services.Notifications;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Controller.Notifications.NotificationConverter;
import ma.sir.ged.WebSocket.Controller.Notifications.NotificationDTO;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.security.common.SecurityUtil;

@Service
@RequiredArgsConstructor
public class NotificationDispatcher {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private NotificationsService notificationService;

    @Autowired
    private NotificationConverter notificationConverter;

    @Autowired
    private UtilisateurDao utilisateurDao;

    @Log
    public void broadcast(Notification notification,boolean save) {
        if (save) {
            Set<Utilisateur> users = new HashSet<>(utilisateurDao.findAll());
            notification.setReceivers(users);
        }
        notification = notificationService.createNotification(notification);
        NotificationDTO notificationDTO = notificationConverter.convertToDto(notification);
        template.convertAndSend("/topic/notifications/all", notificationDTO);
    }

    @Log
    public void dispatchToUser(Utilisateur user, Notification notification) {        
        Utilisateur sender = (Utilisateur) SecurityUtil.getCurrentUser();
        notification.setSender(sender);
        
        notification = notificationService.createNotification(notification);
        NotificationDTO notificationDTO = notificationConverter.convertToDto(notification);

        template.convertAndSendToUser(user.getUsername(), "/topic/notifications/private", notificationDTO);
    } 
    
    @Log
    public void dispatchToUser(Notification notification) {
        Set<Utilisateur> users = notification.getReceivers();
        
        Utilisateur sender = (Utilisateur) SecurityUtil.getCurrentUser();
        notification.setSender(sender);
        
        notification = notificationService.createNotification(notification);
        NotificationDTO notificationDTO = notificationConverter.convertToDto(notification);
        
        if (Objects.nonNull(users)) {
            for (Utilisateur user : users) {
                if (sender != null && !user.getUsername().equals(sender.getUsername())) {
                    template.convertAndSendToUser(user.getUsername(), "/topic/notifications/private", notificationDTO);
                }
            }
        }
    }
}
