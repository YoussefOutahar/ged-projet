package ma.sir.ged.dao.facade.core.doc.listener;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.service.impl.admin.doc.IndexationService;
import ma.sir.ged.ws.converter.DocumentConverter;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;

import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import java.io.Serializable;

import static java.util.Objects.nonNull;
@Configuration
public class DocumentListener implements Serializable, ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        DocumentListener.context = applicationContext;
    }


    private IndexationService getIndexationService() {
        return context.getBean(IndexationService.class);
    }

    private DocumentConverter getDocumentConverter() {
        return context.getBean(DocumentConverter.class);
    }


    @PreUpdate
    public void preUpdate(Document document) {
        if(nonNull(document) && nonNull(document.getElasticId())){
            getIndexationService().updateIndexAndGetElasticId(getDocumentConverter().toDto(document), document.getElasticId());
            System.out.println("Update elastic search document has been executed ");
        }

    }
    @PreRemove
    public void preRemove(Document document){
        if(nonNull(document) && nonNull(document.getElasticId())){
            getIndexationService().deleteIndex(document.getElasticId());
            System.out.println("delete elastic search document has been executed ");
        }
    }
}
