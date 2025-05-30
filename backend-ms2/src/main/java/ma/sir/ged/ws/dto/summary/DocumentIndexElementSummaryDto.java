package ma.sir.ged.ws.dto.summary;

import com.fasterxml.jackson.annotation.JsonInclude;
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentIndexElementSummaryDto {
        private String value  ;
        private String description  ;

        private Long indexElementId ;
        private Long documentId ;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getIndexElementId() {
        return indexElementId;
    }

    public void setIndexElementId(Long indexElementId) {
        this.indexElementId = indexElementId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }
}
