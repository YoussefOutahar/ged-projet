package ma.sir.ged.workflow.service.sev;

import ma.sir.ged.workflow.DTO.CommentaireDTO;
import org.springframework.stereotype.Component;

import java.util.List;

public interface CommentaireService {
    CommentaireDTO createCommentaire(CommentaireDTO commentaireDTO);

    CommentaireDTO getCommentaireById(Long id);

    List<CommentaireDTO> getAllCommentaires();

    CommentaireDTO updateCommentaire(Long id, CommentaireDTO updatedCommentaireDTO);

    void deleteCommentaire(Long id);
}
