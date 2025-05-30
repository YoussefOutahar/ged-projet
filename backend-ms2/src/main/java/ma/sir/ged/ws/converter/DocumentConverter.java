package  ma.sir.ged.ws.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ma.sir.ged.bean.core.doc.DocumentCommentaire;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieModel;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.bean.core.referentieldoc.DocumentType;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementRepository;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieModelDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentStateDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentTypeDao;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.ws.dto.DocumentCommentaireDto;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ma.sir.ged.zynerator.util.ListUtil;

import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.DateUtil;
import ma.sir.ged.bean.history.DocumentHistory;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.ws.dto.DocumentDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Component
public class DocumentConverter extends AbstractConverter<Document, DocumentDto, DocumentHistory> {
    private static final String DEFAULT_DOC_STATE_CODE = "done";
    private static final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private DocumentTypeConverter documentTypeConverter ;
    @Autowired
    private IndexElementConverter indexElementConverter ;
    @Autowired
    private EntiteAdministrativeConverter entiteAdministrativeConverter ;
    @Autowired
    private PlanClassementConverter planClassementConverter ;
    @Autowired
    private TagConverter tagConverter ;
    @Autowired
    private DocumentCategorieConverter documentCategorieConverter ;
    @Autowired
    private DocumentTagConverter documentTagConverter ;
    @Autowired
    private EchantillonConverter echantillonConverter ;
    @Autowired
    private UtilisateurConverter utilisateurConverter ;
    @Autowired
    private DocumentIndexElementConverter documentIndexElementConverter ;
    @Autowired
    private AccessShareConverter accessShareConverter ;
    @Autowired
    private DocumentPartageUtilisateurConverter documentPartageUtilisateurConverter ;
    @Autowired
    private DocumentCategorieModelConverter documentCategorieModelConverter ;
    @Autowired
    private DocumentPartageGroupeConverter documentPartageGroupeConverter ;
    @Autowired
    private GroupeConverter groupeConverter ;
    @Autowired
    private DocumentStateConverter documentStateConverter ;
    @Autowired
    private DocumentTypeDao documentTypeDao;
    @Autowired
    private DocumentStateDao documentStateDao;
    @Autowired
    private DocumentCategorieDao documentCategorieDao;
    @Autowired
    private UtilisateurDao utilisateurDao;
    @Autowired
    private EntiteAdministrativeDao entiteAdministrativeDao;

    @Autowired
    private PlanClassementRepository planClassementDao;
    @Autowired
    private DocumentCategorieModelDao documentCategorieModelDao;
    @Autowired
    private DocumentAdminService documentAdminService;

    private boolean documentType;
    private boolean documentState;
    private boolean documentCategorie;
    private boolean utilisateur;
    private boolean entiteAdministrative;

    private boolean planClassement;
    private boolean documentCategorieModel;
    private boolean documentIndexElements;
    private boolean documentPartageGroupes;
    private boolean documentPartageUtilisateurs;
    private boolean documentTags;
    private boolean echantillons;
    public  DocumentConverter(){
        super(Document.class, DocumentDto.class, DocumentHistory.class);
        init(true);
    }

