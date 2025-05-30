package ma.sir.ged.ws.facade.admin.doc;

import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.criteria.core.AuditCriteria;
import ma.sir.ged.dao.facade.core.doc.AuditDao;
import ma.sir.ged.service.facade.admin.doc.AuditAdminService;
import ma.sir.ged.ws.dto.AuditDto;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/audit")
public class AuditController   {

    @Autowired
    private AuditAdminService auditAdminService;
    @Autowired
    private AuditDao auditRepository;

    @PostMapping
    public ResponseEntity<Audit> create(@RequestBody AuditDto auditDto) {
        Audit audit = auditAdminService.create(auditDto);
        return new ResponseEntity<>(audit, HttpStatus.CREATED);
    }
    @GetMapping()
    public ResponseEntity<List<Audit>> getAll() {
        List<Audit> audits = auditAdminService.getAll();
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("/page")
    public Page<Audit> getAllAudits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return auditAdminService.getAll(pageable);
    }
    @GetMapping("actions")
    public ResponseEntity<List<String>> getAllActions() {
        List<String> actions = new ArrayList<>(auditAdminService.returnActions());
        return new ResponseEntity<>(actions, HttpStatus.OK);
    }
    @GetMapping("document/{id}")
    public ResponseEntity<List<Audit>> getAuditsByDocument(@PathVariable Long id) {
        List<Audit> audits = auditAdminService.findAuditByDocument(id);
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("utilisateur/{id}")
    public ResponseEntity<List<Audit>> getAuditsByUtilisateur(@PathVariable Long id) {
        List<Audit> audits = auditAdminService.findAuditByUtilisateur(id);
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("action/{action}")
    public ResponseEntity<List<Audit>> getAuditsByAction(@PathVariable String action) {
        List<Audit> audits = auditAdminService.findAuditByAction(action);
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @Operation(summary = "Finds paginated documents by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody AuditCriteria criteria) throws Exception {
        return null;
    }
    @GetMapping("/audit-stats")
    public ResponseEntity<List<Map<String, Map<String, Integer>>>> getAuditStats() {
        List<Map<String, Map<String, Integer>>> stats = auditAdminService.getAuditStats();
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/alert")
    public ResponseEntity<List<Map<String, Object>>> getUsersAndDocumentsConsultedMoreThanTenTimes() {
        List<Map<String, Object>> usersAndDocuments = auditAdminService.getUsersAndDocumentsConsultedMoreThanTenTimes();
        return ResponseEntity.ok(usersAndDocuments);
    }
}
