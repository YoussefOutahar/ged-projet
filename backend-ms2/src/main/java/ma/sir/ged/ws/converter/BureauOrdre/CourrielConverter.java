package ma.sir.ged.ws.converter.BureauOrdre;


import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.PlanClassementBO;
import ma.sir.ged.bean.core.bureauOrdre.enums.*;
import ma.sir.ged.bean.core.bureauOrdre.EtablissementBo;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.dao.facade.core.bureauOrdre.EtablissementRepository;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.service.facade.bo.PlanClassementBoService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.EntiteAdministrativeConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import ma.sir.ged.ws.dto.BureauOrdre.IntervenantsCourrielDto;
import ma.sir.ged.ws.dto.DocumentDto;

import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
public class CourrielConverter {

    @Autowired
    private EtablissementConverter etablissementConverter;

    @Autowired
    private EtablissementRepository etablissementRepository;

    @Autowired
    private EntiteAdministrativeDao entiteAdministrativeDao;

    @Autowired
    private EntiteAdministrativeConverter entiteAdministrativeConverter;

    @Autowired
    private IntervenantsCourrielConverter intervenantsCourrielConverter;

    @Autowired
    private PlanClassementBoService planClassementBoService;

    @Autowired
    private PlanClassemementBOConverter planClassemementBOConverter;

    @Autowired
    private DocumentConverter documentConverter;

    @Autowired
    private CourrielsRepository courrielBoRepository;

