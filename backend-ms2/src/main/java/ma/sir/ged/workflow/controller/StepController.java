package ma.sir.ged.workflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.workflow.DTO.CommentaireDTO;
import ma.sir.ged.workflow.DTO.StepDTO;
import ma.sir.ged.workflow.entity.Commentaire;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.mapper.StepDTOMapper;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.workflow.service.imp.StepServiceImp;
import ma.sir.ged.ws.dto.DocumentDto;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workflows/step")
public class StepController {

    private final StepServiceImp stepService;


    @Operation(summary = "List Steps", description = "Get a list of all workflow steps")
    @GetMapping
    public ResponseEntity<List<StepDTO>> getAllSteps() {
        List<StepDTO> steps = stepService.getAllSteps();
        return ResponseEntity.ok(steps);
    }

    @Operation(summary = "Get Step by ID", description = "Retrieve a workflow step by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<StepDTO> getStepById(@PathVariable Long id) {
        StepDTO step = stepService.getStepById(id);
        return ResponseEntity.ok(step);
    }


    @Operation(summary = "Get Steps by destinataire ID and Status", description = "Retrieve workflow steps by destinataire ID and a specific status.")
    @GetMapping("/Destinataire/{id}")
    public ResponseEntity<Page<StepDTO>> stepsByDestinataireIdAndStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        Page<StepDTO> steps;
        if ("WAITING".equalsIgnoreCase(status)) {
            steps = stepService.getStepsActionByInitiateurId(id, page, size, search);
        } else if ("DONE".equalsIgnoreCase(status)) {
            steps = stepService.getDoneStepsByInitiateurId(id, page, size, search);
        } else if ("IN_PROGRESS".equalsIgnoreCase(status)) {
            steps = stepService.getInProgressStepsByInitiateurId(id, page, size, search);
        } else {
            steps = stepService.getStepsByInitiateurId(id, page, size, search);
        }

