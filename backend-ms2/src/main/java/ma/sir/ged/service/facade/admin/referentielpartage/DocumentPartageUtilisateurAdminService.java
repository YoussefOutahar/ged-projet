package ma.sir.ged.service.facade.admin.referentielpartage;

import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.dao.criteria.core.DocumentPartageUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageUtilisateurHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;


public interface DocumentPartageUtilisateurAdminService extends IService<DocumentPartageUtilisateur, DocumentPartageUtilisateurCriteria, DocumentPartageUtilisateurHistoryCriteria> {

    List<DocumentPartageUtilisateur> findByDocumentId(Long id);

    int deleteByDocumentId(Long id);

    List<DocumentPartageUtilisateur> findByUtilisateurId(Long id);

    int deleteByUtilisateurId(Long id);

    List<DocumentPartageUtilisateur> findByAccessShareId(Long id);

    int deleteByAccessShareId(Long id);

    long countByAccessShareId(Long id);

    long countByUtilisateurId(Long id);

}
