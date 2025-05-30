package ma.sir.ged.Email;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ma.sir.ged.Email.MailRequests.AccountCreationMailRequest;
import ma.sir.ged.Email.MailRequests.DocumentCreationMailRequest;
import ma.sir.ged.Email.MailRequests.MailRequest;
import ma.sir.ged.Email.MailRequests.PlainTextMailRequest;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/sendMail/{isHtml}")
    public void sendMail(@RequestBody MailRequest mailRequest, @PathVariable Boolean isHtml) {
        mailRequest.setHTML(isHtml);
        emailService.sendMail(mailRequest);
    }

    @PostMapping("/sendPlainTextMail")
    public void sendPlainTextMail(@RequestBody PlainTextMailRequest request) {
        emailService.sendPlainTextEmail(request);
    }

    @PostMapping("/sendAccountCreationMail")
    public void sendAccountCreationMail(@RequestBody AccountCreationMailRequest request) {
        emailService.sendAccountCreationMail(request);
    }

    @PostMapping("/sendDocumentCreationMail")
    public void sendDocumentCreationMail(@RequestBody DocumentCreationMailRequest request) {
        emailService.sendDocumentCreationMail(request);
    }
}
