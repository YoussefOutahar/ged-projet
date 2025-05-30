package ma.sir.ged.service.facade.admin.doc;

import ma.sir.ged.bean.core.doc.DocumentCommentaire;
import ma.sir.ged.ws.dto.DocumentCommentaireDto;
import ma.sir.ged.ws.dto.summary.CreateCommentaireDto;

import java.util.List;

public interface DocumentCommentaireService {
    DocumentCommentaire create(CreateCommentaireDto dto);
    DocumentCommentaire update(DocumentCommentaireDto dto);
    List<DocumentCommentaire> getAll();
    List<DocumentCommentaire> findDocumentCommentaireByDocument(Long idDocument);
    int deleteByDocumentId(Long id);
    boolean delete (Long id);
    Boolean valider (Long id);
}
