package ma.sir.ged.service.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielHistoryRepository;
import ma.sir.ged.utils.pdfUtils.PdfUtils;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourrielHistoryService {

    @Autowired
    private CourrielHistoryRepository courrielHistoryRepository;

    @Autowired
    private CourrielService courrielBoService;

    public List<CourrielHistory> getAll() {
        return courrielHistoryRepository.findAll();
    }

    public List<CourrielHistory> getAllByCourrielId(Long id) {
        return courrielHistoryRepository.findByCourrielId(id);
    }

    public CourrielHistory save(CourrielHistory courrielHistory) {
        return courrielHistoryRepository.save(courrielHistory);
    }

    public CourrielHistory registerHistoryEntry(CourrielBo courrielBo, String message, HistoryEntryType type) {
        CourrielHistory courrielHistory = new CourrielHistory();
        courrielHistory.setMessage(message);
        courrielHistory.setCourriel(courrielBo);
        courrielHistory.setType(type);
        courrielHistory.setInitiator((Utilisateur) SecurityUtil.getCurrentUser());
        courrielHistory.setDateAction(LocalDateTime.now());
        return save(courrielHistory);
    }

    public CourrielHistory registerIntervenantHistoryEntry(CourrielBo courriel, IntervenantsCourriel intervenantsCourriel, HistoryEntryType type){
        CourrielHistory courrielHistory = new CourrielHistory();
        courrielHistory.setMessage("Une intervention a été ajouté");
        courrielHistory.setIntervenant(intervenantsCourriel);
        courrielHistory.setType(type);
        courrielHistory.setInitiator((Utilisateur) SecurityUtil.getCurrentUser());
        courrielHistory.setDateAction(LocalDateTime.now());
        courrielHistory.setCourriel(courriel);
        return save(courrielHistory);
    }

    public CourrielHistory update(CourrielHistory courrielHistory) {
        if(courrielHistory.getId() == null) {
            throw new IllegalArgumentException("Cannot update entity with null ID");
        }

        CourrielHistory existingCourrielHistory = courrielHistoryRepository.findById(courrielHistory.getId())
                .orElseThrow(() -> new IllegalArgumentException("CourrielHistory not found"));

        existingCourrielHistory.setMessage(courrielHistory.getMessage());
        existingCourrielHistory.setDateAction(courrielHistory.getDateAction());
        existingCourrielHistory.setCourriel(courrielHistory.getCourriel());

        return courrielHistoryRepository.save(courrielHistory);
    }

    public void deleteById(Long id) {
        courrielHistoryRepository.deleteById(id);
    }

    public ByteArrayOutputStream generatePdf(Long courrielId) {
        List<CourrielHistory> courrielHistories = getAllByCourrielId(courrielId);
        CourrielBo courrielBo = courrielBoService.getCourrielById(courrielId);

        return PdfUtils.generateCourrielHistoryPdf(courrielBo, courrielHistories);
    }
}
