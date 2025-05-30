package ma.sir.ged.workflow.service.sev;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.workflow.DTO.CommentaireDTO;
import ma.sir.ged.workflow.DTO.StepDTO;
import ma.sir.ged.ws.dto.DocumentDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StepService {
    StepDTO createStep(StepDTO step);

    List<StepDTO> getAllSteps();

    StepDTO getStepById(Long id);

    StepDTO updateStepDoc(StepDTO stepDTO);

    StepDTO updateStep(Long id, StepDTO updatedStep);

    StepDTO approuve (Long id,Long userId);
    void rejectDocFromStep(Long stepId, List<Long> documentIds);
    void rejectDocFromparapheur(Long stepId, List<Long> documentIds, Long parapheurId);
    StepDTO compliment(Long id , Long specificStepId);
    List<DocumentDto> findDocumentsInParapheurByWorkflowAndUser(Long stepId);
    StepDTO sign (Long id , Long userId);

    StepDTO parapher (Long id , Long userId);
    StepDTO presigner (Long id , Long userId);

    StepDTO reject (Long id);

    void deleteStep(Long id);

    Page<StepDTO> getStepsByInitiateurId(Long id, int page, int size, String search);

    Page<StepDTO> getStepsActionByInitiateurId(Long id, int page, int size, String search);

    List<StepDTO> getwaitingStepsByInitiateurId(Long id);

    Page<StepDTO> getDoneStepsByInitiateurId(Long id, int page, int size, String search);

    Page<StepDTO> getInProgressStepsByInitiateurId(Long id, int page, int size, String search);

    StepDTO addCommentaireToStep(Long id, CommentaireDTO commentaire);

    StepDTO actionDocument(Long id,  List<DocumentDto> documentDto);
    List<DocumentDto> findDocumentsActionsByStep(Long stepId);
    StepDTO preSignDocs(Long id, List<DocumentDto> documentDtoList);

    List<StepDTO> getPreviousStep(Long id);

    List<StepDTO> getNextStep(Long id);

    StepDTO signStepDocument(Long stepId, DocumentDto documentDto);

    List<DocumentDto> getAlldocumentTach(Long id);

    List<DocumentDto>  removeDocFromStep(Long stepId, List<DocumentDto> dtos);

    List<DocumentDto>  addDocToStep(Long stepId, List<DocumentDto> dtos);

    StepDTO envoiCourrierDone(Long stepId);

    StepDTO envoiCourrier(Long stepId, List<DocumentDto> documentDtos);
}
