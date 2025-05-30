package ma.sir.ged.WebSocket.Wokflow;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationDispatcher;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationWorkflow {
    @Autowired
    private NotificationDispatcher notificationDispatcher;

    @Autowired
    private UtilisateurConverter utilisateurConverter;

    // Create
    public void notifyWorkflowCreation(Workflow workflowDTO) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Workflow créé");
        notification.setDetail("Le Workflow " + workflowDTO.getTitle() + " a été créé");
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromWfDto(workflowDTO, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    
    // Update
    public void notifyWorkflowClosed(Workflow workflowDTO) {
        Set<Utilisateur> users = new HashSet<>();
        
        Notification notification = new Notification();
        notification.setSummary("Workflow Terminé");
        notification.setDetail("Le Workflow " + workflowDTO.getTitle() + " a été cloturé");
        notification.setSeverity(NotificationSeverity.SUCCESS);

        getUsersFromWfDto(workflowDTO, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    // Delete
    public void notifyWorkflowReject(Workflow workflowDTO) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Workflow rejeté");
        notification.setDetail("Le workflow " + workflowDTO.getTitle() + " a été rejeté");
        notification.setSeverity(NotificationSeverity.ERROR);

        getUsersFromWfDto(workflowDTO, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyWorkflowAnnuled(Workflow workflowDTO) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Workflow Annulé");
        notification.setDetail("Le Workflow " + workflowDTO.getTitle() + " a été annulé");
        notification.setSeverity(NotificationSeverity.WARN);

        getUsersFromWfDto(workflowDTO, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyWorkflowReouvrir(Workflow workflowDTO) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Workflow Reouvret");
        notification.setDetail("Le Workflow " + workflowDTO.getTitle() + " a été reouvert");
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromWfDto(workflowDTO, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }


    // getting receivers

    private void getUsersFromWfDto(Workflow workflowDTO, Set<Utilisateur> users) {
        if (Objects.nonNull(workflowDTO)) {
            List<Utilisateur> utilisateurs = workflowDTO.getStepList().stream()
                    .flatMap(step -> step.getStepPreset().getDestinataires().stream())
                    .map(UserDestinataire::getUtilisateur)
                    .collect(Collectors.toList());
            if (Objects.nonNull(utilisateurs)) {
                utilisateurs.forEach(user -> {
//                    Utilisateur utilisateur = utilisateurConverter.toItem(user);
                    users.add(user);
                });
            }
        }
    }
}
