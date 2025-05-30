package ma.sir.ged.ws.facade.bo;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.service.facade.bo.RegistreService;
import ma.sir.ged.ws.dto.BureauOrdre.RegistreDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courriel/registre")
@RequiredArgsConstructor
public class RegistreController {

    private final RegistreService registreService;
    @GetMapping
    public ResponseEntity<List<RegistreDto>> getAllRegistres() {
        return  ResponseEntity.ok(registreService.getAllRegistres());
    }

    @PostMapping
    public ResponseEntity<RegistreDto> createRegistre(@RequestBody RegistreDto registreDto) {
        return ResponseEntity.ok(registreService.create(registreDto));
    }

    @PutMapping
    public ResponseEntity<RegistreDto> updateRegistre(@RequestBody RegistreDto registreDto) {
        return ResponseEntity.ok(registreService.update(registreDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistre(@PathVariable Long id) {
        registreService.deleteRegistre(id);
        return ResponseEntity.noContent().build();
    }
}
