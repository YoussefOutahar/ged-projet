package ma.sir.ged.workflow.service.imp;

import lombok.Data;

import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.MailRequest;
import ma.sir.ged.WebSocket.Wokflow.NotificationStep;
import ma.sir.ged.WebSocket.Wokflow.NotificationWorkflow;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentStateAdminService;
import ma.sir.ged.workflow.DTO.CommentaireDTO;
import ma.sir.ged.workflow.DTO.StepDTO;
import ma.sir.ged.workflow.entity.*;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.STEP_STATUS;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.mapper.CommentaireDTOMapper;
import ma.sir.ged.workflow.mapper.StepDTOMapper;
import ma.sir.ged.workflow.mapper.WorkflowMapper;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.workflow.repository.UserDestinataireRepository;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.workflow.service.sev.AuditWorkflowService;
import ma.sir.ged.workflow.service.sev.StepService;
import ma.sir.ged.workflow.service.sev.WorkflowService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentDto;

import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.ws.facade.admin.parapheur.Handlers.ParapheurWorkflowHandler;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Data
public class StepServiceImp implements StepService {

    private final StepRepository stepRepository;
    private final UserDestinataireRepository userDestinataireRepository;
    private final StepDTOMapper stepDTOMapper;
    private final CommentaireDTOMapper commentaireDTOMapper;
    private final WorkflowRepository workflowRepository;
    private final DocumentConverter documentConverter;
    private final UtilisateurAdminService utilisateurDao;
    private final WorkflowService workflowService;
    public final WorkflowMapper workflowMapper;
    @Autowired
    private ParapheurWorkflowHandler parapheurWorkflowHandler;

    @Autowired
    private ParapheurRepository parapheurRepository;
    @Autowired
    private NotificationWorkflow notificationWorkflow;

    @Autowired
    private NotificationStep notificationStep;

    @Autowired
    private AuditWorkflowService auditWorkflowService ;
    @Autowired
    private DocumentDao documentDao;
    @Autowired
    private DocumentStateAdminService documentStateAdminService;
    @Autowired
    private EmailService emailService;

