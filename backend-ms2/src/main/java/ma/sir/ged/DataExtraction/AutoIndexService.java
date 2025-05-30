package ma.sir.ged.DataExtraction;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.WebSocket.UseCases.NotificationDocument;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.bean.core.referentieldoc.IndexElement;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentIndexElementDao;
import ma.sir.ged.dao.facade.core.referentieldoc.IndexElementDao;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentIndexElementAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.IndexElementAdminService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;


@Slf4j
@Service
@AllArgsConstructor
public class AutoIndexService {

    private final DataExtractionService dataExtractionService;
    private final DocumentDao documentDao;
    private final IndexElementAdminService indexElementAdminService;
    private final IndexElementDao indexElementDao;
    private final DocumentIndexElementDao documentIndexElementDao;
    private final DocumentIndexElementAdminService documentIndexElementAdminService;
    private final NotificationDocument notificationDocument;

    @Transactional
    @Async("threadPoolTaskExecutor")
    public CompletableFuture<Void> autoIndexCertificat(List<Long> documentsIds, Set<Utilisateur> usersToNotify) {
        return CompletableFuture.runAsync(() -> {
            try {
                List<Document> documents = documentDao.findByIdIn(documentsIds);
                Optional<Map<String, Map<String, String>>> extractedData = dataExtractionService.extractCertificateData(documents);

                if (extractedData.isPresent()) {
                    indexDocuments(documents, extractedData.get());

                    notificationDocument.notifyIndexationSuccess(usersToNotify);
                } else {
                    log.warn("No data was extracted for the documents: {}", documents);
                    notificationDocument.notifyIndexationFailure(usersToNotify);
                }
            } catch (Exception e) {
                e.printStackTrace();
                notificationDocument.notifyIndexationFailure(usersToNotify);
            }
        });
    }

    private void indexDocuments(List<Document> documents, Map<String, Map<String, String>> extractedData) {
        for (Document document : documents) {
            Map<String, String> documentData = extractedData.get(document.getReference());

            if (documentData != null) {
                for (Map.Entry<String, String> entry : documentData.entrySet()) {
                    String fieldName = entry.getKey();
                    String fieldValue = entry.getValue();

                    IndexElement indexElement = getOrCreateIndexElement(fieldName);

                    DocumentIndexElement existingElement = documentIndexElementDao.findByDocumentAndIndexElement(document, indexElement);

                    if (existingElement == null) {
                        DocumentIndexElement documentIndexElement = new DocumentIndexElement();
                        documentIndexElement.setIndexElement(indexElement);
                        documentIndexElement.setDocument(document);
                        documentIndexElement.setValue(fieldValue);

                        documentIndexElementAdminService.create(documentIndexElement);
                    } else {
                        existingElement.setValue(fieldValue);
                        documentIndexElementAdminService.update(existingElement);
                    }
                }
            }
        }
    }

    private IndexElement getOrCreateIndexElement(String fieldName) {
        IndexElement indexElement = indexElementDao.findByLibelle(fieldName);
        if (indexElement == null) {
            indexElement = new IndexElement();
            indexElement.setLibelle(fieldName);
            indexElement.setCode(generateCode(fieldName));
            indexElement.setDescription("Auto-generated index element for field: " + fieldName);
            indexElement = indexElementAdminService.create(indexElement);
        }
        return indexElement;
    }

    private String generateCode(String fieldName) {
        return fieldName.toUpperCase().replaceAll("\\s+", "_");
    }
}