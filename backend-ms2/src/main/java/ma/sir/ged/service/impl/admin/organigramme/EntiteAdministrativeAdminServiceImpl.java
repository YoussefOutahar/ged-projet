package ma.sir.ged.service.impl.admin.organigramme;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;
import ma.sir.ged.bean.core.referentielpartage.Groupe;
import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.bean.core.referentielpartage.RoleUtilisateur;
import ma.sir.ged.bean.history.EntiteAdministrativeHistory;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.dao.facade.history.EntiteAdministrativeHistoryDao;
import ma.sir.ged.dao.specification.core.EntiteAdministrativeSpecification;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeTypeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.GraphBuilder;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.EtatUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.RoleUtilisateurAdminService;
import ma.sir.ged.ws.dto.OrganigramElement;
import ma.sir.ged.zynerator.exception.BusinessRuleException;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class EntiteAdministrativeAdminServiceImpl extends AbstractServiceImpl<EntiteAdministrative, EntiteAdministrativeHistory, EntiteAdministrativeCriteria, EntiteAdministrativeHistoryCriteria, EntiteAdministrativeDao,
        EntiteAdministrativeHistoryDao> implements EntiteAdministrativeAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return docmentService.countByEntiteAdministrativeId(id) == 0 && utilisateurService.countByEntiteAdministrativeId(id) == 0;
    }

    private Boolean verifyThatParentRangShouldBeHeigherThanTheChild(EntiteAdministrative t){
        int rang = 0;
        int parentRang = 0;
        if(Objects.nonNull(t.getEntiteAdministrativeType().getRang())){
            rang = t.getEntiteAdministrativeType().getRang();
        }
        if (Objects.nonNull(t.getEntiteAdministrativeParent().getEntiteAdministrativeType().getRang())) {
            parentRang = t.getEntiteAdministrativeParent().getEntiteAdministrativeType().getRang();
        }
        return parentRang > rang;
    }

    @Override
    public EntiteAdministrative update(EntiteAdministrative entiteAdministrative) {
        if(verifyThatParentRangShouldBeHeigherThanTheChild(entiteAdministrative))
            return super.update(entiteAdministrative);
        return null;
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class, readOnly = false)
    public EntiteAdministrative create(EntiteAdministrative t) {
        Groupe groupe = constructGroup(t);
        if (Boolean.TRUE.equals(verifyThatParentRangShouldBeHeigherThanTheChild(t))) {
            EntiteAdministrative entiteAdministrative = super.create(t);
            if (entiteAdministrative != null) {
                groupeService.createCrud(groupe);
                if (t.getChef() != null) {
                    t.getChef().setEntiteAdministrative(t);
                    GroupeUtilisateur groupeUtilisateur = new GroupeUtilisateur();
                    RoleUtilisateur roleUtilisateur = roleUtilisateurService.findOrSave(new RoleUtilisateur("admin"));
                    EtatUtilisateur etatUtilisateur = etatUtilisateurService.findOrSave(new EtatUtilisateur("actif"));

                    groupeUtilisateur.setUtilisateur(t.getChef());
                    groupeUtilisateur.setEtatUtilisateur(etatUtilisateur);
                    utilisateurService.create(t.getChef());
                    groupeUtilisateur.setGroupe(groupe);
                    groupeUtilisateur.setDateAjout(LocalDateTime.now());
                    groupeUtilisateur.setRoleUtilisateur(roleUtilisateur);
                    groupeUtilisateurService.create(groupeUtilisateur);
                }

                return t;
            }
        }else {
            throw new BusinessRuleException("dismatching between the entity type rang and its parent");
        }
        return null;

    }

    private Groupe constructGroup(EntiteAdministrative t) {
        Groupe groupe = new Groupe();
        groupe.setCode(t.getCode());
        groupe.setLibelle(t.getLibelle());
        groupe.setUtilisateur(t.getChef());
        return groupe;
    }


    public EntiteAdministrative findWithAssociatedLists(Long id) {
        EntiteAdministrative result = dao.findById(id).orElse(null);
        if (result != null && result.getId() != null) {
            result.setUtilisateurs(utilisateurService.findByEntiteAdministrativeId(id));
        }
        return result;
    }

    @Transactional
    public void deleteAssociatedLists(Long id) {
        utilisateurService.deleteByEntiteAdministrativeId(id);
    }


    public boolean deleteById(Long id) {
        List<Utilisateur> utilisateurs = utilisateurService.findByEntiteAdministrativeId(id);
        List<EntiteAdministrative> etiteAdministrativeParentId = dao.findByEntiteAdministrativeParentId(id);
        boolean result = false;
        if (ListUtil.isEmpty(utilisateurs) && ListUtil.isEmpty(etiteAdministrativeParentId)) {
            dao.deleteById(id);
            result = true;
        }
        return result;

    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class, readOnly = false)
    public List<EntiteAdministrative> delete(List<EntiteAdministrative> list) {
        List<EntiteAdministrative> res = new ArrayList<>();
        if (list != null) {
            for (EntiteAdministrative entiteAdministrative : list) {
                Long id = entiteAdministrative.getId();
                List<Utilisateur> utilisateurs = utilisateurService.findByEntiteAdministrativeId(id);
                List<EntiteAdministrative> etiteAdministrativeParentId = dao.findByEntiteAdministrativeParentId(id);
                if (ListUtil.isEmpty(utilisateurs) && ListUtil.isEmpty(etiteAdministrativeParentId)) {
                    dao.deleteById(id);
                    res.add(entiteAdministrative);
                }
            }
        }
        return res;
    }

    public void updateWithAssociatedLists(EntiteAdministrative entiteAdministrative) {
        if (entiteAdministrative != null && entiteAdministrative.getId() != null) {
            List<List<Utilisateur>> resultUtilisateurs = utilisateurService.getToBeSavedAndToBeDeleted(utilisateurService.findByEntiteAdministrativeId(entiteAdministrative.getId()), entiteAdministrative.getUtilisateurs());
            utilisateurService.delete(resultUtilisateurs.get(1));
            ListUtil.emptyIfNull(resultUtilisateurs.get(0)).forEach(e -> e.setEntiteAdministrative(entiteAdministrative));
            utilisateurService.update(resultUtilisateurs.get(0), true);
        }
    }


    public EntiteAdministrative findByReferenceEntity(EntiteAdministrative t) {
        EntiteAdministrative byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            EntiteAdministrative byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }

    public List<EntiteAdministrative> findByEntiteAdministrativeParentId(Long id) {
        return dao.findByEntiteAdministrativeParentId(id);
    }

    public int deleteByEntiteAdministrativeParentId(Long id) {
        return dao.deleteByEntiteAdministrativeParentId(id);
    }

    public List<EntiteAdministrative> findByChefId(Long id) {
        return dao.findByChefId(id);
    }

    public int deleteByChefId(Long id) {
        return dao.deleteByChefId(id);
    }

    @Override
    public long countByChefId(long id) {
        return dao.countByChefId(id);
    }

    public List<EntiteAdministrative> findByEntiteAdministrativeTypeId(Long id) {
        return dao.findByEntiteAdministrativeTypeId(id);
    }

    public int deleteByEntiteAdministrativeTypeId(Long id) {
        return dao.deleteByEntiteAdministrativeTypeId(id);
    }

    @Override
    public long countByEntiteAdministrativeTypeId(Long id) {
        return dao.countByEntiteAdministrativeTypeId(id);
    }

    @Override
    public void importFromJson(MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        Reader reader = new InputStreamReader(file.getInputStream());
        OrganigramElement organigramElement = objectMapper.readValue(reader, OrganigramElement.class);
        EntiteAdministrative entiteAdministrative = convertToEntiteAdministrativeAndSave(organigramElement);

        System.out.println(entiteAdministrative);
        // create(entiteAdministrative);
    }

    @Override
    public String exportToJson(OrganigramElement organigramElement) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        System.out.println(organigramElement);

        String json = objectMapper.writeValueAsString(organigramElement);
        System.out.println(json);
        return json;
    }

    private EntiteAdministrative convertToEntiteAdministrativeAndSave(OrganigramElement organigramElement) {
        if (organigramElement == null) {
            return null;
        }

        EntiteAdministrative entiteAdministrative = dao.findByCode(organigramElement.getCode());

        if (entiteAdministrative == null) {
            entiteAdministrative = new EntiteAdministrative();
            entiteAdministrative.setId(null);
            entiteAdministrative.setCode(organigramElement.getCode());
            entiteAdministrative.setReferenceGed(organigramElement.getReferenceGed());
            entiteAdministrative.setDescription(organigramElement.getDescription());
            entiteAdministrative.setLibelle(organigramElement.getLibelle());
            entiteAdministrative.setArchiveLawDuration(organigramElement.getArchiveLawDuration());

            if (organigramElement.getEntityAdminTypeInfo() != null) {
                entiteAdministrative.setEntiteAdministrativeType(entiteAdministrativeTypeService.findById(organigramElement.getEntityAdminTypeInfo().getId()));
            } else {
                entiteAdministrative.setEntiteAdministrativeType(null);
            }

            if (organigramElement.getUtilisateurInfo() != null) {
                entiteAdministrative.setChef(utilisateurService.findById(organigramElement.getUtilisateurInfo().getId()));
            } else {
                entiteAdministrative.setChef(null);
            }

            dao.save(entiteAdministrative);
        }

        if (organigramElement.getChildren() != null) {
            for (OrganigramElement child : organigramElement.getChildren()) {
                EntiteAdministrative childEntiteAdministrative = convertToEntiteAdministrativeAndSave(child);
                childEntiteAdministrative.setEntiteAdministrativeParent(entiteAdministrative);
                dao.save(childEntiteAdministrative); // Save the child after setting the parent
            }
            dao.save(entiteAdministrative); // Save the parent after setting the children
        }

        return entiteAdministrative;
    }

    public void configure() {
        super.configure(EntiteAdministrative.class, EntiteAdministrativeHistory.class, EntiteAdministrativeHistoryCriteria.class, EntiteAdministrativeSpecification.class);
    }


    @Autowired
    private EtatUtilisateurAdminService etatUtilisateurService;
    @Autowired
    private GroupeAdminService groupeService;
    @Autowired
    private GroupeUtilisateurAdminService groupeUtilisateurService;
    @Autowired
    private RoleUtilisateurAdminService roleUtilisateurService;
    @Autowired
    private UtilisateurAdminService utilisateurService;
    @Autowired
    private EntiteAdministrativeTypeAdminService entiteAdministrativeTypeService;
    @Autowired
    private DocumentAdminService docmentService;

    @Autowired
    private GraphBuilder graphBuilder;

    public EntiteAdministrativeAdminServiceImpl(EntiteAdministrativeDao dao, EntiteAdministrativeHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
