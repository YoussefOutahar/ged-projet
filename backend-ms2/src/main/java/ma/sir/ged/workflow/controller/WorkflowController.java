package ma.sir.ged.workflow.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.entity.AuditWorkflow;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.workflow.mapper.WorkflowMapper;
import ma.sir.ged.workflow.service.imp.WorkflowServiceImp;
import ma.sir.ged.workflow.service.sev.AuditWorkflowService;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.ParapheurDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows/workflow")
@CrossOrigin("*")
@RequiredArgsConstructor
@Tag(name = "Workflow", description = "Workflow management API")
public class WorkflowController {


    @Autowired
    private final WorkflowServiceImp workflowService ;

    @Autowired
    private  WorkflowMapper workflowMapper;

    @Autowired
    private AuditWorkflowService auditWorkflowService ;



    @PostMapping
    @Operation(summary = "Create a new workflow", responses = {
            @ApiResponse(description = "The created workflow", responseCode = "201",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Bad Request", responseCode = "400")
    })
    public ResponseEntity<WorkflowDTO> createWorkflow(@RequestBody WorkflowDTO workflowDTO) throws Exception {

        Workflow createdWorkflow = workflowService.createWorkflow(workflowDTO);
        return new ResponseEntity<>(workflowDTO, HttpStatus.CREATED);
    }

    ////////////////////////////////////////////////////


    @PostMapping("/{workflowId}/courriels/{courrielBoId}")
    public ResponseEntity<Void> associateCourrielBoWithWorkflow(@PathVariable Long workflowId, @PathVariable Long courrielBoId) {
        workflowService.associateCourrielBoWithWorkflow(courrielBoId, workflowId);
        AuditWorkflow audit = auditWorkflowService.saveAudit(workflowId, "Lancer Courriel");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{workflowId}/parapheur/{parapheurBoId}/currentStep/{currentStepId}")
    public ResponseEntity<Void> associateParapheurWithWorkflow(@PathVariable Long workflowId, @PathVariable Long parapheurBoId, @PathVariable String currentStepId) {
        workflowService.associateParapheurWithWorkflow(parapheurBoId, workflowId);
        workflowService.generateAndAddFicheParapheur(parapheurBoId, workflowId, Long.parseLong(currentStepId));
        auditWorkflowService.saveAudit(workflowId, "Lancer Parapheur");
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{id}")
    @Operation(summary = "Get a workflow by ID", responses = {
            @ApiResponse(description = "The workflow", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Not Found", responseCode = "404")
    })
    public ResponseEntity<WorkflowDTO> getWorkflowById(@PathVariable Long id) {
        return new ResponseEntity<>(workflowService.getWorkflowById(id), HttpStatus.OK);
    }
    ///////////////////////////////////////////


    @GetMapping("/documentActions/{id}")
    @Operation(summary = "Get a workflow by ID", responses = {
            @ApiResponse(description = "The workflow", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Not Found", responseCode = "404")
    })
    public ResponseEntity<List<DocumentDto>> getAllDocumentsActionsFromWorkflow(@PathVariable Long id) {
        return new ResponseEntity<>(workflowService.getAllDocumentsActionsFromWorkflow(id), HttpStatus.OK);
    }

    @GetMapping("/initiataur/{id}")
    @Operation(summary = "Get a workflows by initiateur ID ", responses = {
            @ApiResponse(description = "The workflow", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Not Found", responseCode = "404")
    })
    public ResponseEntity<List<WorkflowDTO>> getWorkflowByInitiateurId(@PathVariable Long id , @RequestParam WorkflowStatus status) {
        List<WorkflowDTO>  workflowDTOList= workflowService.gewWorkflowByInitiateurId(id , status);
    return new ResponseEntity<>( workflowDTOList , HttpStatus.OK);
    }

    @GetMapping("/initiataur/paganieted/{id}")
    @Operation(summary = "Get a workflows by initiateur ID ", responses = {
            @ApiResponse(description = "The workflow", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Not Found", responseCode = "404")
    })
    public ResponseEntity<Page<WorkflowDTO>> getWorkflowByInitiateurId(@PathVariable Long id , @RequestParam WorkflowStatus status,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "7") int size
    ) {
        Page<WorkflowDTO>  workflowDTOList= workflowService.getWorkflowByInitiateurId(id,status,page,size);
        return new ResponseEntity<>( workflowDTOList , HttpStatus.OK);
    }


    @GetMapping("/initiataur/paganieted/visible/{id}")
    @Operation(summary = "Get a workflows by initiateur ID ", responses = {
            @ApiResponse(description = "The workflow", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Not Found", responseCode = "404")
    })
    public ResponseEntity<Page<WorkflowDTO>> getWorkflowByInitiateurIdVisible(@PathVariable Long id , @RequestParam WorkflowStatus status,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "7") int size
    ) {
        Page<WorkflowDTO>  workflowDTOList= workflowService.getWorkflowByInitiateurIdVisble(id,status,page,size);
        return new ResponseEntity<>( workflowDTOList , HttpStatus.OK);
    }




    ////////////////////////////////////////////////////////
    @GetMapping("")
    @Operation(summary = "List all workflows", responses = {
            @ApiResponse(description = "Array of workflows", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class)))
    })
    public List<WorkflowDTO> getAllWorkflows() {
        return workflowService.getAllWorkflows();
    }

    ////////////////////////////////////////////////


    @PutMapping("/annuler/{id}")
    @Operation(summary = "annuler a workflow by ID", responses = {
            @ApiResponse(description = "The workflow annuler", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Not Found workflow pour annuler", responseCode = "404")
    })
    public ResponseEntity<WorkflowDTO> annulerWorkflow(@PathVariable Long id) {
        return new ResponseEntity<>(workflowService.annulerWorkflow(id), HttpStatus.OK);
    }

    @PutMapping("/reopen/{id}")
    public ResponseEntity<WorkflowDTO> reouvrirWorkflow(@PathVariable Long id) {
        return new ResponseEntity<>(workflowService.reouvrirWorkflow(id), HttpStatus.OK);
    }

    @PutMapping("/close/{id}")
    public ResponseEntity<WorkflowDTO> closeWorkflow(@PathVariable Long id) {
        return new ResponseEntity<>(workflowService.closeWorkflow(id), HttpStatus.OK);
    }

    @PostMapping("/step/{id}")
    @Operation(summary = "annuler a workflow by ID")
    public ResponseEntity<Step> addDocumentToStep(@PathVariable Long id) {
        return new ResponseEntity<>(workflowService.addDocumentToStep(id), HttpStatus.NO_CONTENT);
    }


    @PutMapping
    @Operation(summary = "Update an existing workflow", responses = {
            @ApiResponse(description = "The updated workflow", responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Workflow.class))),
            @ApiResponse(description = "Bad Request", responseCode = "400")
    })
    public ResponseEntity<Workflow> updateWorkflow(@RequestBody WorkflowDTO workflowDTO) throws Exception {
        Workflow updatedWorkflow = workflowService.updateWorkflow(workflowDTO);
        AuditWorkflow audit = auditWorkflowService.saveAudit(updatedWorkflow.getId(), "Modifier");
        return new ResponseEntity<>(updatedWorkflow, HttpStatus.OK);
    }

    /////////////////////////////////////////




    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a workflow by ID", responses = {
            @ApiResponse(description = "No Content", responseCode = "204"),
            @ApiResponse(description = "Not Found", responseCode = "404")
    })
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    //////////////////////////////////////////////

    @GetMapping("/byParapheur/{parapheurId}")
    public ResponseEntity<Workflow> getWorkflowByParapheurId(@PathVariable Long parapheurId) {
        Workflow workflow = workflowService.getWorkflowByParapheurId(parapheurId);
        if (workflow != null) {
            return ResponseEntity.ok(workflow);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{workflowId}/addPV")
    public ResponseEntity<WorkflowDTO> addPVToWorkflow(@PathVariable Long workflowId, @RequestBody List<DocumentDto> dtos) {
        WorkflowDTO updatedWorkflow = workflowService.addPVToWorkflow(workflowId, dtos);
        return ResponseEntity.ok(updatedWorkflow);
    }

    @GetMapping("/parapheurs/{workflowId}")
    public ResponseEntity<List<ParapheurDto>> getParapheursByWorkflowId(@PathVariable Long workflowId) {
        List<ParapheurDto> parapheurDtoList = workflowService.getParapheursByWorkflowId(workflowId);
        return ResponseEntity.ok(parapheurDtoList);
    }

    @GetMapping("/signedCE/{workflowId}")
    public List<DocumentDto> getSignedCEByWorkflowId(@PathVariable Long workflowId) {
        return workflowService.getSignedCEByWorkflowId(workflowId);
    }
}
