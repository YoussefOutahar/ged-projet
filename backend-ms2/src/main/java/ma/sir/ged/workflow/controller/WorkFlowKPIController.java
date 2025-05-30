package ma.sir.ged.workflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.sir.ged.workflow.DTO.SignedCertPerWorkflowDTO;
import ma.sir.ged.workflow.DTO.WorkflowKPIDto;
import ma.sir.ged.workflow.DTO.WorkflowStepKPIDto;
import ma.sir.ged.workflow.DTO.WorkflowWithDurationDto;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.entity.enums.Flag;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.workflow.repository.WFPresetRepository;
import org.springframework.web.bind.annotation.*;

import ma.sir.ged.workflow.service.sev.WorkFlowKPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;


@RestController
@RequestMapping("/api/workflows/kpi")
@Tag(name = "Workflow kpi", description = "API for managing workflow Dashboard KPIs")
public class WorkFlowKPIController {

    @Autowired
    private WorkFlowKPIService workFlowKPIService;

    @Autowired
    private WFPresetRepository workflowPresetRepository;

    @GetMapping("/count")
    @Operation(summary = "Count all workflows")
    public ResponseEntity<Long> countWorkflows() {
        return ResponseEntity.ok(workFlowKPIService.count());
    }

    @GetMapping("/countByUser")
    @Operation(summary = "Count all workflows")
    public ResponseEntity<Long> countWorkflowsByUser(@RequestParam Long initiateurId) {
        return ResponseEntity.ok(workFlowKPIService.findWorkflowByInitiateurId(initiateurId));
    }


    @GetMapping("/status")
    @Operation(summary = "Count workflows By Status ")
    public ResponseEntity<Long> countWorkflowsByStatus(@RequestParam WorkflowStatus status) {
        return ResponseEntity.ok(workFlowKPIService.countWorkflowsByStatus(status));
    }

    @GetMapping("/status/initiateurId")
    @Operation(summary = "Count workflows By Status ")
    public ResponseEntity<Long> countWorkflowsByStatusAndInitiateur(@RequestParam WorkflowStatus status, @RequestParam Long initiateurId) {
        return ResponseEntity.ok(workFlowKPIService.countWorkflowsByStatusAndInitiateur(status, initiateurId));
    }

    @GetMapping("/flag")
    @Operation(summary = "Count workflows By Status ")
    public ResponseEntity<Long> countWorkflowsByFlag(@RequestParam Flag flag) {
        return ResponseEntity.ok(workFlowKPIService.countWorkflowsByFlag(flag));
    }

    @GetMapping("/flag/user")
    @Operation(summary = "Count workflows By Status ")
    public ResponseEntity<Long> countWorkflowsByFlagAndUser(@RequestParam Long id,@RequestParam Flag flag) {
        return ResponseEntity.ok(workFlowKPIService.countWorkflowsByFlagAndInitiateur(id, flag));
    }

    @GetMapping("/signedCertPerWorkflow")
    @Operation(summary = "count signed certification/document per workflow")
    public ResponseEntity<List<SignedCertPerWorkflowDTO>> countSignedCertPerWorkflow() {
        return ResponseEntity.ok(workFlowKPIService.countSignedCertPerWorkflow());
    }

    @GetMapping("/workflowDuration/{id}")
    @Operation(summary = "count signed certification/document per workflow")
    public ResponseEntity<List<WorkflowWithDurationDto>> extraireDureesFinWorkflowParPreset(@PathVariable Long id) {
        WorkflowPreset workflowPreset = workflowPresetRepository.findById(id).orElse(null);
        return ResponseEntity.ok(workFlowKPIService.extraireDureesFinWorkflowParPreset(workflowPreset));
    }
    @GetMapping("/top3/lente/{id}")
    @Operation(summary = "count signed certification/document per workflow")
    public ResponseEntity<List<WorkflowStepKPIDto>> extraireTop3StepsLentesParWorkflowPreset(@PathVariable Long id) {
        WorkflowPreset workflowPreset = workflowPresetRepository.findById(id).orElse(null);
        return ResponseEntity.ok(workFlowKPIService.extraireTop3StepsLentesParWorkflowPreset(workflowPreset));
    }
    @GetMapping("/top3/rapide/{id}")
    @Operation(summary = "count signed certification/document per workflow")
    public ResponseEntity<List<WorkflowStepKPIDto>> extraireTop3StepsRapidesParWorkflowPreset(@PathVariable Long id) {
        WorkflowPreset workflowPreset = workflowPresetRepository.findById(id).orElse(null);
        return ResponseEntity.ok(workFlowKPIService.extraireTop3StepsRapidesParWorkflowPreset(workflowPreset));
    }

    @GetMapping("/{title}")
    @Operation(summary = "get statis of all workflow")
    public ResponseEntity<List<WorkflowKPIDto>> getWorkflowKPIDto(@PathVariable String title) {
        return ResponseEntity.ok(workFlowKPIService.getWorkflowKPIDtoByTitle(title));
    }

    @GetMapping("")
    @Operation(summary = "get statis of all workflow")
    public ResponseEntity<List<WorkflowKPIDto>> getWorkflowKPIDto(){
        return ResponseEntity.ok(workFlowKPIService.getWorkflowKPIDto());
    }


}

