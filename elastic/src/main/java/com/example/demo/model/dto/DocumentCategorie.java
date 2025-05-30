package com.example.demo.model.dto;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Data
public class DocumentCategorie {
    private String code;
    private String libelle;
    @Field(type = FieldType.Nested)
    private List<DocumentCategorieIndex> documentCategorieIndexs;
}
