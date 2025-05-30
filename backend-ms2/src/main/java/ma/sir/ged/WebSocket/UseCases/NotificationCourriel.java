package ma.sir.ged.WebSocket.UseCases;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationDispatcher;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.CourrielBoEtatAvancement;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class NotificationCourriel {
    @Autowired
    private NotificationDispatcher notificationDispatcher;

    public void notifyCourrielCreation(CourrielBo courrielBo) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Courriel créé");
        notification.setDetail("Le courriel a été créé");
        notification.setSeverity(NotificationSeverity.INFO);

        GetCourrielBoUsers(courrielBo, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyCourrielEtatAvancement(CourrielBo courrielBo, CourrielBoEtatAvancement etatAvancement) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Courriel avancé");
        notification.setDetail("Le courriel a été avancé à l'état " + etatAvancement);
        notification.setSeverity(NotificationSeverity.INFO);

        GetCourrielBoUsers(courrielBo, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyCourrielIntervention(CourrielBo courrielBo, IntervenantsCourriel intervention) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Intervention ajoutée");
        notification.setDetail("Une demande d'intervention a été ajoutée au courriel " + courrielBo.getSujet());
        notification.setSeverity(NotificationSeverity.INFO);

        GetCourrielBoUsers(courrielBo, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyCourrielInterventionDone(CourrielBo courrielBo, IntervenantsCourriel intervention) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Intervention terminée");
        notification.setDetail("Une demande d'intervention a été terminée sur le courriel " + courrielBo.getSujet());
        notification.setSeverity(NotificationSeverity.INFO);

        GetCourrielBoUsers(courrielBo, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyCourrielInterventionComment(CourrielBo courrielBo, IntervenantsCourriel intervention) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Commentaire ajouté");
        notification.setDetail("Un commentaire a été ajouté au courriel " + courrielBo.getSujet() + " : " + intervention.getCommentaire());
        notification.setSeverity(NotificationSeverity.INFO);

        GetCourrielBoUsers(courrielBo, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyCourrielInterventionModification(CourrielBo courrielBo, IntervenantsCourriel intervention) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Intervention modifiée");
        notification.setDetail("Une demande d'intervention a été modifiée sur le courriel " + courrielBo.getSujet());
        notification.setSeverity(NotificationSeverity.INFO);

        GetCourrielBoUsers(courrielBo, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    private static void GetCourrielBoUsers(CourrielBo courrielBo, Set<Utilisateur> users) {
        EntiteAdministrative entiteInterne = courrielBo.getEntiteInterne();
        if (Objects.nonNull(entiteInterne)) {
            List<Utilisateur> utilisateurs = entiteInterne.getUtilisateurs();
            if (Objects.nonNull(utilisateurs) && !utilisateurs.isEmpty()) {
                users.addAll(utilisateurs);
            }
        }
    }
}
