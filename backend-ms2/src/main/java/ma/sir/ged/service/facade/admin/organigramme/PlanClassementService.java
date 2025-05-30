package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.ws.dto.PlanClassementDto;
import ma.sir.ged.ws.dto.summary.PlanClassementSummaryDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PlanClassementService {
    PlanClassement savePlanClassement(PlanClassementDto planClassementDTO);
    List<PlanClassement> getAllPlans();
    List<PlanClassement> getParentPlans();
    List<PlanClassement> findChildrenByParentId(Long parentId);
    public List<PlanClassementSummaryDto> getPlansNonArchiveList();
    List<PlanClassement> getPlansList();
    public PlanClassement updatePlanClassement(Long planId, PlanClassementDto planClassementDTO);
    public void deletePlanClassement(Long planId);
    public PlanClassement archiverPlanClassement(Long planId);
    public PlanClassement restaurerPlanClassement(Long planId);
    List<PlanClassement> findByLibelle(String libelle);
    String findPlanClassementLibelleByIdChildren(Long id);
    PlanClassement findById(Long Id );
    PlanClassement createYearlyAndMonthlyPlans(List<PlanClassementDto> planClassementDtoList);
    PlanClassement findByLibelleAndParent(String libelle, Long parentId);
    List<PlanClassementDto> searchPlanClassementByLibelle(String libelle);
    List<PlanClassementDto> searchPlanClassementByLibelleSimple(String libelle);
    void importFromJson(MultipartFile file) throws IOException;
    String exportToJson() throws Exception;
    PlanClassement createOrGetPlan(String libelle, PlanClassement parent);
}
