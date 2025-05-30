package ma.sir.ged.ws.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.PlanClassementBO;
import ma.sir.ged.service.facade.bo.PlanClassementBoService;
import ma.sir.ged.ws.converter.BureauOrdre.PlanClassemementBOConverter;
import ma.sir.ged.ws.dto.BureauOrdre.PlanClassementBODto;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/plan-classement-bo")
public class PlanClassementBOController {
    @Autowired
    private PlanClassementBoService planClassementBoService;

    @Autowired
    private PlanClassemementBOConverter planClassemementBOConverter;

    @GetMapping
    public ResponseEntity<List<PlanClassementBODto>> findAll() {
        List<PlanClassementBO> planClassementBOs = planClassementBoService.findAll();
        List<PlanClassementBODto> planClassementBODtos = new ArrayList<>();
        for (PlanClassementBO planClassementBO : planClassementBOs) {
            planClassementBODtos.add(planClassemementBOConverter.toDto(planClassementBO));
        }
        return ResponseEntity.ok(planClassementBODtos);
    }

    @GetMapping("/parents")
    public ResponseEntity<List<PlanClassementBODto>> findAllParents() {
        List<PlanClassementBO> planClassementBOs = planClassementBoService.findAllParents();
        List<PlanClassementBODto> planClassementBODtos = new ArrayList<>();
        for (PlanClassementBO planClassementBO : planClassementBOs) {
            planClassementBODtos.add(planClassemementBOConverter.toDto(planClassementBO));
        }
        return ResponseEntity.ok(planClassementBODtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanClassementBODto> findById(@PathVariable Long id) {
        PlanClassementBO planClassementBO = planClassementBoService.findById(id);
        return ResponseEntity.ok(planClassemementBOConverter.toDto(planClassementBO));
    }

    @PostMapping
    public ResponseEntity<PlanClassementBODto> save(@RequestBody PlanClassementBODto planClassementBODto) {
        PlanClassementBO planClassementBO = planClassementBoService.save(planClassemementBOConverter.toEntity(planClassementBODto));
        return ResponseEntity.ok(planClassemementBOConverter.toDto(planClassementBO));
    }

    @PutMapping
    public ResponseEntity<PlanClassementBODto> update(@RequestBody PlanClassementBODto planClassementBODto) {
        PlanClassementBO planClassementBO = planClassemementBOConverter.toEntity(planClassementBODto);
        PlanClassementBO updatedPlanClassementBO = planClassementBoService.update(planClassementBO);
        return ResponseEntity.ok(planClassemementBOConverter.toDto(updatedPlanClassementBO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            planClassementBoService.delete(id);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Impossible de supprimer un plan avec des enfants", HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("Plan de classement non trouvé", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Plan de classement supprimé avec succès", HttpStatus.OK);
    }
}
