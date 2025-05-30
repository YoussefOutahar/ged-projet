package ma.sir.ged.WebSocket.Wokflow;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationDispatcher;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.DTO.StepDTO;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.mapper.StepDTOMapper;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.UtilisateurDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationStep {
    @Autowired
    private NotificationDispatcher notificationDispatcher;

    // Create
    public void notifyStepDone(Step stepDTO, String action) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Step Validé");
        notification.setDetail("L'étape " + stepDTO.getStepPreset().getTitle() + " du workflow " + stepDTO.getWorkflow().getTitle() + " a été " + action);
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromStepsDto(stepDTO, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }


    // getting receivers

    private void getUsersFromStepsDto(Step stepDTO, Set<Utilisateur> users) {
        Workflow workflow = stepDTO.getWorkflow();
        if (Objects.nonNull(workflow)) {
            List<Utilisateur> utilisateurs = workflow.getStepList().stream()
                    .filter(step -> step.getStepPreset().getLevel() < stepDTO.getStepPreset().getLevel())
                    .flatMap(step -> step.getStepPreset().getDestinataires().stream())
                    .map(UserDestinataire::getUtilisateur)
                    .collect(Collectors.toList());

            if (Objects.nonNull(utilisateurs)) {
                utilisateurs.forEach(user -> {
                    users.add(user);
                });
            }
        }
    }
}