    public Document toItem(DocumentSummaryDto dto){
        if(dto == null){
            return null;
        }
        Document item = new Document();
        LocalDate now = LocalDate.now();
        // default assignation
        item.setId(dto.getId());
        item.setAnnee((long) now.getYear());
        item.setSemstre(0L);
        item.setMois(now.getMonth().getValue()+1L);
        item.setJour((long) now.getDayOfMonth());
        item.setUploadDate(LocalDateTime.now());
        item.setOcr(false);
        item.setSigned(false);
        item.setParaphed(false);
        item.setContent("");
        item.setSize(BigDecimal.valueOf(0));
        item.setArchive(false);
        item.setVersionne(false);
        item.setQualityFlag(false);
        item.setQualityStatus(false);
        item.setLocked(false);
        item.setLigne(dto.getLigne());
        item.setColonne(dto.getColonne());
        item.setNumBoite(dto.getNumBoite());
        if(StringUtil.isNotEmpty(dto.getSize()))
            item.setSize(dto.getSize());

        if(StringUtil.isNotEmpty(dto.getReference()))
            item.setReference(dto.getReference());
        if(StringUtil.isNotEmpty(dto.getReferenceGed()))
            item.setReferenceGed(dto.getReferenceGed());
        if(StringUtil.isNotEmpty(dto.getUploadDate()))
            item.setUploadDate(LocalDateTime.now());
        if(StringUtil.isNotEmpty(dto.getDescription()))
            item.setDescription(dto.getDescription());

        if(StringUtil.isNotEmpty(dto.getContent()))
            item.setContent(dto.getContent());

        setDocumentFieldIfNotEmpty(
                dto.getDocumentTypeCode(),
                () -> documentTypeDao.findByCode(dto.getDocumentTypeCode()),
                item::setDocumentType,
                DocumentType.class
        );
        if (StringUtils.isNotBlank(dto.getDocumentStateCode())) {
            setDocumentFieldIfNotEmpty(
                    dto.getDocumentStateCode(),
                    () -> documentStateDao.findByCode(dto.getDocumentStateCode()),
                    item::setDocumentState,
                    DocumentState.class
            );
        }
        else{
            item.setDocumentState(documentStateDao.findByCode(DEFAULT_DOC_STATE_CODE));
        }

        if (dto.getDocumentStateId() != null) {
            item.setDocumentState(documentStateDao.findById(dto.getDocumentStateId()).orElse(documentStateDao.findByCode(DEFAULT_DOC_STATE_CODE)));
        }
        if (dto.getDocumentTypeId() != null) {
            item.setDocumentType(documentTypeDao.findById(dto.getDocumentTypeId()).orElse(null));
        }

        if (dto.getDocumentCategorieId() != null) {
            item.setDocumentCategorie(documentCategorieDao.findById(dto.getDocumentCategorieId()).orElse(null));
        }

        setDocumentFieldIfNotEmpty(
                dto.getDocumentCategorieCode(),
                () -> documentCategorieDao.findByCode(dto.getDocumentCategorieCode()),
                item::setDocumentCategorie,
                DocumentCategorie.class
        );

        setDocumentFieldIfNotEmpty(
                dto.getUtilisateurEmail(),
                () -> utilisateurDao.findByEmail(dto.getUtilisateurEmail()),
                item::setUtilisateur,
                Utilisateur.class
        );
        setDocumentFieldIfNotEmpty(
                dto.getEntiteAdministrativeCode(),
                () -> entiteAdministrativeDao.findByCode(dto.getEntiteAdministrativeCode()),
                item::setEntiteAdministrative,
                EntiteAdministrative.class
        );
        setDocumentFieldIfNotEmpty(
                dto.getPlanClassementCode(),
                () -> planClassementDao.findByCode(dto.getPlanClassementCode()),
                item::setPlanClassement,
                PlanClassement.class
        );
        if (dto.getUtilisateurId() != null) {
            Utilisateur user = utilisateurDao.findById(dto.getUtilisateurId()).orElse(null);
            item.setUtilisateur(user);
            item.setEntiteAdministrative(user.getEntiteAdministrative());
        }

        if (dto.getEntiteAdministrativeId() != null) {
            item.setEntiteAdministrative(entiteAdministrativeDao.findById(dto.getEntiteAdministrativeId()).orElse(null));
        }

        if (dto.getPlanClassementId() != null) {
            item.setPlanClassement(planClassementDao.findById(dto.getPlanClassementId()).orElse(null));
        }
        setDocumentFieldIfNotEmpty(
                dto.getDocumentCategorieModelCode(),
                () -> documentCategorieModelDao.findByCode(dto.getDocumentCategorieModelCode()),
                item::setDocumentCategorieModel,
                DocumentCategorieModel.class
        );

        if(this.documentIndexElements && ListUtil.isNotEmpty(dto.getDocumentIndexElements()))
            item.setDocumentIndexElements(documentIndexElementConverter.SummarytoItem(dto.getDocumentIndexElements()));

//        item.setDateArchivageIntermediaire(item.getUploadDate().plusYears(item.getPlanClassement().getArchiveIntermidiaireDuree()));
//        item.setDateArchivageFinale(item.getUploadDate().plusYears(item.getPlanClassement().getArchiveFinalDuree()));
        return item;
    }


