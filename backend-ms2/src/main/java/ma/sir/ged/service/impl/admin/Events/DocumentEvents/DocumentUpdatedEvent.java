package ma.sir.ged.service.impl.admin.Events.DocumentEvents;

import ma.sir.ged.bean.core.doc.Document;
import org.springframework.context.ApplicationEvent;

public class DocumentUpdatedEvent extends ApplicationEvent {
    private final Document document;

    public DocumentUpdatedEvent(Object source, Document document) {
        super(source);
        this.document = document;
    }

    public Document getDocument() {
        return document;
    }
}