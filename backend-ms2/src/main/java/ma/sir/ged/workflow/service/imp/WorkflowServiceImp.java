package ma.sir.ged.workflow.service.imp;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.Signature.QrCode.service.QRCodeService;
import ma.sir.ged.WebSocket.UseCases.NotificationParapheur;
import ma.sir.ged.WebSocket.Wokflow.NotificationWorkflow;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.config.ImplementMultipartFile.ByteArrayMultipartFile;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.parapheur.FicheParapheurService;
import ma.sir.ged.service.impl.admin.doc.ExcelService;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.entity.AuditWorkflow;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.STEP_STATUS;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.mapper.WorkflowMapper;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.workflow.repository.VisibiliteRepository;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.workflow.service.sev.AuditWorkflowService;
import ma.sir.ged.workflow.service.sev.WorkflowService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.parapheur.ParapheurConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.ParapheurDto;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import ma.sir.ged.zynerator.util.ListUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Data
@Slf4j
@Service
public class WorkflowServiceImp implements WorkflowService {

    public final WorkflowRepository workflowRepository;
    public final CourrielsRepository courrielBoRepository;
    public final ParapheurRepository parapheurRepository;
    public final WorkflowMapper workflowMapper;
    public final StepRepository stepRepository;
    public final VisbiliteService visbiliteService;
    private final VisibiliteRepository visibiliteRepository;
    private final QRCodeService qrCodeService;
    private final DocumentAdminService documentAdminService;
    private final DocumentDao documentdao;
    private final PlanClassementService planClassementService;
    private final DocumentConverter documentConverter;
    private final AuditWorkflowService auditWorkflowService ;
    private final ParapheurConverter parapheurConverter;
    private final UtilisateurAdminService utilisateurService;
    private final NotificationWorkflow notificationWorkflow;
    private final ExcelService excelService;
    private final NotificationParapheur notificationParapheur;

    @Lazy
    @Autowired
    private FicheParapheurService ficheParapheurService;

    @Transactional
    public Workflow createWorkflow(WorkflowDTO workflowDTO) throws Exception {
        Workflow workflow = workflowMapper.DTOtoWorkflow(workflowDTO);
        workflow.setStatus(WorkflowStatus.OPEN);

        List<MultipartFile> pieceJointes = new ArrayList<>();
        for (Document document : workflow.getPiecesJointes()) {
            byte[] file = documentAdminService.downloadFileFromService(document.getId(), null);
            MultipartFile multipartFile = new ByteArrayMultipartFile("file", document.getReferenceGed(), "application/pdf", file);
            pieceJointes.add(multipartFile);
        }
        int documentCount = 0;
        int numberOfExcels = 0;
        for (MultipartFile file : pieceJointes) {
            if (excelService.isExcelFile(file)) {
                documentCount += excelService.countRows(file);
                numberOfExcels++;
            }
        }
        workflow.setDocumentCount(documentCount - numberOfExcels); // I subtracted the number of header for multiple docs case

        Workflow savedWorkflow = workflowRepository.save(workflow);
        auditWorkflowService.saveAudit(savedWorkflow.getId(), "Demarer");
        CollectionUtils.emptyIfNull(savedWorkflow.getStepList()).forEach(step -> step.setWorkflow(savedWorkflow));
        notificationWorkflow.notifyWorkflowCreation(savedWorkflow);
        return savedWorkflow;

    }

    @Override
    @Transactional
    public WorkflowDTO getWorkflowById(Long id) {
        Optional<Workflow> workflow = workflowRepository.findById(id);
        if (workflow.isPresent()) {
            return workflowMapper.workflowtoDTO(workflow.get());
        } else {
            throw new EntityNotFoundException("Workflow not found with id " + id);
        }
    }
    @Transactional
    public void associateCourrielBoWithWorkflow(Long courrielBoId, Long workflowId) {
        CourrielBo courrielBo = courrielBoRepository.findById(courrielBoId).orElseThrow(() -> new RuntimeException("CourrielBo not found"));
        Workflow workflow = workflowRepository.findById(workflowId).orElseThrow(() -> new RuntimeException("Workflow not found"));

        courrielBo.setWorkflow(workflow);
        courrielBoRepository.save(courrielBo);
    }

