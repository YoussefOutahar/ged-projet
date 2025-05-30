package ma.sir.ged.ws.converter.BureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.dao.facade.core.bureauOrdre.IntervenantsCourrielRepository;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielHistoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Component
public class CourrielHistoryConverter {

    @Autowired
    private CourrielsRepository courrielsRepository;

    @Autowired
    private CourrielConverter courrielConverter;

    @Autowired
    private UtilisateurDao utilisateurDao;

    @Autowired
    private UtilisateurConverter utilisateurConverter;

    @Autowired
    private IntervenantsCourrielRepository intervenantsCourrielRepository;

    @Autowired
    private IntervenantsCourrielConverter intervenantsCourrielConverter;

    public CourrielHistoryDto toDto(CourrielHistory entity) {
        if (entity == null) {
            return null;
        } else {
            CourrielHistoryDto dto = new CourrielHistoryDto();
            dto.setId(entity.getId());
            dto.setMessage(entity.getMessage());

            dto.setType(Optional.of(entity)
                    .map(CourrielHistory::getType)
                    .map(Enum::name)
                    .orElse(""));

            dto.setDateAction(entity.getDateAction().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

            dto.setInitiator(utilisateurConverter.toDto(entity.getInitiator()));
            dto.setCourriel(courrielConverter.toDto(entity.getCourriel()));

            dto.setIntervenant(intervenantsCourrielConverter.toDto(entity.getIntervenant()));


            return dto;
        }
    }

    public CourrielHistory toEntity(CourrielHistoryDto dto) {
        if (dto == null) {
            return null;
        } else {
            CourrielHistory entity = new CourrielHistory();
            entity.setId(dto.getId());
            entity.setMessage(dto.getMessage());

            entity.setType(HistoryEntryType.valueOf(dto.getType()));

            entity.setDateAction(ZonedDateTime.parse(dto.getDateAction(), DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime());

            if(dto.getInitiator() != null) {
                Utilisateur initiator = utilisateurDao.findByUsername(dto.getInitiator().getUsername());
                entity.setInitiator(initiator);
            }

            if(dto.getCourriel() != null) {
                CourrielBo courriel = courrielsRepository.findById(dto.getCourriel().getId()).orElse(null);
                entity.setCourriel(courriel);
            }

            if(dto.getIntervenant() != null) {
                entity.setIntervenant(intervenantsCourrielRepository.findById(dto.getIntervenant().getId()).orElse(null));
            }

            return entity;
        }
    }

}
