package ma.sir.ged.ws.facade.admin.organigramme;

import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import ma.sir.ged.bean.history.PlanClassementIndexElementHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexElementCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexElementHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementIndexElementService;
import ma.sir.ged.ws.converter.PlanClassementIndexElementConverter;
import ma.sir.ged.ws.dto.PlanClassementIndexElementDto;
import ma.sir.ged.ws.dto.summary.PlanClassementIndexElementSummaryDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/planClassementIndexElement/")
public class PlanClassementIndexElementRestAdmin extends AbstractController<PlanClassementIndexElement, PlanClassementIndexElementDto, PlanClassementIndexElementHistory, PlanClassementIndexElementCriteria, PlanClassementIndexElementHistoryCriteria, PlanClassementIndexElementService, PlanClassementIndexElementConverter> {

    @Autowired
    private PlanClassementIndexElementConverter planClassementIndexElementConverter;
    public PlanClassementIndexElementRestAdmin(PlanClassementIndexElementService service, PlanClassementIndexElementConverter converter) {
        super(service, converter);
    }

    @Operation(summary = "Finds a list of all planClassementIndexElement")
    @GetMapping
    public ResponseEntity<List<PlanClassementIndexElementDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds a planClassementIndexElement by id")
    @GetMapping("id/{id}")
    public ResponseEntity<PlanClassementIndexElementDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }


    @Operation(summary = "Search a planClassement by indexElement")
    @GetMapping("search/{value}")
    public ResponseEntity<List<PlanClassement>> searchPlanClassementByIndexElement(@PathVariable String value) throws Exception {
        return ResponseEntity.ok(service.searchPlanClassementByIndexElement(value));
    }

    @Operation(summary = "Saves the specified planClassementIndexElement")
    @PostMapping
    public ResponseEntity<PlanClassementIndexElementDto> save(@RequestBody PlanClassementIndexElementDto dto) throws Exception {
        return super.save(dto);
    }
    @Operation(summary = "Saves the specified planClassementIndexElement")
    @PostMapping("summary")
    public ResponseEntity<PlanClassementIndexElementDto> saveSummary(@RequestBody PlanClassementIndexElementSummaryDto dto) throws Exception {
        planClassementIndexElementConverter.init(true);
        return super.save(planClassementIndexElementConverter.toDto(planClassementIndexElementConverter.toItem(dto)));
    }

    @Operation(summary = "Deletes the specified planClassementIndexElement by id")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }

    @Operation(summary = "Update a planClassementIndexElement")
    @PutMapping
    public ResponseEntity<PlanClassementIndexElementDto> update(@RequestBody PlanClassementIndexElementDto dto) throws Exception {
        return super.update(dto);
    }
    @GetMapping("index/{id}")
    public ResponseEntity<List<PlanClassementIndexElement>> getIndexByPlan(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(service.getPlanIndexElemenetByplanClassement(id));
    }


}
