package ma.sir.ged.Email.MailRequests;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class MailRequest {

    private String toEmail;

    private String subject;

    private String message;

    private List<Long> documentIds;

    private boolean isHTML;

    public MailRequest(String toEmail, String subject, String message, List<Long> documentIds, boolean isHTML) {
        this.toEmail = toEmail;
        this.subject = subject;
        this.message = message;
        this.documentIds = documentIds;
        this.isHTML = isHTML;
    }


    public MailRequest() {
    }


    public boolean isHTML() {
        return isHTML;
    }

    public void setHTML(boolean HTML) {
        isHTML = HTML;
    }
    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setDocumentIds(List<Long> documentIds) {
        this.documentIds = documentIds;
    }

    public String getToEmail() {
        return toEmail;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }

    public List<Long> getDocumentIds() {
        return documentIds;
    }
}
