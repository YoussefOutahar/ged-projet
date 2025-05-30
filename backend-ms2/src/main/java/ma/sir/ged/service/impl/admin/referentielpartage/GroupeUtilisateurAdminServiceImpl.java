package ma.sir.ged.service.impl.admin.referentielpartage;


import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.bean.history.GroupeUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.GroupeUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.GroupeUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.GroupeUtilisateurDao;
import ma.sir.ged.dao.facade.history.GroupeUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.GroupeUtilisateurSpecification;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.admin.referentielpartage.RoleUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.EtatUtilisateurAdminService;

@Service
public class GroupeUtilisateurAdminServiceImpl extends AbstractServiceImpl<GroupeUtilisateur,GroupeUtilisateurHistory, GroupeUtilisateurCriteria, GroupeUtilisateurHistoryCriteria, GroupeUtilisateurDao,
GroupeUtilisateurHistoryDao> implements GroupeUtilisateurAdminService {




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

    @Override
    public long countByEtatUtilisateurId(Long id) {
        return dao.countByEtatUtilisateurId(id);
    }

    @Override
    public long countByUtilisateurId(Long id) {
        return dao.countByUtilisateurId(id);
    }

    @Override
    public long countByRoleUtilisateurId(Long id) {
        return dao.countByRoleUtilisateurId(id);
    }


    public void configure() {
        super.configure(GroupeUtilisateur.class,GroupeUtilisateurHistory.class, GroupeUtilisateurHistoryCriteria.class, GroupeUtilisateurSpecification.class);
    }


    @Autowired
    private RoleUtilisateurAdminService roleUtilisateurService ;
    @Autowired
    private GroupeAdminService groupeService ;
    @Autowired
    private UtilisateurAdminService utilisateurService ;
    @Autowired
    private EtatUtilisateurAdminService etatUtilisateurService ;

    public GroupeUtilisateurAdminServiceImpl(GroupeUtilisateurDao dao, GroupeUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
