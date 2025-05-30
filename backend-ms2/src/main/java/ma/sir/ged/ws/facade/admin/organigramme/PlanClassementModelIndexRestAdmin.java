package ma.sir.ged.ws.facade.admin.organigramme;


import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.bean.history.PlanClassementModelIndexHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementModelIndexCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementModelIndexHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementModelIndexService;
import ma.sir.ged.ws.converter.PlanClassementModelIndexConverter;
import ma.sir.ged.ws.dto.PlanClassementModelIndexDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/planClassementModelIndex/")
public class PlanClassementModelIndexRestAdmin extends AbstractController<PlanClassementModelIndex, PlanClassementModelIndexDto, PlanClassementModelIndexHistory, PlanClassementModelIndexCriteria, PlanClassementModelIndexHistoryCriteria, PlanClassementModelIndexService, PlanClassementModelIndexConverter> {

    public PlanClassementModelIndexRestAdmin(PlanClassementModelIndexService service, PlanClassementModelIndexConverter converter) {
        super(service, converter);
    }

    @Operation(summary = "Finds a list of all planClassementModelIndex")
    @GetMapping
    public ResponseEntity<List<PlanClassementModelIndexDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds a planClassementModelIndex by id")
    @GetMapping("id/{id}")
    public ResponseEntity<PlanClassementModelIndexDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }

    @Operation(summary = "Saves the specified planClassementModelIndex")
    @PostMapping
    public ResponseEntity<PlanClassementModelIndexDto> save(@RequestBody PlanClassementModelIndexDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Deletes the specified planClassementModelIndex by id")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }
    @GetMapping("/model/{modelId}")
    public ResponseEntity<List<PlanClassementIndex>> getPlanClassementIndicesByModelId(@PathVariable Long modelId) {
        List<PlanClassementIndex> indexs = service.findByPlanClassementModelId(modelId);
        return ResponseEntity.ok(indexs);
    }

    @Operation(summary = "Update a planClassementModelIndex")
    @PutMapping
    public ResponseEntity<PlanClassementModelIndexDto> update(@RequestBody PlanClassementModelIndexDto dto) throws Exception {
        return super.update(dto);
    }

}