    public CourrielBo toEntity(CourrielDto dto) {

        documentConverter.initList(true);

        CourrielBo courriel = new CourrielBo();

        courriel.setSujet(dto.getSujet());
        courriel.setNumeroCourrielExterne(dto.getNumeroCourrielExterne());
        courriel.setDateReception(ZonedDateTime.parse(dto.getDateReception(), DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime());
        courriel.setDateEcheance(ZonedDateTime.parse(dto.getDateEcheance(), DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime());

        courriel.setNumeroRegistre(dto.getNumeroRegistre());
        courriel.setNumeroCourrier(dto.getNumeroCourriel());
        courriel.setDeleted(dto.getDeleted());

        courriel.setVoieEnvoi(VoieEnvoi.valueOf(dto.getVoieEnvoi()));
        courriel.setEtatAvancement(CourrielBoEtatAvancement.valueOf(dto.getEtatAvancement()));
        courriel.setPriorite(CourrielBoPriorite.valueOf(dto.getPriorite()));
        courriel.setConfidentialite(ConfidentialiteBO.valueOf(dto.getConfidentialite()));

        if (Objects.nonNull(dto.getPlanClassement())) {
            PlanClassementBO planClassementBO = planClassementBoService.findById(dto.getPlanClassement().getId());
            if (Objects.nonNull(planClassementBO)) {
                courriel.setPlanClassement(planClassementBO);
            }
        }

        EtablissementBo etablissementBo = etablissementRepository.findById(dto.getEntiteExterne().getId()).orElse(null);
        if (Objects.nonNull(etablissementBo)) {
            courriel.setEntiteExterne(etablissementBo);
        }

        EntiteAdministrative entiteAdministrative = entiteAdministrativeDao.findByCode(dto.getEntiteInterne().getCode());
        if (Objects.nonNull(entiteAdministrative)) {
            courriel.setEntiteInterne(entiteAdministrative);
        }

        List<IntervenantsCourriel> intervenants = new ArrayList<>();
        if (dto.getIntervenants() != null) {
            dto.getIntervenants().forEach(intervenantsCourrielDto -> {
                IntervenantsCourriel intervenant = intervenantsCourrielConverter.toEntity(intervenantsCourrielDto);
                intervenants.add(intervenant);
            });

            courriel.setIntervenants(intervenants);
        }

        List<Document> courrielDocs = new ArrayList<>();
        dto.getDocuments().forEach(documentDto -> {
            Document document = documentConverter.toItem(documentDto);
            courrielDocs.add(document);
        });
        courriel.setDocuments(courrielDocs);

        courriel.setType(TypeCourriel.valueOf(dto.getType()));
        if (dto.getReponse() != null) {
            courriel.setReponse(toEntity(dto.getReponse()));
        }
        if (dto.getComplement() != null) {
            courriel.setComplement(toEntity(dto.getComplement()));
        }

        if (Objects.nonNull(dto.getPereId()) && dto.getPereId() != 0) {
            CourrielBo pere = courrielBoRepository.findById(dto.getPereId()).orElseThrow(() -> new EntityNotFoundException("in CourrielConverter: Courriel avec l'ID " + dto.getPereId() + " n'a pas été trouvé."));
            courriel.setPere(pere);
        }

        return courriel;
    }
    
    public CourrielDto toDto(CourrielBo entity) {

        CourrielDto dto = new CourrielDto();

        dto.setId(entity.getId());
        dto.setSujet(entity.getSujet());
        dto.setNumeroCourrielExterne(entity.getNumeroCourrielExterne());
        dto.setDateReception(entity.getDateReception().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        dto.setDateEcheance(entity.getDateEcheance().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        dto.setNumeroRegistre(entity.getNumeroRegistre());
        dto.setNumeroCourriel(entity.getNumeroCourrier());
        dto.setDeleted(entity.isDeleted());

        dto.setVoieEnvoi(Optional.of(entity)
                .map(CourrielBo::getVoieEnvoi)
                .map(Enum::name)
                .orElse(""));
        dto.setPriorite(Optional.of(entity)
                .map(CourrielBo::getPriorite)
                .map(Enum::name)
                .orElse(""));

        dto.setEtatAvancement(Optional.of(entity)
                .map(courrielBo -> courrielBo.getEtatAvancement())
                .map(courrielBoEtatAvancement -> courrielBoEtatAvancement.name())
                .orElse(""));

        dto.setConfidentialite(Optional.of(entity)
                .map(CourrielBo::getConfidentialite)
                .map(Enum::name)
                .orElse(""));

        PlanClassementBO planClassementBO = entity.getPlanClassement();
        if(Objects.nonNull(planClassementBO)){
            dto.setPlanClassement(planClassemementBOConverter.toDto(planClassementBO));
        }

        EtablissementBo etablissementBo = entity.getEntiteExterne();
        if(Objects.nonNull(etablissementBo)){
            dto.setEntiteExterne(etablissementConverter.toDto(etablissementBo));
        }

        EntiteAdministrative entiteAdministrative = entity.getEntiteInterne();
        if(Objects.nonNull(entiteAdministrative)) {
            dto.setEntiteInterne(entiteAdministrativeConverter.toDto(entiteAdministrative));
        }

        List<IntervenantsCourriel> intervenants = entity.getIntervenants();
        if(Objects.nonNull(intervenants) && !intervenants.isEmpty()) {
            List<IntervenantsCourrielDto> intervenantsDto = new ArrayList<>();
            intervenants.forEach(intervenantsCourriel -> {
                intervenantsDto.add(intervenantsCourrielConverter.toDto(intervenantsCourriel));
            });
            dto.setIntervenants(intervenantsDto);
        }

        List<Document> documents = entity.getDocuments();
        List<DocumentDto> documentsDto = new ArrayList<>();
        documents.forEach(document -> {
            documentsDto.add(documentConverter.toDto(document));
        });

        dto.setDocuments(documentsDto);

        dto.setType(Optional.ofNullable(entity)
                .map(CourrielBo::getType)
                .map(Enum::name)
                .orElse(""));
        if(entity.getReponse() != null){
            dto.setReponse(toDto(entity.getReponse()));
        }
        if(entity.getComplement() != null){
            dto.setComplement(toDto(entity.getComplement()));
        }

        if(Objects.nonNull(entity.getPere())){
            dto.setPereId(entity.getPere().getId());
        }

        return dto;
    }

}
