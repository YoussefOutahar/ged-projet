package ma.sir.ged.zynerator.util;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.service.impl.admin.doc.IndexationService;
import ma.sir.ged.ws.converter.DocumentConverter;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Arrays;

public class ElasticSearchUtils {

    public static Document updateElasticSearch(Document savedDocument, IndexationService indexationService, DocumentConverter converter) {
        try {
            System.out.println("Contacting ElasticSearch MS");
            savedDocument.setElasticId(indexationService.createIndexAndGetElasticId(converter.toDto(savedDocument)));
            System.out.println("elastic search id : " + savedDocument.getElasticId());
        } catch (HttpClientErrorException exception) {
            System.out.println("Exception has been thrown while calling ElasticSearch " + Arrays.toString(exception.getStackTrace()));
        }
        return  savedDocument;
    }

}
