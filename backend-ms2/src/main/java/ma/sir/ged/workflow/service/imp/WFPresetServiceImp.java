package ma.sir.ged.workflow.service.imp;


import io.micrometer.core.instrument.util.StringUtils;
import io.swagger.v3.oas.annotations.servers.Server;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.workflow.DTO.StepPresetDTO;
import ma.sir.ged.workflow.DTO.WorkflowPresetDTO;
import ma.sir.ged.workflow.entity.StepPreset;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.mapper.StepPresetDTOMapper;
import ma.sir.ged.workflow.mapper.UserDestinataireDTOMapper;
import ma.sir.ged.workflow.mapper.WorkflowPresetMapper;
import ma.sir.ged.workflow.repository.StepPresetRepository;
import ma.sir.ged.workflow.repository.UserDestinataireRepository;
import ma.sir.ged.workflow.repository.WFPresetRepository;
import ma.sir.ged.workflow.service.sev.WFPresetService;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


@Server
@Data
@Component
public class WFPresetServiceImp implements WFPresetService {

    private final UtilisateurDao utilisateurDao;
    private  final WFPresetRepository wfPresetRepository;
    private final StepPresetDTOMapper stepPresetDTOMapper;
    private final StepPresetServiceImp stepPresetServiceImp;
    private final StepPresetRepository stepPresetRepository;
    private final WorkflowPresetMapper workflowPresetMapper;
    private final UserDestinataireDTOMapper userDestinataireDTOMapper;
    private final UserDestinataireRepository userDestinataireRepository;
    private final UserDestinataireServiceImp userDestinataireServiceImp;
    private final VisbiliteService visbiliteService;


    @Transactional
    public WorkflowPresetDTO createWorkflowPreset(WorkflowPresetDTO workflowPresetDTO) {
        WorkflowPreset workflowPreset =  workflowPresetMapper.convertToEntity(workflowPresetDTO);
        WorkflowPreset workflowPresetCreated = wfPresetRepository.save(workflowPreset);
        visbiliteService.create(workflowPresetCreated.getId(),getAllDestinataireFromWorkflowPreset(workflowPresetCreated));
        return workflowPresetMapper.convertToDTO(workflowPresetCreated);
    }

    private List<Utilisateur> getAllDestinataireFromWorkflowPreset(WorkflowPreset workflowPreset) {
        return workflowPreset.getStepPresetList().stream()
                .flatMap(stepPreset -> stepPreset.getDestinataires().stream())
                .map(UserDestinataire::getUtilisateur)
                .collect(Collectors.toList());
    }



    @Override
    @Transactional
    public WorkflowPresetDTO getWorkflowPresetById(Long id) {

        WorkflowPreset workflowPreset = wfPresetRepository.findById(id).get();

        return   workflowPresetMapper.convertToDTO(workflowPreset);
    }

    @Override
    @Transactional
    public List<WorkflowPreset> getAllWorkflowPresets() {
        List<WorkflowPreset> workflowPresetList = wfPresetRepository.findAll();
        return workflowPresetList.stream()
                .filter(WorkflowPreset::isSuppression)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<WorkflowPresetDTO> getAllWorkflowPresetsByEntite(String libelle) {
        List<WorkflowPresetDTO> workflowPresetList = workflowPresetMapper.convertToDTOList(getAllWorkflowPresets());
        return workflowPresetList.stream()
                .filter(dto -> dto.getDepartement().equals(libelle))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkflowPresetDTO updateWorkflowPreset(WorkflowPresetDTO workflowPresetDTO) {
        WorkflowPreset existingWorkflowPreset = wfPresetRepository.findById(workflowPresetDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("WorkflowPreset with given ID does not exist."));
        WorkflowPreset newWorkflowPreset = new WorkflowPreset();
        updateWorkflowPresetFromDTO(newWorkflowPreset, workflowPresetDTO);
        existingWorkflowPreset.setSuppression(false);
        wfPresetRepository.save(existingWorkflowPreset);
        WorkflowPreset savedWorkflowPreset = wfPresetRepository.save(newWorkflowPreset);
        return workflowPresetMapper.convertToDTO(savedWorkflowPreset);
    }

    private void updateWorkflowPresetFromDTO(WorkflowPreset entity, WorkflowPresetDTO dto) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setSuppression(true);
        if(StringUtils.isEmpty(dto.getDateC())) {
            entity.setCreatedOn(LocalDateTime.now());
        } else {
            entity.setCreatedOn(LocalDateTime.parse(dto.getDateC(), formatter));
        }
        entity.setUpdatedOn(LocalDateTime.now());
        if(dto.getCreateurId() != null) {
            Utilisateur createur = utilisateurDao.findById(dto.getCreateurId())
                    .orElseThrow(() -> new IllegalArgumentException("Createur with given ID does not exist."));
            entity.setCreateur(createur);
        }
        entity.setStepPresetList(stepPresetDTOMapper.mapToEntityListInSave(dto.getStepPresets(), entity));
    }


    @Override
    @Transactional
    public void deleteWorkflowPreset(Long id) {
       WorkflowPreset workflowPreset= wfPresetRepository.findById(id).get();
       if(workflowPreset.isSuppression()){
           workflowPreset.setSuppression(false);
           wfPresetRepository.save(workflowPreset);
       }else {
           System.out.println("workflow Preset deja supprimer ");
       }
    }
}

