package ma.sir.ged.ws.dto;

import java.util.List;

public class EchantillonRequestDto {
    private String nomEchantillon;
    private List<DocumentDto> documents;

    public String getNomEchantillon() {
        return nomEchantillon;
    }

    public void setNomEchantillon(String nomEchantillon) {
        this.nomEchantillon = nomEchantillon;
    }

    public List<DocumentDto> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentDto> documents) {
        this.documents = documents;
    }
}
