package ma.sir.ged.dao.facade.core.bureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.enums.*;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourrielsRepository extends AbstractRepository<CourrielBo, Long> {
    List<CourrielBo> findAllByDeletedOrderByUpdatedOnDesc(boolean deleted);

    Page<CourrielBo> findDistinctByPereIsNullAndDeletedOrderByUpdatedOnDesc(boolean deleted, Pageable pageable);

    Page<CourrielBo> findDistinctByPlanClassementIdAndDeletedAndPereIsNullOrderByUpdatedOnDesc(Long planClassementId, boolean deleted, Pageable pageable);

    @Query("SELECT DISTINCT c FROM CourrielBo c JOIN c.intervenants i JOIN i.responsables r WHERE r.id = :responsableId AND c.pere IS NULL AND c.deleted = :deleted order by c.createdOn desc")
    Page<CourrielBo> findDistinctByResponsableIdAndPereIsNullAndDeletedOrderByUpdatedOnDesc(@Param("responsableId") Long responsableId, @Param("deleted") boolean deleted, Pageable pageable);

    @Query("SELECT DISTINCT c FROM CourrielBo c JOIN c.intervenants i JOIN i.responsables r WHERE c.planClassement.id = :planClassementId AND r.id = :responsableId AND c.deleted = :deleted AND c.pere IS NULL order by c.createdOn desc")
    Page<CourrielBo> findByPlanClassementIdAndResponsableIdAndDeletedAndPereIsNullOrderByUpdatedOnDesc(@Param("planClassementId") Long planClassementId, @Param("responsableId") Long responsableId, @Param("deleted") boolean deleted,Pageable pageable);

    @Query("SELECT COUNT(c) FROM CourrielBo c WHERE c.deleted = :deleted")
    Long countByDeleted(@Param("deleted") boolean deleted);

    @Query("SELECT COUNT(c) FROM CourrielBo c WHERE c.etatAvancement = :etatAvancement AND c.deleted = :deleted")
    Long countByEtatAvancementAndDeleted(@Param("etatAvancement") CourrielBoEtatAvancement etatAvancement,@Param("deleted") boolean deleted);

    @Query("SELECT COUNT(c) FROM CourrielBo c WHERE c.voieEnvoi = :voieEnvoi AND c.deleted = :deleted AND c.deleted = :deleted")
    Long countByVoieEnvoiAndDeleted(@Param("voieEnvoi") VoieEnvoi voieEnvoi,@Param("deleted") boolean deleted);

    @Query("SELECT COUNT(c) FROM CourrielBo c WHERE c.type = :type AND c.deleted = :deleted")
    Long countByTypeAndDeleted(@Param("type") TypeCourriel type,@Param("deleted") boolean deleted);

    @Query("SELECT COUNT(c) FROM CourrielBo c WHERE c.priorite = :priorite AND c.deleted = :deleted")
    Long countByPrioriteAndDeleted(@Param("priorite") CourrielBoPriorite priorite,@Param("deleted") boolean deleted);

    @Query("SELECT DISTINCT c FROM CourrielBo c ORDER BY c.dateCreation DESC")
    List<CourrielBo> findTop10ByOrderByCreatedDateDesc(Pageable pageable);

    List<CourrielBo> findByDeletedAndEtatAvancementAndDateEcheanceBeforeOrderByUpdatedOnDesc(boolean b,CourrielBoEtatAvancement etatAvancement, LocalDateTime localDateTime);

    @Query("SELECT DISTINCT c from CourrielBo c  join c.intervenants i join i.responsables r where c.deleted = :deleted and i.statut in :statuts and r.id = :intervenantId")
    List<CourrielBo> findCourrielNeedingIntervenantAttention(@Param("intervenantId") Long intervenantId, @Param("deleted") boolean deleted, @Param("statuts")StatutIntervention[] statuts);

    @Query("SELECT DISTINCT c FROM CourrielBo c WHERE c.deleted = :deleted AND c.pere is null  AND (c.sujet LIKE %:searchKeyWord% OR c.numeroCourrier LIKE %:searchKeyWord% ) ORDER BY c.updatedOn DESC")
    Page<CourrielBo> findBySearchKeyWord(@Param("deleted") boolean b, @Param("searchKeyWord") String searchKeyWord, PageRequest of);

    @Query("SELECT DISTINCT c FROM CourrielBo c join c.intervenants i join i.responsables r WHERE c.deleted = :deleted AND c.pere is null and r.id = :intervenantId  AND (c.sujet LIKE %:searchKeyWord% OR c.numeroCourrier LIKE %:searchKeyWord% )  ORDER BY c.updatedOn DESC")
    Page<CourrielBo> findBySearchKeyWordAndIntervenantId(@Param("deleted") boolean b, @Param("searchKeyWord") String searchKeyWord, @Param("intervenantId") long intervenantId, Pageable pageable);
    @Query("SELECT DISTINCT c FROM CourrielBo c join c.intervenants i join i.responsables r WHERE c.deleted = :deleted AND c.pere is null and r.id = :intervenantId ORDER BY c.updatedOn DESC")
    List<CourrielBo> findByIntervenantId(@Param("deleted") boolean b, @Param("intervenantId") long intervenantId);
    List<CourrielBo> findByWorkflowId(Long worfklowId);
}
