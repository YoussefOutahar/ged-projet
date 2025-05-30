package ma.sir.ged.service.impl.admin.Events;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieDao;
import ma.sir.ged.service.impl.admin.Events.DocumentEvents.DocumentCreatedEvent;
import ma.sir.ged.DataExtraction.AutoIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
@RequiredArgsConstructor
public class DocumentAutoIndexListener {

    private final AutoIndexService autoIndexService;
    private final DocumentDao documentDao;
    private final DocumentCategorieDao documentCategorieDao;

    private static final String CERTIFICATE_CATEGORY = "Certificat Authorisation";

    @EventListener
    @Async("threadPoolTaskExecutor")
    public void handleDocumentCreatedEvent(DocumentCreatedEvent event) {
        Document document = documentDao.findById(event.getDocumentId()).orElse(null);
        DocumentCategorie category = documentCategorieDao.findById(event.getDocumentCategoryId()).orElse(null);

        if (document == null || category == null) return;

        Set<Utilisateur> usersToNotify = new HashSet<>();

        if (isCertificateDocument(category)) {
            log.info("Document {} is a certificate. Proceeding with auto-indexing.", document.getId());
            performAutoIndexing(document, usersToNotify);
        } else {
            log.info("Document {} is not a certificate. Skipping auto-indexing.", document.getId());
        }
    }

    private boolean isCertificateDocument(DocumentCategorie category) {
        return category != null &&
                (CERTIFICATE_CATEGORY.equalsIgnoreCase(category.getCode()) ||
                        CERTIFICATE_CATEGORY.equalsIgnoreCase(category.getLibelle()));
    }

    private void performAutoIndexing(Document document, Set<Utilisateur> usersToNotify) {
        CompletableFuture<Void> indexingFuture = autoIndexService.autoIndexCertificat(Collections.singletonList(document.getId()), usersToNotify);

        indexingFuture.exceptionally(ex -> {
            log.error("Error during auto-indexation for document {}: {}", document.getId(), ex.getMessage(), ex);
            return null;
        });
    }
}