    public StepDTO getStepById(Long id) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp: Step not found with id: " + id));
        return stepDTOMapper.mapToDTO(step);
    }

    public List<StepDTO> getAllSteps() {
        List<Step> stepList = stepRepository.findAll();
        return stepDTOMapper.mapToDTOList(stepList);
    }

    public StepDTO createStep(StepDTO stepDTO) {
        Step step = stepDTOMapper.mapToEntity(stepDTO);
        Step newStepEntity = stepRepository.save(step);
        return stepDTOMapper.mapToDTO(newStepEntity);
    }

    public StepDTO updateStep(Long id, StepDTO updatedStep) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + id));
        Step updatedStepEntity = stepDTOMapper.mapToEntity(updatedStep);
        step.setStatus(updatedStepEntity.getStatus());
        step.setDocuments(updatedStepEntity.getDocuments());
        step.setDiscussions(updatedStepEntity.getDiscussions());
        step.setStepPreset(updatedStepEntity.getStepPreset());
        step.setWorkflow(updatedStepEntity.getWorkflow());
        Step newStep = stepRepository.save(step);
        return stepDTOMapper.mapToDTO(newStep);
    }

    @Transactional
    public StepDTO updateStepDoc(StepDTO stepDTO) {
        Step step = stepRepository.findById(stepDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + stepDTO.getId()));
        step.getDocumentsActions().clear();

        try {
            stepDTO.getDocumentsActions().forEach(documentDto -> {
                Document document = documentConverter.toItem(documentDto);
                step.getDocumentsActions().add(document);
            });


        } catch (Exception e) {
            throw new RuntimeException("Failed to convert documents: " + e.getMessage(), e);
        }
        Step newStep = stepRepository.save(step);
        return stepDTOMapper.mapToDTO(newStep);
    }


    @Transactional
    public StepDTO signStepDocument(Long stepId, DocumentDto documentDto) {
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + stepId));
        try {
            step.getDocumentsActions().forEach(d -> {
                if (d.getSigned().equals(true)) {
                    step.getDocumentsActions().remove(d);
                    throw new RuntimeException("Document already signed");
                }
            });
            Document document = documentConverter.toItem(documentDto);
            step.getDocumentsActions().add(document);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert documents: " + e.getMessage(), e);
        }
        Step newStep = stepRepository.save(step);
        return stepDTOMapper.mapToDTO(newStep);
    }


    @Override
    public StepDTO approuve(Long id, Long userId) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step approuve with given ID does not exist." + id));
        Set<Integer> poids = step.getStepPreset().getDestinataires().stream().map(UserDestinataire::getPoids).collect(Collectors.toSet());
        boolean isUniformPoids = poids.size() == 1;
        if (isUniformPoids) {

            if (step.getDestinataires().size() == 1) {
                step = approuveStep(step);
            } else {
                UserDestinataire ud = step.getDestinataires().stream()
                        .filter(destinataire -> destinataire.getUtilisateur().getId().equals(userId))
                        .findFirst()
                        .orElse(null);

                if (ud != null) {
                    step.getDestinataires().remove(ud);
                    step = stepRepository.save(step);
                }
            }
        } else {
            step = approuveStep(step);
        }
        return stepDTOMapper.mapToDTO(step);
    }

    @Override
    @Transactional
    public void rejectDocFromStep(Long stepId, List<Long> documentIds){
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Step sign with given ID does not exist: " + stepId));
        Workflow workflowOfStep = getWorkflowOfStep(step);

        List<Step> previousSteps = workflowOfStep.getStepList().stream()
                .filter(s -> s.getStepPreset().getLevel() == step.getStepPreset().getLevel() - 1)
                .collect(Collectors.toList());

        Map<Utilisateur, List<Document>> documentsByUser = new HashMap<>();

        for (Long documentId : documentIds) {
            Document document = documentDao.findById(documentId).orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Document not found with id: " + documentId));

            Step stepWithMatchingDocument = previousSteps.stream()
                    .filter(s -> s.getDocumentsActions().stream()
                            .anyMatch(doc -> doc.getId().equals(documentId)))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("No previous step contains a document with ID: " + documentId));

            removeDocumentFromStep(step, document);
            stepWithMatchingDocument.getDocuments().add(document);
            stepWithMatchingDocument.setStatus(STEP_STATUS.COMPLEMENT);

            DocumentState state = documentStateAdminService.findByLibelle("Rejeté");
            document.setDocumentState(state);

            stepRepository.save(stepWithMatchingDocument);
            documentDao.save(document);

            Utilisateur userDestinataire = stepWithMatchingDocument.getStepPreset().getDestinataires().get(0).getUtilisateur();
            documentsByUser.computeIfAbsent(userDestinataire, k -> new ArrayList<>()).add(document);

        }
        Utilisateur sender = step.getStepPreset().getDestinataires().get(0).getUtilisateur();

        for (Map.Entry<Utilisateur, List<Document>> entry : documentsByUser.entrySet()) {
            Utilisateur recipient = entry.getKey();
            List<Document> documentsForUser = entry.getValue();
            String dest = recipient.getNom()+" "+recipient.getPrenom();
            sendMailReject(sender, recipient.getEmail(), dest, documentsForUser, workflowOfStep);
        }
    }

    private void sendMailReject (Utilisateur sender, String toEmail, String destinataire, List<Document> documents, Workflow workflow){
        MailRequest mailRequest = new MailRequest();
        String senderName = sender.getPrenom() + " " + sender.getNom();

        mailRequest.setSubject("Rejet du dossier : "+workflow.getTitle()+" - Documents à rectifier");

        StringBuilder message = new StringBuilder();
        message.append("Bonjour " + destinataire + ",\n\n");
        message.append("Le dossier de demande de certificats \""+workflow.getTitle()+"\" a été rejeté.\n");
        message.append("Merci de consulter les tâches associées pour effectuer les rectifications nécessaires.\n\n");
        message.append("Vous trouverez le(s) document(s) concerné(s) en pièce jointe.\n\n");
        message.append("Cordialement,\n\n");

        message.append(senderName);

        mailRequest.setToEmail(toEmail);
        mailRequest.setDocumentIds(documents.stream().map(Document::getId).collect(Collectors.toList()));
        mailRequest.setMessage(message.toString());
        mailRequest.setHTML(false);
        emailService.sendMail(mailRequest);
    }
    private void removeDocumentFromStep(Step step, Document document) {
        boolean isRemoved = step.getDocuments().removeIf(doc -> doc.getId().equals(document.getId()));

        if (isRemoved) {
            stepRepository.save(step);
        } else {
            throw new IllegalStateException("Document not found in step: " + step.getId());
        }
    }

    @Override
    @Transactional
    public void rejectDocFromparapheur(Long stepId, List<Long> documentIds, Long parapheurId){
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Step sign with given ID does not exist: " + stepId));
        Workflow workflowOfStep = getWorkflowOfStep(step);

        List<ParapheurBo> parapheurBos = parapheurRepository.findByWorkflowId(workflowOfStep.getId()).stream()
                .filter(paraph -> !paraph.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .collect(Collectors.toList());

        Step previousStp = workflowOfStep.getStepList().stream()
                .filter(s -> s.getStepPreset().getLevel() == step.getStepPreset().getLevel() - 1)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Step sign with given ID does not exist: " + stepId));

        Map<Utilisateur, List<Document>> documentsByUser = new HashMap<>();

        if(parapheurId != null){
            ParapheurBo parapheurBo = parapheurRepository.findById(parapheurId).orElse(null);
            parapheurWorkflowHandler.changeEtatParapheur(Collections.singletonList(parapheurBo));
            removeDocumentsFromStep(step, Collections.singletonList(parapheurBo));
        }else if(!documentIds.isEmpty()){
            for(Long documentId : documentIds){
                Document document = documentDao.findById(documentId).orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Document not found with id: " + documentId));

                for (ParapheurBo parapheur : parapheurBos) {
                    if (parapheur.getDocuments().removeIf(doc -> doc.getId().equals(document.getId()))) {
                        if (parapheur.getDocuments().isEmpty()) {
                            parapheur.setParapheurEtat(ParapheurEtat.REJETE);
                        }
                        parapheurRepository.save(parapheur);
                        removeDocfromAllSteps(workflowOfStep, document);
                        DocumentState state = documentStateAdminService.findByLibelle("En Attente");
                        document.setDocumentState(state);
                        document.setParaphed(false);
                        documentDao.save(document);
                        //Email
                        Utilisateur userDestinataire = parapheur.getUtilisateur();
                        documentsByUser.computeIfAbsent(userDestinataire, k -> new ArrayList<>()).add(document);
                        //Email previous step users
                        List<Utilisateur> previousStepUsers = previousStp.getDestinataires().stream()
                                .map(UserDestinataire::getUtilisateur)
                                .collect(Collectors.toList());
                        for (Utilisateur user : previousStepUsers) {
                            documentsByUser.computeIfAbsent(user, k -> new ArrayList<>()).add(document);
                        }

                        //update fiche paraph
                        Long currentStepId = previousStp.getId();
                        Long workflowId = step.getWorkflow().getId();
                        workflowService.generateAndAddFicheParapheur(workflowId, currentStepId);
                    }
                }
            }
        }
        Utilisateur sender = step.getStepPreset().getDestinataires().get(0).getUtilisateur();

        for (Map.Entry<Utilisateur, List<Document>> entry : documentsByUser.entrySet()) {
            Utilisateur recipient = entry.getKey();
            List<Document> documentsForUser = entry.getValue();
            String dest = recipient.getNom()+" "+recipient.getPrenom();
            sendMailReject(sender, recipient.getEmail(), dest, documentsForUser, workflowOfStep);
        }
    }
    private void removeDocfromAllSteps(Workflow workflow, Document document){
        List<Step> stepsList = workflow.getStepList().stream()
                .filter(s -> s.getStepPreset().getLevel() > 2)
                .collect(Collectors.toList());

        for (Step currentStep : stepsList) {
            currentStep.getDocuments().removeIf(doc -> document.getId().equals(doc.getId()));
            stepRepository.save(currentStep);
        }
    }
    @Override
    @Transactional
    public StepDTO compliment(Long id, Long specificStepId) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step sign with given ID does not exist: " + id));

        Workflow workflowOfStep = getWorkflowOfStep(step);

        //Step previousStep = getPreviousStep(workflowOfStep.getStepList(), step.getStepPreset().getLevel());
        Step previousStep;
        if (specificStepId == null) {
            previousStep = getPreviousStep(workflowOfStep.getStepList(), step.getStepPreset().getLevel());
        }else {
            previousStep = stepRepository.findById(specificStepId)
                    .orElseThrow(() -> new IllegalArgumentException("Specific step with given ID does not exist: " + specificStepId));
        }

        Step stepComplimentaire = createComplementaryStep(previousStep, workflowOfStep);

        workflowOfStep.getStepList().add(stepComplimentaire);
        workflowRepository.save(workflowOfStep);
        AuditWorkflow audit = auditWorkflowService.saveAudit(step.getWorkflow().getId(), "Ajouter Complement");

        List<ParapheurBo> parapheurBos = findParapheurForComplement(workflowOfStep);
        parapheurWorkflowHandler.changeEtatParapheur(parapheurBos);
        removeDocumentsFromStep(step, parapheurBos);

        Long currentStepId = stepComplimentaire.getId();
        Long workflowId = step.getWorkflow().getId();
        ParapheurBo parapheur = workflowService.getLastParapheurForWorkflow(workflowId);
        if (Objects.nonNull(parapheur)) {
            workflowService.generateAndAddFicheParapheur(workflowId, currentStepId);
        }

        return stepDTOMapper.mapToDTO(stepComplimentaire);
    }

    private void removeDocumentsFromStep(Step step, List<ParapheurBo> parapheurBos) {
        if (parapheurBos.isEmpty()) {
            return;
        }
        Set<Document> documentsInParapheurs = parapheurBos.stream()
                .flatMap(parapheur -> parapheur.getDocuments().stream())
                .collect(Collectors.toSet());

        step.getDocuments().removeIf(doc -> documentsInParapheurs.contains(doc));
        stepRepository.save(step);

        Workflow workflow = getWorkflowOfStep(step);
        List<Step> stepsList = workflow.getStepList().stream()
                .filter(s -> s.getStepPreset().getLevel() > 2)
                .collect(Collectors.toList());

        for (Step currentStep : stepsList) {
            currentStep.getDocuments().removeIf(doc -> documentsInParapheurs.contains(doc));
            stepRepository.save(currentStep);
        }
    }
    private List<ParapheurBo> findParapheurForComplement(Workflow workflow){
        List<ParapheurBo> parapheurBos = parapheurRepository.findByWorkflowId(workflow.getId());
        Step lastSignedStep = workflow.getStepList().stream()
                .filter(s -> s.getActions().contains(ACTION.SIGN))
                .reduce((first, second) -> second)
                .orElseThrow(() -> new IllegalArgumentException("No steps with SIGN action found"));

        List<UserDestinataire> destinataires = lastSignedStep.getDestinataires();
        List<ParapheurBo> userParapheurs = parapheurBos.stream()
                .filter(parapheur -> parapheur.getUtilisateurs().stream()
                        .noneMatch(utilisateur -> destinataires.stream()
                                .anyMatch(destinataire -> destinataire.getUtilisateur().getId().equals(utilisateur.getId()))))
                .filter(parapheur -> !parapheur.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .collect(Collectors.toList());
        return userParapheurs;
    }
    @Override
    public List<DocumentDto> findDocumentsInParapheurByWorkflowAndUser(Long stepId) {
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Step sign with given ID does not exist: "));

        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: "));

        Step lastSignedStep = workflow.getStepList().stream()
                .filter(s -> s.getActions().contains(ACTION.SIGN))
                .reduce((first, second) -> second)
                .orElseThrow(() -> new IllegalArgumentException("No steps with SIGN action found"));

        List<UserDestinataire> destinataires = lastSignedStep.getDestinataires();

        List<ParapheurBo> parapheurs = workflow.getParapheurBos();

        List<ParapheurBo> userParapheurs = parapheurs.stream()
                .filter(paraph -> !paraph.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .filter(parapheur -> parapheur.getUtilisateurs().stream()
                        .anyMatch(utilisateur -> destinataires.stream()
                                .anyMatch(destinataire -> destinataire.getUtilisateur().getId().equals(utilisateur.getId()))))
                .collect(Collectors.toList());

        List<Document> documentsInParapheur = userParapheurs.stream()
                .flatMap(parapheur -> parapheur.getDocuments().stream())
                .collect(Collectors.toList());

        return documentConverter.toDto(documentsInParapheur);
    }

    private Workflow getWorkflowOfStep(Step step) {
        if (Objects.nonNull(step.getWorkflow())) {
            return step.getWorkflow();
        } else {
            return workflowRepository.findById(step.getWorkflow().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Workflow not found for step with ID: " + step.getId()));
        }
    }

    private Step createComplementaryStep(Step previousStep, Workflow workflowOfStep) {
        Step newStep = new Step();
        if (Objects.nonNull(previousStep)) {
            newStep.setStepPreset(previousStep.getStepPreset());
            newStep.setWorkflow(workflowOfStep);
            newStep.setStatus(STEP_STATUS.COMPLEMENT);
            newStep.setDocuments(new ArrayList<>(previousStep.getDocuments()));
            newStep.setActions(new ArrayList<>(previousStep.getStepPreset().getActions()));
            newStep.setDestinataires(new ArrayList<>(previousStep.getStepPreset().getDestinataires()));
        }
        if(previousStep.getStatus().equals(STEP_STATUS.PARTIAL)){
            previousStep.setStatus(STEP_STATUS.DONE);
            stepRepository.save(previousStep);
        }
        return newStep;
    }

    private Step getPreviousStep(List<Step> stepList, int level) {
        return stepList.stream()
                .filter(s -> s.getStepPreset().getLevel() == level - 1)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Previous step not found for level: " + level));
    }


    @Override
    public StepDTO sign(Long id, Long userId) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step sign with given ID does not exist." + id));
        Set<Integer> poids = step.getStepPreset().getDestinataires().stream().map(UserDestinataire::getPoids).collect(Collectors.toSet());
        boolean isUniformPoids = poids.size() == 1;
        if (isUniformPoids) {

            if (step.getDestinataires().size() == 1) {
                step = signStep(step);
            } else {
                UserDestinataire ud = step.getDestinataires().stream()
                        .filter(destinataire -> destinataire.getUtilisateur().getId().equals(userId))
                        .findFirst()
                        .orElse(null);

                if (ud != null) {
                    step.getDestinataires().remove(ud);
                    step = stepRepository.save(step);
                }
            }
        } else {
            step = signStep(step);
        }

        Long currentStepId = step.getId();
        Long workflowId = step.getWorkflow().getId();
        workflowService.generateAndAddFicheParapheur(workflowId, currentStepId);

        return stepDTOMapper.mapToDTO(step);
    }

    @Override
    public StepDTO parapher(Long id, Long userId) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step parapher with given ID does not exist." + id));
        Set<Integer> poids = step.getStepPreset().getDestinataires().stream().map(UserDestinataire::getPoids).collect(Collectors.toSet());
        boolean isUniformPoids = poids.size() == 1;
        if (isUniformPoids) {

            if (step.getDestinataires().size() == 1) {
                step = parapherStep(step);
            } else {
                UserDestinataire ud = step.getDestinataires().stream()
                        .filter(destinataire -> destinataire.getUtilisateur().getId().equals(userId))
                        .findFirst()
                        .orElse(null);

                if (ud != null) {
                    step.getDestinataires().remove(ud);
                    step = stepRepository.save(step);
                }
            }
        } else {
            step = parapherStep(step);
        }
        return stepDTOMapper.mapToDTO(step);
    }

    @Override
    public StepDTO presigner(Long id, Long userId) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step to signature with given ID does not exist." + id));
        Set<Integer> poids = step.getStepPreset().getDestinataires().stream().map(UserDestinataire::getPoids).collect(Collectors.toSet());
        boolean isUniformPoids = poids.size() == 1;
        if (isUniformPoids) {

            if (step.getDestinataires().size() == 1) {
                step = presignerStep(step);
            } else {
                UserDestinataire ud = step.getDestinataires().stream()
                        .filter(destinataire -> destinataire.getUtilisateur().getId().equals(userId))
                        .findFirst()
                        .orElse(null);

                if (ud != null) {
                    step.getDestinataires().remove(ud);
                    step = stepRepository.save(step);
                }
            }
        } else {
            step = presignerStep(step);
        }

        Long currentStepId = step.getId();
        Long workflowId = step.getWorkflow().getId();
        workflowService.generateAndAddFicheParapheur(workflowId, currentStepId);

        return stepDTOMapper.mapToDTO(step);
    }

    @Override
    public StepDTO reject(Long id) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Step reject with given ID does not exist." + id));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId()).orElseThrow(
                () -> new EntityNotFoundException(" workflow not found with id: "));
        workflow.setStatus(WorkflowStatus.REJECTED);
        step.setStatus(STEP_STATUS.REJECTED);
        stepRepository.save(step);
        int level = step.getStepPreset().getLevel();
        List<Step> higherLevelSteps = workflow.getStepList().stream()
                .filter(stepNext -> stepNext.getStepPreset().getLevel() > level)
                .collect(Collectors.toList());
        for (Step higherStep : higherLevelSteps) {
            higherStep.setStatus(STEP_STATUS.REJECTED);
            stepRepository.save(higherStep);
        }
        Workflow savedWorkflow = workflowRepository.save(workflow);
        notificationWorkflow.notifyWorkflowReject(savedWorkflow);
        AuditWorkflow audit = auditWorkflowService.saveAudit(workflow.getId(), "Rejeter Step");

        return stepDTOMapper.mapToDTO(step);
    }


    @Override
    public void deleteStep(Long id) {
        stepRepository.deleteById(id);
    }

    @Override
    public Page<StepDTO> getStepsByInitiateurId(Long id, int page, int size, String search) {
        try {
            Sort sort = Sort.by(Sort.Direction.DESC, "id");
            Page<Step> steps = stepRepository.findStepsByUserId(id,PageRequest.of(page, size, sort), search);
            List<StepDTO> stepDTOS = stepDTOMapper.mapToDTOList(steps.getContent());
            return new PageImpl<>(stepDTOS, steps.getPageable(), steps.getTotalElements());
        } catch (Exception e) {
            throw new RuntimeException("Une erreur s'est produite lors de la récupération des étapes DONE par l'initiateur ID.", e);
        }
    }

    private boolean isStepEligibleForPartialStatus(Step step, Long userId) {
        List<Document> stepDocuments = step.getDocuments();

        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId()).orElseThrow(
                () -> new EntityNotFoundException(" workflow not found with id: "));

        List<Step> nextLevelSteps = workflow.getStepList().stream()
                .filter(s -> s.getStepPreset().getLevel() == step.getStepPreset().getLevel()+1)
                .collect(Collectors.toList());

        List<ParapheurBo> parapheurs = parapheurRepository.findByWorkflowId(step.getWorkflow().getId()).stream()
                .filter(paraph -> paraph.getParapheurEtat() != ParapheurEtat.REJETE)
                .collect(Collectors.toList());
        List<ParapheurBo> parapheursAssocies = parapheurs.stream()
                .filter(paraph -> paraph.getUtilisateurs().stream()
                        .anyMatch(utilisateur -> utilisateur.getId().equals(userId)))
                .collect(Collectors.toList());

        // Vérifier si tous les documents de l'étape sont dans les parapheurs associés
        boolean documentsInParapheurs = stepDocuments.stream()
                .allMatch(doc -> parapheursAssocies.stream()
                        .anyMatch(parapheur -> parapheur.getDocuments().contains(doc)));

        boolean destinatairesAssocies = step.getDestinataires().stream()
                .allMatch(destinataire -> parapheurs.stream()
                        .allMatch(parapheur -> parapheur.getUtilisateurs().stream()
                                .anyMatch(utilisateur -> utilisateur.getId().equals(destinataire.getUtilisateur().getId()))));

        if (!destinatairesAssocies) {
            return false;
        }
        // Vérifier si les destinataires de l'étape suivante sont associés aux mêmes parapheurs
        boolean nextStepDestinatairesAssociated = false;
        if (nextLevelSteps != null) {
            for (Step nextStep : nextLevelSteps) {
                for (UserDestinataire destinataire : nextStep.getDestinataires()) {
                    boolean isAssociated = parapheursAssocies.stream()
                            .allMatch(parapheur -> parapheur.getUtilisateurs().stream()
                                    .anyMatch(utilisateur -> utilisateur.getId().equals(destinataire.getUtilisateur().getId())));

                    if (isAssociated) {
                        nextStepDestinatairesAssociated = true;
                        break;
                    }
                }
            }
        }

        // Retourne vrai si les documents sont dans les parapheurs associés à l'utilisateur et non associés aux destinataires du niveau suivant
        return documentsInParapheurs && !nextStepDestinatairesAssociated;
    }

    @Override
    public Page<StepDTO> getStepsActionByInitiateurId(Long id, int page, int size, String search) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        List<Step> steps = stepRepository.findStepsByUserIdAndStatusNotInList(id, sort, Arrays.asList(STEP_STATUS.DONE, STEP_STATUS.REJECTED, STEP_STATUS.Annulled), search);
        List<Step> finalFilteredSteps = new ArrayList<>();

        for (Step step : steps) {
            if(!STEP_STATUS.DONE.equals(step.getStatus()) && step.getStepPreset().getLevel() == 1 ) {
                finalFilteredSteps.add(step);
            }else if(STEP_STATUS.WAITING.equals(step.getStatus()) || STEP_STATUS.PARTIAL.equals(step.getStatus())){
                if(step.getDocuments().size() > 0){
                    if(step.getStepPreset().getLevel() == 2){
                        boolean hasEnAttenteDocument = step.getDocuments().stream()
                                .anyMatch(document -> document.getDocumentState() != null && document.getDocumentState().getLibelle().equals("En Attente"));
                        if(hasEnAttenteDocument){
                            finalFilteredSteps.add(step);
                        }
                    }else if(step.getStepPreset().getLevel() == 3){
                        boolean hasValidDocument = step.getDocuments().stream()
                                .anyMatch(document -> document.getDocumentState() != null && document.getDocumentState().getLibelle().equals("Validé"));
                        if(hasValidDocument){
                            finalFilteredSteps.add(step);
                        }
                    } else if (step.getStepPreset().getLevel() == 4) {
                        boolean hasPresignDocument = step.getDocuments().stream()
                                .anyMatch(document -> document.getDocumentState() != null && document.getDocumentState().getCode().equals("presign-ref"));
                        if(hasPresignDocument){
                            finalFilteredSteps.add(step);
                        }
                    } else if (step.getStepPreset().getLevel() == 5) {
                        boolean hasEnCoursDocument = step.getDocuments().stream()
                                .anyMatch(document -> document.getDocumentState() != null && document.getDocumentState().getLibelle().equals("En Cours"));
                        if(hasEnCoursDocument){
                            finalFilteredSteps.add(step);
                        }
                    } else if (step.getStepPreset().getLevel() == 6) {
                        boolean hasSignedDocument = step.getDocuments().stream()
                                .anyMatch(document -> document.getDocumentState() != null && document.getDocumentState().getLibelle().equals("Signé"));
                        if(hasSignedDocument){
                            finalFilteredSteps.add(step);
                        }
                    }
                }
            }
        }
        finalFilteredSteps.sort(Comparator.comparing(step -> step.getWorkflow().getCreatedOn(), Comparator.reverseOrder()));
        List<StepDTO> dtoList = stepDTOMapper.mapToDTOList(finalFilteredSteps);
        return new PageImpl<>(dtoList
                .subList(page*size,Math.min(page*size+size,dtoList.size()))
                .stream().collect(Collectors.toList()), PageRequest.of(page, size), dtoList.size());
    }
    @Override
    public List<StepDTO> getwaitingStepsByInitiateurId(Long id) {
        try {
            Sort sort = Sort.by(Sort.Direction.DESC, "id");
            List<Step> steps = stepRepository.findStepsByUserId(id, sort);
            Set<Long> uniqueWorkflowIds = steps.stream()
                    .map(step -> step.getWorkflow().getId())
                    .collect(Collectors.toSet());
            List<Step> finalFilteredSteps = new ArrayList<>();

            for (Long workflowId : uniqueWorkflowIds) {
//                System.out.println("Workflow ID: " + workflowId);
                List<Step> stepsByWorkflowId = stepRepository.findStepsByWorkflowId(workflowId, sort);
                stepsByWorkflowId.sort(Comparator.comparingInt(step -> step.getStepPreset().getLevel()));

                Map<Integer, List<Step>> stepsByLevel = stepsByWorkflowId.stream()
                        .collect(Collectors.groupingBy(step -> step.getStepPreset().getLevel()));

                for (int level : stepsByLevel.keySet()) {
                    List<Step> currentLevelSteps = stepsByLevel.get(level);
                    if (currentLevelSteps != null) {
                        boolean allPreviousLevelDone = level == 1 || (stepsByLevel.get(level - 1) != null && stepsByLevel.get(level - 1).stream()
                                .allMatch(step -> STEP_STATUS.DONE.equals(step.getStatus()) || STEP_STATUS.PARTIAL.equals(step.getStatus())));

                        if (allPreviousLevelDone || level == 1) { // Inclure également le niveau 1 non terminé
                            for (Step step : currentLevelSteps) {
                                boolean containsDestinataire = step.getDestinataires().stream()
                                        .anyMatch(destinataire -> destinataire.getUtilisateur().getId().equals(id));

                                boolean previousStepsDone = level == 1 || (stepsByLevel.get(level - 1) != null && stepsByLevel.get(level - 1).stream()
                                        .allMatch(s -> STEP_STATUS.DONE.equals(s.getStatus())));

                                boolean previousStepsPartial = (stepsByLevel.get(level - 1) != null && stepsByLevel.get(level - 1).stream()
                                        .allMatch(s -> STEP_STATUS.PARTIAL.equals(s.getStatus())));

                                if(STEP_STATUS.PARTIAL.equals(step.getStatus()) && step.getStepPreset().getActions().contains(ACTION.PARAPHER)){
                                    int documentsSteps = step.getDocuments().size();
                                    int paraphes = parapheurWorkflowHandler.getAllDocumentsByWorkflow(step.getWorkflow().getId()).size();

                                    if(documentsSteps == paraphes){
                                        step.getActions().remove(ACTION.PARAPHER);
                                        step.setStatus(STEP_STATUS.DONE);
                                        stepRepository.save(step);
                                    }

                                }

                                if ((STEP_STATUS.PARTIAL.equals(step.getStatus()) ||
                                        (STEP_STATUS.WAITING.equals(step.getStatus()) && previousStepsPartial)) &&
                                        isStepEligibleForPartialStatus(step, id) && containsDestinataire) {
                                    finalFilteredSteps.add(step);
                                }

                                if ((STEP_STATUS.WAITING.equals(step.getStatus()) && containsDestinataire && previousStepsDone) || (STEP_STATUS.PARTIAL.equals(step.getStatus()) && containsDestinataire && step.getStepPreset().getActions().contains(ACTION.PARAPHER)) || (STEP_STATUS.COMPLEMENT.equals(step.getStatus()) && containsDestinataire)) {
                                    finalFilteredSteps.add(step);
                                }
                            }
                        }
                    }
                }
            }

            finalFilteredSteps.sort(Comparator.comparing(step -> step.getWorkflow().getCreatedOn(), Comparator.reverseOrder()));
            return stepDTOMapper.mapToDTOList(finalFilteredSteps);
        } catch (Exception e) {
            throw new RuntimeException("Une erreur s'est produite lors de la récupération des étapes par l'initiateur ID.", e);
        }
    }


    @Override
    public Page<StepDTO> getDoneStepsByInitiateurId(Long id, int page, int size, String search) {
        try {
            Sort sort = Sort.by(Sort.Direction.DESC, "id");
            List<Step> steps = stepRepository.findStepsByUserIdAndStatusInList(id, sort, Arrays.asList(STEP_STATUS.DONE), search);
            List<StepDTO> dtoList = stepDTOMapper.mapToDTOList(steps);
            return new PageImpl<>(dtoList
                    .subList(page*size,Math.min(page*size+size,dtoList.size()))
                    .stream().collect(Collectors.toList()), PageRequest.of(page, size), dtoList.size());
        } catch (Exception e) {
            throw new RuntimeException("Une erreur s'est produite lors de la récupération des étapes DONE par l'initiateur ID.", e);
        }
    }

    @Override
    public Page<StepDTO> getInProgressStepsByInitiateurId(Long id, int page, int size, String search) {
        try {
            Sort sort = Sort.by(Sort.Direction.DESC, "id");
            List<Step> steps = stepRepository.findStepsByUserIdAndStatusInList(id, sort, Arrays.asList(STEP_STATUS.IN_PROGRESS), search);
            List<StepDTO> dtoList = stepDTOMapper.mapToDTOList(steps);
            return new PageImpl<>(dtoList
                    .subList(page*size,Math.min(page*size+size,dtoList.size()))
                    .stream().collect(Collectors.toList()), PageRequest.of(page, size), dtoList.size());
        } catch (Exception e) {
            throw new RuntimeException("Une erreur s'est produite lors de la récupération des étapes IN_PROGRESS par l'initiateur ID.", e);
        }
    }

    @Override
    @Transactional
    public StepDTO addCommentaireToStep(Long id, CommentaireDTO commentaireDTO) {

        Step step = stepRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Error in addCommentaireToStep methode .  Step not found with id: " + id));

        Commentaire commentaire = commentaireDTOMapper.mapToEntity(commentaireDTO);
        step.getDiscussions().add(commentaire);
        Step stepWithComm = stepRepository.save(step);
        return stepDTOMapper.mapToDTO(stepWithComm);
    }

    private void updateParapherStepDocuments(Workflow workflow, Step step, List<DocumentDto> documentDtoList) {
        Step parapherStep = workflow.getStepList().stream()
                .filter(stepDoc -> stepDoc.getStepPreset().getActions().contains(ACTION.PARAPHER)
                        && !stepDoc.getStatus().equals(STEP_STATUS.DONE))
                .findFirst()
                .orElse(null);

        if (parapherStep != null && step.getStepPreset().getLevel() == 1) {
            List<Document> existingDocuments = parapherStep.getDocuments();
            List<Document> newDocuments = documentConverter.toItem(documentDtoList);

            if (existingDocuments == null) {
                existingDocuments = new ArrayList<>();
            }

            for(Document doc: newDocuments){
                if(!doc.getDocumentState().getLibelle().equals("rejeté")){
                    existingDocuments.add(doc);
                }
            }

            parapherStep.setDocuments(existingDocuments);
            stepRepository.save(parapherStep);
        }
    }

    private void updateStepDocumentsActions(Step step, List<DocumentDto> documentDtoList) {
        List<Document> existingDocumentActions = step.getDocumentsActions();
        List<Document> newDocumentActions = documentConverter.toItem(documentDtoList);

        if (existingDocumentActions == null) {
            existingDocumentActions = new ArrayList<>();
        }

        for(Document doc: newDocumentActions){
            if(!doc.getDocumentState().getLibelle().equals("rejeté")){
                existingDocumentActions.add(doc);
            }
        }
        step.setDocumentsActions(existingDocumentActions);

        stepRepository.save(step);
    }
    @Override
    @Transactional
    public StepDTO actionDocument(Long id, List<DocumentDto> documentDtoList) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + id));

        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                        .orElseThrow(() ->  new EntityNotFoundException("StepServiceImp.java: workflow not found "));

        updateParapherStepDocuments(workflow, step, documentDtoList);
        updateStepDocumentsActions(step, documentDtoList);
        updateDocumentStates(documentDtoList);

        return stepDTOMapper.mapToDTO(step);
    }
    private void updateDocumentStates(List<DocumentDto> documentDtoList) {
        List<Document> newDocuments = documentConverter.toItem(documentDtoList);
        DocumentState state = documentStateAdminService.findByLibelle("En Attente");

        newDocuments.stream()
                .filter(doc -> !doc.getDocumentState().getLibelle().equals("Rejeté"))
                .forEach(doc -> {
                    doc.setDocumentState(state);
                    documentDao.save(doc);
                });
    }
    @Override
    public List<DocumentDto> findDocumentsActionsByStep(Long stepId) {
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + stepId));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(() ->  new EntityNotFoundException("StepServiceImp.java: workflow not found "));

        List<Document> docStep = step.getDocuments();
        List<Document> docActions = workflow.getStepList().stream()
                .flatMap(s -> s.getDocumentsActions().stream())
                .collect(Collectors.toList());

        docStep.retainAll(docActions);
        return documentConverter.toDto(docStep);
    }
    @Override
    @Transactional
    public StepDTO preSignDocs(Long id, List<DocumentDto> documentDtoList) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + id));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId()).orElseThrow(
                () -> new EntityNotFoundException(" workflow not found with id: "));

        int currentLevel = step.getStepPreset().getLevel();

        List<Step> targetSteps = workflow.getStepList().stream()
                .filter(s -> s.getStepPreset().getLevel() > currentLevel &&
                        (s.getStepPreset().getActions().contains(ACTION.PRESIGNER) || s.getStepPreset().getActions().contains(ACTION.SIGN) || s.getStepPreset().getActions().contains(ACTION.APPROVE)))
                .collect(Collectors.toList());

        List<Document> newDocuments = documentConverter.toItem(documentDtoList);

        targetSteps.forEach(nextStep -> {
            List<Document> existingDocuments = new ArrayList<>(nextStep.getDocuments());

            List<Document> documentsToAdd = newDocuments.stream()
                    .filter(newDoc -> existingDocuments.stream()
                            .noneMatch(existingDoc -> existingDoc.getId().equals(newDoc.getId())))
                    .collect(Collectors.toList());

            existingDocuments.addAll(documentsToAdd);
            nextStep.setDocuments(existingDocuments);
        });
        stepRepository.saveAll(targetSteps);
        return stepDTOMapper.mapToDTO(targetSteps.get(0));
    }

    @Override
    public List<StepDTO> getPreviousStep(Long id) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + id));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: " + step.getWorkflow().getId()));
        List<Step> steps = workflow.getStepList();
        //int index = steps.indexOf(step);
        int index = step.getStepPreset().getLevel();
        if (index == 1) {
            System.out.println("This is the first step in the workflow.");
            return null;  // Si c'est le premier Step, retourner null
        } else {
            List<Step> previousSteps = steps.stream()
                    .filter(s -> s.getStepPreset().getLevel() == index - 1)
                    .collect(Collectors.toList());
            return previousSteps.stream()
                    .map(stepDTOMapper::mapToDTO)
                    .collect(Collectors.toList());
            //return stepDTOMapper.mapToDTO(steps.get(index - 1));
        }
    }

    @Override
    public List<StepDTO> getNextStep(Long id) {
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + id));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: " + step.getWorkflow().getId()));
        List<Step> steps = workflow.getStepList();
        //int index = steps.indexOf(step);
        int index = step.getStepPreset().getLevel();
        if (index == steps.size() - 1) {
            System.out.println("This is the last step in the workflow.");
            return null;  // Si c'est le dernier Step, retourner null
        } else {
            List<Step> previousSteps = steps.stream()
                    .filter(s -> s.getStepPreset().getLevel() == index + 1)
                    .collect(Collectors.toList());
            return previousSteps.stream()
                    .map(stepDTOMapper::mapToDTO)
                    .collect(Collectors.toList());
            //return stepDTOMapper.mapToDTO(steps.get(index + 1));
        }
    }


    private Step approuveStep(Step step) {

        if (step.getActions().contains(ACTION.APPROVE) && step.getActions().size() == 1) {
            step.setStatus(STEP_STATUS.PARTIAL);
            step.setValidateDate(LocalDateTime.now());
            step = stepRepository.save(step);
        } else {
            step.getActions().remove(ACTION.APPROVE);
            step = stepRepository.save(step);
        }

        if (step.getStepPreset().getLevel() == 3) {
            List<Document> documents = step.getDocuments();
            DocumentState state = documentStateAdminService.findByLibelle("Prêt à signé");
            for(Document doc: documents){
                if (doc.getDocumentState() != null && "valide-ref".equals(doc.getDocumentState().getCode())) {
                    doc.setDocumentState(state);
                    documentDao.save(doc);
                }
            }

            Long currentStepId = step.getId();
            Long workflowId = step.getWorkflow().getId();
            workflowService.generateAndAddFicheParapheur(workflowId, currentStepId);

            try {
                workflowService.parapher(step.getWorkflow().getId(), step.getId());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        AuditWorkflow audit = auditWorkflowService.saveAudit(step.getWorkflow().getId(), "Approuver Step");
        notificationStep.notifyStepDone(step, "approuvé");

        return step;
    }

    private Step signStep(Step stepI) {
        Step step = stepRepository.findById(stepI.getId())
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(null);

        if (step.getActions().contains(ACTION.SIGN) && step.getActions().size() == 1) {
            step.setStatus(STEP_STATUS.PARTIAL);
            step.setValidateDate(LocalDateTime.now());
            step = stepRepository.save(step);
        } else {
            step.getActions().remove(ACTION.SIGN);
            step = stepRepository.save(step);
        }

        if(step.getDocuments().size() == workflow.getDocumentCount()){
            cloturerWorkflowAfterSignDocument(workflow);
        }
        AuditWorkflow audit = auditWorkflowService.saveAudit(step.getWorkflow().getId(), "Signer Step");
        notificationStep.notifyStepDone(step, "signé");
        try {
            workflowService.parapher(step.getWorkflow().getId(), step.getId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        Long currentStepId = step.getId();
        Long workflowId = step.getWorkflow().getId();
        workflowService.generateAndAddFicheParapheur(workflowId, currentStepId);
        return step;
    }

    private void cloturerWorkflowAfterSignDocument (Workflow workflow){
        List<Step> targetSteps = workflow.getStepList().stream()
                .filter(step -> !step.getStepPreset().getActions().contains(ACTION.ENVOI_COURRIER))
                .collect(Collectors.toList());

        for(Step step: targetSteps){
            ACTION action = step.getStepPreset().getActions().get(0);
            step.getActions().remove(action);
            step.setStatus(STEP_STATUS.DONE);
            step.setValidateDate(LocalDateTime.now());
            stepRepository.save(step);
        }
    }


    @Override
    public List<DocumentDto> getAlldocumentTach(Long id){
        List<DocumentDto> DocsAction = new ArrayList<>();
        Step step = stepRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " + id));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found with id: " + step.getWorkflow().getId()));
        for(Step s:workflow.getStepList()){
            if(s.getDocumentsActions()!=null){
                for(Document d:s.getDocumentsActions()){
                    DocsAction.add(documentConverter.toDto(d));
                }
            }
        }
        return  DocsAction;
    }

    private Step parapherStep(Step stepI){
        Step step = stepRepository.findById(stepI.getId())
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));

        if (step.getActions().contains(ACTION.PARAPHER)&& step.getActions().size()==1) {
            step.setStatus(STEP_STATUS.PARTIAL);
            step.setValidateDate(LocalDateTime.now());
            step =stepRepository.save(step);
            AuditWorkflow audit = auditWorkflowService.saveAudit(step.getWorkflow().getId(), "Parapher Step");
            notificationStep.notifyStepDone(step, "paraphé");
        }else  {
            step.getActions().remove(ACTION.PARAPHER);
            AuditWorkflow audit = auditWorkflowService.saveAudit(step.getWorkflow().getId(), "Parapher Step");
            notificationStep.notifyStepDone(step, "paraphé");
            step =stepRepository.save(step);
        }
        try {
            workflowService.parapher(step.getWorkflow().getId(), step.getId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return step;
    }

    private Step presignerStep(Step stepI){
        Step step = stepRepository.findById(stepI.getId())
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));
        Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                .orElseThrow(null);


        if (step.getActions().contains(ACTION.PRESIGNER)&& step.getActions().size()==1) {
            step.setStatus(STEP_STATUS.PARTIAL);
            step.setValidateDate(LocalDateTime.now());
            step =stepRepository.save(step);
        }else  {
            step.getActions().remove(ACTION.PRESIGNER);
            step =stepRepository.save(step);
        }
        AuditWorkflow audit = auditWorkflowService.saveAudit(step.getWorkflow().getId(), "Presigner Step");
        notificationStep.notifyStepDone(step, "presigné");

        List<Document> documents = step.getDocuments();
        DocumentState state = documentStateAdminService.findByLibelle("En Cours");
        for(Document doc: documents){
            if (doc.getDocumentState() != null && "presign-ref".equals(doc.getDocumentState().getCode())) {
                doc.setDocumentState(state);
                documentDao.save(doc);
            }
        }
        try {
            workflowService.parapher(step.getWorkflow().getId(), step.getId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return step;
    }

    @Override
    public List<DocumentDto>  removeDocFromStep(Long stepId, List<DocumentDto> dtos){
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));

        List<Document> existingDocuments = step.getDocuments();

        dtos.forEach(dto -> {
            existingDocuments.removeIf(doc -> doc.getId().equals(dto.getId()));
        });

        step.setDocuments(existingDocuments);
        Step stepUpdated = stepRepository.save(step);
        if(stepUpdated.getStepPreset().getActions().contains(ACTION.PARAPHER)){
            parapherStep(stepUpdated);
        }

        return documentConverter.toDto(stepUpdated.getDocuments());
    }

    @Override
    public List<DocumentDto> addDocToStep(Long stepId, List<DocumentDto> dtos){
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));

        List<Document> existingDocuments = step.getDocuments();

        dtos.forEach(dto -> {
            Document document = documentConverter.toItem(dto);

            if (existingDocuments.stream().noneMatch(doc -> doc.getId().equals(document.getId()))) {
                existingDocuments.add(document);
            }
        });

        step.setDocuments(existingDocuments);
        Step stepUpdated = stepRepository.save(step);

        return documentConverter.toDto(stepUpdated.getDocuments());
    }

    @Override
    public  StepDTO envoiCourrierDone(Long stepId){
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));

        if(step.getActions().contains(ACTION.ENVOI_COURRIER) && step.getActions().size() == 1){
            step.getActions().remove(ACTION.ENVOI_COURRIER);
            step.setStatus(STEP_STATUS.DONE);
            step.setValidateDate(LocalDateTime.now());
            step = stepRepository.save(step);
        }else {
            step.getActions().remove(ACTION.ENVOI_COURRIER);
            step = stepRepository.save(step);
        }
        return stepDTOMapper.mapToDTO(step);
    }

    private  void closeEnvoiCourrierStepIfAllDocumentsAreSent(Step step){
        if(step.getDocuments().isEmpty()){
            Workflow workflow = workflowRepository.findById(step.getWorkflow().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Workflow not found "));

            Step signStep = workflow.getStepList().stream()
                    .filter(s -> s.getStepPreset().getActions().contains(ACTION.SIGN))
                    .reduce((first, second) -> second)
                    .orElse(null);

            if(signStep != null){
                int countSignedDocs = ListUtil.emptyIfNull(signStep.getDocuments().stream().filter(document -> document.getSigned()).collect(Collectors.toList())).size();
                boolean allCertifsSigned = workflow.getDocumentCount() == countSignedDocs;
                if(allCertifsSigned) envoiCourrierDone(step.getId());
            }
        }
    }

    @Override
    public StepDTO envoiCourrier(Long stepId, List<DocumentDto> documentDtos){
        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("StepServiceImp.java: Step not found with id: " ));

        removeDocFromStep(stepId,documentDtos);
        closeEnvoiCourrierStepIfAllDocumentsAreSent(step);

        return stepDTOMapper.mapToDTO(step);
    }

}
