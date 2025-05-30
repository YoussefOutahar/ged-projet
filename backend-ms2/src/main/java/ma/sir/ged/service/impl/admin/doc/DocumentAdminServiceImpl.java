package ma.sir.ged.service.impl.admin.doc;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.pdf.PdfStamper;
import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.PlainTextMailRequest;
import ma.sir.ged.Email.UseCases.DocumentEmails;
import ma.sir.ged.WebSocket.UseCases.NotificationDocument;
import ma.sir.ged.bean.core.doc.*;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.organigramme.enums.ArchivageType;
import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.bean.core.referentieldoc.DocumentTag;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.bean.history.DocumentHistory;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.dao.facade.core.doc.ArchiveFinalDao;
import ma.sir.ged.dao.facade.core.doc.ArchiveYearsDao;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.doc.EchantillonDao;
import ma.sir.ged.dao.facade.core.doc.listener.DestructionDao;
import ma.sir.ged.dao.facade.history.DocumentHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentSpecification;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.doc.AuditAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentCommentaireService;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.*;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageGroupeAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.search.SearchService;
import ma.sir.ged.service.facade.bo.CourrielService;
import ma.sir.ged.service.facade.bo.IntervenantsCourrielService;
import ma.sir.ged.service.impl.admin.Events.DocumentEvents.DocumentCreatedEvent;
import ma.sir.ged.utils.Assert;
import ma.sir.ged.utils.LoggingUtils.TimeLogger;
import ma.sir.ged.utils.pdfUtils.PdfUtils;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.DocumentStateConverter;
import ma.sir.ged.ws.converter.EchantillonConverter;
import ma.sir.ged.ws.converter.IndexElementConverter;
import ma.sir.ged.ws.dto.ArchiveFinalDto;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EchantillonDto;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;
import ma.sir.ged.zynerator.exception.BusinessRuleException;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import ma.sir.ged.zynerator.util.DateUtil;
import ma.sir.ged.zynerator.util.ListUtil;
import ma.sir.ged.zynerator.util.PaginatedList;
import ma.sir.ged.zynerator.util.StringUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import java.io.ByteArrayOutputStream;
import java.io.IOException;


