package ma.sir.ged.ws.converter.BureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.ActionCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.StatutIntervention;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.bureauOrdre.ActionsRepository;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.BureauOrdre.IntervenantsCourrielDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class IntervenantsCourrielConverter {

    @Autowired
    private UtilisateurDao utilisateurDao;

    @Autowired
    private UtilisateurConverter utilisateurConverter;

    @Autowired
    private ActionsRepository actionsRepository;

    @Autowired
    private DocumentConverter documentConverter;

    public IntervenantsCourriel toEntity(IntervenantsCourrielDto dto) {
        if (dto == null) {
            return null;
        }
        IntervenantsCourriel entity = new IntervenantsCourriel();
        entity.setId(dto.getId());
        entity.setDone(dto.isDone());
        entity.setCommentaire(dto.getCommentaire());

        entity.setDateCreation(Optional.ofNullable(dto.getDateCreation())
                .filter(date -> !date.isEmpty())
                .map(date -> ZonedDateTime.parse(date, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime())
                .orElse(null));

        entity.setDateIntervention(Optional.ofNullable(dto.getDateIntervention())
                .filter(date -> !date.isEmpty())
                .map(date -> ZonedDateTime.parse(date, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime())
                .orElse(null));

        entity.setStatut(Optional
                .ofNullable(dto.getStatut())
                .map(StatutIntervention::valueOf)
                .orElse(StatutIntervention.EN_ATTENTE));

        entity.setAction(actionsRepository.findByLibelle(dto.getAction()));

        if(dto.getIntervenant() != null) {
            Utilisateur intervenant = utilisateurDao.findByUsername(dto.getIntervenant().getUsername());
            entity.setIntervenant(intervenant);
        }

        List<Utilisateur> responsables = new ArrayList<>();
        for (int i = 0; i < dto.getResponsables().size(); i++) {
            Utilisateur responsable = utilisateurDao.getOne(dto.getResponsables().get(i).getId());
            responsables.add(responsable);
        }
        entity.setResponsables(responsables);

        //TODO: to be reviewed
        if(dto.getCreatedBy() != null && dto.getCreatedBy().getId() != null){
            entity.setCreatedBy(dto.getCreatedBy().getId());
        }

        if(dto.getDocuments() != null && !dto.getDocuments().isEmpty()){
            entity.setDocuments(new ArrayList<>());
            dto.getDocuments().forEach(documentDto -> {
                entity.getDocuments().add(documentConverter.toItem(documentDto));
            });
        }


        return entity;
    }

    public IntervenantsCourrielDto toDto(IntervenantsCourriel entity) {
        if (entity == null) {
            return null;
        }
        IntervenantsCourrielDto dto = new IntervenantsCourrielDto();
        dto.setId(entity.getId());
        dto.setDone(entity.isDone());
        dto.setCommentaire(entity.getCommentaire());

        dto.setDateCreation(Optional.ofNullable(entity.getDateCreation())
                .map(date -> date.atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                .orElse(null));

        dto.setDateIntervention(Optional.ofNullable(entity.getDateIntervention())
                .map(date -> date.atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                .orElse(null));

        dto.setStatut(Optional.of(entity)
                .map(IntervenantsCourriel::getStatut)
                .map(StatutIntervention::name)
                .orElse(StatutIntervention.EN_ATTENTE.toValue()));

        if (entity.getAction() != null) {
            dto.setAction(entity.getAction().getLibelle());
        }

        dto.setResponsables(utilisateurConverter.toDto(entity.getResponsables()));
        dto.setIntervenant(utilisateurConverter.toDto(entity.getIntervenant()));

        //TODO: to be reviewed
        if( utilisateurDao.existsById(entity.getCreatedBy())){
            dto.setCreatedBy(utilisateurConverter.toDto(utilisateurDao.getOne(entity.getCreatedBy())));
        }

        if(entity.getDocuments() != null && !entity.getDocuments().isEmpty()){
            dto.setDocuments(new ArrayList<>());
            entity.getDocuments().forEach(document -> {
                dto.getDocuments().add(documentConverter.toDto(document));
            });
        }

        return dto;
    }

}
