package ma.sir.ged.workflow.service.sev;

import ma.sir.ged.workflow.DTO.UserDestinataireDTO;

import java.util.List;

public interface UserDestinataireService {
    UserDestinataireDTO getUserDestinataireById(Long id);

    List<UserDestinataireDTO> getAllUserDestinataires();

    UserDestinataireDTO createUserDestinataire(UserDestinataireDTO userDestinataire);

    UserDestinataireDTO updateUserDestinataire(Long id, UserDestinataireDTO updatedUserDestinataire);

    void deleteUserDestinataire(Long id);

    List<UserDestinataireDTO> getUserDestinatairesListByUtilisateurId(Long utilisateurId);
}
