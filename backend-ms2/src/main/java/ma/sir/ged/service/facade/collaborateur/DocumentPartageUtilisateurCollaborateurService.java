package ma.sir.ged.service.facade.collaborateur;

import java.util.List;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.dao.criteria.core.DocumentPartageUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageUtilisateurHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;


public interface DocumentPartageUtilisateurCollaborateurService extends  IService<DocumentPartageUtilisateur,DocumentPartageUtilisateurCriteria, DocumentPartageUtilisateurHistoryCriteria>  {

    List<DocumentPartageUtilisateur> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);
    List<DocumentPartageUtilisateur> findByUtilisateurId(Long id);
    int deleteByUtilisateurId(Long id);
    List<DocumentPartageUtilisateur> findByAccessShareId(Long id);
    int deleteByAccessShareId(Long id);



}
