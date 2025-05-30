package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.bean.history.GroupeUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.GroupeUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.GroupeUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.GroupeUtilisateurDao;
import ma.sir.ged.dao.facade.history.GroupeUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.GroupeUtilisateurSpecification;
import ma.sir.ged.service.facade.collaborateur.GroupeUtilisateurCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.collaborateur.RoleUtilisateurCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.GroupeCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.UtilisateurCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.EtatUtilisateurCollaborateurService ;

@Service
public class GroupeUtilisateurCollaborateurServiceImpl extends AbstractServiceImpl<GroupeUtilisateur,GroupeUtilisateurHistory, GroupeUtilisateurCriteria, GroupeUtilisateurHistoryCriteria, GroupeUtilisateurDao,
GroupeUtilisateurHistoryDao> implements GroupeUtilisateurCollaborateurService {




    public List<GroupeUtilisateur> findByGroupeId(Long id){
        return dao.findByGroupeId(id);
    }
    public int deleteByGroupeId(Long id){
        return dao.deleteByGroupeId(id);
    }
    public List<GroupeUtilisateur> findByUtilisateurId(Long id){
        return dao.findByUtilisateurId(id);
    }
    public int deleteByUtilisateurId(Long id){
        return dao.deleteByUtilisateurId(id);
    }
    public List<GroupeUtilisateur> findByEtatUtilisateurId(Long id){
        return dao.findByEtatUtilisateurId(id);
    }
    public int deleteByEtatUtilisateurId(Long id){
        return dao.deleteByEtatUtilisateurId(id);
    }
    public List<GroupeUtilisateur> findByRoleUtilisateurId(Long id){
        return dao.findByRoleUtilisateurId(id);
    }
    public int deleteByRoleUtilisateurId(Long id){
        return dao.deleteByRoleUtilisateurId(id);
    }





    public void configure() {
        super.configure(GroupeUtilisateur.class,GroupeUtilisateurHistory.class, GroupeUtilisateurHistoryCriteria.class, GroupeUtilisateurSpecification.class);
    }


    @Autowired
    private RoleUtilisateurCollaborateurService roleUtilisateurService ;
    @Autowired
    private GroupeCollaborateurService groupeService ;
    @Autowired
    private UtilisateurCollaborateurService utilisateurService ;
    @Autowired
    private EtatUtilisateurCollaborateurService etatUtilisateurService ;

    public GroupeUtilisateurCollaborateurServiceImpl(GroupeUtilisateurDao dao, GroupeUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
