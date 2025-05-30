package ma.sir.ged.workflow.mapper;
import lombok.Data;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.workflow.DTO.StepDTO;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.StepPreset;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.STEP_STATUS;
import ma.sir.ged.workflow.repository.StepPresetRepository;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.workflow.repository.UserDestinataireRepository;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.ws.converter.DocumentConverter;
import org.springframework.stereotype.Component;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Component
public class StepDTOMapper {

    private final UserDestinataireRepository userDestinataireRepository;
    private final DocumentConverter documentConverter;
    private final CommentaireDTOMapper commentaireDTOMapper;
    private final StepPresetDTOMapper stepPresetDTOMapper;
    private final WorkflowRepository workflowRepository;
    private final StepPresetRepository stepPresetRepository;
    private final StepRepository stepRepository;

    public  StepDTO mapToDTO(Step step) {
        StepDTO stepDTO = new StepDTO();
        stepDTO.setId(step.getId());
        stepDTO.setStatus(step.getStatus());
        stepDTO.setWorkflowId(step.getWorkflow().getId());
        stepDTO.setStepPreset(stepPresetDTOMapper.mapToDto(step.getStepPreset()));
        stepDTO.setActions(step.getActions());
        stepDTO.setDocuments(documentConverter.toDto( step.getDocuments()));
        stepDTO.setDocumentsActions(documentConverter.toDto(step.getDocumentsActions()));
        stepDTO.setDiscussions(commentaireDTOMapper.mapToDTOList(step.getDiscussions()));

        stepDTO.setCreatedOn(String.valueOf(step.getCreatedOn()));

        if (step.getValidateDate() != null) {
            stepDTO.setValidateDate(step.getValidateDate().toString());
        }

        return stepDTO;
    }

    public  Step mapToEntity(StepDTO stepDTO) {
        Step step = new Step();
        step.setId(stepDTO.getId());
        step.setStatus(stepDTO.getStatus());
        step.setStepPreset(stepPresetRepository.findById(stepDTO.getStepPreset().getId()).get());

        step.setCreatedOn(LocalDateTime.parse(stepDTO.getCreatedOn()));

        if (stepDTO.getValidateDate() != null) {
            step.setValidateDate(LocalDateTime.parse(stepDTO.getValidateDate()));
        }

        return step;
    }



    public  Step mapToEntityForSave(StepDTO stepDTO, Workflow workflow) {
        Step step = new Step();
        StepPreset stepPreset =  stepPresetRepository.findById(stepDTO.getStepPreset().getId()).get();
        List<ACTION> listActioStep = new ArrayList<>(stepPreset.getActions());
        step.setStatus(stepDTO.getStatus());
        step.setStepPreset(stepPreset);
        step.setStatus(STEP_STATUS.WAITING);
        step.setDocuments(documentConverter.toItem(stepDTO.getDocuments()));
        if(step.getActions()==null){
            step.setActions(listActioStep);
        }else {
            step.getActions().clear();
            step.getActions().addAll(stepPreset.getActions());
        }
        //step.setWorkflow(workflow);


        List<UserDestinataire> destinationList = new ArrayList<>(Collections.nCopies(stepPreset.getDestinataires().size(), null));
        Collections.copy(destinationList, stepPreset.getDestinataires());
        step.setDestinataires(destinationList);

        stepDTO.setCreatedOn(String.valueOf(LocalDateTime.now()));


        stepRepository.save(step);
        return step;
    }

    private  List<UserDestinataire> mapUserDestinataireDTOsToEntities(List<UserDestinataireDTO> destinatairesDTO, Step step) {
        return destinatairesDTO.stream()
                .map(userDestinataireDTO -> {
                    UserDestinataire userDestinataire = new UserDestinataire();
                    userDestinataire.setId(userDestinataireDTO.getId());
                    // Map other fields as needed
                    return userDestinataire;
                })
                .collect(Collectors.toList());
    }

    private  List<Long> extractDocumentIds(List<Document> documents) {
        return documents.stream()
                .map(Document::getId)
                .collect(Collectors.toList());
    }

    public List<StepDTO> mapToDTOList(List<Step> stepList) {
        return stepList.stream()
                .map(step -> mapToDTO(step))
                .collect(Collectors.toList());
    }

    public List<Step> mapToEntityList(List<StepDTO> stepList) {
        return stepList.stream()
                .map(step -> mapToEntity(step))
                .collect(Collectors.toList());
    }
    public List<Step> mapToEntityListForSave(List<StepDTO> stepList, Workflow workflow) {
        return stepList.stream()
                .map(step -> mapToEntityForSave(step,workflow))
                .collect(Collectors.toList());
    }

    private  List<Long> extractDestinataireIds(List<UserDestinataire> destinataires) {
        return destinataires.stream()
                .map(UserDestinataire::getId)
                .collect(Collectors.toList());
    }
    private  List<UserDestinataire> loadDestinatairesByIds(List<Long> destinataireIds) {
        return destinataireIds.stream()
                .map(destinataireId -> userDestinataireRepository.findById(destinataireId).orElseThrow(
                        () -> new EntityNotFoundException("Error in mapping stepDTO to entity " +
                                "UserDestinataire not found with id: " + destinataireId)
                ) )
                .collect(Collectors.toList());
    }
}

