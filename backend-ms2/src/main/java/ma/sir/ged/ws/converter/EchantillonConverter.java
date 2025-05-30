package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.doc.Echantillon;
import ma.sir.ged.bean.history.EchantillonHistory;
import ma.sir.ged.ws.dto.EchantillonDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.StringUtil;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EchantillonConverter extends AbstractConverter<Echantillon, EchantillonDto, EchantillonHistory> {
    private boolean documents;
    DocumentConverter converter;

    public  EchantillonConverter(){
        super(Echantillon.class, EchantillonDto.class, EchantillonHistory.class);
        init(true);
    }
    @Override
    public Echantillon toItem(EchantillonDto dto) {
        Echantillon item = new Echantillon();
        item.setId(dto.getId());
        item.setNomEchantillon(dto.getNomEchantillon());
        if (this.documents && dto.getDocumentsId() != null)
            item.setDocuments(converter.toItem(dto.getDocuments()));
        return item;
    }

    @Override
    public EchantillonDto toDto(Echantillon item) {

        EchantillonDto dto = new EchantillonDto();
        dto.setId(item.getId());
        dto.setNomEchantillon(item.getNomEchantillon());
        if(this.documents && item.getDocuments()!=null) {
            this.setDocuments(false);
            dto.setDocuments(converter.toDto(item.getDocuments()));
            this.setDocuments(true);
        }
        return dto;
    }
    public EchantillonDto convertEchantillonToDto(Echantillon echantillon) {
        EchantillonDto echantillonDto = new EchantillonDto();
        echantillonDto.setId(echantillon.getId());
        echantillonDto.setNomEchantillon(echantillon.getNomEchantillon());
        echantillonDto.setEchantillonState(String.valueOf(echantillon.getEchantillonState()));
        echantillonDto.setNote(echantillon.getNote());
        List<Long> documentIds = new ArrayList<>();
        for (Document document : echantillon.getDocuments()) {
            documentIds.add(document.getId());
        }
        echantillonDto.setDocumentsId(documentIds);

        return echantillonDto;
    }

    public boolean isDocuments() {
        return documents;
    }

    public void setDocuments(boolean documents) {
        this.documents = documents;
    }
}
