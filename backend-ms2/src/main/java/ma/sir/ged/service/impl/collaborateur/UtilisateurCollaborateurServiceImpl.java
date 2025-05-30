package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.history.UtilisateurHistory;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.dao.facade.history.UtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.UtilisateurSpecification;
import ma.sir.ged.service.facade.collaborateur.UtilisateurCollaborateurService;
import ma.sir.ged.zynerator.security.bean.Role;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.collaborateur.EntiteAdministrativeCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.GenderCollaborateurService ;

import ma.sir.ged.zynerator.security.service.facade.UserService;
import ma.sir.ged.zynerator.security.service.facade.RoleService;

@Service
public class UtilisateurCollaborateurServiceImpl extends AbstractServiceImpl<Utilisateur,UtilisateurHistory, UtilisateurCriteria, UtilisateurHistoryCriteria, UtilisateurDao,
UtilisateurHistoryDao> implements UtilisateurCollaborateurService {

    public static final String ADMIN_AUTHORITY = "ROLE_ADMIN_FUNC";

    public Utilisateur findByReferenceEntity(Utilisateur t){
        return  dao.findByEmail(t.getEmail());
    }

    public List<Utilisateur> findByGenderId(Long id){
        return dao.findByGenderId(id);
    }
    public int deleteByGenderId(Long id){
        return dao.deleteByGenderId(id);
    }
    public List<Utilisateur> findByEntiteAdministrativeId(Long id){
        return dao.findByEntiteAdministrativeId(id);
    }
    public int deleteByEntiteAdministrativeId(Long id){
        return dao.deleteByEntiteAdministrativeId(id);
    }

    @Override
    public Boolean isAdmin(User user) {
        if(Objects.isNull(user))
            return false;
        Optional<Role> optionalRole = user.getRoles().stream()
                .filter(role -> ADMIN_AUTHORITY.equals(role.getAuthority()))
                .findFirst();
        return optionalRole.isPresent();
    }




    @Override
    public Utilisateur create(Utilisateur t) {
        if (findByUsername(t.getUsername()) != null || t.getPassword() == null) return null;
        t.setPassword(userService.cryptPassword(t.getPassword()));
        t.setEnabled(true);
        t.setAccountNonExpired(true);
        t.setAccountNonLocked(true);
        t.setCredentialsNonExpired(true);
        t.setPasswordChanged(false);
        if (t.getRoles() != null) {
            Collection<Role> roles = new ArrayList<Role>();
            for (Role role : t.getRoles()) {
                roles.add(roleService.save(role));
            }
            t.setRoles(roles);
        }
        Utilisateur mySaved = super.create(t);
        return mySaved;
     }

    public Utilisateur findByUsername(String username){
    return dao.findByUsername(username);
    }

    public boolean changePassword(String username, String newPassword) {
    return userService.changePassword(username, newPassword);
    }
    public void configure() {
        super.configure(Utilisateur.class,UtilisateurHistory.class, UtilisateurHistoryCriteria.class, UtilisateurSpecification.class);
    }

    @Autowired
    private UserService userService;


    @Autowired
    private RoleService roleService;

    @Autowired
    private EntiteAdministrativeCollaborateurService entiteAdministrativeService ;
    @Autowired
    private GenderCollaborateurService genderService ;

    public UtilisateurCollaborateurServiceImpl(UtilisateurDao dao, UtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
