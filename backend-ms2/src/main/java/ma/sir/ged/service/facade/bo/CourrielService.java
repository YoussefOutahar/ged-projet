package ma.sir.ged.service.facade.bo;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import ma.sir.ged.WebSocket.UseCases.NotificationCourriel;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.*;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.dao.facade.core.bureauOrdre.IntervenantsCourrielRepository;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.bo.CourrielCreationServices.CourrielCreationInterface;
import ma.sir.ged.service.facade.bo.CourrielCreationServices.CourrielCreationUtils;
import ma.sir.ged.service.impl.admin.doc.DocumentAdminServiceImpl;
import ma.sir.ged.workflow.DTO.StepDTO;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.DTO.WorkflowPresetDTO;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.service.imp.WorkflowServiceImp;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielConverter;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.zynerator.security.bean.User;
import org.apache.commons.collections4.CollectionUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static ma.sir.ged.utils.TextUtils.convertToTitleCase;

@Service
public class CourrielService {

    @Autowired
    private CourrielsRepository courrielsRepository;

    @Autowired
    private CourrielConverter courrielConverter;

    @Autowired
    private CourrielHistoryService courrielHistoryService;

    @Autowired
    private DocumentDao documentDao;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private IntervenantsCourrielRepository intervenantsCourrielRepository;

    @Autowired
    private NotificationCourriel notificationCourriel;

    @Autowired
    private CourrielCreationUtils courrielCreationUtils;

    @Autowired
    private Map<String, CourrielCreationInterface> courrielCreationStrategies;

    @Autowired
    private DocumentAdminServiceImpl documentService;

    @Autowired
    private DocumentConverter documentConverter;
    @Autowired
    private UtilisateurAdminService utilisateurService ;
    @Autowired
    private WorkflowServiceImp workflowService ;
    @Autowired
    private  IntervenantsCourrielService intervenantsCourrielService;

    // Get ==============================
    public List<CourrielDto> getAllCourriels() {
        return  CollectionUtils.emptyIfNull(courrielsRepository.findAll()).stream().map(courrielConverter::toDto).collect(Collectors.toList());
    }
    public List<CourrielDto> getAllCourrielsNotDeleted() {
        List<CourrielBo> courriels = courrielsRepository.findAllByDeletedOrderByUpdatedOnDesc(false);
        return courriels.stream().map(courrielConverter::toDto).collect(Collectors.toList());
    }

    public Page<CourrielDto> getAllCourrielsByPlanClassement(long id, int page, int size) {
        return courrielsRepository.findDistinctByPlanClassementIdAndDeletedAndPereIsNullOrderByUpdatedOnDesc(id,false, PageRequest.of(page, size)).map(courrielConverter::toDto);
    }


    public Page<CourrielDto> getAllCourrielsPere(int page, int size) {
        return courrielsRepository.findDistinctByPereIsNullAndDeletedOrderByUpdatedOnDesc(false, PageRequest.of(page, size)).map(courrielConverter::toDto);
    }

    public Page<CourrielDto> getAllCourrielsPereByResponsable(Long responsableId,int page, int size) {
        return courrielsRepository.findDistinctByResponsableIdAndPereIsNullAndDeletedOrderByUpdatedOnDesc(responsableId,false, PageRequest.of(page, size)).map(courrielConverter::toDto);
}

    public Page<CourrielDto> getAllCourrielsByResponsableAndPlanClassement(long planclasementId, long responsableId, int page, int size) {
        return courrielsRepository.findByPlanClassementIdAndResponsableIdAndDeletedAndPereIsNullOrderByUpdatedOnDesc(planclasementId,responsableId,false, PageRequest.of(page, size)).map(courrielConverter::toDto);
    }

    public CourrielBo getCourrielById(Long id) {
        return courrielsRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Courriel avec l'ID " + id + " n'a pas été trouvé"));
    }

    public Page<CourrielDto> getAllCourrielsNearDeadline(int page, int size) {
        List<CourrielBo> allCourriersNearDeadline = courrielsRepository.findByDeletedAndEtatAvancementAndDateEcheanceBeforeOrderByUpdatedOnDesc(false, CourrielBoEtatAvancement.EN_ATTENTE,LocalDateTime.now());
        List<CourrielBo> courriersPereNearDeadline = getListOfCourriersPereFormListOfCourriers(allCourriersNearDeadline);
        return new PageImpl<>(courriersPereNearDeadline
                .subList(page*size,Math.min(page*size+size,courriersPereNearDeadline.size()))
                .stream().map(courrielConverter::toDto).collect(Collectors.toList()), PageRequest.of(page, size), courriersPereNearDeadline.size());
    }

