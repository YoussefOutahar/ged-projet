package ma.sir.ged.ws.facade.admin.organigramme;


import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.bean.core.organigramme.PlanClassementModel;
import ma.sir.ged.bean.history.PlanClassementModelHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementModelCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementModelHistoryCriteria;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementModelService;
import ma.sir.ged.ws.converter.PlanClassementModelConverter;
import ma.sir.ged.ws.dto.PlanClassementModelDto;
import ma.sir.ged.zynerator.controller.AbstractController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/planClassementModel/")
public class PlanClassementModelRestAdmin extends AbstractController<PlanClassementModel, PlanClassementModelDto, PlanClassementModelHistory, PlanClassementModelCriteria, PlanClassementModelHistoryCriteria, PlanClassementModelService, PlanClassementModelConverter> {

    @Autowired
    private PlanClassementModelService planClassementModelService;

    public PlanClassementModelRestAdmin(PlanClassementModelService service, PlanClassementModelConverter converter) {
        super(service, converter);
    }

    @Operation(summary = "Finds a list of all planClassementModel")
    @GetMapping
    public ResponseEntity<List<PlanClassementModelDto>> findAll() throws Exception {
        return super.findAll();
    }

    @Operation(summary = "Finds a planClassementModel by id")
    @GetMapping("id/{id}")
    public ResponseEntity<PlanClassementModelDto> findById(@PathVariable Long id, String[] includes, String[] excludes) throws Exception {
        return super.findById(id, includes, excludes);
    }

    @Operation(summary = "Saves the specified planClassementModel")
    @PostMapping
    public ResponseEntity<PlanClassementModelDto> save(@RequestBody PlanClassementModelDto dto) throws Exception {
        return super.save(dto);
    }

    @Operation(summary = "Create a planClassementModel with its model-indexs")
    @PostMapping("create")
    public ResponseEntity<PlanClassementModelDto> create(@RequestBody PlanClassementModelDto dto) throws Exception {
        return ResponseEntity.ok(planClassementModelService.createWithIndexs(dto));
    }

    @Operation(summary = "Deletes the specified planClassementModel by id")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        return super.deleteById(id);
    }

    @Operation(summary = "Delete the specified Model and its associated indexs")
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteModel(@PathVariable Long id) {
        return ResponseEntity.ok(planClassementModelService.deleteModelAndAssociatedList(id));
    }

    @Operation(summary = "Update a planClassementModel")
    @PutMapping
    public ResponseEntity<PlanClassementModelDto> update(@RequestBody PlanClassementModelDto dto) throws Exception {
        return super.update(dto);
    }

    @Operation(summary = "Update a planClassementModel with its indexa")
    @PutMapping("withIndexs")
    public ResponseEntity<PlanClassementModelDto> updateWithIndexs(@RequestBody PlanClassementModelDto dto) throws Exception {
        return ResponseEntity.ok(planClassementModelService.upddateWithIndexs(dto));
    }
}
