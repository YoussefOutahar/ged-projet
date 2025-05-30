package ma.sir.ged.service.facade.collaborateur;

import java.util.List;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.dao.criteria.core.DocumentPartageGroupeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageGroupeHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;


public interface DocumentPartageGroupeCollaborateurService extends  IService<DocumentPartageGroupe,DocumentPartageGroupeCriteria, DocumentPartageGroupeHistoryCriteria>  {

    List<DocumentPartageGroupe> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);
    List<DocumentPartageGroupe> findByGroupeId(Long id);
    int deleteByGroupeId(Long id);
    List<DocumentPartageGroupe> findByAccessShareId(Long id);
    int deleteByAccessShareId(Long id);



}
