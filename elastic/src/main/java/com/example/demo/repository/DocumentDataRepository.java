package com.example.demo.repository;


import com.example.demo.model.index.DocumentData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentDataRepository extends ElasticsearchRepository<DocumentData, String> {
    Page<DocumentData> findByContentContaining(String keyword, Pageable pageable);
    List<DocumentData> findByContentContaining(String keyword);
    Page<DocumentData> findByDocumentIndexElementsValueContaining(String value, Pageable pageable);
    List<DocumentData> findByDocumentIndexElementsValueContaining(String value);
}