package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.ArchiveYears;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArchiveYearsDao extends AbstractRepository<ArchiveYears, Long> {
    @Query("SELECT d.year FROM ArchiveYears d ORDER BY d.year DESC ")
    List<Integer> findAllYear();



}
