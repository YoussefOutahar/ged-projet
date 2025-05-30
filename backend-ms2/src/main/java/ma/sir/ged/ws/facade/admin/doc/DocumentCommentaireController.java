package ma.sir.ged.ws.facade.admin.doc;

import ma.sir.ged.bean.core.doc.DocumentCommentaire;
import ma.sir.ged.service.facade.admin.doc.DocumentCommentaireService;
import ma.sir.ged.ws.converter.DocumentCommentaireConverter;
import ma.sir.ged.ws.dto.DocumentCommentaireDto;
import ma.sir.ged.ws.dto.summary.CreateCommentaireDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/document/commentaire")
public class DocumentCommentaireController {

    @Autowired
    private DocumentCommentaireService commentaireService;
    @Autowired
    private DocumentCommentaireConverter converter;


    @PostMapping
    public ResponseEntity<DocumentCommentaireDto> createCommentaire(@RequestBody CreateCommentaireDto commentaireDto) {
        DocumentCommentaire commentaire = commentaireService.create(commentaireDto);
        return new ResponseEntity<>(converter.toDto(commentaire), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentCommentaireDto> updateCommentaire(@PathVariable("id") Long id, @RequestBody DocumentCommentaireDto commentaireDto) {
        commentaireDto.setId(id);
        DocumentCommentaire commentaire = commentaireService.update(commentaireDto);
        return new ResponseEntity<>(converter.toDto(commentaire), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<DocumentCommentaireDto>> getAllCommentaires() {
        List<DocumentCommentaire> commentaires = commentaireService.getAll();
        List<DocumentCommentaireDto> commentaireDtos = converter.toDto(commentaires);
        return new ResponseEntity<>(commentaireDtos, HttpStatus.OK);
    }

    @GetMapping("/document/{id}")
    public ResponseEntity<List<DocumentCommentaireDto>> getCommentairesByDocument(@PathVariable("id") Long idDocument) {
        List<DocumentCommentaire> commentaires = commentaireService.findDocumentCommentaireByDocument(idDocument);
        List<DocumentCommentaireDto> commentaireDtos = converter.toDto(commentaires);
        return new ResponseEntity<>(commentaireDtos, HttpStatus.OK);
    }

    @DeleteMapping("/document/{id}")
    public ResponseEntity<Void> deleteCommentairesByDocument(@PathVariable("id") Long idDocument) {
        commentaireService.deleteByDocumentId(idDocument);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteCommentaires(@PathVariable("id") Long id) {
        boolean valider = commentaireService.valider(id);
        return new ResponseEntity(valider,HttpStatus.NO_CONTENT);
    }
}
