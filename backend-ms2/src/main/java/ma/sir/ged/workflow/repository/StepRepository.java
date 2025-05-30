package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.enums.STEP_STATUS;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends JpaRepository<Step,Long> {
    @Query("SELECT s FROM Step s JOIN s.stepPreset sp JOIN sp.destinataires ud WHERE ud.utilisateur.id = :userId")
    List<Step> findStepsByUserId(@Param("userId") Long userId, Sort sort);

    @Query("SELECT s FROM Step s JOIN s.stepPreset sp JOIN sp.destinataires ud WHERE ud.utilisateur.id = :userId AND (s.workflow.title like %:search% OR sp.title like %:search%)")
    Page<Step> findStepsByUserId(@Param("userId") Long userId, Pageable pageable, @Param("search") String search);


    @Query("SELECT s FROM Step s JOIN s.stepPreset sp JOIN sp.destinataires ud WHERE ud.utilisateur.id = :userId AND s.status not in :statusList AND (s.workflow.title like %:search% OR sp.title like %:search%)")
    List<Step> findStepsByUserIdAndStatusNotInList(@Param("userId") Long userId, Sort sort,@Param("statusList") List<STEP_STATUS> statusList, @Param("search") String search);

    @Query("SELECT s FROM Step s JOIN s.stepPreset sp JOIN sp.destinataires ud WHERE ud.utilisateur.id = :userId AND s.status in :statusList AND (s.workflow.title like %:search% OR sp.title like %:search%)")
    List<Step> findStepsByUserIdAndStatusInList(@Param("userId") Long userId, Sort sort,@Param("statusList") List<STEP_STATUS> statusList, @Param("search") String search);



    List<Step> findStepsByWorkflowId(Long id , Sort sort);


}
