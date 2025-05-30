package ma.sir.ged.workflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.workflow.DTO.StepPresetDTO;
import ma.sir.ged.workflow.service.sev.StepPresetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workflows/stepPreset")
public class StepPresetController {

    private final StepPresetService stepPresetService;

    @Operation(summary = "Create a new StepPreset")
    @PostMapping
    public ResponseEntity<StepPresetDTO> createStepPreset(@RequestBody StepPresetDTO stepPresetDTO) {
        StepPresetDTO createdStepPreset = stepPresetService.createStepPreset(stepPresetDTO);
        return new ResponseEntity<>(createdStepPreset, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all StepPresets")
    @GetMapping
    public ResponseEntity<List<StepPresetDTO>> getAllStepPresets() {
        List<StepPresetDTO> allStepPresets = stepPresetService.getAllStepPresets();
        return new ResponseEntity<>(allStepPresets, HttpStatus.OK);
    }

    @Operation(summary = "Get a specific StepPreset by ID")
    @GetMapping("/{id}")
    public ResponseEntity<StepPresetDTO> getStepPresetById(@PathVariable Long id) {
        StepPresetDTO stepPresetDTO = stepPresetService.getStepPresetById(id);
        return new ResponseEntity<>(stepPresetDTO, HttpStatus.OK);
    }

    @Operation(summary = "Update an existing StepPreset")
    @PutMapping("/{id}")
    public ResponseEntity<StepPresetDTO> updateStepPreset(@PathVariable Long id, @RequestBody StepPresetDTO updatedStepPresetDTO) {
        StepPresetDTO updatedStepPreset = stepPresetService.updateStepPreset(id, updatedStepPresetDTO);
        return new ResponseEntity<>(updatedStepPreset, HttpStatus.OK);
    }

    @Operation(summary = "Delete a StepPreset by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStepPreset(@PathVariable Long id) {
        stepPresetService.deleteStepPreset(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get Step Presets by Workflow ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved Step Presets"),
            @ApiResponse(responseCode = "404", description = "Workflow not found")
    })

    @GetMapping("/workflow/{id}")
    public ResponseEntity<List<StepPresetDTO>> getStepPresetsByWorkflowId(@PathVariable Long id) {
        List<StepPresetDTO> stepPresets = stepPresetService.getStepPeresetswithIdWorkflow(id);
        return new ResponseEntity<>(stepPresets, HttpStatus.OK);
    }

}
