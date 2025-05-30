package ma.sir.ged.WebSocket.Controller.Notifications;

import org.apache.commons.math3.analysis.function.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Repository.UserNotificationRepository;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.zynerator.security.common.SecurityUtil;

@Component
public class NotificationConverter{

    @Autowired
    private UtilisateurDao utilisateurDAO;

    @Autowired
    private UserNotificationRepository userNotificationRepository;
    
    public NotificationDTO convertToDto(Notification notification) {

        if (notification == null) {
            return new NotificationDTO();
        }

        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setSummary(notification.getSummary());
        dto.setDetail(notification.getDetail());
        dto.setSeverity(notification.getSeverity().name().toLowerCase());

        if (notification.getSender() != null) {
            dto.setSender(notification.getSender().getId());
        } else if(SecurityUtil.getCurrentUser() != null){
            dto.setSender(SecurityUtil.getCurrentUser().getId());
        }

        Utilisateur receiver = (Utilisateur) SecurityUtil.getCurrentUser();
        if (receiver != null) {
            userNotificationRepository.getNotificationForUser(notification.getId(), receiver.getId()).ifPresent(userNotification -> {
                dto.setRead(userNotification.isRead());
                dto.setDismissed(userNotification.isDismissed());
            });
        }

        dto.setCreatedAt(notification.getCreationDate().toString());
        return dto;
    }

    public Notification convertToEntity(NotificationDTO dto) {

        if (dto == null) {
            return new Notification();
        }

        Notification notification = new Notification();
        notification.setId(dto.getId());
        notification.setSummary(dto.getSummary());
        notification.setDetail(dto.getDetail());
        notification.setSeverity(NotificationSeverity.valueOf(dto.getSeverity().toUpperCase()));
        
        Utilisateur sender = utilisateurDAO.findById(dto.getSender()).orElse((Utilisateur)SecurityUtil.getCurrentUser());
        notification.setSender(sender);

        notification.setCreationDate(
            dto.getCreatedAt() != null ? 
            java.sql.Timestamp.valueOf(dto.getCreatedAt()) : 
            new java.sql.Timestamp(System.currentTimeMillis())
        );
        return notification;
    }
    
}
