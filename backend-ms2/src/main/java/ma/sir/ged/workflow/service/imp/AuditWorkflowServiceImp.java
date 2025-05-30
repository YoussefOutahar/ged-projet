package ma.sir.ged.workflow.service.imp;

import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.workflow.DTO.AuditWorkflowDto;
import ma.sir.ged.workflow.entity.AuditWorkflow;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.repository.AuditWorkflowRepository;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.workflow.service.sev.AuditWorkflowService;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import ma.sir.ged.zynerator.security.bean.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuditWorkflowServiceImp implements AuditWorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private UtilisateurDao utilisateurDao;
    @Autowired
    private UtilisateurAdminService userService;

    @Autowired
    private AuditWorkflowRepository workflowAuditRepository;

    @Override
    public AuditWorkflow create(AuditWorkflowDto auditDto) {
        AuditWorkflow audit = new AuditWorkflow();

        audit.setAction(auditDto.getAction());
        audit.setUploadDate(LocalDateTime.now());
        if (auditDto.getUtilisateurId() != null) {
            Utilisateur utilisateur = utilisateurDao.findById(auditDto.getUtilisateurId())
                    .orElseThrow(() -> new EntityNotFoundException("user not found"));
            audit.setUtilisateur(utilisateur);
        }
        if (auditDto.getWorkflowId() != null) {
            Workflow workflow = workflowRepository.findById(auditDto.getWorkflowId())
                    .orElseThrow(() -> new EntityNotFoundException("document not found"));
            audit.setWorkflow(workflow);
        }

        return workflowAuditRepository.save(audit);
    }

    @Override
    public AuditWorkflow saveAudit(Long workflowId, String action) {
        AuditWorkflow audit = new AuditWorkflow();

        audit.setAction(action);
        audit.setUploadDate(LocalDateTime.now());
        User user = getCurrentUser();
        if(user != null) {
            Utilisateur utilisateur = userService.findByUsername(user.getUsername());
            if (utilisateur == null) {
                throw new RuntimeException("User non found");
            } else {
                audit.setUtilisateur(utilisateur);
            }
        }
        if (workflowId != null) {
            Workflow workflow = workflowRepository.findById(workflowId)
                    .orElseThrow(() -> new EntityNotFoundException("workflow not found"));
            audit.setWorkflow(workflow);
        }

        return workflowAuditRepository.save(audit);
    }

    @Override
    public List<AuditWorkflow> getAll() {
        return workflowAuditRepository.findAll();
    }

    @Override
    public Page<AuditWorkflow>getAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return workflowAuditRepository.findAll(pageable);
    }

    @Override
    public List<AuditWorkflow> findAuditByWorkflow(Long idWorkflow) {
        return workflowAuditRepository.findByWorkflowId(idWorkflow);
    }

    @Override
    public List<AuditWorkflow> findAuditByUtilisateur(Long idUtilisateur) {
        return workflowAuditRepository.findByUtilisateurId(idUtilisateur);
    }

    @Override
    public List<AuditWorkflow> findAuditByAction(String action) {
        return workflowAuditRepository.findByAction(action);
    }

    @Override
    public int deleteByWorkflowId(Long id) {
        return workflowAuditRepository.deleteByWorkflowId(id);
    }

    @Override
    public List<String> returnActions() {
        return getAll().stream()
                .map(AuditWorkflow::getAction)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Map<String, Integer>>> getAuditStats() {
        List<Map<String, Map<String, Integer>>> statsList = new ArrayList<>();
        int distinctActions = workflowAuditRepository.countDistinctActions();

        List<Object[]> distinctWorkflowsAndUsers = workflowAuditRepository.countDistinctworkflowAndUsersForEachAction();

        for (Object[] row : distinctWorkflowsAndUsers) {
            String action = (String) row[0];
            int distinctWorklows = ((Number) row[1]).intValue();
            int distinctUsers = ((Number) row[2]).intValue();

            Map<String, Integer> actionStats = new HashMap<>();
            actionStats.put("nbWorkflows", distinctWorklows);
            actionStats.put("nbUsers", distinctUsers);
            actionStats.put("nbActions", distinctActions);

            Map<String, Map<String, Integer>> stats = new HashMap<>();
            stats.put(action, actionStats);

            statsList.add(stats);
        }

        return statsList;
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal != null && principal instanceof User) {
            return (User) principal;
        } else if (principal != null && principal instanceof String) {
            return userService.findByUsername(principal.toString());
        } else {
            return null;
        }
    }
}
