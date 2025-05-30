package com.example.demo.service;

import com.example.demo.model.index.DocumentData;
import com.example.demo.repository.DocumentDataRepository;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class DocumentDataService {
    @Autowired
     DocumentDataRepository documentRepository;



    public DocumentData saveDocument(DocumentData document) {
        return documentRepository.save(document);
    }

    public DocumentData findDocumentById(String id) {
        return documentRepository.findById(id).orElse(null);
    }

    public void deleteDocument(String id) {
        documentRepository.deleteById(id);
    }

    public List<DocumentData> findAllDocuments() {
        List<DocumentData> documents = new ArrayList<>();
        documentRepository.findAll().forEach(documents::add);
        return documents;
    }

    public Page<DocumentData> searchDocuments(String keyword, Pageable pageable) {
        List<DocumentData> documentData = searchDocuments(keyword);
        return new PageImpl<>(documentData, pageable, documentData.size());
    }
    public List<DocumentData> searchDocuments(String keyword) {
        List<DocumentData> result = new ArrayList<>();
        if(StringUtils.isBlank(keyword))
            return result;
        String[] words = keyword.split("\\s+");
        for ( String word : words ) {
            result.addAll(documentRepository.findByContentContaining(word));
        }
        return result;
    }
    public List<DocumentData> searchIndexDocumentIds(String keyword) {
        List<DocumentData> result = new ArrayList<>();
        if(StringUtils.isBlank(keyword))
            return result;
        String[] words = keyword.split("\\s+");
        for ( String word : words ) {
            result.addAll(documentRepository.findByDocumentIndexElementsValueContaining(word));
        }
        return result;
    }
}
