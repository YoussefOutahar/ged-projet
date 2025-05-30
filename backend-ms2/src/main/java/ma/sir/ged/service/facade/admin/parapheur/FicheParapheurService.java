package ma.sir.ged.service.facade.admin.parapheur;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.DataExtraction.DataExtractionService;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurSignersData;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurCertificateDataRepository;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurSignersDataRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.Feature.FeatureFlagService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FicheParapheurService {

    private final ParapheurRepository parapheurRepository;
    private final ParapheurSignersDataRepository parapheurSignersDataRepository;
    private final ParapheurCertificateDataRepository parapheurCertificateDataRepository;
    private final DocumentAdminService documentAdminService;
    private final WorkflowRepository workflowRepository;
    private final FeatureFlagService featureFlagService;

    private final DataExtractionProcessor dataExtractionProcessor;
    private final FicheParapheurHandler ficheParapheurHandler;
    private final DataExtractionService dataExtractionService;

    @Transactional
    @Async("threadPoolTaskExecutor")
    public CompletableFuture<Document> generateFicheParapheurWorkflowAsync(Long workflowId, Long currentStepId, Long parapheurId) {
        try {
            Workflow workflow = getWorkflowById(workflowId);
            List<Utilisateur> signers = getSignersFromWorkflow(workflow, currentStepId);
            ParapheurBo parapheur = getParapheurById(parapheurId);

            Document signedFicheParaphDocument = generateFicheParapheur(parapheur.getId(), signers, false);

            return CompletableFuture.completedFuture(signedFicheParaphDocument);
        } catch (Exception e) {
            log.error("Error generating fiche parapheur for workflow", e);
            return CompletableFuture.completedFuture(null);
        }
    }

    public Document generateFicheParapheur(Long parapheurId, List<Utilisateur> signers, boolean forceRegen) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        Workflow workflow = parapheur.getWorkflow();

        boolean usePieceJointe = workflow != null && featureFlagService.isActive("useWorkflowPieceJointe") && !workflow.getPiecesJointes().isEmpty();

        try {
            return usePieceJointe ? handleExcelExtractionScenario(parapheur, signers, workflow.getPiecesJointes(), forceRegen)
                    : handleDataExtractionScenario(parapheur, signers, forceRegen);
        } catch (Exception e) {
            log.error("Error generating fiche parapheur", e);
            return null;
        }
    }

    private Document handleDataExtractionScenario(ParapheurBo parapheur, List<Utilisateur> signers, boolean forceRegen) throws Exception {
        if (signers == null) signers = parapheur.getUtilisateurs();

        List<ParapheurCertificateData> dataEntries = dataExtractionProcessor.extractDataFromDocuments(parapheur, forceRegen);
        List<ParapheurSignersData> signatureData = createSignersData(signers);
        return ficheParapheurHandler.generateFicheParapheur(parapheur, dataEntries, signatureData);
    }

    public Document handleExcelExtractionScenario(ParapheurBo parapheur, List<Utilisateur> signers, List<Document> pieceJointes, boolean forceRegen) throws Exception {
        signers = (signers == null) ? parapheur.getUtilisateurs() : signers;
        List<ParapheurSignersData> signatureData = createSignersData(signers);

        List<byte[]> excelFiles = getExcelFilesFromDocuments(pieceJointes);
        List<ParapheurCertificateData> excelData = dataExtractionProcessor.extractDataFromDocumentsExcel(excelFiles);

        if (!dataExtractionService.isDataExtractionUp()) {
            log.error("Data extraction service is down, cannot extract data from documents");
            return null;
        }

        List<ParapheurCertificateData> extractedData = dataExtractionProcessor.extractDataFromDocuments(parapheur, forceRegen);
        List<ParapheurCertificateData> matchedData = matchCertificateData(excelData, extractedData, forceRegen);
        return ficheParapheurHandler.generateFicheParapheur(parapheur, matchedData, signatureData);
    }

    private List<ParapheurCertificateData> matchCertificateData(List<ParapheurCertificateData> excelData, List<ParapheurCertificateData> extractedData, boolean forceRegen) {
        List<ParapheurCertificateData> result = new ArrayList<>();

        for (ParapheurCertificateData extractedEntry : extractedData) {
            Optional<ParapheurCertificateData> matchingExcelEntry = findMatchingCertificate(excelData, extractedEntry);
            if (matchingExcelEntry.isPresent()) {
                ParapheurCertificateData excelEntry = matchingExcelEntry.get();
                if (forceRegen || !excelEntry.isUpdated()) {
                    result.add(extractedEntry);
                } else {
                    result.add(excelEntry);
                }
            } else {
                result.add(extractedEntry);
            }
        }

        return result;
    }

    private Optional<ParapheurCertificateData> findMatchingCertificate(List<ParapheurCertificateData> excelData, ParapheurCertificateData extractedEntry) {
        return excelData.stream()
                .filter(data -> matchRegistrationNumber(extractedEntry, data))
                .findFirst();
    }

    private boolean matchRegistrationNumber(ParapheurCertificateData extractedData, ParapheurCertificateData excelData) {
        if (extractedData.getNumeroDenregistrement() != null && excelData.getNumeroDenregistrement() != null) {
            try {
                String pattern = extractedData.getNumeroDenregistrement().replaceAll("[-/|\\\\]", "[-/|\\\\\\\\]");
                return Pattern.matches(pattern, excelData.getNumeroDenregistrement());
            } catch (PatternSyntaxException e) {
                log.error("Invalid regex pattern for registration number: {}", extractedData.getNumeroDenregistrement(), e);
            }
        }
        return false;
    }

    private List<byte[]> getExcelFilesFromDocuments(List<Document> documents) {
        return documents.stream()
                .map(doc -> {
                    try {
                        return documentAdminService.downloadFileFromService(doc.getId(), "");
                    } catch (Exception e) {
                        log.error("Error downloading file: {}", doc.getId(), e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<ParapheurSignersData> createSignersData(List<Utilisateur> signers) {
        return signers.stream()
                .map(user -> {
                    ParapheurSignersData signersData = new ParapheurSignersData();
                    signersData.setName(extractSignatureData(user));
                    signersData.setUser(user);
                    parapheurSignersDataRepository.save(signersData);
                    return signersData;
                })
                .collect(Collectors.toList());
    }

    // ======================== CRUD ========================

    @Transactional(readOnly = true)
    public List<ParapheurCertificateData> getParapheurCertificateData(Long parapheurId) {
        List<ParapheurCertificateData> certificateDataList = getParapheurById(parapheurId).getParapheurCertificateData();
        certificateDataList.sort(Comparator.comparing(ParapheurCertificateData::getId).reversed());
        return certificateDataList;
    }

    @Transactional(readOnly = true)
    public List<ParapheurSignersData> getParapheurSignersData(Long parapheurId) {
        List<ParapheurSignersData> signersDataList = getParapheurById(parapheurId).getSignersData();
        signersDataList.sort(Comparator.comparing(ParapheurSignersData::getId).reversed());
        return signersDataList;
    }

    @Transactional
    public ParapheurCertificateData addParapheurCertificateData(Long parapheurId, ParapheurCertificateData certificateData) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        parapheurCertificateDataRepository.save(certificateData);
        parapheur.getParapheurCertificateData().add(certificateData);
        parapheurRepository.save(parapheur);
        return certificateData;
    }

    @Transactional
    public ParapheurSignersData addParapheurSignersData(Long parapheurId, ParapheurSignersData signerData) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        parapheurSignersDataRepository.save(signerData);
        parapheur.getSignersData().add(signerData);
        parapheurRepository.save(parapheur);
        return signerData;
    }

    @Transactional
    public ParapheurCertificateData updateParapheurCertificateData(Long parapheurId, Long certificateDataId, ParapheurCertificateData updatedData) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        ParapheurCertificateData existingData = getParapheurCertificateData(parapheur, certificateDataId);
        updateCertificateDataFields(existingData, updatedData);
        return parapheurCertificateDataRepository.save(existingData);
    }

    @Transactional
    public ParapheurSignersData updateParapheurSignersData(Long parapheurId, Long signersDataId, ParapheurSignersData updatedData) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        ParapheurSignersData existingData = getParapheurSignersData(parapheur, signersDataId);
        existingData.setName(updatedData.getName());
        existingData.setUser(updatedData.getUser());
        return parapheurSignersDataRepository.save(existingData);
    }

    @Transactional
    public void deleteParapheurCertificateData(Long parapheurId, Long certificateDataId) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        ParapheurCertificateData existingData = getParapheurCertificateData(parapheur, certificateDataId);
        parapheur.getParapheurCertificateData().remove(existingData);
        parapheurCertificateDataRepository.delete(existingData);
        parapheurRepository.save(parapheur);
    }

    @Transactional
    public void deleteParapheurSignersData(Long parapheurId, Long signersDataId) {
        ParapheurBo parapheur = getParapheurById(parapheurId);
        ParapheurSignersData existingData = getParapheurSignersData(parapheur, signersDataId);
        parapheur.getSignersData().remove(existingData);
        parapheurSignersDataRepository.delete(existingData);
    }

    // ======================================================

    private ParapheurBo getParapheurById(Long parapheurId) {
        return parapheurRepository.findById(parapheurId)
                .orElseThrow(() -> new RessourceNotFoundException("Parapheur not found"));
    }

    private Workflow getWorkflowById(Long workflowId) {
        return workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RessourceNotFoundException("Workflow not found"));
    }

    private List<Utilisateur> getSignersFromWorkflow(Workflow workflow, Long currentStepId) {
        List<Utilisateur> signers = new ArrayList<>();
        Set<String> processedStepNames = new HashSet<>();

        List<Step> sortedSteps = workflow.getStepList().stream()
                .sorted(Comparator.comparingInt(step -> step.getStepPreset().getLevel()))
                .collect(Collectors.toList());

        for (Step step : sortedSteps) {
            String stepName = step.getStepPreset().getTitle();

            if (processedStepNames.contains(stepName) && !step.getId().equals(currentStepId)) continue;
            if (processedStepNames.contains(stepName) && step.getId().equals(currentStepId)) break;

            processedStepNames.add(stepName);

            for (UserDestinataire userDestinataire : step.getStepPreset().getDestinataires()) {
                if (userDestinataire.isShouldSign()) {
                    signers.add(userDestinataire.getUtilisateur());
                }
            }

            if (step.getId().equals(currentStepId)) break;
        }
        return signers;
    }

    private void updateCertificateDataFields(ParapheurCertificateData existingData, ParapheurCertificateData updatedData) {
        existingData.setDocument(updatedData.getDocument());
        existingData.setDesignation(updatedData.getDesignation());
        existingData.setCategorie(updatedData.getCategorie());
        existingData.setClasseDeRisque(updatedData.getClasseDeRisque());
        existingData.setCodeCE(updatedData.getCodeCE());
        existingData.setNomDeMarque(updatedData.getNomDeMarque());
        existingData.setEtablissementDeFabrication(updatedData.getEtablissementDeFabrication());
        existingData.setEtablissementMarocain(updatedData.getEtablissementMarocain());
        existingData.setSousTraitant(updatedData.getSousTraitant());
        existingData.setNumeroDeReference(updatedData.getNumeroDeReference());
        existingData.setNumeroDenregistrement(updatedData.getNumeroDenregistrement());
        existingData.setPresentation(updatedData.getPresentation());

        existingData.setUpdated(true);
    }

    private String extractSignatureData(Utilisateur user) {
        String fullName = user != null ? user.getNom() + " " + user.getPrenom() : " ";
        String gender = user != null && user.getGender() != null ? user.getGender().getLibelle() : " ";
        String entityName = user != null && user.getEntiteAdministrative() != null ? user.getEntiteAdministrative().getLibelle() : " ";
        return gender + " " + fullName + " - " + entityName;
    }

    private ParapheurCertificateData getParapheurCertificateData(ParapheurBo parapheur, Long certificateDataId) {
        return parapheurCertificateDataRepository.findById(certificateDataId)
                .filter(data -> parapheur.getParapheurCertificateData().contains(data))
                .orElseThrow(() -> new RessourceNotFoundException("Certificate data not found or does not belong to this parapheur"));
    }

    private ParapheurSignersData getParapheurSignersData(ParapheurBo parapheur, Long signersDataId) {
        return parapheurSignersDataRepository.findById(signersDataId)
                .filter(data -> parapheur.getSignersData().contains(data))
                .orElseThrow(() -> new RessourceNotFoundException("Signers data not found or does not belong to this parapheur"));
    }
}