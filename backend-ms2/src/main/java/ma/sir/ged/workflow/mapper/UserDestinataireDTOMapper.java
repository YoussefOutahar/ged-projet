package ma.sir.ged.workflow.mapper;


import lombok.Data;

import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.entity.StepPreset;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.repository.StepPresetRepository;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.workflow.repository.UserDestinataireRepository;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Data
@Component
public class UserDestinataireDTOMapper {

    private  final StepRepository stepRepository;
    private  final UtilisateurAdminService utilisateurRepository;
    private final UtilisateurConverter utilisateurConverter;
    private final StepPresetRepository stepPresetRepository;
    private final UserDestinataireRepository userDestinataireRepository;

    public  UserDestinataireDTO mapToDTO(UserDestinataire userDestinataire) {
        UserDestinataireDTO userDestinataireDTO = new UserDestinataireDTO();
        userDestinataireDTO.setId(userDestinataire.getId());
        userDestinataireDTO.setPoids(userDestinataire.getPoids());
        userDestinataireDTO.setStepId(userDestinataire.getStepPreset().getId());
        userDestinataireDTO.setUtilisateur(utilisateurConverter.toDto(userDestinataire.getUtilisateur()));
        userDestinataireDTO.setShouldSign(userDestinataire.isShouldSign());

        return userDestinataireDTO;
    }

    public UserDestinataire mapToEntity(UserDestinataireDTO userDestinataireDTO) {
        UserDestinataire userDestinataire = new UserDestinataire();
        userDestinataire.setId(userDestinataireDTO.getId());
        userDestinataire.setPoids(userDestinataireDTO.getPoids());
        userDestinataire.setStepPreset(
                stepPresetRepository.findById(userDestinataireDTO.getStepId())
                        .orElseThrow(() -> new EntityNotFoundException(" UserDestinataireDTOMapper: StepPreset not found with id: " + userDestinataireDTO.getStepId()))
        );
        userDestinataire.setUtilisateur(utilisateurConverter.toItem(userDestinataireDTO.getUtilisateur()));
        userDestinataire.setShouldSign(userDestinataireDTO.isShouldSign());

        return userDestinataire;
    }

    public  List<UserDestinataireDTO> mapUserDestinatairesToDTOs(List<UserDestinataire> destinataires) {
        return destinataires.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    public List<UserDestinataire> mapUserDestinatairesToEntities(List<UserDestinataireDTO> destinataires) {
        return destinataires.stream()
                .map(this::mapToEntity)
                .collect(Collectors.toList());
    }

    public UserDestinataire mapToEntitySave(UserDestinataireDTO userDestinataireDTO, StepPreset stepPreset) {
        UserDestinataire userDestinataire = new UserDestinataire();
        userDestinataire.setId(userDestinataireDTO.getId());
        userDestinataire.setPoids(userDestinataireDTO.getPoids());
        userDestinataire.setStepPreset(stepPreset);
        userDestinataire.setUtilisateur(utilisateurConverter.toItem(userDestinataireDTO.getUtilisateur()));
        userDestinataire.setShouldSign(userDestinataireDTO.isShouldSign());

        return userDestinataire;
    }


    public List<UserDestinataire> mapToEntityListInSave(List<UserDestinataireDTO> userDestinataireDTOList, StepPreset stepPreset) {

        List<UserDestinataire> userDestinataireList = new ArrayList<>();
        if (userDestinataireDTOList == null) {
            return userDestinataireList ;
        }
        for (UserDestinataireDTO userDestinataireDTO : userDestinataireDTOList) {
            UserDestinataire userDestinataire = new UserDestinataire();
            userDestinataire.setPoids(userDestinataireDTO.getPoids());
            // Conversion de l'utilisateurDTO en utilisateur
           userDestinataire.setUtilisateur(utilisateurConverter.toItem(userDestinataireDTO.getUtilisateur()));
            // Associe le StepPreset fourni à chaque UserDestinataire
            userDestinataire.setShouldSign(userDestinataireDTO.isShouldSign());
            userDestinataire.setStepPreset(stepPreset);

            userDestinataireList.add(userDestinataire);
        }


        return userDestinataireList;
    }






}
