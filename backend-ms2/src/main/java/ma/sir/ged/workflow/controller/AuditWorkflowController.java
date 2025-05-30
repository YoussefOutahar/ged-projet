package ma.sir.ged.workflow.controller;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.workflow.DTO.AuditWorkflowDto;
import ma.sir.ged.workflow.entity.AuditWorkflow;
import ma.sir.ged.workflow.service.sev.AuditWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workflows/audit")
public class AuditWorkflowController {

    @Autowired
    private AuditWorkflowService auditAdminService;

    @PostMapping
    public ResponseEntity<AuditWorkflow> create(@RequestBody AuditWorkflowDto auditDto) {
        AuditWorkflow audit = auditAdminService.create(auditDto);
        return new ResponseEntity<>(audit, HttpStatus.CREATED);
    }
    @GetMapping()
    public ResponseEntity<List<AuditWorkflow>> getAll() {
        List<AuditWorkflow> audits = auditAdminService.getAll();
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("page")
    public ResponseEntity<Page<AuditWorkflow>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AuditWorkflow> audits = auditAdminService.getAll(page, size);

        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("actions")
    public ResponseEntity<List<String>> getAllActions() {
        List<String> actions = new ArrayList<>(auditAdminService.returnActions());
        return new ResponseEntity<>(actions, HttpStatus.OK);
    }
    @GetMapping("workflowId/{id}")
    public ResponseEntity<List<AuditWorkflow>> getAuditsByDocument(@PathVariable Long id) {
        List<AuditWorkflow> audits = auditAdminService.findAuditByWorkflow(id);
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("utilisateur/{id}")
    public ResponseEntity<List<AuditWorkflow>> getAuditsByUtilisateur(@PathVariable Long id) {
        List<AuditWorkflow> audits = auditAdminService.findAuditByUtilisateur(id);
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }
    @GetMapping("action/{action}")
    public ResponseEntity<List<AuditWorkflow>> getAuditsByAction(@PathVariable String action) {
        List<AuditWorkflow> audits = auditAdminService.findAuditByAction(action);
        return new ResponseEntity<>(audits, HttpStatus.OK);
    }

    @GetMapping("/audit-stats")
    public ResponseEntity<List<Map<String, Map<String, Integer>>>> getAuditStats() {
        List<Map<String, Map<String, Integer>>> stats = auditAdminService.getAuditStats();
        return ResponseEntity.ok(stats);
    }
}
