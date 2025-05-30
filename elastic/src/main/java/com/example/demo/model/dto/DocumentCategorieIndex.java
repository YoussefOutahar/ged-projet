package com.example.demo.model.dto;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
public class DocumentCategorieIndex {
    @Field(type = FieldType.Nested)
    private IndexElement indexElement;
}
