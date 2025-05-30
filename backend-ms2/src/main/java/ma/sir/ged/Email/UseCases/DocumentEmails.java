package ma.sir.ged.Email.UseCases;

import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.DocumentCreationMailRequest;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentEmails {
    private static EmailService emailService;

    @Autowired
    public DocumentEmails(EmailService emailService) {
        DocumentEmails.emailService = emailService;
    }

    public static void sendDocumentCreationMail(Document doc, String toEmail) {

        if (doc == null) {
            throw new IllegalArgumentException("Document cannot be null");
        }

        DocumentCreationMailRequest request = new DocumentCreationMailRequest();
        request.setSubject("Document Creation");
        request.setMessage("Document " + doc.getReference() + " has been created successfully");

        request.setDocumentId(doc.getId());


        Utilisateur sender = (Utilisateur) SecurityUtil.getCurrentUser();
        if (sender != null) {
            request.setSenderId(sender.getId());
        } else {
            request.setSenderId(0L);
        }

        request.setToEmail(toEmail);
        request.setHTML(true);

        emailService.sendDocumentCreationMail(request);
    }
}
