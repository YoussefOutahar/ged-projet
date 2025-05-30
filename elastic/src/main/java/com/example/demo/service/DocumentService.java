package com.example.demo.service;

import com.example.demo.criteria.DocumentCriteria;
import com.example.demo.model.DocumentFile;
import com.example.demo.repository.DocumentRepository;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.client.erhlc.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.client.erhlc.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class DocumentService extends AbstractService {

    @Autowired
    public DocumentService(RestHighLevelClient elasticsearchClient) {
    }

    public SearchHits<DocumentFile> searchDocuments(DocumentCriteria criteria) {
        return null;
    }


    public String extractTextFromDocument(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            BodyContentHandler handler = new BodyContentHandler();
            Metadata metadata = new Metadata();
            Parser parser = new AutoDetectParser();
            ParseContext parseContext = new ParseContext();
            parser.parse(inputStream, handler, metadata, parseContext);
            return handler.toString();
        } catch (Exception e) {
            // Handle extraction errors
            e.printStackTrace();
            return null;
        }
    }

    public void indexDocument(DocumentFile document) {
    }
}
