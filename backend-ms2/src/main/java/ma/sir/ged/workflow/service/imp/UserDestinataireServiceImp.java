package ma.sir.ged.workflow.service.imp;

import lombok.Data;
import ma.sir.ged.workflow.DTO.UserDestinataireDTO;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.mapper.UserDestinataireDTOMapper;
import ma.sir.ged.workflow.repository.UserDestinataireRepository;
import ma.sir.ged.workflow.service.sev.UserDestinataireService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
public class UserDestinataireServiceImp implements UserDestinataireService {

    private final UserDestinataireRepository userDestinataireRepository;
    private final UserDestinataireDTOMapper userDestinataireDTOMapper;
    public UserDestinataireDTO getUserDestinataireById(Long id) {
        UserDestinataire userDestinataire= userDestinataireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("UserDestinataire not found with id: " + id));
        return userDestinataireDTOMapper.mapToDTO(userDestinataire);
    }

    public List<UserDestinataireDTO> getAllUserDestinataires() {
        List<UserDestinataire> userDestinataireList= userDestinataireRepository.findAll();
        return userDestinataireDTOMapper.mapUserDestinatairesToDTOs(userDestinataireList);
    }


    public UserDestinataireDTO createUserDestinataire(UserDestinataireDTO userDestinataire) {
        UserDestinataire userDestinataireEntity = userDestinataireDTOMapper.mapToEntity(userDestinataire);
        UserDestinataire newUser =userDestinataireRepository.save(userDestinataireEntity);
        return userDestinataireDTOMapper.mapToDTO(newUser);}

    public List<UserDestinataireDTO> createUserDestinataireList(List<UserDestinataireDTO> userDestinataireDTOList) {
        List<UserDestinataire> userDestinataireEntity = userDestinataireDTOMapper.mapUserDestinatairesToEntities(userDestinataireDTOList);
        List<UserDestinataire> newUsers =userDestinataireRepository.saveAll(userDestinataireEntity);
        return userDestinataireDTOMapper.mapUserDestinatairesToDTOs(newUsers);
    }

   public UserDestinataireDTO updateUserDestinataire(Long id, UserDestinataireDTO updatedUserDestinataire) {
        UserDestinataire existingUserDestinataire = userDestinataireRepository
                .findById(id).orElseThrow(() -> new EntityNotFoundException("UserDestinataireServiceImp: UserDestinataire not found with id: " + id));

        UserDestinataire updatedUserDestinataireEntity = userDestinataireDTOMapper.mapToEntity(updatedUserDestinataire);

        existingUserDestinataire.setUtilisateur(updatedUserDestinataireEntity.getUtilisateur());
        existingUserDestinataire.setPoids(updatedUserDestinataireEntity.getPoids());
        existingUserDestinataire.setStepPreset(updatedUserDestinataireEntity.getStepPreset());

        UserDestinataire newUserDestinataire = userDestinataireRepository.save(existingUserDestinataire);
        return userDestinataireDTOMapper.mapToDTO(newUserDestinataire);

    }


    public void deleteUserDestinataire(Long id) {
        userDestinataireRepository.deleteById(id);
    }

    public List<UserDestinataireDTO> getUserDestinatairesListByUtilisateurId(Long utilisateurId) {
        List<UserDestinataire> userDestinataireList = userDestinataireRepository.findUserDestinatairesByUtilisateurId(utilisateurId);
        return userDestinataireDTOMapper.mapUserDestinatairesToDTOs(userDestinataireList);
    }
}