    @Override
    public Document toItem(DocumentDto dto) {
        if (dto == null) {
            return null;
        } else {
        Document item = new Document();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getReference()))
                item.setReference(dto.getReference());
            if(StringUtil.isNotEmpty(dto.getReferenceGed()))
                item.setReferenceGed(dto.getReferenceGed());
            if(StringUtil.isNotEmpty(dto.getElasticId()))
                item.setElasticId(dto.getElasticId());
            if(StringUtil.isNotEmpty(dto.getUploadDate()))
                item.setUploadDate(DateUtil.stringEnToDate(dto.getUploadDate()));
            if(StringUtil.isNotEmpty(dto.getAnnee()))
                item.setAnnee(dto.getAnnee());
            if(StringUtil.isNotEmpty(dto.getSemstre()))
                item.setSemstre(dto.getSemstre());
            if(StringUtil.isNotEmpty(dto.getMois()))
                item.setMois(dto.getMois());
            if(StringUtil.isNotEmpty(dto.getJour()))
                item.setJour(dto.getJour());
            if(StringUtil.isNotEmpty(dto.getLigne()))
                item.setLigne(dto.getLigne());
            if(StringUtil.isNotEmpty(dto.getColonne()))
                item.setColonne(dto.getColonne());
            if(StringUtil.isNotEmpty(dto.getNumBoite()))
                item.setNumBoite(dto.getNumBoite());
            if(dto.getOcr() != null)
                item.setOcr(dto.getOcr());
            if(dto.getSigned() != null)
                item.setSigned(dto.getSigned());
            if(dto.getParaphed() != null)
                item.setParaphed(dto.getParaphed());
            if(StringUtil.isNotEmpty(dto.getContent()))
                item.setContent(dto.getContent());
            if(StringUtil.isNotEmpty(dto.getSize()))
                item.setSize(dto.getSize());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());
            if(dto.getArchive() != null)
                item.setArchive(dto.getArchive());

            if(dto.getArchivable() != null)
                item.setArchivable(dto.getArchivable());

            if(dto.getVersionne() != null)
                item.setVersionne(dto.getVersionne());
            if(dto.getQualityStatus() != null)
                item.setQualityStatus(dto.getQualityStatus());
            if(dto.getQualityFlag() != null)
                item.setQualityFlag(dto.getQualityFlag());
            if(dto.getLocked() != null)
                item.setLocked(dto.getLocked());

            if (StringUtil.isNotEmpty(dto.getDocumentSignatureCode())) {
                item.setDocumentSignatureCode(dto.getDocumentSignatureCode());
            }

            if(this.documentType && dto.getDocumentType()!=null &&  dto.getDocumentType().getId() != null)
                item.setDocumentType(documentTypeConverter.toItem(dto.getDocumentType())) ;

            if(this.documentState && dto.getDocumentState()!=null &&  dto.getDocumentState().getId() != null)
                item.setDocumentState(documentStateConverter.toItem(dto.getDocumentState())) ;

            if(dto.getDocumentCategorie() != null && dto.getDocumentCategorie().getId() != null){
                item.setDocumentCategorie(new DocumentCategorie());
                item.getDocumentCategorie().setId(dto.getDocumentCategorie().getId());
                item.getDocumentCategorie().setLibelle(dto.getDocumentCategorie().getLibelle());
            }

            if(this.utilisateur && dto.getUtilisateur()!=null &&  dto.getUtilisateur().getId() != null)
                item.setUtilisateur(utilisateurConverter.toItem(dto.getUtilisateur())) ;

            if(dto.getEntiteAdministrative() != null && dto.getEntiteAdministrative().getId() != null){
                item.setEntiteAdministrative(new EntiteAdministrative());
                item.getEntiteAdministrative().setId(dto.getEntiteAdministrative().getId());
                item.getEntiteAdministrative().setLibelle(dto.getEntiteAdministrative().getLibelle());
            }

            if(dto.getPlanClassement() != null && dto.getPlanClassement().getId() != null){
                item.setPlanClassement(new PlanClassement());
                item.getPlanClassement().setId(dto.getPlanClassement().getId());
                item.getPlanClassement().setLibelle(dto.getPlanClassement().getLibelle());
            }

            if(this.documentCategorieModel && dto.getDocumentCategorieModel()!=null &&  dto.getDocumentCategorieModel().getId() != null)
                item.setDocumentCategorieModel(documentCategorieModelConverter.toItem(dto.getDocumentCategorieModel())) ;


            if(this.documentIndexElements && ListUtil.isNotEmpty(dto.getDocumentIndexElements()))
                item.setDocumentIndexElements(documentIndexElementConverter.toItem(dto.getDocumentIndexElements()));
            if(this.documentPartageGroupes && ListUtil.isNotEmpty(dto.getDocumentPartageGroupes()))
                item.setDocumentPartageGroupes(documentPartageGroupeConverter.toItem(dto.getDocumentPartageGroupes()));
            if(this.documentPartageUtilisateurs && ListUtil.isNotEmpty(dto.getDocumentPartageUtilisateurs()))
                item.setDocumentPartageUtilisateurs(documentPartageUtilisateurConverter.toItem(dto.getDocumentPartageUtilisateurs()));
            if(this.documentTags && ListUtil.isNotEmpty(dto.getDocumentTags()))
                item.setDocumentTags(documentTagConverter.toItem(dto.getDocumentTags()));
            if(this.echantillons && ListUtil.isNotEmpty(dto.getEchantillons()))
                item.setEchantillons(echantillonConverter.toItem(dto.getEchantillons()));

            if (dto.getDocumentSignatureCode() != null) {
                item.setDocumentSignatureCode(dto.getDocumentSignatureCode());
            }
            return item;
        }
    }

    public Document toItem(String dto){
        if (dto == null || dto.isEmpty()) {
            return null;
        } else {
            if (isDocumentSummaryDto(dto)) {
                try {
                    DocumentSummaryDto documentSummaryDto = mapper.readValue(dto, DocumentSummaryDto.class);
                    return toItem(documentSummaryDto);
                } catch (JsonProcessingException e) {
                    return null;
                }
            } else if (isDocumentDto(dto)) {
                try {
                    DocumentDto documentDto = mapper.readValue(dto, DocumentDto.class);
                    return toItem(documentDto);
                } catch (JsonProcessingException e) {
                    return null;
                }
            } else {
                return null;
            }
        }
    }

    @Override
    public DocumentDto toDto(Document item) {
        if (item == null) {
            return null;
        } else {
            DocumentDto dto = new DocumentDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getReference()))
                dto.setReference(item.getReference());
            if(StringUtil.isNotEmpty(item.getReferenceGed()))
                dto.setReferenceGed(item.getReferenceGed());
            if(StringUtil.isNotEmpty(item.getElasticId()))
                dto.setElasticId(item.getElasticId());
            if(item.getUploadDate()!=null)
                dto.setUploadDate(DateUtil.dateTimeToString(item.getUploadDate()));
            if(StringUtil.isNotEmpty(item.getAnnee()))
                dto.setAnnee(item.getAnnee());
            if(StringUtil.isNotEmpty(item.getSemstre()))
                dto.setSemstre(item.getSemstre());
            if(StringUtil.isNotEmpty(item.getMois()))
                dto.setMois(item.getMois());
            if(StringUtil.isNotEmpty(item.getJour()))
                dto.setJour(item.getJour());
            if(StringUtil.isNotEmpty(item.getLigne()))
                dto.setLigne(item.getLigne());
            if(StringUtil.isNotEmpty(item.getColonne()))
                dto.setColonne(item.getColonne());
            if(StringUtil.isNotEmpty(item.getNumBoite()))
                dto.setNumBoite(item.getNumBoite());
            dto.setOcr(item.getOcr());
            dto.setSigned(item.getSigned());
            dto.setParaphed(item.getParaphed());
            if(StringUtil.isNotEmpty(item.getContent()))
                dto.setContent(item.getContent());
            if(StringUtil.isNotEmpty(item.getSize()))
                dto.setSize(item.getSize());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
            dto.setArchive(item.getArchive());
            dto.setArchivable(item.getArchivable());
            dto.setVersionne(item.getVersionne());
            dto.setQualityFlag(item.getQualityFlag());
            dto.setQualityStatus(item.getQualityStatus());
            dto.setLocked(item.getLocked());

            dto.setDocumentSignatureCode(item.getDocumentSignatureCode());

            if(this.documentType && item.getDocumentType()!=null) {
            dto.setDocumentType(documentTypeConverter.toDto(item.getDocumentType())) ;
        }
        if(this.documentState && item.getDocumentState()!=null) {
            dto.setDocumentState(documentStateConverter.toDto(item.getDocumentState())) ;
        }
        if(this.documentCategorie && item.getDocumentCategorie()!=null) {
            dto.setDocumentCategorie(documentCategorieConverter.toDto(item.getDocumentCategorie())) ;
        }
        if(this.utilisateur && item.getUtilisateur()!=null) {
            dto.setUtilisateur(utilisateurConverter.toDto(item.getUtilisateur())) ;
        }
        if(this.entiteAdministrative && item.getEntiteAdministrative()!=null) {
            dto.setEntiteAdministrative(entiteAdministrativeConverter.toDto(item.getEntiteAdministrative())) ;
        }
        if(this.planClassement && item.getPlanClassement()!=null) {
            dto.setPlanClassement(planClassementConverter.toDto(item.getPlanClassement())); ;
        }
        if(this.documentCategorieModel && item.getDocumentCategorieModel()!=null) {
            dto.setDocumentCategorieModel(documentCategorieModelConverter.toDto(item.getDocumentCategorieModel())) ;
        }
        if(this.documentIndexElements && ListUtil.isNotEmpty(item.getDocumentIndexElements())){
            documentIndexElementConverter.init(true);
            documentIndexElementConverter.setDocument(false);
            dto.setDocumentIndexElements(documentIndexElementConverter.toDto(item.getDocumentIndexElements()));
            documentIndexElementConverter.setDocument(true);

        }
        if(this.documentPartageGroupes && ListUtil.isNotEmpty(item.getDocumentPartageGroupes())){
            documentPartageGroupeConverter.init(true);
            documentPartageGroupeConverter.setDocument(false);
            dto.setDocumentPartageGroupes(documentPartageGroupeConverter.toDto(item.getDocumentPartageGroupes()));
            documentPartageGroupeConverter.setDocument(true);

        }
        if(this.documentPartageUtilisateurs && ListUtil.isNotEmpty(item.getDocumentPartageUtilisateurs())){
            documentPartageUtilisateurConverter.init(true);
            documentPartageUtilisateurConverter.setDocument(false);
            dto.setDocumentPartageUtilisateurs(documentPartageUtilisateurConverter.toDto(item.getDocumentPartageUtilisateurs()));
            documentPartageUtilisateurConverter.setDocument(true);

        }
        if(this.documentTags && ListUtil.isNotEmpty(item.getDocumentTags())){
            documentTagConverter.init(true);
            documentTagConverter.setDocument(false);
            dto.setDocumentTags(documentTagConverter.toDto(item.getDocumentTags()));
            documentTagConverter.setDocument(true);

        }
            if(this.echantillons && ListUtil.isNotEmpty(item.getEchantillons())){
                echantillonConverter.init(true);
                echantillonConverter.setDocuments(false);
                dto.setEchantillons(echantillonConverter.toDto(item.getEchantillons()));
                echantillonConverter.setDocuments(true);

            }

            if (item.getCourriel() != null) {
                dto.setCourrielRelated(true);
            } else {
                dto.setCourrielRelated(false);
            }

            if (item.getDocumentSignatureCode() != null) {
                dto.setDocumentSignatureCode(item.getDocumentSignatureCode());
            }

            return dto;
        }
    }
