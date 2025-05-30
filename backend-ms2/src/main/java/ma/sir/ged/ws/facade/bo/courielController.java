package ma.sir.ged.ws.facade.bo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.Email.EmailService;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.enums.TypeCourriel;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.service.facade.bo.CourrielHistoryService;
import ma.sir.ged.service.facade.bo.CourrielService;
import ma.sir.ged.service.impl.admin.doc.DocumentAdminServiceImpl;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielConverter;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.converter.EntiteAdministrativeConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courriels")
public class courielController {
    @Autowired
    private CourrielService courrielService;

    @Autowired
    private CourrielHistoryService courrielHistoryService;

    @Autowired
    private CourrielConverter courrielConverter;

    @Autowired
    private DocumentAdminServiceImpl documentService;

    @Autowired
    private DocumentConverter documentConverter;

    @Autowired
    private EntiteAdministrativeDao entiteAdministrativeDao;

    @Autowired
    private EntiteAdministrativeConverter entiteAdministrativeConverter;

    @Autowired
    private EmailService emailService;

    @Value("${courrielBO.presidentCode}")
    private String presidentCode;

    @Value("${courrielBO.cabinetCode}")
    private String cabinetCode;

    @GetMapping
    public List<CourrielDto> getAllCourrielsNotDeleted() {
        List<CourrielDto> courrielsNotDeleted = courrielService.getAllCourrielsNotDeleted();
       return courrielsNotDeleted;
    }

    @GetMapping("/{id}")
    public CourrielDto getCourrielById(@PathVariable Long id) {
        CourrielBo courriel = courrielService.getCourrielById(id);
        return courrielConverter.toDto(courriel);
    }