import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
public class DocumentAdminServiceImpl extends AbstractServiceImpl<Document,DocumentHistory, DocumentCriteria, DocumentHistoryCriteria, DocumentDao,
        DocumentHistoryDao> implements DocumentAdminService {

    @Autowired
    DocumentConverter converter;
    @Qualifier("databaseSearchServiceImpl")
    @Autowired
    private SearchService searchService;

    @Autowired
    private DocumentPartageUtilisateurAdminService documentPartageUtilisateurService;
    @Autowired
    private DocumentCategorieModelAdminService documentCategorieModelService;
    @Autowired
    private DocumentStateAdminService documentStateService;
    @Autowired
    private DocumentIndexElementAdminService documentIndexElementService;
    @Autowired
    private DocumentPartageGroupeAdminService documentPartageGroupeService;
    @Autowired
    private DocumentTypeAdminService documentTypeService;
    @Autowired
    private DocumentIndexElementAdminService indexElementAdminService;
    @Autowired
    private IndexElementConverter indexElementConverter;
    @Autowired
    private UtilisateurAdminService utilisateurService;
    @Autowired
    private EntiteAdministrativeAdminService entiteAdministrativeService;
    @Autowired
    private DocumentCategorieAdminService documentCategorieService;
    @Autowired
    private DocumentTagAdminService documentTagService;
    @Autowired
    private IndexationService indexationService;
    @Autowired
    private AuditAdminService auditAdminService;
    @Autowired
    private CourrielService courrielService;
    @Autowired
    private DocumentDao dao;
    @Autowired
    private ArchiveFinalDao archiveDao;

    @Autowired
    private DestructionDao destructionDao;
    @Autowired
    private ArchiveYearsDao archiveYearsDao;
    @Autowired
    private EchantillonDao echantillonDao;
    @Autowired
    private EchantillonConverter echantillonConverter;
    @Autowired
    private DocumentStateConverter documentStateConverter;
    @Autowired
    NotificationDocument notificationDocument;
    @Autowired
    DocumentCommentaireService commentaireService;
    @Autowired
    EmailService emailService;

    @Autowired
    private TimeLogger timeLogger;

    @Value("${ged-minio.api.url}")
    private String minioURL;
    @Autowired
    private ObjectMapper objectMapper;
    private final static String UPLOAD_STRUCTURED_FILE_ENDPOINT = "/ged/upload-structured-file";
    private final static String MOVE_STRUCTURED_ARCHIVE_FILE_ENDPOINT = "/ged/move-to-archive/";
    private final static String UPDATE_STRUCTURED_FILE_ENDPOINT = "/ged/update/file/";


    private final static String DOWNLOAD_FILE_ENDPOINT = "/ged/file/download/";
    private final static String PREVIEW_FILE_ENDPOINT = "/ged/file/preview/";

    private static Logger logger = LoggerFactory.getLogger(DocumentAdminServiceImpl.class);
    @Value("${ocrUrl.api.url}")
    private String ocrUrl;
    private final static String OCR_API = "/api/admin/ocr/";

    private final Map<String, Map<Integer, byte[]>> chunkStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> chunkUploadTimestamps = new ConcurrentHashMap<>();
    private static final long STALE_THRESHOLD = 1800000; // 30 min
    @Value("${app.qrcode.width}")
    private int qrcodeWidth;

    @Value("${app.qrcode.height}")
    private int qrcodeHeight;

    @Value("${app.index.numero-enregistrement}")
    private String indexNumeroEnregistrement;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public DocumentAdminServiceImpl(DocumentDao dao, DocumentHistoryDao historyDao) {
        super(dao, historyDao);
    }
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class, readOnly = false)
    public Document create(Document t) {
        timeLogger.startLogging("Creating document with reference: " + t.getReference() );

        String originalReference = t.getReference();
        int count = 1;
        while (dao.existsByReference(originalReference)) {
            originalReference = t.getReference() + " (" + count + ")";
            count++;
        }
        t.setReference(originalReference);
        Document document = super.create(t);
        if (document != null) {
            if (t.getDocumentIndexElements() != null) {
                t.getDocumentIndexElements().forEach(element-> {
                    element.setDocument(t);
                    documentIndexElementService.create(element);
                });
            }
            if (t.getDocumentPartageGroupes() != null) {
                t.getDocumentPartageGroupes().forEach(element-> {
                    element.setDocument(t);
                    documentPartageGroupeService.create(element);
                });
            }
            if (t.getDocumentPartageUtilisateurs() != null) {
                t.getDocumentPartageUtilisateurs().forEach(element-> {
                    element.setDocument(t);
                    documentPartageUtilisateurService.create(element);
                });
            }
            if (t.getDocumentTags() != null) {
                t.getDocumentTags().forEach(element-> {
                    element.setDocument(t);
                    documentTagService.create(element);
                });
            }

            timeLogger.endLogging("doc added to mysql");

            if (t.getDocumentCategorie() != null) {
                eventPublisher.publishEvent(new DocumentCreatedEvent(this, t.getId(), t.getDocumentCategorie().getId()));
            }
            return t;
        }
        return null;

    }
   @Transactional
    @Override
    public DocumentDto saveMergedFiles(MultipartFile file, String dtos) throws Exception {
        converter.init(true);
        List<DocumentDto> documentDtos = new ObjectMapper().readValue(dtos, new TypeReference<List<DocumentDto>>() {});
        if (documentDtos.isEmpty()) {
            throw new EntityNotFoundException("Document list is empty.");
        }
        String updatedReference = documentDtos.stream().map(DocumentDto::getReference).collect(Collectors.joining("-"));
        if (!documentDtos.iterator().hasNext()) {
            throw new EntityNotFoundException(" Can not get first Element");
        }
        DocumentDto mergedDocumentDto = documentDtos.iterator().next();
        mergedDocumentDto.setReference(updatedReference);
        DocumentDto mergedDocumentCreated = saveDocument(file, new ObjectMapper().writeValueAsString(mergedDocumentDto));
        auditAdminService.saveAudit(mergedDocumentCreated.getId(), "Fusionner");
        documentIndexElementService.deleteByDocumentId(mergedDocumentCreated.getId());
        for (DocumentDto documentDto : documentDtos) {
            notifyAndUpdateIndexElements(converter.toItem(mergedDocumentCreated), converter.toItem(documentDto));
        }

        return mergedDocumentDto;
    }
    @Transactional
     public void updateListStateToDraft(List<DocumentDto> documentDtos){
        DocumentState documentState = new DocumentState();
        documentState.setCode("brouillon-ref");
        DocumentState documentStateResult = documentStateService.findByReferenceEntity(documentState);
        List<Long> ids = documentDtos.stream().map(DocumentDto::getId).collect(Collectors.toList());
        dao.updateStateDocuments(documentStateResult, ids);

    }
    @Transactional
    public void updateStateToDraft(DocumentDto documentDtos){
        DocumentState documentState = new DocumentState();
        documentState.setCode("brouillon-ref");
        DocumentState documentStateResult = documentStateService.findByReferenceEntity(documentState);
        dao.updateStateDocument(documentStateResult, documentDtos.getId());

    }

    @Override
    @Transactional
    public List<DocumentDto> saveSplitedDocument(List<MultipartFile> files, String dto) throws JsonProcessingException {

        DocumentDto commonDocumentDto = new ObjectMapper().readValue(dto, DocumentDto.class);
        if (commonDocumentDto == null) {
            throw new EntityNotFoundException("Document list is empty.");
        }

        AtomicInteger counter = new AtomicInteger(1);
        List<DocumentDto> splitedDocuments = files.stream()
                .flatMap(file -> {
                    converter.init(true);
                    Document myT = converter.toItem(commonDocumentDto);
                    myT.setId(null);
                    String reference = myT.getReference() + "_Split" +  counter.getAndIncrement() + '_' + compressUUID(UUID.randomUUID());
                    myT.setReference(reference);
                    Document splitedDocumentCreated = create(myT, file);
                    try {
                        searchService.updateElasticSearch(splitedDocumentCreated);
                    } catch (HttpClientErrorException exception) {
                        // Handle exception accordingly
                    }
                    converter.init(true);
                    return Stream.of(converter.toDto(splitedDocumentCreated));
                })
                .collect(Collectors.toList());
        updateStateToDraft(commonDocumentDto);


        return splitedDocuments;
    }
    public static String compressUUID(UUID uuid) {
        byte[] bytes = new byte[16];
        long msb = uuid.getMostSignificantBits();
        long lsb = uuid.getLeastSignificantBits();
        for (int i = 0; i < 8; i++) {
            bytes[i] = (byte) (msb >>> 8 * (7 - i));
            bytes[8 + i] = (byte) (lsb >>> 8 * (7 - i));
        }
        String base64UUID = Base64.getEncoder().encodeToString(bytes);
        return base64UUID.substring(0, 8);
    }

    public Document findWithAssociatedLists(Long id){
        Document result = dao.findById(id).orElse(null);
        if(result!=null && result.getId() != null) {
            result.setDocumentIndexElements(documentIndexElementService.findByDocumentId(id));
            result.setDocumentPartageGroupes(documentPartageGroupeService.findByDocumentId(id));
            result.setDocumentPartageUtilisateurs(documentPartageUtilisateurService.findByDocumentId(id));
            result.setDocumentTags(documentTagService.findByDocumentId(id));
        }
        return Stream.of(result).filter(this::userCanSee).findFirst().orElse(null);
    }
    @Transactional
    public void deleteAssociatedLists(Long id) {
        documentIndexElementService.deleteByDocumentId(id);
        documentPartageGroupeService.deleteByDocumentId(id);
        documentPartageUtilisateurService.deleteByDocumentId(id);
        documentTagService.deleteByDocumentId(id);
        auditAdminService.deleteByDocumentId(id);
        commentaireService.deleteByDocumentId(id);
    }

    @Override
    public void delete(Document document) {
        dao.deleteById(document.getId());
    }

    @Override
    @Transactional
    public boolean restoreById(Long id) {
        boolean condition = deleteByIdCheckCondition(id);
        if (condition) {
            dao.restoreById(id);
        }
        return condition;
    }

    @Override
    @Transactional
    public List<DocumentDto> deleteFinal(List<DocumentDto> dtos) {
        List<DocumentDto> deletedDtos = new ArrayList<>();
        if (dtos != null && !dtos.isEmpty()) {
            converter.init(false);
            List<Document> documents = converter.toItem(dtos);
            for (Document document : documents) {
                // Supprimer les relations associées
                deleteAssociatedLists(document.getId());
            }
            // Supprimer directement les documents sans se soucier des relations
            dao.deleteAll(documents);
            deletedDtos = converter.toDto(documents);
        }
        return deletedDtos;
    }

    @Override
    @Transactional
    public List<DocumentDto> archiveAssociatedDocument(List<DocumentDto> listToArchive) {
        List<DocumentDto> archivedDocuments = new ArrayList<>();
        for (DocumentDto documentDto : listToArchive) {
            if (!documentDto.getDocumentState().getLibelle().equalsIgnoreCase("cloture")) {
                return new ArrayList<>();
            }
        }
        for (DocumentDto documentDto : listToArchive) {
            if (documentDto.getId() != null) {
                dao.archiveAssociatedDocument(documentDto.getId());
                documentDto.setArchive(true);
                archivedDocuments.add(documentDto);
            }
        }
        return archivedDocuments;
    }


    @Override
    @Transactional
    public List<DocumentDto> desarchiveAssociatedDocument(List<DocumentDto> listToArchive) {
        List<DocumentDto> archivedDocuments = new ArrayList<>();
        for (DocumentDto documentDto : listToArchive) {
            if (documentDto.getId() != null) {
                dao.desarchiveAssociatedDocument(documentDto.getId());
                documentDto.setArchive(true);
                archivedDocuments.add(documentDto);
            }
        }
        return archivedDocuments;
    }

    @Override
    @Transactional
    public void deleteFinalEchantillon(Long id) {
        Echantillon echantillon = echantillonDao.findById(id).orElseThrow(() -> new RessourceNotFoundException("Echantillon Not found with id " + id));
        echantillonDao.delete(echantillon);
    }
    private List<String> convertYearsToLabels(List<Integer> years) {
        return years.stream()
                .map(year -> year.toString())
                .collect(Collectors.toList());
    }
    @Override
    public List<Map<String, Object>> getDistinctYear() {
        List<Map<String, Object>> yearsList = new ArrayList<>();
        List<Integer> resultList = dao.findDistinctYears();
        List<String> years = convertYearsToLabels(resultList);
        for (String year : years) {
            Map<String, Object> yearList = new HashMap<>();
            yearList.put("libelle", year);
            yearsList.add(yearList);
        }
        return yearsList;
    }



 /*   @Transactional
    @Override
    public List<Document> checkDocumentsApproachingIntermidiaireArchivage() {
        List<Document> documents = dao.findAll();
        List<Document> documentsApproachingArchivage = new ArrayList<>();
        LocalDateTime nowDate = LocalDateTime.now();
        // Durée avant l'archivage considérée comme proche (2 mois dans cet exemple)
        Period twoMonths = Period.ofMonths(2);

        if (documents != null && !documents.isEmpty()) {
            for (Document document : documents) {
                if (document.getUploadDate() == null || document.getPlanClassement() == null
                        || document.getPlanClassement().getArchiveIntermidiaireDuree() == null) {
                    continue;
                }
                LocalDateTime dateCreation = document.getUploadDate();
                Integer archiveIntermiaireDuration = document.getPlanClassement().getArchiveIntermidiaireDuree();
                LocalDateTime archiveIntermidiaireDate = dateCreation.plusYears(archiveIntermiaireDuration);
                // Vérifier si la date actuelle est à moins de 2 mois de la date d'archivage
                if (nowDate.plus(twoMonths).isEqual(archiveIntermidiaireDate) || nowDate.plus(twoMonths).isAfter(archiveIntermidiaireDate)) {
                    document.setArchivable(true);
                    documentsApproachingArchivage.add(document);
                }
            }
        }
        return documentsApproachingArchivage;
    }*/


    @Transactional
    @Override
    public Document setStatusDocument(Long idDoc, String status) {
        Document document = dao.findById(idDoc)
                .orElseThrow(() -> new RessourceNotFoundException("Document Not found with id " + idDoc));
        DocumentState documentState = documentStateService.findByLibelle(status);
        if (documentState == null) {
            throw new RessourceNotFoundException("DocumentState Not found with libelle " + status);
        }
        if ("cloture".equalsIgnoreCase(status) && !"cloture".equalsIgnoreCase(document.getDocumentState().getLibelle())) {
            document.setArchive(true);
        }
        document.setDocumentState(documentState);
        return dao.save(document);
    }





    /*
    @Scheduled(cron = "0 0/2 * * * ?")
*/
    @Transactional
    @Override
    public List<Document> archivageIntermidiareAutomatique() {
        List<Document> documents = dao.findAll();
        List<Document> documentsArchived = new ArrayList<>();
        LocalDateTime nowDate = LocalDateTime.now();
        if (documents != null && !documents.isEmpty()) {
            for (Document document : documents) {
                if (document.getUploadDate() == null || document.getPlanClassement() == null
                        || document.getPlanClassement().getArchiveIntermidiaireDuree() == null
                        ) {
                    continue;
                }
                LocalDateTime dateCreation = document.getUploadDate();
                Integer archiveIntermiaireDuration = document.getPlanClassement().getArchiveIntermidiaireDuree();
                LocalDateTime archiveIntermiaireDate = dateCreation.plusYears(archiveIntermiaireDuration);
                if (nowDate.isEqual(archiveIntermiaireDate) || nowDate.isAfter(archiveIntermiaireDate)) {
                    dao.archiveAssociatedDocument(document.getId());
                    documentsArchived.add(document);
                }
            }
        }
        if(documentsArchived.size()>0){
            emailService.sendPlainTextEmail(newEmailAI(documentsArchived));
        }
        return documentsArchived;
    }

    private PlainTextMailRequest newEmailAI(List<Document> documents){
        PlainTextMailRequest mailRequest = new PlainTextMailRequest();
/*
        mailRequest.setToEmail("zakaria.azelmad@digiup.ma");
*/
        mailRequest.setToEmail("mohamed.sebnet@uir.ac.ma");
        mailRequest.setSubject("Archivage intermidiare des documents");
        StringBuilder message = new StringBuilder("Les documents avec les références suivantes ont été archivés :\n");
        for (Document document : documents) {
            message.append("- ").append(document.getReference()).append("\n");
        }
        mailRequest.setMessage(message.toString());
        mailRequest.setTitle("Archivage intermidiare des documents");
        mailRequest.setSenderId(-1L);
        mailRequest.setHTML(true);
        return mailRequest;
    }





