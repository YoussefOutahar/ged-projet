package ma.sir.ged.workflow.mapper;

import lombok.Data;
import ma.sir.ged.workflow.DTO.CommentaireDTO;
import ma.sir.ged.workflow.entity.Commentaire;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Data
public class CommentaireDTOMapper {

    private final UtilisateurConverter utilisateurDTOMapper;
    private final StepRepository stepRepository;

    public CommentaireDTO mapToDTO(Commentaire commentaire) {
        CommentaireDTO commentaireDTO = new CommentaireDTO();
        commentaireDTO.setId(commentaire.getId());
        commentaireDTO.setUtilisateur(utilisateurDTOMapper.toDto(commentaire.getUtilisateur()));
        commentaireDTO.setStepId(commentaire.getStep().getId());
        commentaireDTO.setMessage(commentaire.getMessage());
        return commentaireDTO;
    }

    public Commentaire mapToEntity(CommentaireDTO commentaireDTO) {
        Commentaire commentaire = new Commentaire();
        commentaire.setUtilisateur(utilisateurDTOMapper.toItem(commentaireDTO.getUtilisateur()));
        commentaire.setStep(stepRepository.findById(commentaireDTO.getStepId()).orElseThrow(
                () -> new EntityNotFoundException("Error in CommentaireDTOMapper.  Step not found with id: " + commentaireDTO.getStepId())
        ));
        commentaire.setMessage(commentaireDTO.getMessage());
        return commentaire;
    }
    public List<CommentaireDTO> mapToDTOList(List<Commentaire> commentaires) {
        return CollectionUtils.emptyIfNull(commentaires).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}

