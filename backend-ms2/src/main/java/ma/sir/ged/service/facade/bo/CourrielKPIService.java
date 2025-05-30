package ma.sir.ged.service.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import ma.sir.ged.bean.core.bureauOrdre.enums.*;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielHistoryRepository;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielConverter;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielHistoryConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
public class CourrielKPIService {
    @Autowired
    private CourrielsRepository courrielsRepository;

    @Autowired
    private CourrielConverter courrielConverter;

    @Autowired
    CourrielHistoryConverter courrielHistoryConverter;

    @Autowired
    private CourrielHistoryRepository courrielHistoryRepository;

    public Long count() {
        return courrielsRepository.count();
    }

    public Long countByDeleted(boolean deleted) {
        return courrielsRepository.countByDeleted(deleted);
    }

    public long countCourrielCloture() {
        return courrielsRepository.countByEtatAvancementAndDeleted(CourrielBoEtatAvancement.TERMINE, false);
    }

    public long countCourrielEnAttent() {
        List<CourrielBo> courriel = courrielsRepository.findAllByDeletedOrderByUpdatedOnDesc(false);

        long count = 0;

        for (CourrielBo courrielBo : courriel) {
            if (Objects.nonNull(courrielBo.getIntervenants())) {
                AtomicBoolean isEnAttent = new AtomicBoolean(true);
                courrielBo.getIntervenants().forEach(intervenant -> {
                    if (!(intervenant.getStatut() == StatutIntervention.EN_ATTENTE)) {
                        isEnAttent.set(false);
                    }
                });
                if (isEnAttent.get()) {
                    count++;
                }
            }
        }

        return count;
    }

    public long countCourrielEnCours() {
        return courrielsRepository.countByEtatAvancementAndDeleted(CourrielBoEtatAvancement.EN_COURS, false);
    }

    public long countCourrielBlocke() {
        return courrielsRepository.countByEtatAvancementAndDeleted(CourrielBoEtatAvancement.REJETE, false);
    }

    public Map<LocalDate, Long> countTimeline() {
        List<CourrielBo> courriel = courrielsRepository.findAll();

        return courriel.stream()
                .filter(courrielBo -> courrielBo.getDateCreation() != null)
                .collect(Collectors.groupingBy(courrielBo -> courrielBo.getDateCreation().toLocalDate(), Collectors.counting()));
    }

    public long countByEtatAvancement(CourrielBoEtatAvancement etatAvancement){
        return courrielsRepository.countByEtatAvancementAndDeleted(etatAvancement,false);
    }

    public long countByVoieEnvoi(VoieEnvoi voieEnvoi){
        return courrielsRepository.countByVoieEnvoiAndDeleted(voieEnvoi,false);
    }

    public long countByType(TypeCourriel type){
        return courrielsRepository.countByTypeAndDeleted(type,false);
    }

    public long countByPriorite(CourrielBoPriorite priorite){
        return courrielsRepository.countByPrioriteAndDeleted(priorite,false);
    }

    public List<CourrielDto> getRecentCourriels() {
        PageRequest topTen = PageRequest.of(0, 10);
        List<CourrielBo> recentCourriels = courrielsRepository.findTop10ByOrderByCreatedDateDesc(topTen);
        return recentCourriels.stream().map(courrielConverter::toDto).collect(Collectors.toList());
    }

    public List<CourrielHistory> getHistoryCourriels() {
        PageRequest topTen = PageRequest.of(0, 10);
        List<CourrielHistory> courrielHistories = courrielHistoryRepository.findTop10ByOrderByActionDateDesc(topTen);
        return courrielHistories;
    }
}
