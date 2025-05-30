package ma.sir.ged.ws.facade.admin.dashboard;

import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.service.facade.admin.dashbord.IDashboardService;
import ma.sir.ged.ws.dto.dashboard.AdminEntityStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.AdminEntityStatsResponseDTO;
import ma.sir.ged.ws.dto.dashboard.DocumentStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.DocumentStatsResponseDTO;
import ma.sir.ged.ws.dto.dashboard.UserStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.UserStatsResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard/")
public class DashboardController {

    private final IDashboardService service;

    public DashboardController(IDashboardService service) {
        this.service = service;
    }

    @GetMapping("/utilisateur")
    @Operation(summary = "Get the stats by users and role")
    public ResponseEntity<UserStatsResponseDTO> getUserStatsByRole(){
        List<UserStatsDetailDTO> userStatsDetailList = service.getUserStatsDetailList();
        Long total = service.countUsers();
        UserStatsResponseDTO response = new UserStatsResponseDTO(total, userStatsDetailList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/entite-administrative")
    @Operation(summary = "Get the stats by administrative entity and by type of administrative entity")
    public ResponseEntity<AdminEntityStatsResponseDTO> getEntiteAdministrativeStats(@RequestParam(name = "type", required = false, defaultValue = "") String typeEntite){
        List<AdminEntityStatsDetailDTO> adminEntityStatsDetailList = service.getAdminEntityStatsDetailList(typeEntite);
        Long total = adminEntityStatsDetailList.stream().map(AdminEntityStatsDetailDTO::getCount).reduce(0L, Long::sum);
        AdminEntityStatsResponseDTO response = new AdminEntityStatsResponseDTO(total, adminEntityStatsDetailList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/documents-by-users")
    @Operation(summary = "Get the stats of documents by user")
    public ResponseEntity<DocumentStatsResponseDTO> getDocumentStatsByUser(@RequestParam(required = false, defaultValue = "") String username){

        List<DocumentStatsDetailDTO> documentStatDetailList = service.getDocumentStatDetailListByUser(username);
        DocumentStatsResponseDTO response = new DocumentStatsResponseDTO(service.sumAllCounts(documentStatDetailList), documentStatDetailList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/documents-by-entite-administrative")
    @Operation(summary = "Get the stats of documents by administrative entite")
    public ResponseEntity<DocumentStatsResponseDTO> getDocumentStatsByEntite(@RequestParam(name = "entite", required = false, defaultValue = "") String codeEntite){

        List<DocumentStatsDetailDTO> documentStatDetailList = service.getDocumentStatDetailListByEntiteAdministrative(codeEntite);
        DocumentStatsResponseDTO response = new DocumentStatsResponseDTO((long) documentStatDetailList.size(), documentStatDetailList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
