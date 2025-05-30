package ma.sir.ged.ws.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.EtablissementBo;
import ma.sir.ged.service.facade.bo.EtablissementService;
import ma.sir.ged.ws.dto.BureauOrdre.EtablissementDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etablissements")
public class EtablissementController {

    @Autowired
    private EtablissementService etablissementBoService;

    @GetMapping
    public List<EtablissementDto> getAllEtablissements_notDeleted() {
        List<EtablissementDto> etablissements = etablissementBoService.getAllEtablissements_notDeleted();
        return etablissements;
    }

    @GetMapping("/{id}")
    public EtablissementDto getEtablissementById(@PathVariable Long id) {
        return etablissementBoService.getEtablissementById(id);
    }

    @GetMapping("nom/{nom}")
    public EtablissementDto getEtablissementByNom(@PathVariable String nom) {
        return etablissementBoService.getEtablissementByNom(nom);
    }

    @PostMapping
    public ResponseEntity<EtablissementBo> createEtablissement(@RequestBody EtablissementDto etablissement) {
        EtablissementBo createdEtablissement = etablissementBoService.createEtablissement(etablissement);
        return new ResponseEntity<>(createdEtablissement, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public EtablissementDto updateEtablissement(@PathVariable Long id, @RequestBody EtablissementDto etablissement) {
       return etablissementBoService.updateEtablissement(id, etablissement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtablissement(@PathVariable Long id) {
        etablissementBoService.deleteEtablissement(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }}
