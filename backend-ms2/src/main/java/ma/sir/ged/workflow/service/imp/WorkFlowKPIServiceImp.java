package ma.sir.ged.workflow.service.imp;

import io.swagger.v3.oas.annotations.servers.Server;
import lombok.Data;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.workflow.DTO.*;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.UserDestinataire;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.Flag;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.workflow.repository.WFPresetRepository;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import ma.sir.ged.workflow.service.sev.WorkFlowKPIService;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Server
@Data
@Component
public class WorkFlowKPIServiceImp implements WorkFlowKPIService {

    public final WorkflowRepository workflowRepository;
    @Override
    public Long count() {
        return workflowRepository.count();
    }

    @Override
    public Long countWorkflowsByStatus(WorkflowStatus status) {return workflowRepository.countWorkflowsByStatus(status);}

    @Override
    public Long countWorkflowsByStatusAndInitiateur(WorkflowStatus status, Long initiateurId) {return workflowRepository.countWorkflowsByStatusAndInitiateur(status, initiateurId);}

    @Override
    public Long countWorkflowsByFlag(Flag flag) {
        return workflowRepository.countWorkflowsByFlag(flag);
    }

    @Override
    public Long findWorkflowByInitiateurId(Long id){
        return (long) workflowRepository.findWorkflowByInitiateurId(id).size();
    }

    @Override
    public Long countWorkflowsByFlagAndInitiateur(Long id, Flag flag) {
        return (long) workflowRepository.findWorkflowByInitiateurIdAndAndFlag(id, flag).size();
    }

    @Override
    public List<SignedCertPerWorkflowDTO> countSignedCertPerWorkflow() {
        List<Workflow> workflows = workflowRepository.findAllNotClotureAndHasSignAction(WorkflowStatus.Annulled, ACTION.SIGN);
        List<SignedCertPerWorkflowDTO> res = new ArrayList<>();
        workflows.forEach(workflow -> {
            Step step = workflow.getStepList().stream().filter(step1 -> step1.getStepPreset().getActions().contains(ACTION.PARAPHER)).findFirst().orElse(null);
            int totalCertif;
            int countSignedCertif;
            if (Objects.nonNull(step)) {
                totalCertif = ListUtil.emptyIfNull(step.getDocuments()).size();
                countSignedCertif = ListUtil.emptyIfNull(step.getDocuments().stream().filter(Document::getSigned).collect(Collectors.toList())).size();
            } else {
                totalCertif = ListUtil.emptyIfNull(workflow.getDocuments()).size();
                countSignedCertif = ListUtil.emptyIfNull(workflow.getDocuments().stream().filter(Document::getSigned).collect(Collectors.toList())).size();
            }
            if(totalCertif > 0){
                res.add(new SignedCertPerWorkflowDTO(workflow.getTitle(), countSignedCertif, totalCertif));
            }
        });

        return res;
    }

