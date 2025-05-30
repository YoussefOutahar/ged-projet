package ma.sir.ged.ws.dto.indexation;

public class DocumentIndexElementIndex {
    private String value;
    private String description;
    private IndexElementIndex indexElement;

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

    public IndexElementIndex getIndexElement() {
        return indexElement;
    }

    public void setIndexElement(IndexElementIndex indexElement) {
        this.indexElement = indexElement;
    }
}