    @GetMapping("/peres")
    public Page<CourrielDto> getAllCourrielsPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        Page<CourrielDto> courriels = courrielService.getAllCourrielsPere(page, size);
        return courriels;
    }

    @GetMapping("/plan-classement/{id}")
    public Page<CourrielDto> getCourrielByPlanClassement(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
            ) {
        return courrielService.getAllCourrielsByPlanClassement(id, page, size);
    }

    @GetMapping("responsable/{responsableId}/peres")
    public Page<CourrielDto> getCourrielPereByResponsable(
            @PathVariable Long responsableId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        return courrielService.getAllCourrielsPereByResponsable(responsableId, page, size);
    }

    @GetMapping("responsable/{responsableId}/plan-classement/{planClassementId}")
    public Page<CourrielDto> getCourrielByResponsable(
            @PathVariable Long responsableId,
            @PathVariable Long planClassementId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        return courrielService.getAllCourrielsByResponsableAndPlanClassement(planClassementId,responsableId, page, size);
    }

    @GetMapping("near-deadline")
    public Page<CourrielDto> getCourrielNearDeadline(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        return courrielService.getAllCourrielsNearDeadline(page, size);
    }

    @GetMapping("needing-attention/{intervenantId}")
    public Page<CourrielDto> getCourrielNeedingAttention(
            @PathVariable Long intervenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        return courrielService.getAllCourrielsNeedingAttention(intervenantId, page, size);
    }

    @GetMapping("search")
    public Page<CourrielDto> getCourrielsBySearchKeyWord(
            @RequestParam String searchKeyWord,
            @RequestParam(defaultValue = "0") long intervenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        return courrielService.getCourrielsBySearchKeyWord(searchKeyWord, page, size, intervenantId);
    }
    @GetMapping("filter")
    public List<CourrielBo> getFilteredCourriers(
            @RequestParam(required = false) TypeCourriel type,
            @RequestParam(required = false) boolean all,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime today) {

        return courrielService.filtrerCourriers(type, dateDebut, dateFin, today, all);
    }
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public CourrielDto createCourriel(
            @Nullable @RequestPart("courrielDto") String courrielDtoStr,
            @Nullable @RequestPart("files") List<MultipartFile> files,
            @Nullable @RequestPart("id") String idStr,
            @Nullable @RequestPart("createCourrielOperationType") String createCourrielOperationType
            ) {

        assert idStr != null;
        Long id = Long.parseLong(idStr);
        CourrielDto courrielDto = getCourrielDtoFromRequestPart(courrielDtoStr);

        assert courrielDto != null;
        CourrielBo courriel = courrielConverter.toEntity(courrielDto);

        courrielService.handleCourriel(id, courriel, files, createCourrielOperationType);
        courrielService.sendToWorkflow(courrielDto, courriel.getId());
        return courrielConverter.toDto(courriel);
    }

    @PutMapping("/{id}")
    public CourrielDto updateCourriel(@PathVariable("id") Long id, @RequestBody CourrielDto courrielDto) {
        return courrielService.updateCourriel(id, courrielDto,true);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourriel(@PathVariable Long id) {
        courrielService.deleteCourriel(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Nullable
    private static CourrielDto getCourrielDtoFromRequestPart(String courrielDtoStr) {
        ObjectMapper objectMapper = new ObjectMapper();
        CourrielDto courrielDto = null;

        try {
            courrielDto = objectMapper.readValue(courrielDtoStr, CourrielDto.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return courrielDto;
    }

    @GetMapping("/{courrielId}/documents")
    public ResponseEntity<List<DocumentDto>> getDocumentsOfCourriel(@PathVariable Long courrielId) {
        List<Document> documents = courrielService.getDocumentsOfCourriel(courrielId);
        return new ResponseEntity<>(documentConverter.toDto(documents), HttpStatus.OK);
    }
   @GetMapping("/workflow/{workflowId}")
    public ResponseEntity<List<CourrielDto>> getCourrielsByWorkflowId(@PathVariable Long workflowId) {
        List<CourrielDto> courriels = courrielService.getCourrielsByWorkflowId(workflowId);
        return new ResponseEntity<>(courriels, HttpStatus.OK);
    }

    @PutMapping
    @RequestMapping(value = "/{id}/add-documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CourrielDto addFileToCourriel(@PathVariable Long id,@RequestPart List<MultipartFile> files,@RequestPart String documentDtos){
        List<DocumentDto> documentDtosList = getDocumentDtosFromRequestPart(documentDtos);
        return courrielService.addDocsToCourriel(id, documentDtosList,files);
    }

    @PutMapping
    @RequestMapping("/{id}/add-documents/existing-files")
    public CourrielDto addExistingFileToCourriel(@PathVariable Long id,@RequestBody List<DocumentDto> documentDtos){
        return courrielService.addExistingDocsToCourriel(id, documentDtos);
    }

    @Nullable
    private static List<DocumentDto> getDocumentDtosFromRequestPart(String documentDtos) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<DocumentDto> documentDtosList = null;

        try {
            CollectionType typeRef = objectMapper.getTypeFactory().constructCollectionType(List.class, DocumentDto.class);
            documentDtosList = objectMapper.readValue(documentDtos, typeRef);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return documentDtosList;
    }


    @PutMapping
    @RequestMapping(value = "/{id}/delete-documents/{fileId}")
    public CourrielDto deleteFileFromCourriel(@PathVariable Long id, @PathVariable Long fileId){
        return courrielService.deleteDocumentFromCourriel(id, fileId);
    }

    @GetMapping
    @RequestMapping(value = "/get-president")
    public EntiteAdministrativeDto getPresidentCourriel(){
        EntiteAdministrative president = entiteAdministrativeDao.findByCode(presidentCode);
        return entiteAdministrativeConverter.toDto(president);
    }

    @GetMapping
    @RequestMapping(value = "/get-cabinet")
    public EntiteAdministrativeDto getCabinetCourriel(){
        EntiteAdministrative cabinet = entiteAdministrativeDao.findByCode(cabinetCode);
        return entiteAdministrativeConverter.toDto(cabinet);
    }
}
