package ma.sir.ged.workflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.sir.ged.workflow.DTO.WorkflowPresetDTO;
import ma.sir.ged.workflow.entity.WorkflowPreset;

import ma.sir.ged.workflow.mapper.WorkflowPresetMapper;
import ma.sir.ged.workflow.service.sev.WFPresetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows/workflowPresets")
@Tag(name = "Workflow Presets", description = "API for managing workflow Presets")
public class WorkflowPresetController {

    @Autowired
    private  WFPresetService wfPresetService;


    @Autowired
    private WorkflowPresetMapper workflowPresetMapper;


    @PostMapping
    @Operation(summary = "Create a new Workflow Preset", responses = {
            @ApiResponse(responseCode = "201", description = "Workflow Preset created",
                    content = @Content(schema = @Schema(implementation = WorkflowPresetDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request workflow Preset")
    })
    public ResponseEntity<WorkflowPresetDTO> createWorkflowPreset(@RequestBody WorkflowPresetDTO workflowPresetDTO) {
        return new ResponseEntity<>(wfPresetService.createWorkflowPreset(workflowPresetDTO), HttpStatus.CREATED);
    }



    @GetMapping("/{id}")
    @Operation(summary = "Get a Workflow Preset by ID", responses = {
            @ApiResponse(responseCode = "200", description = "Found the Workflow Preset",
                    content = @Content(schema = @Schema(implementation = WorkflowPreset.class))),
            @ApiResponse(responseCode = "404", description = "Workflow Preset not found")
    })
    public ResponseEntity<WorkflowPresetDTO> getWorkflowPresetById(@PathVariable Long id) {
        WorkflowPresetDTO dto = wfPresetService.getWorkflowPresetById(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("All")
    @Operation(summary = "List all Workflow Presets", responses = {
            @ApiResponse(responseCode = "200", description = "List of Workflow Presets",
                    content = @Content(schema = @Schema(implementation = WorkflowPreset.class)))
    })
    public ResponseEntity<List<WorkflowPresetDTO>> getAllWorkflowPresets() {
        List<WorkflowPreset> Presets = wfPresetService.getAllWorkflowPresets();

        return new ResponseEntity<>( workflowPresetMapper.convertToDTOList(Presets), HttpStatus.OK);
    }
    @GetMapping("departement/{libelle}")
    @Operation(summary = "List all Workflow Presets by Departement", responses = {
            @ApiResponse(responseCode = "200", description = "List of Workflow Presets",
                    content = @Content(schema = @Schema(implementation = WorkflowPreset.class)))
    })
    public ResponseEntity<List<WorkflowPresetDTO>> getAllWorkflowPresetsByEntite(@PathVariable String libelle) {
        return new ResponseEntity<>( wfPresetService.getAllWorkflowPresetsByEntite(libelle), HttpStatus.OK);
    }

    @PutMapping
    @Operation(summary = "Update a Workflow Preset", responses = {
            @ApiResponse(responseCode = "200", description = "Workflow Preset updated",
                    content = @Content(schema = @Schema(implementation = WorkflowPresetDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "404", description = "Workflow Preset not found")
    })
    public ResponseEntity<WorkflowPresetDTO> updateWorkflowPreset(@RequestBody WorkflowPresetDTO workflowPresetDTO) {
        if (workflowPresetDTO.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        WorkflowPresetDTO updatedPreset = wfPresetService.updateWorkflowPreset(workflowPresetDTO);
        return new ResponseEntity<>(updatedPreset, HttpStatus.OK);
    }










    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Workflow Preset", responses = {
            @ApiResponse(responseCode = "204", description = "Workflow Preset deleted"),
            @ApiResponse(responseCode = "404", description = "Workflow Preset not found")
    })
    public ResponseEntity<Void> deleteWorkflowPreset(@PathVariable Long id) {
        wfPresetService.deleteWorkflowPreset(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }





}
