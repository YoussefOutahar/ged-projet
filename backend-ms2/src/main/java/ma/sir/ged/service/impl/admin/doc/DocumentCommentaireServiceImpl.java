package ma.sir.ged.service.impl.admin.doc;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.doc.DocumentCommentaire;
import ma.sir.ged.dao.facade.core.doc.DocumentCommentaireDao;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentCommentaireService;
import ma.sir.ged.ws.dto.DocumentCommentaireDto;
import ma.sir.ged.ws.dto.summary.CreateCommentaireDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class DocumentCommentaireServiceImpl implements DocumentCommentaireService {
    @Autowired
    private DocumentCommentaireDao dao;
    @Autowired
    private DocumentAdminService documentAdminService;
    @Override
    public DocumentCommentaire create(CreateCommentaireDto dto) {
        DocumentCommentaire commentaire = new DocumentCommentaire();
        commentaire.setContenu(dto.getContenu());
        Document document = documentAdminService.findById(dto.getDocumentId());
        if (document == null) {
            throw new IllegalArgumentException("Document not found with id: " + dto.getDocumentId());
        }
        commentaire.setDocument(document);

        return dao.save(commentaire);
    }

    @Override
    public DocumentCommentaire update(DocumentCommentaireDto dto) {
        DocumentCommentaire commentaire = dao.findById(dto.getId()).orElse(null);
        if (commentaire == null) {
            throw new IllegalArgumentException("Commentaire not found with id: " + dto.getId());
        }
        commentaire.setContenu(dto.getContenu());

        return dao.save(commentaire);
    }

    @Override
    public List<DocumentCommentaire> getAll() {
        return dao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentCommentaire> findDocumentCommentaireByDocument(Long idDocument) {
        return dao.findDocumentCommentaireByDocumentId(idDocument);
    }

    @Override
    @Transactional
    public int deleteByDocumentId(Long id) {
        return dao.deleteByDocumentId(id);
    }

    @Override
    public boolean delete(Long id) {
        return dao.findById(id).map(commentaire -> {
            dao.delete(commentaire);
            return true;
        }).orElseThrow(() -> new IllegalArgumentException("Commentaire not found with id: " + id));
    }

    @Override
    public Boolean valider(Long id) {
        DocumentCommentaire documentCommentaire = dao.findById(id).orElse(null);
        if (documentCommentaire != null) {
            documentCommentaire.setValide(true);
            dao.save(documentCommentaire);
            return true;
        }
        return false;
    }
}