    public Page<CourrielDto> getAllCourrielsNeedingAttention(Long intervenantId, int page, int size) {
        StatutIntervention[] statuts = {StatutIntervention.EN_ATTENTE,StatutIntervention.EN_COURS};
        List<CourrielBo> allCourriersNearDeadline = courrielsRepository.findCourrielNeedingIntervenantAttention(intervenantId,false, statuts);
        List<CourrielBo> courriersPereNearDeadline = getListOfCourriersPereFormListOfCourriers(allCourriersNearDeadline);
        return new PageImpl<>(courriersPereNearDeadline
                .subList(page*size,Math.min(page*size+size,courriersPereNearDeadline.size()))
                .stream().map(courrielConverter::toDto).collect(Collectors.toList()), PageRequest.of(page, size), courriersPereNearDeadline.size());
    }

    @NotNull
    private List<CourrielBo> getListOfCourriersPereFormListOfCourriers(List<CourrielBo> allCourriers) {
        List<CourrielBo> courriersPereNearDeadline = new ArrayList<>();
        allCourriers.forEach(courrielBo -> {
            CourrielBo firstPere = getFirstPere(courrielBo);
            if(!courriersPereNearDeadline.contains(firstPere)){
                courriersPereNearDeadline.add(firstPere);
            }
        });
        return courriersPereNearDeadline;
    }

    private CourrielBo getFirstPere(CourrielBo courrielBo) {
        if(courrielBo.getPere() == null){
            return courrielBo;
        } else {
            return getFirstPere(courrielBo.getPere());
        }
    }

    public Page<CourrielDto> getCourrielsBySearchKeyWord(String searchKeyWord, int page, int size, long intervenantId) {
        if(intervenantId == 0){
            return courrielsRepository.findBySearchKeyWord(false,searchKeyWord, PageRequest.of(page, size)).map(courrielConverter::toDto);
        }else {
            return courrielsRepository.findBySearchKeyWordAndIntervenantId(false,searchKeyWord,intervenantId, PageRequest.of(page, size)).map(courrielConverter::toDto);
        }
    }
    public List<CourrielBo> getCourrielsByIntervenantId(Long intervenatId){
        return courrielsRepository.findByIntervenantId(false, intervenatId);
    }
    public List<CourrielBo> filtrerCourriers(TypeCourriel type, LocalDateTime dateDebut, LocalDateTime dateFin, LocalDateTime today, boolean all) {
        List<CourrielBo> courriersFiltres = new ArrayList<>();
        User user = getCurrentUser();
        if(utilisateurService.isAdmin(user) && all){
            courriersFiltres = courrielsRepository.findAll();
        }else if(!all){
            courriersFiltres = getCourrielsByIntervenantId(user.getId());
        }
        courriersFiltres = courriersFiltres.stream()
                .filter(courriel -> courriel.getType() == type)
                .collect(Collectors.toList());
        if (dateDebut != null && dateFin != null) {
            courriersFiltres = courriersFiltres.stream()
                    .filter(courriel -> courriel.getDateReception().isAfter(dateDebut) && courriel.getDateReception().isBefore(dateFin))
                    .collect(Collectors.toList());
        }
        if(today != null){
            courriersFiltres = courriersFiltres.stream()
                    .filter(courriel -> courriel.getDateCreation().toLocalDate().isEqual(today.toLocalDate()))
                    .collect(Collectors.toList());
        }
        return courriersFiltres;
    }

        // Post ==============================

