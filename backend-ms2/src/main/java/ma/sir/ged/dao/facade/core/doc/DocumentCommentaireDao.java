package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.DocumentCommentaire;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentCommentaireDao extends AbstractRepository<DocumentCommentaire,Long> {
    List<DocumentCommentaire> findDocumentCommentaireByDocumentId(Long id);
    int deleteByDocumentId(Long id);
}
