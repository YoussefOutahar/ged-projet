package ma.sir.ged.ws.facade.bo;

import ma.sir.ged.WebSocket.UseCases.NotificationCourriel;
import ma.sir.ged.bean.core.bureauOrdre.ActionsBo;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.service.facade.bo.*;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.bean.core.bureauOrdre.ActionsBo;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.service.facade.bo.CourrielService;
import ma.sir.ged.service.facade.bo.IntervenantsCourrielService;
import ma.sir.ged.service.facade.bo.actionService;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielConverter;
import ma.sir.ged.ws.converter.BureauOrdre.IntervenantsCourrielConverter;
import ma.sir.ged.ws.dto.AuditDto;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import ma.sir.ged.ws.dto.BureauOrdre.IntervenantsCourrielDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/courriel/intervenants-courriel")
public class IntervenantsCourrielController {

    @Autowired
    private IntervenantsCourrielService intervenantsCourrielService;

    @Autowired
    private CourrielConverter courrielConverter;

    @Autowired
    private DocumentConverter documentConverter;

    @Autowired
    private DocumentDao documentDao;

    @PutMapping
    @RequestMapping(value = "/add-intervenants/{courrielId}")
    public ResponseEntity<CourrielDto> addIntervenantsToCourriel(@PathVariable Long courrielId, @RequestBody IntervenantsCourrielDto intervenantDtos){
        CourrielDto courriel = intervenantsCourrielService.addIntervenantsToCourrier(courrielId, intervenantDtos);
        return new ResponseEntity<>(courriel, HttpStatus.OK);
    }


    @PutMapping
    @RequestMapping(value = "/update-intervenants/{courrielId}")
    public ResponseEntity<CourrielDto> updateIntervenantsToCourriel(@PathVariable Long courrielId, @RequestBody IntervenantsCourrielDto intervenantsCourrielDto){
        CourrielBo courriel = intervenantsCourrielService.updateIntervenants(courrielId, intervenantsCourrielDto);
        return new ResponseEntity<>(courrielConverter.toDto(courriel), HttpStatus.OK);
    }

    @PutMapping("/rejet/{courrielId}")
    public ResponseEntity<CourrielDto> rejetIntervention(@PathVariable Long courrielId, @RequestBody IntervenantsCourrielDto intervenantsCourrielDto) {
        CourrielDto courriel = intervenantsCourrielService.rejetIntervention(courrielId, intervenantsCourrielDto);
        return new ResponseEntity<>(courriel, HttpStatus.OK);
    }


     @GetMapping("/actions")
     public List<ActionsBo> getAllActions() {
        return intervenantsCourrielService.getAllActions();
    }

    @PostMapping("/actions")
    public ResponseEntity<String> createAction(@RequestBody String libelleAction) {
        return  new ResponseEntity<>(intervenantsCourrielService.createAction(libelleAction), HttpStatus.OK);
    }

    @DeleteMapping("/actions")
    public ResponseEntity deleteAction(@RequestBody String libelleAction) {
        intervenantsCourrielService.deleteAction(libelleAction);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("intervenants-pdf/{courrielId}")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long courrielId) {
        ByteArrayOutputStream pdfStream = intervenantsCourrielService.generatePdf(courrielId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=query_results.pdf");
        headers.setContentLength(pdfStream.size());

        return new ResponseEntity<>(pdfStream.toByteArray(), headers, HttpStatus.OK);
    }

    @PostMapping("/{intervenantId}/documents/{documentId}")
    public ResponseEntity<Void> addDocumentToIntervenant(@PathVariable Long intervenantId, @PathVariable Long documentId) {
        Document document = documentDao.findById(documentId).orElse(null);
        if (document != null) {
            intervenantsCourrielService.addDocumentToIntervenant(intervenantId, document);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{intervenantId}/documents/{documentId}")
    public ResponseEntity<Void> removeDocumentFromIntervenant(@PathVariable Long intervenantId, @PathVariable Long documentId) {
        intervenantsCourrielService.removeDocumentFromIntervenant(intervenantId, documentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{intervenantId}/documents")
    public ResponseEntity<List<DocumentDto>> getDocumentsOfIntervenant(@PathVariable Long intervenantId) {
        List<Document> documents = intervenantsCourrielService.getDocumentsOfIntervenant(intervenantId);
        return new ResponseEntity<>(documentConverter.toDto(documents), HttpStatus.OK);
    }
}
