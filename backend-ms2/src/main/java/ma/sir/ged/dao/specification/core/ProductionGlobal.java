package ma.sir.ged.dao.specification.core;


public class ProductionGlobal {
    private String planClassmentLibelle;
    private Long nombreDocument;
    private Long nombreDocumentIndexe;

    public ProductionGlobal(String planClassmentLibelle, Long nombreDocument, Long nombreDocumentIndexe) {
        this.planClassmentLibelle = planClassmentLibelle;
        this.nombreDocument = nombreDocument;
        this.nombreDocumentIndexe = nombreDocumentIndexe;
    }

    public ProductionGlobal() {
    }

    public String getPlanClassmentLibelle() {
        return planClassmentLibelle;
    }

    public Long getNombreDocument() {
        return nombreDocument;
    }

    public Long getNombreDocumentIndexe() {
        return nombreDocumentIndexe;
    }

    public void setPlanClassmentLibelle(String planClassmentLibelle) {
        this.planClassmentLibelle = planClassmentLibelle;
    }

    public void setNombreDocument(Long nombreDocument) {
        this.nombreDocument = nombreDocument;
    }

    public void setNombreDocumentIndexe(Long nombreDocumentIndexe) {
        this.nombreDocumentIndexe = nombreDocumentIndexe;
    }
}
