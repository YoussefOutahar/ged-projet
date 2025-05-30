package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.history.DocumentHistory;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.history.DocumentHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentSpecification;
import ma.sir.ged.service.facade.collaborateur.DocumentCollaborateurService;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import ma.sir.ged.zynerator.util.ListUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.bean.core.referentieldoc.DocumentTag;

import ma.sir.ged.service.facade.collaborateur.DocumentTypeCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentPartageUtilisateurCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.EntiteAdministrativeCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentTagCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentPartageGroupeCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.UtilisateurCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentIndexElementCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentStateCollaborateurService ;

@Service
public class DocumentCollaborateurServiceImpl extends AbstractServiceImpl<Document,DocumentHistory, DocumentCriteria, DocumentHistoryCriteria, DocumentDao,
DocumentHistoryDao> implements DocumentCollaborateurService {


    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class, readOnly = false)
    public Document create(Document t) {
        super.create(t);
        if (t.getDocumentIndexElements() != null) {
                t.getDocumentIndexElements().forEach(element-> {
                    element.setDocument(t);
                    documentIndexElementService.create(element);
            });
        }
        if (t.getDocumentPartageGroupes() != null) {
                t.getDocumentPartageGroupes().forEach(element-> {
                    element.setDocument(t);
                    documentPartageGroupeService.create(element);
            });
        }
        if (t.getDocumentPartageUtilisateurs() != null) {
                t.getDocumentPartageUtilisateurs().forEach(element-> {
                    element.setDocument(t);
                    documentPartageUtilisateurService.create(element);
            });
        }
        if (t.getDocumentTags() != null) {
                t.getDocumentTags().forEach(element-> {
                    element.setDocument(t);
                    documentTagService.create(element);
            });
        }
        return t;
    }

    public Document findWithAssociatedLists(Long id){
        Document result = dao.findById(id).orElse(null);
        if(result!=null && result.getId() != null) {
            result.setDocumentIndexElements(documentIndexElementService.findByDocumentId(id));
            result.setDocumentPartageGroupes(documentPartageGroupeService.findByDocumentId(id));
            result.setDocumentPartageUtilisateurs(documentPartageUtilisateurService.findByDocumentId(id));
            result.setDocumentTags(documentTagService.findByDocumentId(id));
        }
        return Stream.of(result).filter(this::userCanSee).findFirst().orElse(null);
    }
    @Transactional
    public void deleteAssociatedLists(Long id) {
        documentIndexElementService.deleteByDocumentId(id);
        documentPartageGroupeService.deleteByDocumentId(id);
        documentPartageUtilisateurService.deleteByDocumentId(id);
        documentTagService.deleteByDocumentId(id);
    }


    public void updateWithAssociatedLists(Document document){
    if(document !=null && document.getId() != null){
            List<List<DocumentIndexElement>> resultDocumentIndexElements= documentIndexElementService.getToBeSavedAndToBeDeleted(documentIndexElementService.findByDocumentId(document.getId()),document.getDocumentIndexElements());
            documentIndexElementService.delete(resultDocumentIndexElements.get(1));
            ListUtil.emptyIfNull(resultDocumentIndexElements.get(0)).forEach(e -> e.setDocument(document));
            documentIndexElementService.update(resultDocumentIndexElements.get(0),true);
            List<List<DocumentPartageGroupe>> resultDocumentPartageGroupes= documentPartageGroupeService.getToBeSavedAndToBeDeleted(documentPartageGroupeService.findByDocumentId(document.getId()),document.getDocumentPartageGroupes());
            documentPartageGroupeService.delete(resultDocumentPartageGroupes.get(1));
            ListUtil.emptyIfNull(resultDocumentPartageGroupes.get(0)).forEach(e -> e.setDocument(document));
            documentPartageGroupeService.update(resultDocumentPartageGroupes.get(0),true);
            List<List<DocumentPartageUtilisateur>> resultDocumentPartageUtilisateurs= documentPartageUtilisateurService.getToBeSavedAndToBeDeleted(documentPartageUtilisateurService.findByDocumentId(document.getId()),document.getDocumentPartageUtilisateurs());
            documentPartageUtilisateurService.delete(resultDocumentPartageUtilisateurs.get(1));
            ListUtil.emptyIfNull(resultDocumentPartageUtilisateurs.get(0)).forEach(e -> e.setDocument(document));
            documentPartageUtilisateurService.update(resultDocumentPartageUtilisateurs.get(0),true);
            List<List<DocumentTag>> resultDocumentTags= documentTagService.getToBeSavedAndToBeDeleted(documentTagService.findByDocumentId(document.getId()),document.getDocumentTags());
            documentTagService.delete(resultDocumentTags.get(1));
            ListUtil.emptyIfNull(resultDocumentTags.get(0)).forEach(e -> e.setDocument(document));
            documentTagService.update(resultDocumentTags.get(0),true);
    }
    }

    public Document findByReferenceEntity(Document t){
        return Stream.of(dao.findByReferenceAndDeletedIsFalse(t.getReference())).filter(this::userCanSee).findFirst().orElse(null);
    }

    public List<Document> findByDocumentTypeId(Long id){
        return dao.findByDocumentTypeIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentTypeId(Long id){
        return dao.deleteByDocumentTypeId(id);
    }
    public List<Document> findByDocumentStateId(Long id){
        return dao.findByDocumentStateIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentStateId(Long id){
        return dao.deleteByDocumentStateId(id);
    }
    public List<Document> findByDocumentCategorieId(Long id){
        return dao.findByDocumentCategorieIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentCategorieId(Long id){
        return dao.deleteByDocumentCategorieId(id);
    }
    public List<Document> findByUtilisateurId(Long id){
        return dao.findByUtilisateurIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByUtilisateurId(Long id){
        return dao.deleteByUtilisateurId(id);
    }
    public List<Document> findByEntiteAdministrativeId(Long id){
        return dao.findByEntiteAdministrativeIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByEntiteAdministrativeId(Long id){
        return dao.deleteByEntiteAdministrativeId(id);
    }
    public List<Document> findByDocumentCategorieModelId(Long id){
        return dao.findByDocumentCategorieModelIdAndDeletedIsFalse(id).stream().filter(this::userCanSee).collect(Collectors.toList());
    }
    public int deleteByDocumentCategorieModelId(Long id){
        return dao.deleteByDocumentCategorieModelId(id);
    }


    private Boolean userCanSee(Document document){
        User user = getCurrentUser();
        if(Objects.isNull(user))
            return false;
        if(Boolean.TRUE.equals(utilisateurService.isAdmin(user))){
            return true;
        }
        Set<User> listAhtorizedUsers = new HashSet<>();
        if(Objects.nonNull(document.getUtilisateur()) &&
                Objects.nonNull(document.getUtilisateur().getUsername()) &&
                (document.getUtilisateur().getUsername().equalsIgnoreCase(user.getUsername())))
            return true;
        document.getDocumentPartageUtilisateurs().forEach(usrPartage -> {
            if(Objects.nonNull(usrPartage.getUtilisateur())){
                listAhtorizedUsers.add(usrPartage.getUtilisateur());
            }
        });
        document.getDocumentPartageGroupes().forEach(group -> {
            if(Objects.nonNull(group.getGroupe()) && CollectionUtils.isNotEmpty(group.getGroupe().getGroupeUtilisateurs())){
                group.getGroupe().getGroupeUtilisateurs().forEach(groupUser -> listAhtorizedUsers.add(groupUser.getUtilisateur()));
            }
        });
        return listAhtorizedUsers.stream().anyMatch(usr -> user.getUsername().equalsIgnoreCase(usr.getUsername()));
    }


    public void configure() {
        super.configure(Document.class,DocumentHistory.class, DocumentHistoryCriteria.class, DocumentSpecification.class);
    }


    @Autowired
    private DocumentTypeCollaborateurService documentTypeService ;
    @Autowired
    private DocumentPartageUtilisateurCollaborateurService documentPartageUtilisateurService ;
    @Autowired
    private EntiteAdministrativeCollaborateurService entiteAdministrativeService ;
    @Autowired
    private DocumentTagCollaborateurService documentTagService ;
    @Autowired
    private DocumentPartageGroupeCollaborateurService documentPartageGroupeService ;
    @Autowired
    private UtilisateurCollaborateurService utilisateurService ;
    @Autowired
    private DocumentIndexElementCollaborateurService documentIndexElementService ;
    @Autowired
    private DocumentStateCollaborateurService documentStateService ;

    public DocumentCollaborateurServiceImpl(DocumentDao dao, DocumentHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