    @Override
    public List<WorkflowWithDurationDto> extraireDureesFinWorkflowParPreset(WorkflowPreset workflowPreset) {
        List<Workflow> workflows = workflowRepository.findWorkflowByWorkflowPresetAndStatus(workflowPreset, WorkflowStatus.CLOSED).stream()
                .sorted(Comparator.comparing(Workflow::getId).reversed())
                .limit(6)
                .collect(Collectors.toList());;
        return workflows.stream()
                .map(workflow -> {
                    if (workflow.getCreatedOn() == null) {
                        return new WorkflowWithDurationDto(workflow.getId(), workflow.getTitle(), "0");
                    }

                    Step derniereStepValidee = workflow.getStepList().stream()
                            .filter(step -> step.getValidateDate() != null)  // Filtrer par les étapes validées
                            .max(Comparator.comparing(Step::getValidateDate))
                            .orElse(null);

                    if (derniereStepValidee == null) {
                        return new WorkflowWithDurationDto(workflow.getId(), workflow.getTitle(), "0");
                    }

                    Duration dureeTotale  = Duration.between(workflow.getCreatedOn(), derniereStepValidee.getValidateDate());
                    long dureeEnJours = dureeTotale.toDays();
                    long dureeEnHeures = dureeTotale.toHours();
                    long dureeEnMinutes = dureeTotale.toMinutes();

                    String dureeFormatted;

                    // Déterminer la bonne unité de temps pour la durée
                    if (dureeEnJours > 0) {
                        dureeFormatted = dureeEnJours + " jour(s)";
                    } else if (dureeEnHeures > 0) {
                        dureeFormatted = dureeEnHeures + " heure(s)";
                    } else {
                        dureeFormatted = dureeEnMinutes + " minute(s)";
                    }
                    return new WorkflowWithDurationDto(workflow.getId(), workflow.getTitle(), dureeFormatted);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkflowStepKPIDto> extraireTop3StepsLentesParWorkflowPreset(WorkflowPreset workflowPreset) {
        List<Workflow> workflows = workflowRepository.findWorkflowByWorkflowPresetAndStatus(workflowPreset, WorkflowStatus.CLOSED).stream()
                .sorted(Comparator.comparing(Workflow::getId).reversed())
                .limit(5)
                .collect(Collectors.toList());;
        return workflows.stream()
                .flatMap(workflow -> {
                    List<Step> steps = workflow.getStepList();

                    if (steps.isEmpty()) {
                        return Stream.empty();
                    }

                    List<StepDurationDTO> stepDurations = calculerDurationsSteps(workflow, steps);

                    List<StepDurationDTO> top3Lentes = stepDurations.stream()
                            .sorted(Comparator.comparing(StepDurationDTO::getDureeReelle).reversed())
                            .limit(3)
                            .collect(Collectors.toList());

                    return top3Lentes.stream();
                })
                .map(stepDuration -> creerWorkflowStepKPI(stepDuration))
                .filter(stepDuration -> stepDuration.getEvaluation().equals("Lente"))
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkflowStepKPIDto> extraireTop3StepsRapidesParWorkflowPreset(WorkflowPreset workflowPreset) {
        List<Workflow> workflows = workflowRepository.findWorkflowByWorkflowPresetAndStatus(workflowPreset, WorkflowStatus.CLOSED).stream()
                .sorted(Comparator.comparing(Workflow::getId).reversed())
                .limit(5)
                .collect(Collectors.toList());;
        return workflows.stream()
                .flatMap(workflow -> {
                    List<Step> steps = workflow.getStepList();

                    if (steps.isEmpty()) {
                        return Stream.empty();
                    }

                    List<StepDurationDTO> stepDurations = calculerDurationsSteps(workflow, steps);

                    List<StepDurationDTO> top3Lentes = stepDurations.stream()
                            .sorted(Comparator.comparing(StepDurationDTO::getDureeReelle))
                            .limit(3)
                            .collect(Collectors.toList());

                    return top3Lentes.stream();
                })
                .map(stepDuration -> creerWorkflowStepKPI(stepDuration))
                .filter(stepDuration -> stepDuration.getEvaluation().equals("Rapide"))
                .collect(Collectors.toList());
    }

    private List<StepDurationDTO> calculerDurationsSteps(Workflow workflow, List<Step> steps) {
        List<StepDurationDTO> stepDurations = new ArrayList<>();
        Step previousStep = null;

        for (Step step : steps) {
            if (step.getValidateDate() == null) {
                continue;
            }

            Duration dureeReelle;
            if (previousStep == null) {
                dureeReelle = Duration.between(workflow.getCreatedOn(), step.getValidateDate());
            } else {
                dureeReelle = Duration.between(previousStep.getValidateDate(), step.getValidateDate());
            }

//            Duration dureePrevue = Duration.ofDays(step.getStepPreset().getDuration());
            Long duration = step.getStepPreset().getDuration();
            Duration dureePrevue;
            if (duration != null) {
                dureePrevue = Duration.ofDays(duration);
            } else {
                dureePrevue = Duration.ofDays(0);
            }

            stepDurations.add(new StepDurationDTO(step, dureeReelle, dureePrevue));

            previousStep = step;
        }

        return stepDurations;
    }

    private WorkflowStepKPIDto creerWorkflowStepKPI(StepDurationDTO stepDuration) {
        return new WorkflowStepKPIDto(
                stepDuration.getStep().getWorkflow().getTitle(),
                stepDuration.getStep().getStepPreset().getTitle(),
                stepDuration.getDureeReelle().toDays() > 0
                        ? stepDuration.getDureeReelle().toDays() + " jour(s)"
                        : stepDuration.getDureeReelle().toHours() > 0
                        ? stepDuration.getDureeReelle().toHours() + " heure(s)"
                        : stepDuration.getDureeReelle().toMinutes() + " minute(s)",
                stepDuration.getDureeReelle().compareTo(stepDuration.getDureePrevue()) > 0
                        ? "Lente"
                        : "Rapide"
        );
    }

    private WorkflowKPIDto createWorkflowKPIDto(Workflow workflow) {
        WorkflowKPIDto workflowKPIDto = new WorkflowKPIDto();

        workflowKPIDto.setTitle(workflow.getTitle());
        workflowKPIDto.setNombreTotal(workflow.getDocumentCount());
        workflowKPIDto.setStatus(workflow.getStatus());

        List<Document> stepParapherDocuments = Objects.requireNonNull(workflow.getStepList().stream()
                .filter(step -> step.getStepPreset().getLevel() == 2)
                .findFirst()
                .orElse(null)).getDocuments();

        long nombreEvaluateurs = workflow.getStepList().stream()
                .filter(step -> step.getStepPreset().getLevel() == 1)
                .map(Step::getStepPreset)
                .flatMap(stepPreset -> stepPreset.getDestinataires().stream())
                .distinct()
                .count();
        workflowKPIDto.setNombreEvaluateur(nombreEvaluateurs);

        int nombreCertifValide = (int) stepParapherDocuments.stream()
                .filter(doc -> Objects.nonNull(doc.getDocumentState()) && (doc.getDocumentState().getLibelle().equals("Validé") || doc.getDocumentState().getLibelle().equals("En Cours") || doc.getDocumentState().getLibelle().equals("En Attente")))
                .count();
        workflowKPIDto.setNombreCertifEnCours(nombreCertifValide);

        int nombreCertifRejete = (int) stepParapherDocuments.stream()
                .filter(doc -> Objects.nonNull(doc.getDocumentState()) &&  doc.getDocumentState().getLibelle().equals("Rejeté"))
                .count();
        workflowKPIDto.setNombreCertifRejete(nombreCertifRejete);

        int nombreCertifSigne = (int) stepParapherDocuments.stream()
                .filter(doc -> Objects.nonNull(doc.getDocumentState()) &&  doc.getDocumentState().getLibelle().equals("Signé"))
                .count();
        workflowKPIDto.setNombreCertifSigne(nombreCertifSigne);

        int reste = workflow.getDocumentCount() - stepParapherDocuments.size();
        workflowKPIDto.setReste(reste);

        List<EvaluateurCertifCountDTO> nombreCertifParEvaluateur = workflow.getStepList().stream()
                .filter(step -> step.getStepPreset().getLevel() == 1)
                .flatMap(step -> step.getStepPreset().getDestinataires().stream())
                .map(UserDestinataire::getUtilisateur)
                .collect(Collectors.groupingBy(
                        utilisateur -> utilisateur,
                        Collectors.summingInt(utilisateur -> getCertifCountForEvaluateurInStepLevel(utilisateur, workflow, 1)) // compter les certificats de level 1
                ))
                .entrySet().stream()
                .map(entry -> new EvaluateurCertifCountDTO(entry.getKey().getNom()+" "+entry.getKey().getPrenom(), entry.getValue()))
                .collect(Collectors.toList());
        workflowKPIDto.setNombreCertifParEvaluateur(nombreCertifParEvaluateur);
        return workflowKPIDto;
    }
    private int getCertifCountForEvaluateurInStepLevel(Utilisateur evaluateur, Workflow workflow, int level) {
        return workflow.getStepList().stream()
                .filter(step -> step.getStepPreset().getLevel() == level)
                .filter(step -> step.getStepPreset().getDestinataires().stream()
                        .anyMatch(destinataire -> destinataire.getUtilisateur().equals(evaluateur)))
                .mapToInt(step -> (int) step.getDocumentsActions().stream()
                        .filter(documentAction ->Objects.nonNull(documentAction.getDocumentState()) && !documentAction.getDocumentState().getLibelle().equals("Rejeté"))
                        .count())
                .sum();
    }
    @Override
    public List<WorkflowKPIDto> getWorkflowKPIDto(){
        List<WorkflowKPIDto> workflowKPIDtos = new ArrayList<>();
        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        List<Workflow> workflows = workflowRepository.findWorkflowByStatusIn(Arrays.asList(WorkflowStatus.OPEN, WorkflowStatus.REOPENED, WorkflowStatus.CLOSED), sort);
        int toIndex = Math.min(workflows.size(), 10);
        List<Workflow> limitedWorkflows = workflows.subList(0, toIndex);
        if(limitedWorkflows.isEmpty()) {
            return null;
        }
        for (Workflow workflow : limitedWorkflows) {
            workflowKPIDtos.add(createWorkflowKPIDto(workflow));
        }

        return workflowKPIDtos;
    }

    @Override
    public List<WorkflowKPIDto> getWorkflowKPIDtoByTitle(String title) {
        List<WorkflowKPIDto> workflowKPIDtos = new ArrayList<>();

        List<Workflow> workflows = workflowRepository.findByTitleContaining(title);
        for (Workflow workflow : workflows) {
            workflowKPIDtos.add(createWorkflowKPIDto(workflow));
        }

        return workflowKPIDtos;
    }
}
