package ma.sir.ged.ws.converter.parapheur;

import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.history.ParapheurBoHistory;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.ParapheurDto;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ParapheurConverter extends AbstractConverter<ParapheurBo, ParapheurDto, ParapheurBoHistory> {

    @Autowired
    DocumentConverter converter;
    @Autowired
    UtilisateurConverter utilisateurConverter;
    public ParapheurConverter(){
        super(ParapheurBo.class, ParapheurDto.class, ParapheurBoHistory.class);
        init(true);
    }

    public ParapheurDto convertToParapheurDto(ParapheurBo parapheurBo) {
        try {
            ParapheurDto parapheurDto = new ParapheurDto();
            parapheurDto.setId(parapheurBo.getId());
            parapheurDto.setTitle(parapheurBo.getTitle());
            parapheurDto.setParapheurEtat(parapheurBo.getParapheurEtat().toValue());
            parapheurDto.setUtilisateur(utilisateurConverter.toDto(parapheurBo.getUtilisateur()));
            parapheurDto.setDeleted(parapheurBo.getDeleted());
            parapheurDto.setCreatedBy(parapheurBo.getCreatedBy());
            parapheurDto.setCreatedOn(parapheurBo.getCreatedOn().format(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm")));
//            converter.init(true);
//            List<DocumentSummaryDto> documents = parapheurBo.getDocuments().stream()
//                    .map(docSummary -> {
//                        DocumentSummaryDto document = converter.toSummaryDto(docSummary);
//                        return document;
//                    })
//                    .collect(Collectors.toList());
//
//            parapheurDto.setDocuments(documents);
            List<UtilisateurDto> users = parapheurBo.getUtilisateurs().stream()
                    .map(user -> {
                        UtilisateurDto utilisateur = utilisateurConverter.toDto(user);
                        return utilisateur;
                    })
                    .collect(Collectors.toList());
            parapheurDto.setUtilisateurDtos(users);
            return parapheurDto;
        } catch (Exception e) {
            e.printStackTrace();
            return new ParapheurDto();
        }
    }

//    public ParapheurBo convertToParapheurBo(ParapheurDto parapheurDto) {
//        try{
//            ParapheurBo parapheurBo = new ParapheurBo();
//            parapheurBo.setId(parapheurDto.getId());
//            parapheurBo.setTitle(parapheurDto.getTitle());
//            parapheurBo.setDeleted(parapheurDto.getDeleted());
//            parapheurBo.setCreatedBy(parapheurDto.getCreatedBy());
//
//            parapheurBo.setCreatedOn(DateUtil.stringEnToDate(parapheurDto.getCreatedOn()));
//            parapheurBo.setParapheurEtat(ParapheurEtat.forValue(parapheurDto.getParapheurEtat()));
//            converter.init(true);
//            List<Document> documents = parapheurDto.getDocuments().stream()
//                    .map(docSummary -> {
//                        Document document = converter.toItem(docSummary);
//                        return document;
//                    })
//                    .collect(Collectors.toList());
//
//            parapheurBo.setDocuments(documents);
//            return parapheurBo;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ParapheurBo();
//        }
//    }

    @Override
    public ParapheurBo toItem(ParapheurDto dto) {
        return null;
    }

    @Override
    public ParapheurDto toDto(ParapheurBo item) {
        return null;
    }
}
