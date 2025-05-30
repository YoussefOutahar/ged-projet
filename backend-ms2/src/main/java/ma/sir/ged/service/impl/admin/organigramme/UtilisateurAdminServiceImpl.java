package ma.sir.ged.service.impl.admin.organigramme;


import ma.sir.ged.Signature.DigitalSignature.service.SigningService;
import ma.sir.ged.Signature.SignatureService;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.ProfilePicture;
import ma.sir.ged.bean.core.organigramme.Signature;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;
import ma.sir.ged.bean.core.referentielpartage.Groupe;
import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.bean.core.referentielpartage.RoleUtilisateur;
import ma.sir.ged.bean.history.UtilisateurHistory;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.ProfilePictureDao;
import ma.sir.ged.dao.facade.core.organigramme.SignatureDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.dao.facade.history.UtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.UtilisateurSpecification;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.GenderAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.EtatUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.RoleUtilisateurAdminService;
import ma.sir.ged.zynerator.security.bean.Role;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.service.facade.RoleService;
import ma.sir.ged.zynerator.security.service.facade.UserService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UtilisateurAdminServiceImpl extends AbstractServiceImpl<Utilisateur, UtilisateurHistory, UtilisateurCriteria, UtilisateurHistoryCriteria, UtilisateurDao,
        UtilisateurHistoryDao> implements UtilisateurAdminService {


    public static final String ADMIN_AUTHORITY = "ROLE_ADMIN_FUNC";
    public static final String CHEF_PROJET_AUTHORITY = "ROLE_CHEF_PROJET";
    public static final String AGENT_AUTHORITY = "ROLE_AGENT_SCAN";

    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return groupeUtilisateurService.countByUtilisateurId(id) == 0 && documentService.countByUtilisateurId(id) == 0
                && entiteAdministrativeService.countByChefId(id) == 0 && groupeService.countByUtilisateurId(id) == 0
                && groupeService.countByUtilisateurId(id) == 0;
    }


    public Utilisateur findByReferenceEntity(Utilisateur t) {
        return dao.findByUsername(t.getUsername());
    }

    public List<Utilisateur> findByGenderId(Long id) {
        return dao.findByGenderId(id);
    }

    @Override
    public long countByGenderId(Long id) {
        return dao.countByGenderId(id);
    }

    public int deleteByGenderId(Long id) {
        return dao.deleteByGenderId(id);
    }

    public List<Utilisateur> findByEntiteAdministrativeId(Long id) {
        return dao.findByEntiteAdministrativeId(id);
    }

    public int deleteByEntiteAdministrativeId(Long id) {
        return dao.deleteByEntiteAdministrativeId(id);
    }

    @Override
    public int countByEntiteAdministrativeId(Long id) {
        return dao.countByEntiteAdministrativeId(id);
    }

    @Override
    public Boolean isAdmin(User user) {
        if(Objects.isNull(user))
            return false;
        Optional<Role> optionalRole = user.getRoles().stream()
                .filter(role -> ADMIN_AUTHORITY.equals(role.getAuthority()))
                .findFirst();
        Optional<Role> chefProjetRole = user.getRoles().stream()
                .filter(role -> CHEF_PROJET_AUTHORITY.equals(role.getAuthority()))
                .findFirst();
        return optionalRole.isPresent() || chefProjetRole.isPresent();
    }

    @Override
    public Boolean isAgent(User user) {
        if(Objects.isNull(user))
            return false;
        Optional<Role> optionalRole = user.getRoles().stream()
                .filter(role -> AGENT_AUTHORITY.equals(role.getAuthority()))
                .findFirst();
        return optionalRole.isPresent();
    }


    @Override
    public Utilisateur update(Utilisateur t) {
        Utilisateur loadedUtilisateur = findById(t.getId());
        t.setPassword(loadedUtilisateur.getPassword());
        return super.update(t);
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
        if (mySaved.getEntiteAdministrative() != null && mySaved.getEntiteAdministrative().getId() != null) {
            Long id = mySaved.getEntiteAdministrative().getId();
            EntiteAdministrative entiteAdministrative = entiteAdministrativeService.findById(id);
            if (entiteAdministrative != null) {
                Groupe groupe = groupeService.findByCode(entiteAdministrative.getCode());
                GroupeUtilisateur groupeUtilisateur = new GroupeUtilisateur();
                RoleUtilisateur roleUtilisateur = roleUtilisateurService.findOrSave(new RoleUtilisateur("membre"));
                EtatUtilisateur etatUtilisateur = etatUtilisateurService.findOrSave(new EtatUtilisateur("actif"));
                groupeUtilisateur.setEtatUtilisateur(etatUtilisateur);
                groupeUtilisateur.setRoleUtilisateur(roleUtilisateur);
                groupeUtilisateur.setUtilisateur(mySaved);
                groupeUtilisateur.setGroupe(groupe);
                groupeUtilisateur.setDateAjout(LocalDateTime.now());
                groupeUtilisateurService.create(groupeUtilisateur);
            }

        }
        return mySaved;
    }

    @Override
    public Utilisateur findByUsername(String username) {
        return dao.findByUsername(username);
    }

    public boolean changePassword(String username, String newPassword) {
        return userService.changePassword(username, newPassword);
    }

    public void configure() {
        super.configure(Utilisateur.class, UtilisateurHistory.class, UtilisateurHistoryCriteria.class, UtilisateurSpecification.class);
    }

    @Transactional
    public void updateProfilePicture(Long userId, MultipartFile file) throws IOException, SQLException {
        Utilisateur user = findById(userId);
        if (user != null && user.getProfilePicture() != null) {
            ProfilePicture profilePicture = user.getProfilePicture();
            profilePicture.setImage(new SerialBlob(file.getBytes()));
            user.setProfilePicture(profilePicture);
            profilePictureDao.save(profilePicture);
            dao.save(user);
        }
        if (user != null) {
            ProfilePicture profilePicture = new ProfilePicture();
            profilePicture.setImage(new SerialBlob(file.getBytes()));
            profilePicture.setUtilisateur(user);
            user.setProfilePicture(profilePicture);
            profilePictureDao.save(profilePicture);
            dao.save(user);
        }
    }

    @Transactional
    public void deleteProfilePicture(Long userId) {
        Utilisateur user = findById(userId);
        if (user != null && user.getProfilePicture() != null) {
            profilePictureDao.delete(user.getProfilePicture());
            user.setProfilePicture(null);
            dao.save(user);
        }
    }

    @Transactional
    public void updateSignature(Long userId, String svgData) {
        Utilisateur user = findById(userId);
        boolean isRemoteSignatureActive = featureFlagService.isActive("useRemoteSignature");

        if(user != null){
            Signature signature = user.getSignature();
            if (signature == null) {
                signature = new Signature();
                signature.setSignature(svgData);
                signature.setUtilisateur(user);
            } else {
                signature.setSignature(svgData);
            }
            user.setSignature(signature);

            if (!isRemoteSignatureActive) {
                try {
                    signatureService.generateCertificate(user.getUsername(), user.getPassword());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

            signatureDao.save(signature);
            dao.save(user);
        }
    }

    @Transactional
    public void deleteSignature(Long userId) {
        Utilisateur user = findById(userId);
        if (user != null && user.getSignature() != null) {
            signatureDao.delete(user.getSignature());
            user.setSignature(null);
            dao.save(user);
        }
    }

    @Override
    public int countNumberOfUsers() {
        return dao.countAllUsers();
    }


    @Autowired
    private EtatUtilisateurAdminService etatUtilisateurService;
    @Autowired
    private RoleUtilisateurAdminService roleUtilisateurService;
    @Autowired
    private GroupeAdminService groupeService;
    @Autowired
    private GroupeUtilisateurAdminService groupeUtilisateurService;

    @Autowired
    private UserService userService;

    @Autowired
    private SignatureService signatureService;

    @Autowired
    private RoleService roleService;
    @Autowired
    private DocumentAdminService documentService;

    @Autowired
    private EntiteAdministrativeAdminService entiteAdministrativeService;
    @Autowired
    private GenderAdminService genderService;

    @Autowired
    private ProfilePictureDao profilePictureDao;

    @Autowired
    private SignatureDao signatureDao;

    @Autowired
    private FeatureFlagService featureFlagService;

    public UtilisateurAdminServiceImpl(UtilisateurDao dao, UtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
