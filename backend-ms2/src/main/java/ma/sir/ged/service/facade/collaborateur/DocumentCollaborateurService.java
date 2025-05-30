package ma.sir.ged.service.facade.collaborateur;

import java.util.List;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;


public interface DocumentCollaborateurService extends  IService<Document,DocumentCriteria, DocumentHistoryCriteria>  {

    List<Document> findByDocumentTypeId(Long id);
    int deleteByDocumentTypeId(Long id);
    List<Document> findByDocumentStateId(Long id);
    int deleteByDocumentStateId(Long id);
    List<Document> findByDocumentCategorieId(Long id);
    int deleteByDocumentCategorieId(Long id);
    List<Document> findByUtilisateurId(Long id);
    int deleteByUtilisateurId(Long id);
    List<Document> findByEntiteAdministrativeId(Long id);
    int deleteByEntiteAdministrativeId(Long id);
    List<Document> findByDocumentCategorieModelId(Long id);
    int deleteByDocumentCategorieModelId(Long id);



}
