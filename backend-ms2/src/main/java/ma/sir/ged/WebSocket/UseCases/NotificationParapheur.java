package ma.sir.ged.WebSocket.UseCases;

import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.PlainTextMailRequest;
import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationDispatcher;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class NotificationParapheur {
    @Autowired
    private NotificationDispatcher notificationDispatcher;

    @Autowired
    private EmailService emailService;

    public void notifyFicheParapheurCreationWithEmail(List<Utilisateur> users) {
        for (Utilisateur user : users) {
            PlainTextMailRequest mailRequest = new PlainTextMailRequest();
            mailRequest.setSubject("Fiche parapheur créé");
            mailRequest.setMessage("Une fiche parapheur a été créée et attend votre signature");
            mailRequest.setHTML(true);
            mailRequest.setTitle("Parapheur créé");
            mailRequest.setSenderId(-1L);
            mailRequest.setToEmail(user.getEmail());
            emailService.sendPlainTextEmail(mailRequest);
        }

        notifyFicheParapheurCreation(users);
    }

    public void notifyParapheurCreation(List<Utilisateur> users) {
        Notification notification = new Notification();
        notification.setSummary("Parapheur créé");
        notification.setDetail("Un parapheur attend votre signature");
        notification.setSeverity(NotificationSeverity.INFO);
        notification.setReceivers(new HashSet<>(users));

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyFicheParapheurCreation(List<Utilisateur> users) {
        Notification notification = new Notification();
        notification.setSummary("Fiche parapheur créé");
        notification.setDetail("Une fiche parapheur Creer avec success");
        notification.setSeverity(NotificationSeverity.INFO);

        Set<Utilisateur> usersSet = new HashSet<>(users);
        for (Utilisateur user : usersSet) {
            notificationDispatcher.dispatchToUser(user, notification);
        }
    }

    public void notifyErrorFicheParapheurCreation(List<Utilisateur> users) {
        Notification notification = new Notification();
        notification.setSummary("Erreur création fiche parapheur");
        notification.setDetail("Une erreur est survenue lors de la création de la fiche parapheur");
        notification.setSeverity(NotificationSeverity.ERROR);


        Set<Utilisateur> usersSet = new HashSet<>(users);
        for (Utilisateur user : usersSet) {
            notificationDispatcher.dispatchToUser(user, notification);
        }
    }

}