    @Override
    public List<DocumentDto> getAllDocumentsActionsFromWorkflow(Long workflowId) {
        Workflow workflow = workflowRepository.findById(workflowId).orElseThrow(() -> new RuntimeException("Workflow not found"));
        List<Document> documentsAction = workflow.getStepList().stream()
                .flatMap(step -> step.getDocumentsActions().stream())
                .collect(Collectors.toList());
        return documentConverter.toDto(documentsAction);
    }
    @Override
    @Transactional
    public List<WorkflowDTO> getAllWorkflows() {
        return workflowMapper.transferList(workflowRepository.findAll());
    }
    @Override
    @Transactional
    public Workflow updateWorkflow(WorkflowDTO workflowDTO) throws Exception {
        if (workflowDTO.getId() == null) {
            throw new IllegalArgumentException("Workflow ID is required for update.");
        }
        Workflow workflow = workflowMapper.DTOtoWorkflow(workflowDTO);
        return workflowRepository.save(workflow);
    }

    @Override
    public WorkflowDTO annulerWorkflow(Long id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: " + id));
        for(Step s:workflow.getStepList()){
            s.setStatus(STEP_STATUS.Annulled);
            stepRepository.save(s);
        }
        workflow.setStatus(WorkflowStatus.Annulled);
        Workflow workflowSaved =workflowRepository.save(workflow);
        AuditWorkflow audit = auditWorkflowService.saveAudit(workflow.getId(), "Annuler");
        notificationWorkflow.notifyWorkflowAnnuled(workflowSaved);
        WorkflowDTO dto = workflowMapper.workflowtoDTO(workflowSaved);
        return dto;
    }

    @Override
    public WorkflowDTO reouvrirWorkflow(Long id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: " + id));
        for(Step s:workflow.getStepList()){
            s.setStatus(STEP_STATUS.PARTIAL);
            stepRepository.save(s);
        }
        workflow.setStatus(WorkflowStatus.REOPENED);
        Workflow workflowSaved =workflowRepository.save(workflow);
        AuditWorkflow audit = auditWorkflowService.saveAudit(workflow.getId(), "Reouvrir");
        notificationWorkflow.notifyWorkflowReouvrir(workflowSaved);
        WorkflowDTO dto = workflowMapper.workflowtoDTO(workflowSaved);
        return dto;
    }

    @Override
    public WorkflowDTO closeWorkflow(Long id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: " + id));
        for(Step s:workflow.getStepList()){
            s.setStatus(STEP_STATUS.DONE);
            stepRepository.save(s);
        }
        workflow.setStatus(WorkflowStatus.CLOSED);
        Workflow workflowSaved =workflowRepository.save(workflow);
        AuditWorkflow audit = auditWorkflowService.saveAudit(workflow.getId(), "Cloturer");
        notificationWorkflow.notifyWorkflowClosed(workflowSaved);
        WorkflowDTO dto = workflowMapper.workflowtoDTO(workflowSaved);
        return dto;
    }


    @Override
    @Transactional
    public void deleteWorkflow(Long id) {
        auditWorkflowService.deleteByWorkflowId(id);
        workflowRepository.deleteById(id);
    }

