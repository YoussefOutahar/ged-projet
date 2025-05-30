package ma.sir.ged.ws.facade.admin.doc;

import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.bean.core.doc.Model;
import ma.sir.ged.service.facade.admin.doc.ModelAdminService;
import ma.sir.ged.ws.dto.AuditDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/model")
public class ModelController {
    @Autowired
    private ModelAdminService service;

    @PostMapping
    public ResponseEntity<Model> create(@RequestBody Model model) {
        return new ResponseEntity<>(service.saveModel(model), HttpStatus.CREATED);
    }
    @PutMapping
    public ResponseEntity<Model> update(@RequestBody Model model) {
        return new ResponseEntity<>(service.saveModel(model), HttpStatus.CREATED);
    }
    @GetMapping()
    public ResponseEntity<List<Model>> getAll() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }
    @GetMapping("/{libelle}")
    public ResponseEntity<Model> getAllActions(@PathVariable String libelle) {
        return new ResponseEntity<>(service.findModelByLibelle(libelle), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteModelById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Model with ID " + id + " deleted successfully");
    }
}
