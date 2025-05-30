package ma.sir.ged.service.facade.admin.parapheur;

import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.Email.EmailService;
import ma.sir.ged.Email.MailRequests.PlainTextMailRequest;
import ma.sir.ged.Signature.PdfStampingServices.SignatureStamperService;
import ma.sir.ged.Signature.SignatureService;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurComment;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.config.ImplementMultipartFile.ByteArrayMultipartFile;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurCommentRepository;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.doc.AuditAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentStateAdminService;
import ma.sir.ged.service.impl.admin.organigramme.PlanClassementServiceImpl;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.workflow.service.sev.StepService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.DocumentStateConverter;
import ma.sir.ged.ws.converter.parapheur.ParapheurConverter;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.ParapheurDto;
import ma.sir.ged.ws.dto.PlanClassementDto;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.ws.facade.admin.parapheur.Handlers.ParapheurBoHandler;
import ma.sir.ged.ws.facade.admin.parapheur.Handlers.ParapheurWorkflowHandler;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import ma.sir.ged.zynerator.util.ListUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParapheurService {

    private final ParapheurRepository parapheurRepository;
    private final StepService stepService;
    private final WorkflowRepository workflowRepository;
    private final SignatureService signatureService;
    private final DocumentDao documentdao;
    private final UtilisateurAdminService utilisateurService;
    private final ParapheurWorkflowHandler parapheurWorkflowHandler;
    private final ParapheurBoHandler parapheurBoHandler;
    private final DocumentConverter converter;
    private final UtilisateurConverter utilisateurConverter;
    private final ParapheurConverter parapheurConverter;
    private final DocumentAdminService documentAdminService;
    private final AuditAdminService auditService;
    private final EmailService emailService;
    private final ParapheurCommentRepository parapheurCommentRepository;
    private final PlanClassementServiceImpl planClassementServiceImpl;
    private final DocumentStateAdminService documentStateAdminService;
    private final DocumentStateConverter documentStateConverter;
    private final SignatureStamperService signatureStamperService;

    public ParapheurBo findById(Long id) {
        return parapheurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + id));
    }

    public ResponseEntity<ParapheurDto> getParapheurDTO(Long id) {
        ParapheurBo ParapheurBo = parapheurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + id));
        ParapheurDto parapheurDTO = parapheurConverter.convertToParapheurDto(ParapheurBo);
        return new ResponseEntity<>(parapheurDTO, HttpStatus.OK);
    }

    public ResponseEntity<List<ParapheurDto>> getParapheurDTOByTitle(String title) {
        List<ParapheurDto> parapheurDtoList = CollectionUtils.emptyIfNull(parapheurRepository.findByTitleContaining(title))
                .stream()
                .map(parapheurConverter::convertToParapheurDto)
                .collect(Collectors.toList());
        if (!parapheurDtoList.isEmpty()) {
            return new ResponseEntity<>(parapheurDtoList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public List<ParapheurDto> getAllParapheurDTO() {
        User user = SecurityUtil.getCurrentUser();
        boolean isAdmin = utilisateurService.isAdmin(user);
        List<ParapheurBo> parapheurBoList = new ArrayList<>();
        if (isAdmin) {
            parapheurBoList = parapheurRepository.findAllByOrderByCreatedOnDesc();
        } else {
            if (user != null) {
                List<ParapheurBo> createdParapheurBos = parapheurRepository.findAllByUtilisateurIdOrderByCreatedOnDesc(user.getId());
                List<ParapheurBo> intervenantParapheurBos = parapheurRepository.findAllByUtilisateurs_IdOrderByCreatedOnDesc(user.getId());

                parapheurBoList = createdParapheurBos;
                for (ParapheurBo parapheurBo : intervenantParapheurBos) {
                    if (!parapheurBoList.contains(parapheurBo)) {
                        parapheurBoList.add(parapheurBo);
                    }
                }
            }
        }
        return CollectionUtils.emptyIfNull(parapheurBoList).stream()
                .filter(parapheurItem -> !Boolean.TRUE.equals(parapheurItem.getDeleted()))
                .map(ParapheurItem -> parapheurConverter.convertToParapheurDto(ParapheurItem))
                .collect(Collectors.toList());
    }


    public List<Long> findAllParapheursDocuments() {
        return new ArrayList<>(CollectionUtils.emptyIfNull(parapheurRepository.findAllParapheursDocuments()));
    }

    public Boolean documentExistParpheur(List<DocumentDto> documentDtos) {
        return documentDtos.stream()
                .map(DocumentDto::getId)
                .anyMatch(documentId ->
                        findAllParapheursDocuments().stream()
                                .anyMatch(id -> id.equals(documentId)));
    }

    public ResponseEntity<ParapheurDto> createParapheurDto(String title, List<DocumentDto> documentDtos, List<UtilisateurDto> utilisateurDtos) {
        User user = SecurityUtil.getCurrentUser();
//        if ((documentExistParpheur(documentDtos))) {
//            return new ResponseEntity<>(null, HttpStatus.IM_USED);
//        }
        ParapheurBo parapheurBo = new ParapheurBo();
        List<Document> documents = converter.toItem(documentDtos);
        if (utilisateurDtos != null) {
            List<Utilisateur> utilisateurs = utilisateurConverter.toItem(utilisateurDtos);
            parapheurBo.setUtilisateurs(utilisateurs);
        }
        parapheurBo.setDocuments(documents);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String todayDate = LocalDateTime.now().format(formatter);

        String baseTitle = title + " - " + todayDate;
        String originalTitle = baseTitle;
        int count = 1;
        while (parapheurRepository.existsByTitle(originalTitle)) {
            originalTitle = baseTitle + " (" + count + ")";
            count++;
        }
        parapheurBo.setTitle(originalTitle);
        parapheurBo.setDeleted(false);
        parapheurBo.setParapheurEtat(ParapheurEtat.EN_ATTENTE);
        if (user != null) {
            parapheurBo.setUtilisateur(utilisateurService.findById(user.getId()));
        }
        ParapheurBo savedParapheurBo = parapheurRepository.save(parapheurBo);
        for(Document doc : documents){
            DocumentState state = documentStateAdminService.findByLibelle("Validé");
            doc.setDocumentState(state);
            doc.setParaphed(true);
        }
        documentdao.saveAll(documents);
        ParapheurDto savedParapheurDTO = parapheurConverter.convertToParapheurDto(savedParapheurBo);
        return new ResponseEntity<>(savedParapheurDTO, HttpStatus.CREATED);
    }

    public ResponseEntity<ParapheurDto> mergeParapheurs(String workflowTitle, List<ParapheurBo> parapheursToMerge) {
        User user = SecurityUtil.getCurrentUser();

        if (parapheursToMerge == null || parapheursToMerge.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        ParapheurBo mergedParapheurBo = new ParapheurBo();
        
        Set<Document> mergedDocuments = new HashSet<>();
        Set<Long> utilisateurIds = new HashSet<>();
        Set<Utilisateur> mergedUtilisateurs = new HashSet<>();

        for (ParapheurBo parapheur : parapheursToMerge) {
            mergedDocuments.addAll(parapheur.getDocuments());
            if (parapheur.getUtilisateurs() != null) {
                for (Utilisateur utilisateur : parapheur.getUtilisateurs()) {
                    if (!utilisateurIds.contains(utilisateur.getId())) {
                        mergedUtilisateurs.add(utilisateur);
                        utilisateurIds.add(utilisateur.getId());
                    }
                }
            }
        }

        mergedParapheurBo.setDocuments(new ArrayList<>(mergedDocuments));
        mergedParapheurBo.setUtilisateurs(new ArrayList<>(mergedUtilisateurs));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String todayDate = LocalDateTime.now().format(formatter);

        String baseTitle = workflowTitle + " - " + todayDate;
        String originalTitle = baseTitle;
        int count = 1;

        while (parapheurRepository.existsByTitle(originalTitle)) {
            originalTitle = baseTitle + " (" + count + ")";
            count++;
        }

        mergedParapheurBo.setTitle(originalTitle);
        mergedParapheurBo.setDeleted(false);
        mergedParapheurBo.setParapheurEtat(ParapheurEtat.EN_ATTENTE);

        if (user != null) {
            mergedParapheurBo.setUtilisateur(utilisateurService.findById(user.getId()));
        }
        mergedParapheurBo.setWorkflow(parapheursToMerge.get(0).getWorkflow());
        ParapheurBo savedParapheurBo = parapheurRepository.save(mergedParapheurBo);

        for (ParapheurBo parapheur : parapheursToMerge) {
            parapheur.setParapheurEtat(ParapheurEtat.REJETE);
            parapheurRepository.save(parapheur);
        }
        for (Document doc : mergedDocuments) {
            doc.setParaphed(true);
        }
        documentdao.saveAll(mergedDocuments);

        ParapheurDto savedParapheurDto = parapheurConverter.convertToParapheurDto(savedParapheurBo);

        return new ResponseEntity<>(savedParapheurDto, HttpStatus.CREATED);
    }

    public ResponseEntity<ParapheurDto> updateParapheurDto(Long id, ParapheurDto parapheurDTO) {
        ParapheurBo optionalParapheurBo = parapheurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + id));
        optionalParapheurBo.setTitle(parapheurDTO.getTitle());
        optionalParapheurBo.setParapheurEtat(ParapheurEtat.forValue(parapheurDTO.getParapheurEtat()));
        if(parapheurDTO.getUtilisateurDtos() != null && !parapheurDTO.getUtilisateurDtos().isEmpty()){
            optionalParapheurBo.setUtilisateurs(utilisateurConverter.toItem(parapheurDTO.getUtilisateurDtos()));
        } else {
            optionalParapheurBo.setUtilisateurs(new ArrayList<>());
        }
        ParapheurBo updatedParapheurBo = parapheurRepository.save(optionalParapheurBo);
        ParapheurDto savedParapheurDTO = parapheurConverter.convertToParapheurDto(updatedParapheurBo);
        return new ResponseEntity<>(savedParapheurDTO, HttpStatus.OK);
    }

    public ResponseEntity<Void> deleteParapheur(Long id) {
        ParapheurBo oldParapheurBo = parapheurRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + id));
        oldParapheurBo.setDeleted(true);
        for(Document doc: oldParapheurBo.getDocuments()){
            doc.setParaphed(false);
            documentdao.save(doc);
        }
        oldParapheurBo.getDocuments().clear();
        parapheurRepository.save(oldParapheurBo);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> deleteParapheurs(List<Long> ids) {
        List<ParapheurBo> parapheurBos = parapheurRepository.findAllById(ids);
        if (parapheurBos.isEmpty()) {
            throw new ResourceNotFoundException("No Parapheur found with ids " + ids);
        }
        parapheurBos = CollectionUtils.emptyIfNull(parapheurBos).stream()
                .peek(parapheur -> {
                    parapheur.setDeleted(true);
                    parapheur.getDocuments().clear();
                })
                .collect(Collectors.toList());
        parapheurRepository.saveAll(parapheurBos);
        return ResponseEntity.noContent().build();
    }

    public List<DocumentDto> findDocumentsByParapheur(Long id) {
        List<Long> documentIds = parapheurRepository.findDocumentsIdByParapeur(id);
        if (documentIds.isEmpty()) {
            return new ArrayList<>();
        }
        List<Document> documents = documentdao.findByIdIn(documentIds);
        return converter.toDto(documents);
    }

    public DocumentDto getFicheParapheur(Long parapheurId) {
        Long ficheParaphId = parapheurRepository.findFichParaphIdByParapheurBoId(parapheurId);

        if (ficheParaphId == null) {
            return null;
        }

        Document ficheParaph = documentdao.findById(ficheParaphId).orElse(null);
        return converter.toDto(ficheParaph);
    }

    public DocumentDto signDocument(Long paragheurId, Long documentId) {
        Document oldDoc = documentAdminService.findById(documentId);
        DocumentDto newDoc = new DocumentDto();
        try {
            User currentUser = SecurityUtil.getCurrentUser();
            Utilisateur user = utilisateurService.findById(currentUser.getId());
            BufferedImage signatureImage = signatureStamperService.getUserSignatureImage(user);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(signatureImage, "png", baos);
            byte[] signatureBytes = baos.toByteArray();

            if (signatureService.checkAndCreateUserCertificate(user)) {
                byte[] file = documentAdminService.downloadFileFromService(documentId, "");
                MultipartFile multipartFile = new ByteArrayMultipartFile(oldDoc.getReference(), oldDoc.getReference(), "application/pdf", file);

                MultipartFile signatureFile = new ByteArrayMultipartFile("signature", "signature.png", "image/png", signatureBytes);
                MultipartFile signedFile = multipartFile;
                if (user.getSignature() != null) {
                    signedFile = signFirstPage(multipartFile, signatureFile);
                }

                newDoc = documentAdminService.createDocumentWithFile(signedFile, converter.toDto(oldDoc), oldDoc, true);

                signatureService.signDocument(
                        signedFile,
                        newDoc,
                        user,
                        currentUser.getPassword()
                );
            }

            parapheurBoHandler.handleBoSignedDocument(newDoc.getId());

            newDoc.setSigned(true);
            DocumentState state = documentStateAdminService.findByLibelle("Signé");
            newDoc.setDocumentState(documentStateConverter.toDto(state));
            documentdao.save(converter.toItem(newDoc));

            ParapheurBo parapheurBo = parapheurRepository.findById(paragheurId)
                    .orElseThrow(() -> new RessourceNotFoundException("No Parapheur found  "));

            List<Document> documents = parapheurBo.getDocuments();

            converter.init(true);
            for (int i = 0; i < documents.size(); i++) {
                Document doc = documents.get(i);
                if (doc.getId().equals(oldDoc.getId())) {
                    documents.set(i, converter.toItem(newDoc));
                    break;
                }
            }

            Workflow workflow = parapheurBo.getWorkflow();
            if (Objects.nonNull(workflow)) {
                parapheurWorkflowHandler.handleParapheurWorkflow(workflow, oldDoc, newDoc);
                associate_signedCE_with_planClassementWF(Collections.singletonList(converter.toItem(newDoc)), workflow);
                add_signedDocuments_to_envoiCourrierStep(Collections.singletonList(newDoc), workflow);
            }

            boolean allSigned = documents.stream().allMatch(doc -> Boolean.TRUE.equals(doc.getSigned()));
            if (allSigned) parapheurBo.setParapheurEtat(ParapheurEtat.TERMINE);

            parapheurBo.setDocuments(documents);
            parapheurRepository.save(parapheurBo);
            sendEmail(parapheurBo, newDoc);
        } catch (Exception e) {
            log.error("Failed to sign document", e);
        }
        auditService.saveAudit(newDoc.getId(), "Modifier_File");
        return newDoc;
    }


    public void addUsersToParapheurs(Long workflowId, List<UtilisateurDto> utilisateurs) {
        List<ParapheurBo> parapheurBos = parapheurRepository.findByWorkflowId(workflowId);
        for (ParapheurBo parapheurBo : parapheurBos) {
            for (UtilisateurDto utilisateurDto : utilisateurs) {
                Utilisateur utilisateur = utilisateurService.findById(utilisateurDto.getId());
                if (!parapheurBo.getUtilisateurs().contains(utilisateur)) {
                    parapheurBo.getUtilisateurs().add(utilisateur);
                }
            }
            parapheurRepository.save(parapheurBo);
        }
    }

    private void  associate_signedCE_with_planClassementWF(List<Document> documents, Workflow workflow) {
        for(Document doc : documents){
            PlanClassementDto planClassement1 = new PlanClassementDto();
            PlanClassementDto planClassement2 = new PlanClassementDto();
            PlanClassementDto planClassement3 = new PlanClassementDto();

            planClassement1.setLibelle(doc.getDocumentCategorie().getLibelle());
            planClassement2.setLibelle(workflow.getTitle());
            planClassement3.setLibelle("CE signé");

            List<PlanClassementDto> planClassementsList = new ArrayList<>();
            planClassementsList.add(planClassement1);
            planClassementsList.add(planClassement2);
            planClassementsList.add(planClassement3);

            PlanClassement parentPlantClassement = planClassementServiceImpl.createYearlyAndMonthlyPlans(planClassementsList);

            doc.setPlanClassement(parentPlantClassement);
            documentdao.save(doc);
        }
    }

    private  void add_signedDocuments_to_envoiCourrierStep(List<DocumentDto> signedDocs, Workflow workflow){
        List<Step> steps = workflow.getStepList();
        Step envoiCourrierStep = steps.stream()
                .filter(step -> step.getStepPreset().getActions().contains(ACTION.ENVOI_COURRIER))
                .findFirst()
                .orElse(null);

        if (envoiCourrierStep != null) {
            for (DocumentDto doc : signedDocs) {
                stepService.addDocToStep(envoiCourrierStep.getId(), signedDocs);
            }
        }
    }

    public void signDocumentsGroup(Long paragheurId) throws Exception {
        ParapheurBo parapheurBo = parapheurRepository.findById(paragheurId)
                .orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + paragheurId));

        List<Document> documents = parapheurBo.getDocuments();
        List<DocumentDto> documentDtos = new ArrayList<>();

        for (Document doc : documents) {
            if (!doc.getSigned()) {
                DocumentDto documentDto = converter.toDto(doc);
                documentDtos.add(documentDto);
            }
        }

        for (DocumentDto dto : documentDtos) {
            signDocument(paragheurId, dto.getId());
        }

        List<Document> signedDocumentsEntities = ListUtil.emptyIfNull(converter.toItem(documentDtos));

        boolean allSigned = signedDocumentsEntities.stream()
                .allMatch(Document::getSigned);

        if (allSigned) {
            parapheurBo.setParapheurEtat(ParapheurEtat.TERMINE);
            parapheurRepository.save(parapheurBo);

            // Vérifier et signer la dernière étape du workflow
            Workflow workflow = parapheurBo.getWorkflow();
            if (workflow != null) {
                List<Step> steps = workflow.getStepList();
                List<Document> documentsParapheur = parapheurWorkflowHandler.getAllDocumentsByWorkflow(workflow.getId());
                boolean allParapheursSigned = documentsParapheur.stream().allMatch(doc -> Boolean.TRUE.equals(doc.getSigned()));
                if (steps != null && !steps.isEmpty() && allParapheursSigned) {
                    Step lastStep = steps.stream()
                            .filter(s -> s.getStepPreset().getActions().contains(ACTION.SIGN))
                            .findFirst()
                            .orElse(null);

                    // Signer la dernière étape si elle n'est pas déjà signée
                    stepService.sign(lastStep.getId(), lastStep.getDestinataires().get(0).getUtilisateur().getId());
                    workflowRepository.save(workflow);

                }
            }
        }
    }

    public MultipartFile signFirstPage(MultipartFile file, MultipartFile signature) throws IOException {
        byte[] originalPdf = file.getBytes();
        byte[] signatureImage = signature.getBytes();

        byte[] signedPdf = addSignatureToFirstPage(originalPdf, signatureImage);

        return new ByteArrayMultipartFile(file.getName(), file.getOriginalFilename(), "application/pdf", signedPdf);
    }

    public byte[] addSignatureToFirstPage(byte[] originalPdf, byte[] signatureImage) {
        try {
            PdfReader pdfReader = new PdfReader(originalPdf);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfStamper pdfStamper = new PdfStamper(pdfReader, outputStream);
            Image signature = Image.getInstance(signatureImage);
            signature.scaleAbsolute(100, 100);

            com.itextpdf.text.Rectangle pageSize = pdfReader.getPageSizeWithRotation(1);
            float pageWidth = pageSize.getWidth();
            float x = pageWidth - signature.getScaledWidth() - 10;
            float y = 50;

            signature.setAbsolutePosition(x, y);
            pdfStamper.getOverContent(1).addImage(signature);

            pdfStamper.close();
            pdfReader.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add signature to all pages of PDF", e);
        }
    }

    public boolean isParapheurSigned(Long parapheurId) {
        ParapheurBo parapheurBo = parapheurRepository.findById(parapheurId)
                .orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + parapheurId));

        List<Document> documents = parapheurBo.getDocuments();
        return documents.stream().allMatch(Document::getSigned);
    }

    private void sendEmail(ParapheurBo parapheurBo, DocumentDto signedDocument){
        List<Document> allDocuments;
        List<String> emails = new ArrayList<>();
        if(Objects.nonNull(parapheurBo.getWorkflow())) {
            allDocuments = parapheurWorkflowHandler.getAllDocumentsByWorkflow(parapheurBo.getWorkflow().getId());
             emails = parapheurBo.getWorkflow().getStepList().stream()
                    .filter(step -> step.getStepPreset().getActions().contains(ACTION.SIGN))
                    .flatMap(step -> step.getDestinataires().stream())
                    .map(destinataire -> destinataire.getUtilisateur().getEmail())
                    .distinct()
                    .collect(Collectors.toList());
        }else {
            allDocuments = parapheurBo.getDocuments();
            for(Utilisateur user :parapheurBo.getUtilisateurs()){
                emails.add(user.getEmail());
            }
        }
        int size = allDocuments.stream().filter(doc -> doc.getSigned().equals(Boolean.FALSE)).collect(Collectors.toList()).size();
        for(String email: emails){
            emailService.sendPlainTextEmail(newEmailAI(signedDocument, size, parapheurBo.getTitle(), email));
        }
    }

    private PlainTextMailRequest newEmailAI(DocumentDto document , int size, String parapheurNAme, String email){
        PlainTextMailRequest mailRequest = new PlainTextMailRequest();

        mailRequest.setToEmail(email);
        mailRequest.setSubject("Signature de document réussie");

        StringBuilder message = new StringBuilder();
        message.append("Le document suivant a été signé avec succès : " + document.getReference() + "\n");
        message.append("Il vous reste " + size + " document(s) à signer dans le parapheur : " + parapheurNAme);

        mailRequest.setMessage(message.toString());
        mailRequest.setTitle("Document Signé");
        mailRequest.setSenderId(-1L);
        mailRequest.setHTML(true);

        return mailRequest;
    }

    public Page<ParapheurDto> getAllParapheurDTOPaginated(int page , int size, String searchKeyWord) {
        User user = SecurityUtil.getCurrentUser();
        boolean isAdmin = utilisateurService.isAdmin(user);
        Page<ParapheurBo> parapheurBoList = new PageImpl<>(new ArrayList<>());
        if (isAdmin) {
            parapheurBoList = parapheurRepository.findAllByDeletedOrderByCreatedOnDesc(searchKeyWord,PageRequest.of(page, size));
        } else {
            if (user != null) {
                parapheurBoList = parapheurRepository.findAllByUserNotAdminNotDeletedOrderByCreatedOnDesc(user.getId(),searchKeyWord,PageRequest.of(page, size));
            }
        }
        return parapheurBoList.map(parapheurConverter::convertToParapheurDto);

    }

    public Page<ParapheurDto> getUnsignedParapheurPaginated(int page, int size, String searchKeyWord){
        User user = SecurityUtil.getCurrentUser();
        boolean isAdmin = utilisateurService.isAdmin(user);
        Page<ParapheurBo> parapheurBoList = new PageImpl<>(new ArrayList<>());
        if (isAdmin) {
            parapheurBoList = parapheurRepository.findAllUnsignedNotDeleted(searchKeyWord,ParapheurEtat.EN_ATTENTE,PageRequest.of(page, size));
        } else {
            if (user != null) {
                parapheurBoList = parapheurRepository.findAllByUserIdNotAdminNotDeletedUnsigned(user.getId(),searchKeyWord,ParapheurEtat.EN_ATTENTE, PageRequest.of(page, size));
            }
        }
        return parapheurBoList.map(parapheurConverter::convertToParapheurDto);
    }

    public Page<ParapheurDto> getSignedParapheurPaginated(int page, int size, String searchKeyWord){
        User user = SecurityUtil.getCurrentUser();
        boolean isAdmin = utilisateurService.isAdmin(user);
        Page<ParapheurBo> parapheurBoList = new PageImpl<>(new ArrayList<>());
        if (isAdmin) {
            parapheurBoList = parapheurRepository.findAllSignedNotDeleted(searchKeyWord,ParapheurEtat.TERMINE,PageRequest.of(page, size));
        } else {
            if (user != null) {
                parapheurBoList = parapheurRepository.findAllByUserIdNotAdminNotDeletedSigned(user.getId(),searchKeyWord,ParapheurEtat.TERMINE, PageRequest.of(page, size));
            }
        }
        return parapheurBoList.map(parapheurConverter::convertToParapheurDto);
    }


    public Page<ParapheurDto> getPaginatedParapheurs(int page, int size, String filter, String searchKeyWord) {
        if("signed".equals(filter)){
            return getSignedParapheurPaginated(page, size, searchKeyWord);
        } else if ( "unsigned".equals(filter)){
            return getUnsignedParapheurPaginated(page, size, searchKeyWord);
        } else {
            return getAllParapheurDTOPaginated(page, size, searchKeyWord);
        }
    }

    public List<ParapheurComment> getParapheurComments(Long parapheurId, Long currentUserId) {
        ParapheurBo parapheurBo = parapheurRepository.findById(parapheurId).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + parapheurId));
        List<ParapheurComment> comments = parapheurBo.getComments();
        comments.forEach(comment -> comment.setSeen(comment.isSeenByUser(currentUserId)));
        return comments;
    }

    public ParapheurComment addParapheurComment(Long parapheurId, String comment, Long currentUserId) {
        ParapheurBo parapheurBo = parapheurRepository.findById(parapheurId).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + parapheurId));

        ParapheurComment parapheurComment = new ParapheurComment();
        parapheurComment.setParapheurBo(parapheurBo);
        parapheurComment.setUtilisateur(utilisateurService.findById(SecurityUtil.getCurrentUser().getId()));
        parapheurComment.markAsSeenByUser(currentUserId);
        parapheurComment.setSeen(false);
        parapheurComment.setContent(comment);

        LocalDateTime currentDateTime = LocalDateTime.now();
        parapheurComment.setCreatedOn(currentDateTime);

        parapheurCommentRepository.save(parapheurComment);

        parapheurBo.getComments().add(parapheurComment);
        parapheurRepository.save(parapheurBo);

        return parapheurComment;
    }

    public void markCommentsAsSeen(List<Long> commentIds, Long currentUserId){
        List<ParapheurComment> comments = parapheurCommentRepository.findAllById(commentIds);
        comments.forEach(comment -> comment.markAsSeenByUser(currentUserId));
        parapheurCommentRepository.saveAll(comments);
    }

    public boolean userCanSign(Long idParaph){
        User user = SecurityUtil.getCurrentUser();
        Boolean userCanSign = false;
        if (Objects.nonNull(user)) {
            ParapheurBo parapheurBo = parapheurRepository.findById(idParaph).orElseThrow(() -> new RessourceNotFoundException("No Parapheur found with id " + idParaph));
            userCanSign = ListUtil.emptyIfNull(parapheurBo.getUtilisateurs()).contains(user); //check if user is associated to paraph
            if(userCanSign && Objects.nonNull(parapheurBo.getWorkflow())){ // if paraph have workflow and associated to user
                Step signStep = parapheurBo.getWorkflow().getStepList().stream()
                        .filter(step -> step.getStepPreset().getActions().contains(ACTION.SIGN))
                        .findFirst()
                        .orElse(null);
                if(Objects.nonNull(signStep)) userCanSign = ListUtil.emptyIfNull(signStep.getDestinataires()).stream().map(UserDestinataire::getUtilisateur).collect(Collectors.toList()).contains(user);
            }
        }
        return userCanSign;
    }
}