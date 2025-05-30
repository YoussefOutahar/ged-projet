package ma.sir.ged.Email;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Email.MailRequests.AccountCreationMailRequest;
import ma.sir.ged.Email.MailRequests.DocumentCreationMailRequest;
import ma.sir.ged.Email.MailRequests.MailRequest;
import ma.sir.ged.Email.MailRequests.PlainTextMailRequest;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.service.impl.admin.doc.DocumentAdminServiceImpl;
import ma.sir.ged.utils.DateUtils;
import ma.sir.ged.ws.dto.DocumentDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    private final UtilisateurDao utilisateurDao;
    private final DocumentDao documentDao;
    private final DocumentAdminServiceImpl documentAdminServiceImpl;

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("yandocsolution@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    private String sanitizeFileName(String fileName) {
        // Separate the file name from its extension
        int lastDotIndex = fileName.lastIndexOf('.');

        // If there's no dot in the file name, return it as is after sanitizing
        if (lastDotIndex == -1) {
            return fileName.replaceAll("[^a-zA-Z0-9]", "_");
        }
        // Extract base name and extension
        String baseName = fileName.substring(0, lastDotIndex);
        String extension = fileName.substring(lastDotIndex); // includes the dot
        if(extension.contains(".pdf")) extension = ".pdf";

        return baseName + extension;
    }
        @Async
    public void sendMail(MailRequest request) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setFrom("yandocsolution@gmail.com");
            mimeMessageHelper.setTo(request.getToEmail());
            mimeMessageHelper.setSubject(request.getSubject());

            if (request.getDocumentIds() != null && !request.getDocumentIds().isEmpty()) {
                for (Long documentId : request.getDocumentIds()) {
                    Document document = documentDao.findById(documentId).orElse(null);
                    if (document != null) {
                        byte[] documentBytes = documentAdminServiceImpl.downloadFileFromService(document.getId(), "");
                        String fileName = sanitizeFileName(document.getReference());
                        mimeMessageHelper.addAttachment(fileName, new ByteArrayResource(documentBytes));
                    }
                }
            }

            if (request.isHTML()) {
                Context context = new Context();
            /*
            content is the variable defined in our HTML template within the div tag
            */
                context.setVariable("content", request.getMessage());
                String processedString = templateEngine.process("wonderblum", context);

                mimeMessageHelper.setText(processedString, true);
            } else {
                mimeMessageHelper.setText(request.getMessage(), false);
            }

            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Log error and provide additional context
            Logger logger = LoggerFactory.getLogger(this.getClass());
            logger.error("Failed to send email to: {}", request.getToEmail(), e);
        }
    }

    @Async
    @Transactional
    public void sendPlainTextEmail(PlainTextMailRequest request) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;
        try {
            mimeMessageHelper = new MimeMessageHelper(mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            mimeMessageHelper.setFrom("yandocsolution@gmail.com");
            mimeMessageHelper.setTo(request.getToEmail());
            mimeMessageHelper.setSubject(request.getSubject());

            if(request.isHTML()) {
                Context context = new Context();

                ClassPathResource yandocLogo = new ClassPathResource("images/logo-yandoc.png");
                InputStreamSource profilePicSource = null;

                Utilisateur sender = utilisateurDao.findById(request.getSenderId()).orElse(null);
                if (sender != null && sender.getProfilePicture() != null) {
                    byte[] profilePicBytes = sender.getProfilePicture().getImageBytes();
                    profilePicSource = new ByteArrayResource(profilePicBytes);
                }

                if (sender != null) {
                    context.setVariable("senderName", sender.getNom() + " " + sender.getPrenom());
                    context.setVariable("senderDescription", sender.getEntiteAdministrative().getLibelle());
                } else {
                    context.setVariable("senderName", "Yandoc Team");
                    context.setVariable("senderDescription", "Yandoc Solution");
                }

                // =====================================================================================================

                context.setVariable("title", request.getTitle());
                context.setVariable("content", request.getMessage());

                // =====================================================================================================

                String processedString = templateEngine.process("plain-text-mail-template", context);
                mimeMessageHelper.setText(processedString, true);

                mimeMessageHelper.addInline("logo", yandocLogo, "image/png");
                if (profilePicSource != null) {
                    mimeMessageHelper.addInline("profilePic", profilePicSource, "image/png");
                } else {
                    mimeMessageHelper.addInline("profilePic", new ClassPathResource("images/default-profile-pic.png"), "image/png");
                }

            } else {
                mimeMessageHelper.setText(request.getMessage(), false);
            }
            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Transactional
    public void sendAccountCreationMail(AccountCreationMailRequest request) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;

        try {
            mimeMessageHelper = new MimeMessageHelper(mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            mimeMessageHelper.setFrom("yandocsolution@gmail.com");
            mimeMessageHelper.setTo(request.getToEmail());
            mimeMessageHelper.setSubject(request.getSubject());

            if(request.isHTML()) {
                Context context = new Context();

                ClassPathResource yandocLogo = new ClassPathResource("images/logo-yan-2.png");
                InputStreamSource profilePicSource = null;

                Utilisateur sender = utilisateurDao.findById(request.getSenderId()).orElse(null);
                if (sender != null && sender.getProfilePicture() != null) {
                    byte[] profilePicBytes = sender.getProfilePicture().getImageBytes();
                    profilePicSource = new ByteArrayResource(profilePicBytes);
                }

                if (sender != null) {
                    context.setVariable("senderName", sender.getNom() + " " + sender.getPrenom());
                    context.setVariable("senderDescription", sender.getEntiteAdministrative().getLibelle());
                } else {
                    context.setVariable("senderName", "Yandoc Team");
                    context.setVariable("senderDescription", "Yandoc Solution");
                }


                // =====================================================================================================
                Utilisateur utilisateur = utilisateurDao.findById(request.getAccountId()).orElse(null);
                if (utilisateur != null) {
                    context.setVariable("username", utilisateur.getUsername());
                    context.setVariable("password", request.getAccountPassword());
                } else {
                    throw new RuntimeException("User not found");
                }
                // =====================================================================================================

                String processedString = templateEngine.process("Account-Creation-template", context);
                mimeMessageHelper.setText(processedString, true);

                mimeMessageHelper.addInline("logo", yandocLogo, "image/png");
                if (profilePicSource != null) {
                    mimeMessageHelper.addInline("profilePic", profilePicSource, "image/png");
                } else {
                    mimeMessageHelper.addInline("profilePic", new ClassPathResource("images/default-profile-pic.png"), "image/png");
                }
            } else {
                mimeMessageHelper.setText(request.getMessage(), false);
            }
            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Transactional
    public void sendDocumentCreationMail(DocumentCreationMailRequest request) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;

        try {
            mimeMessageHelper = new MimeMessageHelper(mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            mimeMessageHelper.setFrom("yandocsolution@gmail.com");
            mimeMessageHelper.setTo(request.getToEmail());
            mimeMessageHelper.setSubject(request.getSubject());

            if(request.isHTML()) {
                Context context = new Context();

                ClassPathResource yandocLogo = new ClassPathResource("images/logo-yan-2.png");
                InputStreamSource profilePicSource = null;

                Utilisateur sender = utilisateurDao.findById(request.getSenderId()).orElse(null);
                if (sender != null && sender.getProfilePicture() != null) {
                    byte[] profilePicBytes = sender.getProfilePicture().getImageBytes();
                    profilePicSource = new ByteArrayResource(profilePicBytes);
                }

                if (sender != null) {
                    context.setVariable("senderName", sender.getNom() + " " + sender.getPrenom());
                    context.setVariable("senderDescription", sender.getEntiteAdministrative().getLibelle());
                } else {
                    context.setVariable("senderName", "Yandoc Team");
                    context.setVariable("senderDescription", "Yandoc Solution");
                }

                // =====================================================================================================
                Document document = documentDao.findById(request.getDocumentId()).orElse(null);
                if (document != null) {
                    context.setVariable("documentName", document.getReference() != null && !document.getReference().isEmpty() ? document.getReference() : "N/A");
                    context.setVariable("documentDescription", document.getDocumentType().getLibelle() != null && !document.getDocumentType().getLibelle().isEmpty() ? document.getDocumentType().getLibelle() : "N/A");
                    context.setVariable("documentCreationDate", document.getCreatedOn() != null ? DateUtils.format(document.getCreatedOn().toLocalDate(),"dd/MM/yyyy") : "N/A");
                    context.setVariable("documentCategorie", document.getDocumentCategorie().getLibelle() != null && !document.getDocumentCategorie().getLibelle().isEmpty() ? document.getDocumentCategorie().getLibelle() : "N/A");
                    context.setVariable("documentPlanClassement", document.getPlanClassement().getLibelle() != null && !document.getPlanClassement().getLibelle().isEmpty() ? document.getPlanClassement().getLibelle() : "N/A");
                } else {
                    throw new RuntimeException("Document not found");
                }
                // =====================================================================================================

                String processedString = templateEngine.process("Document-Creation-template", context);
                mimeMessageHelper.setText(processedString, true);

                mimeMessageHelper.addInline("logo", yandocLogo, "image/png");
                if (profilePicSource != null) {
                    mimeMessageHelper.addInline("profilePic", profilePicSource, "image/png");
                } else {
                    mimeMessageHelper.addInline("profilePic", new ClassPathResource("images/default-profile-pic.png"), "image/png");
                }
            } else {
                mimeMessageHelper.setText(request.getMessage(), false);
            }
            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