//    public ArchiveDTO DocumentToArchive(Document item) {
//        if (item == null) {
//            return null;
//        } else {
//            ArchiveDTO dto = new ArchiveDTO();
//            if(StringUtil.isNotEmpty(item.getId()))
//                dto.setId(item.getId());
//            if(StringUtil.isNotEmpty(item.getReference()))
//                dto.setReference(item.getReference());
//
//            if(item.getUploadDate()!=null)
//                dto.setDateContenue(item.getUploadDate());
//
//
//            if(this.utilisateur && item.getUtilisateur()!=null) {
//                dto.setCreatedBy(item.getCreatedBy());
//            }
//            return dto;
//        }
//    }

    public DocumentSummaryDto toSummaryDto(Document item){
        if(item == null){
            return null;
        }
        DocumentSummaryDto dto = new DocumentSummaryDto();
        dto.setId(item.getId());
        dto.setReference(item.getReference());
        dto.setReferenceGed(item.getReferenceGed());
        if(nonNull(item.getUploadDate())){
            dto.setUploadDate(item.getUploadDate().format(DateTimeFormatter.ofPattern("dd/MM:yyyy hh:mm")));
        }
        dto.setDescription(item.getDescription());
        dto.setLigne(item.getLigne());
        dto.setColonne(item.getColonne());
        dto.setNumBoite(item.getNumBoite());
        if(nonNull(item.getSigned())) {
            dto.setSigned(item.getSigned());
        }
        if (nonNull(item.getDocumentType())) {
            dto.setDocumentTypeCode(item.getDocumentType().getCode());
        }
        if (nonNull(item.getDocumentState())) {
            dto.setDocumentStateCode(item.getDocumentState().getCode());
        }
        if (nonNull(item.getDocumentCategorie())) {
            dto.setDocumentCategorieCode(item.getDocumentCategorie().getCode());
        }
        if (nonNull(item.getUtilisateur())) {
            dto.setUtilisateurEmail(item.getUtilisateur().getEmail());
        }
        if (nonNull(item.getEntiteAdministrative())) {
            dto.setEntiteAdministrativeCode(item.getEntiteAdministrative().getCode());
        }
        if (nonNull(item.getPlanClassement())) {
            dto.setPlanClassementCode(item.getPlanClassement().getCode());
        }
        if (nonNull(item.getDocumentType())) {
            dto.setDocumentTypeId(item.getDocumentType().getId());
        }
        if (nonNull(item.getDocumentState())) {
            dto.setDocumentStateId(item.getDocumentState().getId());
        }
        if (nonNull(item.getDocumentCategorie())) {
            dto.setDocumentCategorieId(item.getDocumentCategorie().getId());
        }
        if (nonNull(item.getUtilisateur())) {
            dto.setUtilisateurId(item.getUtilisateur().getId());
        }
        if (nonNull(item.getEntiteAdministrative())) {
            dto.setEntiteAdministrativeId(item.getEntiteAdministrative().getId());
        }
        if (nonNull(item.getPlanClassement())) {
            dto.setPlanClassementId(item.getPlanClassement().getId());
        }
        if (nonNull(item.getDocumentCategorieModel())) {
            dto.setDocumentCategorieModelCode(item.getDocumentCategorieModel().getCode());
        }
        if (nonNull(item.getId()) && nonNull(item.getReferenceGed())) {
            String fileUrl = "";
            try{
                fileUrl = documentAdminService.previewFileFromService(Long.valueOf(item.getId()), "");
            }catch (Exception ignored){

            }

            dto.setFileUrl(fileUrl);
        }

        return dto;
    }
    public List<DocumentSummaryDto> toSummaryDtos(List<Document> items) {
        if (items == null) {
            return Collections.emptyList();
        }
        return items.stream()
                .map(item -> {
                    DocumentSummaryDto dto = new DocumentSummaryDto();
                    dto.setId(item.getId());
                    dto.setReference(item.getReference());
                    if (nonNull(item.getUploadDate())) {
                        dto.setUploadDate(item.getUploadDate().format(DateTimeFormatter.ofPattern("dd/MM:yyyy hh:mm")));
                    }
                    dto.setDescription(item.getDescription());
                    dto.setLigne(item.getLigne());
                    dto.setColonne(item.getColonne());
                    dto.setNumBoite(item.getNumBoite());
                    if (nonNull(item.getDocumentType())) {
                        dto.setDocumentTypeCode(item.getDocumentType().getCode());
                    }
                    if (nonNull(item.getDocumentState())) {
                        dto.setDocumentStateCode(item.getDocumentState().getCode());
                    }
                    if (nonNull(item.getDocumentCategorie())) {
                        dto.setDocumentCategorieCode(item.getDocumentCategorie().getCode());
                    }
                    if (nonNull(item.getUtilisateur())) {
                        dto.setUtilisateurEmail(item.getUtilisateur().getEmail());
                    }
                    if (nonNull(item.getEntiteAdministrative())) {
                        dto.setEntiteAdministrativeCode(item.getEntiteAdministrative().getCode());
                    }
                    if (nonNull(item.getPlanClassement())) {
                        dto.setPlanClassementCode(item.getPlanClassement().getCode());
                    }
                    if (nonNull(item.getDocumentType())) {
                        dto.setDocumentTypeId(item.getDocumentType().getId());
                    }
                    if (nonNull(item.getDocumentState())) {
                        dto.setDocumentStateId(item.getDocumentState().getId());
                    }
                    if (nonNull(item.getDocumentCategorie())) {
                        dto.setDocumentCategorieId(item.getDocumentCategorie().getId());
                    }
                    if (nonNull(item.getUtilisateur())) {
                        dto.setUtilisateurId(item.getUtilisateur().getId());
                    }
                    if (nonNull(item.getEntiteAdministrative())) {
                        dto.setEntiteAdministrativeId(item.getEntiteAdministrative().getId());
                    }
                    if (nonNull(item.getPlanClassement())) {
                        dto.setPlanClassementId(item.getPlanClassement().getId());
                    }
                    if (nonNull(item.getDocumentCategorieModel())) {
                        dto.setDocumentCategorieModelCode(item.getDocumentCategorieModel().getCode());
                    }
                    if (nonNull(item.getId()) && nonNull(item.getReferenceGed())) {
                        String fileUrl = "";
                        try {
                            fileUrl = documentAdminService.previewFileFromService(Long.valueOf(item.getId()), "");
                        } catch (Exception ignored) {
                        }

                        dto.setFileUrl(fileUrl);
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<Document> toItems(List<DocumentSummaryDto> summaryDtos) {
        return summaryDtos.stream()
                .map(this::toItem)
                .collect(Collectors.toList());
    }
    private <T> void setDocumentFieldIfNotEmpty(String fieldCode, Supplier<T> documentSupplier, Consumer<T> documentConsumer, Class className ) {
        if (StringUtil.isNotEmpty(fieldCode)) {
            T document = documentSupplier.get();
            if (document == null) {
                throw new RessourceNotFoundException("No "+className.getSimpleName()+" found with code " + fieldCode);
            }
            documentConsumer.accept(document);
        }
    }

    public void initList(boolean value) {
        this.documentIndexElements = value;
        this.documentPartageGroupes = value;
        this.documentPartageUtilisateurs = value;
        this.documentTags = value;
        this.echantillons = value;
    }

    public void initObject(boolean value) {
        this.documentType = value;
        this.documentState = value;
        this.documentCategorie = value;
        this.utilisateur = value;
        this.entiteAdministrative = value;
        this.planClassement = value;
        this.documentCategorieModel = value;
    }


    public DocumentTypeConverter getDocumentTypeConverter(){
        return this.documentTypeConverter;
    }
    public void setDocumentTypeConverter(DocumentTypeConverter documentTypeConverter ){
        this.documentTypeConverter = documentTypeConverter;
    }
    public IndexElementConverter getIndexElementConverter(){
        return this.indexElementConverter;
    }
    public void setIndexElementConverter(IndexElementConverter indexElementConverter ){
        this.indexElementConverter = indexElementConverter;
    }
    public EntiteAdministrativeConverter getEntiteAdministrativeConverter(){
        return this.entiteAdministrativeConverter;
    }
    public void setEntiteAdministrativeConverter(EntiteAdministrativeConverter entiteAdministrativeConverter ){
        this.entiteAdministrativeConverter = entiteAdministrativeConverter;
    }

    public PlanClassementConverter getPlanClassementConverter() {
        return this.planClassementConverter;
    }

    public void setPlanClassementConverter(PlanClassementConverter planClassementConverter) {
        this.planClassementConverter = planClassementConverter;
    }

    public TagConverter getTagConverter(){
        return this.tagConverter;
    }
    public void setTagConverter(TagConverter tagConverter ){
        this.tagConverter = tagConverter;
    }
    public DocumentCategorieConverter getDocumentCategorieConverter(){
        return this.documentCategorieConverter;
    }
    public void setDocumentCategorieConverter(DocumentCategorieConverter documentCategorieConverter ){
        this.documentCategorieConverter = documentCategorieConverter;
    }
    public DocumentTagConverter getDocumentTagConverter(){
        return this.documentTagConverter;
    }
    public void setDocumentTagConverter(DocumentTagConverter documentTagConverter ){
        this.documentTagConverter = documentTagConverter;
    }
    public UtilisateurConverter getUtilisateurConverter(){
        return this.utilisateurConverter;
    }
    public void setUtilisateurConverter(UtilisateurConverter utilisateurConverter ){
        this.utilisateurConverter = utilisateurConverter;
    }
    public DocumentIndexElementConverter getDocumentIndexElementConverter(){
        return this.documentIndexElementConverter;
    }
    public void setDocumentIndexElementConverter(DocumentIndexElementConverter documentIndexElementConverter ){
        this.documentIndexElementConverter = documentIndexElementConverter;
    }
    public AccessShareConverter getAccessShareConverter(){
        return this.accessShareConverter;
    }
    public void setAccessShareConverter(AccessShareConverter accessShareConverter ){
        this.accessShareConverter = accessShareConverter;
    }
    public DocumentPartageUtilisateurConverter getDocumentPartageUtilisateurConverter(){
        return this.documentPartageUtilisateurConverter;
    }
    public void setDocumentPartageUtilisateurConverter(DocumentPartageUtilisateurConverter documentPartageUtilisateurConverter ){
        this.documentPartageUtilisateurConverter = documentPartageUtilisateurConverter;
    }
    public DocumentCategorieModelConverter getDocumentCategorieModelConverter(){
        return this.documentCategorieModelConverter;
    }
    public void setDocumentCategorieModelConverter(DocumentCategorieModelConverter documentCategorieModelConverter ){
        this.documentCategorieModelConverter = documentCategorieModelConverter;
    }
    public DocumentPartageGroupeConverter getDocumentPartageGroupeConverter(){
        return this.documentPartageGroupeConverter;
    }
    public void setDocumentPartageGroupeConverter(DocumentPartageGroupeConverter documentPartageGroupeConverter ){
        this.documentPartageGroupeConverter = documentPartageGroupeConverter;
    }
    public GroupeConverter getGroupeConverter(){
        return this.groupeConverter;
    }
    public void setGroupeConverter(GroupeConverter groupeConverter ){
        this.groupeConverter = groupeConverter;
    }
    public DocumentStateConverter getDocumentStateConverter(){
        return this.documentStateConverter;
    }
    public void setDocumentStateConverter(DocumentStateConverter documentStateConverter ){
        this.documentStateConverter = documentStateConverter;
    }
    public boolean  isDocumentType(){
        return this.documentType;
    }
    public void  setDocumentType(boolean documentType){
        this.documentType = documentType;
    }
    public boolean  isDocumentState(){
        return this.documentState;
    }
    public void  setDocumentState(boolean documentState){
        this.documentState = documentState;
    }
    public boolean  isDocumentCategorie(){
        return this.documentCategorie;
    }
    public void  setDocumentCategorie(boolean documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    public boolean  isUtilisateur(){
        return this.utilisateur;
    }
    public void  setUtilisateur(boolean utilisateur){
        this.utilisateur = utilisateur;
    }
    public boolean  isEntiteAdministrative(){
        return this.entiteAdministrative;
    }
    public void  setEntiteAdministrative(boolean entiteAdministrative){
        this.entiteAdministrative = entiteAdministrative;
    }
    public boolean  isDocumentCategorieModel(){
        return this.documentCategorieModel;
    }
    public void  setDocumentCategorieModel(boolean documentCategorieModel){
        this.documentCategorieModel = documentCategorieModel;
    }
    public boolean  isDocumentIndexElements(){
        return this.documentIndexElements ;
    }
    public void  setDocumentIndexElements(boolean documentIndexElements ){
        this.documentIndexElements  = documentIndexElements ;
    }
    public boolean  isDocumentPartageGroupes(){
        return this.documentPartageGroupes ;
    }
    public void  setDocumentPartageGroupes(boolean documentPartageGroupes ){
        this.documentPartageGroupes  = documentPartageGroupes ;
    }
    public boolean  isDocumentPartageUtilisateurs(){
        return this.documentPartageUtilisateurs ;
    }
    public void  setDocumentPartageUtilisateurs(boolean documentPartageUtilisateurs ){
        this.documentPartageUtilisateurs  = documentPartageUtilisateurs ;
    }
    public boolean  isDocumentTags(){
        return this.documentTags ;
    }
    public void  setDocumentTags(boolean documentTags ){
        this.documentTags  = documentTags ;
    }
    public boolean isEchantillons() {
        return echantillons;
    }

    public void setEchantillons(boolean echantillons) {
        this.echantillons = echantillons;
    }


    private boolean isDocumentSummaryDto(String dto) {
        try {
            JsonNode jsonNode = mapper.readTree(dto);
            return jsonNode.has("documentCategorieCode")  && jsonNode.has("planClassementCode");
        } catch (JsonProcessingException e) {
            return false;
        }
    }

    private boolean isDocumentDto(String dto) {
        try {
            JsonNode jsonNode = mapper.readTree(dto);
            return jsonNode.has("documentCategorie")  && jsonNode.has("planClassement");
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}
