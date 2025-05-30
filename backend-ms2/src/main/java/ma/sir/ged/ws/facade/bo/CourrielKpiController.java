package ma.sir.ged.ws.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import ma.sir.ged.bean.core.bureauOrdre.enums.CourrielBoEtatAvancement;
import ma.sir.ged.bean.core.bureauOrdre.enums.CourrielBoPriorite;
import ma.sir.ged.bean.core.bureauOrdre.enums.TypeCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.VoieEnvoi;
import ma.sir.ged.service.facade.bo.CourrielHistoryService;
import ma.sir.ged.service.facade.bo.CourrielKPIService;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielHistoryConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielHistoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courriels/kpi")
public class CourrielKpiController {
    @Autowired
    private CourrielKPIService courrielKPIService;

    @Autowired
    CourrielHistoryConverter courrielHistoryConverter;

    @GetMapping("/count")
    public Long count() {
        return courrielKPIService.count();
    }

    @GetMapping("/count/deleted/{deleted}")
    public Long countDeleted(@PathVariable boolean deleted) {
        return courrielKPIService.countByDeleted(deleted);
    }

    @GetMapping("/count/entrants")
    public Long countEntrants() {
        return courrielKPIService.countByType(TypeCourriel.ENTRANT);
    }

    @GetMapping("/count/sortants")
    public Long countSortants() {
        return courrielKPIService.countByType(TypeCourriel.SORTANT);
    }

    @GetMapping("/count/cloture")
    public Long countCloture() {
        return courrielKPIService.countCourrielCloture();
    }

    @GetMapping("/count/non-cloture")
    public Long countNonCloture() {
        return courrielKPIService.countByDeleted(false) - courrielKPIService.countCourrielCloture();
    }

    @GetMapping("/count/en-cours")
    public long countEnCours() {
        return courrielKPIService.countCourrielEnCours();
    }

    @GetMapping("/count/en-attent")
    public Long countEnAttent() {
        return courrielKPIService.countCourrielEnAttent();
    }

    @GetMapping("/count/blocked")
    public Long countBlocke() {
        return courrielKPIService.countCourrielBlocke();
    }

    @GetMapping("/timeline")
    public Map<LocalDate, Long> countTimeline() {
        return courrielKPIService.countTimeline();
    }

    @GetMapping("/count/etatAvancement/{etatAvancement}")
    public Long countByEtatAvancement(@PathVariable String etatAvancement) {
        return courrielKPIService.countByEtatAvancement(CourrielBoEtatAvancement.valueOf(etatAvancement));
    }

    @GetMapping("/count/voieEnvoi/{voieEnvoi}")
    public Long countByVoieEnvoi(@PathVariable String voieEnvoi) {
        return courrielKPIService.countByVoieEnvoi(VoieEnvoi.valueOf(voieEnvoi));
    }

    @GetMapping("/count/type/{type}")
    public Long countByType(@PathVariable String type) {
        return courrielKPIService.countByType(TypeCourriel.valueOf(type));
    }

    @GetMapping("/count/priorite/{priorite}")
    public Long countByPriorite(@PathVariable String priorite) {
        return courrielKPIService.countByPriorite(CourrielBoPriorite.valueOf(priorite));
    }

    @GetMapping("/recent")
    public List<CourrielDto> getRecentCourriels() {
        return courrielKPIService.getRecentCourriels();
    }

    @GetMapping("/history/recent")
    public List<CourrielHistoryDto> getHistory() {
        List<CourrielHistory> histories = courrielKPIService.getHistoryCourriels();
        return Collections.unmodifiableList(histories.stream().map(courrielHistoryConverter::toDto).collect(Collectors.toList()));
    }
}
