package ma.sir.ged.ws.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)

public class EchantillonDto extends AuditBaseDto {
    public String nomEchantillon;
    public String echantillonState;
    public String note;
    public List<Long> documentsId;
    public List<DocumentDto> documents;
    public EchantillonDto(){
        super();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomEchantillon() {
        return nomEchantillon;
    }

    public void setNomEchantillon(String nomEchantillon) {
        this.nomEchantillon = nomEchantillon;
    }

    public List<Long> getDocumentsId() {
        return documentsId;
    }

    public void setDocumentsId(List<Long> documentsId) {
        this.documentsId = documentsId;
    }
    public List<DocumentDto> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentDto> documents) {
        this.documents = documents;
    }
    public String getEchantillonState() {
        return echantillonState;
    }

    public void setEchantillonState(String echantillonState) {
        this.echantillonState = echantillonState;
    }
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