    @Override
    public List<WorkflowDTO> gewWorkflowByInitiateurId(Long id , WorkflowStatus status) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        return workflowMapper.transferList( workflowsStatusBySteps( workflowRepository.findWorkflowByInitiateurIdAndStatus(id,status,sort)));
    }

    @Override
    public Page<WorkflowDTO> getWorkflowByInitiateurId(Long id ,WorkflowStatus status , int page , int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        return workflowRepository.findWorkflowByInitiateurIdAndStatus(id, status, PageRequest.of(page, size, sort)).map(Workflow->
        {
            this.updateWorkflowStatusBySteps(Workflow);
            return workflowMapper.workflowtoDTO(Workflow);
        }
        );
    }
    @Transactional
    public Page<WorkflowDTO> getWorkflowByInitiateurIdVisble(Long id, WorkflowStatus status, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        List<Workflow> allWorkflows;
        if (status == WorkflowStatus.OPEN) {
            allWorkflows = workflowsStatusBySteps(workflowRepository.findWorkflowByStatusIn(Arrays.asList(WorkflowStatus.OPEN, WorkflowStatus.REOPENED), sort));
        } else {
            allWorkflows = workflowsStatusBySteps(workflowRepository.findWorkflowByStatus(status, sort));
        }

        Set<WorkflowDTO> visibleWorkflows = new HashSet<>();
        for (Workflow workflow : allWorkflows) {
            boolean userCanView = visbiliteService.canUserViewWorkflow(workflow.getWorkflowPreset().getId(), id);
            if (userCanView || workflow.getInitiateur().getId().equals(id)) {
                visibleWorkflows.add(workflowMapper.workflowtoDTO(workflow));
            }
        }

        List<WorkflowDTO> visibleWorkflowsList = new ArrayList<>(visibleWorkflows);
        visibleWorkflowsList.sort((w1, w2) -> w2.getId().compareTo(w1.getId()));

        int start = (int) PageRequest.of(page, size, sort).getOffset();
        int end = Math.min((start + PageRequest.of(page, size, sort).getPageSize()), visibleWorkflowsList.size());
        List<WorkflowDTO> pagedVisibleWorkflows = visibleWorkflowsList.subList(start, end);

        return new PageImpl<>(pagedVisibleWorkflows, PageRequest.of(page, size, sort), visibleWorkflowsList.size());
    }


    @Transactional
    public List<Workflow> workflowsStatusBySteps(List<Workflow> workflowList){

        for (Workflow workflow : workflowList) {
            if (workflow.getStatus().equals(WorkflowStatus.CLOSED)) {
                continue;
            }

            boolean allStepsDone = true;
            for (Step step : workflow.getStepList()){
                if (!step.getStatus().equals(STEP_STATUS.DONE)) {
                    // S'il y a au moins une étape non terminée, le workflow n'est pas entièrement terminé
                    allStepsDone = false;
                    break;
                }
            }

            if (allStepsDone) {
                // Si toutes les étapes sont terminées, mettez à jour le statut du workflow à "closed"
                workflow.setStatus(WorkflowStatus.CLOSED);
                AuditWorkflow audit = auditWorkflowService.saveAudit(workflow.getId(), "Cloturer");
                notificationWorkflow.notifyWorkflowClosed(workflow);

            }
        }

        return workflowRepository.saveAll(workflowList);
    }


    @Transactional
    public Workflow updateWorkflowStatusBySteps(Workflow workflow) {
        if (workflow.getStatus().equals(WorkflowStatus.CLOSED)) {
            return workflow; // Si le workflow est déjà fermé, retournez-le tel quel
        }

        boolean allStepsDone = true;
        for (Step step : workflow.getStepList()) {
            if (!step.getStatus().equals(STEP_STATUS.DONE)) {
                // S'il y a au moins une étape non terminée, le workflow n'est pas entièrement terminé
                allStepsDone = false;
                break;
            }
        }

        if (allStepsDone) {
            // Si toutes les étapes sont terminées, mettez à jour le statut du workflow à "closed"
            workflow.setStatus(WorkflowStatus.CLOSED);
            AuditWorkflow audit = auditWorkflowService.saveAudit(workflow.getId(), "Cloturer");
            notificationWorkflow.notifyWorkflowClosed(workflow);
        }

        return workflowRepository.save(workflow); // Retourne le workflow mis à jour
    }

    @Override
    @Transactional
    public void associateParapheurWithWorkflow(Long parapheurBoId, Long workflowId) {
        ParapheurBo parapheurBo = parapheurRepository.findById(parapheurBoId)
                .orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id"));
        Workflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        parapheurBo.setWorkflow(workflow);
        parapheurRepository.save(parapheurBo);
        log.info("Parapheur associated with workflow successfully");
    }

    @Override
    @Transactional
    public void generateAndAddFicheParapheur(Long workflowId, Long currentStepId) {
        Workflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        List<ParapheurBo> parapheurs = parapheurRepository.findByWorkflow(workflow);

        for (ParapheurBo parapheurBo : parapheurs) {
            if (parapheurBo.getParapheurEtat() != ParapheurEtat.REJETE) {
                generateAndAddFicheParapheurForParapheur(parapheurBo, workflow, currentStepId);
            }
        }
    }

    @Override
    @Transactional
    public void generateAndAddFicheParapheur(Long parapheurBoId, Long workflowId, Long currentStepId) {
        Workflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        ParapheurBo parapheurBo = parapheurRepository.findById(parapheurBoId).orElse(null);

        if (parapheurBo != null) {
            generateAndAddFicheParapheurForParapheur(parapheurBo, workflow, currentStepId);
        }
    }

    private void generateAndAddFicheParapheurForParapheur(ParapheurBo parapheurBo, Workflow workflow, Long currentStepId) {
        Set<Utilisateur> signers = getSigners(parapheurBo, workflow);

        CompletableFuture<Document> fichParaphFuture = ficheParapheurService
                .generateFicheParapheurWorkflowAsync(workflow.getId(), currentStepId, parapheurBo.getId());

        fichParaphFuture.thenAccept(ficheParaph -> handleFicheParapheurGeneration(ficheParaph, parapheurBo, signers))
                .exceptionally(e -> handleFicheParapheurError(e, parapheurBo, signers));
    }

    private Set<Utilisateur> getSigners(ParapheurBo parapheurBo, Workflow workflow) {
        Set<Utilisateur> signers = new HashSet<>(parapheurBo.getUtilisateurs());
        signers.add(workflow.getInitiateur());

        for (Step step : workflow.getStepList()) {
            if (step.getStepPreset().getActions().stream().anyMatch(action ->
                    action == ACTION.SIGN || action == ACTION.PARAPHER || action == ACTION.PRESIGNER)) {
                signers.addAll(step.getDestinataires().stream()
                        .map(UserDestinataire::getUtilisateur)
                        .collect(Collectors.toSet()));
            }
        }

        return signers;
    }

    private void handleFicheParapheurGeneration(Document ficheParaph, ParapheurBo parapheurBo, Set<Utilisateur> signers) {
        if (ficheParaph != null) {
            parapheurBo.setFichParaph(ficheParaph);
            parapheurRepository.save(parapheurBo);
            log.info("Fiche parapheur generated and added successfully for parapheur: {}", parapheurBo.getId());
            notificationParapheur.notifyFicheParapheurCreationWithEmail(new ArrayList<>(signers));
        }
    }

    private Void handleFicheParapheurError(Throwable e, ParapheurBo parapheurBo, Set<Utilisateur> signers) {
        log.error("Error generating fiche parapheur for parapheur: {}", parapheurBo.getId(), e);
        notificationParapheur.notifyErrorFicheParapheurCreation(new ArrayList<>(signers));
        return null;
    }

    public ParapheurBo getLastParapheurForWorkflow(Long workflowId) {
        Workflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        List<ParapheurBo> parapheurs = parapheurRepository.findByWorkflow(workflow);
        if (Objects.isNull(parapheurs) || parapheurs.isEmpty()) {
            return null;
        }
        return parapheurs.get(0);
    }

    private List<Document> getDocumentsFromWorkflowOrFirstStep(Workflow workflow) {
        if (!workflow.getDocuments().isEmpty()) {
            return workflow.getDocuments();
        } else if (!workflow.getStepList().isEmpty()) {
            return workflow.getStepList().stream()
                    .filter(step -> step.getStepPreset().getLevel() == 1)
                    .flatMap(step -> step.getDocuments().stream())
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }
    @Override
    public Step findStepWithParapherAction(List<Step> steps, ACTION action) {
        return steps.stream()
                .filter(step -> step.getActions().contains(action))
                .findFirst()
                .orElse(null);
    }
    @Transactional
    public Step addDocumentToStep(Long workflowId){
        Workflow workflow = workflowRepository.findById(workflowId).orElseThrow(() -> new RuntimeException("Workflow not found"));
        List<Step> steps = workflow.getStepList();
        Step stepParapheur = findStepWithParapherAction(steps, ACTION.PARAPHER);

        if (stepParapheur != null) {
            List<Document> documents = getDocumentsFromWorkflowOrFirstStep(workflow);
            if (!documents.isEmpty()) {
                List<Document> existingDocuments = stepParapheur.getDocuments();
                if (existingDocuments == null) {
                    existingDocuments = new ArrayList<>();
                }
                // Ajoutez seulement les documents qui ne sont pas déjà présents
                for (Document doc : documents) {
                    if (!existingDocuments.contains(doc)) {
                        existingDocuments.add(doc);
                    }
                }
                stepParapheur.setDocuments(existingDocuments);
//                stepParapheur.getDocuments().addAll(documents);
                Step step = stepRepository.save(stepParapheur);
                return step;

            }
        }
        return  stepParapheur;
    }
    @Override
    public void parapher(long workflowId,long currentStepId) throws Exception {
        Workflow workflow = workflowRepository.findById(workflowId).orElseThrow(() -> new RuntimeException("Workflow not found"));
        List<Step> steps = workflow.getStepList();
        Step currentStep = steps.stream().filter(step -> step.getId().equals(currentStepId)).findFirst().orElseThrow(() -> new RuntimeException("Step not found"));

        Queue<List<UserDestinataire>> userDestinataireStack = new LinkedList<>();

        for (Step step : steps) {
            userDestinataireStack.add(step.getDestinataires());
            if (step.equals(currentStep)) {
                break;
            }
        }

        String userInitialsString = buildUserInitialsString(userDestinataireStack);
        List<Document> workflowDocuments = workflow.getDocuments();

        if (workflowDocuments.isEmpty()) {
            workflowDocuments = currentStep.getDocuments();
        }

        for(Document doc : workflowDocuments) {
            if (!doc.getSigned()) {
                byte[] file = documentAdminService.downloadFileFromService(doc.getId(), null);
                //byte[] newFile = qrCodeSevice.addTextToPdfCenter(file, userInitialsString, 10, 10);
                byte[] newFile = qrCodeService.addTextToPdf(file, userInitialsString, 50, 15);

                MultipartFile multipartFile = new ByteArrayMultipartFile("file", doc.getReferenceGed(), "application/pdf", newFile);
                documentAdminService.updateDocumentFile(multipartFile, documentConverter.toDto(doc));
            }
        }
    }

    public String buildUserInitialsString(Queue<List<UserDestinataire>> userDestinataireQueue) {
        StringBuilder sb = new StringBuilder();

        while (!userDestinataireQueue.isEmpty()) {
            List<UserDestinataire> userDestinataires = userDestinataireQueue.poll();

            Set<Integer> poids = userDestinataires.stream().map(UserDestinataire::getPoids).collect(Collectors.toSet());
            boolean isUniformPoids = poids.size() == 1;

            if (isUniformPoids) {
                if (userDestinataires.size() == 1) {
                    String initials = userDestinataires.get(0).getUtilisateur().getNom().toUpperCase().charAt(0) + "" + userDestinataires.get(0).getUtilisateur().getPrenom().toUpperCase().charAt(0);
                    sb.append(initials);
                } else {
                    for (UserDestinataire userDestinataire : userDestinataires) {
                        String initials = userDestinataire.getUtilisateur().getNom().toUpperCase().charAt(0) + "" + userDestinataire.getUtilisateur().getPrenom().toUpperCase().charAt(0);
                        sb.append(initials).append("-");
                    }

                    // Remove the trailing hyphen
                    if (sb.length() > 0 && sb.charAt(sb.length() - 1) == '-') {
                        sb.setLength(sb.length() - 1);
                    }
                }
            } else {
                int smallestPoids = userDestinataires.stream().mapToInt(UserDestinataire::getPoids).min().orElseThrow(() -> new RuntimeException("No users found"));
                for (UserDestinataire userDestinataire : userDestinataires) {
                    if (userDestinataire.getPoids() == smallestPoids) {
                        String initials = userDestinataire.getUtilisateur().getNom().toUpperCase().charAt(0) + "" + userDestinataire.getUtilisateur().getPrenom().toUpperCase().charAt(0);
                        sb.append(initials).append("-");
                    }
                }
                // Remove the trailing hyphen
                if (sb.length() > 0 && sb.charAt(sb.length() - 1) == '-') {
                    sb.setLength(sb.length() - 1);
                }
            }

            if (!userDestinataireQueue.isEmpty()) {
                sb.append("/");
            }
        }
        return sb.toString().trim();
    }

    @Override
    public Workflow getWorkflowByParapheurId(Long parapheurId) {
        return workflowRepository.findByParapheurId(parapheurId);
    }

    @Override
    public WorkflowDTO addPVToWorkflow(Long workflowId, List<DocumentDto> dtos){
        Workflow workflow = workflowRepository.findById(workflowId).orElseThrow(() -> new RuntimeException("Workflow not found"));

        List<Document> existingDocuments = workflow.getPiecesJointes();
        List<Document> newDocuments = new ArrayList<>();
        for(DocumentDto dto : dtos) {
            Document doc = documentAdminService.findById(dto.getId());
            newDocuments.add(doc);
        }
        existingDocuments.addAll(newDocuments);

        workflow.setPiecesJointes(existingDocuments);
        return workflowMapper.workflowtoDTO(workflowRepository.save(workflow));
    }

    @Override
    public List<ParapheurDto> getParapheursByWorkflowId(Long workflowId){
        Workflow workflow = workflowRepository.findById(workflowId).orElseThrow(() -> new RuntimeException("Workflow not found"));
        List<ParapheurBo>  parapheurBo = ListUtil.emptyIfNull( workflow.getParapheurBos());
        User user = SecurityUtil.getCurrentUser();
        boolean isAdmin = utilisateurService.isAdmin(user);
        if(isAdmin){
            return parapheurBo.stream().map(parapheurConverter::convertToParapheurDto).collect(Collectors.toList());
        }else {
            return parapheurBo.stream().filter(parapheur -> parapheur.getUtilisateurs().contains(user) || parapheur.getUtilisateur().getId().equals(user.getId())).map(parapheurConverter::convertToParapheurDto).collect(Collectors.toList());
        }
    }

    @Override
    public List<DocumentDto> getSignedCEByWorkflowId(Long id){
        List<DocumentDto> documentDtos = new ArrayList<>();

        Workflow workflow = workflowRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Workflow not found"));

        List<PlanClassement> planClassementList = ListUtils.emptyIfNull(planClassementService.findByLibelle(workflow.getTitle()));

        planClassementList.forEach(planClassement -> {
            PlanClassement plan = planClassementService.findByLibelleAndParent("CE signé", planClassement.getId());
            if (plan != null) {
                List<DocumentDto> documents = ListUtils.emptyIfNull(documentAdminService.findByPlanClassementId(plan.getId()));
                documentDtos.addAll(documents);
            }
        });

        return documentDtos;
    }
}
