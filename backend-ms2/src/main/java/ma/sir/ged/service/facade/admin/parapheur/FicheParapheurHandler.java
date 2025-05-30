package ma.sir.ged.service.facade.admin.parapheur;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Signature.PdfStampingServices.SignatureStamperService;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurSignersData;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.bean.core.referentieldoc.DocumentType;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementRepository;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurCertificateDataRepository;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurSignersDataRepository;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieDao;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentTypeDao;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementService;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.ws.dto.PlanClassementDto;
import org.apache.batik.transcoder.TranscoderException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FicheParapheurHandler {

    private final SignatureStamperService signatureStamperService;
    private final DocumentAdminService documentAdminService;
    private final PlanClassementService planClassementService;
    private final FicheParapheurGenerator pdfGenerator;

    private final WorkflowRepository workflowRepository;
    private final ParapheurRepository parapheurRepository;
    private final DocumentDao documentDao;
    private final DocumentCategorieDao documentCategorieDao;
    private final DocumentTypeDao documentTypeDao;
    private final PlanClassementRepository planClassementRepository;

    private final ParapheurSignersDataRepository parapheurSignersDataRepository;
    private final ParapheurCertificateDataRepository parapheurCertificateDataRepository;

    @Transactional
    public Document generateFicheParapheur(ParapheurBo parapheur, List<ParapheurCertificateData> dataEntries, List<ParapheurSignersData> signatureData) throws IOException {
        List<String> initials = signatureData.stream().map(ParapheurSignersData::getName).collect(Collectors.toList());


        byte[] ficheParapheurByte = pdfGenerator.createFicheParapheurPdf(dataEntries, initials);

        List<BufferedImage> signatureImages = getSignatureImages(signatureData);
        byte[] signedParapheurBytes = pdfGenerator.signParapheur(ficheParapheurByte, signatureImages);

        Document fichParapheurOld = getFicheParapheurDocument(parapheur.getId());
        Document ficheParaph = documentAdminService.create(fichParapheurOld, signedParapheurBytes);


        saveParapheurData(parapheur, dataEntries, signatureData);
        saveFicheParapheur(parapheur, ficheParaph);

        return ficheParaph;
    }

    private List<BufferedImage> getSignatureImages(List<ParapheurSignersData> signatureData) {
        return signatureData.stream()
                .map(signer -> {
                    try {
                        return signatureStamperService.getUserSignatureImage(signer.getUser());
                    } catch (IOException | TranscoderException e) {
                        throw new RuntimeException("Error getting signature image", e);
                    }
                })
                .collect(Collectors.toList());
    }

    private Document getFicheParapheurDocument(Long parapheurId) {
        ParapheurBo parapheur = parapheurRepository.findById(parapheurId).orElseThrow(() -> new RuntimeException("Parapheur not found"));

        Document ficheParapheur = new Document();
        ficheParapheur.setReference("Fiche Parapheur " + parapheur.getTitle());

        ficheParapheur.setDocumentCategorie(createOrGetFicheParapheurCategory());
        ficheParapheur.setDocumentType(getOrCreateFicheParapheurType());

        if (parapheur.getWorkflow() != null) {
            Workflow workflow = parapheur.getWorkflow();
            ficheParapheur.setEntiteAdministrative(workflow.getInitiateur().getEntiteAdministrative());
            ficheParapheur.setPlanClassement(getPlanClassementFichParapheur(ficheParapheur, workflow.getId()));
        }

        ficheParapheur.setId(null);
        return ficheParapheur;
    }

    private void saveFicheParapheur(ParapheurBo parapheur, Document signedFicheParaphDocument) {
        parapheur.setFichParaph(signedFicheParaphDocument);
        parapheurRepository.save(parapheur);
    }

    private void saveParapheurData(ParapheurBo parapheur, List<ParapheurCertificateData> dataEntries, List<ParapheurSignersData> signatureData) {
        parapheurSignersDataRepository.saveAll(signatureData);

        for (ParapheurCertificateData dataEntry : dataEntries) {
            Document entryDocumentd = documentDao.findByReferenceAndDeletedIsFalse(dataEntry.getDocumentKey());
            if (entryDocumentd != null) {
                dataEntry.setDocument(entryDocumentd);
            }
            parapheurCertificateDataRepository.save(dataEntry);
        }

        parapheur.setParapheurCertificateData(dataEntries);
        parapheur.setSignersData(signatureData);
        parapheurRepository.save(parapheur);
    }

    private PlanClassement getPlanClassementFichParapheur(Document doc, Long workflowId) {
        Workflow workflow = workflowRepository.findById(workflowId).orElse(null);

        if (workflow == null) {
            PlanClassement espace = planClassementRepository.findByLibelle("Espace de Travail");

            return planClassementService.createOrGetPlan("Fiche Parapheur", espace);
        } else {
            PlanClassementDto planClassement1 = new PlanClassementDto();
            PlanClassementDto planClassement2 = new PlanClassementDto();
            PlanClassementDto planClassement3 = new PlanClassementDto();

            List<PlanClassementDto> planClassementsList = new ArrayList<>();

            planClassement1.setLibelle(doc.getDocumentCategorie().getLibelle());
            planClassement2.setLibelle(workflow.getTitle());
            planClassement3.setLibelle("Fiche Parapheur");

            planClassementsList.add(planClassement1);
            planClassementsList.add(planClassement2);
            planClassementsList.add(planClassement3);

            return planClassementService.createYearlyAndMonthlyPlans(planClassementsList);
        }
    }

    private DocumentCategorie createOrGetFicheParapheurCategory() {
        DocumentCategorie ficheParapheurCategory = documentCategorieDao.findByLibelle("Fiche Parapheur");
        if (ficheParapheurCategory == null) {
            ficheParapheurCategory = new DocumentCategorie();
            ficheParapheurCategory.setLibelle("Fiche Parapheur");
            ficheParapheurCategory.setCode("Fiche Parapheur");
            documentCategorieDao.save(ficheParapheurCategory);
        }
        return ficheParapheurCategory;
    }

    private DocumentType getOrCreateFicheParapheurType() {
        DocumentType ficheParapheurType = documentTypeDao.findByLibelle("Fiche Parapheur");
        if (ficheParapheurType == null) {
            ficheParapheurType = new DocumentType();
            ficheParapheurType.setLibelle("Fiche Parapheur");
            documentTypeDao.save(ficheParapheurType);
        }
        return ficheParapheurType;
    }
}
