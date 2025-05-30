package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.history.EntiteAdministrativeHistory;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.dao.facade.history.EntiteAdministrativeHistoryDao;
import ma.sir.ged.dao.specification.core.EntiteAdministrativeSpecification;
import ma.sir.ged.service.facade.collaborateur.EntiteAdministrativeCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import ma.sir.ged.bean.core.organigramme.Utilisateur;

import ma.sir.ged.service.facade.collaborateur.UtilisateurCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.EntiteAdministrativeTypeCollaborateurService ;

@Service
public class EntiteAdministrativeCollaborateurServiceImpl extends AbstractServiceImpl<EntiteAdministrative,EntiteAdministrativeHistory, EntiteAdministrativeCriteria, EntiteAdministrativeHistoryCriteria, EntiteAdministrativeDao,
EntiteAdministrativeHistoryDao> implements EntiteAdministrativeCollaborateurService {


    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class, readOnly = false)
    public EntiteAdministrative create(EntiteAdministrative t) {
        super.create(t);
        if (t.getUtilisateurs() != null) {
                t.getUtilisateurs().forEach(element-> {
                    element.setEntiteAdministrative(t);
                    utilisateurService.create(element);
            });
        }
        return t;
    }

    public EntiteAdministrative findWithAssociatedLists(Long id){
        EntiteAdministrative result = dao.findById(id).orElse(null);
        if(result!=null && result.getId() != null) {
            result.setUtilisateurs(utilisateurService.findByEntiteAdministrativeId(id));
        }
        return result;
    }
    @Transactional
    public void deleteAssociatedLists(Long id) {
        utilisateurService.deleteByEntiteAdministrativeId(id);
    }


    public void updateWithAssociatedLists(EntiteAdministrative entiteAdministrative){
    if(entiteAdministrative !=null && entiteAdministrative.getId() != null){
            List<List<Utilisateur>> resultUtilisateurs= utilisateurService.getToBeSavedAndToBeDeleted(utilisateurService.findByEntiteAdministrativeId(entiteAdministrative.getId()),entiteAdministrative.getUtilisateurs());
            utilisateurService.delete(resultUtilisateurs.get(1));
            ListUtil.emptyIfNull(resultUtilisateurs.get(0)).forEach(e -> e.setEntiteAdministrative(entiteAdministrative));
            utilisateurService.update(resultUtilisateurs.get(0),true);
    }
    }

    public EntiteAdministrative findByReferenceEntity(EntiteAdministrative t){
        return  dao.findByCode(t.getCode());
    }

    public List<EntiteAdministrative> findByEntiteAdministrativeParentId(Long id){
        return dao.findByEntiteAdministrativeParentId(id);
    }
    public int deleteByEntiteAdministrativeParentId(Long id){
        return dao.deleteByEntiteAdministrativeParentId(id);
    }
    public List<EntiteAdministrative> findByChefId(Long id){
        return dao.findByChefId(id);
    }
    public int deleteByChefId(Long id){
        return dao.deleteByChefId(id);
    }
    public List<EntiteAdministrative> findByEntiteAdministrativeTypeId(Long id){
        return dao.findByEntiteAdministrativeTypeId(id);
    }
    public int deleteByEntiteAdministrativeTypeId(Long id){
        return dao.deleteByEntiteAdministrativeTypeId(id);
    }





    public void configure() {
        super.configure(EntiteAdministrative.class,EntiteAdministrativeHistory.class, EntiteAdministrativeHistoryCriteria.class, EntiteAdministrativeSpecification.class);
    }


    @Autowired
    private UtilisateurCollaborateurService utilisateurService ;
    @Autowired
    private EntiteAdministrativeTypeCollaborateurService entiteAdministrativeTypeService ;

    public EntiteAdministrativeCollaborateurServiceImpl(EntiteAdministrativeDao dao, EntiteAdministrativeHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