        return ResponseEntity.ok(steps);
    }


    @Operation(summary = "Create Step", description = "Create a new workflow step")
    @PostMapping
    public ResponseEntity<StepDTO> createStep(@RequestBody StepDTO step) {
        StepDTO createdStep = stepService.createStep(step);
        return new ResponseEntity<>(createdStep, HttpStatus.CREATED);
    }

    @Operation(summary = "Update Step", description = "Update an existing workflow step")
    @PutMapping("/{id}")
    public ResponseEntity<StepDTO> updateStep(
            @PathVariable Long id,
            @RequestBody StepDTO updatedStep
    ) {
        StepDTO updated = stepService.updateStep(id, updatedStep);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete Step", description = "Delete a workflow step by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStep(@PathVariable Long id) {
        stepService.deleteStep(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/updateDocument")
    public ResponseEntity<StepDTO> updateStepDoc(@RequestBody StepDTO stepDTO) {
        StepDTO updatedStepDTO = stepService.updateStepDoc(stepDTO);
        return ResponseEntity.ok(updatedStepDTO);
    }


    @PutMapping("/signDocumentWF/{Id}")
    public ResponseEntity<StepDTO> signStepDocument( @PathVariable Long Id, @RequestBody DocumentDto documentDto) {
        StepDTO updatedStepDTO = stepService.signStepDocument(Id, documentDto);
        return ResponseEntity.ok(updatedStepDTO);
    }


    @GetMapping("/previous/{id}")
    public ResponseEntity<List<StepDTO>> getPreviousStep(@PathVariable Long id) {
        List<StepDTO> stepDTO = stepService.getPreviousStep(id);
        if(stepDTO == null){
            return ResponseEntity.noContent().build();
        }   else {
            return ResponseEntity.ok(stepDTO);
        }
    }

    @GetMapping("/next/{id}")
    public ResponseEntity<List<StepDTO>> getNextStep(@PathVariable Long id) {
        List<StepDTO> stepDTO = stepService.getNextStep(id);
        if(stepDTO == null){
            return ResponseEntity.noContent().build();
        }   else {
            return ResponseEntity.ok(stepDTO);
        }

    }

    @GetMapping("/documentActions/{id}")
    public ResponseEntity<List<DocumentDto>> getDocumentsActionsByStep(@PathVariable Long id) {
        List<DocumentDto> documentDtos = stepService.findDocumentsActionsByStep(id);
        if(documentDtos == null){
            return ResponseEntity.noContent().build();
        }   else {
            return ResponseEntity.ok(documentDtos);
        }

    }
    @GetMapping("/documentsPresign/{id}")
    public  ResponseEntity<List<DocumentDto>> getDocumentsPresign(@PathVariable Long id) {
        return ResponseEntity.ok(stepService.findDocumentsInParapheurByWorkflowAndUser(id));
    }



    @PutMapping("/approve/{id}/{userId}")
    @Operation(summary = "Approve a Step by its id", description = "Marks the step as approved based on the given ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Step approved successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = StepDTO.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid ID supplied",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Step not found",
                    content = @Content)})
    public ResponseEntity<StepDTO> approveStep(@Parameter(description = "ID of the step to be approved") @PathVariable Long id, @PathVariable Long userId) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updated = stepService.approuve(id ,userId );
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/sign/{id}/{userId}")
    @Operation(summary = "sign a Step by its id", description = "Marks the step as signed based on the given ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Step sign successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = StepDTO.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid ID supplied",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Step not found",
                    content = @Content)})
    public ResponseEntity<StepDTO> signStep(@Parameter(description = "ID of the step to be sign") @PathVariable Long id , @PathVariable Long userId) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updated = stepService.sign(id, userId);
        return ResponseEntity.ok(updated);
    }
    @PutMapping("/parapher/{id}/{userId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Step done successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = StepDTO.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid ID supplied",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Step not found",
                    content = @Content)})
    public ResponseEntity<StepDTO> parapherStep( @PathVariable Long id , @PathVariable Long userId) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updated = stepService.parapher(id, userId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/presigner/{id}/{userId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Step done successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = StepDTO.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid ID supplied",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Step not found",
                    content = @Content)})
    public ResponseEntity<StepDTO> presignerStep( @PathVariable Long id , @PathVariable Long userId) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updated = stepService.presigner(id, userId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/Compliment/{id}")
    @Operation(summary = "Compliment a Step by de next step", description = "Marks the step as rejected based on the given ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Step Compliment successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = StepDTO.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid ID supplied",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Step not found",
                    content = @Content)})
    public ResponseEntity<StepDTO> CreatComplimentStep(@Parameter(description = "ID of the step to be Compliment") @PathVariable Long id,
                                                       @RequestParam(value = "specificStepId", required = false) Long specificStepId) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updated = stepService.compliment(id, specificStepId);
        return ResponseEntity.ok(updated);
    }
    @PutMapping("/rejectDoc/Step/{stepId}")
    public ResponseEntity rejectDocFromStep(@PathVariable Long stepId, @RequestBody List<Long> documentIds) {
        if (stepId == null || documentIds == null || documentIds.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        stepService.rejectDocFromStep(stepId, documentIds);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/steps/{stepId}/reject-documents")
    public ResponseEntity<Void> rejectDocFromParapheur(
            @PathVariable("stepId") Long stepId,
            @RequestBody List<Long> documentIds,
            @RequestParam(value = "parapheurId", required = false) Long parapheurId) {

        try {
            stepService.rejectDocFromparapheur(stepId, documentIds, parapheurId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/reject/{id}")
    @Operation(summary = "reject a Step by its id", description = "Marks the step as rejected based on the given ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Step reject successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = StepDTO.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid ID supplied",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Step not found",
                    content = @Content)})
    public ResponseEntity<StepDTO> rejectStep(@Parameter(description = "ID of the step to be reject") @PathVariable Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updated = stepService.reject(id);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Commentaire Step", description = "Add commentaire to step  step")
    @PutMapping("/Commentaire/{id}")
    public ResponseEntity<StepDTO> addCommentaireTostep(
            @PathVariable Long id,
            @RequestBody CommentaireDTO commentaireDTO
            ) {
            StepDTO stepDTO = stepService.addCommentaireToStep(id,commentaireDTO);

        return ResponseEntity.ok(stepDTO);
    }


    @Operation(summary = "Document action", description = "Add Document  to action in a step ")
    @PutMapping("/actionDoc/{id}")
    public ResponseEntity<StepDTO>actionDoc(
            @PathVariable Long id,
            @RequestBody List<DocumentDto> documentDto
            ) {
        StepDTO stepDTO = stepService.actionDocument(id, documentDto);

        return ResponseEntity.ok(stepDTO);
    }

    @PutMapping("/preSignDocs/{id}")
    public ResponseEntity<StepDTO>preSignDocs(
            @PathVariable Long id,
            @RequestBody List<DocumentDto> documentDto
    ) {
        StepDTO stepDTO = stepService.preSignDocs(id, documentDto);

        return ResponseEntity.ok(stepDTO);
    }

    @Operation(summary = "Get all documents  tasks", description = "Retrieve all documents of a task")
    @GetMapping("/documentsCollab/{id}")
    public ResponseEntity<List<DocumentDto>> getAlldocumentTach(@PathVariable Long id) {
        List<DocumentDto> documents = stepService.getAlldocumentTach(id);
        return ResponseEntity.ok(documents);
    }


    @PostMapping("/{stepId}/documents")
    public ResponseEntity<List<DocumentDto>> addDocumentsToStep(@PathVariable Long stepId, @RequestBody List<DocumentDto> documentDtos) {
        return ResponseEntity.ok(stepService.addDocToStep(stepId, documentDtos));
    }

    @DeleteMapping("/{stepId}/documents")
    public ResponseEntity<List<DocumentDto> > removeDocumentsFromStep(@PathVariable Long stepId, @RequestBody List<DocumentDto> documentDtos) {
        return ResponseEntity.ok(stepService.removeDocFromStep(stepId, documentDtos));
    }

    @PutMapping("/envoiCourrierDone/{stepId}")
    public ResponseEntity<StepDTO> envoiCourrier(@PathVariable Long stepId) {
        if( stepId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updatedStep = stepService.envoiCourrierDone(stepId);
        return ResponseEntity.ok(updatedStep);
    }

    @PutMapping("/envoiCourrier/{stepId}")
    public ResponseEntity<StepDTO> envoiCourrier(@PathVariable Long stepId, @RequestBody List<DocumentDto> documentDtos) {
        if( stepId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        StepDTO updatedStep = stepService.envoiCourrier(stepId, documentDtos);
        return ResponseEntity.ok(updatedStep);
    }

}
