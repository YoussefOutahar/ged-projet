package com.example.demo.ws;

import com.example.demo.model.index.DocumentData;
import com.example.demo.service.DocumentDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@RestController
@RequestMapping("/api/elastic-documents")
@Slf4j
public class DocumentDataController {
    @Autowired
     DocumentDataService documentService;


    // Create a new document
    @PostMapping
    public ResponseEntity<DocumentData> createDocument(@RequestBody DocumentData document) {
        try {
            log.info("creating a new document data  : {}", document);
            DocumentData createdDocument = documentService.saveDocument(document);
            return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("error while creating a the new document.\n error : {}\ncause : {}",
                    e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // Retrieve a document by id
    @GetMapping("/{id}")
    public ResponseEntity<DocumentData> getDocumentById(@PathVariable String id) {
        try {
            log.info("getting document with the id : {}", id);
            DocumentData document = documentService.findDocumentById(id);
            if (document != null) {
                return new ResponseEntity<>(document, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("error while getting a the document.\n error : {}\ncause : {}",
                    e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }

    // Update an existing document
    @PutMapping("/{id}")
    public ResponseEntity<DocumentData> updateDocument(@PathVariable String id, @RequestBody DocumentData document) {
        try {
            log.info("updating the document with the id : {}\nthe new value : {}", id, document);
            DocumentData existingDocument = documentService.findDocumentById(id);
            if (existingDocument != null) {
                // Assuming you have a method to update the fields of the document
                if(isNull(existingDocument.getId()) || isNull(document.getId())){
                    existingDocument.setId(id);
                    document.setId(id);
                }
                DocumentData updatedDocument = documentService.saveDocument(document);
                return new ResponseEntity<>(updatedDocument, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("error while updating the document.\n error : {}\n cause : {}",
                    e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // Delete a document
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String id) {
        try {
            log.info("deleting the document with the id : {}", id);
            DocumentData existingDocument = documentService.findDocumentById(id);
            if (existingDocument != null) {
                documentService.deleteDocument(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("error while deleting the document.\n error : {}\n cause : {}",
                    e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // List all documents
    @GetMapping
    public ResponseEntity<List<DocumentData>> getAllDocuments() {
        try {
            log.info("getting the the documents \n");
            List<DocumentData> documents = documentService.findAllDocuments();
            log.info("Found : {} element{}", documents.size(), documents.size() > 1 ? "s" : "");
            return new ResponseEntity<>(documents, HttpStatus.OK);
        } catch (Exception e) {
            log.error("error while getting all documents.\n error : {}\n cause : {}",
                    e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }

    @GetMapping("/search")
    public ResponseEntity<Page<DocumentData>> searchDocuments(
            @RequestParam("keyword") String keyword,
            Pageable pageable) {
        try {
            log.info("search with pagination the document that having the keyword : {}", keyword);
            return new ResponseEntity<>(documentService.searchDocuments(keyword, pageable), HttpStatus.OK);
        } catch (Exception e) {
            log.error("error while searching with pagination the document that having the keyword : {} .\n error : {}\ncause : {}",
                    keyword, e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }

    @GetMapping("/search-ids")
    public ResponseEntity<List<Long>> searchDocumentIds(@RequestParam("keyword") String keyword) {
        try {
            log.info("searching the ids of the documents having the keyword : {}", keyword);
            return new ResponseEntity<>(documentService.searchDocuments(keyword).stream()
                    .filter(DocumentData::hasOriginalId)
                    .map(DocumentData::getOriginalId)
                    .distinct().toList(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("error while searching the ids of the documents having the keyword : {}.\n error : {}\n cause : {}",
                    keyword, e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }
    @GetMapping("/search-index-ids")
    public ResponseEntity<List<Long>> searchIndexDocumentIds(@RequestParam("keyword") String keyword) {
        try {
            log.info("searching the ids of the documents having the keyword in documentIndex: {}", keyword);
            return new ResponseEntity<>(documentService.searchIndexDocumentIds(keyword).stream()
                    .filter(DocumentData::hasOriginalId)
                    .map(DocumentData::getOriginalId)
                    .distinct().toList(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("error while searching the ids of the documents having the keyword : {}.\n error : {}\n cause : {}",
                    keyword, e.getMessage(), e.getStackTrace());
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }
}
