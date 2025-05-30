package ma.sir.ged.workflow.service.imp;

import lombok.Data;
import ma.sir.ged.workflow.DTO.CommentaireDTO;
import ma.sir.ged.workflow.entity.Commentaire;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.mapper.CommentaireDTOMapper;
import ma.sir.ged.workflow.repository.CommentaireRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Data
public class CommentaireServiceImp {

    private final CommentaireRepository commentaireRepository;
    private final CommentaireDTOMapper commentaireDTOMapper;


    public CommentaireDTO createCommentaire(CommentaireDTO commentaireDTO) {
        Commentaire commentaire = commentaireDTOMapper.mapToEntity(commentaireDTO);
        Commentaire savedCommentaire = commentaireRepository.save(commentaire);
        return commentaireDTOMapper.mapToDTO(savedCommentaire);
    }

    public CommentaireDTO getCommentaireById(Long id) {
        Commentaire commentaire = commentaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commentaire not found with id: " + id));
        return commentaireDTOMapper.mapToDTO(commentaire);
    }

    public List<CommentaireDTO> getAllCommentaires() {
        List<Commentaire> allCommentaires = commentaireRepository.findAll();
        return allCommentaires.stream()
                .map(commentaireDTOMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public CommentaireDTO updateCommentaire(Long id, CommentaireDTO updatedCommentaireDTO) {
        Commentaire existingCommentaire = commentaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commentaire not found with id: " + id));

        Commentaire updatedCommentaire = commentaireDTOMapper.mapToEntity(updatedCommentaireDTO);
        existingCommentaire.setMessage(updatedCommentaire.getMessage());
        existingCommentaire.setStep(updatedCommentaire.getStep());
        existingCommentaire.setUtilisateur(updatedCommentaire.getUtilisateur());
        Commentaire savedCommentaire = commentaireRepository.save(existingCommentaire);
        return commentaireDTOMapper.mapToDTO(savedCommentaire);
    }

    public void deleteCommentaire(Long id) {
        if (!commentaireRepository.existsById(id)) {
            throw new EntityNotFoundException("Commentaire not found with id: " + id);
        }
        commentaireRepository.deleteById(id);
    }
}
