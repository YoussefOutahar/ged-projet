package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.doc.DocumentCommentaire;
import ma.sir.ged.ws.dto.DocumentCommentaireDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentCommentaireConverter {
    public DocumentCommentaire toItem(DocumentCommentaireDto dto) {
        DocumentCommentaire commentaire = new DocumentCommentaire();
        BeanUtils.copyProperties(dto, commentaire);
        return commentaire;
    }
    public List<DocumentCommentaireDto> toDto(List<DocumentCommentaire> commentaires) {
        return commentaires.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public DocumentCommentaireDto toDto(DocumentCommentaire commentaire) {
        DocumentCommentaireDto dto = new DocumentCommentaireDto();
        dto.setId(commentaire.getId());
        dto.setContenu(commentaire.getContenu());
        dto.setDocumentId(commentaire.getDocument().getId());
        dto.setValide(commentaire.getValide());
        return dto;
    }
}
