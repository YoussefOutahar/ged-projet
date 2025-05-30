package ma.sir.ged.service.facade.admin.doc;

import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.ws.dto.AuditDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AuditAdminService {
    Audit create(AuditDto auditDto);
    Audit saveAudit(Long documentId, String action);
    List<Audit> getAll();
    Page<Audit> getAll(Pageable pageable);
    List<Audit> findAuditByDocument(Long idDocument);
    List<Audit> findAuditByUtilisateur(Long idUtilisateur);
    List<Audit> findAuditByAction(String action);
    int deleteByDocumentId(Long id);
    List<String> returnActions();
    List<Map<String, Object>> getUsersAndDocumentsConsultedMoreThanTenTimes();
    List<Map<String, Map<String, Integer>>> getAuditStats();

}
