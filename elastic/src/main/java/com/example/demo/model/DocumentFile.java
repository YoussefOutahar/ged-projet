package com.example.demo.model;

import com.example.demo.config.LocalDateTimeDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;

@Document(indexName = "documents")
@Data
public class DocumentFile {
    @Id
    private String id;
    private String title;
    private String content;
    private String referenceGed;
    private String reference;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @Field(type = FieldType.Date)
    private LocalDate uploadDate ;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @Field(type = FieldType.Date)
    private LocalDate dateLastUpdate ;

    private Boolean folder = false;
    private Double size ;
    private String format;

    private String description;

    private Long annee  ;
    private Long semstre  ;
    private Long mois  ;
    private Long jour  ;
    private Boolean ocr  ;

    private Boolean archive  ;

}
