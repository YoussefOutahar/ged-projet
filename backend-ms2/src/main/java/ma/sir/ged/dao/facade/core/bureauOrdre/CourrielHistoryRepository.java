package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourrielHistoryRepository extends JpaRepository<CourrielHistory, Long> {
    @Query("SELECT c FROM CourrielHistory c WHERE c.courriel.id = ?1")
    List<CourrielHistory> findByCourrielId(Long id);

    @Query("SELECT c FROM CourrielHistory c ORDER BY c.dateAction DESC")
    List<CourrielHistory> findTop10ByOrderByActionDateDesc(Pageable pageable);
}