/*    @Scheduled(cron = "0 * * * * ?")*/
    @Transactional
    @Override
    public List<ArchiveFinal> archivageFinaleAutomatique() {
        List<Document> documents = dao.DocumentsArchiver();
        LocalDateTime nowDate = LocalDateTime.now();
        List<DocumentDto> documentListToArchiveFinale = new ArrayList<>();

        if (documents != null && !documents.isEmpty()) {
            for (Document document : documents) {

                if (nowDate.isEqual(document.getDateArchivageFinale()) || nowDate.isAfter(document.getDateArchivageFinale())) {
                    DocumentDto dto = converter.toDto(document);
                    documentListToArchiveFinale.add(dto);
                }
            }
        }
        if(documentListToArchiveFinale.size()>0){
            emailService.sendPlainTextEmail(newEmailAF(documentListToArchiveFinale));
        }
        return  moveToArchiveFinal(documentListToArchiveFinale);
    }

    private PlainTextMailRequest newEmailAF(List<DocumentDto> documents){
        PlainTextMailRequest mailRequest = new PlainTextMailRequest();
/*
        mailRequest.setToEmail("zakaria.azelmad@digiup.ma");
*/
        mailRequest.setToEmail("mohamed.sebnet@uir.ac.ma");
        mailRequest.setSubject("Archivage finale des documents");
        StringBuilder message = new StringBuilder("Les documents avec les références suivantes ont été archivés :\n");
        for (DocumentDto document : documents) {
            message.append("- ").append(document.getReference()).append("\n");
        }
        mailRequest.setMessage(message.toString());
        mailRequest.setTitle("Archivage finale des documents");
        mailRequest.setSenderId(-1L);
        mailRequest.setHTML(true);
        return mailRequest;
    }



    @Override
    public List<Document> getDocumentsToArchive(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime inOneMonth = now.plusMonths(1);
        if(inOneMonth.isBefore(now)){
            throw new BusinessRuleException("The date is not valid");
        }

        return dao.findDocumentsApproachingIntermediateArchiveDate(now, inOneMonth);
    }

    @Override
    public List<Document> getDocumentsArchivee(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthAgo = now.minusMonths(1);
        if(oneMonthAgo.isAfter(now)){
            throw new BusinessRuleException("The date is not valid");
        }

        return dao.findDocumentsArchiveeDernierement(oneMonthAgo,now);
    }

    @Override
    public List<ArchiveFinal> getDocumentsArchivesFinalement(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthAgo = now.minusMonths(1);
        if(oneMonthAgo.isAfter(now)){
            throw new BusinessRuleException("The date is not valid");
        }

        return archiveDao.findLastArchiveFinale(oneMonthAgo,now);
    }

    @Override
    public List<Document> getDocumentsToArchiveFinale(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime inOneMonth = now.plusMonths(1);
        if(inOneMonth.isBefore(now)){
            throw new BusinessRuleException("The date is not valid");
        }

        return dao.findDocumentsApproachingFinaleArchiveDate(now, inOneMonth);
    }

    @Override
    public List<Document> getDocumentsToDestruction(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime inOneMonth = now.plusMonths(1);
        if(inOneMonth.isBefore(now)){
            throw new BusinessRuleException("The date is not valid");
        }

        return dao.findDocumentsApproachingDestruction(now, inOneMonth);
    }



    @Override
    @Transactional
    public List<ArchiveFinal> moveToArchiveFinal(List<DocumentDto> dtos) {
      try{
           if (dtos == null || dtos.isEmpty()) {
              return Collections.emptyList();
          }
          List<ArchiveFinal> archiveF;
          List<Document> documents = converter.toItem(dtos);
          Set<Integer> uniqueYearsToInsert = documents.stream()
                    .map(document -> document.getUploadDate().getYear())
                    .filter(year -> !archiveYearsDao.findAllYear().contains(year))
                    .collect(Collectors.toSet());

            Set<ArchiveFinal> archives = documents.stream()
                    .map(document -> {
                        if (document.getPlanClassement().getArchivageType() == ArchivageType.DESTRUCTION) {
                            Destruction destruction  = creatDestruction(document);
                            deleteAssociatedLists(document.getId());
                            dao.delete(document);
                            return null;
                        } else{
                            try {
                                ArchiveFinal archive = createArchiveFinal(document);
                                archive.setReferenceGed(sendDocumentArchiveToMinioWithStructure(document.getId(), ""));
                                deleteAssociatedLists(document.getId());
                                dao.delete(document);
                                return archive;

                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                    }
                    })
                    .collect(Collectors.toSet());
        archiveF = archiveDao.saveAll(archives);


          deleteFinal(dtos);
          if (!uniqueYearsToInsert.isEmpty()) {
                List<ArchiveYears> archiveYearsToInsert = uniqueYearsToInsert.stream()
                        .map(year -> {
                            ArchiveYears archiveYear = new ArchiveYears();
                            archiveYear.setYear(year);
                            return archiveYear;
                        })
                        .collect(Collectors.toList());
                archiveYearsDao.saveAll(archiveYearsToInsert);
            }
          return archiveF;
      } catch (Exception e) {
          throw new RuntimeException("Error Moving document To Archive : " + e.getMessage(), e);
      }
    }



    @Override
    public ResponseEntity<Void>  addInfoArchivePhysiqueFinal(List<ArchiveFinal> archiveFinalDto,Long line, Long colonne, Long boite){
        if ( CollectionUtils.isEmpty(archiveFinalDto)) {
            throw new ResourceNotFoundException("the list is Empty");
        }

           List<ArchiveFinal> archives = archiveFinalDto;
           archives.forEach(archive -> {
            Assert.assertNotNullNumber(colonne, "colonne cannot be null");
            Assert.assertNotNullNumber(line, "line cannot be null");
            Assert.assertNotNullNumber(boite, "boite cannot be null");
            archive.setColonne(colonne);
            archive.setLigne(line);
            archive.setNumBoite(boite);

        });

        archiveDao.saveAll(archives);
        return ResponseEntity.ok().build();
    }

    @Override
    public Long handleChunkUpload(MultipartFile fileChunk, int chunkIndex, int totalChunks, String dto, boolean withVersioning) {
        String operationKey = SecurityUtil.getCurrentUser().getId().toString()+ "_" + dto.substring(0, dto.indexOf(","));
        try{
            logger.info("Handling file chunk upload. opId: {} Index: {}, Total: {}",operationKey, chunkIndex, totalChunks);

            chunkStorage.putIfAbsent(operationKey, new ConcurrentHashMap<>());
            chunkStorage.get(operationKey).put(chunkIndex, fileChunk.getBytes());
            chunkUploadTimestamps.put(operationKey, System.currentTimeMillis());

            if (chunkStorage.get(operationKey).size() == totalChunks) {
                // Calculate total size of the combined byte array
                Map<Integer, byte[]> chunks = chunkStorage.get(operationKey);
                int totalSize = chunks.values().stream().mapToInt(chunk -> chunk.length).sum();
                byte[] fileBytes = new byte[totalSize];

                // Combine chunks into a single byte array
                int currentOffset = 0;
                for (int i = 0; i < chunks.size(); i++) {
                    byte[] chunk = chunks.get(i);
                    System.arraycopy(chunk, 0, fileBytes, currentOffset, chunk.length);
                    currentOffset += chunk.length;
                }

                converter.init(true);
                Document myT = converter.toItem(dto);

                Long createdDocumentId = null;
                if(withVersioning){
                    Document referencedDocument = findById(myT.getId());
                    DocumentDto t = createDocumentWithFile(fileBytes, converter.toDto(myT), referencedDocument, true);
                    createdDocumentId = (t != null)? t.getId() : null;
                    auditAdminService.saveAudit(t.getId(), "Modifier_File");
                }else{
                    Document t = create(myT,fileBytes );
                    createdDocumentId = (t != null)? t.getId() : null;
                    auditAdminService.saveAudit(t.getId(), "Ajouter");
                    notificationDocument.notifyDocumentCreation(converter.toSummaryDto(t));
                    Utilisateur chef = (t.getEntiteAdministrative()!=null)? t.getEntiteAdministrative().getChef(): null;
                    String email = (chef != null && chef.getEmail() != null) ? chef.getEmail() : "yandocsolution@gmail.com";
                    DocumentEmails.sendDocumentCreationMail(t, email);
                }


                // Clean up the chunk storage after processing
                chunkStorage.remove(operationKey);
                chunkUploadTimestamps.remove(operationKey);

                if(createdDocumentId != null){
                    return createdDocumentId;
                }else return null;

            }
            // Return -1 if not all chunks have been received yet
            return -1L;
        }catch (IOException e) {
            logger.error("Error processing file chunk", e);
            if (operationKey != null) {
                chunkStorage.remove(operationKey);
                chunkUploadTimestamps.remove(operationKey);
            }

        } catch (Exception e) {
            logger.error("Unexpected error", e);
            if (operationKey != null) {
                chunkStorage.remove(operationKey);
                chunkUploadTimestamps.remove(operationKey);
            }
        }
        return null;
    }

    // Scheduled task for cleaning up stale uploads
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupStaleUploads() {
        long currentTime = System.currentTimeMillis();
        chunkUploadTimestamps.entrySet().removeIf(entry -> {
            String operationKey = entry.getKey();
            long lastUpdate = entry.getValue();
            boolean isStale = currentTime - lastUpdate > STALE_THRESHOLD;
            if (isStale) {
                chunkStorage.remove(operationKey);
                logger.info("Removed stale upload with operationKey: {}", operationKey);
            }
            return isStale;
        });
    }

    private Destruction creatDestruction(Document document){
        Destruction destruction = new Destruction();
        destruction.setReference(document.getReference());
        destruction.setReferenceGed(document.getReferenceGed());
        String responsable = document.getUtilisateur().getNom() + " " + document.getUtilisateur().getPrenom();
        destruction.setResponsable(responsable);
        destruction.setPlanDeClassement(document.getPlanClassement().getLibelle());

        return  destructionDao.save(destruction);
    }

    private ArchiveFinal createArchiveFinal(Document document)throws JsonProcessingException {
        ArchiveFinal archive =  new ArchiveFinal();
        archive.setReference(document.getReference());
        archive.setUploadDate(document.getUploadDate());
        archive.setReferenceGed(document.getReferenceGed());
        DocumentDto archivedDtos = converter.toDto(document);
        archive.setSnapShots(objectMapper.writeValueAsString(archivedDtos));
        return archive;
    }

        public void updateWithAssociatedLists(Document document){
        if(document !=null && document.getId() != null){
            List<List<DocumentIndexElement>> resultDocumentIndexElements= documentIndexElementService.getToBeSavedAndToBeDeleted(documentIndexElementService.findByDocumentId(document.getId()),document.getDocumentIndexElements());
            documentIndexElementService.delete(resultDocumentIndexElements.get(1));
            ListUtil.emptyIfNull(resultDocumentIndexElements.get(0)).forEach(e -> e.setDocument(document));
            documentIndexElementService.update(resultDocumentIndexElements.get(0),true);
            List<List<DocumentPartageGroupe>> resultDocumentPartageGroupes= documentPartageGroupeService.getToBeSavedAndToBeDeleted(documentPartageGroupeService.findByDocumentId(document.getId()),document.getDocumentPartageGroupes());
            documentPartageGroupeService.delete(resultDocumentPartageGroupes.get(1));
            ListUtil.emptyIfNull(resultDocumentPartageGroupes.get(0)).forEach(e -> e.setDocument(document));
            documentPartageGroupeService.update(resultDocumentPartageGroupes.get(0),true);
            List<List<DocumentPartageUtilisateur>> resultDocumentPartageUtilisateurs= documentPartageUtilisateurService.getToBeSavedAndToBeDeleted(documentPartageUtilisateurService.findByDocumentId(document.getId()),document.getDocumentPartageUtilisateurs());
            documentPartageUtilisateurService.delete(resultDocumentPartageUtilisateurs.get(1));
            ListUtil.emptyIfNull(resultDocumentPartageUtilisateurs.get(0)).forEach(e -> e.setDocument(document));
            documentPartageUtilisateurService.update(resultDocumentPartageUtilisateurs.get(0),true);
            List<List<DocumentTag>> resultDocumentTags= documentTagService.getToBeSavedAndToBeDeleted(documentTagService.findByDocumentId(document.getId()),document.getDocumentTags());
            documentTagService.delete(resultDocumentTags.get(1));
            ListUtil.emptyIfNull(resultDocumentTags.get(0)).forEach(e -> e.setDocument(document));
            documentTagService.update(resultDocumentTags.get(0),true);
        }
    }


    public Document findByReferenceEntity(Document t){
        if(Objects.isNull(t) || Objects.isNull(t.getReference()))
            return null;
        Document byCode = dao.findByReferenceAndDeletedIsFalse(t.getReference());
        User user = getCurrentUser();
        if (user != null) {
            return isNull(byCode) ? null : Stream.of(byCode).filter(this::userCanSee).findFirst().orElse(null);
        }else {
            return Objects.isNull(byCode) ? null : byCode;
        }
    }

    public List<Document> findByDocumentTypeId(Long id){
        return dao.findByDocumentTypeIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }

    @Override
    public DocumentSummaryDto findByReference(String ref) {
        Document byReferenceAndDeletedIsFalse = dao.findByReferenceAndDeletedIsFalse(ref);
        if(byReferenceAndDeletedIsFalse == null)
            throw new RessourceNotFoundException("No document found with reference : "+ref);
        return converter.toSummaryDto(byReferenceAndDeletedIsFalse);
    }

    public int deleteByDocumentTypeId(Long id){
        return dao.deleteByDocumentTypeId(id);
    }

    @Override
    public long countByDocumentTypeId(Long id) {
        return dao.countByDocumentTypeIdAndDeletedIsFalse(id);
    }

    public List<Document> findByDocumentStateId(Long id){
        return dao.findByDocumentStateIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentStateId(Long id){
        return dao.deleteByDocumentStateId(id);
    }

    @Override
    public int countByDocumentStateId(Long id) {
        return dao.countByDocumentStateIdAndDeletedIsFalse(id);
    }

    public List<Document> findByDocumentCategorieId(Long id){
        return dao.findByDocumentCategorieIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentCategorieId(Long id){
        return dao.deleteByDocumentCategorieId(id);
    }

    @Override
    public long countByDocumentCategorieId(Long id) {
        return dao.countByDocumentCategorieIdAndDeletedIsFalse(id);
    }

    public List<Document> findByUtilisateurId(Long id){
        return dao.findByUtilisateurIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByUtilisateurId(Long id){
        return dao.deleteByUtilisateurId(id);
    }

    @Override
    public long countByUtilisateurId(Long id) {
        return dao.countByUtilisateurIdAndDeletedIsFalse(id);
    }

    public List<Document> findByEntiteAdministrativeId(Long id){
        return dao.findByEntiteAdministrativeIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }

    @Override
    public List<DocumentDto> findByPlanClassementId(Long id) {
        converter.init(true);
        return  converter.toDto(dao.findByPlanClassementIdAndDeletedIsFalse(id));
    }

    public int deleteByEntiteAdministrativeId(Long id){
        return dao.deleteByEntiteAdministrativeId(id);
    }

    @Override
    public long countByEntiteAdministrativeId(Long id) {
        return dao.countByEntiteAdministrativeIdAndDeletedIsFalse(id);
    }

    public List<Document> findByDocumentCategorieModelId(Long id){
        return dao.findByDocumentCategorieModelIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentCategorieModelId(Long id){
        return dao.deleteByDocumentCategorieModelId(id);
    }

    @Override
    public long countByDocumentCategorieModelId(Long id) {
        return dao.countByDocumentCategorieModelIdAndDeletedIsFalse(id);
    }

    @Override
    public DocumentDto saveDocument(MultipartFile file, String dto) throws Exception {
        DocumentDto documentDto = new ObjectMapper().readValue(dto, DocumentDto.class);
        converter.init(true);
        Document myT = converter.toItem(documentDto);
        Document t = new Document();
        if(myT.getId() != null) {
            //Edit File Create new Document
            myT.setId(null);
            t = create(myT, file);
            notifyAndUpdateIndexElements(t, myT);
        }else{
            t = create(myT, file);
        }
        notificationDocument.notifyDocumentCreation(documentDto);
        Utilisateur chef = t.getEntiteAdministrative().getChef();
        String email = (chef != null && chef.getEmail() != null) ? chef.getEmail() : "yandocsolution@gmail.com";
        DocumentEmails.sendDocumentCreationMail(t, email);
        searchService.createDocumentInElastic(t);

        return converter.toDto(t);
    }

    @Override
    public Long saveDocumentSummary(MultipartFile file, String dto) throws Exception {
        DocumentSummaryDto documentDto = new ObjectMapper().readValue(dto, DocumentSummaryDto.class);
        converter.init(true);
        Document myT = converter.toItem(documentDto);
        Document t = create(myT, file);
        notificationDocument.notifyDocumentCreation(documentDto);
        Utilisateur chef = t.getEntiteAdministrative().getChef();
        String email = (chef != null && chef.getEmail() != null) ? chef.getEmail() : "yandocsolution@gmail.com";
        DocumentEmails.sendDocumentCreationMail(t, email);
        searchService.createDocumentInElastic(t);
        return t.getId();
    }

    @Override
    public DocumentDto createDocumentWithFile(MultipartFile file, DocumentDto documentDto, Document referencedDocument, boolean withIndex) throws Exception {
        converter.init(true);
        Document myT = converter.toItem(documentDto);
        String oldReference = referencedDocument.getReference()+ "_V" + System.currentTimeMillis();
        referencedDocument.setReference(oldReference);
        update(referencedDocument);
        try {
            myT.setContent(extractTextFromDocument(file, "fra+ara"));
        } catch (Exception e) {
            e.printStackTrace();
            myT.setContent("");
        }
        myT.setId(null);
        myT.setVersionne(true);
        myT.setUploadDate(LocalDateTime.now());
        Document t = create(myT, file);
        courrielService.handleDocUpdateAndCourrier(t,referencedDocument);
        searchService.createDocumentInElastic(t);
        notificationDocument.notifyDocumentUpdate(documentDto);
        if(withIndex) {notifyAndUpdateIndexElements(t,myT);}
        return converter.toDto(t);
    }

    @Override
    public DocumentDto updateDocumentFile(MultipartFile file, DocumentDto documentDto) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String url = minioURL + UPDATE_STRUCTURED_FILE_ENDPOINT + documentDto.getReferenceGed();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, Void.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RessourceNotFoundException("File not found");
        }

        return documentDto;
    }

    public DocumentDto createDocumentWithFile(byte[] file, DocumentDto documentDto, Document referencedDocument, boolean withIndex) throws Exception {
        converter.init(true);
        Document myT = converter.toItem(documentDto);
        String oldReference = referencedDocument.getReference()+ "_V" + System.currentTimeMillis();
        referencedDocument.setReference(oldReference);
        update(referencedDocument);
        try {
            myT.setContent(extractTextFromDocument(file, "fra+ara"));
        } catch (Exception e) {
            e.printStackTrace();
            myT.setContent("");
        }
        myT.setId(null);
        myT.setVersionne(true);
        myT.setUploadDate(LocalDateTime.now());
        Document t = create(myT, file);
        searchService.createDocumentInElastic(t);
        notificationDocument.notifyDocumentUpdate(documentDto);
        if(withIndex) {notifyAndUpdateIndexElements(t,myT);}
        return converter.toDto(t);
    }
    private void notifyAndUpdateIndexElements(Document t, Document myT) {
        if (myT.getDocumentIndexElements() != null && !myT.getDocumentIndexElements().isEmpty()) {
            for (DocumentIndexElement index : myT.getDocumentIndexElements()) {
                DocumentIndexElement documentIndexElement = new DocumentIndexElement();
                documentIndexElement.setDocument(t);
                documentIndexElement.setIndexElement(index.getIndexElement());
                documentIndexElement.setValue(index.getValue());
                documentIndexElement.setDescription(index.getDescription());
                indexElementAdminService.create(documentIndexElement);
            }
        }
    }
    @Override
    public Document create(Document t, MultipartFile file) {
        uploadToMinio(t, file);
        return create(t);
    }
    @Override
    public Document create(Document t, byte[] bytes) {
        uploadToMinio(t, bytes);
        return create(t);
    }
    public void uploadToMinio(Document t, MultipartFile file) {
        try {
            String superior = "";
            String entity = "";
            if(Objects.nonNull(t.getUtilisateur())){
                superior = t.getUtilisateur().getNom()+"_"+t.getUtilisateur().getPrenom();
            }
            if(Objects.nonNull(t.getEntiteAdministrative())){
                entity = t.getEntiteAdministrative().getLibelle();
            }
            t.setReferenceGed(sendDocumentToMinioWithStructure(file, superior, entity, file.getOriginalFilename()));
        } catch (IOException e) {
            throw new RuntimeException("Could not send the document to minio");
        }
    }

    public void uploadToMinio(Document t, byte[] bytes) {
        try {
            String superior = "";
            String entity = "";
            if(Objects.nonNull(t.getUtilisateur())){
                superior = t.getUtilisateur().getNom()+"_"+t.getUtilisateur().getPrenom();
            }
            if(Objects.nonNull(t.getEntiteAdministrative())){
                entity = t.getEntiteAdministrative().getLibelle();
            }
            t.setReferenceGed(sendDocumentToMinioWithStructure(bytes, superior, entity, t.getReference()));
        } catch (IOException e) {
            throw new RuntimeException("Could not send the document to minio");
        }
    }



    private String sendDocumentToMinioWithStructure(MultipartFile file, String superior, String entity, String fileName) throws IOException {
        timeLogger.startLogging("Sending document to minio from the backend");
        // Create a RestTemplate instance
        RestTemplate restTemplate = new RestTemplate();

        // Set up the URL
        String url = minioURL+UPLOAD_STRUCTURED_FILE_ENDPOINT;

        // Create the form data
        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
        ByteArrayResource byteArrayResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return StringUtil.isNotEmpty(fileName) ? fileName : file.getOriginalFilename();
            }
        };
        formData.add("file", byteArrayResource);
        formData.add("superior", superior);
        formData.add("entity", entity);
        formData.add("fileName", byteArrayResource.getFilename());

        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Create the request entity with headers and form data
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        timeLogger.endLogging("Reveived a response from minio");

        // Get the response body
        String responseBody = responseEntity.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.get("id").asText();
    }

    private String sendDocumentToMinioWithStructure(byte[] bytes, String superior, String entity, String fileName) throws IOException {
        timeLogger.startLogging("Sending document to minio from the backend");
        // Create a RestTemplate instance
        RestTemplate restTemplate = new RestTemplate();

        // Set up the URL
        String url = minioURL+UPLOAD_STRUCTURED_FILE_ENDPOINT;

        // Create the form data
        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
        ByteArrayResource byteArrayResource = new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return StringUtil.isNotEmpty(fileName) ? fileName : "file";
            }
        };
        formData.add("file", byteArrayResource);
        formData.add("superior", superior);
        formData.add("entity", entity);
        formData.add("fileName", byteArrayResource.getFilename());

        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Create the request entity with headers and form data
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        timeLogger.endLogging("Reveived a response from minio");

        // Get the response body
        String responseBody = responseEntity.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.get("id").asText();
    }

    private String sendDocumentArchiveToMinioWithStructure(Long id, String versionId) throws IOException {
           try{
               RestTemplate restTemplate = new RestTemplate();
               Document document = dao.findById(id).orElseThrow(() -> new RessourceNotFoundException("No document found with id " + id));
               UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(minioURL)
                       .path(MOVE_STRUCTURED_ARCHIVE_FILE_ENDPOINT)
                       .path(document.getReferenceGed());
               if (versionId != null) {
                   builder.queryParam("versionId", versionId);
            }
        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(null,headers);

        ResponseEntity<String> responseEntity = restTemplate.postForEntity(builder.toUriString(), requestEntity, String.class);

        // Get the response body
        if (responseEntity.getStatusCode().is2xxSuccessful()) {

            String responseBody = responseEntity.getBody();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("id").asText();
        } else {
            throw new RuntimeException("Failed to send document archive to Minio. HTTP Status: " + responseEntity.getStatusCodeValue());
        }
    } catch (IOException e) {
        throw e; // Rethrow IOException to maintain current exception handling behavior
    } catch (Exception e) {
        throw new RuntimeException("Error sending document archive to Minio: " + e.getMessage(), e);
    }
        }
    @Override
    public String viewArchiveFileFromMinio(Long id, String versionId) {
        RestTemplate restTemplate = new RestTemplate();
        ArchiveFinal archiveFinal = archiveDao.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Archive found with id " + id));
        String url = minioURL + DOWNLOAD_FILE_ENDPOINT + archiveFinal.getReferenceGed();
        if (versionId != null) {
            url += "?versionId=" + versionId;
        }
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("Failed to Get the file from the service. HTTP Status: " + responseEntity.getStatusCode());
        }
    }

    @Override
    public byte[] downloadFileFromService(Long id, String versionId) {
        // Create a RestTemplate instance
        RestTemplate restTemplate = new RestTemplate();

        // Set up the URL with id and optional versionId parameter
        Document document = dao.findById(id).orElseThrow(() -> new RessourceNotFoundException("No document found with id " + id));
        String url = minioURL + DOWNLOAD_FILE_ENDPOINT + document.getReferenceGed();
        if (versionId != null) {
            url += "?versionId=" + versionId;
        }
//        System.out.println("Url : "+url);
        ResponseEntity<byte[]> responseEntity = restTemplate.getForEntity(url, byte[].class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("Failed to download the file from the service. HTTP Status: " + responseEntity.getStatusCode());
        }
    }
    @Override
    public String previewFileFromService(Long id, String versionId) {
        RestTemplate restTemplate = new RestTemplate();
        Document document = dao.findById(id).orElseThrow(() -> new RessourceNotFoundException("No document found with id " + id));
        String url = minioURL + PREVIEW_FILE_ENDPOINT + document.getReferenceGed();
        if (versionId != null) {
            url += "?versionId=" + versionId;
        }
//        System.out.println("Url : "+url);
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("Failed to download the file from the service. HTTP Status: " + responseEntity.getStatusCode());
        }
    }

    @Override
    public List<Document> findPaginatedByCriteria(DocumentCriteria criteria, int page, int pageSize, String order, String sortField) {
        List<Document> allByCriteria = super.findPaginatedByCriteria(criteria, order, sortField);
        int startIndex = page * pageSize;
        List<Document> filtred = allByCriteria.stream()
                .filter(document -> isNull(document.getDeleted()) || !document.getDeleted())
                .filter(document -> isNull(document.getArchive()) || !document.getArchive())
                .filter(this::userCanSee)
                .collect(Collectors.toList());
        int endIndex = Math.min(startIndex + pageSize, filtred.size());
        return filtred.subList(startIndex, endIndex);

    }

    @Override
    public PaginatedList findPaginatedListByCriteria(DocumentCriteria criteria, int page, int pageSize, String order, String sortField) {
        List<Document> allByCriteria = super.findPaginatedByCriteria(criteria, order, sortField);
        int startIndex = page * pageSize;
        List<Document> filtred = allByCriteria.stream()
                .filter(document -> isNull(document.getDeleted()) || !document.getDeleted())
                .filter(document -> isNull(document.getArchive()) || !document.getArchive())
                .filter(this::userCanSee)
                .collect(Collectors.toList());
        int endIndex = Math.min(startIndex + pageSize, filtred.size());
        List<Document> list = filtred.subList(startIndex, endIndex);

        list = converter.copyIncludeExcludeItems(list, criteria.getIncludes(), criteria.getExcludes());
        converter.initObject(true);
        converter.initList(true);
        List<DocumentDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            paginatedList.setDataSize(filtred.size());
        }
        return paginatedList;
    }

    @Override
    public PaginatedList findPaginatedArchiveListByCriteria(DocumentCriteria criteria, int page, int pageSize, String order, String sortField) {
        List<Document> allByCriteria = super.findPaginatedByCriteria(criteria, order, sortField);
        int startIndex = page * pageSize;
        List<Document> filtred = allByCriteria.stream()
                .filter(document -> isNull(document.getDeleted()) || !document.getDeleted())
                .filter(Document::getArchive)
                .filter(this::userCanSee)
                .collect(Collectors.toList());
        int endIndex = Math.min(startIndex + pageSize, filtred.size());
        List<Document> list = filtred.subList(startIndex, endIndex);

        list = converter.copyIncludeExcludeItems(list, criteria.getIncludes(), criteria.getExcludes());
        converter.initObject(true);
        converter.initList(true);
        List<DocumentDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            paginatedList.setDataSize(filtred.size());
        }
        return paginatedList;
    }

    @Override
    public PaginatedList findPaginatedListByListCriteria(List<DocumentCriteria> criteriaList, int page, int pageSize, String order, String sortField) {
        Set<Document> allDocuments = new HashSet<>();
        for (DocumentCriteria criteria : criteriaList) {
            allDocuments.addAll(super.findPaginatedByCriteria(criteria, order, sortField));
        }

        List<Document> filteredDocuments = allDocuments.stream()
                .filter(document -> document.getDeleted() == null || !document.getDeleted())
                .filter(document -> document.getArchive() == null || !document.getArchive())
                .filter(this::userCanSee)
                .collect(Collectors.toList());

        int startIndex = page * pageSize;
        int endIndex = Math.min(startIndex + pageSize, filteredDocuments.size());
        List<Document> paginatedDocuments = filteredDocuments.subList(startIndex, endIndex);

        paginatedDocuments = converter.copyIncludeExcludeItems(paginatedDocuments, criteriaList.get(0).getIncludes(), criteriaList.get(0).getExcludes());
        converter.initObject(true);
        converter.initList(true);
        List<DocumentDto> documentDtos = converter.toDto(paginatedDocuments);

        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(documentDtos);
        paginatedList.setDataSize(filteredDocuments.size());
        return paginatedList;
    }

    @Override
    public List<Document> findAllByKeyWord(String keyword) {
        List<Long> documentIds = indexationService.findDocumentIdsByKeyWord(keyword);
        return dao.findAllById(documentIds).stream().filter(this::userCanSee).collect(Collectors.toList());
    }

    @Override
    public List<Document> findPaginatedByKeyWord(String keyword, DocumentCriteria criteria) {
        List<Document> documents = searchService.findPaginatedByKeyWord(keyword,criteria);
        return documents.stream().filter(this::userCanSee).collect(Collectors.toList());
    }

    @Override
    public List<Document> findPaginatedByKeyWordIndex(String keyword, DocumentCriteria criteria) {
        List<Document> documents = searchService.findPaginatedByKeyWordIndex(keyword,criteria);
        return documents.stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public List<Document> findAllDocuments(){
        return dao.findAll();
    }
    @Override
    @Transactional
    public List<Integer> findDistinctYears(){return archiveYearsDao.findAllYear();
    }
    @Override
    public PaginatedList findPaginatedByYear(Integer year, DocumentCriteria criteria) {

        try {
            List<ArchiveFinalDto> dtos = getArchiveFinalDtosByYear(year);
            int startIndex = criteria.getPage() * criteria.getMaxResults();
            int endIndex = Math.min(startIndex + criteria.getMaxResults(), dtos.size());
            List<ArchiveFinalDto> dtosPage = dtos.subList(startIndex, endIndex);

            PaginatedList paginatedList = new PaginatedList();
            paginatedList.setList(dtosPage);
            paginatedList.setDataSize(dtos.size());
            return paginatedList;
        } catch (Exception e) {
            e.printStackTrace();
            return new PaginatedList();
        }
    }
    private List<ArchiveFinalDto> getArchiveFinalDtosByYear(Integer year)   {
        List<ArchiveFinal> archiveFinalList = archiveDao.findArchiveIdsByYear(year);
        return archiveToArchiveDto(archiveFinalList);
    }

    public List<ArchiveFinalDto> archiveToArchiveDto(List<ArchiveFinal> items) {
        if (items == null || items.isEmpty()) {
            return Collections.emptyList();
        } else {
            return items.stream()
                    .map(this::mapArchive)
                    .collect(Collectors.toList());
        }
    }

    private ArchiveFinalDto mapArchive(ArchiveFinal item) {
        ArchiveFinalDto dto = new ArchiveFinalDto();
        if (item.getId() != null) {
            dto.setId(item.getId());
        }
        if (StringUtil.isNotEmpty(item.getReference())) {
            dto.setReference(item.getReference());
        }
        if (StringUtil.isNotEmpty(item.getReferenceGed())) {
            dto.setReferenceGed(item.getReferenceGed());
        }
        if (StringUtil.isNotEmpty(item.getLigne())) {
            dto.setLigne(item.getLigne());
        }
        if (StringUtil.isNotEmpty(item.getColonne())) {
            dto.setColonne(item.getColonne());
        }if (StringUtil.isNotEmpty(item.getNumBoite())) {
            dto.setNumBoite(item.getNumBoite());
        }

        if(item.getUploadDate()!=null)
            dto.setUploadDate(DateUtil.dateTimeToString(item.getUploadDate()));
        if (StringUtil.isNotEmpty(item.getSnapShots())) {
            dto.setSnapShots(item.getSnapShots());
        }
        return dto;
    }
    @Override
    public int findPaginatedByYearSize(Integer year) {

        List<Document> documents = dao.findDocumentsByYear(year);

        // Filter documents based on user visibility
        List<Document> visibleDocuments = documents.stream()
                .filter(this::userCanSee)
                .collect(Collectors.toList());
        return visibleDocuments.size();    }

    @Override
    public PaginatedList findPaginatedByCriteriaDeleted(DocumentCriteria criteria, int page, int pageSize, String order, String sortField) {
        List<Document> allByCriteria = super.findPaginatedByCriteria(criteria);
        int startIndex = page * pageSize;
        List<Document> filtred = allByCriteria.stream()
                .filter(document -> isNull(document.getDeleted()) || document.getDeleted())
                .filter(this::userCanSee)
                .collect(Collectors.toList());
        int endIndex = Math.min(startIndex + pageSize, filtred.size());
        List<Document> list = filtred.subList(startIndex, endIndex);

        list = converter.copyIncludeExcludeItems(list, criteria.getIncludes(), criteria.getExcludes());
        converter.initObject(true);
        List<DocumentDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            paginatedList.setDataSize(filtred.size());
        }
        return paginatedList;
    }

    public Page<Document> findAllByIds(List<Long> ids, int page, int pageSize, String order, String field) {

        if (ids == null || ids.isEmpty()) {
            return Page.empty();
        }

        String sortOrder = (nonNull(order) && StringUtils.isNotBlank(order) && !"null".equals(order)) ? order : "desc";
        String sortField = (nonNull(field)&& StringUtils.isNotBlank(field) && !"null".equals(field)) ? field : "id";

        Pageable pageable = PageRequest.of(page, pageSize, Sort.Direction.fromString(isNull(sortOrder)? "desc" : sortOrder), sortField);

        return dao.findAllByIds(ids, pageable);
    }
    public Page<Document> findAllByIds(List<Long> ids, int page, int pageSize, String order, String field, boolean deleted) {

        if (ids == null || ids.isEmpty()) {
            return Page.empty();
        }

        String sortOrder = (nonNull(order) && StringUtils.isNotBlank(order) && !"null".equals(order)) ? order : "desc";
        String sortField = (nonNull(field)&& StringUtils.isNotBlank(field) && !"null".equals(field)) ? field : "id";

        Pageable pageable = PageRequest.of(page, pageSize, Sort.Direction.fromString(isNull(sortOrder)? "desc" : sortOrder), sortField);

        return dao.findAllByIds(ids, pageable, isNull(deleted)? false : deleted);
    }
    public Page<ArchiveFinal> findArchivesByIds(List<Long> ids, int page, int pageSize, String order, String field) {

        if (ids == null || ids.isEmpty()) {
            return Page.empty();
        }

        String sortOrder = (nonNull(order) && StringUtils.isNotBlank(order) && !"null".equals(order)) ? order : "desc";
        String sortField = (nonNull(field)&& StringUtils.isNotBlank(field) && !"null".equals(field)) ? field : "id";

        Pageable pageable = PageRequest.of(page, pageSize, Sort.Direction.fromString(isNull(sortOrder)? "desc" : sortOrder), sortField);

        return archiveDao.findAllByIds(ids, pageable);
    }

    private Boolean userCanSee(Document document){
        User user = getCurrentUser();
        if(isNull(user))
            throw new BusinessRuleException("user must be connected !");

        if (Boolean.TRUE.equals(document.getLocked())) {
            if (Objects.nonNull(document.getUtilisateur()) && document.getUtilisateur().getUsername().equalsIgnoreCase(user.getUsername())) {
                return true;
            }else  return false;
        }else {
            if (utilisateurService.isAgent(user)) {
                if (Objects.nonNull(document.getUtilisateur()) &&
                        document.getUtilisateur().getUsername().equalsIgnoreCase(user.getUsername())) {
                    return true;
                }

                Set<User> authorizedUsers = new HashSet<>();
                if (Objects.nonNull(document.getDocumentPartageUtilisateurs())) {
                    document.getDocumentPartageUtilisateurs().forEach(usrPartage -> {
                        if (Objects.nonNull(usrPartage.getUtilisateur())) {
                            authorizedUsers.add(usrPartage.getUtilisateur());
                        }
                    });
                }
                if (Objects.nonNull(document.getDocumentPartageGroupes())) {
                    document.getDocumentPartageGroupes().forEach(group -> {
                        if (Objects.nonNull(group.getGroupe()) && CollectionUtils.isNotEmpty(group.getGroupe().getGroupeUtilisateurs())) {
                            group.getGroupe().getGroupeUtilisateurs().forEach(groupUser -> authorizedUsers.add(groupUser.getUtilisateur()));
                        }
                    });
                }
                return authorizedUsers.stream().anyMatch(usr -> user.getUsername().equalsIgnoreCase(usr.getUsername()));
            }else if (Boolean.TRUE.equals(utilisateurService.isAdmin(user)) || isNull(document)) {
                return true;
            }else{
                Set<User> listAhtorizedUsers = new HashSet<>();
                if (Objects.nonNull(document.getUtilisateur()) &&
                        Objects.nonNull(document.getUtilisateur().getUsername()) &&
                        (document.getUtilisateur().getUsername().equalsIgnoreCase(user.getUsername())))
                    return true;
                if (Objects.nonNull(document.getEntiteAdministrative()) && Objects.nonNull(user)) {
                    Utilisateur utilisateur = utilisateurService.findByUsername(user.getUsername());
                    if (document.getEntiteAdministrative().getLibelle().equalsIgnoreCase(utilisateur.getEntiteAdministrative().getLibelle())) {
                        return true;
                    }
                }
                document.getDocumentPartageUtilisateurs().forEach(usrPartage -> {
                    if (Objects.nonNull(usrPartage.getUtilisateur())) {
                        listAhtorizedUsers.add(usrPartage.getUtilisateur());
                    }
                });
                document.getDocumentPartageGroupes().forEach(group -> {
                    if (Objects.nonNull(group.getGroupe()) && CollectionUtils.isNotEmpty(group.getGroupe().getGroupeUtilisateurs())) {
                        group.getGroupe().getGroupeUtilisateurs().forEach(groupUser -> listAhtorizedUsers.add(groupUser.getUtilisateur()));
                    }
                });
                return listAhtorizedUsers.stream().anyMatch(usr -> user.getUsername().equalsIgnoreCase(usr.getUsername()));
            }
        }
    }


    @Override
    public int getDataSize(DocumentCriteria criteria) {
        addEtablissementConstraint(criteria);
        criteria.setDeleted(false);
        DocumentSpecification mySpecification = (DocumentSpecification) super.constructSpecification(criteria);
        mySpecification.setDistinct(true);
        return ((Long) dao.count(mySpecification)).intValue();
    }
    @Override
    public int getDataSizeDataDeleted(DocumentCriteria criteria) {
        addEtablissementConstraint(criteria);
        criteria.setDeleted(true);
        DocumentSpecification mySpecification = (DocumentSpecification) super.constructSpecification(criteria);
        mySpecification.setDistinct(true);
        return ((Long) dao.count(mySpecification)).intValue();
    }
    @Override
    @Transactional
    public List<Document> updateQualityFlag(DocumentCriteria criteria, int page, int pageSize, String order, String sortField, Long percent) {
        List<Document> allByCriteria = super.findPaginatedByCriteria(criteria);
        List<Document> filtered = allByCriteria.stream()
                .filter(document -> isNull(document.getDeleted()) || !document.getDeleted())
                .collect(Collectors.toList());

        int numberOfDocumentsToSelect = Math.max(1, (int) Math.round(filtered.size() * (percent / 100.0)));

        List<Document> selectedDocuments= new ArrayList<>();
        List<Document> toSelectList = filtered.stream()
                .filter(this::userCanSee)
                .filter(document -> isNull(document.getQualityStatus()) || !document.getQualityStatus())
                .collect(Collectors.toList());
        if(toSelectList.size() < numberOfDocumentsToSelect){
            throw new RuntimeException("Cannot select documents you have only: " + toSelectList.size());
        }else if(toSelectList.size() > numberOfDocumentsToSelect){
            Collections.shuffle(toSelectList);
            selectedDocuments = toSelectList.subList(0, numberOfDocumentsToSelect);

            if(!selectedDocuments.isEmpty()){

                for (Document document : selectedDocuments) {
                    dao.updateQualityFlagById(document.getId());}}
        }
        return selectedDocuments;
    }


    @Override
    public int getDataSizeDataQuality(DocumentCriteria criteria) {
        addEtablissementConstraint(criteria);
        criteria.setQualityFlag(true);
        DocumentSpecification mySpecification = (DocumentSpecification) super.constructSpecification(criteria);
        mySpecification.setDistinct(true);
        return ((Long) dao.count(mySpecification)).intValue();
    }
    @Override
    @Transactional
    public DocumentDto updateQualityStatusById(Long id) {
        return performDocumentOperation(id, dao::updateQualityStatusById);
    }
    @Override
    @Transactional
    public DocumentDto rejectQualityStatusById(Long id) {
        return performDocumentOperation(id, dao::rejectQualityStatusById);
    }
    @Override
    @Transactional
    public DocumentDto lockDocumentById(Long id) {
        return performDocumentOperation(id, dao::lockDocumentById);
    }
    @Override
    @Transactional
    public DocumentDto unlockDocumentById(Long id) {
        return performDocumentOperation(id, dao::unlockDocumentById);
    }
    private DocumentDto performDocumentOperation(Long id, Consumer<Long> documentOperation) {
        if (id != null && Pattern.matches("\\d+", String.valueOf(id))) {
            Optional<Document> optionalDocument = dao.findById(id);
            if (optionalDocument.isPresent()) {
                Document updatedDocument = optionalDocument.get();
                documentOperation.accept(id);
                return converter.toDto(updatedDocument);
            } else {
                throw new RuntimeException("Document non trouvé pour l'ID : " + id);
            }
        } else {
            throw new IllegalArgumentException("ID de document invalide : " + id);
        }
    }
    @Override
    public String extractTextFromPDF(MultipartFile multipartFile) {
            return PdfUtils.extractTextFromPDF(multipartFile);
    }
    @Override
    public String extractTextFromDocument(MultipartFile file, String language){
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        body.add("language", language);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Collections.singletonList(MediaType.ALL));
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        String fullUrl = ocrUrl + OCR_API ;
        logger.info("--------ocr url with profile-----"+fullUrl);
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                fullUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        );
        logger.info("-response-----"+responseEntity);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody();
        } else {
            return "Error: " + responseEntity.getStatusCodeValue();
        }
    }

    public String extractTextFromDocument(byte[] file, String language){
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file));
        body.add("language", language);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Collections.singletonList(MediaType.ALL));
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        String fullUrl = ocrUrl + OCR_API ;
        logger.info("--------ocr url with profile-----"+fullUrl);
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                fullUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        );
        logger.info("-response-----"+responseEntity);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody();
        } else {
            return "Error: " + responseEntity.getStatusCodeValue();
        }
    }
    @Override
    public EchantillonDto createEchantillon(List<DocumentDto> documents, String nomEchantillon) {
        Echantillon echantillon = new Echantillon();
        echantillon.setNomEchantillon(nomEchantillon);

        List<Long> documentIds = documents.stream()
                .map(DocumentDto::getId)
                .collect(Collectors.toList());

        List<Document> documentEntities = dao.findByIdIn(documentIds);
        echantillon.setDocuments(documentEntities);
        echantillon.setEchantillonState(EchantillonState.EN_COURS);

        echantillon = echantillonDao.save(echantillon);
        return echantillonConverter.convertEchantillonToDto(echantillon);
    }
    @Override
    public List<Echantillon> getAllEchantillons() {
        return echantillonDao.findAll();
    }
    @Override
    public EchantillonDto addEchantillonNote( Long id,  String note) {

        Echantillon echantillon = echantillonDao.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Echantillon found with id " + id));
        echantillon.setNote(note);
        echantillonDao.save(echantillon);

        return echantillonConverter.convertEchantillonToDto(echantillon);
    }

    @Override
    public EchantillonDto validateLotEchantillon( Long id) {

        Echantillon echantillon = echantillonDao.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Echantillon found with id " + id));

        List<Document> documents = Optional.ofNullable(echantillon.getDocuments())
                .orElse(Collections.emptyList());

        long trueCount = documents.stream()
                .filter(document -> Boolean.TRUE.equals(document.getQualityStatus()))
                .count();
        long falseCount = documents.size() - trueCount;
        boolean isValid = trueCount >= falseCount;

        echantillon.setEchantillonState(isValid ? EchantillonState.VALID : EchantillonState.REJECT);
        echantillon = echantillonDao.save(echantillon);

        return echantillonConverter.convertEchantillonToDto(echantillon);
    }

    /*
    public void downloadAndSaveToFile(Long id, String versionId, File destinationFile) throws IOException {
        byte[] fileData = downloadFileFromService(id, versionId);

        // Write the data to a file
        try (FileOutputStream fos = new FileOutputStream(destinationFile)) {
            fos.write(fileData);
        }
    }
    */
    @Override
    public byte[] convertWordToPdf(InputStream inputStream) throws IOException {
        XWPFDocument document = new XWPFDocument(inputStream);

        // Créer un document PDF
        PDDocument pdfDocument = new PDDocument();
        PDPage page = new PDPage();
        pdfDocument.addPage(page);

        // Créer un contenu pour la page PDF
        PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, page);
        contentStream.setFont(PDType1Font.HELVETICA, 12);

        // Extraire le contenu du document Word et écrire dans le PDF
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            String text = paragraph.getText();
            contentStream.beginText();
            contentStream.newLineAtOffset(100, 700); // Position du texte
            contentStream.showText(text);
            contentStream.endText();
        }

        // Fermer le contenu du flux
        contentStream.close();

        // Convertir le document PDF en tableau d'octets
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfDocument.save(outputStream);

        // Fermer les documents
        pdfDocument.close();
        document.close();

        // Retourner le PDF sous forme de tableau d'octets
        return outputStream.toByteArray();
    }
    public void configure() {
        super.configure(Document.class,DocumentHistory.class, DocumentHistoryCriteria.class, DocumentSpecification.class);
    }
    @Override
    public List<DocumentDto> findByReferencePattern(String reference) {
        String[] parts = reference.split("_V");
        reference= parts.length > 0 ? parts[0] : reference;
        List<Document> documents = dao.findByReferenceContainingOrderByUpdatedOnDesc(reference);
        return documents.stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Document> findByNumeroEnregistrement(String numero) {
        Optional<List<Document>> result = dao.findByIndexElementValueAndLibelle(numero,indexNumeroEnregistrement);
        return result.orElseGet(Collections::emptyList);
    }

    public Document findBySignatureValidationCode(String code) {
        Optional<Document> optionalDocument = dao.findByDocumentSiagnatureCode(code);
        return optionalDocument.orElseThrow(() -> new RessourceNotFoundException("Document not found with signature validation code: " + code));
    }

}
