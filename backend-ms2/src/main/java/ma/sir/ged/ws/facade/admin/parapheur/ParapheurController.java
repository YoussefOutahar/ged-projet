package ma.sir.ged.ws.facade.admin.parapheur;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;

import com.fasterxml.jackson.core.type.TypeReference;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurComment;
import ma.sir.ged.service.facade.admin.parapheur.ParapheurKpiService;
import ma.sir.ged.service.facade.admin.parapheur.ParapheurService;
import ma.sir.ged.workflow.service.imp.WorkflowParapheurKpiService;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.*;
import ma.sir.ged.ws.facade.admin.parapheur.Handlers.ParapheurWorkflowHandler;
import ma.sir.ged.ws.facade.admin.parapheur.Requests.CompareRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/api/parapheurs")
public class ParapheurController {
    @Autowired
    private ParapheurService parapheurService;

    @Autowired
    private ParapheurWorkflowHandler parapheurWorkflowHandler;

    @Autowired
    private DocumentConverter documentConverter;

    @Autowired
    private ParapheurKpiService parapheurKpiService;

    @GetMapping("/{id}")
    public ResponseEntity<ParapheurDto> getParapheurDTO(@PathVariable Long id) {
        return parapheurService.getParapheurDTO(id);
    }
    @GetMapping("/find-title")
    public ResponseEntity<List <ParapheurDto> > getParapheurDTO(@RequestParam String title) {
       return parapheurService.getParapheurDTOByTitle(title);
    }
    @GetMapping("/")
    public List<ParapheurDto> getAllParapheur() {
        return parapheurService.getAllParapheurDTO();
    }

    @PostMapping("/update/users/{workflowId}")
    public void addUsersToParapheurs(@PathVariable Long workflowId, @RequestBody List<UtilisateurDto> utilisateurs) {
         parapheurService.addUsersToParapheurs(workflowId, utilisateurs);
    }
    @PostMapping("/findDocumentsByParapheur/{id}")
    List<DocumentDto> findDocumentsByParapheur(@PathVariable("id")Long id){
        return parapheurService.findDocumentsByParapheur(id);
    }

    @GetMapping("/findFicheParaph/{id}")
    DocumentDto findFicheParaph(@PathVariable("id")Long id) {
        return parapheurService.getFicheParapheur(id);
    }


    @PostMapping("/")
    public ResponseEntity<ParapheurDto> createParapheur(@RequestParam("title")  String title,
                                                        @RequestParam("documents") String documentsJson,
                                                        @RequestParam("users") String usersJson) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<DocumentDto> documentDtos;
        List<UtilisateurDto> utilisateurDtos = Collections.emptyList();
        try {
            documentDtos = objectMapper.readValue(documentsJson, new TypeReference<List<DocumentDto>>() {});
            if (usersJson != null && !usersJson.isEmpty()) {
                utilisateurDtos = objectMapper.readValue(usersJson, new TypeReference<List<UtilisateurDto>>() {});
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return parapheurService.createParapheurDto(title,documentDtos,utilisateurDtos);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ParapheurDto> updateParapheur(@PathVariable Long id, @RequestBody ParapheurDto parapheurDto) {
        return parapheurService.updateParapheurDto(id,parapheurDto);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParapheur(@PathVariable Long id) {
        return parapheurService.deleteParapheur(id);
    }
    @PostMapping("/delete-parapheurs-list")
    public ResponseEntity<Void>  deleteParapheurList( @RequestBody List<Long> ids) {
        return parapheurService.deleteParapheurs(ids);
    }
    @Operation(summary = "Updates the specified file of document")
    @PostMapping(value = "/sign/{parapheurId}/{docId}")
    public DocumentDto signDocument(@PathVariable("parapheurId") Long parapheurId, @PathVariable("docId") Long docId) throws Exception {
        return parapheurService.signDocument(parapheurId, docId);
    }

    @PostMapping("/sign-all/{parapheurId}")
    public void signAllDocuments(@PathVariable("parapheurId") Long parapheurId) throws Exception {
        parapheurService.signDocumentsGroup(parapheurId);
    }

    @GetMapping("/is-parapheur-signed/{parapheurId}")
    public boolean isParapheurSigned(@PathVariable("parapheurId") Long parapheurId) {
        return parapheurService.isParapheurSigned(parapheurId);
    }

    @PostMapping("/compare")
    public ResponseEntity<Boolean> compareDocuments(
            @RequestBody CompareRequest compareRequest) {
        documentConverter.init(true);
        List<Document> stepDocuments = documentConverter.toItem(compareRequest.getStepDocuments());
        List<Document> parapheurDocuments = parapheurWorkflowHandler.getAllDocumentsByWorkflow(compareRequest.getWorkflowId());

        boolean sameDocument = parapheurWorkflowHandler.compare(stepDocuments, parapheurDocuments);
        return ResponseEntity.ok(sameDocument);
    }

    @GetMapping("/getPaginatedParapheurs")
    public Page<ParapheurDto> getPaginatedParapheurs(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "all") String filter,  // "all", "signed", "unsigned"
            @RequestParam(defaultValue = "") String searchKeyWord
            ) {
        return parapheurService.getPaginatedParapheurs(page, size, filter, searchKeyWord);
    }

    @GetMapping("/getParapheurComments")
    public List<ParapheurComment> getParapheurComments(@RequestParam Long parapheurId, @RequestParam Long currentUserId) {
        return parapheurService.getParapheurComments(parapheurId, currentUserId);
    }

    @PostMapping(value = "/{paraphId}/addParapheurComment", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ParapheurComment addParapheurComment(@RequestBody String content, @PathVariable Long paraphId, @RequestParam Long currentUserId) {
        return parapheurService.addParapheurComment(paraphId, content, currentUserId);
    }

    @PostMapping("/markCommentsAsSeen")
    public void markCommentsAsSeen(@RequestBody List<Long> commentIds, @RequestParam Long currentUserId) {
        parapheurService.markCommentsAsSeen(commentIds, currentUserId);
    }

    @GetMapping("/userCanSign/{parapheurId}")
    public boolean userCanSign(@PathVariable Long parapheurId) {
        return parapheurService.userCanSign(parapheurId);
    }

    @GetMapping("/kpi")
    public ResponseEntity<ParapheurKpiDto> calculateParapheurKpi() {
        return ResponseEntity.ok(parapheurKpiService.calculateParapheurKpi());
    }

    @GetMapping("/kpi/{title}")
    public ResponseEntity<List<ParapheurKpiDistinctDto>> calculateParapheurKpiByTitle(@PathVariable String title) {
        return ResponseEntity.ok(parapheurKpiService.calculateParapheurKpiByTitle(title));
    }

}
