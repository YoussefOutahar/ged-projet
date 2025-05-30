package ma.sir.ged.dao.facade.core.referentieldoc;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.referentieldoc.IndexElement;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DocumentIndexElementDao extends AbstractRepository<DocumentIndexElement,Long>  {

    List<DocumentIndexElement> findByIndexElementId(Long id);
    int deleteByIndexElementId(Long id);
    long countByIndexElementId(Long id);
    List<DocumentIndexElement> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);
    @Query("SELECT di.document FROM DocumentIndexElement di WHERE di.value LIKE %:keyword%")
    List<Document> findByIndexValueContaining(@Param("keyword") String keyword);

    DocumentIndexElement findByDocumentAndIndexElement(Document document, IndexElement indexElement);
}
