package ma.sir.ged.workflow.service.imp;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.repository.WorkflowRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class WorkflowParapheurKpiService {

    private final ParapheurRepository parapheurRepository;
    private final WorkflowRepository workflowRepository;
    private final DocumentDao documentDao;

    public Map<String, Page<Document>> search(String keyword, Pageable pageable) {
        Map<String, Page<Document>> groupedDocuments = new HashMap<>();

        if (keyword == null || keyword.isEmpty()) {
            return groupedDocuments;
        }

        Page<Document> byReference = documentDao.findByReferenceContaining(keyword, pageable);
        groupedDocuments.put("Reference", byReference);

        Page<Document> bySignatureCode = documentDao.findByDocumentSignatureCodeContaining(keyword, pageable);
        groupedDocuments.put("Signature Code", bySignatureCode);

        Page<Document> byIndexElement = documentDao.findByDocumentIndexElementValueContaining(keyword, pageable);
        groupedDocuments.put("Index Element", byIndexElement);

        List<Workflow> workflows = workflowRepository.findByTitleContaining(keyword);

        Set<Document> uniqueDocuments = new HashSet<>();

        for (Workflow workflow : workflows) {
            if (workflow.getDocuments() != null) {
                uniqueDocuments.addAll(workflow.getDocuments());
            }
            if (workflow.getStepList() != null) {
                for (Step step : workflow.getStepList()) {
                    if (step.getDocuments() != null) {
                        uniqueDocuments.addAll(step.getDocuments());
                    }
                }
            }
        }

        List<Document> documentList = new ArrayList<>(uniqueDocuments);
        documentList.removeIf(Document::getDeleted);

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), documentList.size());
        if (start > end) {
            start = 0;
            end = 0;
        }

        List<Document> pageContent = documentList.subList(start, end);

        Page<Document> byWorkflow = new PageImpl<>(pageContent, pageable, documentList.size());
        groupedDocuments.put("Comission", byWorkflow);


        Page<Document> byParapheur = documentDao.findByParapheurTitleContaining(keyword, pageable);
        groupedDocuments.put("Parapheur", byParapheur);

        Page<Document> byWorkflowStep = documentDao.findByStepTitleContaining(keyword, pageable);
        groupedDocuments.put("Comission Step", byWorkflowStep);

        groupedDocuments.entrySet().removeIf(entry -> entry.getValue().isEmpty());

        return groupedDocuments;
    }


    public Optional<List<Workflow>> getWorkflowForDocument(Long documentId) {

        List<Workflow> workflowsInMain = workflowRepository.findByDocumentId(documentId);

        List<Workflow> workflowsInSteps = workflowRepository.findByDocumentIdInSteps(documentId);

        List<Workflow> workflows = workflowRepository.findByDocumentIdInWorkflowOrSteps(documentId);

        if (!workflows.isEmpty()) {
            return Optional.of(workflows);
        } else if (!workflowsInMain.isEmpty()) {
            return Optional.of(workflowsInMain);
        } else if (!workflowsInSteps.isEmpty()) {
            return Optional.of(workflowsInSteps);
        }

        return Optional.empty();
    }

    public List<ParapheurBo> getParapheursForDocument(Long documentId) {
        return parapheurRepository.findByDocumentsId(documentId);
    }
}
