package ma.sir.ged.service.facade.bo;

import ma.sir.ged.WebSocket.UseCases.NotificationCourriel;
import ma.sir.ged.WebSocket.UseCases.NotificationParapheur;
import ma.sir.ged.bean.core.bureauOrdre.ActionsBo;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.bureauOrdre.enums.StatutIntervention;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.bureauOrdre.ActionsRepository;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.dao.facade.core.bureauOrdre.IntervenantsCourrielRepository;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.utils.pdfUtils.PdfUtils;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielConverter;
import ma.sir.ged.ws.converter.BureauOrdre.IntervenantsCourrielConverter;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.parapheur.ParapheurConverter;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import ma.sir.ged.ws.dto.BureauOrdre.IntervenantsCourrielDto;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.ParapheurDto;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IntervenantsCourrielService {
    @Autowired
    private IntervenantsCourrielRepository intervenantsCourrielRepository;
    @Autowired
    private ActionsRepository  actionsRepository;
    @Autowired
    private CourrielsRepository courrielsRepository;
    @Autowired
    private DocumentDao documentDao;
    @Autowired
    private IntervenantsCourrielConverter intervenantsCourrielConverter;
    @Autowired
    private CourrielHistoryService courrielHistoryService;
    @Autowired
    private  CourrielService courrielService;
    @Autowired
    private NotificationCourriel notificationCourriel;
    @Autowired
    private NotificationParapheur notificationParapheur;
    @Autowired
    private CourrielConverter courrielConverter;
    @Autowired
    private ParapheurRepository parapheurRepository;
    @Autowired
    private DocumentConverter documentConverter;

    @Autowired
    private ParapheurConverter parapheurConverter;

    @Autowired
    private UtilisateurConverter utilisateurConverter;

    @Autowired
    private UtilisateurDao utilisateurRepository;



    @Value("${annotation.rejet}")
    private String rejectAnnotation;
    @Value("${annotation.signer}")
    private String signerAnnotation;


    public List<IntervenantsCourriel> getAll() {
        return intervenantsCourrielRepository.findAll();
    }

    public IntervenantsCourriel findByCourrielBoId(Long id) {
        return intervenantsCourrielRepository.findByCourrielBoId(id);
    }

    public IntervenantsCourriel findById(Long id) {
        return intervenantsCourrielRepository.findById(id).get();
    }

    @NotNull
    public CourrielDto addIntervenantsToCourrier(Long courrielId, IntervenantsCourrielDto intervenantDtos) {
        CourrielBo courriel = courrielService.getCourrielById(courrielId);
        IntervenantsCourriel intervenants = intervenantsCourrielConverter.toEntity(intervenantDtos);
        intervenants.setDateCreation(LocalDateTime.now());
        intervenants.setCourrielBo(courriel);
        intervenantsCourrielRepository.save(intervenants);

        courrielHistoryService.registerIntervenantHistoryEntry(courriel,intervenants, HistoryEntryType.INTERVENTION);
        notificationCourriel.notifyCourrielIntervention(courriel, intervenants);

        handleSignerAnnotation(intervenants);

        return courrielConverter.toDto(courriel);
    }

    public void handleSignerAnnotation(IntervenantsCourriel intervenants, CourrielBo courriel) {
        if(intervenants.getAction() != null && signerAnnotation.equalsIgnoreCase(intervenants.getAction().getLibelle())){
            List<DocumentDto> documentDtos = CollectionUtils.emptyIfNull(courriel.getDocuments()).stream().map(documentConverter::toDto).collect(Collectors.toList());
            String parapheurTitle = "Bureau d'ordre: " + courriel.getSujet();
            createParapheurDto(parapheurTitle,documentDtos.stream().filter(
                    documentDto -> !documentDto.getSigned()).collect(Collectors.toList()),null);
            notificationParapheur.notifyParapheurCreation(intervenants.getResponsables());
        }
    }

    public void handleSignerAnnotation(IntervenantsCourriel intervenants) {
        if(intervenants.getAction() != null && signerAnnotation.equalsIgnoreCase(intervenants.getAction().getLibelle())){
            List<DocumentDto> documentDtos = CollectionUtils.emptyIfNull(intervenants.getDocuments()).stream().map(documentConverter::toDto).collect(Collectors.toList());
            String parapheurTitle = "Bureau d'ordre intervention: " + intervenants.getCourrielBo().getSujet();
            createParapheurDto(parapheurTitle,documentDtos.stream().filter(
                    documentDto -> !documentDto.getSigned()).collect(Collectors.toList()),null);
            notificationParapheur.notifyParapheurCreation(intervenants.getResponsables());
        }
    }

    @NotNull
    public CourrielBo updateIntervenants(Long courrielId, IntervenantsCourrielDto intervenantsCourrielDto) {
        CourrielBo courriel = courrielService.getCourrielById(courrielId);

        // Get the old intervenant
        IntervenantsCourriel intervention = findById(intervenantsCourrielDto.getId());

        IntervenantsCourriel oldIntervention =  new IntervenantsCourriel();

        BeanUtils.copyProperties(intervention, oldIntervention);


        IntervenantsCourriel newIntervenants = update(intervenantsCourrielDto, courriel);

        if (checkForInterventionDone(intervention)) {
//            courrielHistoryService.registerIntervenantHistoryEntry(, "Intervention terminée", HistoryEntryType.INTERVENTION);
            notificationCourriel.notifyCourrielInterventionDone(courriel, newIntervenants);
        } else if (checkForCommentaire(oldIntervention, newIntervenants)) {
//            courrielHistoryService.registerIntervenantHistoryEntry(courriel, "Commentaire ajouter: " + oldIntervention.getCommentaire(), HistoryEntryType.INTERVENTION);
            notificationCourriel.notifyCourrielInterventionComment(courriel, newIntervenants);
        } else {
//            courrielHistoryService.registerIntervenantHistoryEntry(courriel, "intervenantion set to " + intervention.getStatut(), HistoryEntryType.INTERVENTION);
            notificationCourriel.notifyCourrielInterventionModification(courriel, newIntervenants);
        }
        return courriel;
    }

    private boolean checkForInterventionDone(IntervenantsCourriel intervenant){
        return intervenant.isDone();
    }

    private boolean checkForCommentaire(IntervenantsCourriel oldIntervenant, IntervenantsCourriel newIntervenant){
        return !oldIntervenant.getCommentaire().equals(newIntervenant.getCommentaire());
    }
    public IntervenantsCourriel update(IntervenantsCourrielDto intervenantsCourrielDto, CourrielBo courrielBo) {
        IntervenantsCourriel intervenantsCourriel = intervenantsCourrielConverter.toEntity(intervenantsCourrielDto);
        intervenantsCourriel.setCourrielBo(courrielBo);

        intervenantsCourriel.setDateIntervention(LocalDateTime.now());
//        Utilisateur intervenant = utilisateurDao.findById(SecurityUtil.getCurrentUser().getId()).orElse(null);
//        intervenantsCourriel.setIntervenant(intervenant);

        intervenantsCourrielRepository.save(intervenantsCourriel);
        return intervenantsCourriel;
    }


    public void deleteByCourrielBoId(Long id) {
        intervenantsCourrielRepository.deleteByCourrielBoId(id);
    }


    public List<ActionsBo> getAllActions() {
        return actionsRepository.findAll().stream().filter(actionsBo -> !actionsBo.getLibelle().equals(rejectAnnotation)).collect(Collectors.toList());
    }

    public String createAction(String libelleAction) {
        ActionsBo actionsBo = new ActionsBo();
        actionsBo.setLibelle(libelleAction);
        actionsRepository.save(actionsBo);
        return actionsBo.getLibelle();
    }

    public void deleteAction(String libelleAction) {
        ActionsBo actionsBo = actionsRepository.findByLibelle(libelleAction);
        actionsRepository.delete(actionsBo);
    }

    public ByteArrayOutputStream generatePdf(Long courrielId) {
        List<IntervenantsCourriel> intervenantsCourriels = intervenantsCourrielRepository.findAllByCourrielBoId(courrielId);
        CourrielBo courriel = courrielsRepository.findById(courrielId).get();

        return PdfUtils.generateIntervenantsCourrielsPdf(courriel, intervenantsCourriels);
    }

    public CourrielDto rejetIntervention(Long courrielId, IntervenantsCourrielDto intervenantsCourrielDto) {
        intervenantsCourrielDto.setDone(false);
        intervenantsCourrielDto.setStatut(StatutIntervention.ANNULE.name());
        updateIntervenants(courrielId, intervenantsCourrielDto);

        // create a new intervention as notification for rejection
        IntervenantsCourrielDto newIntervenant = new IntervenantsCourrielDto();
        newIntervenant.setCommentaire("L'intervention '"+intervenantsCourrielDto.getAction()+"' à été rejetée \n"+ intervenantsCourrielDto.getCommentaire());
        newIntervenant.setAction(rejectAnnotation);
        newIntervenant.setCreatedBy(intervenantsCourrielDto.getIntervenant());
        List<UtilisateurDto> responsables = new ArrayList<>();
        responsables.add(intervenantsCourrielDto.getCreatedBy());
        newIntervenant.setResponsables(responsables);

        return addIntervenantsToCourrier(courrielId, newIntervenant );

    }

    public void handleDocumentSigned(Long id) {
        Document document = documentDao.findById(id).orElseThrow(() -> new RessourceNotFoundException("Document avec l'ID " + id + " n'a pas été trouvé."));
        if(document.getCourriel() != null){
            CourrielBo courrielBo = document.getCourriel();
            IntervenantsCourriel lastIntervention = courrielBo.getIntervenants().get(courrielBo.getIntervenants().size()-1);

            if(signerAnnotation.equalsIgnoreCase(lastIntervention.getAction().getLibelle())
                    && lastIntervention.getStatut()!=StatutIntervention.ANNULE
                    && lastIntervention.getStatut()!=StatutIntervention.CLOTURE){
                Utilisateur signataire = (Utilisateur) SecurityUtil.getCurrentUser();

                if(lastIntervention.getResponsables().stream().anyMatch(responsable -> responsable.getId().equals(signataire.getId()))){
                    lastIntervention.setCommentaire(lastIntervention.getCommentaire()+"\n\n"+"Document signé par "+signataire.getNom()+" "+signataire.getPrenom()+"\n");
                    lastIntervention.setDateIntervention(LocalDateTime.now());
                    lastIntervention.setIntervenant(signataire);
                    intervenantsCourrielRepository.save(lastIntervention);
                    notificationCourriel.notifyCourrielInterventionDone(courrielBo, lastIntervention);
                    if(checkAllDocsSigned(lastIntervention.getDocuments())){
                        lastIntervention.setDone(true);
                        lastIntervention.setStatut(StatutIntervention.CLOTURE);
                    }
                }
            }

        }
    }

    private boolean checkAllDocsSigned(List<Document> documents){
        return documents.stream().allMatch(Document::getSigned);
    }

    public void addDocumentToIntervenant(Long intervenantId, Document document) {
        IntervenantsCourriel intervenant = intervenantsCourrielRepository.findById(intervenantId)
                .orElseThrow(() -> new RuntimeException("Intervenant not found with id: " + intervenantId));
        if (!intervenant.getDocuments().contains(document)) {
            intervenant.getDocuments().add(document);
            intervenantsCourrielRepository.save(intervenant);
        }
        intervenantsCourrielRepository.save(intervenant);
    }

    public void removeDocumentFromIntervenant(Long intervenantId, Long documentId) {
        IntervenantsCourriel intervenant = intervenantsCourrielRepository.findById(intervenantId)
                .orElseThrow(() -> new RuntimeException("Intervenant not found with id: " + intervenantId));
        Document document = documentDao.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
        intervenant.getDocuments().remove(document);
        intervenantsCourrielRepository.save(intervenant);
    }

    public List<Document> getDocumentsOfIntervenant(Long intervenantId) {
        IntervenantsCourriel intervenant = intervenantsCourrielRepository.findById(intervenantId)
                .orElseThrow(() -> new RuntimeException("Intervenant not found with id: " + intervenantId));
        return new ArrayList<>(intervenant.getDocuments());
    }

    public boolean isInterventionOpen(IntervenantsCourriel intervenantsCourriel){
        return intervenantsCourriel.getStatut() != StatutIntervention.CLOTURE && intervenantsCourriel.getStatut() != StatutIntervention.ANNULE;
    }

    // when a document is signed from parapheur
    public void handleDocUpdateAndIntervention(IntervenantsCourriel intervenantsCourriel, Document oldDocument, Document newDocument) {
        if(isInterventionOpen(intervenantsCourriel) && signerAnnotation.equalsIgnoreCase(intervenantsCourriel.getAction().getLibelle())){
            List<Document> interventionDocs = intervenantsCourriel.getDocuments();
            if(interventionDocs.contains(oldDocument)){
                interventionDocs.add(newDocument);
                intervenantsCourriel.setDocuments(interventionDocs);
                intervenantsCourrielRepository.save(intervenantsCourriel);
            }
        }
    }

    private ResponseEntity<ParapheurDto> createParapheurDto(String title, List<DocumentDto> documentDtos, List<UtilisateurDto> utilisateurDtos) {
        User user = SecurityUtil.getCurrentUser();
//        if ((documentExistParpheur(documentDtos))) {
//            return new ResponseEntity<>(null, HttpStatus.IM_USED);
//        }
        ParapheurBo parapheurBo = new ParapheurBo();
        List<Document> documents = documentConverter.toItem(documentDtos);
        if (utilisateurDtos != null) {
            List<Utilisateur> utilisateurs = utilisateurConverter.toItem(utilisateurDtos);
            parapheurBo.setUtilisateurs(utilisateurs);
        }
        parapheurBo.setDocuments(documents);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String todayDate = LocalDateTime.now().format(formatter);

        String originalTitle = title + " - " + todayDate;
        int count = 1;
        while (parapheurRepository.existsByTitle(originalTitle)) {
            originalTitle = originalTitle + " (" + count + ")";
            count++;
        }
        parapheurBo.setTitle(originalTitle);
        parapheurBo.setDeleted(false);
        parapheurBo.setParapheurEtat(ParapheurEtat.EN_ATTENTE);
        if (user != null) {
            parapheurBo.setUtilisateur(utilisateurRepository.findById(user.getId()).orElse(null));
        }
        ParapheurBo savedParapheurBo = parapheurRepository.save(parapheurBo);
        for(Document doc : documents){
            doc.setParaphed(true);
        }
        documentDao.saveAll(documents);
        ParapheurDto savedParapheurDTO = parapheurConverter.convertToParapheurDto(savedParapheurBo);
        return new ResponseEntity<>(savedParapheurDTO, HttpStatus.CREATED);
    }
}
