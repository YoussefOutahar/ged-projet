package ma.sir.ged.service.impl.admin.doc;

import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.doc.AuditDao;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.service.facade.admin.doc.AuditAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.ws.dto.AuditDto;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import ma.sir.ged.zynerator.security.bean.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuditAdminServiceImpl implements AuditAdminService {

    @Autowired
    private UtilisateurDao utilisateurDao;
    @Autowired
    private DocumentDao documentDao;
    @Autowired
    private AuditDao auditDao;
    @Autowired
    private UtilisateurAdminService userService;
    @Override
    public Audit create(AuditDto auditDto) {
        Audit audit = new Audit();

        audit.setAction(auditDto.getAction());
        audit.setUploadDate(LocalDateTime.now());
        if (auditDto.getUtilisateurId() != null) {
            Utilisateur utilisateur = utilisateurDao.findById(auditDto.getUtilisateurId())
                    .orElseThrow(() -> new EntityNotFoundException("user not found"));
            audit.setUtilisateur(utilisateur);
        }
        if (auditDto.getDocumentId() != null) {
            Document document = documentDao.findById(auditDto.getDocumentId())
                    .orElseThrow(() -> new EntityNotFoundException("document not found"));
            audit.setDocument(document);
        }

        return auditDao.save(audit);
    }
    @Override
    public Audit saveAudit(Long documentId, String action) {
        Audit audit = new Audit();

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
        if (documentId != null) {
            Document document = documentDao.findById(documentId)
                    .orElseThrow(() -> new EntityNotFoundException("document not found"));
            audit.setDocument(document);
        }

        return auditDao.save(audit);
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

    @Override
    public List<Audit> getAll() {
        return auditDao.findAll();
    }

    @Override
    public Page<Audit> getAll(Pageable pageable) {
        return auditDao.findAll(pageable);
    }

    @Override
    public List<Audit> findAuditByDocument(Long idDocument) {
        return auditDao.findByDocumentId(idDocument);
    }

    @Override
    public List<Audit> findAuditByUtilisateur(Long idUtilisateur) {
        return auditDao.findByUtilisateurId(idUtilisateur);
    }

    @Override
    public List<Audit> findAuditByAction(String action) {
        return auditDao.findByAction(action);
    }
    @Override
    @Transactional
    public int deleteByDocumentId(Long id){
        return auditDao.deleteByDocumentId(id);
    }

    @Override
    public List<String> returnActions() {
        return getAll().stream()
                .map(Audit::getAction)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getUsersAndDocumentsConsultedMoreThanTenTimes() {
        List<Object[]> resultList = auditDao.findUsersAndDocumentsConsultedMoreThanTenTimes();
        List<Map<String, Object>> usersAndDocuments = new ArrayList<>();

        for (Object[] row : resultList) {
            String fullNAme = (String) row[0];
            String user = (String) row[1];
            String document = (String) row[2];
            Long consultationCount = (Long) row[3];

            Map<String, Object> userDocumentMap = new HashMap<>();
            userDocumentMap.put("fullName", fullNAme);
            userDocumentMap.put("user", user);
            userDocumentMap.put("document", document);
            userDocumentMap.put("consultationCount", consultationCount);

            usersAndDocuments.add(userDocumentMap);
        }

        return usersAndDocuments;
    }

    @Override
    public List<Map<String, Map<String, Integer>>> getAuditStats() {
        List<Map<String, Map<String, Integer>>> statsList = new ArrayList<>();
        int distinctActions = auditDao.countDistinctActions();

        List<Object[]> distinctDocumentsAndUsers = auditDao.countDistinctDocumentsAndUsersForEachAction();

        for (Object[] row : distinctDocumentsAndUsers) {
            String action = (String) row[0];
            int distinctDocuments = ((Number) row[1]).intValue();
            int distinctUsers = ((Number) row[2]).intValue();

            Map<String, Integer> actionStats = new HashMap<>();
            actionStats.put("nbDocuments", distinctDocuments);
            actionStats.put("nbUsers", distinctUsers);
            actionStats.put("nbActions", distinctActions);

            Map<String, Map<String, Integer>> stats = new HashMap<>();
            stats.put(action, actionStats);

            statsList.add(stats);
        }

        return statsList;
    }



}
