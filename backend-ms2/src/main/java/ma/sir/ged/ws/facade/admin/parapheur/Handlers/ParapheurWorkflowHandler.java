package ma.sir.ged.ws.facade.admin.parapheur.Handlers;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentStateAdminService;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.StepPreset;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.repository.StepRepository;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.workflow.service.sev.StepService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParapheurWorkflowHandler {

    @Autowired
    private ParapheurRepository parapheurRepository;

    @Autowired
    DocumentConverter converter;

    @Autowired
    StepService stepService;

    @Autowired
    StepRepository stepRepository;

    @Autowired
    private WorkflowRepository  workflowRepository;

    @Autowired
    private DocumentDao documentDao;

    @Autowired
    private DocumentStateAdminService documentStateAdminService;

    @Transactional
    public void handleParapheurWorkflow(Workflow workflow, Document oldDoc, DocumentDto newDoc) {
        converter.init(true);

        Long idStepPreset = getParapheurStepPresetId(workflow);
        if (idStepPreset == null) return;

//        Step step = getParapheurStep(workflow, idStepPreset);
//        if (step == null) return;
        List<Step> targetSteps = workflow.getStepList().stream()
                .filter(s -> s.getStepPreset().getActions().contains(ACTION.PARAPHER)
                        || s.getStepPreset().getActions().contains(ACTION.PRESIGNER)
                        || s.getStepPreset().getActions().contains(ACTION.SIGN)
                        || s.getStepPreset().getActions().contains(ACTION.APPROVE) && s.getStepPreset().getLevel() != 1)
                .collect(Collectors.toList());

        for (Step step : targetSteps) {
            List<Document> documentsStep = step.getDocuments();

            for (int i = 0; i < documentsStep.size(); i++) {
                Document doc = documentsStep.get(i);
                if (doc.getId().equals(oldDoc.getId())) {
                    documentsStep.set(i, converter.toItem(newDoc));
                    break;
                }
            }

            step.setDocuments(documentsStep);
        }

        stepRepository.saveAll(targetSteps);

        List<Document> documentsParapheur = getAllDocumentsByWorkflow(workflow.getId());

        boolean allParapheursSigned = documentsParapheur.stream().allMatch(doc -> Boolean.TRUE.equals(doc.getSigned()));
        //boolean sameDocument = compare(targetSteps.get(0).getDocuments(), documentsParapheur);

        if (allParapheursSigned) {
            List<Step> steps = workflow.getStepList();
            if (steps != null && !steps.isEmpty()) {
                Step lastStep = steps.stream()
                        .filter(s -> s.getStepPreset().getActions().contains(ACTION.SIGN))
                        .findFirst()
                        .orElse(null);
                stepService.sign(lastStep.getId(), lastStep.getDestinataires().get(0).getUtilisateur().getId());
            }
        }

        workflowRepository.save(workflow);
    }

    private @Nullable Step getParapheurStep(Workflow workflow, Long idStepPreset) {
        Step step = null;
        for (Step workflowStep : workflow.getStepList()) {
            if (workflowStep.getStepPreset().getId().equals(idStepPreset)) {
                step = workflowStep;
                break;
            }
        }
        return step;
    }

    private @Nullable Long getParapheurStepPresetId(Workflow workflow) {
        Long idStepPreset = null;
        for (StepPreset stepPreset : workflow.getWorkflowPreset().getStepPresetList()) {
            if (stepPreset.getActions().contains(ACTION.PARAPHER)) {
                idStepPreset = stepPreset.getId();
                break;
            }
        }
        return idStepPreset;
    }

    public List<Document> getAllDocumentsByWorkflow(Long workflowId) {
        List<ParapheurBo> parapheurBos = parapheurRepository.findByWorkflowId(workflowId);
        parapheurBos = parapheurBos.stream()
                .filter(paraph -> !paraph.getParapheurEtat().equals(ParapheurEtat.REJETE) && !paraph.getDeleted())
                .collect(Collectors.toList());
        List<Document> allDocuments = new ArrayList<>();

        for (ParapheurBo parapheurBo : parapheurBos) {
            if (parapheurBo.getDocuments() != null) {
                allDocuments.addAll(parapheurBo.getDocuments());
            }
        }

        return allDocuments;
    }

    public boolean compare(List<Document> workflowDocuments, List<Document> parapheurDocuments) {
        boolean sameDocument = false;
        if (parapheurDocuments != null && workflowDocuments != null) {
            if (new HashSet<>(parapheurDocuments).containsAll(workflowDocuments) && new HashSet<>(workflowDocuments).containsAll(parapheurDocuments)) {
                sameDocument = true;
            }
        }
        return sameDocument;
    }

    public void changeEtatParapheur(List<ParapheurBo> parapheurBos){
        if (parapheurBos.isEmpty()) {
            return;
        }

        List<Document> documentsToSave = new ArrayList<>();

        for (ParapheurBo parapheur : parapheurBos) {
            parapheur.setParapheurEtat(ParapheurEtat.REJETE);

            parapheur.getDocuments().forEach(doc -> {
                doc.setParaphed(false);
                DocumentState state = documentStateAdminService.findByLibelle("En attente");
                doc.setDocumentState(state);
                documentsToSave.add(doc);
            });
        }

        documentDao.saveAll(documentsToSave);
        parapheurRepository.saveAll(parapheurBos);
    }
}
