package ma.sir.ged.service.facade.admin.dashbord;

import com.itextpdf.text.DocumentException;
import ma.sir.ged.dao.specification.core.ProductionGlobal;
import ma.sir.ged.ws.dto.dashboard.AdminEntityStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.DocumentStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.UserStatsDetailDTO;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface IDashboardService {
    List<UserStatsDetailDTO> getUserStatsDetailList();
    Long countUsers();
    List<AdminEntityStatsDetailDTO> getAdminEntityStatsDetailList(String typeEntite);
    List<DocumentStatsDetailDTO> getDocumentStatDetailListByUser(String username);
    List<DocumentStatsDetailDTO> getDocumentStatDetailListByEntiteAdministrative(String entity);
    Long sumAllCounts(List<DocumentStatsDetailDTO> statistics);
    List<ProductionGlobal> countDocumentsGroupByPlanClassement(String startDate, String endDate);
    byte[] exportDocumentsGlobalProductionToPdf(List<ProductionGlobal> productionGlobal,String startDate, String endDate) throws DocumentException, IOException;
    String convertPDFToBase62(List<ProductionGlobal> productionGlobalList, String startDateString, String endDateString) throws DocumentException, IOException;
}