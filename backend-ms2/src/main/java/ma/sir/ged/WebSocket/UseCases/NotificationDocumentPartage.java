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
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.DocumentPartageGroupeDto;
import ma.sir.ged.ws.dto.DocumentPartageUtilisateurDto;

@Service
public class NotificationDocumentPartage {

    @Autowired
    private NotificationDispatcher notificationDispatcher;

    @Autowired
    private NotificationDocument notificationDocument;

    @Autowired
    private UtilisateurConverter utilisateurConverter;

    public void notifyDocumentPartage(DocumentDto newDocDto, DocumentDto oldDocDto) {

        boolean isPartageGroupe = isPartageGroupe(newDocDto, oldDocDto);
        boolean isPartageUtilisateurs = isPartageUtilisateurs(newDocDto, oldDocDto);

        if (isPartageGroupe) notifyDocumentPartageGroupe(newDocDto);

        if (isPartageUtilisateurs) notifyDocumentPartageUtilisateurs(newDocDto);

        if (!isPartageGroupe && !isPartageUtilisateurs)
            notificationDocument.notifyDocumentUpdate(oldDocDto);
    }

    public void notifyDocumentPartageGroupe(DocumentDto docDto) {

        Set<Utilisateur> receivers = new HashSet<>();

        Notification notification = new Notification();
        notification.setSummary("Document partagé");
        notification.setDetail("Le document " + docDto.getReference() + " a été partagé avec vous");
        notification.setSeverity(NotificationSeverity.INFO);

        getPartageGroupesUsers(docDto, receivers);

        notification.setReceivers(receivers);

        notificationDispatcher.dispatchToUser(notification);
    }

    private void getPartageGroupesUsers(DocumentDto docDto, Set<Utilisateur> receivers) {
        List<DocumentPartageGroupeDto> partageGroupes = docDto.getDocumentPartageGroupes();
        if (Objects.nonNull(partageGroupes) && !partageGroupes.isEmpty()) {
            partageGroupes.forEach(group -> {
                if(Objects.nonNull(group)) {
                    if (Objects.nonNull(group.getGroupe()) && Objects.nonNull(group.getGroupe().getGroupeUtilisateurs())) {
                        group.getGroupe().getGroupeUtilisateurs().forEach(groupUser -> {
                            Utilisateur user = utilisateurConverter.toItem(groupUser.getUtilisateur());
                            receivers.add(user);
                        });
                    }
                }
            });
        }
    }

    public void notifyDocumentPartageUtilisateurs(DocumentDto docDto) {
        Set<Utilisateur> receivers = new HashSet<>();

        // Creating a notification
        Notification notification = new Notification();
        notification.setSummary("Document partagé");
        notification.setDetail("Le document " + docDto.getReference() + " a été partagé avec vous");
        notification.setSeverity(NotificationSeverity.INFO);

        getPartageUtilisateurs(docDto, receivers);

        notification.setReceivers(receivers);

        notificationDispatcher.dispatchToUser(notification);
    }

    private void getPartageUtilisateurs(DocumentDto docDto, Set<Utilisateur> receivers) {
        List<DocumentPartageUtilisateurDto> partageUtilisateurs = docDto.getDocumentPartageUtilisateurs();
        if (Objects.nonNull(partageUtilisateurs) && !partageUtilisateurs.isEmpty()) {
            partageUtilisateurs.forEach(dp -> {
                Utilisateur user = utilisateurConverter.toItem(dp.getUtilisateur());
                receivers.add(user);
            });
        }
    }
    
    private boolean isPartageGroupe(DocumentDto newDoc, DocumentDto oldDoc) {
        if (newDoc.getDocumentPartageGroupes() == null)  return false;

        int newDocSize = newDoc.getDocumentPartageGroupes() == null ? 0 : newDoc.getDocumentPartageGroupes().size();
        int oldDocSize = oldDoc.getDocumentPartageGroupes() == null ? 0 : oldDoc.getDocumentPartageGroupes().size();

        if (newDocSize > oldDocSize) return true;

        if (newDocSize < oldDocSize) return true;

        if (newDocSize == oldDocSize) {
            for (int i = 0; i < newDocSize; i++) {
                if (!newDoc.getDocumentPartageGroupes().get(i).equals(oldDoc.getDocumentPartageGroupes().get(i))) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean isPartageUtilisateurs(DocumentDto newDoc, DocumentDto oldDoc) {
        if (newDoc.getDocumentPartageUtilisateurs() == null)  return false;

        int newDocSize = newDoc.getDocumentPartageUtilisateurs() == null ? 0 : newDoc.getDocumentPartageUtilisateurs().size();
        int oldDocSize = oldDoc.getDocumentPartageUtilisateurs() == null ? 0 : oldDoc.getDocumentPartageUtilisateurs().size();

        if (newDocSize > oldDocSize) return true;

        if (newDocSize < oldDocSize) return true;

        if (newDocSize == oldDocSize) {
            for (int i = 0; i < newDocSize; i++) {
                if (!newDoc.getDocumentPartageUtilisateurs().get(i).equals(oldDoc.getDocumentPartageUtilisateurs().get(i))) {
                    return true;
                }
            }
        }

        return false;
    }
}
