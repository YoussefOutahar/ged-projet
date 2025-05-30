package ma.sir.ged.workflow.service;

import ma.sir.ged.workflow.DTO.StepPresetDTO;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.DTO.WorkflowPresetDTO;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class WorkflowValidator {

    public static List<String> validateWorkflowPresetDTO(WorkflowPresetDTO workflowDTO) {
        List<String> errors = new ArrayList<>();

        if (workflowDTO.getTitle() == null || workflowDTO.getTitle().trim().isEmpty()) {
            errors.add("Title is required");
        }


        // Validate nested StepPresetDTO list
        if (workflowDTO.getStepPresets() != null) {
            for (StepPresetDTO stepPreset : workflowDTO.getStepPresets()) {
                List<String> stepPresetErrors = validateStepPresetDTO(stepPreset);
                if (!stepPresetErrors.isEmpty()) {
                    errors.add("Validation errors in StepPresetDTO: " + stepPresetErrors);
                }
            }
        }

        return errors;
    }

    public static   LocalDateTime validateDate(String  dateString) throws Exception{

        if (dateString == null || dateString.trim().isEmpty()) {
            return LocalDateTime.now();

        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        try {
            return LocalDateTime.parse(dateString,formatter);

        } catch (Exception e) {

            throw new Exception("Parse Error for Date: " + e.getMessage());
        }
    }

    public static List<String> validateStepPresetDTO(StepPresetDTO stepPresetDTO) {
        List<String> errors = new ArrayList<>();

        if (stepPresetDTO.getTitle() == null || stepPresetDTO.getTitle().trim().isEmpty()) {
            errors.add("Title is required");
        }

        if (stepPresetDTO.getLevel() < 1) {
            errors.add("Level must be greater than or equal to 1");
        }


        // Validate nested UserDestinataireDTO list if present
        if (stepPresetDTO.getDestinataires() != null) {
            for (UserDestinataireDTO destinataire : stepPresetDTO.getDestinataires()) {
                List<String> destinataireErrors = validateUserDestinataireDTO(destinataire);
                if (!destinataireErrors.isEmpty()) {
                    errors.add("Validation errors in UserDestinataireDTO: " + destinataireErrors);
                }
            }
        }

        return errors;
    }

    @NotNull
    public static List<String> validateUserDestinataireDTO(UserDestinataireDTO userDestinataireDTO) {
        List<String> errors = new ArrayList<>();

        if (userDestinataireDTO.getUtilisateur() == null) {
            errors.add("Utilisateur is required");
        } else {
            if (userDestinataireDTO.getUtilisateur().getId() == null) {
                errors.add("Utilisateur ID is required");
            }

        }

        if (userDestinataireDTO.getPoids() < 1) {
            errors.add("Poids must be greater than or equal to 1");
        }


        return errors;
    }
}
