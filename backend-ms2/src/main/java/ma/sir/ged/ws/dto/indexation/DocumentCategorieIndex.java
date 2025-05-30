package ma.sir.ged.ws.dto.indexation;

import java.util.List;

public class DocumentCategorieIndex {

    private String code;
    private String libelle;
    private List<DocumentCategorieIndexIndex> documentCategorieIndexs;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public List<DocumentCategorieIndexIndex> getDocumentCategorieIndexs() {
        return documentCategorieIndexs;
    }

    public void setDocumentCategorieIndexs(List<DocumentCategorieIndexIndex> documentCategorieIndexs) {
        this.documentCategorieIndexs = documentCategorieIndexs;
    }
}
