package ma.sir.ged.WebSocket.UseCases;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.sir.ged.WebSocket.Beans.Notifications.Notification;
import ma.sir.ged.WebSocket.Beans.Notifications.NotificationSeverity;
import ma.sir.ged.WebSocket.Services.Notifications.NotificationDispatcher;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;

import javax.transaction.Transactional;

@Service
public class NotificationDocument {
    @Autowired
    private NotificationDispatcher notificationDispatcher;

    @Autowired
    private UtilisateurConverter utilisateurConverter;

    @Autowired
    private EntiteAdministrativeDao entiteAdministrativeDao;


    // Create
    public void notifyDocumentCreation(DocumentDto documentDto) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Document créé");
        notification.setDetail("Le document " + documentDto.getReference() + " a été créé");
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromDocDto(documentDto, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyDocumentCreation(DocumentSummaryDto summaryDto) {
        
    }

    public void notifyDocumentCreationList(List<DocumentDto> documentDtos) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Document créé");
        notification.setDetail("Multiple documents ont été créés");
        notification.setSeverity(NotificationSeverity.INFO);

        documentDtos.forEach(docDto -> {
            getUsersFromDocDto(docDto, users);
        });

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyDocumentSummaryCreationList(List<DocumentSummaryDto> summaryDtos) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Document créé");
        notification.setDetail("Multiple documents ont été créés");
        notification.setSeverity(NotificationSeverity.INFO);

        summaryDtos.forEach(summaryDto -> {
            getUsersFromDocSummaryDto(summaryDto, users);
        });

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    
    // Update
    public void notifyDocumentUpdate(DocumentDto documentDto) {
        Set<Utilisateur> users = new HashSet<>();
        
        Notification notification = new Notification();
        notification.setSummary("Document modifié");
        notification.setDetail("Le document " + documentDto.getReference() + " a été modifié");
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromDocDto(documentDto, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    // Delete
    public void notifyDocumentDelete(DocumentDto documentDto) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Document supprimé");
        notification.setDetail("Le document " + documentDto.getReference() + " a été supprimé");
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromDocDto(documentDto, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyDocumentDelete(Document document) {
        Set<Utilisateur> users = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Document supprimé");
        notification.setDetail("Le document " + document.getReference() + " a été supprimé");
        notification.setSeverity(NotificationSeverity.INFO);

        getUsersFromDoc(document, users);

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    public void notifyDocumentDeleteList(List<DocumentDto> documentDtos) {
        Set<Utilisateur> users = new HashSet<>();
        // Creating a notification
        Notification notification = new Notification();
        notification.setSummary("Document supprimé");
        notification.setDetail("Multiple documents ont été supprimés");
        notification.setSeverity(NotificationSeverity.INFO);

        documentDtos.forEach(docDto -> {
            getUsersFromDocDto(docDto, users);
        });

        notification.setReceivers(users);

        notificationDispatcher.dispatchToUser(notification);
    }

    // Indexation
    public void notifyIndexationSuccess(Set<Utilisateur> users) {
        Notification notification = new Notification();
        notification.setSummary("Document indexé");
        notification.setDetail("Les documents ont été indexés");
        notification.setSeverity(NotificationSeverity.INFO);

        notification.setReceivers(users);

        for (Utilisateur user : users) {
            notificationDispatcher.dispatchToUser(user, notification);
        }
    }

    public void notifyIndexationFailure(Set<Utilisateur> users) {
        Notification notification = new Notification();
        notification.setSummary("Document non indexé");
        notification.setDetail("Les documents n'ont pas été indexés");
        notification.setSeverity(NotificationSeverity.INFO);

        notification.setReceivers(users);

        for (Utilisateur user : users) {
            notificationDispatcher.dispatchToUser(user, notification);
        }
    }

    // getting receivers
    private void getUsersFromDoc(Document document, Set<Utilisateur> users) {
        EntiteAdministrative entiteAdministrative = document.getEntiteAdministrative();
        if (Objects.nonNull(entiteAdministrative)) {
            List<Utilisateur> utilisateurs = entiteAdministrative.getUtilisateurs();
            if (Objects.nonNull(utilisateurs)) {
                utilisateurs.forEach(user -> {
                    users.add(user);
                });
            }
        }
    }

    private void getUsersFromDoc(List<Document> document, Set<Utilisateur> users) {
        for (Document doc : document) {
            getUsersFromDoc(doc, users);
        }
    }

    private void getUsersFromDocDto(DocumentDto documentDto, Set<Utilisateur> users) {
        EntiteAdministrativeDto entiteAdministrative = documentDto.getEntiteAdministrative();
        if (Objects.nonNull(entiteAdministrative)) {
            List<UtilisateurDto> utilisateurs = entiteAdministrative.getUtilisateurs();
            if (Objects.nonNull(utilisateurs)) {
                utilisateurs.forEach(user -> {
                    Utilisateur utilisateur = utilisateurConverter.toItem(user);
                    users.add(utilisateur);
                });
            }
        }
    }

    private void getUsersFromDocSummaryDto(DocumentSummaryDto documentDto, Set<Utilisateur> users) {
//        EntiteAdministrative entiteAdministrative = entiteAdministrativeDao.findByCode(documentDto.getEntiteAdministrativeCode());
//        if (Objects.nonNull(entiteAdministrative)) {
//            List<Utilisateur> utilisateurs = entiteAdministrative.getUtilisateurs();
//            if (Objects.nonNull(utilisateurs)) {
//                utilisateurs.forEach(user -> {
//                    users.add(user);
//                });
//            }
//        }
    }
}
