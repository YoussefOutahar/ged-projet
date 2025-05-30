package ma.sir.ged.workflow.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.service.sev.UserDestinataireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows/user-destinataires")
@RequiredArgsConstructor
public class UserDestinataireController {

    private final UserDestinataireService userDestinataireService;

    @GetMapping("/{id}")
    @Operation(summary = "Get user destinataire by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User destinataire found"),
            @ApiResponse(responseCode = "404", description = "User destinataire not found")
    })
    public ResponseEntity<UserDestinataireDTO> getUserDestinataireById(
            @Parameter(description = "ID of the user destinataire to be retrieved", required = true)
            @PathVariable Long id) {
        UserDestinataireDTO userDestinataire = userDestinataireService.getUserDestinataireById(id);
        return new ResponseEntity<>(userDestinataire, HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "Get all user destinataires")
    @ApiResponse(responseCode = "200", description = "List of user destinataires")
    public ResponseEntity<List<UserDestinataireDTO>> getAllUserDestinataires() {
        List<UserDestinataireDTO> userDestinataires = userDestinataireService.getAllUserDestinataires();
        return new ResponseEntity<>(userDestinataires, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Create a new user destinataire")
    @ApiResponse(responseCode = "201", description = "User destinataire created")
    public ResponseEntity<UserDestinataireDTO> createUserDestinataire(
            @Parameter(description = "User destinataire to be created", required = true)
            @RequestBody UserDestinataireDTO userDestinataire) {
        UserDestinataireDTO createdUserDestinataire = userDestinataireService.createUserDestinataire(userDestinataire);
        return new ResponseEntity<>(createdUserDestinataire, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user destinataire by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User destinataire updated"),
            @ApiResponse(responseCode = "404", description = "User destinataire not found")
    })
    public ResponseEntity<UserDestinataireDTO> updateUserDestinataire(
            @Parameter(description = "ID of the user destinataire to be updated", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated user destinataire information", required = true)
            @RequestBody UserDestinataireDTO updatedUserDestinataire) {
        UserDestinataireDTO updatedUser = userDestinataireService.updateUserDestinataire(id, updatedUserDestinataire);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user destinataire by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User destinataire deleted"),
            @ApiResponse(responseCode = "404", description = "User destinataire not found")
    })
    public ResponseEntity<Void> deleteUserDestinataire(
            @Parameter(description = "ID of the user destinataire to be deleted", required = true)
            @PathVariable Long id) {
        userDestinataireService.deleteUserDestinataire(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/utilisateur/{id}")
    @Operation(summary = "Get userdestinataire list by user ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User destinataire found"),
            @ApiResponse(responseCode = "404", description = "User destinataire not found")
    })
    public ResponseEntity<List<UserDestinataireDTO>> getUserDestinataireByUserId(
            @Parameter(description = "ID of the user to be retrieved", required = true)
            @PathVariable Long id) {
        List<UserDestinataireDTO> userDestinataire = userDestinataireService.getUserDestinatairesListByUtilisateurId(id);
        return new ResponseEntity<>(userDestinataire, HttpStatus.OK);
    }
}
