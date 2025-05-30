package ma.sir.ged.workflow.mapper;

import io.micrometer.core.instrument.util.StringUtils;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.workflow.DTO.WorkflowPresetDTO;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.service.imp.StepPresetServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Component
public class WorkflowPresetMapper {




    @Autowired
    private UtilisateurAdminService utilisateurDao ;
    @Autowired
    private final StepPresetServiceImp stepPresetServiceImp;

    private final StepPresetDTOMapper stepPresetDTOMapper;
    // Method to convert DTO to Entity



    public WorkflowPreset convertToEntity(WorkflowPresetDTO dto) {
        DateTimeFormatter formatter =  DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        WorkflowPreset entity = new WorkflowPreset();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setSuppression(true);
        entity.setDescription(dto.getDescription());
        if(StringUtils.isEmpty(dto.getDateC())){
            entity.setCreatedOn(LocalDateTime.now());
        }else {
            entity.setCreatedOn(LocalDateTime.parse(dto.getDateC(), formatter));
        }
        entity.setUpdatedOn(LocalDateTime.now());
        if(dto.getCreateurId() != null) {
            entity.setCreateur(utilisateurDao.findById(dto.getCreateurId()));
        }
         if(!dto.getStepPresets().isEmpty()) {
             entity.setStepPresetList(stepPresetDTOMapper.mapToEntityListInSave(dto.getStepPresets(), entity));
         }
        return entity;
    }

    public WorkflowPresetDTO convertToDTO(WorkflowPreset entity) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        WorkflowPresetDTO dto = new WorkflowPresetDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCreateurId(entity.getCreateur().getId());
        dto.setCreateurNom(entity.getCreateur().getNom());
        dto.setCreateurPrenom(entity.getCreateur().getPrenom());
        dto.setStepPresets(stepPresetServiceImp.getStepPeresetswithIdWorkflow(entity.getId()));


        dto.setDepartement(entity.getCreateur().getEntiteAdministrative().getLibelle());


        dto.setDateC(entity.getCreatedOn().format(formatter));
        dto.setDateUpdate(entity.getUpdatedOn().format(formatter));
        return dto;
    }


    public List<WorkflowPresetDTO> convertToDTOList(List<WorkflowPreset> entityList) {
        return entityList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
