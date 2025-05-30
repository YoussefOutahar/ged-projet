package ma.sir.ged.dao.facade.core.parapheur;

import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParapheurRepository extends AbstractRepository<ParapheurBo, Long> {
    @Query("SELECT item FROM ParapheurBo item where item.deleted = false ")
    List<ParapheurBo> findAllUndeleted ();

    List<ParapheurBo> findAllByOrderByCreatedOnDesc();

    List<ParapheurBo> findAllByUtilisateurIdOrderByCreatedOnDesc (Long id);

    List<ParapheurBo> findAllByUtilisateurs_IdOrderByCreatedOnDesc(Long id);

    @Query("SELECT distinct p from ParapheurBo p join p.documents d  left join p.utilisateurs u where p.deleted = false and ( p.title LIKE %:searchKeyWord% or d.reference LIKE %:searchKeyWord%  ) and (u.id = :id or p.utilisateur.id = :id) order by p.createdOn desc")
    Page<ParapheurBo> findAllByUserNotAdminNotDeletedOrderByCreatedOnDesc(@Param("id") Long id, @Param("searchKeyWord") String searchKeyWord, Pageable pageable);

    @Query(value = "SELECT `documents` FROM `parapheur_bo_documents`", nativeQuery = true)
    List<Long> findAllParapheursDocuments();
    List<ParapheurBo> findByTitleContaining (String title);
    @Query(value = "SELECT documents FROM parapheur_bo_documents where parapheur_bo_id =:parapheurBoId", nativeQuery = true)
    List<Long> findDocumentsIdByParapeur(@Param("parapheurBoId") Long parapheurBoId);
    List<ParapheurBo> findByWorkflowId(Long workflowId);

    @Query("SELECT item.fichParaph.id FROM ParapheurBo item WHERE item.id = :parapheurBoId")
    Long findFichParaphIdByParapheurBoId(@Param("parapheurBoId") Long parapheurBoId);

    boolean existsByTitle(String title);

    @Query("SELECT distinct p FROM ParapheurBo p left join p.documents d WHERE p.deleted = false and ( p.title LIKE %:searchKeyWord% or d.reference LIKE %:searchKeyWord%  )   order by p.createdOn desc")
    Page<ParapheurBo> findAllByDeletedOrderByCreatedOnDesc(@Param("searchKeyWord") String searchKeyWord,Pageable pageable);

    @Query("SELECT distinct p from ParapheurBo p left join p.documents d where p.deleted = false and p.parapheurEtat = :etat  and ( p.title LIKE %:searchKeyWord% or d.reference LIKE %:searchKeyWord%  ) order by p.createdOn desc")
    Page<ParapheurBo> findAllUnsignedNotDeleted(@Param("searchKeyWord") String searchKeyWord, @Param("etat")ParapheurEtat etat, Pageable pageable);

    @Query("SELECT distinct p from ParapheurBo p left join p.documents d left join p.utilisateurs intervenant where p.deleted = false and p.parapheurEtat = :etat  and (intervenant.id = :userId or p.utilisateur.id = :userId) and ( p.title LIKE %:searchKeyWord% or d.reference LIKE %:searchKeyWord%  ) order by p.createdOn desc")
    Page<ParapheurBo> findAllByUserIdNotAdminNotDeletedUnsigned(@Param("userId") Long userId,@Param("searchKeyWord") String searchKeyWord, @Param("etat")ParapheurEtat etat, Pageable pageable);

    @Query("SELECT distinct p from ParapheurBo p left join p.documents d where p.deleted = false and p.parapheurEtat = :etat and ( p.title LIKE %:searchKeyWord% or d.reference LIKE %:searchKeyWord%  )" +
            "order by p.createdOn desc")
    Page<ParapheurBo> findAllSignedNotDeleted(@Param("searchKeyWord") String searchKeyWord,@Param("etat")ParapheurEtat etat ,Pageable pageable);

    @Query("SELECT distinct p from ParapheurBo p left join p.documents d left join p.utilisateurs intervenant where p.deleted = false and p.parapheurEtat = :etat and (intervenant.id = :userId or p.utilisateur.id = :userId) and ( p.title LIKE %:searchKeyWord% or d.reference LIKE %:searchKeyWord%  )" +
            "order by p.createdOn desc")
    Page<ParapheurBo> findAllByUserIdNotAdminNotDeletedSigned(@Param("userId") Long userId,@Param("searchKeyWord") String searchKeyWord, @Param("etat")ParapheurEtat etat , Pageable pageable);

    List<ParapheurBo> findByWorkflow(Workflow workflow);

    @Query(value = "SELECT p.* FROM parapheur_bo p JOIN parapheur_bo_documents pd ON p.id = pd.parapheur_bo_id WHERE pd.documents = :documentId", nativeQuery = true)
    List<ParapheurBo> findByDocumentsId(@Param("documentId") Long documentId);
}
