package ma.sir.ged.ws.facade.admin.organigramme;

import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.history.PlanClassementIndexHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementIndexService;
import ma.sir.ged.ws.converter.PlanClassementIndexConverter;
import ma.sir.ged.ws.dto.PlanClassementIndexDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/planClassementIndex/")
public class PlanClassementIndexRestAdmin extends AbstractController<PlanClassementIndex, PlanClassementIndexDto, PlanClassementIndexHistory, PlanClassementIndexCriteria, PlanClassementIndexHistoryCriteria, PlanClassementIndexService, PlanClassementIndexConverter> {


    public PlanClassementIndexRestAdmin(PlanClassementIndexService service, PlanClassementIndexConverter converter) {
        super(service, converter);
    }

    @Operation(summary = "Finds a list of all planClassementIndex")
    @GetMapping
    public ResponseEntity<List<PlanClassementIndexDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds a planClassementIndex by id")
    @GetMapping("id/{id}")
    public ResponseEntity<PlanClassementIndexDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }

    @Operation(summary = "Saves the specified planClassementIndex")
    @PostMapping
    public ResponseEntity<PlanClassementIndexDto> save(@RequestBody PlanClassementIndexDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Deletes the specified planClassementIndex by id")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }

    @Operation(summary = "Update a planClassementIndex")
    @PutMapping
    public ResponseEntity<PlanClassementIndexDto> update(@RequestBody PlanClassementIndexDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Delete the specified index if it isn't linked to other entities")
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteIndex(@PathVariable Long id) {
        return ResponseEntity.ok(service.deleteIndex(id));
    }


}
