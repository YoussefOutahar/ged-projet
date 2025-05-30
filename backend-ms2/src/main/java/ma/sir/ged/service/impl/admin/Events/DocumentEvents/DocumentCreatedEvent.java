package ma. sir.ged.service.impl.admin.Events.DocumentEvents;

import org.springframework.context.ApplicationEvent;

public class DocumentCreatedEvent extends ApplicationEvent {
    private final Long documentId;
    private final Long documentCategoryId;

    public DocumentCreatedEvent(Object source, Long documentId, Long documentCategoryId) {
        super(source);
        this.documentId = documentId;
        this.documentCategoryId = documentCategoryId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public Long getDocumentCategoryId() {
        return documentCategoryId;
    }
}