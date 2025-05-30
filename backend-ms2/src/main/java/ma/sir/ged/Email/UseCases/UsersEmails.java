package ma.sir.ged.Email.UseCases;

import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.AccountCreationMailRequest;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersEmails {
    private static EmailService emailService;

    @Autowired
    public UsersEmails(EmailService emailService) {
        UsersEmails.emailService = emailService;
    }

    public static void sendUserCreationMail(UtilisateurDto user, String password, String toEmail) {
        AccountCreationMailRequest request = new AccountCreationMailRequest();
        request.setSubject("Account Creation");
        request.setMessage("Account " + user.getNom() + " has been created successfully");

        request.setAccountId(user.getId());
        request.setAccountPassword(password);

        Utilisateur sender = (Utilisateur) SecurityUtil.getCurrentUser();
        if (sender != null) {
            request.setSenderId(sender.getId());
        } else {
            request.setSenderId(0L);
        }

        request.setToEmail(toEmail);
        request.setHTML(true);

        emailService.sendAccountCreationMail(request);
    }
}
