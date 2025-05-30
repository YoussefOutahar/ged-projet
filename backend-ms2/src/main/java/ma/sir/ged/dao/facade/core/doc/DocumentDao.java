package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.ArchiveFinal;
import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.dao.specification.core.ProductionGlobal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import ma.sir.ged.bean.core.doc.Document;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface DocumentDao extends AbstractRepository<Document,Long>  {

    @Query("SELECT d FROM Document d WHERE d.content LIKE %:keyword%")
    List<Document> findByContentContaining(@Param("keyword") String keyword);
    List<Document> findByIdIn(List<Long> documentIds);
    @Query("SELECT d.id FROM ArchiveFinal d WHERE YEAR(d.uploadDate) = :year")
    List<Long> findArchiveIdsByYear(@Param("year") Integer year);
   @Query("SELECT d FROM Document d WHERE d.dateArchivageIntermediaire BETWEEN :now AND :inOneMonth AND d.archive = false")
   List<Document> findDocumentsApproachingIntermediateArchiveDate(@Param("now") LocalDateTime now, @Param("inOneMonth") LocalDateTime inOneMonth);

 @Query("SELECT d FROM Document d WHERE d.archive = true AND d.dateArchivageIntermediaire BETWEEN :oneMonthAgo AND :now  ")
 List<Document> findDocumentsArchiveeDernierement(@Param("oneMonthAgo") LocalDateTime oneMonthAgo, @Param("now") LocalDateTime now);

   @Query("SELECT d FROM Document d JOIN d.planClassement p WHERE d.dateArchivageFinale BETWEEN :now AND :inOneMonth AND d.archive = true AND p.archivageType= 0")
   List<Document> findDocumentsApproachingFinaleArchiveDate(@Param("now") LocalDateTime now, @Param("inOneMonth") LocalDateTime inOneMonth );

   @Query("SELECT d FROM Document d JOIN d.planClassement p WHERE d.dateArchivageFinale BETWEEN :startDate AND :endDate AND d.archive = true AND p.archivageType = 1")
   List<Document> findDocumentsApproachingDestruction(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);



    @Query("SELECT d FROM Document d WHERE d.archivable = true and d.archive = true ")
    List<Document> DocumentsArchiver();

    @Query("SELECT d FROM Document d WHERE d.archive = true AND d.deleted = false AND YEAR(d.uploadDate) = :year")
    List<Document> findDocumentsByYear(@Param("year") Integer year);
    Document findByReferenceAndDeletedIsFalse(String reference);
    @Query("SELECT DISTINCT YEAR(d.createdOn) FROM Document d WHERE d.archive = false AND d.deleted = false ORDER BY YEAR(d.createdOn) DESC ")
    List<Integer> findDistinctYears();
    @Modifying
    @Query("UPDATE Document d SET d.archive = true  WHERE d.id = :id and d.archive = false ")
    void archiveAssociatedDocument(@Param("id") Long id);
    @Modifying
    @Query("UPDATE Document d SET d.archive = false WHERE d.id = :id")
    void desarchiveAssociatedDocument(@Param("id") Long id);


    @Query("SELECT new ma.sir.ged.dao.specification.core.ProductionGlobal(d.planClassement.libelle, COUNT(d), COUNT(di)) FROM Document d " +
            "LEFT JOIN d.documentIndexElements di " +
            "WHERE d.createdOn  >= :startDate AND d.createdOn  <= :endDate " +
            "GROUP BY d.planClassement.libelle")
    List<ProductionGlobal> countDocumentsGroupByPlanClassement(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.reference = :reference")
    int deleteByReference(@Param("reference") String reference);
    @Modifying
    @Query("UPDATE Document d SET d.qualityFlag = true WHERE d.id = :id")
    void updateQualityFlagById(@Param("id") Long id);
    @Modifying
    @Query("UPDATE Document d SET d.qualityStatus = false WHERE d.id = :id")
    void rejectQualityStatusById(@Param("id") Long id);
    @Modifying
    @Query("UPDATE Document d SET d.qualityStatus = true WHERE d.id = :id")
    void updateQualityStatusById(@Param("id") Long id);
    @Modifying
    @Query("UPDATE Document d SET d.locked = true WHERE d.id = :id")
    void lockDocumentById(@Param("id") Long id);
    @Modifying
    @Query("UPDATE Document d SET d.locked = false WHERE d.id = :id")
    void unlockDocumentById(@Param("id") Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.id = :id")
    void deleteById(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = false WHERE d.id = :id")
    void restoreById(Long id);
    List<Document> findByDocumentTypeIdAndDeletedIsFalse(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.documentType.id = :id")
    int deleteByDocumentTypeId(@Param("id") Long id);
    long countByDocumentTypeIdAndDeletedIsFalse(Long id);
    List<Document> findByDocumentStateIdAndDeletedIsFalse(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.documentState.id = :id")
    int deleteByDocumentStateId(@Param("id") Long id);
    int countByDocumentStateIdAndDeletedIsFalse(Long id);
    List<Document> findByDocumentCategorieIdAndDeletedIsFalse(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.documentCategorie.id = :id")
    int deleteByDocumentCategorieId(@Param("id") Long id);

    long countByDocumentCategorieIdAndDeletedIsFalse(Long id);
    List<Document> findByUtilisateurIdAndDeletedIsFalse(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.utilisateur.id = :id")
    int deleteByUtilisateurId(@Param("id") Long id);
    long countByUtilisateurIdAndDeletedIsFalse(Long id);
    List<Document> findByEntiteAdministrativeIdAndDeletedIsFalse(Long id);
    List<Document> findByPlanClassementIdAndDeletedIsFalse(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.entiteAdministrative.id = :id")
    int deleteByEntiteAdministrativeId(@Param("id") Long id);

    long countByEntiteAdministrativeIdAndDeletedIsFalse(Long id);
    List<Document> findByDocumentCategorieModelIdAndDeletedIsFalse(Long id);
    @Modifying
    @Query("UPDATE Document d SET d.deleted = true WHERE d.documentCategorieModel.id = :id")
    int deleteByDocumentCategorieModelId(@Param("id") Long id);
    long countByDocumentCategorieModelIdAndDeletedIsFalse(Long id);
    @Query("SELECT d FROM Document d WHERE d.id IN :ids AND d.deleted = false ")
    Page<Document> findAllByIds(List<Long> ids, Pageable pageable);

    @Query("SELECT d FROM Document d WHERE d.id IN :ids AND d.deleted = :deleted ")
    Page<Document> findAllByIds(List<Long> ids, Pageable pageable,boolean deleted);

    @Query("SELECT d FROM Document d WHERE d.deleted = false ")
    Page<Document> findAll(Pageable pageable);
    @Query("SELECT d FROM Document d WHERE d.deleted = false ")
    List<Document> findAll();

    @Query("SELECT NEW Document(item.id,item.reference) FROM Document item where item.deleted = false ")
    List<Document> findAllOptimized();
    @Modifying
    @Query("UPDATE Document d SET d.documentState = :documentState WHERE d.id IN :ids")
    void updateStateDocuments(@Param("documentState") DocumentState documentState, @Param("ids") List<Long> ids);
    @Modifying
    @Query("UPDATE Document d SET d.documentState = :documentState WHERE d.id = :id")
    void updateStateDocument(@Param("documentState") DocumentState documentState, @Param("id") Long id);

    @Modifying
    @Query("UPDATE Document d SET d.signed = true WHERE d.id = :id")
    int signDocument(@Param("id") Long id);

   List<Document> findByReferenceContainingOrderByUpdatedOnDesc(String reference);

 @Query("SELECT d FROM Document d JOIN d.documentIndexElements die JOIN die.indexElement ie WHERE ie.code = :libelle AND die.value LIKE %:value%")
 Optional<List<Document>> findByIndexElementValueAndLibelle(@Param("value") String value, @Param("libelle") String libelle);

 @Query("SELECT d from Document d where d.documentSignatureCode = :code")
 Optional<Document> findByDocumentSiagnatureCode(String code);

 boolean existsByReference(String reference);

 @Query("SELECT d FROM Document d WHERE d.deleted = false AND LOWER(d.reference) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdOn DESC")
 Page<Document> findByReferenceContaining(@Param("keyword") String keyword, Pageable pageable);

 @Query("SELECT d FROM Document d WHERE d.deleted = false AND LOWER(d.documentSignatureCode) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdOn DESC")
 Page<Document> findByDocumentSignatureCodeContaining(@Param("keyword") String keyword, Pageable pageable);

 @Query("SELECT DISTINCT d FROM Document d JOIN d.documentIndexElements die WHERE d.deleted = false AND LOWER(die.value) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdOn DESC")
 Page<Document> findByDocumentIndexElementValueContaining(@Param("keyword") String keyword, Pageable pageable);

// @Query("SELECT DISTINCT d FROM Document d JOIN d.workflows w ON d MEMBER OF w.documents WHERE d.deleted = false AND LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdOn DESC")
// Page<Document> findByWorkflowTitleContaining(@Param("keyword") String keyword, Pageable pageable);

 @Query("SELECT DISTINCT d FROM Document d JOIN ParapheurBo p ON d MEMBER OF p.documents WHERE d.deleted = false AND LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdOn DESC")
 Page<Document> findByParapheurTitleContaining(@Param("keyword") String keyword, Pageable pageable);

 @Query("SELECT DISTINCT d FROM Document d JOIN Step s ON d MEMBER OF s.documents WHERE d.deleted = false AND LOWER(s.stepPreset.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdOn DESC")
 Page<Document> findByStepTitleContaining(@Param("keyword") String keyword, Pageable pageable);

}
