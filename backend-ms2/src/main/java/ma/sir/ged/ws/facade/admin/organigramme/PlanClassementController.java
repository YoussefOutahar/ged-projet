package ma.sir.ged.ws.facade.admin.organigramme;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementRepository;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementService;
import ma.sir.ged.ws.converter.PlanClassementConverter;
import ma.sir.ged.ws.dto.PlanClassementDto;
import ma.sir.ged.ws.dto.summary.PlanClassementSummaryDto;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/admin/plan-classement")
public class PlanClassementController {

    @Autowired
    private PlanClassementService planClassementService;

    @Autowired
    private PlanClassementConverter planClassementConverter;

    @Autowired
    private PlanClassementRepository planClassementRepository;

    @PostMapping
    public ResponseEntity<PlanClassement> addPlanClassement(@RequestBody PlanClassementDto planClassementDTO) {
        PlanClassement planClassement = planClassementService.savePlanClassement(planClassementDTO);
        return new ResponseEntity<>(planClassement, HttpStatus.CREATED);
    }

    @PostMapping("/multiple")
    public ResponseEntity<PlanClassement> addPlanClassementMultiple(@RequestBody List<PlanClassementDto> planClassementDTOs) {
        PlanClassement planClassement = planClassementService.createYearlyAndMonthlyPlans(planClassementDTOs);
        return new ResponseEntity<>(planClassement, HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<PlanClassement>> getAllPlans() {
        List<PlanClassement> plans = planClassementService.getAllPlans();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }
    @GetMapping("/{libelle}/{parentId}")
    public ResponseEntity<PlanClassement> findByLibelleAndParent(@PathVariable String libelle, @PathVariable Long parentId) {
        PlanClassement plan = planClassementService.findByLibelleAndParent(libelle, parentId);
        return new ResponseEntity<>(plan, HttpStatus.OK);
    }
    @GetMapping("/parents")
    public List<PlanClassementDto> getParentPlans() {
        planClassementConverter.initList(true);
        List<PlanClassement> plans = planClassementService.getParentPlans();
        return plans.stream()
                .map(planClassementConverter::toDtoNoChildren)
                .collect(Collectors.toList());
    }
    @GetMapping("/counts")
    public int getCountAllPlans() {
        return planClassementRepository.getCountAllPlans();
    }

    @GetMapping("/children/{id}")
    public List<PlanClassementDto> findChildrenByParentId(@PathVariable Long id) {
        planClassementConverter.initList(true);
        List<PlanClassement> plans = planClassementService.findChildrenByParentId(id);
        return plans.stream()
                .map(planClassementConverter::toDtoNoChildren)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanClassement> updatePlanClassement(@PathVariable Long id, @RequestBody PlanClassementDto planClassementDTO) {
        PlanClassement updatedPlan = planClassementService.updatePlanClassement(id, planClassementDTO);
        return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
    }
    @PutMapping("archiver/{id}")
    public ResponseEntity<PlanClassement> archiverPlanClassement(@PathVariable Long id) {
        PlanClassement updatedPlan = planClassementService.archiverPlanClassement(id);
        return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
    }
    @PutMapping("restaurer/{id}")
    public ResponseEntity<PlanClassement> restaurerPlanClassement(@PathVariable Long id) {
        PlanClassement updatedPlan = planClassementService.restaurerPlanClassement(id);
        return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlanClassement(@PathVariable Long id) {
        try {
            planClassementService.deletePlanClassement(id);
            return new ResponseEntity<>("Plan de classement supprimé avec succès", HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Impossible de supprimer un plan avec des enfants", HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("Plan de classement non trouvé", HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/list")
    public ResponseEntity<List<PlanClassement>> getPlansList() {
        List<PlanClassement> plans = planClassementService.getPlansList();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }
    @GetMapping("/list/no-archive")
    public ResponseEntity<List<PlanClassementSummaryDto>> getPlansNonArchiveList() {
        List<PlanClassementSummaryDto> plans = planClassementService.getPlansNonArchiveList();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }
    @GetMapping("/libelle/{libelle}")
    public ResponseEntity<List<PlanClassement>> getPlanByLibelle(@PathVariable String libelle) {
        List<PlanClassement> plans = planClassementService.findByLibelle(libelle);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/search/{libelle}")
    public List<PlanClassementDto> searchPlanClassementByLibelle(@PathVariable String libelle) {
        return planClassementService.searchPlanClassementByLibelleSimple(libelle);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<PlanClassement> getPlanById(@PathVariable String id) {
        Long idPlan = Long.parseLong(id);
        return new ResponseEntity<>(planClassementService.findById(idPlan), HttpStatus.OK);
    }

    @GetMapping("/idChildren/{id}")
    public ResponseEntity<String> getPlanByIdChildren(@PathVariable String id) {
        Long idPlan = Long.parseLong(id);
        return new ResponseEntity<>(planClassementService.findPlanClassementLibelleByIdChildren(idPlan), HttpStatus.OK);
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importFromJson(@RequestParam("file") MultipartFile file) {
        try {
            planClassementService.importFromJson(file);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> exportToJson() {
        try {
            String json = planClassementService.exportToJson();
            byte[] buf = json.getBytes();
            ByteArrayResource resource = new ByteArrayResource(buf);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=plan_classement.json")
                    .contentType(MediaType.parseMediaType("application/json"))
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

