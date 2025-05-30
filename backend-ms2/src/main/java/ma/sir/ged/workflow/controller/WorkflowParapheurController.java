package ma.sir.ged.workflow.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.mapper.WorkflowMapper;
import ma.sir.ged.workflow.service.imp.WorkflowParapheurKpiService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.parapheur.ParapheurConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.ParapheurDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/workflow-parapheur-kpi")
public class WorkflowParapheurController {
    private final WorkflowParapheurKpiService workflowParapheurKpiService;

    private final DocumentConverter documentConverter;
    private final WorkflowMapper workflowMapper;
    private final ParapheurConverter parapheurConverter;

    @GetMapping("/search")
    public Map<String, Page<DocumentDto>> search(@RequestParam String keyword, Pageable pageable) {
        Map<String, Page<Document>> groupedDocuments = workflowParapheurKpiService.search(keyword, pageable);

        Map<String, Page<DocumentDto>> result = new HashMap<>();
        for (Map.Entry<String, Page<Document>> entry : groupedDocuments.entrySet()) {
            if (entry.getValue() != null) {
                result.put(entry.getKey(), entry.getValue().map(documentConverter::toDto));
            } else {
                result.put(entry.getKey(), new PageImpl<>(Collections.emptyList()));
            }
        }

        return result;
    }

    @GetMapping("/{documentId}/workflow")
    public List<WorkflowDTO> getWorkflow(@PathVariable Long documentId) {
        Optional<List<Workflow>> workflows = workflowParapheurKpiService.getWorkflowForDocument(documentId);

        return workflows.map(workflowList -> workflowList.stream()
                .map(workflowMapper::workflowtoDTO)
                .collect(Collectors.toList())).orElse(Collections.emptyList());
    }

    @GetMapping("/{documentId}/parapheurs")
    public List<ParapheurDto> getParapheurs(@PathVariable Long documentId) {
        List<ParapheurBo> parapheurs = workflowParapheurKpiService.getParapheursForDocument(documentId);

        return parapheurs.stream()
                .map(parapheurConverter::convertToParapheurDto)
                .collect(Collectors.toList());
    }
}
