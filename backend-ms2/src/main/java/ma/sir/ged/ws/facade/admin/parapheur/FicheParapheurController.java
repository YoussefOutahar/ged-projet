package ma.sir.ged.ws.facade.admin.parapheur;

import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurSignersData;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.service.facade.admin.parapheur.FicheParapheurService;
import ma.sir.ged.ws.converter.parapheur.DTOConverter;
import ma.sir.ged.ws.facade.admin.parapheur.Requests.ParapheurCertificateDataDTO;
import ma.sir.ged.ws.facade.admin.parapheur.Requests.ParapheurSignersDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/fiche-parapheurs")
public class FicheParapheurController {

    private final FicheParapheurService ficheParapheurService;
    private final DTOConverter dtoConverter;

    @Autowired
    public FicheParapheurController(FicheParapheurService ficheParapheurService, DTOConverter dtoConverter) {
        this.ficheParapheurService = ficheParapheurService;
        this.dtoConverter = dtoConverter;
    }

    @PostMapping("/{parapheurId}/regen-fiche-parapheur")
    public void regenFicheParapheur(@PathVariable Long parapheurId, @RequestParam(defaultValue = "false") boolean forceRegen) {
        try {
            ficheParapheurService.generateFicheParapheur(parapheurId, null, forceRegen);
        } catch (Exception e) {
            log.error("Error regenerating fiche parapheur", e);
        }
    }

    @GetMapping("/{parapheurId}/certificat-data")
    public ResponseEntity<List<ParapheurCertificateDataDTO>> getCertificateData(@PathVariable Long parapheurId) {
        List<ParapheurCertificateData> certificateDataList = ficheParapheurService.getParapheurCertificateData(parapheurId);
        return ResponseEntity.ok(dtoConverter.convertToDTOList(certificateDataList));
    }

    @GetMapping("/{parapheurId}/signers-data")
    public ResponseEntity<List<ParapheurSignersDataDTO>> getSignersData(@PathVariable Long parapheurId) {
        List<ParapheurSignersData> signersDataList = ficheParapheurService.getParapheurSignersData(parapheurId);
        return ResponseEntity.ok(dtoConverter.convertToSignersDTOList(signersDataList));
    }

    @PostMapping("/{parapheurId}/certificat-data")
    public ParapheurCertificateDataDTO addCertificateData(
            @PathVariable Long parapheurId,
            @RequestBody ParapheurCertificateDataDTO certificateDataDTO) {
        ParapheurCertificateData updatedData = ficheParapheurService.addParapheurCertificateData(parapheurId, dtoConverter.convertToEntity(certificateDataDTO));
        return dtoConverter.convertToDTO(updatedData);
    }

    @PostMapping("/{parapheurId}/signers-data")
    public ParapheurSignersDataDTO addSignersData(
            @PathVariable Long parapheurId,
            @RequestBody ParapheurSignersDataDTO signersDataDTO) {
        ParapheurSignersData updatedData = ficheParapheurService.addParapheurSignersData(parapheurId, dtoConverter.convertToEntity(signersDataDTO));
        return dtoConverter.convertToDTO(updatedData);
    }

    @PutMapping("/{parapheurId}/certificat-data/{certificateDataId}")
    public ParapheurCertificateDataDTO updateCertificateData(
            @PathVariable Long parapheurId,
            @PathVariable Long certificateDataId,
            @RequestBody ParapheurCertificateDataDTO certificateDataDTO) {
        ParapheurCertificateData updatedData = ficheParapheurService.updateParapheurCertificateData(parapheurId, certificateDataId, dtoConverter.convertToEntity(certificateDataDTO));
        return dtoConverter.convertToDTO(updatedData);
    }

    @PutMapping("/{parapheurId}/signers-data/{signersDataId}")
    public ParapheurSignersDataDTO updateSignersData(
            @PathVariable Long parapheurId,
            @PathVariable Long signersDataId,
            @RequestBody ParapheurSignersDataDTO signersDataDTO) {
        ParapheurSignersData updatedData = ficheParapheurService.updateParapheurSignersData(parapheurId, signersDataId, dtoConverter.convertToEntity(signersDataDTO));
        return dtoConverter.convertToDTO(updatedData);
    }

    @DeleteMapping("/{parapheurId}/certificat-data/{certificateDataId}")
    public void deleteCertificateData(@PathVariable Long parapheurId, @PathVariable Long certificateDataId) {
        ficheParapheurService.deleteParapheurCertificateData(parapheurId, certificateDataId);
    }

    @DeleteMapping("/{parapheurId}/signers-data/{signersDataId}")
    public void deleteSignersData(@PathVariable Long parapheurId, @PathVariable Long signersDataId) {
        ficheParapheurService.deleteParapheurSignersData(parapheurId, signersDataId);
    }
}