    @Transactional
    public CourrielBo handleCourriel(Long courrielPereId, CourrielBo courrielBo, List<MultipartFile> files, String createCourrielOperationType) {
        return courrielCreationStrategies.get(createCourrielOperationType).createCourriel(courrielPereId, courrielBo,files);
    }
    public void sendToWorkflow(CourrielDto dto, Long id){
        List<Document> documents = courrielsRepository.findById(id).get().getDocuments();
        documentConverter.init(true);
        if(dto.getElements() != null) {
            boolean hasWorkflow = Boolean.parseBoolean(dto.getElements().get("hasWorkflow"));
            String workflow = dto.getElements().get("WorkflowDto");
            ObjectMapper mapper = new ObjectMapper();
            try {
                WorkflowDTO workflowDTO = mapper.readValue(workflow, WorkflowDTO.class);
                if(workflowDTO.getWorkflowPresetDTO().getId() != 0) {
                    workflowDTO.setDocuments(documentConverter.toDto(documents));
                    Workflow wf = workflowService.createWorkflow(workflowDTO);
                    workflowService.associateCourrielBoWithWorkflow(id, wf.getId());
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public List<CourrielDto> getCourrielsByWorkflowId(Long workflowId) {
        List<CourrielBo> courriels = courrielsRepository.findByWorkflowId(workflowId);
        return courriels.stream().map(courrielConverter::toDto).collect(Collectors.toList());
    }
    // Put ==============================
    public CourrielDto updateCourriel(Long id, CourrielDto courrielDto,boolean registerHistoryEntry) {
        CourrielBo courrielBoFromDB = courrielsRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Courriel avec l'ID " + id + " n'a pas été trouvé."));
        CourrielBo courrielBoFromDto =  courrielConverter.toEntity(courrielDto);

        List<Document> documents = courrielBoFromDto.getDocuments().stream()
                .map(document -> documentDao.findById(document.getId()).orElseGet(() -> documentDao.save(document)))
                .collect(Collectors.toList());
        courrielBoFromDto.setDocuments(documents);
        
        if (courrielBoFromDto.getIntervenants() != null){
            List<IntervenantsCourriel> intervenants = courrielBoFromDto.getIntervenants().stream()
                    .map(intervenant -> intervenantsCourrielRepository.findById(intervenant.getId()).orElseGet(() -> intervenantsCourrielRepository.save(intervenant)))
                    .collect(Collectors.toList());
            courrielBoFromDto.setIntervenants(intervenants);
        }

        boolean etatAvancementUpdated = checkForEtatAvancementUpdate(courrielBoFromDB,courrielBoFromDto);
        CourrielBoEtatAvancement oldEtatAvancement = courrielBoFromDB.getEtatAvancement();

        BeanUtils.copyProperties(courrielBoFromDto, courrielBoFromDB, "id");

        courrielCreationUtils.handleNumeroCourriel(courrielBoFromDB);

        CourrielBo afterSaveCourriel = courrielsRepository.save(courrielBoFromDB);

        if (registerHistoryEntry) {
            if(etatAvancementUpdated){
                courrielHistoryService.registerHistoryEntry(
                        afterSaveCourriel,
                        "Etat  du courriel changer de "+convertToTitleCase(oldEtatAvancement.toValue())+" a "+convertToTitleCase(afterSaveCourriel.getEtatAvancement().toValue()),
                        HistoryEntryType.ETAT_CHANGE
                );
                notificationCourriel.notifyCourrielEtatAvancement(afterSaveCourriel,afterSaveCourriel.getEtatAvancement());
            } else {
                courrielHistoryService.registerHistoryEntry(afterSaveCourriel,"Courriel modifier",HistoryEntryType.MODIFICATION);
            }
        }

        return courrielConverter.toDto(afterSaveCourriel);
    }

    public List<Document> getDocumentsOfCourriel(Long courrielId) {
        CourrielBo courriel = courrielsRepository.findById(courrielId)
                .orElseThrow(() -> new RuntimeException("Courriel not found with id: " + courrielId));
        return new ArrayList<>(courriel.getDocuments());
    }

    @Transactional
    public CourrielDto addDocsToCourriel(Long courrielId,List<DocumentDto> documentDtos, List<MultipartFile> files) {
        CourrielBo courriel = courrielsRepository.findById(courrielId)
                .orElseThrow(() -> new RessourceNotFoundException("Courriel avec l'ID " + courrielId + " n'a pas été trouvé."));

        List<Document> newDocuments = new ArrayList<>();
        documentDtos.forEach(documentDto -> {
            Document document = documentConverter.toItem(documentDto);
            newDocuments.add(document);
        });

        List<Document> documents = new ArrayList<>();
        for(Document documnet: courriel.getDocuments()) {
            documents.add(documnet);
        }

        CourrielDto updatedCourriel = null;

        for (int index = 0; index < newDocuments.size(); index++) {
            newDocuments.get(index).setCourriel(courriel);
            newDocuments.get(index).setReference(courrielCreationUtils.generateDocumentReference(files.get(index).getOriginalFilename(),courriel));
            documentService.uploadToMinio(newDocuments.get(index), files.get(index));
            newDocuments.set(index, documentService.create(newDocuments.get(index)));
            documents.add(newDocuments.get(index));
        }
        courriel.setDocuments(documents);
        updatedCourriel = updateCourriel(courrielId, courrielConverter.toDto(courriel),false);

        courrielHistoryService.registerHistoryEntry(courriel, "Ajout de documents", HistoryEntryType.MODIFICATION);

        return updatedCourriel;
    }

    @Transactional
    public CourrielDto addExistingDocsToCourriel(Long courrielId,List<DocumentDto> documentDtos) {
        CourrielBo courriel = courrielsRepository.findById(courrielId)
                .orElseThrow(() -> new RessourceNotFoundException("Courriel avec l'ID " + courrielId + " n'a pas été trouvé."));

        List<Document> newDocuments = new ArrayList<>();
        documentDtos.forEach(documentDto -> {
            Document document = documentConverter.toItem(documentDto);
            newDocuments.add(document);
        });

        List<Document> documents = new ArrayList<>();
        for(Document documnet: courriel.getDocuments()) {
            documents.add(documnet);
        }

        CourrielDto updatedCourriel = null;

        newDocuments.forEach(document -> {
            document.setCourriel(courriel);
            documents.add(document);
        });
        courriel.setDocuments(documents);

//        updatedCourriel = updateCourriel(courrielId, courrielConverter.toDto(courriel),false);
        updatedCourriel = courrielConverter.toDto(addExistingDocuments(courriel));

        courrielHistoryService.registerHistoryEntry(courriel, "Ajout de documents", HistoryEntryType.MODIFICATION);

        return updatedCourriel;
    }

    @Transactional
    public CourrielBo addExistingDocuments ( CourrielBo courrielBo ) {
//        handleExistingCourrielDocs(courrielBo);
        entityManager.persist(courrielBo);
        courrielsRepository.save(courrielBo);
        notificationCourriel.notifyCourrielCreation(courrielBo);
        return courrielBo;
    }

    @Transactional
    public CourrielDto deleteDocumentFromCourriel(Long courrielId, Long documentId) {
        CourrielBo courriel = getCourrielById(courrielId);

        List<Document> documents = new ArrayList<>();
        Document documentToDelete = null;

        for (Document document : courriel.getDocuments()) {
            if (!Objects.equals(document.getId(), documentId)) {
                documents.add(document);
            } else {
                documentToDelete = document;
                document.setCourriel(null);
            }
        }
        courriel.setDocuments(documents);

        if (documentToDelete != null) {
            documentService.delete(documentToDelete);
        }

        courrielHistoryService.registerHistoryEntry(courriel, "Suppression de document", HistoryEntryType.MODIFICATION);
        CourrielDto updatedCourrielDto = updateCourriel(courrielId, courrielConverter.toDto(courriel), false);

        return updatedCourrielDto;
    }

    public boolean checkForEtatAvancementUpdate(CourrielBo old,CourrielBo newC){
        return old.getEtatAvancement() != newC.getEtatAvancement();
    }

    // Delete ==============================
    public void deleteCourriel(Long id) {
        CourrielBo courrielBo = courrielsRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Courriel avec l'ID " + id + " n'a pas été trouvé."));
        courrielBo.setDeleted(true);
        courrielHistoryService.registerHistoryEntry(courrielBo,"Courriel supprimer",HistoryEntryType.DELETION);
        courrielsRepository.save(courrielBo);
    }

    public void handleDocUpdateAndCourrier(Document newDoc, Document oldDoc) {
        if(oldDoc.getCourriel() != null) {
            Optional<CourrielBo> courrielBo = courrielsRepository.findById(oldDoc.getCourriel().getId());
            if (courrielBo.isPresent()) {
                CourrielBo courriel = courrielBo.get();
                newDoc.setCourriel(courriel);
                courriel.getDocuments().add(newDoc);
                courrielsRepository.save(courriel);

                IntervenantsCourriel lastIntervention = courriel.getIntervenants().get(courriel.getIntervenants().size() - 1);
                intervenantsCourrielService.handleDocUpdateAndIntervention(lastIntervention, oldDoc, newDoc);
            }
        }
    }
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal != null && principal instanceof User) {
            return (User) principal;
        } else if (principal != null && principal instanceof String) {
            return utilisateurService.findByUsername(principal.toString());
        } else {
            return null;
        }
    }
}