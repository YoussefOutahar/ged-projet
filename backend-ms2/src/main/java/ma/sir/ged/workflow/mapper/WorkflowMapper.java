package ma.sir.ged.workflow.mapper;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.repository.WFPresetRepository;
import ma.sir.ged.workflow.service.WorkflowValidator;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class WorkflowMapper {

    @Autowired
    private UtilisateurAdminService utilisateurDao ;
    @Autowired
    private DocumentDao documentDao ;
    @Autowired
    private   WorkflowPresetMapper workflowPresetMapper;
    @Autowired
    private WFPresetRepository wfPresetRepository;
    @Autowired
    private StepDTOMapper stepMapper;
    @Autowired
    private  DocumentConverter documentConverter;




    public  Workflow DTOtoWorkflow(WorkflowDTO dto) throws Exception {

        Workflow workflow = new Workflow();
        workflow.setId(dto.getId());
        workflow.setTitle(dto.getTitle());
        workflow.setDescription(dto.getDescription());
        workflow.setStatus(dto.getStatus());
        workflow.setFlag(dto.getFlag());
        workflow.setCreatedOn( WorkflowValidator.validateDate(dto.getDateC()));
        workflow.setUpdatedOn(LocalDateTime.now());
        if (dto.getInitiateurId() == null) {
            throw new IllegalArgumentException("Initiateur ID cannot be null");
        }
        Utilisateur user = utilisateurDao.findById(dto.getInitiateurId());
        workflow.setInitiateur(user);
        workflow.setDocuments(documentConverter.toItem(dto.getDocuments()));
        if(!dto.getPiecesJointes().isEmpty()){
//            workflow.setPiecesJointes(documentConverter.toItem(dto.getPiecesJointes()));
            List<Document> existingPiecesJointes = new ArrayList<>();
            for (DocumentDto docDTO : dto.getPiecesJointes()) {
                Document document = documentDao.findById(docDTO.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Document not found with id: " + docDTO.getId()));
                existingPiecesJointes.add(document);
            }
            workflow.setPiecesJointes(existingPiecesJointes);
        }
        workflow.setWorkflowPreset(wfPresetRepository.findById(dto.getWorkflowPresetDTO().getId()).orElseThrow(
                () -> new EntityNotFoundException(" workflow Preset not found with id: ")));
        workflow.setStepList(stepMapper.mapToEntityListForSave(dto.getStepDTOList(),workflow));
        return workflow;
    }


    public  WorkflowDTO workflowtoDTO(Workflow workflow) {

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        WorkflowDTO dto = new WorkflowDTO();
        dto.setId(workflow.getId());
        dto.setTitle(workflow.getTitle());
        dto.setDescription(workflow.getDescription());
        dto.setFlag(workflow.getFlag());
        dto.setStatus(workflow.getStatus());
        dto.setDateC(workflow.getCreatedOn().format(formatter));
        dto.setDateUpdate(LocalDateTime.now().format(formatter));
        dto.setInitiateurId(workflow.getInitiateur().getId());
        dto.setInitiateurNom(workflow.getInitiateur().getNom());
        dto.setStepDTOList(stepMapper.mapToDTOList(workflow.getStepList()));
        dto.setWorkflowPresetDTO(workflowPresetMapper.convertToDTO(workflow.getWorkflowPreset()));
        dto.setDocuments(documentConverter.toDto(workflow.getDocuments()));
        if(!workflow.getPiecesJointes().isEmpty()){
            dto.setPiecesJointes(documentConverter.toDto(workflow.getPiecesJointes()));
        }

        return dto;
    }

    public List<WorkflowDTO> transferList(List<Workflow> workflowList) {
        return workflowList.stream()
                .map(this::workflowtoDTO)
                .collect(Collectors.toList());
    }





}
