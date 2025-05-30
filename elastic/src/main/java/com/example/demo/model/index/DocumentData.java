package com.example.demo.model.index;

import com.example.demo.model.dto.DocumentCategorie;
import com.example.demo.model.dto.DocumentIndexElement;
import com.example.demo.model.dto.DocumentState;
import com.example.demo.model.dto.DocumentType;
import com.example.demo.model.dto.EntiteAdministrative;
import com.example.demo.model.dto.Utilisateur;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Document(indexName = "document_index")
@Data
public class DocumentData {
    @Id
    private String id;
    private Long originalId;
    private String reference;
    private String referenceGed;
    private Date uploadDate;
    private Integer annee;
    private Integer semestre;
    private Integer mois;
    private Integer jour;
    private Boolean ocr;
    private String content;
    private BigDecimal size;
    private String description;
    private Boolean archive;
    private Boolean versionne;

    @Field(type = FieldType.Nested)
    private DocumentType documentType;

    @Field(type = FieldType.Nested)
    private DocumentState documentState;

    @Field(type = FieldType.Nested)
    private DocumentCategorie documentCategorie;

    @Field(type = FieldType.Nested)
    private Utilisateur utilisateur;

    @Field(type = FieldType.Nested)
    private EntiteAdministrative entiteAdministrative;

    @Field(type = FieldType.Nested)
    private List<DocumentIndexElement> documentIndexElements;

    public boolean hasOriginalId(){
        return Objects.nonNull(this.originalId);
    }
}
