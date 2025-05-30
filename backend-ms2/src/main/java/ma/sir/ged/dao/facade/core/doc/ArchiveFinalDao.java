package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.ArchiveFinal;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ArchiveFinalDao  extends AbstractRepository<ArchiveFinal, Long> {

    @Query("SELECT d FROM ArchiveFinal d WHERE YEAR(d.uploadDate) = :year order by d.uploadDate desc")
    List<ArchiveFinal> findArchiveIdsByYear(@Param("year") Integer year);


    // --------------- To delete
    @Query("SELECT d FROM Document d WHERE d.id IN :ids AND d.deleted = false ")
    Page<ArchiveFinal> findAllByIds(List<Long> ids, Pageable pageable);


    @Query("SELECT a FROM ArchiveFinal a WHERE a.createdOn BETWEEN :oneMonthAgo AND :now ")
    List<ArchiveFinal> findLastArchiveFinale(@Param("oneMonthAgo") LocalDateTime oneMonthAgo, @Param("now") LocalDateTime now);


}
