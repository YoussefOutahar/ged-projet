package ma.sir.ged.workflow.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.workflow.DTO.CommentaireDTO;
import ma.sir.ged.workflow.service.imp.CommentaireServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows/commentaires")
@RequiredArgsConstructor
public class CommentaireController {

    private final CommentaireServiceImp commentaireService;



    @PostMapping
    public ResponseEntity<CommentaireDTO> createCommentaire(@RequestBody CommentaireDTO commentaireDTO) {
        CommentaireDTO createdCommentaire = commentaireService.createCommentaire(commentaireDTO);
        return new ResponseEntity<>(createdCommentaire, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentaireDTO> getCommentaireById(@PathVariable Long id) {
        CommentaireDTO commentaireDTO = commentaireService.getCommentaireById(id);
        return new ResponseEntity<>(commentaireDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CommentaireDTO>> getAllCommentaires() {
        List<CommentaireDTO> allCommentaires = commentaireService.getAllCommentaires();
        return new ResponseEntity<>(allCommentaires, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentaireDTO> updateCommentaire(@PathVariable Long id, @RequestBody CommentaireDTO updatedCommentaireDTO) {
        CommentaireDTO updatedCommentaire = commentaireService.updateCommentaire(id, updatedCommentaireDTO);
        return new ResponseEntity<>(updatedCommentaire, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.deleteCommentaire(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

